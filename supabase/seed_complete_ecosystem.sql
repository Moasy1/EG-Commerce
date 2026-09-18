-- =========================================================================
-- EG-COMMERCE COMPLETE ECOSYSTEM SEED (Merchants, Creators, Products, Reels, UGC)
-- =========================================================================

-- 1. PROFILES (Merchants, Creators, Buyers, Admin)
INSERT INTO profiles (id, email, phone, name, role, avatar_url, reward_points_balance)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'talieska@eg-commerce.com', '+201002345678', 'Talieska Studio • تاليسكا ستوديو', 'merchant', '/images/brands/talieska_logo.jpg', 1450),
    ('22222222-2222-2222-2222-222222222222', 'khan@eg-commerce.com', '+201112345678', 'Khan El Khalili Craft • ورشة خان الخليلي', 'merchant', '/images/products/copper_lantern.jpg', 920),
    ('33333333-3333-3333-3333-333333333333', 'tiba@eg-commerce.com', '+201223456789', 'Tiba Jewelry • مجوهرات طيبة', 'merchant', '/images/brands/talieska_logo.jpg', 1100),
    ('c0000000-0000-0000-0000-000000000001', 'yasmin@eg-commerce.com', '+201011122233', 'ياسمين السيد • Yasmin Sayed', 'creator', '/images/reels/reel_2.jpg', 890),
    ('c0000000-0000-0000-0000-000000000002', 'cairochic@eg-commerce.com', '+201022233344', 'سارة المهدي (كايرو شيك) • Cairo Chic', 'creator', '/images/reels/fashion_citrine_blazer_thumb.jpg', 1250),
    ('c0000000-0000-0000-0000-000000000003', 'salma@eg-commerce.com', '+201033344455', 'سلمى ستايلز • Salma Styles', 'creator', '/images/reels/fashion_oversized_shirt_thumb.jpg', 670),
    ('c0000000-0000-0000-0000-000000000004', 'zeina@eg-commerce.com', '+201044455566', 'زينة أوفت • Zeina OOTD', 'creator', '/images/reels/fashion_oneshoulder_top_thumb.jpg', 540),
    ('c0000000-0000-0000-0000-000000000005', 'farida@eg-commerce.com', '+201055566677', 'فريدة أتيليه • Farida Atelier', 'creator', '/images/reels/fashion_woven_bag_thumb.jpg', 780),
    ('b0000000-0000-0000-0000-000000000001', 'mariam@eg-commerce.com', '+201200001111', 'مريم الشافعي • Mariam El-Shafei', 'buyer', '/images/reels/reel_1.jpg', 450),
    ('b0000000-0000-0000-0000-000000000002', 'nourhan@eg-commerce.com', '+201200002222', 'نورهان كريم • Nourhan Karim', 'buyer', '/images/reels/reel_2.jpg', 310),
    ('a0000000-0000-0000-0000-000000000001', 'admin@eg-commerce.com', '+201000000000', 'Egyptian Commerce SuperAdmin', 'admin', '/images/brands/talieska_logo.jpg', 10000)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    avatar_url = EXCLUDED.avatar_url,
    reward_points_balance = EXCLUDED.reward_points_balance;

