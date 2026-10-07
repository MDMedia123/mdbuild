// Keeps the Supabase project from being paused for inactivity.
//
// Free-tier projects are switched off after 7 days without database activity.
// That has already taken the site down twice, and the failure is a bad one: the
// pages still serve from Vercel, so the shop looks open while nothing behind it
// works. A single query a day is enough to count as activity.
//
// Run by Vercel Cron (see vercel.json). Cron requests carry a bearer token that
// Vercel sets from CRON_SECRET, so this cannot be triggered by anyone passing.

const { createClient } = require('@supabase/supabase-js');

module.exports = async function handler(req, res) {
  // When CRON_SECRET is set, Vercel sends it on every scheduled invocation.
  // Checking it stops a stranger running this endlessly; if it is not set, the
  // endpoint is harmless anyway — one cheap read.
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const header = req.headers.authorization || '';
    if (header !== 'Bearer ' + secret) {
      return res.status(401).json({ error: 'Not authorised' });
    }
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    console.error('Keep-alive: Supabase env vars missing');
    return res.status(503).json({ ok: false, error: 'Not configured' });
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // The cheapest read that still reaches Postgres. Counting rather than
    // selecting keeps it tiny no matter how the table grows.
    const { error, count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    if (error) throw new Error(error.message);

    console.log('Keep-alive ok, products visible:', count);
    return res.status(200).json({ ok: true, products: count, at: new Date().toISOString() });
  } catch (err) {
    // Worth shouting about: if this fails the project is already down, and the
    // next thing to notice would otherwise be a customer.
    console.error('Keep-alive FAILED — database unreachable:', err.message);
    return res.status(503).json({ ok: false, error: err.message });
  }
};
