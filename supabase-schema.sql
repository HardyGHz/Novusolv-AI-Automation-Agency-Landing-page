-- ============================================
-- Novusolv Landing Page — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Leads table (Book a Call / Contact Form)
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'contact_form', -- 'hero_cta', 'footer_cta', 'contact_form'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 3. Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from the website)
CREATE POLICY "Allow anonymous insert on leads"
  ON public.leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on newsletter"
  ON public.newsletter_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Block all reads from anonymous users (only accessible via dashboard/service key)
-- No SELECT policy = no reads for anon

-- ============================================
-- 4. Call bookings (Book a Call form + Facebook campaign landing page)
-- Idempotent: safe to run whether or not the table already exists.
-- ============================================

-- 4a) Create the base table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS public.call_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4b) Backfill any missing columns (if the table pre-existed with fewer columns).
--     ADD COLUMN IF NOT EXISTS never errors and never drops data.
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS main_problem TEXT;
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'book_call_modal';
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS utm_source TEXT;
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS utm_medium TEXT;
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS utm_campaign TEXT;
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS utm_content TEXT;
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS utm_term TEXT;
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS landing_page TEXT;
ALTER TABLE public.call_bookings ADD COLUMN IF NOT EXISTS referrer TEXT;

-- 4c) RLS + anon insert policy (drop-then-create keeps it idempotent)
ALTER TABLE public.call_bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous insert on call_bookings" ON public.call_bookings;
CREATE POLICY "Allow anonymous insert on call_bookings"
  ON public.call_bookings FOR INSERT
  TO anon
  WITH CHECK (true);
