-- Run this in the Supabase SQL Editor before taking Paystack payments.
--
-- The reference column was named for Stripe, but it now holds whichever
-- processor's reference took the money, so it gets a neutral name and a
-- companion column recording who that was.

ALTER TABLE purchases
  RENAME COLUMN stripe_payment_intent_id TO payment_reference;

ALTER TABLE purchases
  ADD COLUMN IF NOT EXISTS provider VARCHAR(20) NOT NULL DEFAULT 'stripe';

-- Existing rows all came from Stripe, which the default above already covers.

CREATE INDEX IF NOT EXISTS idx_purchases_provider ON purchases(provider);
