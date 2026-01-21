-- Leads/Contact form submissions
CREATE TABLE IF NOT EXISTS ps_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID REFERENCES ps_sites(id) ON DELETE CASCADE,

  -- Contact info
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,

  -- Metadata
  source TEXT DEFAULT 'contact_form', -- 'contact_form' | 'quote_button' | 'phone_click'
  is_read BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Google Reviews link (simple version - just a URL, Pro only)
ALTER TABLE ps_sites ADD COLUMN IF NOT EXISTS google_reviews_url TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ps_leads_site_id ON ps_leads(site_id);
CREATE INDEX IF NOT EXISTS idx_ps_leads_created_at ON ps_leads(created_at DESC);

-- RLS for leads
ALTER TABLE ps_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (contact form is public)
CREATE POLICY "ps_leads_insert" ON ps_leads
  FOR INSERT WITH CHECK (true);

-- Site owners can view their leads
CREATE POLICY "ps_leads_select" ON ps_leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ps_sites
      WHERE ps_sites.id = ps_leads.site_id
      AND ps_sites.user_id = auth.uid()
    )
  );

-- Site owners can update leads (mark as read)
CREATE POLICY "ps_leads_update" ON ps_leads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM ps_sites
      WHERE ps_sites.id = ps_leads.site_id
      AND ps_sites.user_id = auth.uid()
    )
  );
