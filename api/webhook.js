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

      // Send confirmation email
      await sendConfirmationEmail(email, name, paymentIntent.id);
      console.log(`Purchase recorded for ${email}: ${paymentIntent.id}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};

async function sendConfirmationEmail(email, name, transactionId) {
  try {
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.log('Mailgun not configured, skipping email');
      return;
    }

    const authHeader = 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
    const dashboardLink = 'https://buildbymd.com/MD_Business_Blueprint_Dashboard';

    const html = `<html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f7f5f0;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0;"><table width="100%" style="max-width:600px;background:#fff;" cellpadding="0" cellspacing="0"><tr><td style="padding:0;background:linear-gradient(135deg,#1a2847 0%,#0f1a3a 100%);text-align:center;"><div style="padding:48px 32px;"><div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:24px;"><div style="background:#212B42;padding:8px 12px;border-radius:8px;"><span style="color:#fff;font-size:16px;font-weight:700;">MD</span></div><span style="color:#fff;font-size:18px;font-weight:600;">Build</span></div><h1 style="margin:0 0 12px 0;font-size:36px;font-weight:700;color:#fff;line-height:1.2;">Welcome to Business Blueprint</h1><p style="margin:0;font-size:16px;color:#c1893d;line-height:1.6;">Your purchase is confirmed. Let's build something great.</p></div></td></tr><tr><td style="padding:40px 32px;color:#1a2847;"><p style="margin:0 0 16px 0;font-size:15px;font-weight:600;">Hi ${name},</p><p style="margin:0 0 28px 0;font-size:14px;color:#5B6478;line-height:1.8;">Thank you for purchasing Business Blueprint. Your access is now active, and you're ready to dive into all 21 guided modules covering strategy, branding, product, marketing, operations, and launch.</p><div style="background:#f7f5f0;border-radius:12px;padding:28px;margin:28px 0;border:1px solid #EAE6DA;"><p style="margin:0 0 16px 0;font-size:13px;font-weight:700;color:#1a2847;">What's Included:</p><ul style="margin:0;padding-left:20px;"><li style="margin:8px 0;font-size:12px;color:#5B6478;">21 guided modules</li><li style="margin:8px 0;font-size:12px;color:#5B6478;">Strategic planning templates</li><li style="margin:8px 0;font-size:12px;color:#5B6478;">Launch checklists</li><li style="margin:8px 0;font-size:12px;color:#5B6478;">Lifetime access</li></ul></div><div style="text-align:center;margin:32px 0;"><a href="${dashboardLink}" style="display:inline-block;background:#C1893D;color:white;padding:16px 56px;text-decoration:none;font-weight:600;font-size:15px;border-radius:10px;box-shadow:0 8px 24px rgba(33,43,66,0.12);">Access Your Blueprint</a></div><p style="margin:20px 0;font-size:12px;color:#6E6D62;text-align:center;font-style:italic;">Transaction ID: ${transactionId}</p></td></tr><tr><td style="padding:28px 32px;text-align:center;border-top:1px solid #EAE6DA;font-size:12px;color:#6E6D62;"><p style="margin:0 0 8px 0;"><strong style="color:#1a2847;">MD Build</strong></p><p style="margin:0;font-size:11px;">© 2026 MD Build. Build Better Businesses.</p></td></tr></table></td></tr></table></body></html>`;

    const formData = new URLSearchParams();
    formData.append('from', `MD Build <noreply@${MAILGUN_DOMAIN}>`);
    formData.append('to', email);
    formData.append('subject', 'Welcome to Business Blueprint — Your Purchase is Confirmed');
    formData.append('html', html);

    const mailgunResponse = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (!mailgunResponse.ok) {
      console.error('Mailgun error:', mailgunResponse.status);
    }
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
}
