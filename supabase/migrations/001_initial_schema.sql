-- PageSnap Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends QuoteSnap shared auth)
CREATE TABLE IF NOT EXISTS ps_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Website configurations
CREATE TABLE IF NOT EXISTS ps_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES ps_profiles(id) ON DELETE CASCADE,

  -- Basic info
  slug TEXT UNIQUE NOT NULL,
  custom_domain TEXT,

  -- Content (AI-generated)
  company_name TEXT NOT NULL,
  headline TEXT,
  about_text TEXT,
  services JSONB, -- [{name, description, icon}]
  service_areas TEXT[],

  -- Contact
  phone TEXT,
  email TEXT,
  address TEXT,

  -- Social
  facebook_url TEXT,
  instagram_url TEXT,

  -- Design
  template TEXT DEFAULT 'classic' CHECK (template IN ('classic', 'modern', 'bold', 'minimal')),
  primary_color TEXT DEFAULT '#3b82f6',
  logo_url TEXT,

  -- QuoteSnap integration
  quotesnap_user_id UUID,
  show_quote_button BOOLEAN DEFAULT false,

  -- Meta
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio photos
CREATE TABLE IF NOT EXISTS ps_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES ps_sites(id) ON DELETE CASCADE,
  user_id UUID REFERENCES ps_profiles(id),

  url TEXT NOT NULL,
  thumbnail_url TEXT,

  -- AI-generated
  category TEXT DEFAULT 'general',
  caption TEXT,

  -- Before/After pairing
  is_before_after BOOLEAN DEFAULT false,
  pair_id UUID,
  is_before BOOLEAN,

  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials/Reviews
CREATE TABLE IF NOT EXISTS ps_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES ps_sites(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_location TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  project_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics (Pro only)
CREATE TABLE IF NOT EXISTS ps_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES ps_sites(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  page_views INT DEFAULT 0,
  unique_visitors INT DEFAULT 0,
  quote_clicks INT DEFAULT 0,
  phone_clicks INT DEFAULT 0,
  UNIQUE(site_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ps_sites_user_id ON ps_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_ps_sites_slug ON ps_sites(slug);
CREATE INDEX IF NOT EXISTS idx_ps_photos_site_id ON ps_photos(site_id);
CREATE INDEX IF NOT EXISTS idx_ps_photos_user_id ON ps_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_ps_reviews_site_id ON ps_reviews(site_id);
CREATE INDEX IF NOT EXISTS idx_ps_analytics_site_id ON ps_analytics(site_id);
CREATE INDEX IF NOT EXISTS idx_ps_analytics_date ON ps_analytics(date);

-- Function to increment page views
CREATE OR REPLACE FUNCTION increment_page_views(p_site_id UUID, p_date DATE)
RETURNS VOID AS $$
BEGIN
  INSERT INTO ps_analytics (site_id, date, page_views, unique_visitors)
  VALUES (p_site_id, p_date, 1, 1)
  ON CONFLICT (site_id, date)
  DO UPDATE SET page_views = ps_analytics.page_views + 1;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE ps_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ps_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ps_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ps_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ps_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON ps_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON ps_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON ps_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Sites policies
CREATE POLICY "Users can view own sites" ON ps_sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published sites" ON ps_sites
  FOR SELECT USING (is_published = true);

CREATE POLICY "Users can insert own sites" ON ps_sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sites" ON ps_sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sites" ON ps_sites
  FOR DELETE USING (auth.uid() = user_id);

-- Photos policies
CREATE POLICY "Users can view own photos" ON ps_photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view photos of published sites" ON ps_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ps_sites
      WHERE ps_sites.id = ps_photos.site_id
      AND ps_sites.is_published = true
    )
  );

CREATE POLICY "Users can insert own photos" ON ps_photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos" ON ps_photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos" ON ps_photos
  FOR DELETE USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view reviews of published sites" ON ps_reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ps_sites
      WHERE ps_sites.id = ps_reviews.site_id
      AND ps_sites.is_published = true
    )
  );

CREATE POLICY "Users can manage reviews for own sites" ON ps_reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM ps_sites
      WHERE ps_sites.id = ps_reviews.site_id
      AND ps_sites.user_id = auth.uid()
    )
  );

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON ps_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ps_sites
      WHERE ps_sites.id = ps_analytics.site_id
      AND ps_sites.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics" ON ps_analytics
  FOR INSERT WITH CHECK (true);

-- Create storage bucket for portfolio photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-photos', 'portfolio-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view portfolio photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-photos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete own photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'portfolio-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
