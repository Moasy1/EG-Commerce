import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SocialProfile() {
  const {
    activeProfile,
    setActiveProfileHandle,
    socialProfiles,
    navigateToStorefront,
    navigateToProfile,
    setActiveTab,
    openQuickBuy,
    openProductDetail,
    products,
    user,
    isAr,
    language
  } = useApp();

  const [activeTabName, setActiveTabName] = useState('reels'); // 'reels' | 'products' | 'saved'
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedVideoModal, setSelectedVideoModal] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isProfileSwitcherOpen, setIsProfileSwitcherOpen] = useState(false);

  // Fallback profile if activeProfile is null
  const currentProfile = activeProfile || (socialProfiles && socialProfiles['talieska']) || {
    id: 'p-talieska',
    handle: '@talieska',
    slug: 'talieska',
    name: 'Talieska Studio • تاليسكا ستوديو',
    verified: true,
    role: 'merchant',
    merchantId: 'm-01',
    avatar: '/images/brands/talieska_logo.jpg',
    category: 'Haute Egyptian Linen & Fashion',
    categoryAr: 'دار أزياء الكتان والتطريز المصري المعاصر',
    bio: '✨ إحياء فخامة الكتان الطبيعي والتطريز اليدوي 100% بأيادٍ مصرية أصيلة بالقاهرة 🇪🇬 | شحن سريع لجميع المحافظات مع بوسطة',
    location: 'القاهرة، مصر • Cairo, Egypt',
    website: 'shop.talieskastudio.com',
    followersCount: '48.2K',
    followingCount: '142',
    productsCount: 12,
    reelsCount: 8
  };

  // Filter products for this merchant or creator
  const profileProducts = (products || []).filter(p => {
    if (currentProfile.role === 'merchant') {
      const matchId = currentProfile.merchantId && p.merchantId === currentProfile.merchantId;
      const matchSlug = currentProfile.slug && (
        p.merchantId?.toLowerCase().includes(currentProfile.slug) ||
        p.merchantSlug?.toLowerCase() === currentProfile.slug ||
        p.merchant?.toLowerCase().includes(currentProfile.slug)
      );
      const matchName = currentProfile.name && p.merchant && (
        p.merchant.toLowerCase().includes(currentProfile.name.toLowerCase().split(' ')[0]) ||
        currentProfile.name.toLowerCase().includes(p.merchant.toLowerCase())
      );
      return matchId || matchSlug || matchName;
    }
    // For creator: show curated or tagged products
    if (currentProfile.role === 'creator') {
      const handleClean = currentProfile.handle?.replace('@', '').toLowerCase();
      if (p.creatorHandle && p.creatorHandle.toLowerCase().includes(handleClean)) return true;
      if (p.creator && p.creator.toLowerCase().includes(handleClean)) return true;
      return true;
    }
    return true;
  });

  // Highlight stories
  const highlights = currentProfile.highlights || [
    { id: 'h1', title: isAr ? 'كولكشن 2026' : 'Summer 26', icon: 'flare', img: '/images/products/linen_abaya.jpg' },
    { id: 'h2', title: isAr ? 'آراء العملاء' : 'Reviews', icon: 'rate_review', img: '/images/reels/fashion_citrine_blazer_thumb.jpg' },
    { id: 'h3', title: isAr ? 'الخامات الطبيعية' : 'Linen Craft', icon: 'dry_cleaning', img: '/images/products/embroidered_blouse.jpg' },
    { id: 'h4', title: isAr ? 'الشحن والتوصيل' : 'Shipping', icon: 'local_shipping', img: '/images/banners/talieska_hero.jpg' }
  ];

  // Comprehensive reels associated with different profiles
  const allMockReels = [
    {
      id: 'pr-1',
      handles: ['@cairo_chic', 'cairo_chic', '@talieska', 'talieska'],
      title: isAr ? 'تنسيق بليزر السيترين الأوفرسايز' : 'Citrine Oversized Blazer Styling',
      views: '62.4K',
      videoUrl: '/images/reels/fashion_citrine_blazer.mp4',
      thumbnail: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      likes: '4.8K',
      comments: '184',
      productName: isAr ? 'بليزر سيترين أوفرسايز' : 'Citrine Blazer',
      productPrice: 2200
    },
    {
      id: 'pr-2',
      handles: ['@salma.styles', 'salma.styles', '@talieska', 'talieska'],
      title: isAr ? 'قميص كتان سماوي للصيف' : 'Sky Blue Linen Summer Shirt',
      views: '45.1K',
      videoUrl: '/images/reels/fashion_oversized_shirt.mp4',
      thumbnail: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      likes: '3.2K',
      comments: '92',
      productName: isAr ? 'قميص كتان سماوي' : 'Blue Linen Shirt',
      productPrice: 950
    },
    {
      id: 'pr-3',
      handles: ['@zeina_ootd', 'zeina_ootd'],
      title: isAr ? 'توب بكتف واحد عاجي ناعم' : 'One Shoulder Bodysuit Lookbook',
      views: '38.9K',
      videoUrl: '/images/reels/fashion_oneshoulder_top.mp4',
      thumbnail: '/images/reels/fashion_oneshoulder_top_thumb.jpg',
      likes: '2.9K',
      comments: '77',
      productName: isAr ? 'توب بكتف واحد عاجي' : 'White Bodysuit',
      productPrice: 680
    },
    {
      id: 'pr-4',
      handles: ['@maya_accessories', 'maya_accessories', 'khan-craft'],
      title: isAr ? 'كولكشن شنط الكتف الكلاسيكية' : 'Structured Leather Bag Swatch',
      views: '48.5K',
      videoUrl: '/images/reels/fashion_shoulder_bags.mp4',
      thumbnail: '/images/reels/fashion_shoulder_bags_thumb.jpg',
      likes: '5.1K',
      comments: '210',
      productName: isAr ? 'حقيبة كتف كلاسيك' : 'Classic Shoulder Bag',
      productPrice: 1850
    },
    {
      id: 'pr-5',
      handles: ['@yasmin_style', 'yasmin_style', 'talieska', '@talieska'],
      title: isAr ? 'إطلالة عباية الكتان المطرزة يدوياً' : 'Hand Embroidered Linen Abaya',
      views: '54.0K',
      videoUrl: '/images/reels/fashion_oversized_shirt.mp4',
      thumbnail: '/images/products/linen_abaya.jpg',
      likes: '6.4K',
      comments: '340',
      productName: isAr ? 'عباية كتان فاخرة' : 'Luxury Linen Abaya',
      productPrice: 2850
    },
    {
      id: 'pr-6',
      handles: ['khan-craft', '@khan.craft.eg', '@farida.atelier', 'farida.atelier'],
      title: isAr ? 'تفاصيل نقش النحاس الأصيل' : 'Artisan Handcrafted Brass Details',
      views: '29.3K',
      videoUrl: '/images/reels/fashion_citrine_blazer.mp4',
      thumbnail: '/images/products/copper_lantern.jpg',
      likes: '2.1K',
      comments: '58',
      productName: isAr ? 'فانوس نحاسي فاطمي' : 'Brass Lantern',
      productPrice: 1450
    },
    {
      id: 'pr-7',
      handles: ['@karim.editorial', 'karim.editorial', 'tiba-jewelry'],
      title: isAr ? 'ساعة كلاسيكية وتنسيق أزياء رجالي' : 'Vintage Watch & Menswear Styling',
      views: '35.7K',
      videoUrl: '/images/reels/fashion_citrine_blazer.mp4',
      thumbnail: '/images/reels/fashion_vintage_watch_thumb.jpg',
      likes: '3.4K',
      comments: '64',
      productName: isAr ? 'ساعة يد عتيقة' : 'Vintage Watch',
      productPrice: 3400
    }
  ];

  // Prioritize reels matching this profile handle/slug, and append other reels for full grid
  const cleanHandle = currentProfile.handle?.replace('@', '').toLowerCase();
  const matchedReels = allMockReels.filter(r => 
    r.handles.includes(currentProfile.handle) || 
    r.handles.includes(currentProfile.slug) ||
    r.handles.includes(cleanHandle)
  );
  const otherReels = allMockReels.filter(r => !matchedReels.some(mr => mr.id === r.id));
  const profileReels = matchedReels.length > 0 ? [...matchedReels, ...otherReels] : allMockReels;

  // Saved / Tagged lookbooks
  const savedLookbooks = [
    {
      id: 'sl-1',
      title: isAr ? 'تنسيق صيف القاهرة • Cairo Chic' : 'Summer in Cairo Lookbook',
      creator: '@cairo_chic',
      image: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      likes: '14.2K'
    },
    {
      id: 'sl-2',
      title: isAr ? 'إطلالة شاطئ الساحل • Yasmin' : 'Sahel Coastal Elegance',
      creator: '@yasmin_style',
      image: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      likes: '9.8K'
    },
    {
      id: 'sl-3',
      title: isAr ? 'طقم المناسبات الفاخر' : 'Luxury Occasion Set',
      creator: '@zeina_ootd',
      image: '/images/reels/fashion_oneshoulder_top_thumb.jpg',
      likes: '11.5K'
    }
  ];

  const handleCopyLink = () => {
    const url = window.location.origin + `/profile/${currentProfile.slug || currentProfile.handle.replace('@', '')}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isOwner = user && (
    user.role === 'superadmin' || 
    user.role === 'admin' ||
    (user.role === 'merchant' && currentProfile.role === 'merchant')
  );

  return (
    <div 
      className="w-full min-h-[calc(100vh-64px)] flex-1 bg-white text-slate-900 flex flex-col font-sans select-none pb-24"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* 1. TOP APP BAR (Instagram Style) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('reels')}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-slate-700 transition-colors"
            title={isAr ? 'العودة للريلز' : 'Back to Reels'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isAr ? 'arrow_forward' : 'arrow_back'}
            </span>
          </button>

          {/* Current Handle + Verified + Switcher Dropdown Toggle */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileSwitcherOpen(!isProfileSwitcherOpen)}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <span className="font-extrabold text-sm md:text-base tracking-tight text-slate-900">
                {currentProfile.handle}
              </span>
              {currentProfile.verified && (
                <span className="material-symbols-outlined text-[16px] text-sky-500 fill-current">
                  verified
                </span>
              )}
              <span className="material-symbols-outlined text-[18px] text-gray-500">
                expand_more
              </span>
            </button>

            {/* Profile Switcher Modal / Dropdown */}
            {isProfileSwitcherOpen && (
              <div 
                className="absolute top-full start-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 text-[11px] font-bold text-gray-400 border-b border-gray-100 flex items-center justify-between">
                  <span>{isAr ? 'تبديل الحساب / استكشاف البروفايلات' : 'Switch Profile'}</span>
                  <button 
                    onClick={() => setIsProfileSwitcherOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
                <div className="py-1 space-y-1 max-h-72 overflow-y-auto">
                  {Object.values(socialProfiles || {}).map((prof) => (
                    <button
                      key={prof.handle}
                      onClick={() => {
                        navigateToProfile(prof.slug || prof.handle);
                        setIsProfileSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-start transition-all ${
                        currentProfile.handle === prof.handle 
                          ? 'bg-red-50 text-[#d00000] font-bold' 
                          : 'hover:bg-gray-50 text-slate-700'
                      }`}
                    >
                      <img 
                        src={prof.avatar} 
                        alt={prof.name} 
                        className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate flex items-center gap-1">
                          <span>{prof.name}</span>
                          {prof.verified && (
                            <span className="material-symbols-outlined text-[12px] text-sky-500 fill-current">
                              verified
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          {prof.handle} • {prof.role === 'merchant' ? (isAr ? 'تاجر' : 'Merchant') : (isAr ? 'صانع محتوى' : 'Creator')}
                        </div>
                      </div>
                      {currentProfile.handle === prof.handle && (
                        <span className="material-symbols-outlined text-[16px] text-[#d00000]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action icons (Notifications, Share, Options) */}
        <div className="flex items-center gap-1">
          <button 
            onClick={handleCopyLink}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-slate-700 transition-colors relative"
            title={isAr ? 'نسخ رابط البروفايل' : 'Copy Profile Link'}
          >
            <span className="material-symbols-outlined text-[19px]">share</span>
            {copiedLink && (
              <span className="absolute -bottom-7 start-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap animate-fade-in z-40">
                {isAr ? 'تم النسخ!' : 'Copied!'}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-slate-700 transition-colors"
            title={isAr ? 'الإعدادات' : 'Settings'}
          >
            <span className="material-symbols-outlined text-[20px]">more_vert</span>
          </button>
        </div>
      </header>

      {/* 2. PROFILE HERO SECTION (Instagram Identity Header) */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-4 pb-2">
        
        {/* Top block: Avatar + Stats Counts */}
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          
          {/* Avatar with luxury gradient story ring */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#d00000] via-amber-500 to-rose-600 shadow-md">
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <img 
                  src={currentProfile.avatar} 
                  alt={currentProfile.name}
                  className="w-full h-full rounded-full object-cover" 
                />
              </div>
            </div>
            {currentProfile.role === 'merchant' && (
              <div 
                className="absolute -bottom-1 -end-1 w-6 h-6 rounded-full bg-[#d00000] text-white flex items-center justify-center shadow-md border-2 border-white"
                title={isAr ? 'متجر معتمد' : 'Verified Merchant'}
              >
                <span className="material-symbols-outlined text-[13px]">storefront</span>
              </div>
            )}
          </div>

          {/* Stats Bar (Reels, Followers, Following, Products) */}
          <div className="flex-1 flex items-center justify-around text-center py-2">
            <div className="flex flex-col cursor-pointer" onClick={() => setActiveTabName('reels')}>
              <span className="text-base sm:text-lg font-black text-slate-900">
                {currentProfile.reelsCount || profileReels.length}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {isAr ? 'ريلز' : 'Reels'}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {currentProfile.followersCount || '48.2K'}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {isAr ? 'متابع' : 'Followers'}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {currentProfile.followingCount || '142'}
              </span>
              <span className="text-[11px] text-gray-500 font-medium">
                {isAr ? 'يتابع' : 'Following'}
              </span>
            </div>

            {currentProfile.role === 'merchant' && (
              <div className="flex flex-col cursor-pointer" onClick={() => setActiveTabName('products')}>
                <span className="text-base sm:text-lg font-black text-[#d00000]">
                  {currentProfile.productsCount || profileProducts.length}
                </span>
                <span className="text-[11px] text-gray-500 font-medium">
                  {isAr ? 'منتج' : 'Products'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bio Details */}
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="font-black text-base text-slate-900">
              {currentProfile.name}
            </h1>
            {currentProfile.verified && (
              <span className="material-symbols-outlined text-[16px] text-sky-500 fill-current">
                verified
              </span>
            )}
          </div>

          {/* Category Tag */}
          <div className="text-[12px] font-semibold text-gray-500">
            {isAr ? currentProfile.categoryAr || currentProfile.category : currentProfile.category}
          </div>

          {/* Bio Text */}
          <p className="text-xs text-slate-700 leading-relaxed max-w-lg">
            {currentProfile.bio}
          </p>

          {/* Location & Website links */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-500 font-medium">
            {currentProfile.location && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-red-500">location_on</span>
                <span>{currentProfile.location}</span>
              </div>
            )}
            {currentProfile.website && (
              <a 
                href={`https://${currentProfile.website}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-1 text-[#d00000] hover:underline font-bold"
              >
                <span className="material-symbols-outlined text-[14px]">link</span>
                <span>{currentProfile.website}</span>
              </a>
            )}
          </div>
        </div>

        {/* 3. PRIMARY ACTION BUTTONS (Follow | Shop Storefront | Contact) */}
        <div className="mt-4 flex items-center gap-2">
          {/* Follow Button */}
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs ${
              isFollowing 
                ? 'bg-gray-100 text-slate-800 hover:bg-gray-200' 
                : 'bg-slate-900 text-white hover:bg-black'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isFollowing ? 'check' : 'person_add'}
            </span>
            <span>{isFollowing ? (isAr ? 'تتابعه ✓' : 'Following') : (isAr ? 'متابعة' : 'Follow')}</span>
          </button>

          {/* SHOP BUTTON — The Central Bridge to Merchant Storefront! */}
          {currentProfile.role === 'merchant' && (
            <button
              onClick={() => navigateToStorefront(currentProfile.merchantId || currentProfile.slug)}
              className="flex-1 py-2 px-4 rounded-xl bg-[#d00000] hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              title={isAr ? 'زيارة المتجر المستقل للبراند' : 'Visit Merchant Storefront'}
            >
              <span className="material-symbols-outlined text-[16px]">storefront</span>
              <span>{isAr ? 'تسوق المتجر (Shop)' : 'Shop Storefront'}</span>
            </button>
          )}

          {/* Contact / Message Button */}
          <a
            href="https://wa.me/201002345678"
            target="_blank"
            rel="noreferrer"
            className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
            title={isAr ? 'محادثة عبر الواتساب' : 'Chat via WhatsApp'}
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span className="hidden sm:inline">{isAr ? 'تواصل' : 'Message'}</span>
          </a>
        </div>

        {/* 4. MERCHANT MANAGEMENT BAR (Visible only to authorized store manager / admin) */}
        {isOwner && currentProfile.role === 'merchant' && (
          <div className="mt-3 p-2.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-2 text-xs shadow-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-[11px]">
                {isAr ? 'أنت صاحب هذا الحساب التجاري' : 'You own this Merchant Profile'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">dashboard</span>
                <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
              </button>
              <button
                onClick={() => navigateToStorefront(currentProfile.merchantId)}
                className="px-3 py-1 rounded-lg bg-[#d00000] hover:bg-red-600 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">brush</span>
                <span>{isAr ? 'تخصيص المتجر' : 'Storefront'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. STORY HIGHLIGHTS (Instagram Style) */}
        <div className="mt-4 flex items-center gap-4 overflow-x-auto no-scrollbar py-2">
          {highlights.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
              onClick={() => setActiveTabName('reels')}
            >
              <div className="w-14 h-14 rounded-full p-[2px] border-2 border-gray-200 group-hover:border-[#d00000] transition-colors">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <span className="text-[10px] font-medium text-slate-700 tracking-tight text-center max-w-[64px] truncate">
                {item.title}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* 6. CONTENT TABS (Reels | Products | Saved) */}
      <div className="w-full border-t border-b border-gray-100 bg-white sticky top-[49px] z-20">
        <div className="max-w-2xl mx-auto flex items-center">
          
          {/* Tab 1: Reels */}
          <button
            onClick={() => setActiveTabName('reels')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all relative ${
              activeTabName === 'reels' ? 'text-[#d00000]' : 'text-gray-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">smart_display</span>
            <span className="hidden sm:inline">{isAr ? 'ريلز الفيديوهات' : 'Reels'}</span>
            {activeTabName === 'reels' && (
              <span className="absolute bottom-0 inset-x-8 h-0.5 bg-[#d00000] rounded-full" />
            )}
          </button>

          {/* Tab 2: Products */}
          <button
            onClick={() => setActiveTabName('products')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all relative ${
              activeTabName === 'products' ? 'text-[#d00000]' : 'text-gray-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span className="hidden sm:inline">{isAr ? 'المنتجات المعروضة' : 'Products'}</span>
            {activeTabName === 'products' && (
              <span className="absolute bottom-0 inset-x-8 h-0.5 bg-[#d00000] rounded-full" />
            )}
          </button>

          {/* Tab 3: Saved / Lookbook */}
          <button
            onClick={() => setActiveTabName('saved')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-all relative ${
              activeTabName === 'saved' ? 'text-[#d00000]' : 'text-gray-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">bookmark</span>
            <span className="hidden sm:inline">{isAr ? 'المحفوظات والتاجز' : 'Saved & Tagged'}</span>
            {activeTabName === 'saved' && (
              <span className="absolute bottom-0 inset-x-8 h-0.5 bg-[#d00000] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* 7. TAB CONTENT SECTIONS */}
      <div className="max-w-2xl mx-auto w-full p-2 sm:p-4 flex-1">
        
        {/* TAB 1: REELS GRID (Instagram 3-Column 9:16 Video Layout) */}
        {activeTabName === 'reels' && (
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {profileReels.map((reel) => (
              <div 
                key={reel.id}
                onClick={() => setSelectedVideoModal(reel)}
                className="relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 group cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <img 
                  src={reel.thumbnail} 
                  alt={reel.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Views Counter badge */}
                <div className="absolute bottom-2 start-2 flex items-center gap-1 text-white text-[11px] font-bold drop-shadow">
                  <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                  <span>{reel.views}</span>
                </div>

                {/* Top Reel Icon */}
                <div className="absolute top-2 end-2 text-white/80">
                  <span className="material-symbols-outlined text-[16px]">smart_display</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG (Commerce Showcase with direct Shop connection) */}
        {activeTabName === 'products' && (
          <div className="space-y-4">
            
            {/* Storefront Connection Hero Pill */}
            {currentProfile.role === 'merchant' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#d00000] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[22px]">storefront</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {isAr ? 'واجهة المتجر الرسمية المستقلة' : 'Official Branded Storefront'}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {isAr ? 'تسوق الكتالوج الكامل، الكولكشنات، وتفاصيل الشحن والاستبدال' : 'Browse full catalog, size guides, and policy terms'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigateToStorefront(currentProfile.merchantId || currentProfile.slug)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold shrink-0 shadow-xs transition-colors flex items-center gap-1"
                >
                  <span>{isAr ? 'زيارة المتجر' : 'Visit Shop'}</span>
                  <span className="material-symbols-outlined text-[14px]">
                    {isAr ? 'arrow_back' : 'arrow_forward'}
                  </span>
                </button>
              </div>
            )}

            {/* Product Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {profileProducts.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-white border border-gray-100 rounded-2xl p-2.5 flex flex-col hover:shadow-md transition-shadow group relative"
                >
                  {/* Image with zoom */}
                  <div 
                    onClick={() => openProductDetail(prod)}
                    className="w-full aspect-square rounded-xl overflow-hidden mb-2 bg-gray-50 cursor-pointer relative"
                  >
                    <img 
                      src={prod.image} 
                      alt={prod.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    {prod.badge && (
                      <span className="absolute top-2 start-2 bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <h3 
                    onClick={() => openProductDetail(prod)}
                    className="font-bold text-xs text-slate-900 line-clamp-1 hover:text-[#d00000] cursor-pointer"
                  >
                    {prod.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xs font-extrabold text-[#d00000]">
                      {prod.price} ج.م
                    </span>
                    {prod.originalPrice && (
                      <span className="text-[10px] text-gray-400 line-through">
                        {prod.originalPrice} ج.م
                      </span>
                    )}
                  </div>

                  {/* Action Button: Quick Buy */}
                  <button
                    onClick={() => openQuickBuy(prod)}
                    className="mt-2 w-full py-1.5 rounded-xl bg-slate-900 hover:bg-[#d00000] text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">shopping_cart</span>
                    <span>{isAr ? 'شراء سريع' : 'Quick Buy'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SAVED LOOKBOOKS & TAGGED CREATORS */}
        {activeTabName === 'saved' && (
          <div className="space-y-4">
            <div className="text-xs text-gray-500 font-medium px-1">
              {isAr ? 'إطلالات المبدعين والمحتوى المنشور بالتعاون مع هذه العلامة التجارية:' : 'Creator collaborations and tagged lookbooks:'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {savedLookbooks.map((lb) => (
                <div 
                  key={lb.id}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center gap-3 hover:bg-white hover:shadow-sm transition-all"
                >
                  <img 
                    src={lb.image} 
                    alt={lb.title} 
                    className="w-16 h-16 rounded-xl object-cover" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{lb.title}</h4>
                    <span className="text-[11px] font-mono text-[#d00000] font-bold">{lb.creator}</span>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                      <span className="material-symbols-outlined text-[13px] text-rose-500">favorite</span>
                      <span>{lb.likes} تفاعل</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-center space-y-2">
              <span className="material-symbols-outlined text-[28px] text-purple-600">movie_edit</span>
              <h5 className="text-xs font-bold text-slate-800">
                {isAr ? 'هل أنت صانع محتوى وترغب في تمثيل البراند؟' : 'Are you a fashion creator?'}
              </h5>
              <p className="text-[11px] text-gray-500 max-w-sm mx-auto">
                {isAr ? 'انضم إلى برنامج التسويق بالعمولة (UGC Affiliate) واحصل على عينات مجانية ونسبة من كل عملية بيع.' : 'Join our creator affiliate program and earn commissions on every tagged reel.'}
              </p>
              <button
                onClick={() => setActiveTab('studio')}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-sm transition-all"
              >
                {isAr ? 'تقديم طلب صانع محتوى' : 'Apply to Creator Studio'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 8. VIDEO REEL PREVIEW MODAL */}
      {selectedVideoModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedVideoModal(null)}
        >
          <div 
            className="relative w-full max-w-sm bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close modal */}
            <button 
              onClick={() => setSelectedVideoModal(null)}
              className="absolute top-3 end-3 z-30 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            {/* Video Player */}
            <div className="relative aspect-[9/16] bg-black">
              <video 
                src={selectedVideoModal.videoUrl} 
                poster={selectedVideoModal.thumbnail}
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Bar inside Modal: Tagged Product & Shop */}
            <div className="p-3 bg-slate-900 border-t border-white/10 flex items-center justify-between gap-3 text-white">
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{selectedVideoModal.productName}</div>
                <div className="text-[11px] text-red-400 font-bold">{selectedVideoModal.productPrice} ج.م</div>
              </div>
              <button
                onClick={() => {
                  setSelectedVideoModal(null);
                  navigateToStorefront(currentProfile.merchantId || currentProfile.slug);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm shrink-0"
              >
                <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
                <span>{isAr ? 'تسوق القطعة' : 'Shop Item'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
