-- Adds a real "hide completely" state, separate from the Live/Off toggle,
-- plus an editable status note (instead of hardcoded "Coming soon" text).
--
-- enabled = is it purchasable/live right now (controls the CTA buttons)
-- visible = does the card appear on the site AT ALL (the "work in the background" switch)
-- status_note = the text shown on the badge/button when enabled = false

alter table products add column if not exists status_note text default 'Coming soon';
alter table products add column if not exists visible boolean not null default true;

drop policy if exists "public can read enabled products" on products;
create policy "public can read visible products"
  on products for select
  using (visible = true or is_admin());

update products set status_note = 'Coming soon' where slug = 'studios';
