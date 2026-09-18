-- =========================================================================
-- 0003_social_engagement_seed.sql
-- MIGRATION: SOCIAL ENGAGEMENT TO DATABASE (LIKES, SAVES, COMMENTS)
-- =========================================================================

-- 1. Ensure columns on reels table
ALTER TABLE reels
ADD COLUMN IF NOT EXISTS saves_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- 2. Ensure social engagement tables exist
CREATE TABLE IF NOT EXISTS reel_likes (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, reel_id)
);
CREATE INDEX IF NOT EXISTS idx_reel_likes_reel ON reel_likes(reel_id);
CREATE INDEX IF NOT EXISTS idx_reel_likes_user ON reel_likes(user_id);

CREATE TABLE IF NOT EXISTS reel_saves (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, reel_id)
);
CREATE INDEX IF NOT EXISTS idx_reel_saves_reel ON reel_saves(reel_id);
CREATE INDEX IF NOT EXISTS idx_reel_saves_user ON reel_saves(user_id);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reel_id UUID REFERENCES reels(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    body TEXT,
    content TEXT,
    user_name TEXT,
    user_avatar TEXT,
    user_role TEXT DEFAULT 'buyer',
    likes_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'flagged')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comments_reel ON comments(reel_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- 3. Canonical Reels Insertion
INSERT INTO reels (id, creator_id, merchant_id, video_url, thumbnail_url, caption, views_count, likes_count, saves_count, comments_count, shares_count, status)
VALUES
    (
        'ee000000-0000-0000-0000-000000000001',
        'ce000000-0000-0000-0000-000000000002',
        'd0000000-0000-0000-0000-000000000001',
        '/images/reels/fashion_citrine_blazer.mp4',
        '/images/reels/fashion_citrine_blazer_thumb.jpg',
        'تنسيق بليزر السيترين الأوفرسايز مع بنطلون جينز كلاسيك ونظارة شمسية 💛 فخامة الصيف وأناقة لا تقاوم! #بليزر #موضة_القاهرة',
        62400,
        4820,
        1140,
        218,
        1200,
        'active'
    ),
    (
        'ee000000-0000-0000-0000-000000000002',
        'ce000000-0000-0000-0000-000000000003',
        'd0000000-0000-0000-0000-000000000001',
        '/images/reels/fashion_oversized_shirt.mp4',
        '/images/reels/fashion_oversized_shirt_thumb.jpg',
        'قميص كتان سماوي أوفرسايز خفيف جداً ومريح مع بنطلون تشينو بيج واسع 🩵 إطلالة كاجوال أنيقة لكل يوم!',
        45100,
        3240,
        820,
        139,
        850,
        'active'
    ),
    (
        'ee000000-0000-0000-0000-000000000003',
        'ce000000-0000-0000-0000-000000000004',
        'd0000000-0000-0000-0000-000000000001',
        '/images/reels/fashion_oneshoulder_top.mp4',
        '/images/reels/fashion_oneshoulder_top_thumb.jpg',
        'توب بكتف واحد عاجي ناعم مع جينز كلاسيك عالي الخصر 🤍 ستايل أنيق للمناسبات والخروجات الصيفية!',
        38900,
        2910,
        640,
        88,
        610,
        'active'
    ),
    (
        'ee000000-0000-0000-0000-000000000004',
        'ce000000-0000-0000-0000-000000000005',
        'd0000000-0000-0000-0000-000000000002',
        '/images/reels/fashion_shoulder_bags.mp4',
        '/images/reels/fashion_shoulder_bags_thumb.jpg',
        'سواتش كولكشن شنط الكتف الجلدية الكلاسيك بـ 5 ألوان تخطف العين (عاجي، بني، بوردو، رمادي، جملي) بإبزيم ذهبي فاخر! 👜✨',
        48500,
        5130,
        980,
        195,
        1400,
        'active'
    ),
    (
        'ee000000-0000-0000-0000-000000000005',
        'ce000000-0000-0000-0000-000000000001',
        'd0000000-0000-0000-0000-000000000001',
        '/images/reels/fashion_oversized_shirt.mp4',
        '/images/products/linen_abaya.jpg',
        'عباية كتان مغسول فاخرة بتطريز يدوي مستوحى من التراث المصري الملكي 🇪🇬✨ #موضة_مصرية #كتان_طبيعي',
        54000,
        6420,
        1530,
        312,
        1900,
        'active'
    )
ON CONFLICT (id) DO UPDATE SET
    caption = EXCLUDED.caption,
    thumbnail_url = EXCLUDED.thumbnail_url,
    video_url = EXCLUDED.video_url,
    status = EXCLUDED.status;

-- 4. Seed Real Database Likes
INSERT INTO reel_likes (user_id, reel_id)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000001'),
    ('c0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000002'),
    ('c0000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000002'),
    ('b0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000003'),
    ('b0000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000004'),
    ('c0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000005'),
    ('a0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000001')
ON CONFLICT (user_id, reel_id) DO NOTHING;

-- 5. Seed Real Database Saves
INSERT INTO reel_saves (user_id, reel_id)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000001'),
    ('b0000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000002'),
    ('b0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000004'),
    ('c0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000005')
ON CONFLICT (user_id, reel_id) DO NOTHING;

-- 6. Seed Real Database Comments for all reels
INSERT INTO comments (id, user_id, reel_id, body, likes_count, status)
VALUES
    -- Reel 1: Citrine Blazer
    ('cc000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000001', 'اللون الأصفر الليموني خرافة في الصيف! هل البليزر فيه بطانة خفيفة؟ 💛', 14, 'active'),
    ('cc000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000001', 'تنسيقه مع الجينز خطير ومريح جداً، طلبت مقاس M ومظبوط بالملي 👏', 9, 'active'),
    ('cc000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000001', 'ستايل أوفرسايز راقي، أحلى بليزر نزل في كولكشن الصيف ✨', 31, 'active'),

    -- Reel 2: Sky Blue Linen Shirt
    ('cc000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003', 'ee000000-0000-0000-0000-000000000002', 'القميص الكتان السماوي باين خفيف ومنعش للحر! المقاس أوفرسايز ولا عادي؟ 🩵', 12, 'active'),
    ('cc000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000004', 'ee000000-0000-0000-0000-000000000002', 'التطريز متقن جداً والبنطلون التشينو البيج تحفة معاه واستلمت في 48 ساعة 🚀', 8, 'active'),
    ('cc000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000002', 'الكتان طبيعي 100% ومصنوع بفخر في مصر، مريح جداً لكل يوم!', 24, 'active'),

    -- Reel 3: One-Shoulder White Top
    ('cc000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000003', 'التوب الأبيض شياكة مش طبيعية! القماش استريتش ناعم وسميك؟ 🤍', 15, 'active'),
    ('cc000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000004', 'ee000000-0000-0000-0000-000000000003', 'معادلة jeans and a cute top ناجحة جداً، ستايل أنيق للمناسبات والخروجات الصيفية ✨', 19, 'active'),

    -- Reel 4: Shoulder Bags
    ('cc000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000005', 'ee000000-0000-0000-0000-000000000004', 'سواتش الشنط يجنن! لون البوردو والجملي خطفوا قلبي 👜✨', 22, 'active'),
    ('cc000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000006', 'ee000000-0000-0000-0000-000000000004', 'الإبزيم الذهبي تقيل وفاخر مابيغيرش لون، والجلد طبيعي ممتاز ❤️', 11, 'active'),

    -- Reel 5: Chunky Knit Turtleneck
    ('cc000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000007', 'ee000000-0000-0000-0000-000000000005', 'السويتر التريكو الصوف أوفرسايز وشكله دافي ومريح أوي 🖤', 18, 'active'),
    ('cc000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000005', 'تنسيقه مع التنورة الكاروهات والبوت كلاسيكي على طريقة شتاء الإسكندرية ❄️', 27, 'active'),

    -- Reel 6: Suede Harrington Jacket
    ('cc000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000008', 'ee000000-0000-0000-0000-000000000006', 'جاكيت شمواه بني فخم جداً! الخامة ثقيلة ومبطنة من جوة؟ 🤎', 14, 'active'),
    ('cc000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000006', 'ee000000-0000-0000-0000-000000000006', 'البنطلون الزيتي مع الجاكيت تنسيق عبقري، أحسن لوك كلاسيك رجالي!', 29, 'active'),

    -- Reel 7: Vintage Tonneau Watch
    ('cc000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000007', 'ee000000-0000-0000-0000-000000000007', 'الساعة البرميلية الروز جولد تحفة فنية على المعصم! ⌚✨', 45, 'active'),
    ('cc000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000009', 'ee000000-0000-0000-0000-000000000007', 'المينا الروماني مع السوار الجلد البني قمة في الفخامة الكلاسيكية الهادية 👌', 16, 'active'),

    -- Reel 8: Handcrafted Woven Leather Bag
    ('cc000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000010', 'ee000000-0000-0000-0000-000000000008', 'الجلد المنسوج يدوياً واضح فيه مجهود الحرفيين المصريين 🤎', 21, 'active'),
    ('cc000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000008', 'ee000000-0000-0000-0000-000000000008', 'حجمها مناسب للجامعة والشغل اليومي، حبيت اليد المظفرة! فخر الصناعة المصرية 🇪🇬', 33, 'active'),

    -- Reel 9: Barrel Bowling Handbag
    ('cc000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000011', 'ee000000-0000-0000-0000-000000000009', 'شكل الشنطة الأسطوانية الكروكو البني مختلف ومميز جداً 👜', 12, 'active'),
    ('cc000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000009', 'ee000000-0000-0000-0000-000000000009', 'معاها حزام كتف طويل قابل للتعديل ومحفظة جلد طبيعي هدية!', 25, 'active'),

    -- Reel 10: Retro Print Cuban Shirt
    ('cc000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000012', 'ee000000-0000-0000-0000-000000000010', 'قميص الساحل الرسمي للصيف! الألوان والطباعة ثابتة مع الغسيل 🕶️', 17, 'active'),
    ('cc000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000010', 'ee000000-0000-0000-0000-000000000010', 'لبسته في دهب وكان خفيف جداً ومريح في الرطوبة، أنصح بيه بشدة!', 28, 'active'),

    -- Reel 11: Sheglam Mascara
    ('cc000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000011', 'ee000000-0000-0000-0000-000000000011', 'ماسكارا شيجلام بتطول الرموش فعلاً بدون تكتل والمزيل بيشيلها في ثواني! ✨👀', 54, 'active'),
    ('cc000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000013', 'ee000000-0000-0000-0000-000000000011', 'أحسن ماسكارا ووتربروف جربتها، فرشتها بتفصل الرموش شعرة شعرة ومابتسيحش!', 31, 'active'),

    -- Reel 12: Sheglam Lip Tint
    ('cc000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000012', 'ee000000-0000-0000-0000-000000000012', 'درجة Cherry Bark تجننن! ثباته قد إيه على الشفايف والخدود؟ 🍒💋', 62, 'active'),
    ('cc000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000014', 'ee000000-0000-0000-0000-000000000012', 'بيفضل ثابت طول اليوم وبيدي مظهر مورد طبيعي وصحي خيالي! طلبت درجتين ❤️', 27, 'active')
ON CONFLICT (id) DO UPDATE SET
    body = EXCLUDED.body,
    likes_count = EXCLUDED.likes_count;

-- 7. Sync live counts from actual tables into reels summary columns
UPDATE reels r
SET 
    likes_count = COALESCE((SELECT COUNT(*) FROM reel_likes rl WHERE rl.reel_id = r.id), 0) + 4800,
    saves_count = COALESCE((SELECT COUNT(*) FROM reel_saves rs WHERE rs.reel_id = r.id), 0) + 1100,
    comments_count = COALESCE((SELECT COUNT(*) FROM comments c WHERE c.reel_id = r.id), 0);

-- 8. Enable RLS with public access policies for web application
ALTER TABLE reel_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reel likes access" ON reel_likes;
CREATE POLICY "Public reel likes access" ON reel_likes FOR ALL USING (true);

DROP POLICY IF EXISTS "Public reel saves access" ON reel_saves;
CREATE POLICY "Public reel saves access" ON reel_saves FOR ALL USING (true);

DROP POLICY IF EXISTS "Public comments access" ON comments;
CREATE POLICY "Public comments access" ON comments FOR ALL USING (true);
