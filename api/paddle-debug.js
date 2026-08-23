// TEMPORARY diagnostic. Reports whether each Paddle variable arrived at runtime,
// how long it is, and whether it starts with the prefix Paddle uses for that kind
// of value. Never returns a value.
//
// Vercel's "sensitive" variables cannot be read back once saved, so this is the
// only way to tell an empty variable from a populated one, or to catch a value
// pasted into the wrong slot.
//
// Delete this file once the checkout is working.

function describe(name, expectedPrefix) {
  const raw = process.env[name];
  if (raw === undefined) return { name, status: 'not present at runtime' };

  const trimmed = raw.trim();
  if (trimmed.length === 0) return { name, status: 'present but EMPTY' };

  return {
    name,
    status: 'has a value',
    length: trimmed.length,
    startsCorrectly: expectedPrefix ? trimmed.startsWith(expectedPrefix) : null,
    expectedPrefix: expectedPrefix || null,
    hasStrayQuotes: /^["']|["']$/.test(trimmed),
    hasStrayWhitespace: raw !== trimmed
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    checked: new Date().toISOString(),
    variables: [
      describe('PADDLE_PRICE_ID_BLUEPRINT', 'pri_'),
      describe('PADDLE_CLIENT_TOKEN', null),
      describe('PADDLE_API_KEY', 'pdl_'),
      describe('PADDLE_WEBHOOK_SECRET', 'pdl_ntfset_'),
      describe('ADMIN_EMAILS', null),
      describe('SUPABASE_URL', 'https://'),
      describe('MAILGUN_DOMAIN', null)
    ]
  });
};
