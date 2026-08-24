// The first-password token.
//
// Supabase's emailed links are single use and short lived, which sounds safe
// until a corporate mail scanner opens the link to check it and spends the
// token before the customer sees the message. That happened on the first real
// test, twice.
//
// This token is spent by SETTING a password, not by loading the page. A scanner
// can open the link as often as it likes; it sees a form, submits nothing, and
// the token is still there for the human.

const crypto = require('crypto');

const LIFETIME_DAYS = 30;

function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Issues a token for a purchase and returns the link to email.
async function issueWelcomeLink(supabase, { email, name, purchaseId, portalUrl }) {
  const token = createToken();
  const expiresAt = new Date(Date.now() + LIFETIME_DAYS * 24 * 60 * 60 * 1000);

  const { error } = await supabase
    .from('welcome_tokens')
    .insert({
      token: token,
      email: email,
      name: name,
      purchase_id: purchaseId || null,
      expires_at: expiresAt.toISOString()
    });

  if (error) throw new Error('Could not store welcome token: ' + JSON.stringify(error));

  return `${portalUrl}?welcome=${token}`;
}

// Looks up a token without spending it. Returns the row, or null.
async function lookupToken(supabase, token) {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;

  const { data, error } = await supabase
    .from('welcome_tokens')
    .select('token,email,name,expires_at,used_at')
    .eq('token', token)
    .maybeSingle();

  if (error || !data) return null;
  if (data.used_at) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;

  return data;
}

async function markUsed(supabase, token) {
  const { error } = await supabase
    .from('welcome_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('token', token)
    .is('used_at', null);

  if (error) throw new Error('Could not mark token used: ' + JSON.stringify(error));
}

module.exports = { issueWelcomeLink, lookupToken, markUsed, LIFETIME_DAYS };
