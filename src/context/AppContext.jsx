import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductService } from '../services/ProductService';
import { CartService } from '../services/CartService';
import { AuthService } from '../services/AuthService';
import { RewardService } from '../services/RewardService';

const AppContext = createContext();

export const MERCHANTS_DATA = [
  {
    id: 'm-01',
    name: 'Talieska Studio • تاليسكا ستوديو',
    shortName: 'Talieska',
    slug: 'talieska',
    subdomain: 'talieska.eg-commerce.com',
    customDomain: 'shop.talieskastudio.com',
    customDomainStatus: 'Active (SSL)',
    category: 'Haute Egyptian Linen & Resort Wear',
    categoryAr: 'أزياء الكتان والتطريز اليدوي',
    bio: 'دار أزياء مصرية معاصرة متخصصة في ابتكار أزياء استثنائية منسوجة يدوياً من الكتان الطبيعي المصري في القاهرة.',
    established: '2022',
    rating: 4.9,
    reviewsCount: 180,
    verified: true,
    logo: '/images/brands/talieska_logo.jpg',
    banner: '/images/banners/talieska_hero.jpg',
    announcement: '✨ كولكشن صيف 2026 متاح الآن • شحن مجاني للطلبات فوق 1,500 ج.م بكود TALIESKA15',
    promoCode: 'TALIESKA15',
    discountPct: 15,
    themeColor: '#d00000',
    whatsapp: '+201002345678',
    instagram: '@talieska.studio',
    bostaAccount: 'BST-EG-8921',
    instapayHandle: 'talieska@instapay',
    themeConfig: {
      themeMode: 'dark', // 'dark' | 'light' | 'midnight'
      accentColor: '#d00000',
      fontFamily: 'sans', // 'sans' | 'serif' | 'cairo'
      borderRadius: 'rounded-2xl', // 'rounded-none' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl'
      heroStyle: 'wide_cinema', // 'wide_cinema' | 'split_editorial' | 'minimal_card'
      heroHeadline: 'إحياء فخامة الكتان الطبيعي بأيادٍ مصرية أصيلة',
      heroSubheadline: 'أزياء مصرية معاصرة منسوجة يدوياً 100% من أجود ألياف الكتان طويل التيلة بالقاهرة لتمنحك إطلالة راقية تدوم لسنوات.',
      heroCtaText: 'تسوق كولكشن 2026',
      productsGridCols: 3, // 2 | 3 | 4
      showRatings: true,
      showStockBadges: true,
    },
    layoutConfig: {
      showAnnouncementBar: true,
      showHeroBanner: true,
      showTrustBadges: true,
      showProductsCatalog: true,
      showCommunityReels: true,
      showSocialMediaFeed: true,
      showTestimonials: true,
      showContactSection: true,
      showWhatsAppFloat: true,
      showAboutUsTab: true,
      trustBadges: [
        { id: 'b1', icon: 'local_shipping', title: 'شحن سريع بوسطة', desc: 'توصيل لباب بيتك خلال 24-48 ساعة' },
        { id: 'b2', icon: 'verified', title: 'كتان طبيعي 100%', desc: 'أقمشة مصرية معالجة ضد الانكماش' },
        { id: 'b3', icon: 'assignment_return', title: 'معاينة عند الاستلام', desc: 'حق الاستبدال خلال 14 يوم مجاناً' },
        { id: 'b4', icon: 'support_agent', title: 'استشارة مقاسات فورية', desc: 'فريق متخصص عبر الواتساب لحظياً' }
      ]
    },
    stats: {
      grossSales: 142500,
      growthPct: 18.4,
      totalOrders: 118,
      ordersPending: 8,
      ordersShipping: 14,
      reelsAttributedSales: 58200,
      reelsAttributedPct: 41,
      aov: 1210,
      visitors: 4820,
      conversionRate: 2.8,
    }
  },
  {
    id: 'm-02',
    name: 'Khan El Khalili Craft • ورشة خان الخليلي',
    shortName: 'Khan Craft',
    slug: 'khan-craft',
    subdomain: 'khan-craft.eg-commerce.com',
    customDomain: 'khancraft-eg.com',
    customDomainStatus: 'Active (SSL)',
    category: 'Handmade Leather & Brass',
    categoryAr: 'صناعات نحاسية وسجاد يدوي وتراثي',
    bio: 'حرفيون مصريون من قلب القاهرة الفاطمية يبتكرون فوانيس نحاسية منقوشة وسجاد كليم يدوي أصيل.',
    established: '2019',
    rating: 4.9,
    reviewsCount: 112,
    verified: true,
    logo: '/images/products/copper_lantern.jpg',
    banner: '/images/banners/khan_hero.jpg',
    announcement: '🏮 تحف نحاسية وسجاد كليم يدوي 100% مع ضمان استبدال مجاني',
    promoCode: 'KHAN10',
    discountPct: 10,
    themeColor: '#feb700',
    whatsapp: '+201112345678',
    instagram: '@khan.craft.eg',
    bostaAccount: 'BST-EG-4412',
    instapayHandle: 'khancraft@instapay',
    themeConfig: {
      themeMode: 'dark',
      accentColor: '#feb700',
      fontFamily: 'serif',
      borderRadius: 'rounded-2xl',
      heroStyle: 'wide_cinema',
      heroHeadline: 'سحر الحرف الفاطمية والتراث المصري الأصيل',
      heroSubheadline: 'فوانيس نحاسية منقوشة وسجاد كليم يدوي مصنوع بأيدي أمهر شيوخ الصنعة في خان الخليلي.',
      heroCtaText: 'استكشف التحف النحاسية',
      productsGridCols: 3,
      showRatings: true,
      showStockBadges: true,
    },
    layoutConfig: {
      showAnnouncementBar: true,
      showHeroBanner: true,
      showTrustBadges: true,
      showProductsCatalog: true,
      showCommunityReels: true,
      showSocialMediaFeed: true,
      showTestimonials: true,
      showContactSection: true,
      showWhatsAppFloat: true,
      showAboutUsTab: true,
      trustBadges: [
        { id: 'b1', icon: 'local_shipping', title: 'شحن آمن مع بوسطة', desc: 'تغليف خاص ومقاوم للصدمات' },
        { id: 'b2', icon: 'workspace_premium', title: 'نحاس أحمر نقي 100%', desc: 'نقش وتخريم يدوي يدوم للأبد' },
        { id: 'b3', icon: 'verified', title: 'شهادة أصالة تراثية', desc: 'مختومة من ورش خان الخليلي' },
        { id: 'b4', icon: 'support_agent', title: 'طلبات تصنيع خاصة', desc: 'حفر الأسماء والإهداءات حسب الطلب' }
      ]
    },
    stats: {
      grossSales: 89400,
      growthPct: 12.2,
      totalOrders: 94,
      ordersPending: 5,
      ordersShipping: 9,
      reelsAttributedSales: 31000,
      reelsAttributedPct: 35,
      aov: 950,
      visitors: 3100,
      conversionRate: 3.0,
    }
  },
  {
    id: 'm-03',
    name: 'Tiba Jewelry • مجوهرات طيبة',
    shortName: 'Tiba',
    slug: 'tiba-jewelry',
    subdomain: 'tiba-jewelry.eg-commerce.com',
    customDomain: 'tibajewelry.com',
    customDomainStatus: 'Pending DNS',
    category: 'Gold Plated & Egyptian Heritage Jewelry',
    categoryAr: 'حلي ومجوهرات مستوحاة من التاريخ',
    bio: 'تصاميم فرعونية وهندسية معاصرة من الفضة عيار 925 والذهب عيار 18.',
    established: '2023',
    rating: 5.0,
    reviewsCount: 78,
    verified: true,
    logo: '/images/brands/talieska_logo.jpg',
    banner: '/images/banners/talieska_hero.jpg',
    announcement: '👑 قطع محدودة مستوحاة من زهرة اللوتس • علبة هدايا فاخرة مجاناً',
    promoCode: 'TIBA20',
    discountPct: 20,
    themeColor: '#10b981',
    whatsapp: '+201223456789',
    instagram: '@tiba.jewels',
    bostaAccount: 'BST-EG-1190',
    instapayHandle: 'tiba@instapay',
    themeConfig: {
      themeMode: 'midnight',
      accentColor: '#10b981',
      fontFamily: 'cairo',
      borderRadius: 'rounded-xl',
      heroStyle: 'split_editorial',
      heroHeadline: 'حلي فرعونية ملكية مفعمة بسحر التاريخ',
      heroSubheadline: 'مجوهرات مصوغة من الفضة عيار 925 المطلية بذهب عيار 18 المستوحاة من رموز مصر القديمة.',
      heroCtaText: 'تسوق قطع اللوتس',
      productsGridCols: 3,
      showRatings: true,
      showStockBadges: true,
    },
    layoutConfig: {
      showAnnouncementBar: true,
      showHeroBanner: true,
      showTrustBadges: true,
      showProductsCatalog: true,
      showCommunityReels: true,
      showSocialMediaFeed: true,
      showTestimonials: true,
      showContactSection: true,
      showWhatsAppFloat: true,
      showAboutUsTab: true,
      trustBadges: [
        { id: 'b1', icon: 'local_shipping', title: 'توصيل مصفح وسريع', desc: 'معاينة وفحص الصياغة قبل الدفع' },
        { id: 'b2', icon: 'diamond', title: 'فضة 925 مطلية بالذهب', desc: 'ضمان ثبات اللون لمدة عامين' },
        { id: 'b3', icon: 'redeem', title: 'علبة هدايا ملكية', desc: 'تغليف مخملي فاخر مع كارت إهداء' },
        { id: 'b4', icon: 'verified', title: 'شهادة ضمان معتمدة', desc: 'توثيق عيار الفضة ونسبة الذهب' }
      ]
    },
    stats: {
      grossSales: 63800,
      growthPct: 24.1,
      totalOrders: 68,
      ordersPending: 3,
      ordersShipping: 6,
      reelsAttributedSales: 39500,
      reelsAttributedPct: 62,
      aov: 938,
      visitors: 2890,
      conversionRate: 2.4,
    }
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'EG-8841',
    merchantId: 'm-01',
    customerName: 'سلمى الأحمدي (Salma El-Ahmady)',
    phone: '+20 102 345 6789',
    address: 'المعادي، القاهرة - شارع 9، عمارة 14',
    productTitle: 'عباية كتان مغسول فاخرة • M',
    quantity: 1,
    amount: 1450,
    paymentMethod: 'InstaPay (تم التحقق • Ref: 98124)',
    paymentStatus: 'paid',
    shippingStatus: 'ready_for_pickup',
    courier: 'Bosta Express',
    trackingNumber: 'BST-77391024',
    date: 'منذ ساعتين',
    attributedCreator: '@nour_style'
  },
  {
    id: 'EG-8840',
    merchantId: 'm-01',
    customerName: 'نورهان كريم (Nourhan Karim)',
    phone: '+20 111 876 5432',
    address: 'سموحة، الإسكندرية - شارع فيكتور عمانويل',
    productTitle: 'فستان سهرة حرير ملكي • 54',
    quantity: 1,
    amount: 1980,
    paymentMethod: 'الدفع عند الاستلام (COD)',
    paymentStatus: 'pending_cod',
    shippingStatus: 'in_transit',
    courier: 'Bosta Express',
    trackingNumber: 'BST-77390918',
    date: 'منذ 5 ساعات',
    attributedCreator: '@farida_fashion'
  },
  {
    id: 'EG-8839',
    merchantId: 'm-02',
    customerName: 'طارق مصطفى',
    phone: '+20 122 998 1122',
    address: 'الشيخ زايد، الجيزة - بيفرلي هيلز',
    productTitle: 'فانوس نحاس أرابيسك يدوي',
    quantity: 1,
    amount: 920,
    paymentMethod: 'InstaPay',
    paymentStatus: 'paid',
    shippingStatus: 'delivered',
    courier: 'Bosta Express',
    trackingNumber: 'BST-77389100',
    date: 'أمس',
    attributedCreator: '@cairo_looks'
  }
];

