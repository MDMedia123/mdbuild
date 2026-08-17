const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Prices live here, never in the browser: the client used to send the amount, so
// anyone could edit it in devtools and buy the product for a penny.
const PRICES = {
  'business-blueprint': { amount: 4900, currency: 'usd' }
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, product } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sku = product || 'business-blueprint';
    const price = PRICES[sku];
    if (!price) {
      return res.status(400).json({ error: 'Unknown product' });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not set');
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.amount,
      currency: price.currency,
      metadata: {
        email: email,
        name: name,
        product: sku
      }
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    return res.status(500).json({ error: error.message });
  }
};
