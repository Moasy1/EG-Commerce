-- Migration: 0004_profile_management.sql
-- Real Profile Management & RLS Policies for EG-Commerce

-- 1. Ensure all profile fields exist in profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS display_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS is_creator BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_merchant BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Ensure unique index on username (ignoring nulls)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username ON profiles(LOWER(username)) WHERE username IS NOT NULL;

-- 3. RLS Policies for Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all profiles
DROP POLICY IF EXISTS "Public profiles can be viewed by anyone" ON profiles;
CREATE POLICY "Public profiles can be viewed by anyone" 
ON profiles FOR SELECT 
USING (true);

-- Allow authenticated users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow authenticated users to insert their own profile on signup
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);
