-- Run this in the Supabase SQL Editor before deploying the welcome-link flow.
--
-- Holds the one-per-purchase token that lets a new customer choose their first
-- password. Unlike Supabase's emailed links, opening the page does not spend the
-- token — only setting a password does. That is deliberate: corporate mail
-- scanners follow links to check them, and a single-use token dies in their
-- hands before the customer ever clicks.

CREATE TABLE IF NOT EXISTS welcome_tokens (
  token       VARCHAR(64) PRIMARY KEY,
  email       VARCHAR(255) NOT NULL,
  name        VARCHAR(255),
  purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_welcome_tokens_email ON welcome_tokens(email);

-- No client ever reads this table: both endpoints use the service role, which
-- bypasses RLS. Enabling it with no policies means a leaked anon key still
-- cannot enumerate tokens.
ALTER TABLE welcome_tokens ENABLE ROW LEVEL SECURITY;
