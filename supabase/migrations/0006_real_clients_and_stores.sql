-- =========================================================================
-- Phase 6: Real Clients & Verified Stores Bulk Patch
-- Inserts all 8 official stores, merchant profiles, products, and reels
-- =========================================================================

-- 1. Insert Merchant Profiles into profiles
INSERT INTO public.profiles (id, name, display_name, email, role, is_merchant, avatar_url, bio, reward_points_balance)
VALUES ('14100000-0000-4000-8000-000000000001', 'One Four One • ون فور ون', 'One Four One • ون فور ون', 'onefourone@egyptian-commerce.com', 'merchant', true, '/images/brands/onefourone_logo.jpg', '🔥 براند مصري رائد في الستريت وير والأزياء العصرية الصيفية بالقاهرة 🇪🇬 | تشكيلة حصرية بخامات قطنية ممتازة', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  role = 'merchant',
  is_merchant = true,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;

INSERT INTO public.profiles (id, name, display_name, email, role, is_merchant, avatar_url, bio, reward_points_balance)
VALUES ('40000000-0000-4000-8000-000000000002', '4U Store • فور يو', '4U Store • فور يو', '4u@egyptian-commerce.com', 'merchant', true, '/images/brands/4u_store_logo.webp', '🕶️ تشكيلات نظارات شمسية كاجوال وموديلات عصرية أصلية 100% مع حماية UV كاملة وشحن لجميع محافظات مصر', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  role = 'merchant',
  is_merchant = true,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;

INSERT INTO public.profiles (id, name, display_name, email, role, is_merchant, avatar_url, bio, reward_points_balance)
VALUES ('171842bd-daed-40ef-853f-917eab2ed437', 'Drip Fit • دريب فيت', 'Drip Fit • دريب فيت', 'dripfit@egyptian-commerce.com', 'merchant', true, '/images/brands/dripfit_logo.png', '✨ براند مصري عصري للأزياء والملابس الصيفية والستريت وير بالقاهرة 🇪🇬 | تصاميم صيفية حصرية وشحن سريع لجميع المحافظات', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  role = 'merchant',
  is_merchant = true,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;

INSERT INTO public.profiles (id, name, display_name, email, role, is_merchant, avatar_url, bio, reward_points_balance)
VALUES ('50000000-0000-4000-8000-000000000004', 'Snugs • سناجز', 'Snugs • سناجز', 'snugs@egyptian-commerce.com', 'merchant', true, '/images/brands/snugs_logo.jpg', '🧸 بيجامات وملابس منزلية فائقة الراحة والنعومة لكل أفراد العائلة من سناجز | خامات مريحة وتصاميم مبهجة', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  role = 'merchant',
  is_merchant = true,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;

INSERT INTO public.profiles (id, name, display_name, email, role, is_merchant, avatar_url, bio, reward_points_balance)
VALUES ('60000000-0000-4000-8000-000000000005', 'Rakan Fragrances • رَكان للعطور', 'Rakan Fragrances • رَكان للعطور', 'rakan@egyptian-commerce.com', 'merchant', true, '/images/brands/rakan_fragrances_logo.jpg', '👑 عطور نيش فاخرة وتوليفات شرقية وغربية فريدة بثبات وفوحان يدوم طويلاً | الإسماعيلية والقاهرة وشحن لجميع أنحاء الجمهورية', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  role = 'merchant',
  is_merchant = true,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;

INSERT INTO public.profiles (id, name, display_name, email, role, is_merchant, avatar_url, bio, reward_points_balance)
VALUES ('70000000-0000-4000-8000-000000000006', 'Vermelle • فيرميل', 'Vermelle • فيرميل', 'vermelle@egyptian-commerce.com', 'merchant', true, '/images/brands/vermelle_logo.jpg', '🩵 تصاميم نسائية فاخرة مستوحاة من عراقة التراث والجمال المصري بلمسات عصرية تناسب كل مناسبة مميزة', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  role = 'merchant',
  is_merchant = true,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;

INSERT INTO public.profiles (id, name, display_name, email, role, is_merchant, avatar_url, bio, reward_points_balance)
VALUES ('80000000-0000-4000-8000-000000000007', 'liminal • ليمينال', 'liminal • ليمينال', 'liminal@egyptian-commerce.com', 'merchant', true, '/images/brands/liminal_logo.jpg', '✨ استكشاف للأنوثة المعاصرة من خلال الشكل والقصة الانسيابية | تصاميم مدروسة للأناقة اليومية الهادئة', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  role = 'merchant',
  is_merchant = true,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;

INSERT INTO public.profiles (id, name, display_name, email, role, is_merchant, avatar_url, bio, reward_points_balance)
VALUES ('90000000-0000-4000-8000-000000000008', 'JK Perfumes • جي كي للعطور', 'JK Perfumes • جي كي للعطور', 'jkperfumes@egyptian-commerce.com', 'merchant', true, '/images/brands/jk_perfumes_logo.jpg', '🌸 تشكيلة عطور ساحرة تلائم كل الأذواق والشخصيات من جي كي للعطور | نفحات زهرية منعشة وعبير فرنسي أنثوي جذاب', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  role = 'merchant',
  is_merchant = true,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;


-- 2. Insert Stores into merchants
INSERT INTO public.merchants (id, user_id, store_name, slug, email, logo_url, banner_url, category, bio, is_verified)
VALUES ('14100000-0000-4000-8000-000000000001', '14100000-0000-4000-8000-000000000001', 'One Four One • ون فور ون', 'onefourone', 'onefourone@egyptian-commerce.com', '/images/brands/onefourone_logo.jpg', '/images/products/onefourone_summer_tee.webp', 'أزياء شبابية وستريت وير', '🔥 براند مصري رائد في الستريت وير والأزياء العصرية الصيفية بالقاهرة 🇪🇬 | تشكيلة حصرية بخامات قطنية ممتازة', true)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  is_verified = true;

INSERT INTO public.merchants (id, user_id, store_name, slug, email, logo_url, banner_url, category, bio, is_verified)
VALUES ('40000000-0000-4000-8000-000000000002', '40000000-0000-4000-8000-000000000002', '4U Store • فور يو', '4u-store', '4u@egyptian-commerce.com', '/images/brands/4u_store_logo.webp', '/images/products/4u_sunglasses_luxury.webp', 'نظارات شمسية واكسسوارات فاخرة', '🕶️ تشكيلات نظارات شمسية كاجوال وموديلات عصرية أصلية 100% مع حماية UV كاملة وشحن لجميع محافظات مصر', true)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  is_verified = true;

INSERT INTO public.merchants (id, user_id, store_name, slug, email, logo_url, banner_url, category, bio, is_verified)
VALUES ('171842bd-daed-40ef-853f-917eab2ed437', '171842bd-daed-40ef-853f-917eab2ed437', 'Drip Fit • دريب فيت', 'drip-fit', 'dripfit@egyptian-commerce.com', '/images/brands/dripfit_logo.png', '/images/products/the_sharp_v_yellow_1.webp', 'ستريت وير وتوبات صيفية عصرية', '✨ براند مصري عصري للأزياء والملابس الصيفية والستريت وير بالقاهرة 🇪🇬 | تصاميم صيفية حصرية وشحن سريع لجميع المحافظات', true)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  is_verified = true;

INSERT INTO public.merchants (id, user_id, store_name, slug, email, logo_url, banner_url, category, bio, is_verified)
VALUES ('50000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-000000000004', 'Snugs • سناجز', 'snugs', 'snugs@egyptian-commerce.com', '/images/brands/snugs_logo.jpg', '/images/products/snugs_cozy_sleepwear.webp', 'ملابس منزلية وبيجامات قطنية ناعمة', '🧸 بيجامات وملابس منزلية فائقة الراحة والنعومة لكل أفراد العائلة من سناجز | خامات مريحة وتصاميم مبهجة', true)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  is_verified = true;

INSERT INTO public.merchants (id, user_id, store_name, slug, email, logo_url, banner_url, category, bio, is_verified)
VALUES ('60000000-0000-4000-8000-000000000005', '60000000-0000-4000-8000-000000000005', 'Rakan Fragrances • رَكان للعطور', 'rakan-fragrances', 'rakan@egyptian-commerce.com', '/images/brands/rakan_fragrances_logo.jpg', '/images/products/rakan_luxury_perfume.webp', 'عطور نيش فاخرة وتوليفات خاصة', '👑 عطور نيش فاخرة وتوليفات شرقية وغربية فريدة بثبات وفوحان يدوم طويلاً | الإسماعيلية والقاهرة وشحن لجميع أنحاء الجمهورية', true)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  is_verified = true;

INSERT INTO public.merchants (id, user_id, store_name, slug, email, logo_url, banner_url, category, bio, is_verified)
VALUES ('70000000-0000-4000-8000-000000000006', '70000000-0000-4000-8000-000000000006', 'Vermelle • فيرميل', 'vermelle', 'vermelle@egyptian-commerce.com', '/images/brands/vermelle_logo.jpg', '/images/products/vermelle_heritage_dress.webp', 'أزياء راقية وتراث مصري معاصر', '🩵 تصاميم نسائية فاخرة مستوحاة من عراقة التراث والجمال المصري بلمسات عصرية تناسب كل مناسبة مميزة', true)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  is_verified = true;

INSERT INTO public.merchants (id, user_id, store_name, slug, email, logo_url, banner_url, category, bio, is_verified)
VALUES ('80000000-0000-4000-8000-000000000007', '80000000-0000-4000-8000-000000000007', 'liminal • ليمينال', 'liminal', 'liminal@egyptian-commerce.com', '/images/brands/liminal_logo.jpg', '/images/products/liminal_modern_silhouette.webp', 'أزياء مودرن مينيمال وقصات عصرية', '✨ استكشاف للأنوثة المعاصرة من خلال الشكل والقصة الانسيابية | تصاميم مدروسة للأناقة اليومية الهادئة', true)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  is_verified = true;

INSERT INTO public.merchants (id, user_id, store_name, slug, email, logo_url, banner_url, category, bio, is_verified)
VALUES ('90000000-0000-4000-8000-000000000008', '90000000-0000-4000-8000-000000000008', 'JK Perfumes • جي كي للعطور', 'jk-perfumes', 'jkperfumes@egyptian-commerce.com', '/images/brands/jk_perfumes_logo.jpg', '/images/products/jk_butterfly_perfume.webp', 'عطور فاخرة وتركيبات شرقية وفرنسية', '🌸 تشكيلة عطور ساحرة تلائم كل الأذواق والشخصيات من جي كي للعطور | نفحات زهرية منعشة وعبير فرنسي أنثوي جذاب', true)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  is_verified = true;


-- 3. Insert Products into products
INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('14100000-p001-4000-8000-000000000001', '14100000-0000-4000-8000-000000000001', 'One Four One Summer Graphic Tee • تيشرت ون فور ون الصيفي', 'تيشرت صيفي بطباعة جرافيك عصرية وألوان صيفية منعشة من ون فور ون، خامة قطنية 100% باردة ومناسبة لحرارة الصيف.', 620, 780, 45, '/images/products/onefourone_summer_tee.webp', 'Streetwear ستريت وير وكاجوال', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;

INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('40000000-p001-4000-8000-000000000002', '40000000-0000-4000-8000-000000000002', '4U Signature Luxury Sunglasses • نظارة شمسية كلاسيك فاخرة 4U', 'نظارة شمسية فاخرة بإطار متين وعدسات مستقطبة عاكسة ومقاومة للخدوش توفر حماية فائقة من أشعة الشمس فوق البنفسجية UV400.', 750, 950, 60, '/images/products/4u_sunglasses_luxury.webp', 'Accessories إكسسوارات ونظارات', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;

INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('11111111-d001-4000-8000-000000000001', '171842bd-daed-40ef-853f-917eab2ed437', 'The Sharp V Yellow Oversized T-Shirt • تيشرت شارب في أصفر أوفرسايز', 'تيشرت أوفرسايز فاخر باللون الأصفر العصري مع تصميم Sharp V المميز. مصنوع من أجود أنواع القطن المصري المعالج لملمس ناعم وراحة فائقة طوال اليوم.', 680, 850, 50, '/images/products/the_sharp_v_yellow_1.webp', 'Streetwear ستريت وير وكاجوال', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;

INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('50000000-p001-4000-8000-000000000004', '50000000-0000-4000-8000-000000000004', 'Snugs Ultra-Soft Cozy Pajama Set • بيجامة سناجز القطنية فائقة النعومة', 'طقم بيجامة قطنية منزلية ناعمة توفر لك أقصى درجات الراحة والاسترخاء في البيت بخامات طبيعية لطيفة على البشرة.', 720, 890, 40, '/images/products/snugs_cozy_sleepwear.webp', 'Loungewear ملابس منزلية وبيجامات', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;

INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('60000000-p001-4000-8000-000000000005', '60000000-0000-4000-8000-000000000005', 'Rakan Royal Blend Niche Perfume • عطر رَكان الملكي الفاخر', 'عطر ركان الملكي بتركيز Extrait De Parfum الفاخر، مزيج راقٍ من العود الملكي مع لمسات العنبر والزهور النادرة ليمنحك هيبة وحضوراً لا يُنسى.', 1150, 1450, 35, '/images/products/rakan_luxury_perfume.webp', 'Fragrances عطور وبخور', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;

INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('70000000-p001-4000-8000-000000000006', '70000000-0000-4000-8000-000000000006', 'Vermelle Heritage Embroidered Ensemble • تصميم فيرميل التراثي الراقي', 'إطلالة فيرميل التراثية المطرزة بدقة وعناية فائقة، تجمع بين الخامات النقية والتطريز الفاخر لتعكس أصالة الهوية المصرية بأحدث خطوط الموضة.', 1450, 1800, 25, '/images/products/vermelle_heritage_dress.webp', 'Fashion أزياء وفساتين راقية', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;

INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('80000000-p001-4000-8000-000000000007', '80000000-0000-4000-8000-000000000007', 'Liminal Modern Minimalist Tailored Set • طقم ليمينال العصري البسيط', 'طقم كاجوال أنيق بتصميم مينيمال انسيابي يمنحك حرية الحركة وشعوراً بالخفة والتميز في كل مناسبة.', 980, 1250, 30, '/images/products/liminal_modern_silhouette.webp', 'Fashion أزياء ومودرن مينيمال', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;

INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('90000000-p001-4000-8000-000000000008', '90000000-0000-4000-8000-000000000008', 'JK Butterfly Eau De Parfum • عطر بتر فلاي الزهري المنعش', 'عطر بتر فلاي من جي كي بنفحات زهرية رقيقة ومنعشة تأسر الحواس، ثبات طويل وعبير مبهج مناسب لأوقات النهار والصيف.', 890, 1100, 50, '/images/products/jk_butterfly_perfume.webp', 'Fragrances عطور وبخور', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;

INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('90000000-p002-4000-8000-000000000008', '90000000-0000-4000-8000-000000000008', 'JK Diva Rouge Eau De Parfum • عطر ديفا روج الساحر', 'عطر ديفا روج الملكي بتركيبة أنثوية جذابة تجمع بين الفواكه الحمراء والتوابل الدافئة والفانيليا لإطلالة مسائية ساحرة.', 950, 1200, 45, '/images/products/jk_diva_rouge_perfume.webp', 'Fragrances عطور وبخور', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;


-- 4. Insert Reels into reels
INSERT INTO public.reels (id, creator_id, video_url, thumbnail_url, caption, likes_count, comments_count, shares_count)
VALUES ('14100000-r001-4000-8000-000000000001', '14100000-0000-4000-8000-000000000001', '/images/reels/onefourone_summer_drop.mp4', '/images/products/onefourone_summer_tee.webp', 'Summer drop is officially here! تشكيلة الصيف الجديدة من One Four One متوفرة الآن بخامات قطنية نقية ☀️🔥 #onefourone #streetwear #cairo', 1850, 24, 110)
ON CONFLICT (id) DO UPDATE SET
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  caption = EXCLUDED.caption;

INSERT INTO public.reels (id, creator_id, video_url, thumbnail_url, caption, likes_count, comments_count, shares_count)
VALUES ('40000000-r001-4000-8000-000000000002', '40000000-0000-4000-8000-000000000002', '/images/reels/4u_store_shades.mp4', '/images/products/4u_sunglasses_luxury.webp', 'أقوى تشكيلة نظارات شمسية لصيف 2026 من 4U Store حماية كاملة UV400 وتصميم عصري لا يُقاوم 😎✨ #4u_store #نظارات_شمس #موضة', 1850, 24, 110)
ON CONFLICT (id) DO UPDATE SET
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  caption = EXCLUDED.caption;

INSERT INTO public.reels (id, creator_id, video_url, thumbnail_url, caption, likes_count, comments_count, shares_count)
VALUES ('22222222-d001-4000-8000-000000000001', '171842bd-daed-40ef-853f-917eab2ed437', '/images/reels/the_sharp_v_yellow_reel.mp4', '/images/products/the_sharp_v_yellow_1.webp', 'The Sharp V Yellow drop is here! خامة قطنية استثنائية 100% وقصة أوفرسايز تليق بيومك وتمرينك 💛🔥 متوفر الآن حصرياً عبر متجر Drip Fit #DripFit #Streetwear #موضة_مصرية', 1850, 24, 110)
ON CONFLICT (id) DO UPDATE SET
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  caption = EXCLUDED.caption;

INSERT INTO public.reels (id, creator_id, video_url, thumbnail_url, caption, likes_count, comments_count, shares_count)
VALUES ('50000000-r001-4000-8000-000000000004', '50000000-0000-4000-8000-000000000004', '/images/reels/snugs_cozy_reel.mp4', '/images/products/snugs_cozy_sleepwear.webp', 'School’s back in session 🎒📚 And Snuggs is here with the comfiest PJs for all the fam ✨ راحة وأناقة داخل البيت مع سناجز #snugs #بيجامات #راحة #loungewear', 1850, 24, 110)
ON CONFLICT (id) DO UPDATE SET
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  caption = EXCLUDED.caption;

INSERT INTO public.reels (id, creator_id, video_url, thumbnail_url, caption, likes_count, comments_count, shares_count)
VALUES ('60000000-r001-4000-8000-000000000005', '60000000-0000-4000-8000-000000000005', '/images/reels/rakan_fragrances_reel.mp4', '/images/products/rakan_luxury_perfume.webp', 'مش طبيعي 🤯 ثبات وفوحان لا يُقارن مع توليفة رَكان الخاصة المصممة لأصحاب الذوق الرفيع 👑 متوفر للطلب الفوري #عطور #رَكان #fragrance #perfume', 1850, 24, 110)
ON CONFLICT (id) DO UPDATE SET
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  caption = EXCLUDED.caption;

INSERT INTO public.reels (id, creator_id, video_url, thumbnail_url, caption, likes_count, comments_count, shares_count)
VALUES ('70000000-r001-4000-8000-000000000006', '70000000-0000-4000-8000-000000000006', '/images/reels/vermelle_heritage_reel.mp4', '/images/products/vermelle_heritage_dress.webp', 'A collection shaped by beauty and heritage 🩵 تشكيلة فيرميل المستوحاة من أصالة التراث والجمال المصري المعاصر متوفرة الآن حصرياً #vermelle #fashion #egyptian_heritage', 1850, 24, 110)
ON CONFLICT (id) DO UPDATE SET
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  caption = EXCLUDED.caption;

INSERT INTO public.reels (id, creator_id, video_url, thumbnail_url, caption, likes_count, comments_count, shares_count)
VALUES ('80000000-r001-4000-8000-000000000007', '80000000-0000-4000-8000-000000000007', '/images/reels/liminal_silhouette_reel.mp4', '/images/products/liminal_modern_silhouette.webp', 'An exploration of modern femininity through form and silhouette. ليمينال يقدم البساطة المعمارية في أزياء تبرز جمالك اليومي ✨ #liminal #minimalist #fashion', 1850, 24, 110)
ON CONFLICT (id) DO UPDATE SET
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  caption = EXCLUDED.caption;

INSERT INTO public.reels (id, creator_id, video_url, thumbnail_url, caption, likes_count, comments_count, shares_count)
VALUES ('90000000-r001-4000-8000-000000000008', '90000000-0000-4000-8000-000000000008', '/images/reels/jk_perfumes_reel.mp4', '/images/products/jk_butterfly_perfume.webp', 'اختاري اللي يناسب شخصيتك 🤍 Butterfly بنفحاته المنعشة ولا Diva Rouge بجاذبيته الملكية؟ 👀✨ متوفر الآن لدى JK Perfumes #عطور #JK_Perfumes #perfume', 1850, 24, 110)
ON CONFLICT (id) DO UPDATE SET
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  caption = EXCLUDED.caption;

