import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function MerchantStorefront() {
  const { 
    merchants, 
    selectedMerchantId, 
    setSelectedMerchantId,
    products, 
    openProductDetail, 
    addToCart, 
    openQuickBuy,
    setActiveTab
  } = useApp();

  const currentMerchant = merchants.find(m => m.id === selectedMerchantId) || merchants[0];
  const merchantProducts = products.filter(p => p.merchantId === currentMerchant.id);
  
  // Storefront navigation state
  const [storeView, setStoreView] = useState('home'); // 'home' | 'about'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [copiedCode, setCopiedCode] = useState(false);
  const [storeCartCount, setStoreCartCount] = useState(2);
  const [showStoreCheckoutNotice, setShowStoreCheckoutNotice] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', phone: '', topic: 'sizing', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Active Reel Modal state
  const [activeReel, setActiveReel] = useState(null);

  const copyPromoCode = () => {
    navigator.clipboard?.writeText(currentMerchant.promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', phone: '', topic: 'sizing', message: '' });
    }, 3500);
  };

  // Filter & sort products
  let displayedProducts = selectedCategory === 'all'
    ? merchantProducts
    : merchantProducts.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  if (sortBy === 'price_low') {
    displayedProducts = [...displayedProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'rating') {
    displayedProducts = [...displayedProducts].sort((a, b) => b.rating - a.rating);
  }

  // Customer Reviews Data
  const customerTestimonials = [
    {
      id: 't-1',
      name: 'م. نادين الشريف',
      location: 'المعادي، القاهرة',
      rating: 5,
      date: 'منذ 3 أيام',
      review: 'فستان الكتان البوهيمي فاق كل توقعاتي! جودة الكتان المصري والتقفيل والتطريز اليدوي أرقى من براندات عالمية بمراحل. التوصيل مع مندوب بوسطة وصل خلال 48 ساعة بالضبط.',
      product: 'فستان كتان كايزن بوهيمي',
      verified: true
    },
    {
      id: 't-2',
      name: 'سارة عبد الرحمن',
      location: 'الشيخ زايد، الجيزة',
      rating: 5,
      date: 'منذ أسبوع',
      review: 'الكيمونو الرملي تحفة فنية في اللبس، خفيف وانسيابي جداً في حر الصيف. دفعت بـ InstaPay والتأكيد كان لحظي. شكراً لفريق تاليسكا على الاهتمام بالتفاصيل.',
      product: 'كيمونو كتان رملي مطرز',
      verified: true
    },
    {
      id: 't-3',
      name: 'د. مريم عثمان',
      location: 'سموحة، الإسكندرية',
      rating: 5,
      date: 'منذ أسبوعين',
      review: 'تواصلت مع استشارية الأزياء عبر الواتساب لاختيار المقاس المناسب، وكانت متعاونة جداً. المقاس طلع مضبوط بالملي وخدمة المعاينة عند باب البيت تمنح ثقة كاملة.',
      product: 'فستان كتان صيفي نقي',
      verified: true
    }
  ];

  // Community Reels Data
  const communityReels = [
    { 
      id: 'r1', 
      creator: '@nour_style', 
      creatorName: 'نور ستايل',
      caption: 'تنسيق فستان الكتان للعمل والمساء ✨ أقمشة مصرية 100%', 
      views: '34.2K', 
      likes: '2.8K',
      image: '/images/reels/reel_1.jpg',
      taggedProduct: merchantProducts[0]
    },
    { 
      id: 'r2', 
      creator: '@salma_egypt', 
      creatorName: 'سلمى الأحمدي',
      caption: 'ريفيو الكيمونو الرملي على الطبيعة 😍 تطريز يدوي فاخر', 
      views: '28.6K', 
      likes: '1.9K',
      image: '/images/reels/reel_2.jpg',
      taggedProduct: merchantProducts[1] || merchantProducts[0]
    },
    { 
      id: 'r3', 
      creator: '@farida_fashion', 
      creatorName: 'فريدة كمال',
      caption: 'إطلالة صيفية هادية وأنيقة بلمسات مينيمال راقية 🏖️', 
      views: '41.5K', 
      likes: '3.4K',
      image: '/images/reels/reel_3.jpg',
      taggedProduct: merchantProducts[2] || merchantProducts[0]
    },
    { 
      id: 'r4', 
      creator: '@cairo_looks', 
      creatorName: 'كايرو لوكس',
      caption: 'تفاصيل الخياطة من مشاغل تاليسكا بالقاهرة 🪡 فخر الصناعة المصرية', 
      views: '19.8K', 
      likes: '1.5K',
      image: '/images/reels/reel_4.jpg',
      taggedProduct: merchantProducts[3] || merchantProducts[0]
    }
  ];

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 pb-24">
      {/* 1. Top B2B SaaS Subdomain & Platform Bridge Bar */}
      <div className="w-full bg-surface-container-lowest border-b border-surface-container-high py-2 px-3 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Subdomain & Verification Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary/10 text-tertiary border border-tertiary/20 font-mono text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">verified</span>
              {currentMerchant.subdomain}
            </span>
            {currentMerchant.customDomain && (
              <span className="hidden sm:inline-flex items-center gap-1 text-on-surface-variant text-[11px]">
                <span className="material-symbols-outlined text-[13px] text-tertiary">lock</span>
                {currentMerchant.customDomain}
              </span>
            )}
          </div>

          {/* SaaS Demo Controls: Switch Merchant Storefront or Go to Merchant Admin */}
          <div className="flex items-center gap-2">
            <span className="text-on-surface-variant text-[11px] hidden md:inline">معاينة متجر آخر:</span>
            <select
              value={currentMerchant.id}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              className="bg-surface-container-low text-on-surface px-2 py-0.5 rounded text-[11px] border border-surface-container-high focus:outline-none focus:border-primary cursor-pointer"
            >
              {merchants.map(m => (
                <option key={m.id} value={m.id}>
                  🏬 {m.shortName} ({m.slug})
                </option>
              ))}
            </select>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-[11px] transition-all"
            >
              <span className="material-symbols-outlined text-[13px]">dashboard</span>
              <span>لوحة التاجر (SaaS Admin)</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-container-high hover:bg-surface-container text-on-surface text-[11px] transition-all"
              title="العودة إلى تطبيق EG-Commerce وسوق الموضة العام"
            >
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
              <span>سوق EG الموحد</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Merchant Announcement Bar */}
      <div 
        className="w-full py-2 px-3 text-center text-xs font-bold text-on-primary shadow-xs transition-colors"
        style={{ backgroundColor: currentMerchant.themeColor || '#ff4646' }}
      >
        <p className="max-w-4xl mx-auto truncate flex items-center justify-center gap-2">
          <span>✨</span>
          <span>{currentMerchant.announcement}</span>
          <span className="hidden sm:inline bg-black/20 px-2 py-0.5 rounded text-[10px] font-mono">
            كود: {currentMerchant.promoCode}
          </span>
        </p>
      </div>

      {/* 3. Merchant Branded Header with Storefront Sub-Navigation */}
      <div className="w-full bg-surface-container-lowest/90 backdrop-blur-md sticky top-16 z-30 border-b border-surface-container-high px-4 md:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Store Title */}
          <div 
            onClick={() => setStoreView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src={currentMerchant.logo} 
              alt={currentMerchant.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-surface-container-high shadow-xs group-hover:border-primary transition-all" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base md:text-lg font-bold font-serif text-on-surface leading-tight">
                  {currentMerchant.name}
                </h1>
                <span className="material-symbols-outlined text-tertiary text-[17px]" title="علامة تجارية موثقة">check_circle</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                {currentMerchant.categoryAr} • القاهرة
              </p>
            </div>
          </div>

          {/* Storefront Internal Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-container-low px-3 py-1 rounded-full border border-surface-container-high text-xs">
            <button
              onClick={() => {
                setStoreView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                storeView === 'home'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              الرئيسية
            </button>
            <a
              href="#products-section"
              onClick={() => setStoreView('home')}
              className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-medium transition-colors"
            >
              المنتجات
            </a>
            <a
              href="#reviews-section"
              onClick={() => setStoreView('home')}
              className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-medium transition-colors"
            >
              آراء العملاء
            </a>
            <a
              href="#reels-section"
              onClick={() => setStoreView('home')}
              className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-medium transition-colors"
            >
              الريلز
            </a>
            <button
              onClick={() => {
                setStoreView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                storeView === 'about'
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              عن تاليسكا (About Us)
            </button>
            <a
              href="#contact-section"
              className="px-3 py-1 text-on-surface-variant hover:text-on-surface font-medium transition-colors"
            >
              تواصل معنا
            </a>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${currentMerchant.whatsapp.replace(/[^0-9]/g, '')}?text=مرحبا، أود الاستفسار عن كولكشن ${encodeURIComponent(currentMerchant.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>محادثة واتساب</span>
            </a>

            <button 
              onClick={() => setShowStoreCheckoutNotice(true)}
              className="relative p-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high transition-all"
              title="سلة المتجر المباشرة"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {storeCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
                  {storeCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 pt-5 space-y-12">
        {/* Checkout Toast Notification */}
        {showStoreCheckoutNotice && (
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-primary/40 shadow-lg flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">local_mall</span>
              <div>
                <h4 className="text-xs font-bold text-on-surface">إتمام الشراء المباشر من متجر {currentMerchant.shortName}</h4>
                <p className="text-[11px] text-on-surface-variant">
                  يمكنك الدفع المباشر للتاجر عبر InstaPay أو نقداً عند الاستلام COD، أو دمج طلبك في سلة EG-Commerce الموحدة!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('checkout')}
                className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 shadow-xs"
              >
                الدفع المباشر
              </button>
              <button
                onClick={() => setShowStoreCheckoutNotice(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: HOME STOREFRONT PAGE                                              */}
        {/* ========================================================================= */}
        {storeView === 'home' && (
          <>
            {/* SECTION 1: HERO SECTION */}
            <section className="relative rounded-3xl overflow-hidden border border-surface-container-high shadow-lg bg-surface-container-lowest">
              <div className="h-72 sm:h-96 md:h-[460px] w-full relative">
                <img 
                  src={currentMerchant.banner} 
                  alt={currentMerchant.name}
                  className="w-full h-full object-cover brightness-[0.65] contrast-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
                
                {/* Hero Overlay Details */}
                <div className="absolute bottom-6 inset-x-6 sm:bottom-10 sm:inset-x-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="max-w-xl space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-[11px] font-bold backdrop-blur-sm">
                        كولكشن صيف 2026 • Summer Pure Linen
                      </span>
                      <span className="px-3 py-1 rounded-full bg-surface-container-lowest/80 text-on-surface text-[11px] font-medium backdrop-blur-sm border border-surface-container-high">
                        صناعة يدوية بالقاهرة 🪡
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white tracking-tight leading-tight">
                      أزياء الكتان المصري الفاخر • Authentic Heritage
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 sm:line-clamp-3">
                      {currentMerchant.bio} قطع انسيابية مستوحاة من هدوء الطبيعة صممت لتمنحك إطلالة راقية في الصيف والمساء.
                    </p>

                    {/* Dual CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href="#products-section"
                        className="px-5 py-2.5 rounded-2xl bg-primary text-on-primary text-xs sm:text-sm font-bold hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
                        <span>تسوق الكولكشن الآن</span>
                      </a>
                      <a
                        href="#reels-section"
                        className="px-4 py-2.5 rounded-2xl bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface text-xs sm:text-sm font-bold border border-surface-container-high backdrop-blur-md transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[17px] text-secondary">play_circle</span>
                        <span>مشاهدة إطلالات الريلز</span>
                      </a>
                    </div>
                  </div>

                  {/* Promo Card Pill */}
                  <div className="bg-surface-container-low/95 backdrop-blur-md p-4 rounded-2xl border border-surface-container-highest flex flex-col gap-2 self-start md:self-auto shadow-md">
                    <span className="text-[10px] text-on-surface-variant font-medium">خصم فوري 15% على طلبك الأول:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-mono font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-xl border border-secondary/20">
                        {currentMerchant.promoCode}
                      </span>
                      <button
                        onClick={copyPromoCode}
                        className="px-3 py-1.5 rounded-xl bg-secondary hover:brightness-110 text-on-secondary text-xs font-bold transition-all flex items-center gap-1 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedCode ? 'done' : 'content_copy'}
                        </span>
                        <span>{copiedCode ? 'تم النسخ!' : 'نسخ الكود'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: ICON BOXES (4 TRUST PILLARS) */}
            <section className="space-y-3">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-[11px] font-bold text-secondary tracking-wider uppercase">لماذا تتسوق من متجر تاليسكا؟</span>
                <h3 className="text-lg md:text-xl font-bold font-serif text-on-surface mt-0.5">
                  معايير الجودة والراحة المصرية
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Box 1 */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high hover:border-primary/40 transition-all duration-300 space-y-2.5 group shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">dry_cleaning</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-on-surface">أقمشة طبيعية 100%</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      كتان مصري طبيعي خالص مغزول يدوياً، يسمح بالتنفس ومقاوم للانكماش بدون أي ألياف صناعية.
                    </p>
                  </div>
                </div>

                {/* Box 2 */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high hover:border-tertiary/40 transition-all duration-300 space-y-2.5 group shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-on-surface">شحن سريع 48 ساعة</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      توصيل آمن لجميع محافظات مصر بالتعاون مع بوسطة Bosta Express مع تتبع لحظي للشحنة.
                    </p>
                  </div>
                </div>

                {/* Box 3 */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high hover:border-secondary/40 transition-all duration-300 space-y-2.5 group shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">payments</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-on-surface">دفع فوري ومرن</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      ادفع فوراً عبر InstaPay أو البطاقات البنكية، أو ادفع نقداً للمندوب عند الاستلام (COD).
                    </p>
                  </div>
                </div>

                {/* Box 4 */}
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high hover:border-on-surface/40 transition-all duration-300 space-y-2.5 group shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[22px]">published_with_changes</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-on-surface">معاينة واستبدال 14 يوم</h4>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      حق فتح الشحنة وقياس القطعة بحضور المندوب، مع استبدال مجاني فوري في حالة عدم تناسب المقاس.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: PRODUCTS GRID & CATALOG */}
            <section id="products-section" className="space-y-5 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-high pb-4">
                <div>
                  <h3 className="text-lg md:text-xl font-bold font-serif text-on-surface">
                    تشكيلة منتجات متجر {currentMerchant.shortName}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    تصفح أحدث القطع المتاحة من الكتان والتطريز مع خيارات المقاسات والألوان
                  </p>
                </div>

                {/* Filters & Sorting Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-surface-container-high overflow-x-auto scrollbar-none">
                    {['all', 'كتان', 'عبايات', 'قمصان'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {cat === 'all' ? 'جميع القطع' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-surface-container-low text-on-surface text-xs font-medium px-2.5 py-1.5 rounded-xl border border-surface-container-high focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="popular">⭐ الأكثر طلباً</option>
                    <option value="rating">🌟 الأعلى تقييماً</option>
                    <option value="price_low">💰 السعر: الأقل أولاً</option>
                  </select>
                </div>
              </div>

              {/* Products Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4">
                {displayedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="group rounded-2xl bg-surface-container-lowest border border-surface-container-high overflow-hidden hover:border-surface-container-highest hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Media Container */}
                    <div 
                      onClick={() => openProductDetail(prod)}
                      className="aspect-[3/4] w-full relative overflow-hidden bg-surface-container-low cursor-pointer"
                    >
                      <img 
                        src={prod.image} 
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      {/* Category Tag */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-[10px] font-bold border border-surface-container-high">
                          {prod.category.split(' ')[0]}
                        </span>
                      </div>

                      {/* Sale Discount Tag */}
                      {prod.originalPrice > prod.price && (
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 rounded-md bg-primary text-on-primary text-[10px] font-bold shadow-xs">
                            وفر {prod.originalPrice - prod.price} ج.م
                          </span>
                        </div>
                      )}

                      {/* Stock Urgency Tag */}
                      <div className="absolute bottom-11 right-2">
                        <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-medium text-amber-300 border border-amber-300/30">
                          متبقي 4 قطع فقط
                        </span>
                      </div>

                      {/* Quick Buy Hover Action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openQuickBuy(prod);
                        }}
                        className="absolute bottom-2 inset-x-2 py-1.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-xs font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-primary hover:text-on-primary"
                      >
                        <span className="material-symbols-outlined text-[15px]">flash_on</span>
                        <span>شراء فوري سريع</span>
                      </button>
                    </div>

                    {/* Content Details */}
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
                      <div>
                        {/* Title */}
                        <h4 
                          onClick={() => openProductDetail(prod)}
                          className="text-xs md:text-sm font-semibold text-on-surface line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                        >
                          {prod.title}
                        </h4>

                        {/* Ratings & Reviews */}
                        <div className="flex items-center gap-1 text-secondary text-xs mt-1">
                          <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                          <span className="font-bold">{prod.rating}</span>
                          <span className="text-[10px] text-on-surface-variant">({prod.reviewsCount} تقييم)</span>
                        </div>

                        {/* Color Swatches Mockup */}
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#c07a5d] border border-white/20" title="تيراكوتا" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#d8cca3] border border-white/20" title="بيج رملي" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#1e232a] border border-white/20" title="أسود ملكي" />
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-2 border-t border-surface-container-high flex items-center justify-between gap-1">
                        <div>
                          <div className="text-xs md:text-sm font-bold text-on-surface">
                            {prod.price.toLocaleString()} <span className="text-[10px] font-normal text-on-surface-variant">ج.م</span>
                          </div>
                          {prod.originalPrice > prod.price && (
                            <span className="text-[10px] text-on-surface-variant line-through">
                              {prod.originalPrice.toLocaleString()} ج.م
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            addToCart(prod);
                            setStoreCartCount(prev => prev + 1);
                          }}
                          className="p-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-on-primary transition-all border border-primary/20"
                          title="أضف لسلة المتجر"
                        >
                          <span className="material-symbols-outlined text-[17px]">add_shopping_cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: TESTIMONIALS (آراء العملاء الموثقة) */}
            <section id="reviews-section" className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-surface-container-high pb-3">
                <div>
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">تجارب حقيقية</span>
                  <h3 className="text-lg md:text-xl font-bold font-serif text-on-surface">
                    ماذا يقول عملاء متجر تاليسكا ستوديو؟
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="text-secondary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>4.9 / 5.0</span>
                  </span>
                  <span>بناءً على 180+ طلب موثق في مصر</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {customerTestimonials.map((t) => (
                  <div 
                    key={t.id}
                    className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-secondary">
                          {[...Array(t.rating)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-[14px]">star</span>
                          ))}
                        </div>
                        <span className="text-[10px] text-on-surface-variant">{t.date}</span>
                      </div>
                      <p className="text-xs text-on-surface leading-relaxed">
                        "{t.review}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-surface-container-high flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-on-surface block">{t.name}</span>
                        <span className="text-on-surface-variant text-[10px]">{t.location}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-tertiary/10 text-tertiary text-[10px] font-bold">
                        مشتري موثق ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 5: REELS SHOWCASE (إطلالات حية من صناع المحتوى) */}
            <section id="reels-section" className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-primary uppercase tracking-wider">إطلالات حية بالصوت والصورة</span>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-on-surface">
                    شاهدي ريلز وتنسيقات مجتمع تاليسكا • Community Looks
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('reels')}
                  className="text-xs text-secondary font-bold hover:underline flex items-center gap-1"
                >
                  <span>مشاهدة المزيد في ريلز EG</span>
                  <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {communityReels.map((reel) => (
                  <div
                    key={reel.id}
                    onClick={() => setActiveReel(reel)}
                    className="aspect-[9/16] rounded-2xl overflow-hidden relative group cursor-pointer bg-surface-container-low border border-surface-container-high hover:border-primary/50 transition-all duration-300"
                  >
                    <img 
                      src={reel.image} 
                      alt={reel.creator}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3 text-white">
                      <div className="flex items-center gap-1 text-[10px] text-slate-300 mb-1">
                        <span className="material-symbols-outlined text-[13px] text-white">visibility</span>
                        <span>{reel.views}</span>
                        <span>•</span>
                        <span className="material-symbols-outlined text-[13px] text-primary">favorite</span>
                        <span>{reel.likes}</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-300 truncate">{reel.creator}</span>
                      <p className="text-[10px] text-slate-200 line-clamp-1">{reel.caption}</p>
                    </div>

                    {/* Tagged Product Pin on Reel */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px] text-secondary">local_mall</span>
                      <span>معاينة القطعة</span>
                    </div>

                    <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 6: SOCIAL MEDIA & COMMUNITY */}
            <section className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">مواقع التواصل الاجتماعي</span>
                  <h3 className="text-base sm:text-lg font-bold font-serif text-on-surface">
                    انضمي إلى مجتمع تاليسكا ستوديو (@talieska.studio)
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span className="text-pink-400 font-mono font-bold">IG</span>
                    <span>42.8K متابعة</span>
                  </a>
                  <a
                    href="https://tiktok.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span className="text-cyan-400 font-mono font-bold">TT</span>
                    <span>1.2M مشاهدة</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'sm1', label: 'كواليس التطريز اليدوي 🪡', img: '/images/reels/reel_3.jpg' },
                  { id: 'sm2', label: 'أزياء الكتان في شوارع المعز 🌿', img: '/images/reels/reel_1.jpg' },
                  { id: 'sm3', label: 'تنسيقات عصرية للرووف لاونج ☀️', img: '/images/reels/reel_2.jpg' },
                  { id: 'sm4', label: 'ورشة النحاس والتحف الفاطمية 📦', img: '/images/reels/reel_4.jpg' },
                ].map((item) => (
                  <div key={item.id} className="group aspect-square rounded-2xl overflow-hidden relative bg-surface-container-low border border-surface-container-high">
                    <img 
                      src={item.img} 
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                      <span className="text-[11px] font-bold text-white">{item.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 7: CONTACT US SECTION */}
            <section id="contact-section" className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">خدمة العملاء والاستشارات</span>
                <h3 className="text-lg md:text-xl font-bold font-serif text-on-surface mt-0.5">
                  تواصل مباشرة مع استشارية أزياء تاليسكا
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  نحن هنا لمساعدتك في اختيار المقاس المناسب، الاستفسار عن الشحن والتوصيل، أو تنسيق إطلالاتك الخاصة.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information Cards */}
                <div className="space-y-3">
                  {/* WhatsApp Quick Chat */}
                  <a
                    href={`https://wa.me/${currentMerchant.whatsapp.replace(/[^0-9]/g, '')}?text=مرحبا، أود استشارة أزياء بخصوص مقاسات متجر ${encodeURIComponent(currentMerchant.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/15 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">chat</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">محادثة واتساب فورية (WhatsApp)</h4>
                        <p className="text-[11px] text-on-surface-variant">الرد خلال دقائق مع منسقة المقاسات</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-emerald-400 rtl:rotate-180 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </a>

                  {/* Phone Hotline */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">خدمة العملاء الهاتفية</h4>
                      <p className="text-[11px] text-on-surface-variant font-mono">{currentMerchant.whatsapp} (يومياً 10ص - 10م)</p>
                    </div>
                  </div>

                  {/* Showroom Atelier Address */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-highest text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">storefront</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">مشغل ومقر عرض تاليسكا ستوديو</h4>
                      <p className="text-[11px] text-on-surface-variant">14 شارع دجلة، المعادي، القاهرة</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Inquiry Form */}
                <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high">
                  <h4 className="text-xs font-bold text-on-surface mb-3">أرسل استفسارك أو طلبك الخاص:</h4>

                  {contactSubmitted ? (
                    <div className="p-4 rounded-xl bg-tertiary/15 border border-tertiary/30 text-tertiary text-xs font-bold flex items-center gap-2 animate-fade-in">
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>شكراً لكِ! تم استلام رسالتك وسيتم التواصل معكِ عبر الواتساب خلال دقائق. ✨</span>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">الاسم الكامل:</label>
                        <input
                          type="text"
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="مثال: ياسمين سامي"
                          className="w-full bg-surface-container px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-on-surface-variant mb-1">رقم الهاتف / الواتساب:</label>
                          <input
                            type="tel"
                            required
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                            placeholder="010XXXXXXXX"
                            className="w-full bg-surface-container px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-on-surface-variant mb-1">موضوع الاستفسار:</label>
                          <select
                            value={contactForm.topic}
                            onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                            className="w-full bg-surface-container px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary cursor-pointer"
                          >
                            <option value="sizing">استشارة مقاس</option>
                            <option value="shipping">تتبع شحنة Bosta</option>
                            <option value="exchange">طلب استبدال</option>
                            <option value="custom">طلب تفصيل خاص</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-on-surface-variant mb-1">رسالتك أو ملاحظاتك:</label>
                        <textarea
                          rows={3}
                          required
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          placeholder="اكتبي تفاصيل استفسارك هنا..."
                          className="w-full bg-surface-container px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">send</span>
                        <span>إرسال الاستفسار</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ABOUT US PAGE / TAB (من نحن - قصة تاليسكا ستوديو)                   */}
        {/* ========================================================================= */}
        {storeView === 'about' && (
          <div className="space-y-8 animate-fade-in">
            {/* About Hero Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold">
                قصة العلامة التجارية • The Talieska Story
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-on-surface leading-tight">
                إحياء فخامة الكتان الطبيعي بأيادٍ مصرية أصيلة
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                تأسس تاليسكا ستوديو في القاهرة برؤية واضحة: تقديم أزياء معاصرة راقية تحتفي بالكتان المصري النقي والتطريز اليدوي الدقيق، لابتكار قطع تدوم لسنوات بعيداً عن الموضة السريعة.
              </p>
            </div>

            {/* Editorial Atelier Imagery & Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-surface-container-high shadow-md">
                <img 
                  src={currentMerchant.banner} 
                  alt="Talieska Atelier" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-1.5">
                  <h4 className="text-sm font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">eco</span>
                    <span>1. كتان مصري طبيعي 100%</span>
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    نعتمد حصرياً على أجود ألياف الكتان الطبيعي طويل التيلة المنسوج في قرى الدلتا التاريخية، لنوفر أقمشة ناعمة وصحية للبشرة في مناخنا الصيفي.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-1.5">
                  <h4 className="text-sm font-bold text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                    <span>2. تمكين الحرفيات المحليات</span>
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    تتم خياطة وتطريز جميع قطعنا بأيادٍ ماهرة لحرفيات مصريات في مشاغلنا بالقاهرة، مع ضمان بيئة عمل عادلة ومستدامة.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-1.5">
                  <h4 className="text-sm font-bold text-tertiary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">all_inclusive</span>
                    <span>3. فلسفة الموضة البطيئة (Slow Fashion)</span>
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    نصنع كميات محدودة ومحسوبة بعناية لتجنب الهدر، مما يجعل كل قطعة ترتدينها فريدة واستثنائية.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Shopping CTA */}
            <div className="p-6 rounded-3xl bg-surface-container-lowest border border-surface-container-high text-center space-y-3">
              <h3 className="text-base sm:text-lg font-bold font-serif text-on-surface">
                جاهزة لاكتشاف قطع كولكشن صيف 2026؟
              </h3>
              <button
                onClick={() => {
                  setStoreView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-2xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 shadow-md transition-all inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                <span>تصفح منتجات تاليسكا الآن</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* REEL PREVIEW POPUP MODAL                                                   */}
        {/* ========================================================================= */}
        {activeReel && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-surface-container-lowest border border-surface-container-high shadow-2xl">
              <div className="aspect-[9/16] w-full relative">
                <img 
                  src={activeReel.image} 
                  alt={activeReel.creator} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 flex flex-col justify-between p-4 text-white">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs bg-black/50 px-2.5 py-1 rounded-full">{activeReel.creator}</span>
                    <button 
                      onClick={() => setActiveReel(null)}
                      className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-slate-100">{activeReel.caption}</p>

                    {/* Tagged Product Bar in Reel */}
                    {activeReel.taggedProduct && (
                      <div className="p-2.5 rounded-2xl bg-surface-container-lowest/90 backdrop-blur-md border border-surface-container-high flex items-center justify-between gap-2 text-on-surface">
                        <div className="flex items-center gap-2 min-w-0">
                          <img 
                            src={activeReel.taggedProduct.image} 
                            alt={activeReel.taggedProduct.title}
                            className="w-10 h-10 rounded-lg object-cover" 
                          />
                          <div className="truncate">
                            <h5 className="text-xs font-bold truncate">{activeReel.taggedProduct.title}</h5>
                            <span className="text-xs font-bold text-primary">{activeReel.taggedProduct.price.toLocaleString()} ج.م</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            addToCart(activeReel.taggedProduct);
                            setActiveReel(null);
                            setShowStoreCheckoutNotice(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-[11px] font-bold shrink-0 hover:brightness-110"
                        >
                          شراء القطعة
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. Storefront Footer */}
        <footer className="pt-8 border-t border-surface-container-high text-xs text-on-surface-variant space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-on-surface">{currentMerchant.name}</span>
              <span>• جميع الحقوق محفوظة {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <a href="#products-section" className="hover:text-on-surface">المنتجات</a>
              <button onClick={() => setStoreView('about')} className="hover:text-on-surface">عن البراند</button>
              <a href="#contact-section" className="hover:text-on-surface">تواصل معنا</a>
              <a href="#reviews-section" className="hover:text-on-surface">آراء العملاء</a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-3 border-t border-surface-container-high text-[11px]">
            <span className="text-on-surface-variant">مستضاف ومُدار عبر:</span>
            <span className="font-mono font-bold text-on-surface flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              EG-Commerce B2B SaaS Platform
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
