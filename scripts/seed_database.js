import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://dbufgbonhnoridenwjry.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Wa3PBB1IaxacwZLo0pzuzQ_hr1trRPR';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🚀 Starting EG-Commerce Complete Database Seeding on Supabase...\n');
  console.log(`📡 Connected to: ${supabaseUrl}`);

  // =========================================================================
  // 1. PROFILES (Merchants, Creators, Buyers, Admin)
  // =========================================================================
  console.log('\n📦 1/7 Seeding Profiles...');
  const profiles = [
    // Merchants
    {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'talieska@eg-commerce.com',
      name: 'Talieska Studio • تاليسكا ستوديو',
      phone: '+201002345678',
      role: 'merchant',
      avatar_url: '/images/brands/talieska_logo.jpg',
      reward_points_balance: 1450
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'khan@eg-commerce.com',
      name: 'Khan El Khalili Craft • ورشة خان الخليلي',
      phone: '+201112345678',
      role: 'merchant',
      avatar_url: '/images/products/copper_lantern.jpg',
      reward_points_balance: 920
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'tiba@eg-commerce.com',
      name: 'Tiba Jewelry • مجوهرات طيبة',
      phone: '+201223456789',
      role: 'merchant',
      avatar_url: '/images/brands/talieska_logo.jpg',
      reward_points_balance: 1100
    },
    // Creators
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      email: 'yasmin@eg-commerce.com',
      name: 'ياسمين السيد • Yasmin Sayed',
      phone: '+201011122233',
      role: 'creator',
      avatar_url: '/images/reels/reel_2.jpg',
      reward_points_balance: 890
    },
    {
      id: 'c0000000-0000-0000-0000-000000000002',
      email: 'cairochic@eg-commerce.com',
      name: 'سارة المهدي (كايرو شيك) • Cairo Chic',
      phone: '+201022233344',
      role: 'creator',
      avatar_url: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      reward_points_balance: 1250
    },
    {
      id: 'c0000000-0000-0000-0000-000000000003',
      email: 'salma@eg-commerce.com',
      name: 'سلمى ستايلز • Salma Styles',
      phone: '+201033344455',
      role: 'creator',
      avatar_url: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      reward_points_balance: 670
    },
    {
      id: 'c0000000-0000-0000-0000-000000000004',
      email: 'zeina@eg-commerce.com',
      name: 'زينة أوفت • Zeina OOTD',
      phone: '+201044455566',
      role: 'creator',
      avatar_url: '/images/reels/fashion_oneshoulder_top_thumb.jpg',
      reward_points_balance: 540
    },
    {
      id: 'c0000000-0000-0000-0000-000000000005',
      email: 'farida@eg-commerce.com',
      name: 'فريدة أتيليه • Farida Atelier',
      phone: '+201055566677',
      role: 'creator',
      avatar_url: '/images/reels/fashion_woven_bag_thumb.jpg',
      reward_points_balance: 780
    },
    // Buyers
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      email: 'mariam@eg-commerce.com',
      name: 'مريم الشافعي • Mariam El-Shafei',
      phone: '+201200001111',
      role: 'buyer',
      avatar_url: '/images/reels/reel_1.jpg',
      reward_points_balance: 450
    },
    {
      id: 'b0000000-0000-0000-0000-000000000002',
      email: 'nourhan@eg-commerce.com',
      name: 'نورهان كريم • Nourhan Karim',
      phone: '+201200002222',
      role: 'buyer',
      avatar_url: '/images/reels/reel_2.jpg',
      reward_points_balance: 310
    },
    // Admin
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'admin@eg-commerce.com',
      name: 'Egyptian Commerce SuperAdmin',
      phone: '+201000000000',
      role: 'admin',
      avatar_url: '/images/brands/talieska_logo.jpg',
      reward_points_balance: 10000
    }
  ];

  for (const p of profiles) {
    const { error } = await supabase.from('profiles').upsert(p, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Profile ${p.email}: ${error.message}`);
  }
  console.log(`  ✓ Processed ${profiles.length} profiles.`);

  // =========================================================================
  // 2. MERCHANTS (Store Profiles)
  // =========================================================================
  console.log('\n🏬 2/7 Seeding Merchants...');
  const merchants = [
    {
      id: 'd0000000-0000-0000-0000-000000000001',
      user_id: '11111111-1111-1111-1111-111111111111',
      store_name: 'Talieska Studio • تاليسكا ستوديو',
      slug: 'talieska',
      commission_rate: 10.00,
      is_verified: true
    },
    {
      id: 'd0000000-0000-0000-0000-000000000002',
      user_id: '22222222-2222-2222-2222-222222222222',
      store_name: 'Khan El Khalili Craft • ورشة خان الخليلي',
      slug: 'khan-craft',
      commission_rate: 12.50,
      is_verified: true
    },
    {
      id: 'd0000000-0000-0000-0000-000000000003',
      user_id: '33333333-3333-3333-3333-333333333333',
      store_name: 'Tiba Jewelry • مجوهرات طيبة',
      slug: 'tiba-jewelry',
      commission_rate: 15.00,
      is_verified: true
    }
  ];

  for (const m of merchants) {
    const { error } = await supabase.from('merchants').upsert(m, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Merchant ${m.slug}: ${error.message}`);
  }
  console.log(`  ✓ Processed ${merchants.length} store profiles.`);

  // =========================================================================
  // 3. CREATORS (UGC & Stylist Accounts)
  // =========================================================================
  console.log('\n🌟 3/7 Seeding Creators...');
  const creators = [
    {
      id: 'ce000000-0000-0000-0000-000000000001',
      user_id: 'c0000000-0000-0000-0000-000000000001',
      bio: '👗 صانعة محتوى موضة وموديل أزياء مصرية | سفيرة براند تاليسكا ستوديو للكتان الطبيعي',
      social_links: { instagram: '@yasmin_style', tiktok: '@yasmin.fashion' },
      total_earnings: 8450.00,
      rating: 4.95
    },
    {
      id: 'ce000000-0000-0000-0000-000000000002',
      user_id: 'c0000000-0000-0000-0000-000000000002',
      bio: '✨ منسقة أزياء ومدونة موضة مصرية • تنسيق الكولكشنات المعاصرة والستايل الصيفي الراقي',
      social_links: { instagram: '@cairo_chic', tiktok: '@cairochic.style' },
      total_earnings: 12300.00,
      rating: 4.98
    },
    {
      id: 'ce000000-0000-0000-0000-000000000003',
      user_id: 'c0000000-0000-0000-0000-000000000003',
      bio: '🩵 قمصان وتنسيقات صيفية مريحة وعملية لكل يوم | عاشقة للموضة المستدامة',
      social_links: { instagram: '@salma.styles', tiktok: '@salma_ootd' },
      total_earnings: 5120.00,
      rating: 4.88
    },
    {
      id: 'ce000000-0000-0000-0000-000000000004',
      user_id: 'c0000000-0000-0000-0000-000000000004',
      bio: '🤍 أطقم المناسبات والفساتين الكلاسيك | تنسيقات الجينز والتوبات المعاصرة',
      social_links: { instagram: '@zeina_ootd' },
      total_earnings: 4200.00,
      rating: 4.85
    },
    {
      id: 'ce000000-0000-0000-0000-000000000005',
      user_id: 'c0000000-0000-0000-0000-000000000005',
      bio: '👜 الحرف اليدوية والشنط الجلدية الطبيعية بتطريز أصيل',
      social_links: { instagram: '@farida.atelier' },
      total_earnings: 6800.00,
      rating: 4.92
    }
  ];

  for (const c of creators) {
    const { error } = await supabase.from('creators').upsert(c, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Creator ${c.id}: ${error.message}`);
  }
  console.log(`  ✓ Processed ${creators.length} creator accounts.`);

  // =========================================================================
  // 4. PRODUCTS CATALOG
  // =========================================================================
  console.log('\n🛍️ 4/7 Seeding Products...');
  const products = [
    // Talieska Studio (d0000000-0000-0000-0000-000000000001)
    {
      id: 'ba000000-0000-0000-0000-000000000001',
      merchant_id: 'd0000000-0000-0000-0000-000000000001',
      title: 'بليزر أوفرسايز أصفر ليموني راقي • Citrine Tailored Blazer',
      slug: 'p-fashion-blazer',
      description: 'بليزر عصري واسع بلون السيترين الأصفر الفاقع، مصمم من مزيج الكتان المصري مع بطانة حريرية ناعمة.',
      base_price: 2200.00,
      sale_price: 2200.00,
      stock_quantity: 28,
      affiliate_commission_rate: 15.00,
      status: 'active',
      images: ['/images/reels/fashion_citrine_blazer_thumb.jpg'],
      category_id: 'women'
    },
    {
      id: 'ba000000-0000-0000-0000-000000000002',
      merchant_id: 'd0000000-0000-0000-0000-000000000001',
      title: 'فستان كتان كايزن بوهيمي • Kaizen Linen Dress',
      slug: 'p-fashion-kaizen-dress',
      description: 'فستان بوهيمي أنيق مصنوع من الكتان المصري الطبيعي 100% مع تطريز خيط حرير يدوي مستوحى من واحة سيوة.',
      base_price: 1450.00,
      sale_price: 1450.00,
      stock_quantity: 45,
      affiliate_commission_rate: 12.00,
      status: 'active',
      images: ['/images/reels/fashion_kaizen_dress_thumb.jpg'],
      category_id: 'women'
    },
    {
      id: 'ba000000-0000-0000-0000-000000000003',
      merchant_id: 'd0000000-0000-0000-0000-000000000001',
      title: 'قميص كتان سماوي بقصة أوفرسايز • Sky Blue Linen Shirt',
      slug: 'p-fashion-oversized-shirt',
      description: 'قميص صيفي واسع من الكتان المصري المعالج ضد الانكماش مع أزرار صدفية طبيعية.',
      base_price: 950.00,
      sale_price: 950.00,
      stock_quantity: 36,
      affiliate_commission_rate: 10.00,
      status: 'active',
      images: ['/images/reels/fashion_oversized_shirt_thumb.jpg'],
      category_id: 'streetwear'
    },
    {
      id: 'ba000000-0000-0000-0000-000000000004',
      merchant_id: 'd0000000-0000-0000-0000-000000000001',
      title: 'توب بكتف واحد عاجي ناعم • Asymmetric One-Shoulder Bodysuit',
      slug: 'p-fashion-oneshoulder-top',
      description: 'توب كتف واحد عاجي أنيق بخامة استرتش ناعمة تبرز جمال القوام.',
      base_price: 680.00,
      sale_price: 680.00,
      stock_quantity: 50,
      affiliate_commission_rate: 10.00,
      status: 'active',
      images: ['/images/reels/fashion_oneshoulder_top_thumb.jpg'],
      category_id: 'women'
    },
    {
      id: 'ba000000-0000-0000-0000-000000000005',
      merchant_id: 'd0000000-0000-0000-0000-000000000001',
      title: 'عباية كتان مغسول فاخرة بالتطريز اليدوي • Luxury Linen Abaya',
      slug: 'p-fashion-linen-abaya',
      description: 'عباية كتان فاخرة ذات طابع ملكي مطرزة يدويًا على الياقة والأكمام.',
      base_price: 2850.00,
      sale_price: 2850.00,
      stock_quantity: 18,
      affiliate_commission_rate: 15.00,
      status: 'active',
      images: ['/images/products/linen_abaya.jpg'],
      category_id: 'modest'
    },

    // Khan El Khalili Craft (d0000000-0000-0000-0000-000000000002)
    {
      id: 'ba000000-0000-0000-0000-000000000006',
      merchant_id: 'd0000000-0000-0000-0000-000000000002',
      title: 'حقيبة كتف جلدية كلاسيك بإبزيم ذهبي • Classic Leather Bag',
      slug: 'p-fashion-shoulder-bags',
      description: 'حقيبة كتف كلاسيكية مصنوعة يدويًا من الجلد الطبيعي المعالج بالزيوت مع إبزيم نحاسي مطلي بالذهب.',
      base_price: 1850.00,
      sale_price: 1850.00,
      stock_quantity: 22,
      affiliate_commission_rate: 12.00,
      status: 'active',
      images: ['/images/reels/fashion_shoulder_bags_thumb.jpg'],
      category_id: 'women'
    },
    {
      id: 'ba000000-0000-0000-0000-000000000007',
      merchant_id: 'd0000000-0000-0000-0000-000000000002',
      title: 'فانوس نحاس فاطمي منقوش يدوياً • Fatimid Handcarved Brass Lantern',
      slug: 'p-craft-copper-lantern',
      description: 'فانوس إضاءة أصيل مصنوع من النحاس الأحمر النقي، مخرم ومحفور يدويًا بزخارف إسلامية فاطمية.',
      base_price: 1450.00,
      sale_price: 1450.00,
      stock_quantity: 15,
      affiliate_commission_rate: 15.00,
      status: 'active',
      images: ['/images/products/copper_lantern.jpg'],
      category_id: 'heritage'
    },
    {
      id: 'ba000000-0000-0000-0000-000000000008',
      merchant_id: 'd0000000-0000-0000-0000-000000000002',
      title: 'حقيبة جلد منسوجة يدوياً بمقبض مضفر • Handcrafted Woven Leather Bag',
      slug: 'p-fashion-woven-bag',
      description: 'حقيبة جلد طبيعي منسوجة بحرفية مصرية دقيقة ومزودة بحزام كتف قابل للتعديل.',
      base_price: 1950.00,
      sale_price: 1950.00,
      stock_quantity: 16,
      affiliate_commission_rate: 14.00,
      status: 'active',
      images: ['/images/reels/fashion_woven_bag_thumb.jpg'],
      category_id: 'women'
    },

    // Tiba Jewelry (d0000000-0000-0000-0000-000000000003)
    {
      id: 'ba000000-0000-0000-0000-000000000009',
      merchant_id: 'd0000000-0000-0000-0000-000000000003',
      title: 'قلادة زهرة اللوتس الفرعونية فضة 925 مطعمة بذهب 18 • Lotus Necklace',
      slug: 'p-jewelry-lotus-necklace',
      description: 'قلادة ملكية مستوحاة من مقبرة توت عنخ آمون مصوغة من الفضة الإسترلينية 925 ومطلية بطبقة سميكة من الذهب عيار 18.',
      base_price: 1350.00,
      sale_price: 1350.00,
      stock_quantity: 30,
      affiliate_commission_rate: 18.00,
      status: 'active',
      images: ['/images/brands/talieska_logo.jpg'],
      category_id: 'jewelry'
    },
    {
      id: 'ba000000-0000-0000-0000-000000000010',
      merchant_id: 'd0000000-0000-0000-0000-000000000003',
      title: 'سوار مفتاح الحياة (عنخ) مرصع بالزركون • Ankh Charm Bracelet',
      slug: 'p-jewelry-ankh-bracelet',
      description: 'سوار ناعم وراقي يجسد رمز الحياة المصري القديم بحبات الزركون السويسرية اللامعة.',
      base_price: 980.00,
      sale_price: 980.00,
      stock_quantity: 40,
      affiliate_commission_rate: 16.00,
      status: 'active',
      images: ['/images/brands/talieska_logo.jpg'],
      category_id: 'jewelry'
    }
  ];

  for (const prod of products) {
    const { error } = await supabase.from('products').upsert(prod, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Product ${prod.slug}: ${error.message}`);
  }
  console.log(`  ✓ Processed ${products.length} products.`);

  // =========================================================================
  // 5. REELS & TAGGED PRODUCTS
  // =========================================================================
  console.log('\n🎬 5/7 Seeding Reels & Reel Products...');
  const reels = [
    {
      id: 'ee000000-0000-0000-0000-000000000001',
      creator_id: 'ce000000-0000-0000-0000-000000000002', // Cairo Chic
      merchant_id: 'd0000000-0000-0000-0000-000000000001', // Talieska
      video_url: '/images/reels/fashion_citrine_blazer.mp4',
      thumbnail_url: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      caption: 'تنسيق بليزر السيترين الأوفرسايز مع بنطلون جينز كلاسيك ونظارة شمسية 💛 فخامة الصيف وأناقة لا تقاوم! #بليزر #موضة_القاهرة',
      views_count: 62400,
      likes_count: 4800,
      shares_count: 1200,
      status: 'active'
    },
    {
      id: 'ee000000-0000-0000-0000-000000000002',
      creator_id: 'ce000000-0000-0000-0000-000000000003', // Salma Styles
      merchant_id: 'd0000000-0000-0000-0000-000000000001', // Talieska
      video_url: '/images/reels/fashion_oversized_shirt.mp4',
      thumbnail_url: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      caption: 'قميص كتان سماوي أوفرسايز خفيف جداً ومريح مع بنطلون تشينو بيج واسع 🩵 إطلالة كاجوال أنيقة لكل يوم!',
      views_count: 45100,
      likes_count: 3200,
      shares_count: 850,
      status: 'active'
    },
    {
      id: 'ee000000-0000-0000-0000-000000000003',
      creator_id: 'ce000000-0000-0000-0000-000000000004', // Zeina OOTD
      merchant_id: 'd0000000-0000-0000-0000-000000000001', // Talieska
      video_url: '/images/reels/fashion_oneshoulder_top.mp4',
      thumbnail_url: '/images/reels/fashion_oneshoulder_top_thumb.jpg',
      caption: 'توب بكتف واحد عاجي ناعم مع جينز كلاسيك عالي الخصر وحزام جلد 🤍 "Jeans and a cute top" هو الأساس دايماً!',
      views_count: 38900,
      likes_count: 2900,
      shares_count: 610,
      status: 'active'
    },
    {
      id: 'ee000000-0000-0000-0000-000000000004',
      creator_id: 'ce000000-0000-0000-0000-000000000005', // Farida Atelier
      merchant_id: 'd0000000-0000-0000-0000-000000000002', // Khan Craft
      video_url: '/images/reels/fashion_shoulder_bags.mp4',
      thumbnail_url: '/images/reels/fashion_shoulder_bags_thumb.jpg',
      caption: 'سواتش كولكشن شنط الكتف الجلدية الكلاسيك بـ 5 ألوان تخطف العين بإبزيم ذهبي فاخر! 👜✨',
      views_count: 48500,
      likes_count: 5100,
      shares_count: 1400,
      status: 'active'
    },
    {
      id: 'ee000000-0000-0000-0000-000000000005',
      creator_id: 'ce000000-0000-0000-0000-000000000001', // Yasmin Sayed
      merchant_id: 'd0000000-0000-0000-0000-000000000001', // Talieska
      video_url: '/images/reels/fashion_oversized_shirt.mp4',
      thumbnail_url: '/images/products/linen_abaya.jpg',
      caption: 'فخامة الكتان الطبيعي والتطريز اليدوي المصري الأصيل ✨ إطلالة عباية الكتان المطرزة في الساحل والقاهرة 🇪🇬',
      views_count: 54000,
      likes_count: 6400,
      shares_count: 1900,
      status: 'active'
    }
  ];

  for (const r of reels) {
    const { error } = await supabase.from('reels').upsert(r, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Reel ${r.id}: ${error.message}`);
  }
  console.log(`  ✓ Processed ${reels.length} video reels.`);

  // Tag Reel Products
  const reelProducts = [
    { id: 'ef000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000001', product_id: 'ba000000-0000-0000-0000-000000000001', display_order: 1 },
    { id: 'ef000000-0000-0000-0000-000000000002', reel_id: 'ee000000-0000-0000-0000-000000000002', product_id: 'ba000000-0000-0000-0000-000000000003', display_order: 1 },
    { id: 'ef000000-0000-0000-0000-000000000003', reel_id: 'ee000000-0000-0000-0000-000000000003', product_id: 'ba000000-0000-0000-0000-000000000004', display_order: 1 },
    { id: 'ef000000-0000-0000-0000-000000000004', reel_id: 'ee000000-0000-0000-0000-000000000004', product_id: 'ba000000-0000-0000-0000-000000000006', display_order: 1 },
    { id: 'ef000000-0000-0000-0000-000000000005', reel_id: 'ee000000-0000-0000-0000-000000000005', product_id: 'ba000000-0000-0000-0000-000000000005', display_order: 1 }
  ];

  for (const rp of reelProducts) {
    const { error } = await supabase.from('reel_products').upsert(rp, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Reel_product: ${error.message}`);
  }
  console.log(`  ✓ Linked ${reelProducts.length} reel products.`);

  // =========================================================================
  // 6. UGC CAMPAIGNS & APPLICATIONS
  // =========================================================================
  console.log('\n📢 6/7 Seeding UGC Campaigns...');
  const ugcCampaigns = [
    {
      id: 'ca000000-0000-0000-0000-000000000001',
      merchant_id: 'd0000000-0000-0000-0000-000000000001', // Talieska
      product_id: 'ba000000-0000-0000-0000-000000000001', // Citrine Blazer
      title: 'حملة تنسيقات بليزر السيترين • صيف 2026',
      brief_requirements: 'تصوير فيديو ريلز 9:16 بمدة 15-30 ثانية لتنسيق بليزر السيترين مع إطلالة نهارية ومسائية.',
      reward_type: 'hybrid',
      fixed_reward_amount: 1200.00,
      slots_available: 5,
      status: 'active'
    },
    {
      id: 'ca000000-0000-0000-0000-000000000002',
      merchant_id: 'd0000000-0000-0000-0000-000000000002', // Khan Craft
      product_id: 'ba000000-0000-0000-0000-000000000006', // Shoulder Bag
      title: 'حملة إكسسوارات خان الخليلي التراثية الراقية',
      brief_requirements: 'استعراض جودة الجلد الطبيعي والإبزيم المطلي بالذهب مع تفاصيل التنسيق اليومي.',
      reward_type: 'free_product',
      fixed_reward_amount: 0.00,
      slots_available: 8,
      status: 'active'
    }
  ];

  for (const uc of ugcCampaigns) {
    const { error } = await supabase.from('ugc_campaigns').upsert(uc, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Campaign ${uc.title}: ${error.message}`);
  }
  console.log(`  ✓ Processed ${ugcCampaigns.length} UGC campaigns.`);

  // =========================================================================
  // 7. ORDERS & ITEMS
  // =========================================================================
  console.log('\n📦 7/7 Seeding Orders...');
  const orders = [
    {
      id: 'f0000000-0000-0000-0000-000000000001',
      user_id: 'b0000000-0000-0000-0000-000000000001', // Mariam El-Shafei
      status: 'paid',
      subtotal: 1450.00,
      discount_amount: 0.00,
      shipping_amount: 60.00,
      total_amount: 1510.00,
      reward_points_earned: 145
    },
    {
      id: 'f0000000-0000-0000-0000-000000000002',
      user_id: 'b0000000-0000-0000-0000-000000000002', // Nourhan Karim
      status: 'delivered',
      subtotal: 1850.00,
      discount_amount: 100.00,
      shipping_amount: 60.00,
      total_amount: 1810.00,
      reward_points_earned: 185
    }
  ];

  for (const o of orders) {
    const { error } = await supabase.from('orders').upsert(o, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Order ${o.id}: ${error.message}`);
  }

  const orderItems = [
    {
      id: 'fa000000-0000-0000-0000-000000000001',
      order_id: 'f0000000-0000-0000-0000-000000000001',
      product_id: 'ba000000-0000-0000-0000-000000000002',
      merchant_id: 'd0000000-0000-0000-0000-000000000001',
      creator_id: 'ce000000-0000-0000-0000-000000000001',
      quantity: 1,
      unit_price: 1450.00,
      commission_amount: 174.00,
      status: 'shipped'
    },
    {
      id: 'fa000000-0000-0000-0000-000000000002',
      order_id: 'f0000000-0000-0000-0000-000000000002',
      product_id: 'ba000000-0000-0000-0000-000000000006',
      merchant_id: 'd0000000-0000-0000-0000-000000000002',
      creator_id: 'ce000000-0000-0000-0000-000000000002',
      quantity: 1,
      unit_price: 1850.00,
      commission_amount: 222.00,
      status: 'delivered'
    }
  ];

  for (const oi of orderItems) {
    const { error } = await supabase.from('order_items').upsert(oi, { onConflict: 'id' });
    if (error) console.log(`  ⚠️ Order item: ${error.message}`);
  }
  console.log(`  ✓ Processed orders and attributed items.`);

  console.log('\n🎉 SCRIPT FINISHED PROCESSING.');
}

seedDatabase().catch(err => {
  console.error('Fatal Seeding Error:', err);
});
