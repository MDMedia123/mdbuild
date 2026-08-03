-- Purchases table for storing Business Blueprint orders
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  product VARCHAR(100) NOT NULL DEFAULT 'business-blueprint',
  stripe_payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_product ON purchases(product);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON purchases(created_at);

-- Enable Row Level Security
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (during checkout)
CREATE POLICY "Allow insert on purchases" ON purchases
  FOR INSERT WITH CHECK (true);

-- Policy: Allow users to view their own purchases by email
CREATE POLICY "Allow users to view their purchases" ON purchases
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

-- Policy: Prevent updates/deletes
CREATE POLICY "Prevent updates on purchases" ON purchases
  FOR UPDATE WITH CHECK (false);

CREATE POLICY "Prevent deletes on purchases" ON purchases
  FOR DELETE WITH CHECK (false);
