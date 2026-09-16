-- ============================================================
-- BhuNirnay — Officer Auth Schema
-- Run this in your Supabase SQL Editor (project > SQL Editor)
-- ============================================================

-- 1. OTP storage table
CREATE TABLE IF NOT EXISTS officer_otps (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  otp_code    text NOT NULL,
  expires_at  timestamptz NOT NULL,
  verified    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Officer profiles table
CREATE TABLE IF NOT EXISTS officers (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  full_name     text NOT NULL,
  employee_id   text NOT NULL,
  department    text NOT NULL,
  designation   text NOT NULL,
  district      text NOT NULL,
  -- status flow: pending_verification → approved | rejected
  status        text NOT NULL DEFAULT 'pending_verification'
                CHECK (status IN ('pending_verification', 'approved', 'rejected')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 3. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER officers_updated_at
  BEFORE UPDATE ON officers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. RLS — service role bypasses these; anon/authed users cannot read
ALTER TABLE officer_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;

-- No public policies — all access goes through backend service role key
-- ============================================================
