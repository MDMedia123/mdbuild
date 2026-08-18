// Server-side admin check for endpoints that must not be publicly callable.
//
// The admin panel is a static page, so anything it knows, a visitor can read.
// Authorisation therefore cannot live in the browser: the page signs in through
// Supabase Auth and sends its access token, and this verifies that token here,
// against an allowlist of admin addresses held in the environment.

const { createClient } = require('@supabase/supabase-js');

function allowedAdmins() {
  return String(process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(function (entry) { return entry.trim().toLowerCase(); })
    .filter(Boolean);
}

// Returns { ok: true, email } or { ok: false, status, error }.
// Fails closed: with no allowlist configured, nobody gets in. An endpoint that
// silently opens itself because a variable is missing is how this went wrong
// the first time.
async function requireAdmin(req) {
  const allowlist = allowedAdmins();
  if (allowlist.length === 0) {
    console.error('ADMIN_EMAILS not set — refusing the request');
    return { ok: false, status: 503, error: 'Admin access is not configured' };
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('Supabase env vars missing — cannot verify admin');
    return { ok: false, status: 503, error: 'Admin access is not configured' };
  }

  const header = req.headers.authorization || req.headers.Authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!token) {
    return { ok: false, status: 401, error: 'Sign in required' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // Validates the token's signature and expiry with Supabase — a caller cannot
  // forge this by editing localStorage.
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data || !data.user) {
    return { ok: false, status: 401, error: 'Sign in required' };
  }

  const email = String(data.user.email || '').toLowerCase();
  if (!allowlist.includes(email)) {
    console.error('Rejected non-admin caller:', email);
    return { ok: false, status: 403, error: 'Not authorised' };
  }

  return { ok: true, email: email };
}

module.exports = { requireAdmin };
