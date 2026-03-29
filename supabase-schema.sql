-- ============================================
-- Novusolv Landing Page — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. Leads table (Book a Call / Contact Form)
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  email TEXT,
  company TEXT,
  industry TEXT,
  pain_point TEXT,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'contact_form', -- 'hero_cta', 'footer_cta', 'contact_form', 'ai_strategist'
  intent_score TEXT, -- 'LOW', 'MID', 'HIGH'
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
