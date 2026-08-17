const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { fulfillPurchase } = require('../lib/fulfill');

// Stripe signs the exact bytes of the request body, so Vercel must not parse it for us.
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

// Returns a trusted event, or throws. Prefers signature verification against the raw
// body; if the body arrived already parsed, re-fetches the event from Stripe instead,
// which an attacker cannot forge.
async function getVerifiedEvent(req) {
  const signature = req.headers['stripe-signature'];

  let raw = req.body;
  if (raw === undefined) {
    raw = await readRawBody(req);
  }

  if (Buffer.isBuffer(raw) || typeof raw === 'string') {
    return stripe.webhooks.constructEvent(raw, signature, process.env.STRIPE_WEBHOOK_SECRET);
  }

  console.warn('Body was pre-parsed; verifying by re-fetching the event from Stripe');
  if (!raw || !raw.id) {
    throw new Error('No event id in request body');
  }
  return stripe.events.retrieve(raw.id);
}

module.exports = async function handler(req, res) {
  console.log('Stripe webhook received');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let event;
  try {
    event = await getVerifiedEvent(req);
    console.log('Verified event:', event.type, event.id);
  } catch (error) {
    console.error('Webhook verification failed:', error.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type !== 'payment_intent.succeeded') {
    return res.status(200).json({ received: true, ignored: event.type });
  }

  try {
    const paymentIntent = event.data.object;
    const { email, name, product } = paymentIntent.metadata || {};

    const result = await fulfillPurchase({
      email: email,
      name: name,
      product: product || 'business-blueprint',
      reference: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      provider: 'stripe'
    });

    return res.status(200).json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    console.error('Webhook processing error:', error.message, error.stack);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};
