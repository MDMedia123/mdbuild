-- Analytics: a first-party record of how people move through the site.
--
-- The question this exists to answer is "where do people fall out?", not "who is
-- this person?". So there is deliberately no IP address, no cookie and no
-- cross-site identifier here — only a random id that lives in the tab and dies
-- with it. That keeps the site outside cookie-consent territory and means a
-- leak of this table would reveal nothing about anybody.

create table if not exists public.events (
  id            bigserial primary key,
  session_id    text        not null,
  event         text        not null,
  path          text,
  referrer_host text,               -- host only; a full URL can carry someone else's PII
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  device        text,               -- mobile | tablet | desktop
  country       text,               -- 2-letter, from the edge; no finer than that
  created_at    timestamptz not null default now()
);

create index if not exists events_created_at_idx on public.events (created_at desc);
create index if not exists events_event_time_idx on public.events (event, created_at desc);
create index if not exists events_session_idx    on public.events (session_id);

-- RLS on with no policies denies anon and authenticated outright. Only the
-- service key — held by /api/track and /api/analytics, never by the browser —
-- can read or write. Without this, the anon key on the homepage could read
-- every visitor's journey.
alter table public.events enable row level security;

-- One round trip that returns the whole dashboard, aggregated in the database
-- rather than by pulling every row into a serverless function.
create or replace function public.analytics_summary(days int default 30)
returns json
language sql
stable
as $$
  with bounds as (
    select (now() - make_interval(days => greatest(days, 1))) as since
  ),
  ev as (
    select e.* from public.events e, bounds b where e.created_at >= b.since
  ),
  paid as (
    select p.* from public.purchases p, bounds b
    where p.created_at >= b.since and p.status = 'completed'
  )
  select json_build_object(
    'days', days,
    'since', (select since from bounds),

    -- The four funnel stages. The first three count distinct visits; the last
    -- comes from the purchases table, so the money number is the real one
    -- rather than anything a browser reported.
    'visitors',        (select count(distinct session_id) from ev where event = 'page_view'),
    'reached_checkout',(select count(distinct session_id) from ev where event = 'page_view' and path = '/checkout'),
    'opened_paddle',   (select count(distinct session_id) from ev where event = 'checkout_opened'),
    'purchases',       (select count(*) from paid),
    'revenue',         (select coalesce(sum(amount), 0) from paid),
    'pageviews',       (select count(*) from ev where event = 'page_view'),

    'daily', (
      select coalesce(json_agg(row_to_json(d) order by d.day), '[]'::json) from (
        select date_trunc('day', created_at)::date as day,
               count(distinct session_id) filter (where event = 'page_view')       as visitors,
               count(distinct session_id) filter (where event = 'checkout_opened') as checkouts
        from ev group by 1
      ) d
    ),

    'referrers', (
      select coalesce(json_agg(row_to_json(r) order by r.n desc), '[]'::json) from (
        select coalesce(nullif(referrer_host, ''), 'direct') as label,
               count(distinct session_id) as n
        from ev where event = 'page_view'
        group by 1 order by n desc limit 8
      ) r
    ),

    'sources', (
      select coalesce(json_agg(row_to_json(s) order by s.n desc), '[]'::json) from (
        select coalesce(nullif(utm_source, ''), 'untagged') as label,
               count(distinct session_id) as n
        from ev where event = 'page_view'
        group by 1 order by n desc limit 8
      ) s
    ),

    'devices', (
      select coalesce(json_agg(row_to_json(v) order by v.n desc), '[]'::json) from (
        select coalesce(nullif(device, ''), 'unknown') as label,
               count(distinct session_id) as n
        from ev where event = 'page_view'
        group by 1 order by n desc
      ) v
    ),

    'pages', (
      select coalesce(json_agg(row_to_json(pg) order by pg.n desc), '[]'::json) from (
        select coalesce(nullif(path, ''), '/') as label,
               count(distinct session_id) as n
        from ev where event = 'page_view'
        group by 1 order by n desc limit 10
      ) pg
    )
  );
$$;

-- The function reads events and purchases, so it must not be callable with the
-- anon key that ships in the homepage.
revoke all on function public.analytics_summary(int) from public;
revoke all on function public.analytics_summary(int) from anon, authenticated;