export const INITIAL_PRODUCTS = [

  {
    id: 'p-sheglam-1',
    sku: 'SHG-MASC-01',
    title: 'شيجلام ماسكارا لرفع الرموش مع مزيل • SHEGLAM Ultra Lash Lift Mascara',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    reviewsCount: 1420,
    stock: 85,
    isSyndicated: true,
    image: '/images/reels/sheglam_mascara_thumb.jpg',
    pointsEarned: 45,
    category: 'Makeup مكياج',
    description: 'ماسكارا شيجلام الثورية لرفع وتطويل الرموش بشكل ملحوظ، تأتي مع مزيل مكياج عيون لطيف مخصص لإزالتها بسهولة وفي ثوانٍ معدودة دون تساقط الرموش.',
    sizes: ['Standard'],
    colors: ['Black أسود']
  },
  {
    id: 'p-sheglam-2',
    sku: 'SHG-LIP-02',
    title: 'شيجلام ملمع ومورد شفاه وبلاشر جيلي • SHEGLAM Jelly Lip Tint & Blusher',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 280,
    originalPrice: 350,
    rating: 4.8,
    reviewsCount: 3200,
    stock: 120,
    isSyndicated: true,
    image: '/images/reels/sheglam_liptint_thumb.jpg',
    pointsEarned: 28,
    category: 'Makeup مكياج',
    description: 'مورد شفاه وخدود بتركيبة الجيلي المرطبة، يمنحك لوناً غنياً وثباتاً يدوم طويلاً مع ترطيب عميق بفضل الزيوت الطبيعية.',
    sizes: ['Standard'],
    colors: ['Cherry Bark', 'Plum Sauce', 'Bare Blush', 'Chocoholic', 'Mauvelous', 'Pinky Promise']
  },
  {
    id: 'p-01',
    sku: 'TLK-ABY-01',
    title: 'عباية كتان ناعمة وتوب عصري • Asymmetric Cutout Top & Linen Style',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 1450,
    originalPrice: 1850,
    rating: 4.9,
    reviewsCount: 142,
    stock: 24,
    isSyndicated: true,
    image: '/images/products/linen_abaya.jpg',
    video: '/images/products/linen_abaya.mp4',
    pointsEarned: 145,
    category: 'Linen كاجوال كتان',
    description: 'إطلالة عصرية أنيقة تجمع بين التوب العصري المميز والقصة الجذابة مع تفاصيل راقية لإطلالة لافتة مستوحاة من أحدث صيحات الموضة المصرية.',
    sizes: ['S', 'M', 'L', 'XL', 'Free Size'],
    colors: ['Sandy Beige بيج رملي', 'Terracotta تيراكوتا', 'Black أسود ملكي']
  },
  {
    id: 'p-02',
    sku: 'TLK-DRS-02',
    title: 'كنزة تريكو صوف برقبة دافئة • Chunky Knit Turtleneck Sweater',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 1250,
    originalPrice: 1600,
    rating: 5.0,
    reviewsCount: 98,
    stock: 14,
    isSyndicated: true,
    image: '/images/products/silk_dress.jpg',
    video: '/images/products/silk_dress.mp4',
    pointsEarned: 125,
    category: 'Knitwear تريكو وشتاء',
    description: 'كنزة تريكو فاخرة بتطريز صوف مجدول دافئ وياقة عالية مريحة، مصممة لإطلالة خريفية وشتوية غاية في الرقي والأناقة.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ivory White عاجي ناصع', 'Warm Beige بيج دافئ']
  },
  {
    id: 'p-03',
    sku: 'TLK-BLZ-03',
    title: 'بليزر صوف أوفرسايز عصري • Tailored Oversized Wool Blazer',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 1980,
    originalPrice: 2400,
    rating: 4.9,
    reviewsCount: 64,
    stock: 18,
    isSyndicated: true,
    image: '/images/products/wool_blazer.jpg',
    pointsEarned: 198,
    category: 'Jackets & Blazers بليزرات',
    description: 'بليزر صوف فاخر بقصة أوفرسايز عصرية وتفاصيل حياكة متقنة تناسب الإطلالات الكلاسيكية والعملية.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Charcoal فحم غامق', 'Midnight Black أسود ليلي']
  },
  {
    id: 'p-04',
    sku: 'TLK-SHT-04',
    title: 'قميص كتان صيفي مريح • Relaxed Pure Linen Shirt',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 890,
    originalPrice: 1100,
    rating: 4.8,
    reviewsCount: 52,
    stock: 35,
    isSyndicated: true,
    image: '/images/products/linen_shirt.jpg',
    pointsEarned: 89,
    category: 'Linen كاجوال كتان',
    description: 'قميص صيفي من خيوط الكتان المصري النقي بنسيج خفيف يسمح بمرور الهواء مثالي لأيام الصيف المشمسة.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Olive Sage أخضر ميرمية', 'Pure White أبيض ناصع', 'Sand بيج']
  },
  {
    id: 'p-05',
    sku: 'KHC-LTN-05',
    title: 'فانوس نحاس أرابيسك يدوي • Handcrafted Arabesque Copper Lantern',
    merchant: 'Khan El Khalili Craft • ورشة خان الخليلي',
    merchantId: 'm-02',
    merchantVerified: true,
    price: 1250,
    originalPrice: 1600,
    rating: 4.9,
    reviewsCount: 76,
    stock: 12,
    isSyndicated: true,
    image: '/images/products/copper_lantern.jpg',
    pointsEarned: 125,
    category: 'Heritage Crafts نحاسيات وتحف',
    description: 'فانوس نحاسي مصنوع يدوياً بنقوش أرابيسك هندسية إسلامية دقيقة من قلب ورش خان الخليلي التاريخية.',
    sizes: ['Medium 45cm', 'Large 60cm'],
    colors: ['Antique Brass نحاس عتيق']
  },
  {
    id: 'p-06',
    sku: 'KHC-RUG-06',
    title: 'سجادة كليم يدوي فاخرة • Egyptian Handwoven Tribal Kilim Rug',
    merchant: 'Khan El Khalili Craft • ورشة خان الخليلي',
    merchantId: 'm-02',
    merchantVerified: true,
    price: 2150,
    originalPrice: 2600,
    rating: 5.0,
    reviewsCount: 43,
    stock: 8,
    isSyndicated: true,
    image: '/images/products/kilim_rug.jpg',
    pointsEarned: 215,
    category: 'Handmade Carpets كليم يدوي',
    description: 'سجادة كليم صوف طبيعي 100% منسوجة على النول اليدوي بألوان ترابية مستوحاة من البيئة المصرية الأصيلة.',
    sizes: ['150x200 cm', '180x250 cm'],
    colors: ['Terracotta & Indigo تيراكوتا ونيلي']
  },
  {
    id: 'p-fashion-blazer',
    sku: 'TLK-BLZ-09',
    title: 'بليزر أوفرسايز أصفر ليموني راقي • Citrine Tailored Oversized Blazer',
    merchant: 'Talieska Studio • تاليسكا ستوديو',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 2200,
    originalPrice: 2750,
    rating: 4.9,
    reviewsCount: 88,
    stock: 22,
    isSyndicated: true,
    image: '/images/reels/fashion_citrine_blazer_thumb.jpg',
    video: '/images/reels/fashion_citrine_blazer.mp4',
    pointsEarned: 220,
    category: 'Jackets & Blazers بليزرات',
    description: 'بليزر أوفرسايز بتصميم عصري راقٍ منسوج من أقمشة الكريب الفاخرة بلون أصفر سيترين ساحر، قصة أكتاف دراماتيكية أنيقة تمنحك إطلالة فريدة ومتميزة.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Citrine Pastel Yellow أصفر سيترين', 'Pure Ivory عاجي']
  },
  {
    id: 'p-fashion-oversized-shirt',
    sku: 'TLK-SHT-05',
    title: 'قميص كتان سماوي بقصة أوفرسايز • Oversized Sky Blue Linen Shirt',
    merchant: 'Talieska Studio • تاليسكا ستوديو',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 950,
    originalPrice: 1200,
    rating: 4.8,
    reviewsCount: 114,
    stock: 45,
    isSyndicated: true,
    image: '/images/reels/fashion_oversized_shirt_thumb.jpg',
    video: '/images/reels/fashion_oversized_shirt.mp4',
    pointsEarned: 95,
    category: 'Linen كاجوال كتان',
    description: 'قميص كاجوال أنيق بأزرار وقصة واسعة مريحة منسوج من أجود خيوط الكتان المصري النقي، مثالي لتنسيق الإطلالات اليومية والطبقات العصرية.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sky Blue أزرق سماوي', 'Off-White أوف وايت', 'Sand بيج رملي']
  },
  {
    id: 'p-fashion-oneshoulder-top',
    sku: 'TLK-TOP-06',
    title: 'توب بكتف واحد عاجي ناعم • Asymmetric One-Shoulder White Bodysuit Top',
    merchant: 'Talieska Studio • تاليسكا ستوديو',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 680,
    originalPrice: 850,
    rating: 4.9,
    reviewsCount: 92,
    stock: 38,
    isSyndicated: true,
    image: '/images/reels/fashion_oneshoulder_top_thumb.jpg',
    video: '/images/reels/fashion_oneshoulder_top.mp4',
    pointsEarned: 68,
    category: 'Tops & Blouses توبات وبلايز',
    description: 'توب أنيق بتصميم الكتف الواحد العصري من خامة مريحة داعمة، ينسجم بشكل استثنائي مع البناطيل الجينز الواسعة والتنانير الصيفية.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Pure Ivory عاجي ناصع', 'Noir Black أسود', 'Mocha موكا']
  },
  {
    id: 'p-fashion-knit-sweater',
    sku: 'TLK-SWT-07',
    title: 'سويتر صوف تريكو أوفرسايز بياقة عالية • Chunky Knit Oversized Turtleneck',
    merchant: 'Talieska Studio • تاليسكا ستوديو',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 1650,
    originalPrice: 2100,
    rating: 5.0,
    reviewsCount: 67,
    stock: 19,
    isSyndicated: true,
    image: '/images/reels/fashion_knit_sweater_thumb.jpg',
    video: '/images/reels/fashion_knit_sweater.mp4',
    pointsEarned: 165,
    category: 'Knitwear تريكو وصوف',
    description: 'كنزة صوف تريكو محاكة بغرز عريضة دافئة وياقة عالية مريحة، تمنحك إطلالة شتوية فارهة مع الجونلات الصوف والأحذية الجلدية.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Midnight Black أسود ليلي', 'Oatmeal شوفان', 'Chocolate بني']
  },
  {
    id: 'p-fashion-suede-jacket',
    sku: 'TLK-JCK-08',
    title: 'جاكيت شمواه كلاسيكي بني بسحاب • Classic Suede Harrington Jacket',
    merchant: 'Talieska Studio • تاليسكا ستوديو',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 2600,
    originalPrice: 3200,
    rating: 4.9,
    reviewsCount: 54,
    stock: 16,
    isSyndicated: true,
    image: '/images/reels/fashion_suede_jacket_thumb.jpg',
    video: '/images/reels/fashion_suede_jacket.mp4',
    pointsEarned: 260,
    category: 'Jackets & Blazers بليزرات وجواكت',
    description: 'جاكيت شمواه رجالي فاخر بقصة هارنجتون وسحاب معدني راقٍ، ببطانة داخلية ناعمة توفر الدفء والأناقة في مختلف المناسبات.',
    sizes: ['M', 'L', 'XL', '2XL'],
    colors: ['Tobacco Brown بني توباكو', 'Dark Forest أخضر غامق', 'Navy كحلي']
  },
  {
    id: 'p-fashion-cuban-shirt',
    sku: 'TLK-SHT-09',
    title: 'قميص ريزورت بياقة كوبية مطرز • Resort Cuban Collar White Shirt',
    merchant: 'Talieska Studio • تاليسكا ستوديو',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 880,
    originalPrice: 1100,
    rating: 4.8,
    reviewsCount: 78,
    stock: 40,
    isSyndicated: true,
    image: '/images/reels/fashion_cuban_shirt_thumb.jpg',
    video: '/images/reels/fashion_cuban_shirt.mp4',
    pointsEarned: 88,
    category: 'Linen كاجوال كتان',
    description: 'قميص صيفي أنيق بياقة مفتوحة وتطريز جانبي ناعم على الصدر، مصمم للراحة والانتعاش في العطلات والإطلالات اليومية.',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Eggshell White أبيض مطفي', 'Black أسود']
  },
  {
    id: 'p-fashion-shoulder-bags',
    sku: 'KHC-BAG-01',
    title: 'حقيبة كتف جلدية كلاسيك بإبزيم ذهبي • Classic Structured Leather Shoulder Bag',
    merchant: 'Khan El Khalili Craft • ورشة خان الخليلي',
    merchantId: 'm-02',
    merchantVerified: true,
    price: 1850,
    originalPrice: 2300,
    rating: 5.0,
    reviewsCount: 130,
    stock: 28,
    isSyndicated: true,
    image: '/images/reels/fashion_shoulder_bags_thumb.jpg',
    video: '/images/reels/fashion_shoulder_bags.mp4',
    pointsEarned: 185,
    category: 'Handmade Leather منتجات جلدية',
    description: 'حقيبة كتف مهيكلة مصنوعة يدوياً من الجلد المصري المدبوغ بعناية، مزودة بحزام كتف مريح وقطعة معدنية ذهبية تضفي لمسة عصرية فخمة.',
    sizes: ['One Size قياس موحد'],
    colors: ['Ivory Cream عاجي كريمي', 'Chocolate Brown شوكولاتة', 'Burgundy بوردو', 'Charcoal Grey رمادي', 'Camel Tan جملي']
  },
  {
    id: 'p-fashion-woven-bag',
    sku: 'KHC-BAG-02',
    title: 'حقيبة جلد منسوجة يدوياً بمقبض مضفر • Handcrafted Woven Leather Bag',
    merchant: 'Khan El Khalili Craft • ورشة خان الخليلي',
    merchantId: 'm-02',
    merchantVerified: true,
    price: 1950,
    originalPrice: 2500,
    rating: 4.9,
    reviewsCount: 84,
    stock: 18,
    isSyndicated: true,
    image: '/images/reels/fashion_woven_bag_thumb.jpg',
    video: '/images/reels/fashion_woven_bag.mp4',
    pointsEarned: 195,
    category: 'Handmade Leather منتجات جلدية',
    description: 'حقيبة راقية محاكة بتقنية الجلد المنسوج الدقيق، بحزام كتف مضفر يدوياً وبطانة داخلية واسعة لتتسع لجميع متعلقاتك الأساسية.',
    sizes: ['One Size قياس موحد'],
    colors: ['Terracotta Red أحمر طوبي', 'Caramel كراميل', 'Black أسود']
  },
  {
    id: 'p-fashion-barrel-bag',
    sku: 'KHC-BAG-03',
    title: 'حقيبة بولينج أسطوانية من الجلد الطبيعي • Luxury Barrel Leather Handbag',
    merchant: 'Khan El Khalili Craft • ورشة خان الخليلي',
    merchantId: 'm-02',
    merchantVerified: true,
    price: 1750,
    originalPrice: 2200,
    rating: 4.8,
    reviewsCount: 62,
    stock: 25,
    isSyndicated: true,
    image: '/images/reels/fashion_barrel_bag_thumb.jpg',
    video: '/images/reels/fashion_barrel_bag.mp4',
    pointsEarned: 175,
    category: 'Handmade Leather منتجات جلدية',
    description: 'حقيبة بشكل أسطواني بوهيمي مستوحاة من حقائب السفر الكلاسيكية مع سحاب معدني وسعة مثالية للأيام العملية والخرجات.',
    sizes: ['One Size قياس موحد'],
    colors: ['Croc Espresso تماسيح بني داكن', 'Cognac Tan كونياك جملي', 'Deep Wine نبيذي فخم', 'Classic Black أسود كلاسيك']
  },
  {
    id: 'p-fashion-vintage-watch',
    sku: 'TBA-WTC-01',
    title: 'ساعة يد كلاسيكية برميليّة بعقارب رومانية • Vintage Tonneau Rose Gold Leather Watch',
    merchant: 'Tiba Jewelry • مجوهرات طيبة',
    merchantId: 'm-03',
    merchantVerified: true,
    price: 3400,
    originalPrice: 4200,
    rating: 5.0,
    reviewsCount: 96,
    stock: 15,
    isSyndicated: true,
    image: '/images/reels/fashion_vintage_watch_thumb.jpg',
    video: '/images/reels/fashion_vintage_watch.mp4',
    pointsEarned: 340,
    category: 'Gold Plated & Watches ساعات وحلي',
    description: 'ساعة يد فاخرة بتصميم برميلي أنيق وإطار مصقول بطلاء الذهب الوردي، ميناء كلاسيكي بأرقام رومانية وحزام جلد طبيعي مخملي الملمس.',
    sizes: ['Case 38mm'],
    colors: ['Rose Gold & Brown ذهب وردي وجلد بني', 'Silver & Black فضي وجلد أسود']
  }
];

