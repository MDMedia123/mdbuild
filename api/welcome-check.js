// Answers "is this welcome token still good, and whose is it?"
//
// Deliberately does NOT spend the token — a mail scanner opening the link must
// leave it usable for the customer. Returns only the email address the password
// will be set for, so the welcome screen can greet them.

const { createClient } = require('@supabase/supabase-js');
const { lookupToken } = require('../lib/welcome-token');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = (req.query && req.query.token) || (req.body && req.body.token);

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('Supabase env vars missing');
    return res.status(500).json({ error: 'Not configured' });
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const row = await lookupToken(supabase, token);

    if (!row) {
      // Same answer for expired, spent, unknown and malformed: a caller probing
      // tokens learns nothing beyond "not usable".
      return res.status(404).json({ valid: false });
    }

    return res.status(200).json({
      valid: true,
      email: row.email,
      name: row.name || null
    });
  } catch (error) {
    console.error('welcome-check failed:', error.message);
    return res.status(500).json({ error: 'Could not check that link' });
  }
};
