// What happens after money is confirmed, independent of who took it.
// Shared by every payment webhook so the email and account setup only
// exist in one place.

const { createClient } = require('@supabase/supabase-js');
const { renderPurchaseEmail } = require('./email-template');

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

  const html = renderPurchaseEmail({
    name: name,
    reference: reference,
    accessLink: accessLink,
    portalUrl: PORTAL_URL
  });

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
