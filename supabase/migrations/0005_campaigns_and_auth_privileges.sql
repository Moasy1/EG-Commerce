-- Migration: 0005_campaigns_and_auth_privileges.sql
-- UGC Campaign System & User Privilege Mapping for EG-Commerce

-- 1. Ensure ugc_campaigns table exists with all required fields
CREATE TABLE IF NOT EXISTS ugc_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    product_id TEXT,
    title TEXT NOT NULL,
    brief_requirements TEXT,
    reward_type TEXT DEFAULT 'hybrid' CHECK (reward_type IN ('free_product', 'fixed_pay', 'commission_only', 'hybrid')),
    fixed_reward_amount DECIMAL(10,2) DEFAULT 0.00,
    commission_rate DECIMAL(5,2) DEFAULT 15.00,
    slots_available INTEGER DEFAULT 5 CHECK (slots_available >= 0),
    deadline DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
    status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Ensure ugc_applications table exists
CREATE TABLE IF NOT EXISTS ugc_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES ugc_campaigns(id) ON DELETE CASCADE NOT NULL,
    creator_id TEXT NOT NULL,
    creator_name TEXT,
    creator_handle TEXT,
    creator_avatar TEXT,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'approved', 'rejected', 'product_shipped', 'draft_submitted', 'completed')),
    draft_video_url TEXT,
    notes TEXT,
    brand_feedback TEXT,
    payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'escrowed', 'released', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for fast query performance
CREATE INDEX IF NOT EXISTS idx_ugc_campaigns_merchant ON ugc_campaigns(merchant_id);
CREATE INDEX IF NOT EXISTS idx_ugc_campaigns_status ON ugc_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ugc_applications_campaign ON ugc_applications(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ugc_applications_creator ON ugc_applications(creator_id);

-- 4. Enable Row-Level Security & Policies
ALTER TABLE ugc_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ugc_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active campaigns" ON ugc_campaigns;
CREATE POLICY "Public can view active campaigns" 
ON ugc_campaigns FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create campaigns" ON ugc_campaigns;
CREATE POLICY "Authenticated users can create campaigns" 
ON ugc_campaigns FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update campaigns" ON ugc_campaigns;
CREATE POLICY "Authenticated users can update campaigns" 
ON ugc_campaigns FOR UPDATE 
USING (true);

DROP POLICY IF EXISTS "Public can view applications" ON ugc_applications;
CREATE POLICY "Public can view applications" 
ON ugc_applications FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage applications" ON ugc_applications;
CREATE POLICY "Authenticated users can manage applications" 
ON ugc_applications FOR ALL 
USING (true);
