// What happens after money is confirmed, independent of who took it.
// Shared by the Stripe and Paystack webhooks so the email and account
// setup only exist in one place.

const { createClient } = require('@supabase/supabase-js');

// Must be the www host: the apex domain 307-redirects, and redirects break
// webhook senders and OAuth-style callbacks alike.
const PORTAL_URL = 'https://www.buildbymd.com/customer-portal';

function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase env vars missing');
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Creates the customer's account on first purchase and returns a one-click link
// that signs them in and drops them into choosing a password.
async function createAccessLink(supabase, email, name) {
  const { error: createError } = await supabase.auth.admin.createUser({
    email: email,
    email_confirm: true,
    user_metadata: { name: name }
  });

  // A returning customer already has an account; anything else is worth knowing.
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

async function sendConfirmationEmail(email, name, reference, accessLink) {
  const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
  const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error('Mailgun not configured, skipping email');
    return;
  }

  const authHeader = 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
  const link = accessLink || PORTAL_URL;
  const font = "Arial,'Segoe UI',Helvetica,sans-serif";

  // Table layout with solid background colours throughout: Outlook ignores CSS
  // gradients and flexbox, which collapsed the header on an earlier version.
  const html = `<html><body style="margin:0;padding:0;font-family:${font};background:#f7f5f0;"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f5f0;"><tr><td align="center" style="padding:0;"><table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;"><tr><td bgcolor="#1a2847" align="center" style="background-color:#1a2847;padding:48px 32px;"><p style="margin:0 0 22px 0;font-family:${font};font-size:18px;font-weight:700;color:#ffffff;letter-spacing:1px;">MD BUILD</p><h1 style="margin:0 0 14px 0;font-family:${font};font-size:32px;font-weight:700;color:#ffffff;line-height:1.25;">Welcome to Business Blueprint</h1><p style="margin:0;font-family:${font};font-size:16px;color:#c1893d;line-height:1.6;">Your purchase is confirmed. Let's build something great.</p></td></tr><tr><td style="padding:40px 32px;color:#1a2847;font-family:${font};"><p style="margin:0 0 16px 0;font-size:15px;font-weight:600;">Hi ${name},</p><p style="margin:0 0 28px 0;font-size:14px;color:#5B6478;line-height:1.8;">Thank you for purchasing Business Blueprint. All 21 guided modules are ready for you &mdash; covering strategy, branding, product, marketing, operations, and launch.</p><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f7f5f0;border:1px solid #EAE6DA;"><tr><td style="padding:26px 28px;font-family:${font};"><p style="margin:0 0 10px 0;font-size:14px;font-weight:700;color:#1a2847;">One step to get in</p><p style="margin:0;font-size:13px;color:#5B6478;line-height:1.7;">Click the button below to open your account and choose a password. That's it &mdash; you'll go straight to your modules.</p></td></tr></table><table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:32px auto;"><tr><td bgcolor="#C1893D" align="center" style="background-color:#C1893D;"><a href="${link}" style="display:inline-block;padding:17px 52px;font-family:${font};color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;">Set Your Password &amp; Get Access</a></td></tr></table><p style="margin:0 0 28px 0;font-size:11px;color:#6E6D62;text-align:center;line-height:1.6;">This link is unique to you and expires in 24 hours.<br>If it has expired, visit ${PORTAL_URL} and choose &ldquo;Forgot password?&rdquo;</p><p style="margin:0 0 12px 0;font-size:13px;color:#1a2847;font-weight:700;">What's included</p><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding:5px 0;font-family:${font};font-size:13px;color:#5B6478;">21 guided modules</td></tr><tr><td style="padding:5px 0;font-family:${font};font-size:13px;color:#5B6478;">Strategic planning templates</td></tr><tr><td style="padding:5px 0;font-family:${font};font-size:13px;color:#5B6478;">Launch checklists</td></tr><tr><td style="padding:5px 0;font-family:${font};font-size:13px;color:#5B6478;">Lifetime access</td></tr></table><p style="margin:28px 0 0 0;font-size:11px;color:#6E6D62;text-align:center;">Reference: ${reference}</p></td></tr><tr><td bgcolor="#f7f5f0" align="center" style="background-color:#f7f5f0;padding:26px 32px;border-top:1px solid #EAE6DA;font-family:${font};"><p style="margin:0 0 6px 0;font-size:12px;font-weight:700;color:#1a2847;">MD Build</p><p style="margin:0;font-size:11px;color:#6E6D62;">&copy; 2026 MD Build. Build Better Businesses.</p></td></tr></table></td></tr></table></body></html>`;

  const formData = new URLSearchParams();
  formData.append('from', `MD Build <noreply@${MAILGUN_DOMAIN}>`);
  formData.append('to', email);
  formData.append('subject', 'Welcome to Business Blueprint — Your Purchase is Confirmed');
  formData.append('html', html);

  const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  });

  if (!response.ok) {
    console.error('Mailgun error:', response.status, await response.text());
  } else {
    console.log('Confirmation email sent to', email);
  }
}

// Records the purchase, sets up the account, and emails the access link.
// Returns { duplicate: true } when this reference has already been handled, which
// is expected: both Stripe and Paystack retry deliveries.
async function fulfillPurchase({ email, name, product, reference, amount, provider }) {
  const supabase = getSupabase();

  const { error: dbError } = await supabase
    .from('purchases')
    .insert({
      email: email,
      name: name,
      product: product || 'business-blueprint',
      payment_reference: reference,
      provider: provider,
      amount: amount,
      status: 'completed'
    });

  if (dbError) {
    if (dbError.code === '23505') {
      console.log('Purchase already recorded, acknowledging retry');
      return { duplicate: true };
    }
    throw new Error('Database insert failed: ' + JSON.stringify(dbError));
  }
  console.log('Purchase saved:', reference);

  // A failure past this point must not fail the webhook — the money is taken and
  // the purchase is recorded, so a retry would only duplicate work. Log and move on.
  let accessLink = PORTAL_URL;
  try {
    accessLink = await createAccessLink(supabase, email, name);
  } catch (linkError) {
    console.error('Could not generate access link:', linkError.message);
  }

  try {
    await sendConfirmationEmail(email, name, reference, accessLink);
  } catch (emailError) {
    console.error('Could not send confirmation email:', emailError.message);
  }

  return { duplicate: false };
}

module.exports = { fulfillPurchase, PORTAL_URL };
