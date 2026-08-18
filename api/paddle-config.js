// Hands the checkout page the public values it needs to open Paddle.
//
// These are all safe in a browser — the client token is designed to be public,
// like a Stripe publishable key. Serving them from here rather than hardcoding
// them means switching sandbox to production is an env var change, not a code
// change and redeploy.

module.exports = async function handler(req, res) {
  const clientToken = process.env.PADDLE_CLIENT_TOKEN;
  const priceId = process.env.PADDLE_PRICE_ID_BLUEPRINT;

  if (!clientToken || !priceId) {
    console.error('Paddle not configured', {
      clientToken: !!clientToken,
      priceId: !!priceId
    });
    return res.status(500).json({ error: 'Payments not configured' });
  }

  // Anything other than an explicit 'production' stays in sandbox, so a missing
  // env var can never accidentally take real money.
  const environment = process.env.PADDLE_ENVIRONMENT === 'production'
    ? 'production'
    : 'sandbox';

  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).json({ clientToken, priceId, environment });
};
