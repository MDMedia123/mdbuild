// Records one anonymous funnel event.
//
// This endpoint is public by necessity — it is called from the homepage — so it
// treats everything in the request as hostile: only known event names are
// accepted, every string is truncated, and nothing that could identify a person
// is stored. The visitor's IP is used to read a country code from the edge and
// is then discarded.

const { createClient } = require('@supabase/supabase-js');

// An allowlist rather than free-form names, so a spammer cannot invent event
// types and make the dashboard unreadable.
const ALLOWED_EVENTS = ['page_view', 'checkout_opened', 'purchase_success'];

// Enough for a launch; the point is to blunt a script, not to survive a
// determined attack. Serverless instances each hold their own copy, so this is
// a speed bump rather than a guarantee — the allowlist above is the real limit
// on how much damage a flood could do.
const RATE_LIMIT = 40;
const RATE_WINDOW_MS = 60 * 1000;
const seen = new Map();

function rateLimited(key) {
  const now = Date.now();
  const entry = seen.get(key);

  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    seen.set(key, { start: now, count: 1 });
    if (seen.size > 5000) seen.clear();   // bound the memory, however crudely
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function text(value, max) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max || 120);
}

// Keep the path and drop the query string: search params are where tracking
// links hide email addresses and order numbers.
function cleanPath(value) {
  const raw = text(value, 300);
  if (!raw) return '/';
  const path = raw.split('?')[0].split('#')[0].toLowerCase();
  return path.startsWith('/') ? path.slice(0, 120) : '/' + path.slice(0, 119);
}

// Store where someone came from, never the full URL they came from.
function referrerHost(value) {
  const raw = text(value, 300);
  if (!raw) return null;
  try {
    const host = new URL(raw).hostname.replace(/^www\./, '').toLowerCase();
    return host.endsWith('buildbymd.com') ? null : host.slice(0, 80);
  } catch (err) {
    return null;
  }
}

function deviceFrom(ua) {
  const agent = String(ua || '').toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(agent)) return 'tablet';
  if (/mobi|android|iphone|ipod/.test(agent)) return 'mobile';
  if (!agent) return 'unknown';
  return 'desktop';
}

// Crawlers and link scanners would otherwise show up as visitors who never
// reach checkout, which is exactly the shape of the number being measured.
function looksAutomated(ua) {
  const agent = String(ua || '').toLowerCase();
  if (!agent) return true;
  return /bot|crawl|spider|slurp|preview|scanner|monitor|headless|curl|wget|python-requests|axios|lighthouse|pingdom|uptime/.test(agent);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Always answer 204 from here on. A tracker that reports failures back to the
  // page tells a prober what got through, and a visitor should never see a
  // console error because analytics had a bad day.
  const done = function () { return res.status(204).end(); };

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    const event = text(body.event, 40);
    if (!event || ALLOWED_EVENTS.indexOf(event) === -1) return done();

    const sessionId = text(body.session, 64);
    if (!sessionId) return done();

    const userAgent = req.headers['user-agent'];
    if (looksAutomated(userAgent)) return done();

    if (rateLimited(sessionId)) return done();

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.error('Analytics: Supabase env vars missing');
      return done();
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { error } = await supabase.from('events').insert({
      session_id:    sessionId,
      event:         event,
      path:          cleanPath(body.path),
      referrer_host: referrerHost(body.referrer),
      utm_source:    text(body.utm_source, 60),
      utm_medium:    text(body.utm_medium, 60),
      utm_campaign:  text(body.utm_campaign, 60),
      device:        deviceFrom(userAgent),
      // Vercel resolves this at the edge, so the IP itself never reaches here.
      country:       text(req.headers['x-vercel-ip-country'], 2)
    });

    if (error) console.error('Analytics insert failed:', error.message);
  } catch (err) {
    console.error('Analytics error:', err.message);
  }

  return done();
};
