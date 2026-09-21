import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';
import NotificationCenter from '../common/NotificationCenter';

export default function DesktopFeed() {
  const { 
    setActiveTab, 
    openProductDetail, 
    openQuickBuy, 
    language, 
    navigateToProfile,
    user,
    unreadNotifications,
    refreshNotificationCount
  } = useApp();
  const [activeCategory, setActiveCategory] = useState(language === 'ar' ? 'الكل' : 'All');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifBtnRef = useRef(null);

  const isAr = language === 'ar';

  const videoCards = isAr ? [
    {
      id: 'p-fashion-blazer',
      creator: 'سارة المهدي (@cairo_chic)',
      location: 'القاهرة • صانعة محتوى أزياء',
      avatar: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      image: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      views: '34.2K',
      badge: 'تريند',
      price: 1850,
      tags: ['#بليزر', '#موضة_القاهرة', '#أصفر_سترين']
    },
    {
      id: 'p-fashion-oversized-shirt',
      creator: 'سلمى ستايل (@salma.styles)',
      location: 'الإسكندرية • أزياء يومية',
      avatar: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      image: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      views: '28.9K',
      badge: 'جديد',
      price: 980,
      tags: ['#قميص_كتان', '#أزياء_صيفية', '#أوفرسايز']
    },
    {
      id: 'p-fashion-vintage-watch',
      creator: 'كريم إديتوريال (@karim.editorial)',
      location: 'القاهرة • إكسسوارات راقية',
      avatar: '/images/reels/fashion_vintage_watch_thumb.jpg',
      image: '/images/reels/fashion_vintage_watch_thumb.jpg',
      views: '41.5K',
      badge: 'الأكثر مبيعاً',
      price: 2400,
      tags: ['#ساعات', '#ذهب_وردي', '#أناقة_كلاسيكية']
    },
    {
      id: 'p-fashion-shoulder-bags',
      creator: 'مايا أكسسوريز (@maya_accessories)',
      location: 'الجيزة • حقائب جلدية',
      avatar: '/images/reels/fashion_shoulder_bags_thumb.jpg',
      image: '/images/reels/fashion_shoulder_bags_thumb.jpg',
      views: '19.8K',
      badge: 'حقائب',
      price: 1250,
      tags: ['#حقائب_جلدية', '#ألوان_الباستيل', '#ستايل']
    }
  ] : [
    {
      id: 'p-fashion-blazer',
      creator: 'Cairo Chic (@cairo_chic)',
      location: 'Cairo · Fashion Creator',
      avatar: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      image: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      views: '34.2K',
      badge: 'Trending',
      price: 1850,
      tags: ['#Blazer', '#CairoFashion', '#Citrine']
    },
    {
      id: 'p-fashion-oversized-shirt',
      creator: 'Salma Styles (@salma.styles)',
      location: 'Alexandria · Creator',
      avatar: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      image: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      views: '28.9K',
      badge: 'New',
      price: 980,
      tags: ['#LinenShirt', '#Oversized', '#SummerVibes']
    },
    {
      id: 'p-fashion-vintage-watch',
      creator: 'Karim Editorial (@karim.editorial)',
      location: 'Cairo · Luxury & Editorial',
      avatar: '/images/reels/fashion_vintage_watch_thumb.jpg',
      image: '/images/reels/fashion_vintage_watch_thumb.jpg',
      views: '41.5K',
      badge: 'Top Seller',
      price: 2400,
      tags: ['#VintageWatch', '#RoseGold', '#Classic']
    },
    {
      id: 'p-fashion-shoulder-bags',
      creator: 'Maya Accessories (@maya_accessories)',
      location: 'Giza · Handcrafted Leather',
      avatar: '/images/reels/fashion_shoulder_bags_thumb.jpg',
      image: '/images/reels/fashion_shoulder_bags_thumb.jpg',
      views: '19.8K',
      badge: 'Leather Goods',
      price: 1250,
      tags: ['#ShoulderBag', '#Leather', '#PastelPalette']
    }
  ];

  const categories = isAr
    ? ['الكل', 'فساتين', 'بلوزات', 'عبايات وجلابيات', 'رجالي', 'إكسسوارات']
    : ['All', 'Dresses', 'Tops', 'Abayas', 'Men', 'Accessories'];

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className={`w-full bg-white text-slate-900 flex font-sans min-h-[580px] overflow-hidden select-none ${
        isAr ? 'text-right' : 'text-left'
      }`}
    >
      {/* 1. Sidebar Navigation */}
      <aside className={`w-48 bg-gray-50/80 p-3 flex flex-col justify-between shrink-0 ${
        isAr ? 'border-l border-gray-200/80' : 'border-r border-gray-200/80'
      }`}>
        <div className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-6 h-6" color="#d00000" />
            <span className="font-black text-xs tracking-tight text-slate-900">EG-Commerce</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('reels')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#d00000] text-white font-bold shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px]">home</span>
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">explore</span>
              <span>{isAr ? 'استكشف' : 'Explore'}</span>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">category</span>
              <span>{isAr ? 'التصنيفات' : 'Categories'}</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">people</span>
              <span>{isAr ? 'المتابعة' : 'Following'}</span>
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">shopping_cart</span>
              <span>{isAr ? 'السلة' : 'Cart'}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">person</span>
              <span>{isAr ? 'الملف الشخصي' : 'Profile'}</span>
            </button>
          </nav>
        </div>

        {/* Bottom Pyramid Graphic Card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#d00000]/10 via-amber-500/10 to-orange-500/10 border border-[#d00000]/20 p-3 text-center space-y-1">
          <div className="text-lg">🏛️</div>
          <h5 className="text-[11px] font-bold text-slate-900 leading-tight">
            {isAr ? 'أزياء مصرية أصيلة' : 'Egyptian Fashion'}
          </h5>
          <p className="text-[9px] text-gray-500 leading-tight">
            {isAr ? 'مصممون مصريون • قصص حقيقية' : 'Egyptian Creators • Real Stories'}
          </p>
        </div>
      </aside>

      {/* 2. Main Feed Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Desktop Search Bar */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 bg-gray-100/90 rounded-full text-xs text-gray-500">
            <span className="material-symbols-outlined text-[17px] text-gray-400">search</span>
            <input
              type="text"
              placeholder={isAr ? "ابحث عن أزياء، تصاميم، صناع محتوى..." : "Search for outfits, creators, brands..."}
              className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
            />
          </div>

          {/* Quick Header Icons */}
          <div className="flex items-center gap-2 text-gray-600">
            {/* Notification Center Trigger */}
            <div className="relative">
              <button 
                ref={notifBtnRef}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-1.5 rounded-full hover:bg-gray-100 hover:text-slate-900 relative transition-colors"
                title={isAr ? 'مركز الإشعارات' : 'Notification Center'}
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-0.5 rounded-full bg-[#d00000] text-white text-[9px] font-bold flex items-center justify-center animate-pulse leading-none">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              <NotificationCenter
                isOpen={isNotifOpen}
                onClose={() => {
                  setIsNotifOpen(false);
                  refreshNotificationCount();
                }}
                anchorRef={notifBtnRef}
              />
            </div>

            <button onClick={() => setActiveTab('shop')} className="p-1.5 rounded-full hover:bg-gray-100 hover:text-[#d00000] transition-colors"><span className="material-symbols-outlined text-[19px]">favorite</span></button>
            <button onClick={() => setActiveTab('cart')} className="p-1.5 rounded-full hover:bg-gray-100 hover:text-[#d00000] transition-colors"><span className="material-symbols-outlined text-[19px]">shopping_cart</span></button>
            <div onClick={() => setActiveTab('profile')} className="cursor-pointer">
              <img src={user?.avatar_url || user?.profile?.avatar_url || "/images/reels/reel_2.jpg"} alt="User" className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-300 hover:ring-[#d00000] transition-all" />
            </div>
          </div>
        </div>

        {/* Feed Header Section */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isAr ? 'اكتشف الموضة التي تحبها' : "Discover Fashion You'll Love"}
            </h2>
            <p className="text-[11px] text-gray-500">
              {isAr ? 'فيديوهات قصيرة. أشخاص حقيقيون. أسلوب مصري أصيل.' : 'Short videos. Real people. Authentic Egyptian style.'}
            </p>
          </div>
          <button onClick={() => setActiveTab('shop')} className="text-xs font-bold text-[#d00000] hover:underline">
            {isAr ? 'عرض الكل' : 'See All'}
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 py-1.5 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#d00000] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4-Card Video Grid (Matching Image 3) */}
        <div className="p-5 grid grid-cols-4 gap-3.5 flex-1 items-stretch">
          {videoCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setActiveTab('product')}
              className="group rounded-2xl overflow-hidden relative border border-gray-200 shadow-sm bg-slate-900 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300"
            >
              {/* Video Backdrop Image */}
              <div className="absolute inset-0 w-full h-full">
                <img src={card.image} alt={card.creator} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40" />
              </div>

              {/* Top Card Badges */}
              <div className="relative z-10 p-2.5 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#d00000] text-white text-[9px] font-bold shadow-xs">
                  {card.badge}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-medium flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[11px]">visibility</span>
                  <span>{card.views}</span>
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 p-2.5 space-y-1.5 text-white">
                <div 
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    const handle = card.creator?.includes('@') 
                      ? card.creator.split('@')[1]?.replace(')', '').trim() 
                      : 'drip-fit';
                    navigateToProfile(handle);
                  }}
                >
                  <img src={card.avatar} alt={card.creator} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/60" />
                  <div className="truncate">
                    <h4 className="text-[11px] font-bold truncate leading-tight">{card.creator}</h4>
                    <p className="text-[9px] text-gray-300 truncate">{card.location}</p>
                  </div>
                </div>

                {/* Shop Now & Price Pill */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuickBuy({ id: card.id, title: card.creator + (isAr ? ' أزياء' : ' Outfit'), price: card.price, image: card.image });
                    }}
                    className="flex-1 py-1 rounded-lg bg-[#d00000] text-white text-[10px] font-bold flex items-center justify-center gap-1 hover:brightness-110 shadow-xs"
                  >
                    <span>{isAr ? 'تسوق الآن' : 'Shop Now'}</span>
                  </button>
                  <span className="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white font-bold text-[10px]">
                    {card.price} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>

                {/* Hashtags */}
                <div className="flex items-center gap-1 text-[8px] text-gray-300 truncate">
                  {card.tags.map((t, idx) => <span key={idx}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
