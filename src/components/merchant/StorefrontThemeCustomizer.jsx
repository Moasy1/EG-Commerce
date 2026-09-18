import React, { useState, useEffect } from 'react';
import { useApp, MERCHANTS_DATA } from '../../context/AppContext';

export default function StorefrontThemeCustomizer() {
  const { 
    merchants, 
    selectedMerchantId, 
    updateMerchant, 
    products, 
    setActiveTab,
    user
  } = useApp();

  const fallbackMerchant = (merchants && merchants.length > 0) ? merchants[0] : (MERCHANTS_DATA?.[0] || {});
  const currentMerchant = (merchants && merchants.length > 0)
    ? (merchants.find(m => m.id === selectedMerchantId || m.id === user?.merchant_id || m.user_id === user?.id) || fallbackMerchant)
    : fallbackMerchant;

  // Active sub-tab inside theme customizer
  const [activeCustomizerTab, setActiveCustomizerTab] = useState('theme'); // 'theme' | 'layout' | 'hero' | 'brand'
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [saveToast, setSaveToast] = useState(false);

  // Editable Form State
  const [brandName, setBrandName] = useState('');
  const [brandBio, setBrandBio] = useState('');
  const [categoryAr, setCategoryAr] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');

  // Theme Config
  const [themeMode, setThemeMode] = useState('dark');
  const [accentColor, setAccentColor] = useState('#d00000');
  const [fontFamily, setFontFamily] = useState('sans');
  const [borderRadius, setBorderRadius] = useState('rounded-2xl');
  const [heroStyle, setHeroStyle] = useState('wide_cinema');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroSubheadline, setHeroSubheadline] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('تسوق كولكشن 2026');
  const [productsGridCols, setProductsGridCols] = useState(3);
  const [showRatings, setShowRatings] = useState(true);
  const [showStockBadges, setShowStockBadges] = useState(true);

  // Layout Config
  const [announcement, setAnnouncement] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPct, setDiscountPct] = useState(15);
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);
  const [showHeroBanner, setShowHeroBanner] = useState(true);
  const [showTrustBadges, setShowTrustBadges] = useState(true);
  const [showProductsCatalog, setShowProductsCatalog] = useState(true);
  const [showCommunityReels, setShowCommunityReels] = useState(true);
  const [showSocialMediaFeed, setShowSocialMediaFeed] = useState(true);
  const [showTestimonials, setShowTestimonials] = useState(true);
  const [showContactSection, setShowContactSection] = useState(true);
  const [showWhatsAppFloat, setShowWhatsAppFloat] = useState(true);
  const [showAboutUsTab, setShowAboutUsTab] = useState(true);

  // Trust Badges Customization
  const [trustBadges, setTrustBadges] = useState([
    { id: 'b1', icon: 'local_shipping', title: 'شحن سريع بوسطة', desc: 'توصيل لباب بيتك خلال 24-48 ساعة' },
    { id: 'b2', icon: 'verified', title: 'كتان طبيعي 100%', desc: 'أقمشة مصرية معالجة ضد الانكماش' },
    { id: 'b3', icon: 'assignment_return', title: 'معاينة عند الاستلام', desc: 'حق الاستبدال خلال 14 يوم مجاناً' },
    { id: 'b4', icon: 'support_agent', title: 'استشارة مقاسات فورية', desc: 'فريق متخصص عبر الواتساب لحظياً' }
  ]);

  // Sync state when currentMerchant changes
  useEffect(() => {
    if (currentMerchant) {
      setBrandName(currentMerchant.name || '');
      setBrandBio(currentMerchant.bio || '');
      setCategoryAr(currentMerchant.categoryAr || '');
      setSubdomain(currentMerchant.subdomain || '');
      setCustomDomain(currentMerchant.customDomain || '');
      setLogo(currentMerchant.logo || '');
      setBanner(currentMerchant.banner || '');
      setWhatsapp(currentMerchant.whatsapp || '');
      setInstagram(currentMerchant.instagram || '');
      setAnnouncement(currentMerchant.announcement || '');
      setPromoCode(currentMerchant.promoCode || '');
      setDiscountPct(currentMerchant.discountPct || 15);

      const tc = currentMerchant.themeConfig || {};
      setThemeMode(tc.themeMode || 'dark');
      setAccentColor(tc.accentColor || currentMerchant.themeColor || '#d00000');
      setFontFamily(tc.fontFamily || 'sans');
      setBorderRadius(tc.borderRadius || 'rounded-2xl');
      setHeroStyle(tc.heroStyle || 'wide_cinema');
      setHeroHeadline(tc.heroHeadline || 'إحياء فخامة الكتان الطبيعي بأيادٍ مصرية أصيلة');
      setHeroSubheadline(tc.heroSubheadline || 'أزياء مصرية معاصرة منسوجة يدوياً 100% من أجود ألياف الكتان.');
      setHeroCtaText(tc.heroCtaText || 'تسوق كولكشن 2026');
      setProductsGridCols(tc.productsGridCols || 3);
      setShowRatings(tc.showRatings !== false);
      setShowStockBadges(tc.showStockBadges !== false);

      const lc = currentMerchant.layoutConfig || {};
      setShowAnnouncementBar(lc.showAnnouncementBar !== false);
      setShowHeroBanner(lc.showHeroBanner !== false);
      setShowTrustBadges(lc.showTrustBadges !== false);
      setShowProductsCatalog(lc.showProductsCatalog !== false);
      setShowCommunityReels(lc.showCommunityReels !== false);
      setShowSocialMediaFeed(lc.showSocialMediaFeed !== false);
      setShowTestimonials(lc.showTestimonials !== false);
      setShowContactSection(lc.showContactSection !== false);
      setShowWhatsAppFloat(lc.showWhatsAppFloat !== false);
      setShowAboutUsTab(lc.showAboutUsTab !== false);
      if (lc.trustBadges && lc.trustBadges.length > 0) {
        setTrustBadges(lc.trustBadges);
      }
    }
  }, [currentMerchant.id]);

  // Preset Palettes
  const colorPresets = [
    { name: 'أحمر قرمزي ملكي', hex: '#d00000' },
    { name: 'ذهب فرعوني فاخر', hex: '#feb700' },
    { name: 'زمرد وادي النيل', hex: '#10b981' },
    { name: 'أزرق ياقوتي بحري', hex: '#3b82f6' },
    { name: 'تيراكوتا رملية', hex: '#c5705d' },
    { name: 'فحم أسود مينيمال', hex: '#18181b' },
  ];

  // Preset Logos & Banners
  const logoPresets = [
    { label: 'تاليسكا مونوغرام T', url: '/images/brands/talieska_logo.jpg' },
    { label: 'فانوس خان الخليلي', url: '/images/products/copper_lantern.jpg' },
    { label: 'بليزر أيقوني', url: '/images/products/wool_blazer.jpg' },
  ];

  const bannerPresets = [
    { label: 'عرض أزياء تاليسكا بالقاهرة', url: '/images/banners/talieska_hero.jpg' },
    { label: 'ساحة خان الخليلي التراثية', url: '/images/banners/khan_hero.jpg' },
    { label: 'موديل في شوارع المعز', url: '/images/reels/reel_1.jpg' },
  ];

  // Live Sync to AppContext
  const handleSaveAndApply = () => {
    const updated = {
      name: brandName,
      bio: brandBio,
      categoryAr,
      subdomain,
      customDomain,
      logo,
      banner,
      whatsapp,
      instagram,
      announcement,
      promoCode,
      discountPct: Number(discountPct),
      themeColor: accentColor,
      themeConfig: {
        themeMode,
        accentColor,
        fontFamily,
        borderRadius,
        heroStyle,
        heroHeadline,
        heroSubheadline,
        heroCtaText,
        productsGridCols: Number(productsGridCols),
        showRatings,
        showStockBadges
      },
      layoutConfig: {
        showAnnouncementBar,
        showHeroBanner,
        showTrustBadges,
        showProductsCatalog,
        showCommunityReels,
        showSocialMediaFeed,
        showTestimonials,
        showContactSection,
        showWhatsAppFloat,
        showAboutUsTab,
        trustBadges
      }
    };

    updateMerchant(currentMerchant.id, updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Instant Live Update helper (auto-applies on change for preview)
  const triggerLiveUpdate = (partialUpdates = {}) => {
    const updated = {
      name: brandName,
      bio: brandBio,
      categoryAr,
      subdomain,
      customDomain,
      logo,
      banner,
      whatsapp,
      instagram,
      announcement,
      promoCode,
      discountPct: Number(discountPct),
      themeColor: accentColor,
      themeConfig: {
        themeMode,
        accentColor,
        fontFamily,
        borderRadius,
        heroStyle,
        heroHeadline,
        heroSubheadline,
        heroCtaText,
        productsGridCols: Number(productsGridCols),
        showRatings,
        showStockBadges,
        ...(partialUpdates.themeConfig || {})
      },
      layoutConfig: {
        showAnnouncementBar,
        showHeroBanner,
        showTrustBadges,
        showProductsCatalog,
        showCommunityReels,
        showSocialMediaFeed,
        showTestimonials,
        showContactSection,
        showWhatsAppFloat,
        showAboutUsTab,
        trustBadges,
        ...(partialUpdates.layoutConfig || {})
      },
      ...partialUpdates
    };
    updateMerchant(currentMerchant.id, updated);
  };

  const merchantProducts = products.filter(p => p.merchantId === currentMerchant.id);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Top Customizer Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[22px]">tune</span>
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface flex items-center gap-2">
                <span>محرر وتخصيص هوية المتجر والقالب (Storefront Theme & Layout Builder)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono">
                  Live Engine
                </span>
              </h2>
              <p className="text-xs text-on-surface-variant">
                تحكم كامل في هوية براندك، الألوان، أسلوب الهيرو، وتفعيل أو إخفاء أي قسم في المتجر المستقل.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* View Live Storefront */}
          <button
            onClick={() => setActiveTab('storefront')}
            className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            title="الانتقال للمتجر الحي"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">visibility</span>
            <span>معاينة المتجر الحي</span>
          </button>

          {/* Save & Publish */}
          <button
            onClick={handleSaveAndApply}
            className="px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>حفظ ونشر التغييرات</span>
          </button>
        </div>
      </div>

      {/* Save Toast Notification */}
      {saveToast && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-fade-in shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>تم حفظ ونشر جميع إعدادات القالب والهوية في المتجر المستقل بنجاح!</span>
          </div>
          <button onClick={() => setActiveTab('storefront')} className="underline text-[11px]">
            عرض المتجر الآن ➔
          </button>
        </div>
      )}

      {/* 2. Main Grid: Controls (Left/Right depending on RTL) and Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* PANEL 1: CUSTOMIZER CONTROLS (7 COLS)                                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sub-Tabs Nav */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface-container-low border border-surface-container-high overflow-x-auto scrollbar-none">
            {[
              { id: 'theme', label: 'الألوان والخطوط', icon: 'palette' },
              { id: 'hero', label: 'الهيرو وتخطيط الكتالوج', icon: 'view_quilt' },
              { id: 'layout', label: 'أقسام المتجر (10 أقسام)', icon: 'splitscreen' },
              { id: 'brand', label: 'الهوية والنطاق (Domain)', icon: 'storefront' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCustomizerTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeCustomizerTab === tab.id
                    ? 'bg-surface-container-highest text-primary shadow-xs border border-primary/20'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: THEME & COLORS */}
          {activeCustomizerTab === 'theme' && (
            <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high space-y-6 shadow-xs">
              {/* Color Mode */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                  <span>وضع السمة والمظهر العام (Theme Mode)</span>
                  <span className="text-[11px] text-on-surface-variant font-normal">خلفية وتباين الألوان</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'dark', label: 'فحم ملكي داكن (Dark Luxury)', icon: 'dark_mode', bg: 'bg-[#0c141f] border-slate-700 text-white' },
                    { id: 'light', label: 'أبيض نقي مينيمال (Atelier Clean)', icon: 'light_mode', bg: 'bg-[#fbf9f6] border-slate-300 text-slate-900' },
                    { id: 'midnight', label: 'أزرق ليلي مخملي (Midnight Blue)', icon: 'bedtime', bg: 'bg-[#060911] border-blue-950 text-white' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setThemeMode(mode.id);
                        triggerLiveUpdate({ themeConfig: { themeMode: mode.id } });
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${mode.bg} ${
                        themeMode === mode.id ? 'ring-2 ring-primary scale-[1.02] shadow-md' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">{mode.icon}</span>
                      <span className="text-[11px] font-bold leading-snug">{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface flex items-center justify-between">
                  <span>اللون التمييزي الأساسي للبراند (Primary Accent Color)</span>
                  <span className="font-mono text-xs font-bold" style={{ color: accentColor }}>{accentColor}</span>
                </label>

                {/* Swatches */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => {
                        setAccentColor(preset.hex);
                        triggerLiveUpdate({ themeColor: preset.hex, themeConfig: { accentColor: preset.hex } });
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        accentColor === preset.hex 
                          ? 'border-white ring-2 ring-primary scale-105 shadow-md' 
                          : 'border-surface-container-high hover:scale-102'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-full shadow-inner border border-white/20" style={{ backgroundColor: preset.hex }} />
                      <span className="text-[10px] text-on-surface-variant truncate w-full text-center">{preset.name}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Hex Picker */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => {
                      setAccentColor(e.target.value);
                      triggerLiveUpdate({ themeColor: e.target.value, themeConfig: { accentColor: e.target.value } });
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => {
                        setAccentColor(e.target.value);
                        triggerLiveUpdate({ themeColor: e.target.value, themeConfig: { accentColor: e.target.value } });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-xs font-mono font-bold text-on-surface focus:outline-none focus:border-primary"
                      placeholder="#d00000"
                    />
                  </div>
                </div>
              </div>

              {/* Typography Pairing */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface">طابع الخطوط والطباعة (Typography Style)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'sans', label: 'عصري ناعم (Modern Sans)', preview: 'IBM Plex Sans Arabic' },
                    { id: 'serif', label: 'كلاسيكي عريق (Heritage Serif)', preview: 'Noto Serif Arabic' },
                    { id: 'cairo', label: 'كايرو بولد (Cairo Contemporary)', preview: 'Cairo Bold' },
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => {
                        setFontFamily(font.id);
                        triggerLiveUpdate({ themeConfig: { fontFamily: font.id } });
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        fontFamily === font.id 
                          ? 'border-primary bg-surface-container-high text-primary shadow-xs' 
                          : 'border-surface-container-high bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="text-xs font-bold block">{font.label}</span>
                      <span className="text-[10px] opacity-70 block mt-1">{font.preview}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner Curvature */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface">انحناء حواف الكروت والأزرار (Corner Radius)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'rounded-none', label: 'حواف حادة (Sharp Minimal)', style: 'rounded-none' },
                    { id: 'rounded-xl', label: 'انحناء ناعم (Subtle Rounded)', style: 'rounded-xl' },
                    { id: 'rounded-3xl', label: 'انحناء فاخر (Soft Luxury)', style: 'rounded-3xl' },
                  ].map((radius) => (
                    <button
                      key={radius.id}
                      onClick={() => {
                        setBorderRadius(radius.id);
                        triggerLiveUpdate({ themeConfig: { borderRadius: radius.id } });
                      }}
                      className={`p-3 border text-center transition-all ${radius.style} ${
                        borderRadius === radius.id 
                          ? 'border-primary bg-surface-container-high text-primary shadow-xs' 
                          : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      <span className="text-xs font-bold">{radius.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & CATALOG LAYOUT */}
          {activeCustomizerTab === 'hero' && (
            <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high space-y-6 shadow-xs">
              {/* Hero Style Selection */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-on-surface">أسلوب وتنسيق قسم الهيرو (Hero Layout Style)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'wide_cinema', label: 'بانر سينمائي عريض', icon: 'panorama', desc: 'صورة كاملة مع نصوص مدمجة' },
                    { id: 'split_editorial', label: 'تقسيم ثنائي إديتوريال', icon: 'vertical_split', desc: 'نص بالجانب وصورة بالجانب' },
                    { id: 'minimal_card', label: 'بطاقة مينيمال مركزة', icon: 'crop_landscape', desc: 'تصميم بسيط وسريع التصفح' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => {
                        setHeroStyle(style.id);
                        triggerLiveUpdate({ themeConfig: { heroStyle: style.id } });
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        heroStyle === style.id 
                          ? 'border-primary bg-surface-container-high text-primary shadow-xs' 
                          : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{style.icon}</span>
                      <span className="text-xs font-bold">{style.label}</span>
                      <span className="text-[10px] opacity-70">{style.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hero Headline & Subheadline */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">عنوان الهيرو الرئيسي (Headline Title)</label>
                  <input
                    type="text"
                    value={heroHeadline}
                    onChange={(e) => {
                      setHeroHeadline(e.target.value);
                      triggerLiveUpdate({ themeConfig: { heroHeadline: e.target.value } });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface font-bold focus:outline-none focus:border-primary"
                    placeholder="إحياء فخامة الكتان الطبيعي بأيادٍ مصرية أصيلة"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">النص التسويقي الفرعي (Subheadline Story)</label>
                  <textarea
                    rows={2}
                    value={heroSubheadline}
                    onChange={(e) => {
                      setHeroSubheadline(e.target.value);
                      triggerLiveUpdate({ themeConfig: { heroSubheadline: e.target.value } });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-primary"
                    placeholder="أزياء مصرية معاصرة منسوجة يدوياً 100% من أجود ألياف الكتان..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">نص زر الطلب السريع (CTA Button Text)</label>
                  <input
                    type="text"
                    value={heroCtaText}
                    onChange={(e) => {
                      setHeroCtaText(e.target.value);
                      triggerLiveUpdate({ themeConfig: { heroCtaText: e.target.value } });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface font-bold focus:outline-none focus:border-primary"
                    placeholder="تسوق كولكشن 2026"
                  />
                </div>
              </div>

              {/* Products Catalog Display Grid */}
              <div className="space-y-3 pt-2 border-t border-surface-container-high">
                <label className="text-xs font-bold text-on-surface">كثافة شبكة المنتجات (Products Grid Columns)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { cols: 2, label: 'عمودين (كبير وإديتوريال)' },
                    { cols: 3, label: '3 أعمدة (متوازن بوتيك)' },
                    { cols: 4, label: '4 أعمدة (مدمج وواسع)' },
                  ].map((g) => (
                    <button
                      key={g.cols}
                      onClick={() => {
                        setProductsGridCols(g.cols);
                        triggerLiveUpdate({ themeConfig: { productsGridCols: g.cols } });
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        productsGridCols === g.cols 
                          ? 'border-primary bg-surface-container-high text-primary font-bold shadow-xs' 
                          : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      <span className="text-xs">{g.label}</span>
                    </button>
                  ))}
                </div>

                {/* Catalog Badges Toggles */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-high cursor-pointer">
                    <span className="text-xs font-bold text-on-surface">إظهار تقييمات النجوم</span>
                    <input
                      type="checkbox"
                      checked={showRatings}
                      onChange={(e) => {
                        setShowRatings(e.target.checked);
                        triggerLiveUpdate({ themeConfig: { showRatings: e.target.checked } });
                      }}
                      className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container-high cursor-pointer">
                    <span className="text-xs font-bold text-on-surface">إظهار شارة المخزون المتبقي</span>
                    <input
                      type="checkbox"
                      checked={showStockBadges}
                      onChange={(e) => {
                        setShowStockBadges(e.target.checked);
                        triggerLiveUpdate({ themeConfig: { showStockBadges: e.target.checked } });
                      }}
                      className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECTIONS VISIBILITY (10 SECTIONS) */}
          {activeCustomizerTab === 'layout' && (
            <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high space-y-4 shadow-xs">
              <div className="border-b border-surface-container-high pb-2">
                <h3 className="text-xs font-bold text-on-surface">التحكم في تشغيل وإخفاء أقسام المتجر (Sections Toggles)</h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  قم بتشغيل أو إيقاف أي قسم بحسب احتياجات مبيعاتك وحملاتك الترويجية.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'announcement',
                    title: '1. الشريط الترويجي العلوي (Announcement Bar)',
                    checked: showAnnouncementBar,
                    toggle: (v) => { setShowAnnouncementBar(v); triggerLiveUpdate({ layoutConfig: { showAnnouncementBar: v } }); },
                    extra: (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-surface-container-high text-xs">
                        <input
                          type="text"
                          value={announcement}
                          onChange={(e) => { setAnnouncement(e.target.value); triggerLiveUpdate({ announcement: e.target.value }); }}
                          placeholder="نص الإعلان..."
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container border border-surface-container-high text-on-surface text-xs"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => { setPromoCode(e.target.value); triggerLiveUpdate({ promoCode: e.target.value }); }}
                            placeholder="كود الخصم (TALIESKA15)"
                            className="w-2/3 px-2.5 py-1.5 rounded-lg bg-surface-container border border-surface-container-high text-on-surface text-xs font-mono font-bold"
                          />
                          <input
                            type="number"
                            value={discountPct}
                            onChange={(e) => { setDiscountPct(e.target.value); triggerLiveUpdate({ discountPct: Number(e.target.value) }); }}
                            placeholder="15%"
                            className="w-1/3 px-2 py-1.5 rounded-lg bg-surface-container border border-surface-container-high text-on-surface text-xs font-bold"
                          />
                        </div>
                      </div>
                    )
                  },
                  {
                    id: 'hero',
                    title: '2. بانر الهيرو الرئيسي (Hero Section)',
                    checked: showHeroBanner,
                    toggle: (v) => { setShowHeroBanner(v); triggerLiveUpdate({ layoutConfig: { showHeroBanner: v } }); }
                  },
                  {
                    id: 'trust',
                    title: '3. صناديق المزايا والثقة (Trust Badges & Value Props)',
                    checked: showTrustBadges,
                    toggle: (v) => { setShowTrustBadges(v); triggerLiveUpdate({ layoutConfig: { showTrustBadges: v } }); },
                    extra: (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-surface-container-high text-xs">
                        {trustBadges.map((badge, idx) => (
                          <div key={badge.id} className="p-2 rounded-lg bg-surface-container flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[18px]">{badge.icon}</span>
                            <input
                              type="text"
                              value={badge.title}
                              onChange={(e) => {
                                const next = [...trustBadges];
                                next[idx].title = e.target.value;
                                setTrustBadges(next);
                                triggerLiveUpdate({ layoutConfig: { trustBadges: next } });
                              }}
                              className="w-full bg-transparent text-xs font-bold text-on-surface border-0 p-0 focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'catalog',
                    title: '4. كتالوج منتجات المتجر وفلاتر التصنيف (Products Catalog)',
                    checked: showProductsCatalog,
                    toggle: (v) => { setShowProductsCatalog(v); triggerLiveUpdate({ layoutConfig: { showProductsCatalog: v } }); }
                  },
                  {
                    id: 'reels',
                    title: '5. معرض فيديوهات الريلز الاجتماعية (Community Reels Showcase)',
                    checked: showCommunityReels,
                    toggle: (v) => { setShowCommunityReels(v); triggerLiveUpdate({ layoutConfig: { showCommunityReels: v } }); }
                  },
                  {
                    id: 'social',
                    title: '6. خلاصة إنستجرام وتيك توك (Social Media Feed)',
                    checked: showSocialMediaFeed,
                    toggle: (v) => { setShowSocialMediaFeed(v); triggerLiveUpdate({ layoutConfig: { showSocialMediaFeed: v } }); }
                  },
                  {
                    id: 'testimonials',
                    title: '7. آراء وتقييمات العملاء الموثقة (Customer Reviews & Ratings)',
                    checked: showTestimonials,
                    toggle: (v) => { setShowTestimonials(v); triggerLiveUpdate({ layoutConfig: { showTestimonials: v } }); }
                  },
                  {
                    id: 'contact',
                    title: '8. قسم خدمة العملاء والتواصل (Contact & Consultation Section)',
                    checked: showContactSection,
                    toggle: (v) => { setShowContactSection(v); triggerLiveUpdate({ layoutConfig: { showContactSection: v } }); }
                  },
                  {
                    id: 'whatsappFloat',
                    title: '9. زر محادثة الواتساب العائم (Floating WhatsApp Widget)',
                    checked: showWhatsAppFloat,
                    toggle: (v) => { setShowWhatsAppFloat(v); triggerLiveUpdate({ layoutConfig: { showWhatsAppFloat: v } }); }
                  },
                  {
                    id: 'about',
                    title: '10. صفحة قصة ومشاغل البراند (About Us Atelier Tab)',
                    checked: showAboutUsTab,
                    toggle: (v) => { setShowAboutUsTab(v); triggerLiveUpdate({ layoutConfig: { showAboutUsTab: v } }); }
                  },
                ].map((sec) => (
                  <div key={sec.id} className="p-3 rounded-2xl bg-surface-container-low border border-surface-container-high transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface">{sec.title}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sec.checked}
                          onChange={(e) => sec.toggle(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    {sec.checked && sec.extra}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BRAND IDENTITY & DOMAINS */}
          {activeCustomizerTab === 'brand' && (
            <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container-high space-y-6 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">اسم المتجر (Store Brand Name)</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => { setBrandName(e.target.value); triggerLiveUpdate({ name: e.target.value }); }}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface font-bold focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">التصنيف الرئيسي (Category)</label>
                  <input
                    type="text"
                    value={categoryAr}
                    onChange={(e) => { setCategoryAr(e.target.value); triggerLiveUpdate({ categoryAr: e.target.value }); }}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">نبذة عن المتجر (Bio / Brand Story)</label>
                <textarea
                  rows={2}
                  value={brandBio}
                  onChange={(e) => { setBrandBio(e.target.value); triggerLiveUpdate({ bio: e.target.value }); }}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Subdomain & Custom Domain */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high space-y-3">
                <span className="text-xs font-bold text-on-surface block">إعدادات النطاق المخصص والـ Subdomain</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-on-surface-variant block mb-1">النطاق الفرعي للمنصة (SaaS Subdomain)</label>
                    <input
                      type="text"
                      value={subdomain}
                      onChange={(e) => { setSubdomain(e.target.value); triggerLiveUpdate({ subdomain: e.target.value }); }}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-high text-xs font-mono font-bold text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-on-surface-variant block mb-1">الدومين الخاص (Custom CNAME Domain)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customDomain}
                        onChange={(e) => { setCustomDomain(e.target.value); triggerLiveUpdate({ customDomain: e.target.value }); }}
                        placeholder="yourbrand.com"
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-high text-xs font-mono text-on-surface"
                      />
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold whitespace-nowrap flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        SSL OK
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo & Banner Customization */}
              <div className="space-y-4">
                {/* Logo Preset Picker */}
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">شعار المتجر (Store Logo Monogram)</label>
                  <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo Preview" className="w-12 h-12 rounded-2xl object-cover border-2 border-primary shadow-xs" />
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      {logoPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => { setLogo(preset.url); triggerLiveUpdate({ logo: preset.url }); }}
                          className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                            logo === preset.url ? 'border-primary bg-primary/10 text-primary' : 'border-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Banner Preset Picker */}
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1.5">بانر خلفية المتجر (Hero Banner Image)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {bannerPresets.map((preset, idx) => (
                      <div 
                        key={idx}
                        onClick={() => { setBanner(preset.url); triggerLiveUpdate({ banner: preset.url }); }}
                        className={`aspect-video rounded-xl overflow-hidden border cursor-pointer relative group ${
                          banner === preset.url ? 'border-primary ring-2 ring-primary/40' : 'border-surface-container-high opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-1 text-center">
                          <span className="text-[10px] font-bold text-white leading-tight">{preset.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp & Social Media */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">رقم خدمة عملاء واتساب</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => { setWhatsapp(e.target.value); triggerLiveUpdate({ whatsapp: e.target.value }); }}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface block mb-1">حساب إنستجرام الرسمي</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => { setInstagram(e.target.value); triggerLiveUpdate({ instagram: e.target.value }); }}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-xs text-on-surface font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PANEL 2: INTERACTIVE LIVE PREVIEW DEVICE (5 COLS)                         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 sticky top-20 space-y-3">
          {/* Device Switcher */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
            <span className="text-xs font-bold text-on-surface flex items-center gap-1.5 px-2">
              <span className="material-symbols-outlined text-[16px] text-primary">screenshot_monitor</span>
              <span>معاينة حية ومباشرة (Real-Time Preview)</span>
            </span>

            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  previewDevice === 'desktop' ? 'bg-surface-container-highest text-primary shadow-xs' : 'text-on-surface-variant'
                }`}
                title="شاشة كمبيوتر"
              >
                <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ${
                  previewDevice === 'mobile' ? 'bg-surface-container-highest text-primary shadow-xs' : 'text-on-surface-variant'
                }`}
                title="شاشة موبايل"
              >
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
              </button>
            </div>
          </div>

          {/* Simulated Device Viewport */}
          <div 
            className={`transition-all duration-300 mx-auto rounded-3xl overflow-hidden border border-surface-container-high shadow-2xl relative ${
              previewDevice === 'mobile' ? 'max-w-[340px] aspect-[9/18]' : 'w-full aspect-[10/14]'
            } ${
              themeMode === 'light' 
                ? 'bg-[#fbf9f6] text-[#1b1c1a]' 
                : themeMode === 'midnight' 
                ? 'bg-[#060911] text-white' 
                : 'bg-[#0c141f] text-white'
            }`}
          >
            {/* Top Browser Bar */}
            <div className="w-full bg-black/40 backdrop-blur-md px-3 py-1.5 border-b border-white/10 flex items-center justify-between text-[10px] text-white/70">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <span className="font-mono text-[9px] font-bold text-white/90 truncate max-w-[180px]">
                https://{subdomain || currentMerchant.subdomain}
              </span>
              <span className="material-symbols-outlined text-[14px]">lock</span>
            </div>

            {/* Scrollable Storefront Simulation */}
            <div className="w-full h-[calc(100%-2rem)] overflow-y-auto scrollbar-none p-3 space-y-3 text-right">
              {/* 1. Announcement Bar */}
              {showAnnouncementBar && (
                <div 
                  className="py-1 px-2 rounded-lg text-center text-[10px] font-bold text-white truncate shadow-xs"
                  style={{ backgroundColor: accentColor }}
                >
                  {announcement || currentMerchant.announcement}
                </div>
              )}

              {/* 2. Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <img src={logo || currentMerchant.logo} alt="Logo" className="w-7 h-7 rounded-full object-cover border border-white/20" />
                  <div>
                    <span className="text-xs font-bold block leading-tight">{brandName || currentMerchant.name}</span>
                    <span className="text-[9px] opacity-70">{categoryAr || currentMerchant.categoryAr}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">search</span>
                  <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                </div>
              </div>

              {/* 3. Hero Section */}
              {showHeroBanner && (
                <div className={`relative overflow-hidden ${borderRadius} border border-white/10 shadow-md ${
                  heroStyle === 'split_editorial' ? 'p-3 flex flex-col gap-2 bg-white/5' : 'aspect-[16/9]'
                }`}>
                  <img src={banner || currentMerchant.banner} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  <div className="relative z-10 p-3 flex flex-col justify-end h-full text-white">
                    <span className="text-[9px] px-2 py-0.5 rounded-full self-start font-bold mb-1 shadow-xs" style={{ backgroundColor: accentColor }}>
                      كود: {promoCode || currentMerchant.promoCode} (-{discountPct}%)
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold leading-tight font-serif">
                      {heroHeadline}
                    </h3>
                    <p className="text-[9px] text-white/80 line-clamp-1 mt-0.5">
                      {heroSubheadline}
                    </p>
                    <button 
                      className="mt-2 px-3 py-1 rounded-lg text-[10px] font-bold text-white self-start shadow-md"
                      style={{ backgroundColor: accentColor }}
                    >
                      {heroCtaText}
                    </button>
                  </div>
                </div>
              )}

              {/* 4. Trust Badges */}
              {showTrustBadges && (
                <div className="grid grid-cols-2 gap-1.5">
                  {trustBadges.slice(0, 2).map((b) => (
                    <div key={b.id} className="p-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]" style={{ color: accentColor }}>{b.icon}</span>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold block truncate">{b.title}</span>
                        <span className="text-[8px] opacity-70 block truncate">{b.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 5. Products Catalog Preview */}
              {showProductsCatalog && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">المعروضات الحصرية</span>
                    <span className="text-[9px] opacity-70">عرض الكل ({merchantProducts.length})</span>
                  </div>

                  <div className={`grid gap-2 ${productsGridCols === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                    {merchantProducts.slice(0, productsGridCols === 2 ? 2 : 3).map((prod) => (
                      <div key={prod.id} className={`p-1.5 rounded-xl bg-white/5 border border-white/10 ${borderRadius} overflow-hidden`}>
                        <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                          <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                          {showStockBadges && (
                            <span className="absolute top-1 right-1 px-1 py-0.2 rounded text-[7px] bg-black/60 text-white font-bold">
                              باقي {prod.stock}
                            </span>
                          )}
                        </div>
                        <div className="pt-1 text-right">
                          <span className="text-[9px] font-bold block truncate">{prod.title}</span>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[10px] font-bold" style={{ color: accentColor }}>
                              {prod.price} ج.م
                            </span>
                            {showRatings && (
                              <span className="text-[8px] flex items-center gap-0.5 opacity-80">
                                ⭐ {prod.rating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Reels Preview Tag */}
              {showCommunityReels && (
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">play_circle</span>
                    <span className="text-[10px] font-bold">فيديوهات ريلز من المجتمع (4 ريلز)</span>
                  </div>
                  <span className="text-[9px] text-secondary font-bold">شاهد الآن ➔</span>
                </div>
              )}

              {/* 7. Footer / Contact */}
              {showContactSection && (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
                  <span className="text-[10px] font-bold block">استشارة مقاسات وخدمة عملاء</span>
                  <span className="text-[9px] font-mono opacity-80 block">{whatsapp || currentMerchant.whatsapp}</span>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: accentColor }}>
                    تواصل واتساب بنقرة واحدة
                  </div>
                </div>
              )}
            </div>

            {/* Floating WhatsApp Widget */}
            {showWhatsAppFloat && (
              <div className="absolute bottom-4 left-4 z-20 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[18px]">chat</span>
              </div>
            )}
          </div>

          <div className="text-center">
            <span className="text-[11px] text-on-surface-variant">
              💡 أي تعديل هنا يظهر فوراً في المتجر المستقل للزبائن دون تأخير.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
