// Reads the funnel for the admin dashboard.
//
// Writing events is public; reading them is not. Visitor journeys and revenue
// go through the same admin check as everything else on the dashboard.

const { createClient } = require('@supabase/supabase-js');
const { requireAdmin } = require('../lib/require-admin');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ error: auth.error });

  const requested = parseInt(req.query.days, 10);
  const days = [7, 30, 90].indexOf(requested) > -1 ? requested : 30;

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // All the aggregation happens in Postgres, so this stays one round trip
    // however many events accumulate.
    const { data, error } = await supabase.rpc('analytics_summary', { window_days: days });

    if (error) {
      // The most likely cause by far is the migration not having been run.
      console.error('analytics_summary failed:', error.message);
      return res.status(500).json({
        error: 'Could not read analytics',
        detail: error.message
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Analytics read error:', err.message);
    return res.status(500).json({ error: 'Could not read analytics' });
  }
};
