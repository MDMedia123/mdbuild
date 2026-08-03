import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, amount } = req.body;

    if (!email || !name || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'usd',
      metadata: {
        email: email,
        name: name,
        product: 'business-blueprint'
      }
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
