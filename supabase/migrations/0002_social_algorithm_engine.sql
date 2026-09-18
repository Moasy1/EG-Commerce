-- Migration: 0002_social_algorithm_engine.sql
-- Social Engine & Algorithm Engine Architecture for EG-Commerce

-- 1. EXTEND PROFILES WITH MULTI-ROLE CAPABILITIES & METADATA
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS is_creator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_merchant BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- 2. SOCIAL GRAPH: FOLLOWS
CREATE TABLE IF NOT EXISTS follows (
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- 3. EXTEND REELS FOR ALGORITHM & RECOMMENDATION
ALTER TABLE reels
ADD COLUMN IF NOT EXISTS duration_ms INTEGER DEFAULT 15000,
ADD COLUMN IF NOT EXISTS quality_score NUMERIC(5,2) DEFAULT 0.70,
ADD COLUMN IF NOT EXISTS engagement_score NUMERIC(5,2) DEFAULT 0.50,
ADD COLUMN IF NOT EXISTS conversion_score NUMERIC(5,2) DEFAULT 0.30,
ADD COLUMN IF NOT EXISTS trend_score NUMERIC(5,2) DEFAULT 0.50,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'ar',
ADD COLUMN IF NOT EXISTS category_id TEXT,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW();

-- 4. EXTEND REEL PRODUCTS FOR INTERACTIVE SHOPPING
ALTER TABLE reel_products
ADD COLUMN IF NOT EXISTS tag_x NUMERIC(5,2) DEFAULT 50.00,
ADD COLUMN IF NOT EXISTS tag_y NUMERIC(5,2) DEFAULT 75.00,
ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

-- 5. SOCIAL ENGAGEMENT: LIKES, SAVES, SHARES
CREATE TABLE IF NOT EXISTS reel_likes (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, reel_id)
);
CREATE INDEX IF NOT EXISTS idx_reel_likes_reel ON reel_likes(reel_id);

CREATE TABLE IF NOT EXISTS reel_saves (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, reel_id)
);
CREATE INDEX IF NOT EXISTS idx_reel_saves_user ON reel_saves(user_id);

CREATE TABLE IF NOT EXISTS saved_products (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_products_user ON saved_products(user_id);

CREATE TABLE IF NOT EXISTS saved_reels (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, reel_id)
);
CREATE INDEX IF NOT EXISTS idx_saved_reels_user ON saved_reels(user_id);

-- 6. FIRST-CLASS COMMENTS & REPLIES
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comments_reel ON comments(reel_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

CREATE TABLE IF NOT EXISTS comment_likes (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE IF NOT EXISTS reel_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE NOT NULL,
    share_type TEXT NOT NULL CHECK (share_type IN ('copy_link', 'whatsapp', 'internal_share', 'external')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reel_shares_reel ON reel_shares(reel_id);

-- 7. SESSIONS TRACKING
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    anonymous_id UUID NOT NULL,
    device_type TEXT,
    platform TEXT,
    country TEXT DEFAULT 'EG',
    language TEXT DEFAULT 'ar',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_anon ON sessions(anonymous_id);

-- 8. GRANULAR USER EVENTS (ALGORITHM FOUNDATION)
CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    anonymous_id UUID NOT NULL,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    reel_id UUID REFERENCES reels(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
    position INTEGER,
    duration_ms INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_events_user ON user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_anon ON user_events(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_user_events_type ON user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_reel ON user_events(reel_id);
CREATE INDEX IF NOT EXISTS idx_user_events_created ON user_events(created_at DESC);

-- 9. USER INTERESTS & AFFINITIES
CREATE TABLE IF NOT EXISTS user_interests (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    interest_score NUMERIC(6,3) DEFAULT 0.000,
    interaction_count INTEGER DEFAULT 1,
    last_interacted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, category_id)
);
CREATE INDEX IF NOT EXISTS idx_user_interests_user ON user_interests(user_id);

CREATE TABLE IF NOT EXISTS user_creator_affinity (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    score NUMERIC(6,3) DEFAULT 0.000,
    interaction_count INTEGER DEFAULT 1,
    last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, creator_id)
);
CREATE INDEX IF NOT EXISTS idx_creator_affinity_user ON user_creator_affinity(user_id);

CREATE TABLE IF NOT EXISTS user_merchant_affinity (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    score NUMERIC(6,3) DEFAULT 0.000,
    interaction_count INTEGER DEFAULT 1,
    last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, merchant_id)
);
CREATE INDEX IF NOT EXISTS idx_merchant_affinity_user ON user_merchant_affinity(user_id);

-- 10. ATTRIBUTION ENGINE
CREATE TABLE IF NOT EXISTS attribution_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    anonymous_id UUID,
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
    merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);
CREATE INDEX IF NOT EXISTS idx_attr_user_prod ON attribution_sessions(user_id, product_id);

CREATE TABLE IF NOT EXISTS reel_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attribution_session_id UUID REFERENCES attribution_sessions(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    order_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
    reel_id UUID REFERENCES reels(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
    merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    revenue_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    commission_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reel_conversions_reel ON reel_conversions(reel_id);
CREATE INDEX IF NOT EXISTS idx_reel_conversions_creator ON reel_conversions(creator_id);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_creator_affinity ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_merchant_affinity ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribution_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_conversions ENABLE ROW LEVEL SECURITY;

-- Read policies (Public / User specific)
CREATE POLICY "Public profiles can be viewed by anyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public reels can be viewed by anyone" ON reels FOR SELECT USING (visibility = 'public' AND status = 'active');
CREATE POLICY "Public comments can be viewed by anyone" ON comments FOR SELECT USING (status = 'active');
CREATE POLICY "Users can read own follows" ON follows FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = following_id);
CREATE POLICY "Users can read own likes" ON reel_likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own saves" ON reel_saves FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own saved products" ON saved_products FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own saved reels" ON saved_reels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can read own interests" ON user_interests FOR SELECT USING (auth.uid() = user_id);

-- Write policies (Authenticated users)
CREATE POLICY "Authenticated users can manage follows" ON follows FOR ALL USING (auth.uid() = follower_id);
CREATE POLICY "Authenticated users can manage reel likes" ON reel_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can manage reel saves" ON reel_saves FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can manage saved products" ON saved_products FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can manage saved reels" ON saved_reels FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Authenticated users can add comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can edit own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert events" ON user_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert reel shares" ON reel_shares FOR INSERT WITH CHECK (true);
