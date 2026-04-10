-- DESTATE Supabase Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  price NUMERIC(18, 7) NOT NULL CHECK (price > 0),
  location VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  owner VARCHAR(56) NOT NULL,  -- Stellar public key (G...)
  image_url TEXT,
  property_type VARCHAR(50) NOT NULL DEFAULT 'Apartment',
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft INTEGER,
  is_sold BOOLEAN NOT NULL DEFAULT FALSE,
  contract_id VARCHAR(100),   -- Soroban contract property ID
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner);
CREATE INDEX IF NOT EXISTS idx_properties_is_sold ON properties(is_sold);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Transactions table (for tracking buy history)
CREATE TABLE IF NOT EXISTS property_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  buyer VARCHAR(56) NOT NULL,
  seller VARCHAR(56) NOT NULL,
  amount NUMERIC(18, 7) NOT NULL,
  tx_hash VARCHAR(100),       -- Stellar transaction hash
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_property ON property_transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON property_transactions(buyer);

-- User feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL,
  wallet_address VARCHAR(56) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Public read for properties
CREATE POLICY "Properties are publicly readable"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can insert (wallet-authenticated)
CREATE POLICY "Anyone can create properties"
  ON properties FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only updates from API (service role) allowed for sold status
CREATE POLICY "Anyone can update properties"
  ON properties FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Transactions readable
CREATE POLICY "Transactions publicly readable"
  ON property_transactions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert transactions"
  ON property_transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Feedback
CREATE POLICY "Feedback publicly readable"
  ON user_feedback FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit feedback"
  ON user_feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sample data (optional)
INSERT INTO properties (title, price, location, description, owner, property_type, bedrooms, bathrooms, area_sqft)
VALUES
  ('Manhattan Skyline Penthouse', 15000, 'New York, USA', 'Stunning penthouse with panoramic city views, modern finishes, and rooftop access.', 'GDEMO1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Penthouse', 4, 3, 3200),
  ('Beachfront Villa', 8500, 'Miami, USA', 'Luxury beachfront property with private pool and direct ocean access.', 'GDEMO2XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'Villa', 5, 4, 4800);
