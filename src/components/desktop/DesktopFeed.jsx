import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function DesktopFeed() {
  const { 
    products: appProducts, 
    setActiveTab, 
    setSelectedProduct, 
    openQuickBuy, 
    language 
  } = useApp();

  const isAr = language === 'ar';
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Default Egyptian fashion creators metadata
  const creatorProfiles = [
    { name: 'سارة المهدي • Sara El Mahdy', location: 'القاهرة • صانعة محتوى', avatar: '/images/reels/reel_2.jpg' },
    { name: 'نور عادل • Nour Adel', location: 'الإسكندرية • أزياء', avatar: '/images/reels/reel_1.jpg' },
    { name: 'مايا حسن • Maya Hassan', location: 'القاهرة • ستايلست', avatar: '/images/products/silk_dress.jpg' },
    { name: 'عمر فتحي • Omar Fathy', location: 'الجيزة • موديل', avatar: '/images/products/wool_blazer.jpg' },
  ];

  // Dynamic Feed cards derived from real AppContext products
  const dynamicCards = useMemo(() => {
    return appProducts.map((prod, idx) => {
      const creator = creatorProfiles[idx % creatorProfiles.length];
      return {
        ...prod,
        creator: creator.name,
        location: creator.location,
        avatar: creator.avatar,
        views: `${(12 + idx * 3.7).toFixed(1)}K`,
        badge: idx === 0 ? 'Trending' : idx === 1 ? 'New' : idx === 2 ? 'Top Seller' : 'For Men',
        tags: ['#Egyptian', '#ModestFashion', '#Cairo']
      };
    });
  }, [appProducts]);

  // Filtered Cards based on category & search
  const filteredCards = useMemo(() => {
    return dynamicCards.filter((card) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!card.title.toLowerCase().includes(q) && !card.creator.toLowerCase().includes(q)) {
          return false;
        }
      }

      if (activeCategory === 'All') return true;
      const catLower = (card.category || '').toLowerCase();
      if (activeCategory === 'Dresses' && (catLower.includes('dress') || catLower.includes('فستان'))) return true;
      if (activeCategory === 'Tops' && (catLower.includes('top') || catLower.includes('shirt') || catLower.includes('قميص') || catLower.includes('بلوز'))) return true;
      if (activeCategory === 'Abayas' && (catLower.includes('abaya') || catLower.includes('galabeya') || catLower.includes('عباي') || catLower.includes('جلابي'))) return true;
      if (activeCategory === 'Men' && (catLower.includes('men') || catLower.includes('رجال'))) return true;
      if (activeCategory === 'Accessories' && (catLower.includes('accessor') || catLower.includes('تحف') || catLower.includes('كليم') || catLower.includes('craft'))) return true;

      return false;
    });
  }, [dynamicCards, activeCategory, searchQuery]);

  const handleCardClick = (prod) => {
    setSelectedProduct(prod);
    setActiveTab('product');
  };

  return (
    <div className="w-full bg-white text-slate-900 flex font-sans min-h-[580px] overflow-hidden select-none" dir={isAr ? 'rtl' : 'ltr'}>
      {/* 1. Left / Right Sidebar Navigation */}
      <aside className="w-48 bg-gray-50/80 border-e border-gray-200/80 p-3 flex flex-col justify-between shrink-0 text-start">
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
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#d00000] text-white font-bold shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">home</span>
              <span>{isAr ? 'الرئيسية' : 'Home'}</span>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">explore</span>
              <span>{isAr ? 'استكشف' : 'Explore'}</span>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">category</span>
              <span>{isAr ? 'التصنيفات' : 'Categories'}</span>
            </button>

            <button
              onClick={() => setActiveTab('add_product')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#d00000] bg-red-50 hover:bg-red-100 transition-colors font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">add_circle</span>
              <span>{isAr ? 'إضافة منتج' : 'Add Product'}</span>
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">shopping_cart</span>
              <span>{isAr ? 'السلة' : 'Cart'}</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors cursor-pointer"
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
            {isAr ? 'مبدعون مصريون • قصص حقيقية' : 'Egyptian Creators • Real Stories'}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث عن إطلالات، مصممين، علامات تجارية..." : "Search for outfits, creators, brands..."}
              className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-gray-600">
            <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">favorite</span></button>
            <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">chat</span></button>
            <button onClick={() => setActiveTab('cart')} className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">shopping_cart</span></button>
            <img src="/images/reels/reel_2.jpg" alt="User" className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-300" />
          </div>
        </div>

        {/* Hero Banner Area */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-gray-100 text-start">
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              {isAr ? "اكتشف الموضة التي ستعشقها" : "Discover Fashion You'll Love"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isAr ? "فيديوهات قصيرة. أناس حقيقيون. أسلوب مصري أصيل قابل للشراء." : "Short videos. Real people. Authentic shoppable Egyptian style."}
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('shop')} 
            className="text-xs font-bold text-[#d00000] hover:underline cursor-pointer"
          >
            {isAr ? 'عرض الكل' : 'See All'}
          </button>
        </div>

        {/* Category Pills Bar */}
        <div className="px-5 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-gray-50">
          {[
            { id: 'All', labelAr: 'الكل', labelEn: 'All' },
            { id: 'Dresses', labelAr: 'فساتين', labelEn: 'Dresses' },
            { id: 'Tops', labelAr: 'بلوزات وقمصان', labelEn: 'Tops & Shirts' },
            { id: 'Abayas', labelAr: 'عبايات وجلابيات', labelEn: 'Abayas & Galabeyas' },
            { id: 'Men', labelAr: 'رجالي', labelEn: 'Men' },
            { id: 'Accessories', labelAr: 'إكسسوارات', labelEn: 'Accessories' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#d00000] text-white shadow-xs font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </div>

        {/* 4 Video Cards Grid (Matching Image 1 Desktop) */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 overflow-y-auto">
          {filteredCards.slice(0, 4).map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className="group rounded-2xl overflow-hidden relative border border-gray-200 shadow-xs bg-slate-900 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all duration-300 min-h-[380px]"
            >
              {/* Video Backdrop Image */}
              <div className="absolute inset-0 w-full h-full">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/40" />
              </div>

              {/* Top Card Badges */}
              <div className="relative z-10 p-3 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#d00000] text-white text-[9px] font-bold shadow-xs">
                  {card.badge}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">visibility</span>
                  <span>{card.views}</span>
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 p-3 space-y-2 text-white text-start">
                <div className="flex items-center gap-2">
                  <img src={card.avatar} alt={card.creator} className="w-7 h-7 rounded-full object-cover ring-1 ring-white/60" />
                  <div className="truncate">
                    <h4 className="text-xs font-bold truncate leading-tight">{card.title}</h4>
                    <p className="text-[10px] text-gray-300 truncate">{card.creator}</p>
                  </div>
                </div>

                {/* Shop Now & Price Pill */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuickBuy(card);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-[#d00000] text-white text-xs font-bold flex items-center justify-center gap-1 hover:brightness-110 shadow-xs cursor-pointer"
                  >
                    <span>{isAr ? 'تسوق الآن' : 'Shop Now'}</span>
                  </button>
                  <span className="px-2.5 py-1.5 rounded-xl bg-white/25 backdrop-blur-md text-white font-black text-xs">
                    EGP {card.price.toLocaleString()}
                  </span>
                </div>

                {/* Hashtags */}
                <div className="flex items-center gap-1.5 text-[9px] text-gray-300 truncate">
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
