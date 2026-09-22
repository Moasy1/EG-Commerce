import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import DesktopMarketplace from '../components/desktop/DesktopMarketplace';
import { CATEGORIES_DATA } from '../services/ProductService';

export default function Marketplace() {
  const { 
    products: contextProducts, 
    merchants,
    creators,
    openProductDetail, 
    totalCartCount, 
    setActiveTab, 
    addToCart,
    openCategoryPage,
    navigateToProfile,
    language
  } = useApp();
  
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories corresponding to the exact cards in mobile
  const categories = CATEGORIES_DATA;

  // Fallback products if context not ready
  const fallbackProducts = [
    {
      id: '11111111-d001-4000-8000-000000000001',
      sku: 'DF-SHARP-V-YEL',
      title: 'The Sharp V Yellow Oversized T-Shirt • تيشرت شارب في أصفر أوفرسايز',
      price: 680,
      originalPrice: 850,
      image: '/images/products/the_sharp_v_yellow_1.webp',
      video: '/images/reels/the_sharp_v_yellow_reel.mp4',
      category: 'Streetwear',
      rating: 5.0,
      reviewsCount: 18,
      merchantId: '171842bd-daed-40ef-853f-917eab2ed437',
      merchant: 'Drip Fit • دريب فيت',
      merchantSlug: 'drip-fit'
    }
  ];

  const rawProducts = (contextProducts && contextProducts.length > 0) ? contextProducts : fallbackProducts;
  
  // Filter products by search query if typed
  const featuredProducts = searchQuery.trim()
    ? rawProducts.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rawProducts;

  // Dynamic Stores & Brands in Real Time
  const topStores = (merchants && merchants.length > 0 ? merchants : [
    { 
      id: '171842bd-daed-40ef-853f-917eab2ed437', 
      name: 'Drip Fit • دريب فيت', 
      slug: 'drip-fit', 
      handle: 'drip_fit', 
      logo: '/images/brands/dripfit_logo.png' 
    }
  ]).map(store => ({
    id: store.id,
    name: store.shortName || store.name?.split('•')[0]?.trim() || store.name,
    slug: store.slug || 'drip-fit',
    handle: store.handle ? store.handle.replace(/^@/, '') : (store.slug || 'drip-fit'),
    image: store.logo || store.avatar || '/images/brands/dripfit_logo.png'
  }));

  // Dynamic Creators in Real Time
  const featuredCreators = (creators && creators.length > 0 ? creators : [
    { id: 'c-1', handle: 'cairo_chic', name: 'Cairo Chic', avatar: '/images/reels/fashion_citrine_blazer_thumb.jpg' },
    { id: 'c-2', handle: 'salma.styles', name: 'Salma Styles', avatar: '/images/reels/fashion_oversized_shirt_thumb.jpg' },
    { id: 'c-3', handle: 'yasmin_style', name: 'Yasmin Sayed', avatar: '/images/reels/reel_2.jpg' },
    { id: 'c-4', handle: 'zeina_ootd', name: 'Zeina OOTD', avatar: '/images/reels/fashion_oneshoulder_top_thumb.jpg' },
    { id: 'c-5', handle: 'karim.editorial', name: 'Karim Editorial', avatar: '/images/reels/fashion_vintage_watch_thumb.jpg' },
    { id: 'c-6', handle: 'maya_accessories', name: 'Maya Accessories', avatar: '/images/reels/fashion_shoulder_bags_thumb.jpg' },
  ]).map(c => ({
    id: c.id,
    handle: c.handle ? c.handle.replace(/^@/, '') : (c.slug || c.name?.toLowerCase().replace(/\s+/g, '_')),
    name: c.name,
    avatar: c.avatar || c.avatar_url || '/images/reels/reel_2.jpg'
  }));

  return (
    <div className="w-full flex-1 relative">
      {/* 1. DESKTOP VIEW (Screen 2: Explore Marketplace with full filters & 4-col grid) */}
      <div className="hidden md:block w-full max-w-[1780px] mx-auto px-4 md:px-8 py-6">
        <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm">
          <DesktopMarketplace />
        </div>
      </div>

      {/* 2. MOBILE VIEW (Screen 2: Search & Discovery) */}
      <div className="md:hidden w-full min-h-[calc(100vh-64px)] bg-[#fcfbfa] text-slate-900 pb-24 font-sans select-none max-w-[430px] mx-auto pt-2">

        {/* Search Bar with Camera Visual Search */}
        <div className="px-4 py-2">
          <div className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-100 rounded-2xl border border-gray-200/70 focus-within:border-[#d00000] transition-colors">
            <div className="flex items-center gap-2.5 flex-1">
              <span className="material-symbols-outlined text-[18px] text-gray-400">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search outfits, linen, abayas, brands..."
                className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400 font-medium"
              />
            </div>
            <span className="material-symbols-outlined text-[18px] text-gray-400 cursor-pointer hover:text-slate-700">photo_camera</span>
          </div>
        </div>

        {/* Top Stores Horizontal Scroll */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">Featured Stores</h3>
          <span className="text-xs font-bold text-[#d00000] cursor-pointer">All</span>
        </div>
        <div className="px-4 pb-2 overflow-x-auto no-scrollbar flex items-center gap-4">
          {topStores.map(store => (
            <div 
              key={store.id} 
              onClick={() => navigateToProfile(store.slug || store.handle || store.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-gray-100 group-hover:ring-[#d00000]/50 transition-all">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold text-slate-700">{store.name}</span>
            </div>
          ))}
        </div>

        {/* Category Visual Cards Header */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">{isAr ? 'تصفح حسب التصنيف' : 'Shop by Category'}</h3>
          <span 
            onClick={() => openCategoryPage(categories[0])} 
            className="text-xs font-bold text-[#d00000] cursor-pointer hover:underline"
          >
            {isAr ? 'عرض الكل' : 'View All'}
          </span>
        </div>

        {/* Category Visual Cards (6-grid on mobile, opens dedicated dynamic category page) */}
        <div className="px-4 py-1 mt-1">
          <div className="grid grid-cols-3 gap-2.5">
            {categories.slice(0, 6).map((cat) => (
              <div
                key={cat.id}
                onClick={() => openCategoryPage(cat)}
                className={`h-28 rounded-2xl relative overflow-hidden cursor-pointer shadow-xs active:scale-95 transition-all flex flex-col justify-end p-2.5 group ${
                  cat.isRedCard ? 'bg-[#d00000] text-white hover:brightness-105' : 'bg-gray-900 text-white'
                }`}
              >
                {!cat.isRedCard && (
                  <>
                    <img 
                      src={cat.image} 
                      alt={cat.label} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  </>
                )}
                <div className="relative z-10 text-start">
                  {cat.isRedCard ? (
                    <span className="material-symbols-outlined text-[20px] mb-1 text-white">local_fire_department</span>
                  ) : (
                    <span className="material-symbols-outlined text-[15px] mb-0.5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_forward
                    </span>
                  )}
                  <span className="text-[11px] font-black leading-tight block drop-shadow-sm">
                    {isAr ? (cat.labelAr || cat.label) : cat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Extra category pills if more than 6 categories exist */}
          {categories.length > 6 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2.5">
              {categories.slice(6).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => openCategoryPage(cat)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-slate-800 text-[11px] font-bold shrink-0 hover:border-[#d00000] hover:text-[#d00000] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#d00000]">{cat.icon || 'sell'}</span>
                  <span>{isAr ? (cat.labelAr || cat.label) : cat.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Creators Horizontal Scroll */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">Trending Creators</h3>
          <span className="text-xs font-bold text-[#d00000] cursor-pointer">Discover</span>
        </div>
        <div className="px-4 pb-4 overflow-x-auto no-scrollbar flex items-center gap-3">
          {featuredCreators.map(creator => (
            <div 
              key={creator.id} 
              onClick={() => navigateToProfile(creator.handle)}
              className="w-28 p-2 rounded-xl border border-gray-200/80 bg-white shadow-xs shrink-0 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 mb-2">
                <img src={creator.avatar} alt={creator.handle} className="w-full h-full object-cover" />
              </div>
              <span className="text-[11px] font-bold text-slate-900 line-clamp-1 truncate w-full text-center">@{creator.handle}</span>
              <button className="mt-2 w-full py-1 rounded bg-gray-100 text-slate-700 text-[10px] font-bold hover:bg-gray-200">
                Follow
              </button>
            </div>
          ))}
        </div>

        {/* Featured Products Header */}
        <div className="px-4 pt-1 pb-2 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">Featured Egyptian Products</h3>
          <span className="text-xs font-bold text-[#d00000] cursor-pointer">View All</span>
        </div>

        {/* 2-Column Product Grid */}
        <div className="px-4 grid grid-cols-2 gap-3">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                openProductDetail(product);
                setActiveTab('product');
              }}
              className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                {product.video && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1 shadow-md border border-white/20">
                    <span className="material-symbols-outlined text-[12px] text-[#ff3b5c]">play_arrow</span>
                    <span>Reel</span>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1);
                  }}
                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-md text-slate-800 flex items-center justify-center hover:bg-[#d00000] hover:text-white transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                </button>
              </div>

              <div className="p-2.5 text-start space-y-1">
                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                  <span className="material-symbols-outlined text-[12px]">star</span>
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 leading-tight">{product.title}</h4>
                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="text-xs font-black text-[#d00000]">EGP {product.price}</span>
                  <span className="text-[10px] text-gray-400">{product.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
