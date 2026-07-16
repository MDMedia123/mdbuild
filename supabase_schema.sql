-- MD Media backend schema
-- Run this in Supabase: Database -> SQL Editor -> New query -> paste -> Run
-- Safe to run once. If you need to re-run after edits, drop the tables first.

-- ============================================================
-- ADMIN CHECK
-- Single-owner setup: replace with your real email before running.
-- Every RLS policy below that gates admin-only access checks this function.
-- ============================================================
create or replace function is_admin()
returns boolean as $$
  select auth.jwt() ->> 'email' = 'YOUR_EMAIL_HERE@example.com';
$$ language sql stable;

-- Callable from the client to get an unambiguous true/false admin check
-- (row-count-based checks can't tell "admin with 0 rows" from "not admin").
create or replace function am_i_admin()
returns boolean as $$
  select is_admin();
$$ language sql stable;

-- ============================================================
-- PRODUCTS  (MD Business Launch, MD Studios, future products)
-- ============================================================
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,              -- e.g. 'business-launch'
  name text not null,                     -- e.g. 'MD Business Launch'
  subtitle text,                          -- e.g. 'Business Launch Workspace'
  description text,
  price_cents integer,                    -- store cents, avoid float rounding
  enabled boolean not null default true,  -- the on/off switch
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "public can read enabled products"
  on products for select
  using (enabled = true or is_admin());

create policy "admin can manage products"
  on products for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- MODULES  (the 21 steps inside a product, e.g. Business Launch)
-- Content-driven: add a row instead of copy-pasting HTML.
-- ============================================================
create table modules (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  stage_group text not null,              -- e.g. 'Strategy', 'Brand', 'Offer'
  title text not null,                    -- e.g. 'Vision & Purpose'
  teaching_text text,                     -- the one-line explainer under the title
  focus_items jsonb not null default '[]',-- ["Define why...", "Create a vision..."]
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table modules enable row level security;

create policy "public can read enabled modules"
  on modules for select
  using (enabled = true or is_admin());

create policy "admin can manage modules"
  on modules for all
  using (is_admin())
  with check (is_admin());

-- ============================================================
-- EMAIL SIGNUPS  (captured from the pre-purchase form, access form, etc.)
-- ============================================================
create table email_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  business_name text,
  source text,                            -- e.g. 'prefill_form', 'access_form'
  created_at timestamptz not null default now()
);

alter table email_signups enable row level security;

create policy "anyone can submit their email"
  on email_signups for insert
  with check (true);

create policy "only admin can read signups"
  on email_signups for select
  using (is_admin());

-- ============================================================
-- ANALYTICS EVENTS  (page views, clicks, downloads)
-- ============================================================
create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,               -- 'page_view' | 'click' | 'download'
  page text,                              -- e.g. 'MD_Media_Home.html'
  label text,                             -- e.g. 'launch_workspace_button'
  meta jsonb default '{}',
  created_at timestamptz not null default now()
);

alter table analytics_events enable row level security;

create policy "anyone can log an event"
  on analytics_events for insert
  with check (true);

create policy "only admin can read events"
  on analytics_events for select
  using (is_admin());

-- ============================================================
-- SEED DATA: your existing 2 products
-- ============================================================
insert into products (slug, name, subtitle, description, price_cents, enabled, sort_order) values
  ('business-launch', 'MD Business Launch', 'Business Launch Workspace',
   'From idea to launch-ready, one guided step at a time.', 4900, true, 1),
  ('studios', 'MD Studios', 'Creative Brand & Design Workspace',
   'The creative home for your brand.', null, false, 2);
