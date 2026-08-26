-- Run this in the Supabase SQL Editor.
--
-- Workspace progress used to live only in browser localStorage, which meant a
-- customer's business plan was tied to one browser: invisible on their phone,
-- destroyed by clearing site data, and — because sign-out never cleared it —
-- visible to the next person to use a shared computer.
--
-- One row per customer, holding the whole workspace state as JSON. The shape of
-- that state is the workspace's business, not the database's, so it is stored
-- opaquely rather than modelled into columns that would need migrating every
-- time a module changes.

CREATE TABLE IF NOT EXISTS workspace_progress (
  email      VARCHAR(255) PRIMARY KEY,
  data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE workspace_progress ENABLE ROW LEVEL SECURITY;

-- The workspace runs in the browser with the anon key and the customer's own
-- session, so every policy is scoped to the email on their token. Nobody can
-- read or write another customer's plan, whatever they send.

DROP POLICY IF EXISTS "Read own progress" ON workspace_progress;
CREATE POLICY "Read own progress" ON workspace_progress
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

DROP POLICY IF EXISTS "Insert own progress" ON workspace_progress;
CREATE POLICY "Insert own progress" ON workspace_progress
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email);

DROP POLICY IF EXISTS "Update own progress" ON workspace_progress;
CREATE POLICY "Update own progress" ON workspace_progress
  FOR UPDATE USING (auth.jwt() ->> 'email' = email)
           WITH CHECK (auth.jwt() ->> 'email' = email);
