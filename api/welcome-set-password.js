// Spends a welcome token to set the customer's first password.
//
// This is the only operation the token can perform. It cannot sign in, read
// anything, or change an email address — and once used it is dead permanently.

const { createClient } = require('@supabase/supabase-js');
const { lookupToken, markUsed } = require('../lib/welcome-token');

const MIN_PASSWORD_LENGTH = 8;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, password } = req.body || {};

  if (!password || String(password).length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('Supabase env vars missing');
    return res.status(500).json({ error: 'Not configured' });
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const row = await lookupToken(supabase, token);
    if (!row) {
      return res.status(404).json({ error: 'That link has expired or has already been used' });
    }

    // Find the account the purchase created, so we update rather than duplicate.
    const { data: list, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw new Error('Could not look up the account: ' + listError.message);

    const target = (list.users || []).find(function (u) {
      return String(u.email || '').toLowerCase() === String(row.email).toLowerCase();
    });

    if (!target) {
      console.error('No account for welcome token holder:', row.email);
      return res.status(500).json({ error: 'We could not find your account. Please contact support.' });
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(target.id, {
      password: String(password),
      email_confirm: true
    });

    if (updateError) throw new Error('Could not set the password: ' + updateError.message);

    // Spend it only now that the password is actually set. A failure above
    // leaves the token usable, so the customer can simply try again.
    await markUsed(supabase, row.token);

    console.log('First password set for', row.email);
    return res.status(200).json({ ok: true, email: row.email });
  } catch (error) {
    console.error('welcome-set-password failed:', error.message);
    return res.status(500).json({ error: 'Could not set your password. Please try again.' });
  }
};
