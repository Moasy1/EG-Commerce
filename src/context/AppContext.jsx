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
    logo: 'https://lh3.googleusercontent.com/aida/AEtjO1UsXahJOBRjcwbXiXmz3TE4x4htExvhEyoiAS-VhpZxl7TSsGo3f-_x6Nzo3bd6fUdk8XVLlkhu_LNVjAOLz5YkLhGNnJlFrbdfwwZ9HkhFGb6j1Ix7TEYGz59jTLLodtg5NNNejkcbXNor9JZLHkKKnts9DucaUoOYkWns-jxicpyqYpAUFdx_0u9OAd13k8x56JzWkNvt025UsBYL--PhogjlvLHma0ScCiAjTbZb8kaAfaMgjpv2hw',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx2U5J1mKvtOYiWzhpQW4Za5R89tel2hIhZLv72GVzbqdEDC8xfmHtp6b7LVoqbpa4dXH-_RH1slnuQVziFgRbDBEX17p2JNHuLm8ZGwDWXz4EEHIyxS7bncuxrWwlfA9qR8IBJYvFyv8mI51ST6MDVBpEbdhfCgbkv33cfNlTi1Rm0emv8PIgIEk2yVN1ZJaEc8-iOwsDVDcR2Apg0kn4jvdfV9laevlMPlHnSkO3zxfYrv57Coz8',
    announcement: '✨ كولكشن صيف 2026 متاح الآن • شحن مجاني للطلبات فوق 1,500 ج.م بكود TALIESKA15',
    promoCode: 'TALIESKA15',
    discountPct: 15,
    themeColor: '#ff4646',
    whatsapp: '+201002345678',
    instagram: '@talieska.studio',
    bostaAccount: 'BST-EG-8921',
    instapayHandle: 'talieska@instapay',
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
    categoryAr: 'صناعات جلدية ونحاس يدوي',
    bio: 'حرفيون مصريون من قلب القاهرة الفاطمية يبتكرون حقائب ومقتنيات من الجلد الطبيعي والنحاس المنقوش.',
    established: '2019',
    rating: 4.8,
    reviewsCount: 112,
    verified: true,
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNw8oHJNy-iuluOMJkZtPITehUTfKsAy6gonznoc7BK1dnPSNx6c0GcsNsYqQBVburDLidf8N75P8B6TsR-ZbJgjkiL7rRLdGIglykt-D784IpJ0yW8Qm_KZApdx6XKH2oRx-K0eBOGvBfxv3HKsKbdk270VBclA24as6PkV6Klh-RXsmR3Nx55SabuCE6hULUPE66YadEXdrWwrVRphcJRKI8xzylI74xZAqoQTOM-acylJZBMeBp',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNw8oHJNy-iuluOMJkZtPITehUTfKsAy6gonznoc7BK1dnPSNx6c0GcsNsYqQBVburDLidf8N75P8B6TsR-ZbJgjkiL7rRLdGIglykt-D784IpJ0yW8Qm_KZApdx6XKH2oRx-K0eBOGvBfxv3HKsKbdk270VBclA24as6PkV6Klh-RXsmR3Nx55SabuCE6hULUPE66YadEXdrWwrVRphcJRKI8xzylI74xZAqoQTOM-acylJZBMeBp',
    announcement: '🏮 حقائب جلد طبيعي يدوي 100% مع ضمان استبدال مجاني',
    promoCode: 'KHAN10',
    discountPct: 10,
    themeColor: '#feb700',
    whatsapp: '+201112345678',
    instagram: '@khan.craft.eg',
    bostaAccount: 'BST-EG-4412',
    instapayHandle: 'khancraft@instapay',
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
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE6ElFeAGR-jIwUUr_wmAwZXRDdMDVrRwDHjllEmGcOlSrCYklmm1xdpIhs_IlvPLQH4kQgUDxNfixTvsfWJLCzTgGDxXnYt2p_SusYhDHzVjNIb-qWn702MHMMm_hBuaBGZ6vFMWwem1s46gRwVBvyNSCHfDBF2zmtaDHkopaECJ3eoJDP6TNDxqeOfSplpK4Ml1l2IdoZjjzjvMgomVSs5iLdru16sJ9KDTh_qJ5ygxobd2xN6XY',
    banner: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE6ElFeAGR-jIwUUr_wmAwZXRDdMDVrRwDHjllEmGcOlSrCYklmm1xdpIhs_IlvPLQH4kQgUDxNfixTvsfWJLCzTgGDxXnYt2p_SusYhDHzVjNIb-qWn702MHMMm_hBuaBGZ6vFMWwem1s46gRwVBvyNSCHfDBF2zmtaDHkopaECJ3eoJDP6TNDxqeOfSplpK4Ml1l2IdoZjjzjvMgomVSs5iLdru16sJ9KDTh_qJ5ygxobd2xN6XY',
    announcement: '👑 قطع محدودة مستوحاة من زهرة اللوتس • علبة هدايا فاخرة مجاناً',
    promoCode: 'TIBA20',
    discountPct: 20,
    themeColor: '#10b981',
    whatsapp: '+201223456789',
    instagram: '@tiba.jewels',
    bostaAccount: 'BST-EG-1190',
    instapayHandle: 'tiba@instapay',
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
    productTitle: 'فستان كتان كايزن بوهيمي • M',
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
    productTitle: 'كيمونو كتان رملي مطرز • 54',
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
    productTitle: 'شنطة كانفاس وجلد طبيعي',
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
    id: 'p-01',
    sku: 'TLK-DRS-01',
    title: 'فستان كتان كايزن بوهيمي • Linen Bohemian Dress',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 1450,
    originalPrice: 1800,
    rating: 4.9,
    reviewsCount: 142,
    stock: 24,
    isSyndicated: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6M9R0STgJd832SzAKcYCBaZhk4lsAzKzNpUB5n0JAA3r_XOv4G8K7SRfSjpFZX3X5DVQqEfIdf6qaXQ748hfWdQOUPny6vW4aM9gK-0hTe2qrsaPInpzFrR-6iMSoxdoDFEbD2TiJkzXX4PR4veBKMzG8olzd2ZgOJicW2d0e24Klq2ebAK1hRX09eProZ4BsgCNRQVpP5WP8gA8TnfF2WPVMam-pQfxkwL7jgYwnTNfzzmsF6ThB',
    pointsEarned: 140,
    category: 'Linen كاجوال كتان',
    description: 'فستان صيفي فاخر مصنوع 100% من الكتان الطبيعي المصري المنسوج يدويًا. قصة انسيابية مريحة مع تفاصيل درابيه عصرية تناسب الإطلالات اليومية والمسائية الراقية.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Terracotta تيراكوتا', 'Sandy Beige بيج رملي', 'Black أسود ملكي']
  },
  {
    id: 'p-02',
    sku: 'KHC-BAG-02',
    title: 'شنطة كانفاس وجلد طبيعي • Handmade Canvas Tote',
    merchant: 'Khan El Khalili Craft • ورشة خان الخليلي',
    merchantId: 'm-02',
    merchantVerified: true,
    price: 920,
    originalPrice: 1150,
    rating: 4.8,
    reviewsCount: 89,
    stock: 14,
    isSyndicated: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNw8oHJNy-iuluOMJkZtPITehUTfKsAy6gonznoc7BK1dnPSNx6c0GcsNsYqQBVburDLidf8N75P8B6TsR-ZbJgjkiL7rRLdGIglykt-D784IpJ0yW8Qm_KZApdx6XKH2oRx-K0eBOGvBfxv3HKsKbdk270VBclA24as6PkV6Klh-RXsmR3Nx55SabuCE6hULUPE66YadEXdrWwrVRphcJRKI8xzylI74xZAqoQTOM-acylJZBMeBp',
    pointsEarned: 92,
    category: 'Leather Bags شنط جلد',
    description: 'شنطة تجمع بين خامات الكانفاس المتين وجلد العجل الطبيعي المشغول بحرفية يدوية مصرية أصيلة.',
    sizes: ['One Size مقاس موحد'],
    colors: ['Beige & Brown بيج وبني']
  },
  {
    id: 'p-03',
    sku: 'TBA-NCK-03',
    title: 'عقد ذهبي مستوحى من اللوتس • Lotus Gold Necklace',
    merchant: 'Tiba Jewelry • مجوهرات طيبة',
    merchantId: 'm-03',
    merchantVerified: true,
    price: 640,
    originalPrice: 800,
    rating: 5.0,
    reviewsCount: 56,
    stock: 30,
    isSyndicated: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE6ElFeAGR-jIwUUr_wmAwZXRDdMDVrRwDHjllEmGcOlSrCYklmm1xdpIhs_IlvPLQH4kQgUDxNfixTvsfWJLCzTgGDxXnYt2p_SusYhDHzVjNIb-qWn702MHMMm_hBuaBGZ6vFMWwem1s46gRwVBvyNSCHfDBF2zmtaDHkopaECJ3eoJDP6TNDxqeOfSplpK4Ml1l2IdoZjjzjvMgomVSs5iLdru16sJ9KDTh_qJ5ygxobd2xN6XY',
    pointsEarned: 64,
    category: 'Jewelry إكسسوارات ومجوهرات',
    description: 'سلسال فضة 925 مطلي بطبقة سميكة من الذهب عيار 18 بتصميم فرعوني معاصر مستلهم من زهرة اللوتس.',
    sizes: ['45 cm'],
    colors: ['Yellow Gold ذهب أصفر']
  },
  {
    id: 'p-04',
    sku: 'TLK-KMN-04',
    title: 'كيمونو كتان رملي مطرز • Embroidered Sand Kimono',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 1980,
    originalPrice: 2400,
    rating: 4.9,
    reviewsCount: 38,
    stock: 12,
    isSyndicated: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx2U5J1mKvtOYiWzhpQW4Za5R89tel2hIhZLv72GVzbqdEDC8xfmHtp6b7LVoqbpa4dXH-_RH1slnuQVziFgRbDBEX17p2JNHuLm8ZGwDWXz4EEHIyxS7bncuxrWwlfA9qR8IBJYvFyv8mI51ST6MDVBpEbdhfCgbkv33cfNlTi1Rm0emv8PIgIEk2yVN1ZJaEc8-iOwsDVDcR2Apg0kn4jvdfV9laevlMPlHnSkO3zxfYrv57Coz8',
    pointsEarned: 198,
    category: 'Abayas & Kimonos عبايات',
    description: 'قطعة فنية بتطريزات دقيقة من خيوط الحرير على أطراف الأكمام والياقة مع كتان رملي خفيف ومريح.',
    sizes: ['52', '54', '56', '58'],
    colors: ['Sandy Beige بيج رملي', 'Olive Green زيتي']
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

  const updateProductSyndication = (productId) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isSyndicated: !p.isSyndicated } : p
    ));
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
