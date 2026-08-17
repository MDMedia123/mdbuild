const crypto = require('crypto');
const { fulfillPurchase } = require('../lib/fulfill');
const { PRICES } = require('../lib/prices');

// Paystack signs the exact bytes of the request body, so Vercel must not parse it
// for us: hashing a re-serialised object produces a different digest every time.
module.exports.config = {
  api: {
    bodyParser: false
  }
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function signatureMatches(rawBody, provided) {
  if (!provided) return false;

  const expected = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest('hex');

  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(provided, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Never grant access on the webhook payload alone: ask Paystack what it holds for
// this reference, and check the amount is the one we actually asked for.
async function confirmWithPaystack(reference) {
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: { 'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );

  const body = await response.json();
  if (!response.ok || !body.status) {
    throw new Error('Verify call failed: ' + (body.message || response.status));
  }
  return body.data;
}

module.exports = async function handler(req, res) {
  console.log('Paystack webhook received');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    console.error('PAYSTACK_SECRET_KEY not set');
    return res.status(500).json({ error: 'Not configured' });
  }

  let rawBody;
  try {
    rawBody = Buffer.isBuffer(req.body) ? req.body : await readRawBody(req);
  } catch (error) {
    console.error('Could not read request body:', error.message);
    return res.status(400).json({ error: 'Bad request' });
  }

  if (!signatureMatches(rawBody, req.headers['x-paystack-signature'])) {
    console.error('Signature mismatch, ignoring');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch (error) {
    return res.status(400).json({ error: 'Malformed JSON' });
  }

  console.log('Event:', event.event);

  if (event.event !== 'charge.success') {
    return res.status(200).json({ received: true, ignored: event.event });
  }

  try {
    const reference = event.data && event.data.reference;
    if (!reference) {
      return res.status(400).json({ error: 'No reference on event' });
    }

    const charge = await confirmWithPaystack(reference);

    if (charge.status !== 'success') {
      console.error('Charge not successful on verify:', charge.status);
      return res.status(200).json({ received: true, ignored: charge.status });
    }

    const metadata = charge.metadata || {};
    const sku = metadata.product || 'business-blueprint';
    const expected = PRICES[sku];

    if (!expected || charge.amount < expected.amount) {
      console.error('Amount mismatch', {
        sku: sku,
        paid: charge.amount,
        expected: expected && expected.amount
      });
      return res.status(200).json({ received: true, ignored: 'amount mismatch' });
    }

    const email = charge.customer && charge.customer.email;
    const name = metadata.name || (email ? email.split('@')[0] : 'there');

    const result = await fulfillPurchase({
      email: email,
      name: name,
      product: sku,
      reference: reference,
      amount: charge.amount / 100,
      provider: 'paystack'
    });

    return res.status(200).json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    console.error('Paystack webhook processing error:', error.message, error.stack);
    return res.status(500).json({ error: 'Processing failed' });
  }
};
