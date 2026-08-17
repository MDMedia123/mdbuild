// Starts a Paystack checkout and hands the browser a URL to send the customer to.
// Card details are entered on Paystack's own page, so they never touch this site.

const { PRICES } = require('../lib/prices');

const CALLBACK_URL = 'https://www.buildbymd.com/checkout-success';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, product } = req.body || {};

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sku = product || 'business-blueprint';
    const price = PRICES[sku];
    if (!price) {
      return res.status(400).json({ error: 'Unknown product' });
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY not set');
      return res.status(500).json({ error: 'Payments not configured' });
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        amount: price.amount,
        currency: price.currency,
        callback_url: CALLBACK_URL,
        // Read back off the webhook, so the buyer's name survives the round trip.
        metadata: {
          name: name,
          product: sku
        }
      })
    });

    const body = await response.json();

    if (!response.ok || !body.status) {
      console.error('Paystack initialize failed:', response.status, JSON.stringify(body));
      return res.status(502).json({ error: body.message || 'Could not start checkout' });
    }

    return res.status(200).json({
      authorizationUrl: body.data.authorization_url,
      reference: body.data.reference
    });
  } catch (error) {
    console.error('Error creating Paystack transaction:', error.message);
    return res.status(500).json({ error: 'Could not start checkout' });
  }
};
