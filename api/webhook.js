const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Must be the www host: the apex domain 307-redirects and Stripe does not follow redirects.
const PORTAL_URL = 'https://www.buildbymd.com/customer-portal';

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
        // Stripe retries deliveries, so a repeat of an event we already handled is
        // expected. Acknowledge it instead of failing into an endless retry loop.
        if (dbError.code === '23505') {
          console.log('Purchase already recorded, acknowledging retry');
          return res.status(200).json({ received: true, duplicate: true });
        }
        console.error('Database error:', JSON.stringify(dbError));
        return res.status(500).json({ error: 'Failed to save purchase' });
      }
      console.log('Purchase saved to database');

      let accessLink = PORTAL_URL;
      try {
        accessLink = await createAccessLink(supabase, email, name);
        console.log('Access link generated');
      } catch (linkError) {
        console.error('Could not generate access link:', linkError.message);
      }

      await sendConfirmationEmail(email, name, paymentIntent.id, accessLink);
      console.log(`Purchase recorded for ${email}: ${paymentIntent.id}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error.message, error.stack);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Creates the customer's account on first purchase and returns a one-click link that
// signs them in and drops them straight into setting a password.
async function createAccessLink(supabase, email, name) {
  const { error: createError } = await supabase.auth.admin.createUser({
    email: email,
    email_confirm: true,
    user_metadata: { name: name }
  });

  // A returning customer already has an account; anything else is worth knowing about.
  if (createError && !/already|registered|exists/i.test(createError.message)) {
    console.error('createUser:', createError.message);
  }

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: email,
    options: { redirectTo: PORTAL_URL }
  });

  if (error) throw error;
  return data.properties.action_link;
}

async function sendConfirmationEmail(email, name, transactionId, accessLink) {
  try {
    const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
    const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.log('Mailgun not configured, skipping email');
      return;
    }

    const authHeader = 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
    const link = accessLink || PORTAL_URL;
    const font = "Arial,'Segoe UI',Helvetica,sans-serif";

    // Table layout with solid background colours throughout: Outlook drops CSS
    // gradients and flexbox, which collapsed the header on the first version.
    const html = `<html><body style="margin:0;padding:0;font-family:${font};background:#f7f5f0;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f5f0;"><tr><td align="center" style="padding:0;"><table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;"><tr><td bgcolor="#1a2847" align="center" style="background-color:#1a2847;padding:48px 32px;"><p style="margin:0 0 22px 0;font-family:${font};font-size:18px;font-weight:700;color:#ffffff;letter-spacing:1px;">MD BUILD</p><h1 style="margin:0 0 14px 0;font-family:${font};font-size:32px;font-weight:700;color:#ffffff;line-height:1.25;">Welcome to Business Blueprint</h1><p style="margin:0;font-family:${font};font-size:16px;color:#c1893d;line-height:1.6;">Your purchase is confirmed. Let's build something great.</p></td></tr><tr><td style="padding:40px 32px;color:#1a2847;font-family:${font};"><p style="margin:0 0 16px 0;font-size:15px;font-weight:600;">Hi ${name},</p><p style="margin:0 0 28px 0;font-size:14px;color:#5B6478;line-height:1.8;">Thank you for purchasing Business Blueprint. All 21 guided modules are ready for you &mdash; covering strategy, branding, product, marketing, operations, and launch.</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f5f0;border:1px solid #EAE6DA;"><tr><td style="padding:26px 28px;font-family:${font};"><p style="margin:0 0 10px 0;font-size:14px;font-weight:700;color:#1a2847;">One step to get in</p><p style="margin:0;font-size:13px;color:#5B6478;line-height:1.7;">Click the button below to open your account and choose a password. That's it &mdash; you'll go straight to your modules.</p></td></tr></table><table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:32px auto;"><tr><td bgcolor="#C1893D" align="center" style="background-color:#C1893D;"><a href="${link}" style="display:inline-block;padding:17px 52px;font-family:${font};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;">Set Your Password &amp; Get Access</a></td></tr></table><p style="margin:0 0 28px 0;font-size:11px;color:#6E6D62;text-align:center;line-height:1.6;">This link is unique to you and expires in 24 hours.<br>If it has expired, visit ${PORTAL_URL} and choose &ldquo;Forgot password?&rdquo;</p><p style="margin:0 0 12px 0;font-size:13px;color:#1a2847;font-weight:700;">What's included</p><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:5px 0;font-family:${font};font-size:13px;color:#5B6478;">21 guided modules</td></tr><tr><td style="padding:5px 0;font-family:${font};font-size:13px;color:#5B6478;">Strategic planning templates</td></tr><tr><td style="padding:5px 0;font-family:${font};font-size:13px;color:#5B6478;">Launch checklists</td></tr><tr><td style="padding:5px 0;font-family:${font};font-size:13px;color:#5B6478;">Lifetime access</td></tr></table><p style="margin:28px 0 0 0;font-size:11px;color:#6E6D62;text-align:center;">Transaction ID: ${transactionId}</p></td></tr><tr><td bgcolor="#f7f5f0" align="center" style="background-color:#f7f5f0;padding:26px 32px;border-top:1px solid #EAE6DA;font-family:${font};"><p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#1a2847;">MD Build</p><p style="margin:0;font-size:11px;color:#6E6D62;">&copy; 2026 MD Build. Build Better Businesses.</p></td></tr></table></td></tr></table></body></html>`;

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
