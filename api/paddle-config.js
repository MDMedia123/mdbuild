// Hands the checkout page the public values it needs to open Paddle.
//
// These are all safe in a browser — the client token is designed to be public,
// like a Stripe publishable key. Serving them from here rather than hardcoding
// them means switching sandbox to production is an env var change, not a code
// change and redeploy.
//
// It also refuses to hand them over when the database is unreachable. Fulfilment
// writes a purchase row before it can create an account or send a welcome email,
// so with the database down a payment would be taken and nothing delivered. The
// site has already spent two spells in exactly that state. Better to turn a
// customer away for a few minutes than to charge them for nothing.

const { createClient } = require('@supabase/supabase-js');

// Fails fast: this sits in front of the checkout, so it must not make a paying
// customer wait on a long timeout.
const DB_TIMEOUT_MS = 3000;

async function databaseReachable() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('Cannot check the database: Supabase env vars missing');
    return false;
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const check = supabase.from('products').select('id', { count: 'exact', head: true });
    const timeout = new Promise(function (_, reject) {
      setTimeout(function () { reject(new Error('timed out')); }, DB_TIMEOUT_MS);
    });

    const { error } = await Promise.race([check, timeout]);
    if (error) throw new Error(error.message);
    return true;
  } catch (err) {
    console.error('Database unreachable, refusing to open checkout:', err.message);
    return false;
  }
}

module.exports = async function handler(req, res) {
  const clientToken = process.env.PADDLE_CLIENT_TOKEN;
  const priceId = process.env.PADDLE_PRICE_ID_BLUEPRINT;

  if (!clientToken || !priceId) {
    // Reports which variable is absent, never its value, so a misconfiguration
    // can be diagnosed without reading the logs.
    const missing = [];
    if (!clientToken) missing.push('PADDLE_CLIENT_TOKEN');
    if (!priceId) missing.push('PADDLE_PRICE_ID_BLUEPRINT');
    console.error('Paddle not configured, missing:', missing.join(', '));
    return res.status(500).json({ error: 'Payments not configured', missing: missing });
  }

  // Anything other than an explicit 'production' stays in sandbox, so a missing
  // env var can never accidentally take real money.
  const environment = process.env.PADDLE_ENVIRONMENT === 'production'
    ? 'production'
    : 'sandbox';

  // Checked on every request, so the checkout closes within one cache window of
  // the database going away rather than staying open on a stale answer.
  if (!(await databaseReachable())) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({
      error: 'Checkout is briefly unavailable. Please try again in a few minutes.'
    });
  }

  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).json({ clientToken, priceId, environment });
};
