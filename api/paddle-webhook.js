const crypto = require('crypto');
const { fulfillPurchase } = require('../lib/fulfill');

// Paddle signs the timestamp joined to the exact bytes of the body, so Vercel must
// not parse it for us: a re-serialised object produces a different digest.
module.exports.config = {
  api: {
    bodyParser: false
  }
};

// Paddle's own SDK allows 5 seconds. That is tight for a cold-started serverless
// function, and a rejected-but-genuine webhook fails silently, so we allow longer.
// Replay is still bounded, and a replayed event is caught by the duplicate check
// on the purchase reference anyway.
const MAX_SIGNATURE_AGE_SECONDS = 300;

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

// Header looks like: ts=1671552777;h1=eb4d0dc885...
function parseSignatureHeader(header) {
  const parts = {};
  String(header || '').split(';').forEach(function (piece) {
    const [key, value] = piece.split('=');
    if (key && value) parts[key.trim()] = value.trim();
  });
  return { ts: parts.ts, h1: parts.h1 };
}

function verifySignature(rawBody, header, secret) {
  const { ts, h1 } = parseSignatureHeader(header);
  if (!ts || !h1) return { ok: false, reason: 'malformed signature header' };

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(ts));
  if (!Number.isFinite(age) || age > MAX_SIGNATURE_AGE_SECONDS) {
    return { ok: false, reason: `timestamp outside tolerance (${age}s)` };
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${ts}:`)
    .update(rawBody)
    .digest('hex');

  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(h1, 'utf8');
  // Length check first: timingSafeEqual throws on a mismatch.
  const match = a.length === b.length && crypto.timingSafeEqual(a, b);

  return match ? { ok: true } : { ok: false, reason: 'digest mismatch' };
}

function apiBaseUrl() {
  return process.env.PADDLE_ENVIRONMENT === 'production'
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';
}

// transaction.completed carries only a customer_id, so the email comes from here.
// Authoritative: the buyer may have typed a different address in Paddle's checkout
// than the one they gave us.
async function getCustomer(customerId) {
  const response = await fetch(`${apiBaseUrl()}/customers/${encodeURIComponent(customerId)}`, {
    headers: { 'Authorization': `Bearer ${process.env.PADDLE_API_KEY}` }
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error('Customer lookup failed: ' + JSON.stringify(body).slice(0, 200));
  }
  return body.data;
}

module.exports = async function handler(req, res) {
  console.log('Paddle webhook received');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.PADDLE_WEBHOOK_SECRET || !process.env.PADDLE_API_KEY) {
    console.error('Paddle env vars missing', {
      secret: !!process.env.PADDLE_WEBHOOK_SECRET,
      apiKey: !!process.env.PADDLE_API_KEY
    });
    return res.status(500).json({ error: 'Not configured' });
  }

  let rawBody;
  try {
    rawBody = Buffer.isBuffer(req.body) ? req.body : await readRawBody(req);
  } catch (error) {
    console.error('Could not read request body:', error.message);
    return res.status(400).json({ error: 'Bad request' });
  }

  const check = verifySignature(
    rawBody,
    req.headers['paddle-signature'],
    process.env.PADDLE_WEBHOOK_SECRET
  );

  if (!check.ok) {
    console.error('Signature rejected:', check.reason);
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch (error) {
    return res.status(400).json({ error: 'Malformed JSON' });
  }

  console.log('Event:', event.event_type);

  if (event.event_type !== 'transaction.completed') {
    return res.status(200).json({ received: true, ignored: event.event_type });
  }

  try {
    const data = event.data || {};
    const reference = data.id;
    if (!reference) {
      return res.status(400).json({ error: 'No transaction id on event' });
    }

    // Paddle owns the price, so there is no client-supplied amount to distrust —
    // this is simply what was actually charged.
    const totals = (data.details && data.details.totals) || {};
    const amount = Number(totals.grand_total || 0) / 100;

    const customer = await getCustomer(data.customer_id);
    const email = customer && customer.email;
    if (!email) {
      console.error('No email for customer', data.customer_id);
      return res.status(500).json({ error: 'Could not resolve customer email' });
    }

    const custom = data.custom_data || {};
    const name = custom.name || customer.name || email.split('@')[0];

    const result = await fulfillPurchase({
      email: email,
      name: name,
      product: custom.product || 'business-blueprint',
      reference: reference,
      amount: amount,
      provider: 'paddle'
    });

    return res.status(200).json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    console.error('Paddle webhook processing error:', error.message, error.stack);
    return res.status(500).json({ error: 'Processing failed' });
  }
};
