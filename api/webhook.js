const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { email, name } = paymentIntent.metadata;

      // Store purchase in database
      const { error: dbError } = await supabase
        .from('purchases')
        .insert({
          email: email,
          name: name,
          product: 'business-blueprint',
          stripe_payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          status: 'completed',
          created_at: new Date()
        });

      if (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({ error: 'Failed to save purchase' });
      }

      // TODO: Send confirmation email
      console.log(`Purchase recorded for ${email}: ${paymentIntent.id}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}
