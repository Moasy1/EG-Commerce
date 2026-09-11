import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const INITIAL_PRODUCTS = [
  {
    id: 'p-01',
    title: 'فستان لينين كتان كايزن',
    merchant: 'دار الكتان المصري',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 1850,
    originalPrice: 2200,
    rating: 4.9,
    reviewsCount: 142,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6M9R0STgJd832SzAKcYCBaZhk4lsAzKzNpUB5n0JAA3r_XOv4G8K7SRfSjpFZX3X5DVQqEfIdf6qaXQ748hfWdQOUPny6vW4aM9gK-0hTe2qrsaPInpzFrR-6iMSoxdoDFEbD2TiJkzXX4PR4veBKMzG8olzd2ZgOJicW2d0e24Klq2ebAK1hRX09eProZ4BsgCNRQVpP5WP8gA8TnfF2WPVMam-pQfxkwL7jgYwnTNfzzmsF6ThB',
    pointsEarned: 185,
    category: 'فساتين',
    description: 'فستان صيفي فاخر مصنوع 100% من الكتان الطبيعي المصري المنسوج يدويًا. قصة انسيابية مريحة مع تفاصيل درابيه عصرية تناسب الإطلالات اليومية والمسائية الراقية.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['تيراكوتا (طوبي)', 'رملي بيج', 'أسود ملكي']
  },
  {
    id: 'p-02',
    title: 'حقيبة جلدية كانفاس يدوي',
    merchant: 'ورشة خان الخليلي',
    merchantId: 'm-02',
    merchantVerified: true,
    price: 920,
    originalPrice: 1150,
    rating: 4.8,
    reviewsCount: 89,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNw8oHJNy-iuluOMJkZtPITehUTfKsAy6gonznoc7BK1dnPSNx6c0GcsNsYqQBVburDLidf8N75P8B6TsR-ZbJgjkiL7rRLdGIglykt-D784IpJ0yW8Qm_KZApdx6XKH2oRx-K0eBOGvBfxv3HKsKbdk270VBclA24as6PkV6Klh-RXsmR3Nx55SabuCE6hULUPE66YadEXdrWwrVRphcJRKI8xzylI74xZAqoQTOM-acylJZBMeBp',
    pointsEarned: 92,
    category: 'إكسسوارات',
    description: 'حقيبة تجمع بين خامات الكانفاس المتين وجلد العجل الطبيعي المشغول بحرفية يدوية مصرية أصيلة.',
    sizes: ['مقاس موحد'],
    colors: ['بيج وبني']
  },
  {
    id: 'p-03',
    title: 'عقد ذهبي مستوحى من زهرة اللوتس',
    merchant: 'مجوهرات طيبة',
    merchantId: 'm-03',
    merchantVerified: true,
    price: 640,
    originalPrice: 800,
    rating: 5.0,
    reviewsCount: 56,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE6ElFeAGR-jIwUUr_wmAwZXRDdMDVrRwDHjllEmGcOlSrCYklmm1xdpIhs_IlvPLQH4kQgUDxNfixTvsfWJLCzTgGDxXnYt2p_SusYhDHzVjNIb-qWn702MHMMm_hBuaBGZ6vFMWwem1s46gRwVBvyNSCHfDBF2zmtaDHkopaECJ3eoJDP6TNDxqeOfSplpK4Ml1l2IdoZjjzjvMgomVSs5iLdru16sJ9KDTh_qJ5ygxobd2xN6XY',
    pointsEarned: 64,
    category: 'مجوهرات',
    description: 'سلسال فضة عيار 925 مطلي بطبقة سميكة من الذهب عيار 18 بتصميم فرعوني معاصر مستلهم من زهرة اللوتس.',
    sizes: ['45 سم'],
    colors: ['ذهب أصفر']
  },
  {
    id: 'p-04',
    title: 'عباية حرير مطرزة يدوياً',
    merchant: 'دار الكتان المصري',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 2400,
    originalPrice: 2800,
    rating: 4.9,
    reviewsCount: 38,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBebD1XV7lyRsAl9IX8tKvw96y0vY-A3gyXbIFikiB9lcBqnBPraZyUu4KwB5cr8o2GSX3cq4h9v-tUoDKKT4cqFSr8eWnzqEj8vLK4YSx_rLs9XllzyohklMCsnt1PwT9FRovU6hVvUny8XCCEDLqQDyPOieiXb5w3HOCsbrm7L8CfFkF4E0PCcCZ1TA5VPM1qQ8214MO3rQB2O-zWXR5ggSKybljFH39T3QKh6AgE9rTLMKNbH4AW',
    pointsEarned: 240,
    category: 'عبايات',
    description: 'قطعة فنية بتطريزات دقيقة من خيوط الحرير على أطراف الأكمام والياقة.',
    sizes: ['52', '54', '56', '58'],
    colors: ['كحلي داكن', 'رمادي لؤلؤي']
  }
];

export function AppProvider({ children }) {
  // Navigation state
  const [activeTab, setActiveTab] = useState('reels'); // 'reels' | 'shop' | 'rewards' | 'studio' | 'profile' | 'product' | 'cart' | 'checkout' | 'tracking' | 'merchant'
  const [selectedProduct, setSelectedProduct] = useState(INITIAL_PRODUCTS[0]);
  const [role, setRole] = useState('buyer'); // 'buyer' | 'creator' | 'merchant'
  const [deviceMode, setDeviceMode] = useState('responsive'); // 'responsive' | 'mobile-frame'

  // Cart state
  const [cartItems, setCartItems] = useState([
    {
      id: 'c-1',
      productId: 'p-01',
      title: 'فستان لينين كتان كايزن',
      merchant: 'دار الكتان المصري',
      price: 1850,
      quantity: 1,
      size: 'M',
      color: 'تيراكوتا (طوبي)',
      image: INITIAL_PRODUCTS[0].image
    },
    {
      id: 'c-2',
      productId: 'p-02',
      title: 'حقيبة جلدية كانفاس يدوي',
      merchant: 'ورشة خان الخليلي',
      price: 920,
      quantity: 1,
      size: 'مقاس موحد',
      color: 'بيج وبني',
      image: INITIAL_PRODUCTS[1].image
    }
  ]);

  // Quick Buy Drawer state
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [quickBuyProduct, setQuickBuyProduct] = useState(INITIAL_PRODUCTS[0]);

  // Rewards state
  const [rewardPoints, setRewardPoints] = useState(2450);
  const [pointsRedeemed, setPointsRedeemed] = useState(500); // 500 points = 50 EGP discount

  // Notifications alert count
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  // Actions
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
          color: selectedVariant.color || 'اللون الافتراضي',
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
  const discountFromPoints = Math.floor(pointsRedeemed / 10); // 10 points = 1 EGP
  const shippingTotal = cartItems.length > 0 ? 60 : 0; // Fixed flat shipping
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
