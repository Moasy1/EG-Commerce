import React, { createContext, useContext, useState } from 'react';

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
    title: 'عباية كتان مغسول فاخرة • Luxury Washed Linen Abaya',
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
    pointsEarned: 145,
    category: 'Linen كاجوال كتان',
    description: 'عباية فاخرة مصنوعة 100% من الكتان الطبيعي المصري مع تطريز يدوي على الياقة والأكمام. قصة انسيابية مريحة مع تفاصيل راقية تناسب الإطلالات اليومية والمسائية الراقية.',
    sizes: ['S', 'M', 'L', 'XL', 'Free Size'],
    colors: ['Sandy Beige بيج رملي', 'Terracotta تيراكوتا', 'Black أسود ملكي']
  },
  {
    id: 'p-02',
    sku: 'TLK-DRS-02',
    title: 'فستان سهرة حرير ملكي • Emerald Silk Evening Dress',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 2450,
    originalPrice: 2900,
    rating: 5.0,
    reviewsCount: 98,
    stock: 14,
    isSyndicated: true,
    image: '/images/products/silk_dress.jpg',
    pointsEarned: 245,
    category: 'Evening Dresses فساتين سهرة',
    description: 'فستان سهرة فاخر من الحرير الزمردي اللامع بقصة درابيه انسيابية ملكية تخطف الأنظار في أرقى المناسبات.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Emerald زمردي ملكي', 'Deep Sapphire أزرق ياقوتي']
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

  const [cartItems, setCartItems] = useState([
    {
      id: 'c-1',
      productId: 'p-01',
      title: 'فستان كتان كايزن بوهيمي • Linen Dress',
      merchant: 'Talieska Studio • تاليسكا',
      price: 1450,
      quantity: 1,
      size: 'M',
      color: 'Terracotta تيراكوتا',
      image: INITIAL_PRODUCTS[0].image
    },
    {
      id: 'c-2',
      productId: 'p-02',
      title: 'شنطة كانفاس وجلد طبيعي • Canvas Tote',
      merchant: 'Khan El Khalili Craft • خان الخليلي',
      price: 920,
      quantity: 1,
      size: 'One Size',
      color: 'Beige & Brown بيج وبني',
      image: INITIAL_PRODUCTS[1].image
    }
  ]);

  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState(INITIAL_PRODUCTS[0]);
  const [rewardPoints, setRewardPoints] = useState(2450);
  const [pointsRedeemed, setPointsRedeemed] = useState(500);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

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

  const addToCart = (product, selectedVariant = {}) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id && item.size === (selectedVariant.size || 'M'));
      if (existing) {
        return prev.map(item =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `c-${Date.now()}`,
          productId: product.id,
          title: product.title,
          merchant: product.merchant,
          price: product.price,
          quantity: 1,
          size: selectedVariant.size || 'M',
          color: selectedVariant.color || 'Default',
          image: product.image
        }
      ];
    });
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
