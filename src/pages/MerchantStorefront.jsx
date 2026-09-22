import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ReelsService } from '../services/ReelsService';
import sharedReelsData from '../../data/shared_reels.json';

export default function MerchantStorefront() {
  const {
    merchants,
    selectedMerchantId,
    setSelectedMerchantId,
    products,
    setActiveTab,
    isSubdomainMode,
    openProductDetail,
    openQuickBuy,
    totalCartCount,
    user,
    navigateToProfile
  } = useApp();

  const canManageStore = user && (user.role === 'superadmin' || user.role === 'admin' || user.role === 'merchant');

  const currentMerchant = (merchants && merchants.length > 0)
    ? (merchants.find(m => m.id === selectedMerchantId) || merchants[0])
    : {};

  const storeReel = (sharedReelsData || []).find(r => 
    (currentMerchant.slug && r.storeSlug?.toLowerCase() === currentMerchant.slug.toLowerCase()) ||
    (currentMerchant.id && r.merchantId === currentMerchant.id) ||
    (r.creatorHandle && currentMerchant.slug && r.creatorHandle.toLowerCase().includes(currentMerchant.slug.toLowerCase()))
  ) || null;
  const merchantProducts = (products || []).filter(p => 
    (currentMerchant.id && p.merchantId === currentMerchant.id) || 
    (currentMerchant.slug && p.merchantId?.includes(currentMerchant.slug)) ||
    (currentMerchant.shortName && p.merchant?.toLowerCase().includes(currentMerchant.shortName.toLowerCase())) ||
    (currentMerchant.slug && p.merchant?.toLowerCase().includes(currentMerchant.slug)) ||
    (!p.merchantId && currentMerchant.id === '171842bd-daed-40ef-853f-917eab2ed437')
  );
  
  // Extract dynamic theme and layout configurations with sensible fallbacks
  const themeConfig = currentMerchant.themeConfig || {};
  const layoutConfig = currentMerchant.layoutConfig || {};

  const themeMode = themeConfig.themeMode || 'dark'; // 'dark' | 'light' | 'midnight'
  const accentColor = currentMerchant.themeColor || themeConfig.accentColor || '#d00000';
  const fontFamily = themeConfig.fontFamily || 'sans'; // 'cairo' | 'serif' | 'sans'
  const borderRadius = themeConfig.borderRadius || 'rounded-2xl'; // 'rounded-none' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl'
  const heroStyle = themeConfig.heroStyle || 'wide_cinema'; // 'wide_cinema' | 'split_editorial' | 'minimal_card'
  const heroHeadline = themeConfig.heroHeadline || 'أزياء الكتان المصري الفاخر • Authentic Heritage';
  const heroSubheadline = themeConfig.heroSubheadline || `${currentMerchant.bio} قطع انسيابية مستوحاة من هدوء الطبيعة صممت لتمنحك إطلالة راقية في الصيف والمساء.`;
  const heroCtaText = themeConfig.heroCtaText || 'تسوق الكولكشن الآن';
  const productsGridCols = Number(themeConfig.productsGridCols) || 4;
  const showRatings = themeConfig.showRatings !== false;
  const showStockBadges = (themeConfig.showStockBadges !== false && themeConfig.showStockBadge !== false);

  // Layout section visibility toggles
  const showAnnouncementBar = layoutConfig.showAnnouncementBar !== false;
  const showHeroBanner = layoutConfig.showHeroBanner !== false;
  const showTrustBadges = layoutConfig.showTrustBadges !== false;
  const showProductsCatalog = layoutConfig.showProductsCatalog !== false;
  const showReels = (layoutConfig.showCommunityReels !== false && layoutConfig.showReels !== false);
  const showSocialFeed = (layoutConfig.showSocialMediaFeed !== false && layoutConfig.showSocialFeed !== false);
  const showTestimonials = layoutConfig.showTestimonials !== false;
  const showContactSection = layoutConfig.showContactSection !== false;
  const showWhatsAppFloat = (layoutConfig.showWhatsAppFloat !== false && layoutConfig.showFloatingWhatsapp !== false);
  const showAboutUsTab = (layoutConfig.showAboutUsTab !== false && layoutConfig.showAboutTab !== false);

  // Dynamic trust badges list
  const trustBadgesList = (layoutConfig.trustBadges && layoutConfig.trustBadges.length > 0)
    ? layoutConfig.trustBadges
    : [
        { id: 'b1', icon: 'dry_cleaning', title: 'أقمشة طبيعية 100%', desc: 'كتان مصري طبيعي خالص مغزول يدوياً، يسمح بالتنفس ومقاوم للانكماش بدون أي ألياف صناعية.' },
        { id: 'b2', icon: 'local_shipping', title: 'شحن سريع 48 ساعة', desc: 'توصيل آمن لجميع محافظات مصر بالتعاون مع بوسطة Bosta Express مع تتبع لحظي للشحنة.' },
        { id: 'b3', icon: 'payments', title: 'دفع فوري ومرن', desc: 'ادفع فوراً عبر InstaPay أو البطاقات البنكية، أو ادفع نقداً للمندوب عند الاستلام (COD).' },
        { id: 'b4', icon: 'published_with_changes', title: 'معاينة واستبدال 14 يوم', desc: 'حق فتح الشحنة وقياس القطعة بحضور المندوب، مع استبدال مجاني فوري في حالة عدم تناسب المقاس.' },
      ];

  // Theme styling helpers
  const themeRootClass = themeMode === 'light'
    ? 'bg-[#faf8f5] text-[#1c1917]'
    : themeMode === 'midnight'
    ? 'bg-[#060913] text-[#e2e8f0]'
    : 'bg-surface text-on-surface';

  const cardBgClass = themeMode === 'light'
    ? 'bg-white border-[#e7e2d9] text-[#1c1917] shadow-xs'
    : themeMode === 'midnight'
    ? 'bg-[#0d1424] border-[#1e293b] text-[#f8fafc] shadow-md'
    : 'bg-surface-container-lowest border-surface-container-high text-on-surface shadow-xs';

  const subCardBgClass = themeMode === 'light'
    ? 'bg-[#f4f0e6] border-[#e7e2d9]'
    : themeMode === 'midnight'
    ? 'bg-[#131b2e] border-[#1e293b]'
    : 'bg-surface-container-low border-surface-container-high';

  const textMutedClass = themeMode === 'light'
    ? 'text-[#78716c]'
    : themeMode === 'midnight'
    ? 'text-[#94a3b8]'
    : 'text-on-surface-variant';

  const fontClass = fontFamily === 'serif' ? 'font-serif' : 'font-sans';

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

  // Community Reels Data - Dynamic per Merchant with Real Backend Persistence
  const [dynamicStoreReels, setDynamicStoreReels] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchStoreReels = async () => {
      try {
        const fetched = await ReelsService.getMerchantReels(currentMerchant.id, currentMerchant.slug);
        if (isMounted) {
          if (fetched && fetched.length > 0) {
            const mapped = fetched.map(r => ({
              id: r.id,
              creator: r.creatorHandle || `@${currentMerchant.slug || 'store'}`,
              creatorName: r.creatorName || currentMerchant.name || currentMerchant.shortName,
              caption: r.caption || r.title || 'إطلالة حصرية من متجرنا ✨',
              views: typeof r.views === 'number' ? (r.views >= 1000 ? `${(r.views/1000).toFixed(1)}K` : r.views.toString()) : (r.views || '1.2K'),
              likes: typeof r.likes === 'number' ? (r.likes >= 1000 ? `${(r.likes/1000).toFixed(1)}K` : r.likes.toString()) : (r.likes || '320'),
              image: r.avatar || r.thumbnail || (r.products?.[0]?.image) || currentMerchant.logo || '/images/products/the_sharp_v_yellow_1.webp',
              video: r.videoBg || r.videoUrl || '/images/reels/the_sharp_v_yellow_reel.mp4',
              taggedProduct: r.products?.[0] || r.product || merchantProducts[0]
            }));
            setDynamicStoreReels(mapped);
          } else {
            setDynamicStoreReels([]);
          }
        }
      } catch (e) {
        if (isMounted) setDynamicStoreReels([]);
      }
    };
    fetchStoreReels();
    const handleReelsUpdated = () => fetchStoreReels();
    window.addEventListener('eg_reels_updated', handleReelsUpdated);
    return () => { 
      isMounted = false; 
      window.removeEventListener('eg_reels_updated', handleReelsUpdated);
    };
  }, [currentMerchant.id, currentMerchant.slug]);

  const communityReels = dynamicStoreReels;

  // Dynamic grid classes based on merchant's productsGridCols choice
  const gridColsClass = productsGridCols === 2
    ? 'grid-cols-1 sm:grid-cols-2 gap-4'
    : productsGridCols === 3
    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'
    : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4';

  return (
    <div className={`w-full min-h-screen flex flex-col selection:bg-primary/20 pb-24 ${themeRootClass} ${fontClass}`}>
      {/* 1. Top B2B SaaS Subdomain & Platform Bridge Bar (Only displayed for authorized store managers/admins in platform preview mode) */}
      {!isSubdomainMode && canManageStore && (
        <div className={`w-full py-2 px-3 md:px-6 border-b ${subCardBgClass}`}>
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Subdomain & Verification Badge */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {currentMerchant.subdomain}
              </span>
              {currentMerchant.customDomain && (
                <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] ${textMutedClass}`}>
                  <span className="material-symbols-outlined text-[13px] text-emerald-500">lock</span>
                  {currentMerchant.customDomain}
                </span>
              )}
              <span className={`hidden md:inline text-[10px] px-2 py-0.5 rounded ${subCardBgClass} ${textMutedClass}`}>
                النمط: {themeMode === 'light' ? 'نهاري راقي' : themeMode === 'midnight' ? 'ميدنايت مخملي' : 'فخامة داكنة'}
              </span>
            </div>

            {/* Admin Controls & Actions */}
            <div className="flex items-center gap-2">
              {user && (user.role === 'admin' || user.role === 'superadmin') && (
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] hidden md:inline ${textMutedClass}`}>معاينة متجر آخر:</span>
                  <select
                    value={currentMerchant.id}
                    onChange={(e) => setSelectedMerchantId(e.target.value)}
                    className={`px-2 py-0.5 rounded text-[11px] border focus:outline-none cursor-pointer ${subCardBgClass}`}
                  >
                    {merchants.map(m => (
                      <option key={m.id} value={m.id} className="bg-surface text-on-surface">
                        🏬 {m.shortName} ({m.slug})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => navigateToProfile(currentMerchant.slug || 'drip-fit')}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold text-[11px] transition-all bg-gradient-to-r from-rose-500/20 to-amber-500/20 text-rose-300 border border-rose-500/30 hover:opacity-90 shadow-xs"
                title="زيارة الملف الاجتماعي للبراند (Social Profile)"
              >
                <span className="material-symbols-outlined text-[13px]">person</span>
                <span>الملف الاجتماعي ({currentMerchant.slug})</span>
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold text-[11px] transition-all text-white shadow-xs"
                style={{ backgroundColor: accentColor }}
              >
                <span className="material-symbols-outlined text-[13px]">palette</span>
                <span>تخصيص المظهر (SaaS)</span>
              </button>

              <button
                onClick={() => setActiveTab('reels')}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] transition-all border ${subCardBgClass} hover:opacity-80`}
                title="العودة إلى تطبيق EG-Commerce وسوق الموضة العام"
              >
                <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                <span>سوق EG الموحد</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Merchant Announcement Bar (Dynamic Visibility & Color) */}
      {showAnnouncementBar && (
        <div 
          className="w-full py-2 px-3 text-center text-xs font-bold text-white shadow-xs transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          <p className="max-w-4xl mx-auto truncate flex items-center justify-center gap-2">
            <span>✨</span>
            <span>{currentMerchant.announcement}</span>
            <span className="hidden sm:inline bg-black/25 px-2 py-0.5 rounded text-[10px] font-mono">
              كود: {currentMerchant.promoCode} ({currentMerchant.discountPct || 15}% خصم)
            </span>
          </p>
        </div>
      )}

      {/* 3. Merchant Branded Header with Storefront Sub-Navigation */}
      <div className={`w-full sticky top-0 z-30 border-b backdrop-blur-md px-4 md:px-6 py-3 transition-colors ${
        themeMode === 'light' 
          ? 'bg-white/90 border-[#e7e2d9]' 
          : themeMode === 'midnight' 
          ? 'bg-[#060913]/90 border-[#1e293b]' 
          : 'bg-surface-container-lowest/90 border-surface-container-high'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Store Title */}
          <div 
            onClick={() => setStoreView('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img 
              src={currentMerchant.logo} 
              alt={currentMerchant.name}
              className={`w-10 h-10 md:w-12 md:h-12 ${borderRadius} object-cover border-2 transition-all group-hover:scale-105`} 
              style={{ borderColor: accentColor }}
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base md:text-lg font-bold font-serif leading-tight">
                  {currentMerchant.name}
                </h1>
                <span className="material-symbols-outlined text-[17px] text-emerald-500" title="علامة تجارية موثقة">check_circle</span>
              </div>
              <p className={`text-[11px] ${textMutedClass}`}>
                {currentMerchant.categoryAr} • القاهرة
              </p>
            </div>
          </div>

          {/* Storefront Internal Navigation (Filtered by layout toggles) */}
          <nav className={`hidden md:flex items-center gap-1 px-3 py-1 rounded-full border text-xs ${subCardBgClass}`}>
            <button
              onClick={() => {
                setStoreView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                storeView === 'home'
                  ? 'text-white shadow-xs'
                  : `${textMutedClass} hover:opacity-100`
              }`}
              style={storeView === 'home' ? { backgroundColor: accentColor } : {}}
            >
              الرئيسية
            </button>

            {showProductsCatalog && (
              <a
                href="#products-section"
                onClick={() => setStoreView('home')}
                className={`px-3 py-1 ${textMutedClass} hover:opacity-100 font-medium transition-colors`}
              >
                المنتجات
              </a>
            )}

            {showTestimonials && (
              <a
                href="#reviews-section"
                onClick={() => setStoreView('home')}
                className={`px-3 py-1 ${textMutedClass} hover:opacity-100 font-medium transition-colors`}
              >
                آراء العملاء
              </a>
            )}

            {showReels && (
              <a
                href="#reels-section"
                onClick={() => setStoreView('home')}
                className={`px-3 py-1 ${textMutedClass} hover:opacity-100 font-medium transition-colors`}
              >
                الريلز
              </a>
            )}

            {showAboutUsTab && (
              <button
                onClick={() => {
                  setStoreView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  storeView === 'about'
                    ? 'text-white shadow-xs'
                    : `${textMutedClass} hover:opacity-100`
                }`}
                style={storeView === 'about' ? { backgroundColor: accentColor } : {}}
              >
                عن {currentMerchant.shortName}
              </button>
            )}

            {showContactSection && (
              <a
                href="#contact-section"
                className={`px-3 py-1 ${textMutedClass} hover:opacity-100 font-medium transition-colors`}
              >
                تواصل معنا
              </a>
            )}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateToProfile(currentMerchant.slug || 'drip-fit')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-[#d00000] border border-red-500/30 text-xs font-bold transition-all shadow-xs"
              title="زيارة الملف الاجتماعي للبراند (Social Profile)"
            >
              <span className="material-symbols-outlined text-[15px]">person</span>
              <span className="hidden sm:inline">الملف الاجتماعي</span>
              <span className="font-mono text-[11px]">{currentMerchant.instagram || `@${currentMerchant.slug}`}</span>
            </button>

            <a
              href={`https://wa.me/${currentMerchant.whatsapp.replace(/[^0-9]/g, '')}?text=مرحبا، أود الاستفسار عن كولكشن ${encodeURIComponent(currentMerchant.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>محادثة واتساب</span>
            </a>

            <button 
              onClick={() => setActiveTab('cart')}
              className={`relative p-2 rounded-full border transition-all ${subCardBgClass} hover:opacity-80`}
              title="سلة المتجر"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {totalCartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: accentColor }}
                >
                  {totalCartCount}
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
          <div className={`p-4 ${borderRadius} border shadow-lg flex items-center justify-between gap-4 animate-fade-in ${cardBgClass}`}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[24px]" style={{ color: accentColor }}>local_mall</span>
              <div>
                <h4 className="text-xs font-bold">إتمام الشراء المباشر من متجر {currentMerchant.shortName}</h4>
                <p className={`text-[11px] ${textMutedClass}`}>
                  يمكنك الدفع المباشر للتاجر عبر InstaPay أو نقداً عند الاستلام COD، أو دمج طلبك في سلة EG-Commerce الموحدة!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('checkout')}
                className={`px-3 py-1.5 ${borderRadius} text-white text-xs font-bold hover:brightness-110 shadow-xs`}
                style={{ backgroundColor: accentColor }}
              >
                الدفع المباشر
              </button>
              <button
                onClick={() => setShowStoreCheckoutNotice(false)}
                className={`p-1.5 ${textMutedClass} hover:opacity-100`}
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
            {/* SECTION 1: HERO SECTION (Supports 3 distinct styles: wide_cinema, split_editorial, minimal_card) */}
            {showHeroBanner && (
              <>
                {heroStyle === 'wide_cinema' && (
                  <section className={`relative ${borderRadius} overflow-hidden border ${cardBgClass}`}>
                    <div className="h-72 sm:h-96 md:h-[460px] w-full relative">
                      <img 
                        src={currentMerchant.banner} 
                        alt={currentMerchant.name}
                        className="w-full h-full object-cover brightness-[0.65] contrast-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      {/* Hero Overlay Details */}
                      <div className="absolute bottom-6 inset-x-6 sm:bottom-10 sm:inset-x-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-xl space-y-2.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span 
                              className="px-3 py-1 rounded-full text-white text-[11px] font-bold backdrop-blur-sm"
                              style={{ backgroundColor: `${accentColor}cc` }}
                            >
                              كولكشن صيف 2026 • Summer Pure Linen
                            </span>
                            <span className="px-3 py-1 rounded-full bg-black/40 text-white text-[11px] font-medium backdrop-blur-sm border border-white/20">
                              صناعة يدوية بالقاهرة 🪡
                            </span>
                          </div>

                          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white tracking-tight leading-tight">
                            {heroHeadline}
                          </h2>

                          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 sm:line-clamp-3">
                            {heroSubheadline}
                          </p>

                          {/* Dual CTAs */}
                          <div className="flex flex-wrap items-center gap-3 pt-2">
                            <a
                              href="#products-section"
                              className={`px-5 py-2.5 ${borderRadius} text-white text-xs sm:text-sm font-bold hover:brightness-110 shadow-md transition-all flex items-center gap-1.5`}
                              style={{ backgroundColor: accentColor }}
                            >
                              <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
                              <span>{heroCtaText}</span>
                            </a>
                            {showReels && (
                              <a
                                href="#reels-section"
                                className={`px-4 py-2.5 ${borderRadius} bg-black/50 hover:bg-black/70 text-white text-xs sm:text-sm font-bold border border-white/20 backdrop-blur-md transition-all flex items-center gap-1.5`}
                              >
                                <span className="material-symbols-outlined text-[17px]" style={{ color: accentColor }}>play_circle</span>
                                <span>مشاهدة إطلالات الريلز</span>
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Promo Card Pill */}
                        <div className={`p-4 ${borderRadius} border flex flex-col gap-2 self-start md:self-auto shadow-md backdrop-blur-md bg-black/60 border-white/20 text-white`}>
                          <span className="text-[10px] text-slate-300 font-medium">خصم فوري {currentMerchant.discountPct || 15}% على طلبك الأول:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-mono font-bold px-3 py-1 rounded-xl bg-white/10 border border-white/20 text-amber-300">
                              {currentMerchant.promoCode}
                            </span>
                            <button
                              onClick={copyPromoCode}
                              className={`px-3 py-1.5 ${borderRadius} text-white text-xs font-bold transition-all flex items-center gap-1 shadow-xs hover:brightness-110`}
                              style={{ backgroundColor: accentColor }}
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
                )}

                {heroStyle === 'split_editorial' && (
                  <section className={`grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${borderRadius} border ${cardBgClass}`}>
                    <div className="flex flex-col justify-center space-y-4">
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-3 py-1 rounded-full text-white text-[11px] font-bold"
                          style={{ backgroundColor: accentColor }}
                        >
                          افتتاح رسمي • Editorial Luxe
                        </span>
                        <span className={`text-xs ${textMutedClass}`}>صنع في مصر بأيدي مصممين محترفين</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif leading-tight">
                        {heroHeadline}
                      </h2>

                      <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>
                        {heroSubheadline}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <a
                          href="#products-section"
                          className={`px-6 py-3 ${borderRadius} text-white text-xs sm:text-sm font-bold hover:brightness-110 shadow-md transition-all flex items-center gap-2`}
                          style={{ backgroundColor: accentColor }}
                        >
                          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                          <span>{heroCtaText}</span>
                        </a>

                        <div className={`p-2.5 px-3.5 ${borderRadius} border flex items-center gap-2 ${subCardBgClass}`}>
                          <span className={`text-[11px] ${textMutedClass}`}>كود الخصم:</span>
                          <span className="font-mono font-bold text-xs" style={{ color: accentColor }}>{currentMerchant.promoCode}</span>
                          <button onClick={copyPromoCode} className="text-[11px] hover:underline font-bold">
                            {copiedCode ? 'تم ✓' : 'نسخ'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={`aspect-[4/3] w-full ${borderRadius} overflow-hidden relative border ${subCardBgClass}`}>
                      <img 
                        src={currentMerchant.banner} 
                        alt={currentMerchant.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                        <span className="material-symbols-outlined text-[15px] text-emerald-400">verified</span>
                        <span>{currentMerchant.name} Studio</span>
                      </div>
                    </div>
                  </section>
                )}

                {heroStyle === 'minimal_card' && (
                  <section className={`p-6 sm:p-10 ${borderRadius} border text-center space-y-4 ${cardBgClass}`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold" style={{ borderColor: accentColor, color: accentColor }}>
                      <span className="material-symbols-outlined text-[15px]">sparkles</span>
                      <span>كولكشن حصري ومحدود</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif max-w-3xl mx-auto leading-tight">
                      {heroHeadline}
                    </h2>

                    <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${textMutedClass}`}>
                      {heroSubheadline}
                    </p>

                    <div className="flex items-center justify-center gap-3 pt-2">
                      <a
                        href="#products-section"
                        className={`px-6 py-3 ${borderRadius} text-white text-xs sm:text-sm font-bold hover:brightness-110 shadow-md transition-all`}
                        style={{ backgroundColor: accentColor }}
                      >
                        {heroCtaText}
                      </a>
                      <button
                        onClick={copyPromoCode}
                        className={`px-4 py-3 ${borderRadius} border font-mono text-xs font-bold ${subCardBgClass}`}
                      >
                        كود: {currentMerchant.promoCode} ({copiedCode ? 'تم النسخ!' : 'نسخ'})
                      </button>
                    </div>

                    <div className={`h-48 sm:h-64 w-full ${borderRadius} overflow-hidden border mt-4 ${subCardBgClass}`}>
                      <img src={currentMerchant.banner} alt={currentMerchant.name} className="w-full h-full object-cover" />
                    </div>
                  </section>
                )}
              </>
            )}

            {/* SECTION 2: ICON BOXES / TRUST BADGES (Dynamic Items & Editable Text) */}
            {showTrustBadges && (
              <section className="space-y-3">
                <div className="text-center max-w-lg mx-auto">
                  <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: accentColor }}>
                    لماذا تتسوق من متجر {currentMerchant.shortName}؟
                  </span>
                  <h3 className="text-lg md:text-xl font-bold font-serif mt-0.5">
                    معايير الجودة والراحة المصرية
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  {trustBadgesList.map((badge, idx) => (
                    <div 
                      key={badge.id || idx} 
                      className={`p-4 ${borderRadius} border hover:border-primary/40 transition-all duration-300 space-y-2.5 group ${cardBgClass}`}
                    >
                      <div 
                        className={`w-10 h-10 ${borderRadius} flex items-center justify-center group-hover:scale-110 transition-transform`}
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                      >
                        <span className="material-symbols-outlined text-[22px]">{badge.icon || 'verified'}</span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold">{badge.title}</h4>
                        <p className={`text-[11px] mt-1 leading-relaxed ${textMutedClass}`}>
                          {badge.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: PRODUCTS GRID & CATALOG (Dynamic Columns, Ratings & Stock urgency) */}
            {showProductsCatalog && (
              <section id="products-section" className="space-y-5 pt-4">
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 ${subCardBgClass}`}>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold font-serif">
                      تشكيلة منتجات متجر {currentMerchant.shortName}
                    </h3>
                    <p className={`text-xs ${textMutedClass}`}>
                      تصفح أحدث القطع المتاحة من الكتان والتطريز مع خيارات المقاسات والألوان ({displayedProducts.length} منتج)
                    </p>
                  </div>

                  {/* Filters & Sorting Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Category Filter Pills */}
                    <div className={`flex items-center gap-1 p-1 rounded-full border overflow-x-auto scrollbar-none ${subCardBgClass}`}>
                      {['all', 'كتان', 'عبايات', 'قمصان'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                            selectedCategory === cat
                              ? 'text-white shadow-xs'
                              : `${textMutedClass} hover:opacity-100`
                          }`}
                          style={selectedCategory === cat ? { backgroundColor: accentColor } : {}}
                        >
                          {cat === 'all' ? 'جميع القطع' : cat}
                        </button>
                      ))}
                    </div>

                    {/* Sort Dropdown */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`text-xs font-medium px-2.5 py-1.5 ${borderRadius} border focus:outline-none cursor-pointer ${subCardBgClass}`}
                    >
                      <option value="popular">⭐ الأكثر طلباً</option>
                      <option value="rating">🌟 الأعلى تقييماً</option>
                      <option value="price_low">💰 السعر: الأقل أولاً</option>
                    </select>
                  </div>
                </div>

                {/* Products Cards Grid with Configured Columns */}
                <div className={`grid ${gridColsClass}`}>
                  {displayedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className={`group ${borderRadius} border overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col justify-between ${cardBgClass}`}
                    >
                      {/* Media Container */}
                      <div 
                        onClick={() => openProductDetail(prod)}
                        className={`aspect-[3/4] w-full relative overflow-hidden cursor-pointer ${subCardBgClass}`}
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        
                        {/* Category Tag */}
                        <div className="absolute top-2 right-2 flex flex-col gap-1">
                          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-bold border border-white/20">
                            {prod.category.split(' ')[0]}
                          </span>
                        </div>

                        {/* Sale Discount Tag */}
                        {prod.originalPrice > prod.price && (
                          <div className="absolute top-2 left-2">
                            <span 
                              className="px-2 py-0.5 rounded-md text-white text-[10px] font-bold shadow-xs"
                              style={{ backgroundColor: accentColor }}
                            >
                              وفر {prod.originalPrice - prod.price} ج.م
                            </span>
                          </div>
                        )}

                        {/* Stock Urgency Tag (Conditional via merchant theme settings) */}
                        {showStockBadges && (
                          <div className="absolute bottom-11 right-2">
                            <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-medium text-amber-300 border border-amber-300/30">
                              متبقي 4 قطع فقط
                            </span>
                          </div>
                        )}

                        {/* Quick Buy Hover Action */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openQuickBuy(prod);
                          }}
                          className={`absolute bottom-2 inset-x-2 py-1.5 ${borderRadius} text-white text-xs font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:brightness-110`}
                          style={{ backgroundColor: accentColor }}
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
                            className="text-xs md:text-sm font-semibold line-clamp-2 cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            {prod.title}
                          </h4>

                          {/* Ratings & Reviews (Conditional via merchant theme settings) */}
                          {showRatings && (
                            <div className="flex items-center gap-1 text-xs mt-1 text-amber-400">
                              <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                              <span className="font-bold">{prod.rating}</span>
                              <span className={`text-[10px] ${textMutedClass}`}>({prod.reviewsCount} تقييم)</span>
                            </div>
                          )}

                          {/* Color Swatches Mockup */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#c07a5d] border border-white/20" title="تيراكوتا" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#d8cca3] border border-white/20" title="بيج رملي" />
                            <span className="w-2.5 h-2.5 rounded-full bg-[#1e232a] border border-white/20" title="أسود ملكي" />
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className={`pt-2 border-t flex items-center justify-between gap-1 ${subCardBgClass}`}>
                          <div>
                            <div className="text-xs md:text-sm font-bold">
                              {prod.price.toLocaleString()} <span className={`text-[10px] font-normal ${textMutedClass}`}>ج.م</span>
                            </div>
                            {prod.originalPrice > prod.price && (
                              <span className={`text-[10px] line-through ${textMutedClass}`}>
                                {prod.originalPrice.toLocaleString()} ج.م
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              addToCart(prod);
                              setStoreCartCount(prev => prev + 1);
                            }}
                            className={`p-2 ${borderRadius} border transition-all hover:text-white`}
                            style={{ 
                              backgroundColor: `${accentColor}15`, 
                              color: accentColor, 
                              borderColor: `${accentColor}30` 
                            }}
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
            )}

            {/* SECTION 4: TESTIMONIALS (Conditional via layoutConfig) */}
            {showTestimonials && (
              <section id="reviews-section" className="space-y-4 pt-4">
                <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b pb-3 ${subCardBgClass}`}>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                      تجارب حقيقية
                    </span>
                    <h3 className="text-lg md:text-xl font-bold font-serif">
                      ماذا يقول عملاء متجر {currentMerchant.shortName}؟
                    </h3>
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${textMutedClass}`}>
                    <span className="font-bold flex items-center gap-1 text-amber-400">
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
                      className={`p-4 ${borderRadius} border shadow-xs flex flex-col justify-between space-y-3 ${cardBgClass}`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(t.rating)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-[14px]">star</span>
                            ))}
                          </div>
                          <span className={`text-[10px] ${textMutedClass}`}>{t.date}</span>
                        </div>
                        <p className="text-xs leading-relaxed">
                          "{t.review}"
                        </p>
                      </div>

                      <div className={`pt-2 border-t flex items-center justify-between text-[11px] ${subCardBgClass}`}>
                        <div>
                          <span className="font-bold block">{t.name}</span>
                          <span className={`text-[10px] ${textMutedClass}`}>{t.location}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                          مشتري موثق ✓
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 5: REELS SHOWCASE (Conditional via layoutConfig & real reels) */}
            {showReels && communityReels.length > 0 && (
              <section id="reels-section" className={`p-5 ${borderRadius} border space-y-4 ${cardBgClass}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                      إطلالات حية بالصوت والصورة
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-serif">
                      شاهدي ريلز وتنسيقات مجتمع {currentMerchant.shortName} • Community Looks
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('reels')}
                    className="text-xs font-bold hover:underline flex items-center gap-1"
                    style={{ color: accentColor }}
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
                      className={`aspect-[9/16] ${borderRadius} overflow-hidden relative group cursor-pointer border hover:border-primary/50 transition-all duration-300 ${subCardBgClass}`}
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
                          <span className="material-symbols-outlined text-[13px] text-red-400">favorite</span>
                          <span>{reel.likes}</span>
                        </div>
                        <span className="text-[11px] font-bold text-amber-300 truncate">{reel.creator}</span>
                        <p className="text-[10px] text-slate-200 line-clamp-1">{reel.caption}</p>
                      </div>

                      {/* Tagged Product Pin on Reel */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-bold text-white flex items-center gap-1">
                        <span className="material-symbols-outlined text-[11px]" style={{ color: accentColor }}>local_mall</span>
                        <span>معاينة القطعة</span>
                      </div>

                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {showReels && communityReels.length === 0 && canManageStore && (
              <section id="reels-section" className={`p-6 ${borderRadius} border text-center space-y-3 ${cardBgClass}`}>
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[24px]">video_call</span>
                </div>
                <h4 className="text-sm font-bold">لم تقم بنشر أي ريلز لمتجرك بعد</h4>
                <p className={`text-xs ${textMutedClass} max-w-md mx-auto`}>
                  الفيديوهات القصيرة تزيد مبيعات متجرك بنسبة تتجاوز 50%. انشر ريل لمنتجاتك وستظهر فوراً في ملفك ومتجرك!
                </p>
                <button
                  onClick={() => setActiveTab('add-product')}
                  className="px-4 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>إضافة منتج وريلز جديد</span>
                </button>
              </section>
            )}

            {/* SECTION 6: SOCIAL MEDIA & COMMUNITY (Conditional via layoutConfig) */}
            {showSocialFeed && (
              <section className={`p-5 ${borderRadius} border space-y-4 ${cardBgClass}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                      ريلز وفيديوهات المتجر
                    </span>
                    <h3 className="text-base sm:text-lg font-bold font-serif">
                      كولكشن {currentMerchant.name} بالفيديو الحي
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateToProfile(currentMerchant.slug || 'drip-fit')}
                      className={`px-3.5 py-1.5 ${borderRadius} border text-xs font-bold transition-all flex items-center gap-1.5 ${subCardBgClass} hover:opacity-80`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-rose-500">account_circle</span>
                      <span>الملف الاجتماعي ({currentMerchant.instagram || `@${currentMerchant.slug}`})</span>
                    </button>
                  </div>
                </div>

                {/* Main Store Reel & Media Showcase */}
                {storeReel ? (
                  <div className={`p-4 sm:p-6 ${borderRadius} border ${cardBgClass} grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xs`}>
                    {/* Vertical 9:16 Video Player */}
                    <div className="md:col-span-4 flex justify-center">
                      <div className="w-full max-w-[260px] aspect-[9/16] rounded-2xl overflow-hidden shadow-xl relative border-2 border-white/10 bg-black">
                        <video
                          src={storeReel.videoBg || storeReel.video_url}
                          poster={storeReel.thumbnail || storeReel.avatar}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Reel Information & Tagged Product Quick Buy */}
                    <div className="md:col-span-8 space-y-4 text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span>فيديو الكولكشن الرسمي الحصري</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold leading-relaxed">
                        {storeReel.caption}
                      </h4>

                      <div className={`p-3.5 ${borderRadius} border ${subCardBgClass} flex items-center justify-between gap-4 flex-wrap`}>
                        <div className="flex items-center gap-3">
                          <img
                            src={storeReel.products?.[0]?.image || storeReel.thumbnail}
                            alt={storeReel.products?.[0]?.title || 'Product'}
                            className={`w-12 h-12 ${borderRadius} object-cover border border-white/10 shrink-0`}
                          />
                          <div>
                            <span className="text-[10px] opacity-70 block font-bold">المنتج المعروض في الفيديو:</span>
                            <span className="text-xs sm:text-sm font-bold block">{storeReel.products?.[0]?.title || currentMerchant.name}</span>
                            <span className="text-xs font-black" style={{ color: accentColor }}>
                              {storeReel.products?.[0]?.price ? `${storeReel.products[0].price} ج.م` : ''}
                            </span>
                          </div>
                        </div>

                        {storeReel.products?.[0] && (
                          <button
                            onClick={() => openQuickBuy ? openQuickBuy(storeReel.products[0]) : openProductDetail(storeReel.products[0])}
                            className={`px-4 py-2 ${borderRadius} text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1`}
                            style={{ backgroundColor: accentColor }}
                          >
                            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                            <span>طلب فوري من الريلز</span>
                          </button>
                        )}
                      </div>

                      {/* Store Media Images Gallery */}
                      <div className="pt-2">
                        <span className="text-[11px] font-bold block mb-2 opacity-80">معرض صور وتفاصيل القطع:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {displayedProducts.slice(0, 4).map((prod) => (
                            <div
                              key={prod.id}
                              onClick={() => openProductDetail(prod)}
                              className={`group aspect-square ${borderRadius} overflow-hidden relative border cursor-pointer ${subCardBgClass}`}
                              title={prod.title || prod.name}
                            >
                              <img
                                src={prod.image || prod.img}
                                alt={prod.title || prod.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1 text-center">
                                <span className="text-[10px] font-bold text-white leading-tight">{prod.title || prod.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {displayedProducts.slice(0, 4).map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => openProductDetail(prod)}
                        className={`group aspect-square ${borderRadius} overflow-hidden relative border cursor-pointer ${subCardBgClass}`}
                      >
                        <img
                          src={prod.image || prod.img}
                          alt={prod.title || prod.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                          <span className="text-[11px] font-bold text-white">{prod.title || prod.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* SECTION 7: CONTACT US SECTION (Conditional via layoutConfig) */}
            {showContactSection && (
              <section id="contact-section" className={`p-6 ${borderRadius} border space-y-6 ${cardBgClass}`}>
                <div className="text-center max-w-lg mx-auto">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
                    خدمة العملاء والاستشارات
                  </span>
                  <h3 className="text-lg md:text-xl font-bold font-serif mt-0.5">
                    تواصل مباشرة مع فريق {currentMerchant.shortName}
                  </h3>
                  <p className={`text-xs mt-1 ${textMutedClass}`}>
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
                      className={`p-4 ${borderRadius} bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/15 transition-all flex items-center justify-between group`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${borderRadius} bg-emerald-500/20 text-emerald-500 flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-[22px]">chat</span>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold">محادثة واتساب فورية (WhatsApp)</h4>
                          <p className={`text-[11px] ${textMutedClass}`}>الرد خلال دقائق مع منسقة المقاسات</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-emerald-500 rtl:rotate-180 group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </a>

                    {/* Phone Hotline */}
                    <div className={`p-4 ${borderRadius} border flex items-center gap-3 ${subCardBgClass}`}>
                      <div className={`w-10 h-10 ${borderRadius} flex items-center justify-center`} style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                        <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">خدمة العملاء الهاتفية</h4>
                        <p className={`text-[11px] font-mono ${textMutedClass}`}>{currentMerchant.whatsapp} (يومياً 10ص - 10م)</p>
                      </div>
                    </div>

                    {/* Showroom Atelier Address */}
                    <div className={`p-4 ${borderRadius} border flex items-center gap-3 ${subCardBgClass}`}>
                      <div className={`w-10 h-10 ${borderRadius} flex items-center justify-center`} style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                        <span className="material-symbols-outlined text-[22px]">storefront</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">مشغل ومقر عرض {currentMerchant.shortName}</h4>
                        <p className={`text-[11px] ${textMutedClass}`}>14 شارع دجلة، المعادي، القاهرة</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Inquiry Form */}
                  <div className={`p-4 ${borderRadius} border ${subCardBgClass}`}>
                    <h4 className="text-xs font-bold mb-3">أرسل استفسارك أو طلبك الخاص:</h4>

                    {contactSubmitted ? (
                      <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center gap-2 animate-fade-in">
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>شكراً لك! تم استلام رسالتك وسيتم التواصل معك عبر الواتساب خلال دقائق. ✨</span>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-3">
                        <div>
                          <label className={`block text-[11px] mb-1 ${textMutedClass}`}>الاسم الكامل:</label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="مثال: ياسمين سامي"
                            className={`w-full px-3 py-2 ${borderRadius} text-xs border focus:outline-none ${cardBgClass}`}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className={`block text-[11px] mb-1 ${textMutedClass}`}>رقم الهاتف / الواتساب:</label>
                            <input
                              type="tel"
                              required
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                              placeholder="010XXXXXXXX"
                              className={`w-full px-3 py-2 ${borderRadius} text-xs border focus:outline-none font-mono ${cardBgClass}`}
                            />
                          </div>
                          <div>
                            <label className={`block text-[11px] mb-1 ${textMutedClass}`}>موضوع الاستفسار:</label>
                            <select
                              value={contactForm.topic}
                              onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                              className={`w-full px-3 py-2 ${borderRadius} text-xs border focus:outline-none cursor-pointer ${cardBgClass}`}
                            >
                              <option value="sizing">استشارة مقاس</option>
                              <option value="shipping">تتبع شحنة Bosta</option>
                              <option value="exchange">طلب استبدال</option>
                              <option value="custom">طلب تفصيل خاص</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className={`block text-[11px] mb-1 ${textMutedClass}`}>رسالتك أو ملاحظاتك:</label>
                          <textarea
                            rows={3}
                            required
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            placeholder="اكتبي تفاصيل استفسارك هنا..."
                            className={`w-full px-3 py-2 ${borderRadius} text-xs border focus:outline-none resize-none ${cardBgClass}`}
                          />
                        </div>

                        <button
                          type="submit"
                          className={`w-full py-2.5 ${borderRadius} text-white text-xs font-bold hover:brightness-110 shadow-xs transition-all flex items-center justify-center gap-1.5`}
                          style={{ backgroundColor: accentColor }}
                        >
                          <span className="material-symbols-outlined text-[16px]">send</span>
                          <span>إرسال الاستفسار</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ABOUT US PAGE / TAB (Conditional via layoutConfig.showAboutUsTab) */}
        {/* ========================================================================= */}
        {storeView === 'about' && showAboutUsTab && (
          <div className="space-y-8 animate-fade-in">
            {/* About Hero Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
              <span 
                className="px-3 py-1 rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: accentColor }}
              >
                قصة العلامة التجارية • The {currentMerchant.shortName} Story
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif leading-tight">
                إحياء فخامة الكتان الطبيعي بأيادٍ مصرية أصيلة
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${textMutedClass}`}>
                تأسس {currentMerchant.name} في القاهرة برؤية واضحة: تقديم أزياء معاصرة راقية تحتفي بالكتان المصري النقي والتطريز اليدوي الدقيق، لابتكار قطع تدوم لسنوات بعيداً عن الموضة السريعة.
              </p>
            </div>

            {/* Editorial Atelier Imagery & Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className={`aspect-[4/3] ${borderRadius} overflow-hidden border shadow-md ${cardBgClass}`}>
                <img 
                  src={currentMerchant.banner} 
                  alt={currentMerchant.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className={`p-4 ${borderRadius} border space-y-1.5 ${cardBgClass}`}>
                  <h4 className="text-sm font-bold flex items-center gap-1.5" style={{ color: accentColor }}>
                    <span className="material-symbols-outlined text-[18px]">eco</span>
                    <span>1. أقمشة ومواد طبيعية 100%</span>
                  </h4>
                  <p className={`text-xs leading-relaxed ${textMutedClass}`}>
                    نعتمد حصرياً على أجود ألياف الكتان الطبيعي طويل التيلة المنسوج في مصر، لنوفر أقمشة ناعمة وصحية للبشرة في المناخ الحار.
                  </p>
                </div>

                <div className={`p-4 ${borderRadius} border space-y-1.5 ${cardBgClass}`}>
                  <h4 className="text-sm font-bold flex items-center gap-1.5 text-amber-500">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                    <span>2. تمكين الحرفيات المحليات</span>
                  </h4>
                  <p className={`text-xs leading-relaxed ${textMutedClass}`}>
                    تتم خياطة وتطريز جميع قطعنا بأيادٍ ماهرة لحرفيات مصريات في مشاغلنا بالقاهرة، مع ضمان بيئة عمل عادلة ومستدامة.
                  </p>
                </div>

                <div className={`p-4 ${borderRadius} border space-y-1.5 ${cardBgClass}`}>
                  <h4 className="text-sm font-bold flex items-center gap-1.5 text-emerald-500">
                    <span className="material-symbols-outlined text-[18px]">all_inclusive</span>
                    <span>3. فلسفة الموضة البطيئة (Slow Fashion)</span>
                  </h4>
                  <p className={`text-xs leading-relaxed ${textMutedClass}`}>
                    نصنع كميات محدودة ومحسوبة بعناية لتجنب الهدر، مما يجعل كل قطعة ترتدينها فريدة واستثنائية.
                  </p>
                </div>
              </div>
            </div>

            {/* Back to Shopping CTA */}
            <div className={`p-6 ${borderRadius} border text-center space-y-3 ${cardBgClass}`}>
              <h3 className="text-base sm:text-lg font-bold font-serif">
                جاهزة لاكتشاف قطع كولكشن صيف 2026؟
              </h3>
              <button
                onClick={() => {
                  setStoreView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-6 py-2.5 ${borderRadius} text-white text-xs font-bold hover:brightness-110 shadow-md transition-all inline-flex items-center gap-1.5`}
                style={{ backgroundColor: accentColor }}
              >
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                <span>تصفح منتجات {currentMerchant.shortName} الآن</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* REEL PREVIEW POPUP MODAL                                                   */}
        {/* ========================================================================= */}
        {activeReel && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className={`relative w-full max-w-sm ${borderRadius} overflow-hidden border shadow-2xl ${cardBgClass}`}>
              <div className="aspect-[9/16] w-full relative bg-black">
                {activeReel.video ? (
                  <video 
                    src={activeReel.video} 
                    autoPlay 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover"
                    controls
                  />
                ) : (
                  <img 
                    src={activeReel.image} 
                    alt={activeReel.creator} 
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 pointer-events-none flex flex-col justify-between p-4 text-white">
                  <div className="flex items-center justify-between pointer-events-auto">
                    <span className="font-bold text-xs bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full">{activeReel.creator}</span>
                    <button 
                      onClick={() => setActiveReel(null)}
                      className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs text-slate-100">{activeReel.caption}</p>

                    {/* Tagged Product Bar in Reel */}
                    {activeReel.taggedProduct && (
                      <div className={`p-2.5 ${borderRadius} bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-between gap-2 text-white`}>
                        <div className="flex items-center gap-2 min-w-0">
                          <img 
                            src={activeReel.taggedProduct.image} 
                            alt={activeReel.taggedProduct.title} 
                            className="w-10 h-10 rounded-lg object-cover" 
                          />
                          <div className="truncate">
                            <h5 className="text-xs font-bold truncate">{activeReel.taggedProduct.title}</h5>
                            <span className="text-xs font-bold" style={{ color: accentColor }}>{activeReel.taggedProduct.price.toLocaleString()} ج.م</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            addToCart(activeReel.taggedProduct);
                            setActiveReel(null);
                            setShowStoreCheckoutNotice(true);
                          }}
                          className={`px-3 py-1.5 ${borderRadius} text-white text-[11px] font-bold shrink-0 hover:brightness-110`}
                          style={{ backgroundColor: accentColor }}
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
        <footer className={`pt-8 border-t text-xs space-y-4 ${subCardBgClass} ${textMutedClass}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold">{currentMerchant.name}</span>
              <span>• جميع الحقوق محفوظة {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              {showProductsCatalog && <a href="#products-section" className="hover:opacity-100">المنتجات</a>}
              {showAboutUsTab && <button onClick={() => setStoreView('about')} className="hover:opacity-100">عن البراند</button>}
              {showContactSection && <a href="#contact-section" className="hover:opacity-100">تواصل معنا</a>}
              {showTestimonials && <a href="#reviews-section" className="hover:opacity-100">آراء العملاء</a>}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-3 border-t text-[11px]">
            <span>مدعوم بواسطة</span>
            <a 
              href="https://egyptian-commerce.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold hover:underline flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
              Egyptian Commerce • التجارة المصرية
            </a>
          </div>
        </footer>
      </main>

      {/* 9. Floating WhatsApp Widget Button (Conditional via layoutConfig.showWhatsAppFloat) */}
      {showWhatsAppFloat && (
        <aside aria-label="محادثة واتساب سريعة" className="fixed bottom-6 left-6 z-40">
          <a
            href={`https://wa.me/${currentMerchant.whatsapp.replace(/[^0-9]/g, '')}?text=مرحبا، أود الاستفسار عن كولكشن ${encodeURIComponent(currentMerchant.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-emerald-500/25 transition-all group scale-95 hover:scale-100"
            title="تحدث مع استشارية الأزياء على واتساب"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span className="text-xs font-bold hidden sm:inline">واتساب {currentMerchant.shortName}</span>
          </a>
        </aside>
      )}
    </div>
  );
}