export function AppProvider({ children }) {
  const [activeTab, setActiveTab] = useState('reels');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [merchants, setMerchants] = useState(MERCHANTS_DATA);
  const [selectedMerchantId, setSelectedMerchantId] = useState('m-01');
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [role, setRole] = useState('buyer');
  const [deviceMode, setDeviceMode] = useState('responsive');
  const [language, setLanguage] = useState('ar'); // 'ar' | 'en'
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        const balance = await RewardService.getBalance(currentUser.id);
        setRewardPoints(balance);
      }
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.role) setRole(currentUser.role);
      }
      
      const fetchedProducts = await ProductService.getProducts();
      setProducts(fetchedProducts);
      
      const fetchedMerchants = await ProductService.getMerchants();
      setMerchants(fetchedMerchants);

      const fetchedCart = await CartService.getCartItems();
      setCartItems(fetchedCart);
    };
    loadData();
  }, []);

  const updateProductSyndication = (productId) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isSyndicated: !p.isSyndicated } : p
    ));
  };

  const addProduct = (newProd) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (updatedProd) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateMerchant = (merchantId, updatedFields) => {
    setMerchants(prev => prev.map(m => {
      if (m.id === merchantId) {
        return {
          ...m,
          ...updatedFields,
          themeColor: updatedFields.themeConfig?.accentColor || updatedFields.themeColor || m.themeColor,
          themeConfig: {
            ...(m.themeConfig || {}),
            ...(updatedFields.themeConfig || {})
          },
          layoutConfig: {
            ...(m.layoutConfig || {}),
            ...(updatedFields.layoutConfig || {})
          }
        };
      }
      return m;
    }));
  };

  const [cartItems, setCartItems] = useState([]);

  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState(INITIAL_PRODUCTS[0]);
  const [rewardPoints, setRewardPoints] = useState(2450);
  const [pointsRedeemed, setPointsRedeemed] = useState(500);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const [selectedCategory, setSelectedCategory] = useState({
    id: 'women',
    slug: 'women',
    label: 'Women',
    labelAr: 'أزياء نسائية'
  });

  const openCategoryPage = (categoryOrSlug) => {
    let catObj = categoryOrSlug;
    if (typeof categoryOrSlug === 'string') {
      catObj = ProductService.getCategoryBySlug(categoryOrSlug) || {
        id: categoryOrSlug,
        slug: categoryOrSlug,
        label: categoryOrSlug.charAt(0).toUpperCase() + categoryOrSlug.slice(1),
        labelAr: categoryOrSlug
      };
    } else if (categoryOrSlug?.id && !categoryOrSlug.labelAr) {
      const found = ProductService.getCategoryBySlug(categoryOrSlug.id);
      if (found) catObj = { ...found, ...categoryOrSlug };
    }
    setSelectedCategory(catObj);
    setActiveTab('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setActiveTab('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openQuickBuy = (product) => {
    setQuickBuyProduct(product || INITIAL_PRODUCTS[0]);
    setIsQuickBuyOpen(true);
  };

  const closeQuickBuy = () => {
    setIsQuickBuyOpen(false);
  };

  const addToCart = async (product, selectedVariant = {}) => {
    const size = selectedVariant.size || 'M';
    const color = selectedVariant.color || 'Default';
    
    // Optimistic UI update could go here, but we will wait for service
    const updatedCart = await CartService.addToCart(product.id, product.merchantId, product.price, 1, size, color);
    
    // In our fallback we get an array back, in real DB we get item. 
    // Just refetch cart for simplicity for this prototype transition
    const fetchedCart = await CartService.getCartItems();
    setCartItems(fetchedCart);
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === cartItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discountFromPoints = Math.floor(pointsRedeemed / 10);
  const shippingTotal = cartItems.length > 0 ? 60 : 0;
  const grandTotal = Math.max(0, subtotal - discountFromPoints + shippingTotal);

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedProduct,
      openProductDetail,
      role,
      setRole,
      deviceMode,
      setDeviceMode,
      language,
      setLanguage,
      user,
      setUser,
      isAuthModalOpen,
      setIsAuthModalOpen,
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      totalCartCount,
      subtotal,
      discountFromPoints,
      shippingTotal,
      grandTotal,
      rewardPoints,
      setRewardPoints,
      pointsRedeemed,
      setPointsRedeemed,
      isQuickBuyOpen,
      openQuickBuy,
      closeQuickBuy,
      quickBuyProduct,
      products,
      setProducts,
      merchants,
      setMerchants,
      selectedMerchantId,
      setSelectedMerchantId,
      orders,
      setOrders,
      updateProductSyndication,
      addProduct,
      updateProduct,
      deleteProduct,
      updateMerchant,
      selectedCategory,
      setSelectedCategory,
      openCategoryPage,
      unreadNotifications,
      setUnreadNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