-- 2. MERCHANTS
INSERT INTO merchants (id, user_id, store_name, slug, commission_rate, is_verified)
VALUES
    ('d0000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Talieska Studio • تاليسكا ستوديو', 'talieska', 10.00, true),
    ('d0000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'Khan El Khalili Craft • ورشة خان الخليلي', 'khan-craft', 12.50, true),
    ('d0000000-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'Tiba Jewelry • مجوهرات طيبة', 'tiba-jewelry', 15.00, true)
ON CONFLICT (id) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    slug = EXCLUDED.slug,
    is_verified = EXCLUDED.is_verified;

-- 3. CREATORS
INSERT INTO creators (id, user_id, bio, social_links, total_earnings, rating)
VALUES
    ('ce000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '👗 صانعة محتوى موضة وموديل أزياء مصرية | سفيرة براند تاليسكا ستوديو للكتان الطبيعي', '{"instagram": "@yasmin_style", "tiktok": "@yasmin.fashion"}'::jsonb, 8450.00, 4.95),
    ('ce000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', '✨ منسقة أزياء ومدونة موضة مصرية • تنسيق الكولكشنات المعاصرة والستايل الصيفي الراقي', '{"instagram": "@cairo_chic", "tiktok": "@cairochic.style"}'::jsonb, 12300.00, 4.98),
    ('ce000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', '🩵 قمصان وتنسيقات صيفية مريحة وعملية لكل يوم | عاشقة للموضة المستدامة', '{"instagram": "@salma.styles", "tiktok": "@salma_ootd"}'::jsonb, 5120.00, 4.88),
    ('ce000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', '🤍 أطقم المناسبات والفساتين الكلاسيك | تنسيقات الجينز والتوبات المعاصرة', '{"instagram": "@zeina_ootd"}'::jsonb, 4200.00, 4.85),
    ('ce000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', '👜 الحرف اليدوية والشنط الجلدية الطبيعية بتطريز أصيل', '{"instagram": "@farida.atelier"}'::jsonb, 6800.00, 4.92)
ON CONFLICT (id) DO UPDATE SET
    bio = EXCLUDED.bio,
    social_links = EXCLUDED.social_links,
    total_earnings = EXCLUDED.total_earnings,
    rating = EXCLUDED.rating;

-- 4. PRODUCTS
INSERT INTO products (id, merchant_id, title, slug, description, base_price, sale_price, stock_quantity, affiliate_commission_rate, status, images, category_id)
VALUES
    ('ba000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'بليزر أوفرسايز أصفر ليموني راقي • Citrine Tailored Blazer', 'p-fashion-blazer', 'بليزر عصري واسع بلون السيترين الأصفر الفاقع...', 2200.00, 2200.00, 28, 15.00, 'active', ARRAY['/images/reels/fashion_citrine_blazer_thumb.jpg'], 'women'),
    ('ba000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'فستان كتان كايزن بوهيمي • Kaizen Linen Dress', 'p-fashion-kaizen-dress', 'فستان بوهيمي أنيق مصنوع من الكتان المصري الطبيعي 100%...', 1450.00, 1450.00, 45, 12.00, 'active', ARRAY['/images/reels/fashion_kaizen_dress_thumb.jpg'], 'women'),
    ('ba000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'قميص كتان سماوي بقصة أوفرسايز • Sky Blue Linen Shirt', 'p-fashion-oversized-shirt', 'قميص صيفي واسع من الكتان المصري المعالج...', 950.00, 950.00, 36, 10.00, 'active', ARRAY['/images/reels/fashion_oversized_shirt_thumb.jpg'], 'streetwear'),
    ('ba000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'توب بكتف واحد عاجي ناعم • Asymmetric One-Shoulder Bodysuit', 'p-fashion-oneshoulder-top', 'توب كتف واحد عاجي أنيق بخامة استرتش ناعمة...', 680.00, 680.00, 50, 10.00, 'active', ARRAY['/images/reels/fashion_oneshoulder_top_thumb.jpg'], 'women'),
    ('ba000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000001', 'عباية كتان مغسول فاخرة بالتطريز اليدوي • Luxury Linen Abaya', 'p-fashion-linen-abaya', 'عباية كتان فاخرة ذات طابع ملكي مطرزة يدويًا...', 2850.00, 2850.00, 18, 15.00, 'active', ARRAY['/images/products/linen_abaya.jpg'], 'modest'),
    ('ba000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', 'حقيبة كتف جلدية كلاسيك بإبزيم ذهبي • Classic Leather Bag', 'p-fashion-shoulder-bags', 'حقيبة كتف كلاسيكية مصنوعة يدويًا من الجلد الطبيعي المعالج...', 1850.00, 1850.00, 22, 12.00, 'active', ARRAY['/images/reels/fashion_shoulder_bags_thumb.jpg'], 'women'),
    ('ba000000-0000-0000-0000-000000000007', 'd0000000-0000-0000-0000-000000000002', 'فانوس نحاس فاطمي منقوش يدوياً • Fatimid Brass Lantern', 'p-craft-copper-lantern', 'فانوس إضاءة أصيل مصنوع من النحاس الأحمر النقي...', 1450.00, 1450.00, 15, 15.00, 'active', ARRAY['/images/products/copper_lantern.jpg'], 'heritage'),
    ('ba000000-0000-0000-0000-000000000008', 'd0000000-0000-0000-0000-000000000002', 'حقيبة جلد منسوجة يدوياً بمقبض مضفر • Handcrafted Woven Leather Bag', 'p-fashion-woven-bag', 'حقيبة جلد طبيعي منسوجة بحرفية مصرية دقيقة...', 1950.00, 1950.00, 16, 14.00, 'active', ARRAY['/images/reels/fashion_woven_bag_thumb.jpg'], 'women'),
    ('ba000000-0000-0000-0000-000000000009', 'd0000000-0000-0000-0000-000000000003', 'قلادة زهرة اللوتس الفرعونية فضة 925 • Lotus Necklace', 'p-jewelry-lotus-necklace', 'قلادة ملكية مستوحاة من مقبرة توت عنخ آمون...', 1350.00, 1350.00, 30, 18.00, 'active', ARRAY['/images/brands/talieska_logo.jpg'], 'jewelry'),
    ('ba000000-0000-0000-0000-000000000010', 'd0000000-0000-0000-0000-000000000003', 'سوار مفتاح الحياة (عنخ) مرصع بالزركون • Ankh Charm Bracelet', 'p-jewelry-ankh-bracelet', 'سوار ناعم وراقي يجسد رمز الحياة المصري القديم...', 980.00, 980.00, 40, 16.00, 'active', ARRAY['/images/brands/talieska_logo.jpg'], 'jewelry')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    base_price = EXCLUDED.base_price,
    sale_price = EXCLUDED.sale_price,
    stock_quantity = EXCLUDED.stock_quantity;

-- 5. REELS
INSERT INTO reels (id, creator_id, merchant_id, video_url, thumbnail_url, caption, views_count, likes_count, shares_count, status)
VALUES
    ('ee000000-0000-0000-0000-000000000001', 'ce000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', '/images/reels/fashion_citrine_blazer.mp4', '/images/reels/fashion_citrine_blazer_thumb.jpg', 'تنسيق بليزر السيترين الأوفرسايز 💛 #بليزر #موضة_القاهرة', 62400, 4800, 1200, 'active'),
    ('ee000000-0000-0000-0000-000000000002', 'ce000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', '/images/reels/fashion_oversized_shirt.mp4', '/images/reels/fashion_oversized_shirt_thumb.jpg', 'قميص كتان سماوي أوفرسايز خفيف ومريح 🩵', 45100, 3200, 850, 'active'),
    ('ee000000-0000-0000-0000-000000000003', 'ce000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', '/images/reels/fashion_oneshoulder_top.mp4', '/images/reels/fashion_oneshoulder_top_thumb.jpg', 'توب بكتف واحد عاجي ناعم مع جينز كلاسيك 🤍', 38900, 2900, 610, 'active'),
    ('ee000000-0000-0000-0000-000000000004', 'ce000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000002', '/images/reels/fashion_shoulder_bags.mp4', '/images/reels/fashion_shoulder_bags_thumb.jpg', 'سواتش كولكشن شنط الكتف الجلدية الكلاسيك بإبزيم ذهبي فاخر! 👜✨', 48500, 5100, 1400, 'active'),
    ('ee000000-0000-0000-0000-000000000005', 'ce000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', '/images/reels/fashion_oversized_shirt.mp4', '/images/products/linen_abaya.jpg', 'فخامة الكتان الطبيعي والتطريز اليدوي المصري الأصيل ✨', 54000, 6400, 1900, 'active')
ON CONFLICT (id) DO UPDATE SET
    views_count = EXCLUDED.views_count,
    likes_count = EXCLUDED.likes_count;

-- 6. REEL PRODUCTS
INSERT INTO reel_products (id, reel_id, product_id, display_order)
VALUES
    ('ef000000-0000-0000-0000-000000000001', 'ee000000-0000-0000-0000-000000000001', 'ba000000-0000-0000-0000-000000000001', 1),
    ('ef000000-0000-0000-0000-000000000002', 'ee000000-0000-0000-0000-000000000002', 'ba000000-0000-0000-0000-000000000003', 1),
    ('ef000000-0000-0000-0000-000000000003', 'ee000000-0000-0000-0000-000000000003', 'ba000000-0000-0000-0000-000000000004', 1),
    ('ef000000-0000-0000-0000-000000000004', 'ee000000-0000-0000-0000-000000000004', 'ba000000-0000-0000-0000-000000000006', 1),
    ('ef000000-0000-0000-0000-000000000005', 'ee000000-0000-0000-0000-000000000005', 'ba000000-0000-0000-0000-000000000005', 1)
ON CONFLICT (id) DO NOTHING;

-- 7. UGC CAMPAIGNS
INSERT INTO ugc_campaigns (id, merchant_id, product_id, title, brief_requirements, reward_type, fixed_reward_amount, slots_available, status)
VALUES
    ('ca000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'ba000000-0000-0000-0000-000000000001', 'حملة تنسيقات بليزر السيترين • صيف 2026', 'تصوير فيديو ريلز 9:16 بمدة 15-30 ثانية لتنسيق بليزر السيترين.', 'hybrid', 1200.00, 5, 'active'),
    ('ca000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'ba000000-0000-0000-0000-000000000006', 'حملة إكسسوارات خان الخليلي التراثية الراقية', 'استعراض جودة الجلد الطبيعي والإبزيم المطلي بالذهب.', 'free_product', 0.00, 8, 'active')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    slots_available = EXCLUDED.slots_available;

-- 8. ORDERS & ORDER ITEMS
INSERT INTO orders (id, user_id, status, subtotal, discount_amount, shipping_amount, total_amount, reward_points_earned)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'paid', 1450.00, 0.00, 60.00, 1510.00, 145),
    ('f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'delivered', 1850.00, 100.00, 60.00, 1810.00, 185)
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status;

INSERT INTO order_items (id, order_id, product_id, merchant_id, creator_id, quantity, unit_price, commission_amount, status)
VALUES
    ('fa000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'ba000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000001', 'ce000000-0000-0000-0000-000000000001', 1, 1450.00, 174.00, 'shipped'),
    ('fa000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'ba000000-0000-0000-0000-000000000006', 'd0000000-0000-0000-0000-000000000002', 'ce000000-0000-0000-0000-000000000002', 1, 1850.00, 222.00, 'delivered')
ON CONFLICT (id) DO UPDATE SET
    status = EXCLUDED.status;
