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
    setActiveTab,
    deviceMode
  } = useApp();

  const currentMerchant = merchants.find(m => m.id === selectedMerchantId) || merchants[0];
  const merchantProducts = products.filter(p => p.merchantId === currentMerchant.id);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState(false);
  const [storeCartCount, setStoreCartCount] = useState(2);
  const [showStoreCheckoutNotice, setShowStoreCheckoutNotice] = useState(false);

  const copyPromoCode = () => {
    navigator.clipboard?.writeText(currentMerchant.promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const filteredProducts = selectedCategory === 'all'
    ? merchantProducts
    : merchantProducts.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface flex flex-col selection:bg-primary/20 pb-24">
      {/* Top B2B SaaS Subdomain Bar */}
      <div className="w-full bg-surface-container-lowest border-b border-surface-container-high py-2 px-3 md:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Subdomain & Verification */}
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
            <span className="text-on-surface-variant text-[11px] hidden md:inline">معاينة متاجر أخرى:</span>
            <select
              value={currentMerchant.id}
              onChange={(e) => setSelectedMerchantId(e.target.value)}
              className="bg-surface-container-low text-on-surface px-2 py-0.5 rounded text-[11px] border border-surface-container-high focus:outline-none focus:border-primary"
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
              <span>السوق الموحد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Merchant Announcement Bar */}
      <div 
        className="w-full py-1.5 px-3 text-center text-xs font-bold text-on-primary shadow-xs transition-colors"
        style={{ backgroundColor: currentMerchant.themeColor || '#ff4646' }}
      >
        <p className="max-w-4xl mx-auto truncate">
          {currentMerchant.announcement}
        </p>
      </div>

      {/* Merchant Branded Header */}
      <div className="w-full bg-surface-container-lowest/80 backdrop-blur-md sticky top-16 z-30 border-b border-surface-container-high px-4 md:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Store Title */}
          <div className="flex items-center gap-3">
            <img 
              src={currentMerchant.logo} 
              alt={currentMerchant.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-surface-container-high shadow-xs" 
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base md:text-lg font-bold font-serif text-on-surface leading-tight">
                  {currentMerchant.name}
                </h1>
                <span className="material-symbols-outlined text-tertiary text-[17px]" title="علامة موثقة">check_circle</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                {currentMerchant.categoryAr} • القاهرة
              </p>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${currentMerchant.whatsapp.replace(/[^0-9]/g, '')}?text=مرحبا، أود الاستفسار عن منتجات متجر ${encodeURIComponent(currentMerchant.name)}`}
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

      {/* Main Storefront Body */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-6 pt-5 space-y-8">
        {/* Checkout Notification Toast */}
        {showStoreCheckoutNotice && (
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-primary/40 shadow-lg flex items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[24px]">local_mall</span>
              <div>
                <h4 className="text-xs font-bold text-on-surface">إتمام الشراء المباشر من متجر {currentMerchant.shortName}</h4>
                <p className="text-[11px] text-on-surface-variant">
                  يمكنك الدفع المباشر للتاجر عبر InstaPay أو عند الاستلام، أو دمج طلبك في سلة EG-Commerce الموحدة!
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

        {/* Hero Banner with Editorial Aesthetic */}
        <div className="relative rounded-3xl overflow-hidden border border-surface-container-high shadow-md bg-surface-container-lowest">
          <div className="h-56 sm:h-72 md:h-80 w-full relative">
            <img 
              src={currentMerchant.banner} 
              alt={currentMerchant.name}
              className="w-full h-full object-cover brightness-[0.7] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/50 to-transparent" />
            
            {/* Overlay Copy */}
            <div className="absolute bottom-6 inset-x-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-xl">
                <span className="px-3 py-1 rounded-full bg-secondary/20 border border-secondary/40 text-secondary text-[11px] font-bold inline-block mb-2 backdrop-blur-sm">
                  كولكشن الموسم • Handmade in Cairo
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-white tracking-tight leading-tight">
                  {currentMerchant.category}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 line-clamp-2">
                  {currentMerchant.bio}
                </p>
              </div>

              {/* Promo Code Card */}
              <div className="bg-surface-container-low/90 backdrop-blur-md p-3 rounded-2xl border border-surface-container-highest flex items-center gap-3 self-start md:self-auto">
                <div>
                  <span className="text-[10px] text-on-surface-variant block">كود خصم حصري للطلب الأول:</span>
                  <span className="text-sm font-mono font-bold text-secondary">{currentMerchant.promoCode}</span>
                </div>
                <button
                  onClick={copyPromoCode}
                  className="px-3 py-1.5 rounded-xl bg-secondary/15 hover:bg-secondary/30 text-secondary border border-secondary/30 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {copiedCode ? 'done' : 'content_copy'}
                  </span>
                  <span>{copiedCode ? 'تم النسخ!' : 'نسخ'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Story & Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[22px]">star</span>
            <div>
              <span className="text-sm font-bold text-on-surface leading-tight block">{currentMerchant.rating} / 5.0</span>
              <span className="text-[11px] text-on-surface-variant">({currentMerchant.reviewsCount} تقييم موثق)</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary text-[22px]">local_shipping</span>
            <div>
              <span className="text-sm font-bold text-on-surface leading-tight block">شحن 48 ساعة</span>
              <span className="text-[11px] text-on-surface-variant">عبر بوسطة Bosta</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[22px]">account_balance_wallet</span>
            <div>
              <span className="text-sm font-bold text-on-surface leading-tight block">InstaPay & COD</span>
              <span className="text-[11px] text-on-surface-variant">دفع فوري أو عند الاستلام</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface text-[22px]">cycle</span>
            <div>
              <span className="text-sm font-bold text-on-surface leading-tight block">معاينة واستبدال 14 يوم</span>
              <span className="text-[11px] text-on-surface-variant">عند باب المنزل مجاناً</span>
            </div>
          </div>
        </div>

        {/* Merchant Collections & Products Grid */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container-high pb-3">
            <div>
              <h3 className="text-lg font-bold font-serif text-on-surface">
                منتجات متجر {currentMerchant.shortName}
              </h3>
              <p className="text-xs text-on-surface-variant">
                تصفح تشكيلة القطع المتاحة حالياً مع خيارات المقاسات والألوان
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['all', 'كتان', 'عبايات', 'جلد', 'إكسسوارات'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-surface-container-high'
                  }`}
                >
                  {cat === 'all' ? 'جميع القطع' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="group rounded-2xl bg-surface-container-lowest border border-surface-container-high overflow-hidden hover:border-surface-container-highest transition-all duration-300 flex flex-col shadow-xs"
              >
                {/* Image Container */}
                <div 
                  onClick={() => openProductDetail(prod)}
                  className="aspect-[3/4] w-full relative overflow-hidden bg-surface-container-low cursor-pointer"
                >
                  <img 
                    src={prod.image} 
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container-lowest/85 backdrop-blur-md text-on-surface text-[10px] font-bold border border-surface-container-high">
                      {prod.category.split(' ')[0]}
                    </span>
                  </div>
                  {prod.originalPrice > prod.price && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-md bg-primary text-on-primary text-[10px] font-bold">
                        وفر {prod.originalPrice - prod.price} ج.م
                      </span>
                    </div>
                  )}
                  {/* Quick Buy Hover Pill */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuickBuy(prod);
                    }}
                    className="absolute bottom-2 inset-x-2 py-1.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md text-on-surface text-xs font-bold flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-primary hover:text-on-primary"
                  >
                    <span className="material-symbols-outlined text-[15px]">flash_on</span>
                    <span>شراء سريع</span>
                  </button>
                </div>

                {/* Details */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 
                      onClick={() => openProductDetail(prod)}
                      className="text-xs md:text-sm font-semibold text-on-surface line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    >
                      {prod.title}
                    </h4>
                    <div className="flex items-center gap-1 text-secondary text-xs mt-1">
                      <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                      <span className="font-bold">{prod.rating}</span>
                      <span className="text-[10px] text-on-surface-variant">({prod.reviewsCount})</span>
                    </div>
                  </div>

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

        {/* Customer Reels & Community Looks */}
        <section className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">play_circle</span>
              <h3 className="text-base font-bold text-on-surface">
                شاهدي إطلالات زبائن تاليسكا عبر الريلز • Community Looks
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('reels')}
              className="text-xs text-secondary font-bold hover:underline flex items-center gap-1"
            >
              <span>مشاهدة الكل في ريلز EG</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'r1', creator: '@nour_style', caption: 'تنسيق فستان الكتان للعمل والمساء ✨', views: '24.5K', image: merchantProducts[0]?.image },
              { id: 'r2', creator: '@salma_egypt', caption: 'ريفيو الكيمونو الرملي على الطبيعة 😍', views: '18.2K', image: merchantProducts[1]?.image || merchantProducts[0]?.image },
              { id: 'r3', creator: '@cairo_fashionista', caption: 'إطلالة شاطئية أنيقة بأقمشة مصرية 🏖️', views: '31.1K', image: merchantProducts[0]?.image },
              { id: 'r4', creator: '@farida_looks', caption: 'تفاصيل الخياطة والتطريز اليدوي 🪡', views: '14.8K', image: merchantProducts[1]?.image || merchantProducts[0]?.image },
            ].map((reel) => (
              <div
                key={reel.id}
                onClick={() => setActiveTab('reels')}
                className="aspect-[9/16] rounded-2xl overflow-hidden relative group cursor-pointer bg-surface-container-low border border-surface-container-high"
              >
                <img 
                  src={reel.image} 
                  alt={reel.creator}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                  <div className="flex items-center gap-1 text-[10px] text-slate-300 mb-1">
                    <span className="material-symbols-outlined text-[13px] text-white">visibility</span>
                    <span>{reel.views}</span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-300 truncate">{reel.creator}</span>
                  <p className="text-[10px] text-slate-200 line-clamp-1">{reel.caption}</p>
                </div>
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Storefront Footer */}
        <footer className="pt-8 border-t border-surface-container-high text-xs text-on-surface-variant space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-on-surface">{currentMerchant.name}</span>
              <span>• جميع الحقوق محفوظة {new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <a href="#" className="hover:text-on-surface">سياسة الاستبدال</a>
              <a href="#" className="hover:text-on-surface">الشحن والتوصيل</a>
              <a href="#" className="hover:text-on-surface">تتبع الشحنة مع Bosta</a>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 py-3 border-t border-surface-container-high text-[11px]">
            <span className="text-on-surface-variant">مستضاف بواسطة:</span>
            <span className="font-mono font-bold text-on-surface flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              EG-Commerce B2B SaaS Engine
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}
