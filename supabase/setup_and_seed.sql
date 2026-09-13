-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- For production, link this to REFERENCES auth.users(id)
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
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    store_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
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

-- ==========================================
-- SEED DATA
-- ==========================================

-- A. Create a dummy profile for our mock merchants
INSERT INTO profiles (id, email, name, role) 
VALUES 
('11111111-1111-1111-1111-111111111111', 'talieska@eg-commerce.com', 'Talieska Studio', 'merchant'),
('22222222-2222-2222-2222-222222222222', 'khan@eg-commerce.com', 'Khan El Khalili', 'merchant')
ON CONFLICT (email) DO NOTHING;

-- B. Insert Merchants
INSERT INTO merchants (id, user_id, store_name, slug, is_verified) 
VALUES 
('m0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Talieska Studio • تاليسكا ستوديو', 'talieska', true),
('m0000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Khan El Khalili Craft • ورشة خان الخليلي', 'khan-el-khalili', true)
ON CONFLICT (slug) DO NOTHING;

-- C. Insert Products
INSERT INTO products (merchant_id, title, slug, description, base_price, sale_price, stock_quantity, status, images, category_id)
VALUES 
('m0000000-0000-0000-0000-000000000001', 'فستان كتان كايزن بوهيمي • Kaizen Linen Dress', 'p-fashion-kaizen-dress', 'فستان بوهيمي أنيق مصنوع من الكتان المصري الطبيعي 100%...', 1450, 1450, 45, 'active', ARRAY['/images/reels/fashion_kaizen_dress_thumb.jpg'], 'Linen & Dresses كاجوال وكتان'),
('m0000000-0000-0000-0000-000000000001', 'قميص كتان سماوي أوفرسايز • Sky Blue Linen Shirt', 'p-fashion-oversized-shirt', 'قميص كتان مصري مريح بقصة أوفرسايز عصرية...', 850, 850, 32, 'active', ARRAY['/images/reels/fashion_oversized_shirt_thumb.jpg'], 'Linen & Dresses كاجوال وكتان'),
('m0000000-0000-0000-0000-000000000002', 'حقيبة كتف جلدية كلاسيك • Classic Leather Shoulder Bag', 'p-fashion-shoulder-bags', 'حقيبة كتف كلاسيكية من الجلد الطبيعي المعالج...', 1850, 1850, 12, 'active', ARRAY['/images/reels/fashion_shoulder_bags_thumb.jpg'], 'Handmade Leather منتجات جلدية')
ON CONFLICT (slug) DO NOTHING;
