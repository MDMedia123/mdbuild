const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

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
  console.log('Webhook received');

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

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { email, name } = paymentIntent.metadata;
      console.log('Processing payment for:', email);

      if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
        console.error('Supabase env vars missing', {
          url: !!process.env.SUPABASE_URL,
          key: !!process.env.SUPABASE_SERVICE_KEY
        });
        return res.status(500).json({ error: 'Database not configured' });
      }

      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

      const { error: dbError } = await supabase
        .from('purchases')
        .insert({
          email: email,
          name: name,
          product: 'business-blueprint',
          stripe_payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          status: 'completed'
        });

      if (dbError) {
        console.error('Database error:', JSON.stringify(dbError));
        return res.status(500).json({ error: 'Failed to save purchase' });
      }
      console.log('Purchase saved to database');

      await sendConfirmationEmail(email, name, paymentIntent.id);
      console.log(`Purchase recorded for ${email}: ${paymentIntent.id}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error.message, error.stack);
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
    const portalLink = 'https://buildbymd.com/customer-portal';

    const html = `<html><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;background:#f7f5f0;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:0;"><table width="100%" style="max-width:600px;background:#fff;" cellpadding="0" cellspacing="0"><tr><td style="padding:0;background:linear-gradient(135deg,#1a2847 0%,#0f1a3a 100%);text-align:center;"><div style="padding:48px 32px;"><div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:24px;"><div style="background:#212B42;padding:8px 12px;border-radius:8px;"><span style="color:#fff;font-size:16px;font-weight:700;">MD</span></div><span style="color:#fff;font-size:18px;font-weight:600;">Build</span></div><h1 style="margin:0 0 12px 0;font-size:36px;font-weight:700;color:#fff;line-height:1.2;">Welcome to Business Blueprint</h1><p style="margin:0;font-size:16px;color:#c1893d;line-height:1.6;">Your purchase is confirmed. Let's build something great.</p></div></td></tr><tr><td style="padding:40px 32px;color:#1a2847;"><p style="margin:0 0 16px 0;font-size:15px;font-weight:600;">Hi ${name},</p><p style="margin:0 0 28px 0;font-size:14px;color:#5B6478;line-height:1.8;">Thank you for purchasing Business Blueprint. Your access is now active, and you're ready to dive into all 21 guided modules covering strategy, branding, product, marketing, operations, and launch.</p><div style="background:#f7f5f0;border-radius:12px;padding:28px;margin:28px 0;border:1px solid #EAE6DA;"><p style="margin:0 0 16px 0;font-size:13px;font-weight:700;color:#1a2847;">Next Steps:</p><ol style="margin:0;padding-left:20px;"><li style="margin:8px 0;font-size:12px;color:#5B6478;"><strong>Go to your portal:</strong> Visit the link below</li><li style="margin:8px 0;font-size:12px;color:#5B6478;"><strong>Click "Forgot password?"</strong> to set your password</li><li style="margin:8px 0;font-size:12px;color:#5B6478;"><strong>Sign in</strong> with your email and new password</li><li style="margin:8px 0;font-size:12px;color:#5B6478;"><strong>Access all 21 modules</strong> instantly</li></ol></div><div style="text-align:center;margin:32px 0;"><a href="${portalLink}" style="display:inline-block;background:#C1893D;color:white;padding:16px 56px;text-decoration:none;font-weight:600;font-size:15px;border-radius:10px;box-shadow:0 8px 24px rgba(33,43,66,0.12);">Go to Customer Portal</a></div><p style="margin:0 0 16px 0;font-size:13px;color:#1a2847;font-weight:600;">What's Included:</p><ul style="margin:0;padding-left:20px;margin-bottom:24px;"><li style="margin:8px 0;font-size:12px;color:#5B6478;">21 guided modules</li><li style="margin:8px 0;font-size:12px;color:#5B6478;">Strategic planning templates</li><li style="margin:8px 0;font-size:12px;color:#5B6478;">Launch checklists</li><li style="margin:8px 0;font-size:12px;color:#5B6478;">Lifetime access</li></ul><p style="margin:20px 0;font-size:12px;color:#6E6D62;text-align:center;font-style:italic;">Transaction ID: ${transactionId}</p></td></tr><tr><td style="padding:28px 32px;text-align:center;border-top:1px solid #EAE6DA;font-size:12px;color:#6E6D62;"><p style="margin:0 0 8px 0;"><strong style="color:#1a2847;">MD Build</strong></p><p style="margin:0;font-size:11px;">© 2026 MD Build. Build Better Businesses.</p></td></tr></table></td></tr></table></body></html>`;

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
      console.error('Mailgun error:', mailgunResponse.status, await mailgunResponse.text());
    } else {
      console.log('Confirmation email sent to', email);
    }
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
}
