import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';
import { ProductService, CATEGORIES_DATA } from '../../services/ProductService';

export default function DesktopMarketplace() {
  const { 
    products: contextProducts, 
    openProductDetail, 
    addToCart, 
    setActiveTab, 
    openCategoryPage,
    language 
  } = useApp();
  const isAr = language === 'ar';
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedSize, setSelectedSize] = useState('M');
  const [searchQuery, setSearchQuery] = useState('');

  const topCategoryIcons = [
    { label: 'All', labelAr: 'الكل', icon: 'apps', slug: 'all' },
    { label: 'Women', labelAr: 'أزياء نسائية', icon: 'woman', slug: 'women' },
    { label: 'Men', labelAr: 'أزياء رجالية', icon: 'man', slug: 'men' },
    { label: 'Modest Fashion', labelAr: 'عبايات ومحتشمة', icon: 'dry_cleaning', slug: 'modest' },
    { label: 'Streetwear', labelAr: 'ستريت وير', icon: 'checkroom', slug: 'streetwear' },
    { label: 'Accessories', labelAr: 'إكسسوارات وساعات', icon: 'handbag', slug: 'accessories' },
    { label: 'Makeup', labelAr: 'مكياج وتجميل', icon: 'brush', slug: 'makeup' },
    { label: 'Heritage', labelAr: 'تحف وتراث', icon: 'star', slug: 'heritage' },
  ];


  const products = (contextProducts && contextProducts.length > 0) ? contextProducts : [
    {
      id: 'dm-1',
      title: 'Embroidered Galabeya',
      price: 850,
      rating: 4.8,
      reviewsCount: 124,
      image: '/images/products/linen_abaya.jpg',
      category: 'Abayas'
    }
  ];

  const topStores = [
    { id: 'store-1', name: 'Talieska Studio', image: '/images/brands/talieska_logo.jpg' },
    { id: 'store-2', name: 'ورشة خان الخليلي', image: '/images/banners/khan_hero.jpg' },
    { id: 'store-3', name: 'مجوهرات طيبة', image: '/images/reels/fashion_vintage_watch_thumb.jpg' },
  ];

  const featuredCreators = [
    { id: 'c-1', handle: 'cairo_chic', avatar: '/images/reels/fashion_citrine_blazer_thumb.jpg' },
    { id: 'c-2', handle: 'salma.styles', avatar: '/images/reels/fashion_oversized_shirt_thumb.jpg' },
    { id: 'c-3', handle: 'karim.editorial', avatar: '/images/reels/fashion_vintage_watch_thumb.jpg' },
    { id: 'c-4', handle: 'maya_accessories', avatar: '/images/reels/fashion_shoulder_bags_thumb.jpg' },
    { id: 'c-5', handle: 'zeina_ootd', avatar: '/images/reels/fashion_oneshoulder_top_thumb.jpg' },
  ];

  return (
    <div className="w-full bg-white text-slate-900 flex flex-col font-sans min-h-[580px] overflow-hidden select-none text-left">
      {/* 1. Top Bar */}
      <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('reels')}>
          <EgLogo className="w-6 h-6" color="#d00000" />
          <span className="font-black text-xs tracking-tight">EG-Commerce</span>
        </div>

        <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 bg-gray-100/90 rounded-full text-xs text-gray-500">
          <span className="material-symbols-outlined text-[17px] text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search products, categories, brands..."
            className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 text-gray-600 text-xs font-semibold">
          <button className="flex items-center gap-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[18px]">tune</span><span>Filters</span></button>
          <span className="text-gray-300">|</span>
          <button className="flex items-center gap-1 hover:text-[#d00000]"><span className="text-gray-500">Sort by:</span><span className="text-slate-900 font-bold">Most Popular</span></button>
          <div className="flex items-center gap-2 ml-2">
            <button onClick={() => setActiveTab('cart')} className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">shopping_cart</span></button>
            <img src="/images/reels/reel_2.jpg" alt="User" className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-300" />
          </div>
        </div>
      </div>

      {/* 2. Top Category Icons Bar */}
      <div className="px-5 py-2 border-b border-gray-100 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2">
          {topCategoryIcons.map((cat) => (
            <button
              key={cat.label}
              onClick={() => {
                if (cat.slug === 'all') {
                  setSelectedCat('All');
                } else {
                  openCategoryPage(cat.slug);
                }
              }}
              className={`flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold transition-all ${
                selectedCat === cat.label
                  ? 'bg-[#d00000] text-white font-bold shadow-xs'
                  : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{cat.icon}</span>
              <span>{isAr ? (cat.labelAr || cat.label) : cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Content: Left Filters + 4-Column Product Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Filter Column */}
        <aside className="w-52 p-4 border-r border-gray-100 space-y-4 text-left shrink-0 bg-gray-50/50">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">{isAr ? 'التصنيفات' : 'Categories'}</h4>
            <div className="space-y-1 text-[11px] text-gray-600 font-medium">
              {[
                { name: 'Women Fashion', nameAr: 'أزياء نسائية', slug: 'women' },
                { name: 'Men Wear', nameAr: 'أزياء رجالية', slug: 'men' },
                { name: 'Abayas & Modest', nameAr: 'عبايات ومحتشمة', slug: 'modest' },
                { name: 'Streetwear & Shirts', nameAr: 'ستريت وير وكاجوال', slug: 'streetwear' },
                { name: 'Accessories & Bags', nameAr: 'إكسسوارات وشنط', slug: 'accessories' },
                { name: 'Beauty & Makeup', nameAr: 'مكياج وتجميل', slug: 'makeup' },
                { name: 'Heritage Crafts', nameAr: 'تحف وتراث', slug: 'heritage' },
              ].map((c) => (
                <div
                  key={c.slug}
                  onClick={() => openCategoryPage(c.slug)}
                  className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white hover:shadow-xs cursor-pointer text-slate-700 hover:text-[#d00000] transition-all"
                >
                  <span className="font-semibold">{isAr ? c.nameAr : c.name}</span>
                  <span className="material-symbols-outlined text-[14px] text-gray-400">arrow_forward</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200/60">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Price Range</h4>
            <div className="space-y-1.5 text-[11px] text-gray-600 font-medium">
              {['Under 300 EGP', '300 - 600 EGP', '600 - 1,000 EGP', '1,000+ EGP'].map((p, i) => (
                <label key={p} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input type="checkbox" defaultChecked={i === 2} className="accent-[#d00000] rounded" />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200/60">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Size</h4>
            <div className="flex flex-wrap gap-1.5">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-bold border ${
                    selectedSize === s
                      ? 'bg-[#d00000] text-white border-[#d00000]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 4-Column Product Cards Grid */}
        <main className="flex-1 p-4 overflow-y-auto">
          {/* Desktop Stores & Creators Preview */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Featured Stores</span>
                <span className="text-[10px] text-[#d00000] cursor-pointer">View All</span>
              </h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {topStores.map(store => (
                  <div 
                    key={store.id} 
                    onClick={() => setActiveTab('storefront')}
                    className="flex flex-col items-center gap-1 cursor-pointer group shrink-0"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-gray-100 group-hover:ring-[#d00000]/50 transition-all">
                      <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-700">{store.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Trending Creators</span>
                <span className="text-[10px] text-[#d00000] cursor-pointer">Discover</span>
              </h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {featuredCreators.map(creator => (
                  <div 
                    key={creator.id} 
                    onClick={() => setActiveTab('profile')}
                    className="w-[84px] bg-white border border-gray-200 rounded-xl p-1.5 flex flex-col items-center cursor-pointer hover:shadow-sm shrink-0"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden mb-1.5">
                      <img src={creator.avatar} alt={creator.handle} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-900 truncate w-full text-center">@{creator.handle}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-sm font-bold text-slate-900">Explore Marketplace</h3>
            <p className="text-[11px] text-gray-500">Shop the latest Egyptian fashion from local sellers</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                onClick={() => openProductDetail(prod)}
                className="group rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                {/* Image */}
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                  <img src={prod.image} alt={prod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {prod.video && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1 shadow-md border border-white/20">
                      <span className="material-symbols-outlined text-[12px] text-[#ff3b5c]">play_arrow</span>
                      <span>Watch Reel</span>
                    </div>
                  )}
                  <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#d00000]">
                    <span className="material-symbols-outlined text-[14px]">favorite</span>
                  </button>
                </div>

                {/* Info */}
                <div className="p-2.5 space-y-1.5">
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-900 truncate">{prod.title}</h5>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs font-black text-slate-900">EGP {prod.price}</span>
                      <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                        <span className="material-symbols-outlined text-[12px] fill-current">star</span>
                        <span className="font-bold text-slate-700">{prod.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Red [ Add to Cart ] Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod);
                    }}
                    className="w-full py-1.5 rounded-lg bg-[#d00000] text-white text-[10px] font-bold hover:bg-[#b00000] transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[13px]">shopping_cart</span>
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
