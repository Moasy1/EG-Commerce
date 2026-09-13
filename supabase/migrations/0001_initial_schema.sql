-- Initial Schema for EG Commerce

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'creator', 'merchant', 'admin')),
    reward_points_balance INTEGER DEFAULT 0 CHECK (reward_points_balance >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MERCHANTS
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    store_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATORS
CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    bio TEXT,
    social_links JSONB DEFAULT '{}',
    total_earnings DECIMAL(10,2) DEFAULT 0.00,
    rating DECIMAL(3,2) DEFAULT 5.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    sale_price DECIMAL(10,2) CHECK (sale_price >= 0),
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    affiliate_commission_rate DECIMAL(5,2) DEFAULT 0.00,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    images TEXT[] DEFAULT '{}',
    category_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REELS
CREATE TABLE reels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
    merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    campaign_application_id UUID, -- Will reference ugc_applications
    video_provider_id TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'active', 'flagged', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REEL PRODUCTS
CREATE TABLE reel_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    display_order INTEGER DEFAULT 0,
    UNIQUE(reel_id, product_id)
);

-- 7. UGC CAMPAIGNS
CREATE TABLE ugc_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    brief_requirements TEXT,
    reward_type TEXT CHECK (reward_type IN ('free_product', 'fixed_pay', 'commission_only', 'hybrid')),
    fixed_reward_amount DECIMAL(10,2) DEFAULT 0.00,
    slots_available INTEGER DEFAULT 1 CHECK (slots_available >= 0),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. UGC APPLICATIONS
CREATE TABLE ugc_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES ugc_campaigns(id) ON DELETE CASCADE NOT NULL,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'product_shipped', 'content_submitted', 'approved', 'rejected')),
    draft_video_url TEXT,
    brand_feedback TEXT,
    payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'escrowed', 'released', 'refunded')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, creator_id)
);

ALTER TABLE reels ADD CONSTRAINT fk_reels_campaign_application FOREIGN KEY (campaign_application_id) REFERENCES ugc_applications(id) ON DELETE SET NULL;

-- 9. CARTS & ITEMS
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'converted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cart_id, product_id)
);

-- 10. ORDERS & ITEMS
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'payment_pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    discount_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (discount_amount >= 0),
    shipping_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (shipping_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    reward_points_used INTEGER DEFAULT 0 CHECK (reward_points_used >= 0),
    reward_points_earned INTEGER DEFAULT 0 CHECK (reward_points_earned >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    commission_amount DECIMAL(10,2) DEFAULT 0.00 CHECK (commission_amount >= 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'))
);

-- 11. REWARDS
CREATE TABLE reward_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earn', 'redeem', 'refund', 'admin_adjustment')),
    points INTEGER NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ATTRIBUTION (REEL CONVERSIONS)
CREATE TABLE reel_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE NOT NULL,
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE NOT NULL,
    creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
    commission_amount DECIMAL(10,2) NOT NULL CHECK (commission_amount >= 0),
    status TEXT DEFAULT 'pending_fulfillment' CHECK (status IN ('pending_fulfillment', 'credited', 'cancelled_refund')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_reels_status_created ON reels(status, created_at DESC);
CREATE INDEX idx_reel_products_reel ON reel_products(reel_id);
CREATE INDEX idx_reel_products_product ON reel_products(product_id);
CREATE INDEX idx_products_merchant ON products(merchant_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_merchant ON order_items(merchant_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_ugc_campaigns_merchant ON ugc_campaigns(merchant_id);
CREATE INDEX idx_reward_transactions_user ON reward_transactions(user_id);
