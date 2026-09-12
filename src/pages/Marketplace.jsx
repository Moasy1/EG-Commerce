import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import DesktopMarketplace from '../components/desktop/DesktopMarketplace';

export default function Marketplace() {
  const { openProductDetail, totalCartCount, setActiveTab, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories corresponding to the exact 6 cards in Screen 2 mobile
  const categories = [
    { id: 'new', label: 'New Arrivals', isRedCard: true },
    { id: 'women', label: 'Women', image: '/images/products/silk_dress.jpg' },
    { id: 'men', label: 'Men', image: '/images/products/linen_shirt.jpg' },
    { id: 'modest', label: 'Modest Fashion', image: '/images/products/linen_abaya.jpg' },
    { id: 'streetwear', label: 'Streetwear', image: '/images/products/wool_blazer.jpg' },
    { id: 'accessories', label: 'Accessories', image: '/images/products/copper_lantern.jpg' },
  ];

  // Featured Products shown on mobile Screen 2
  const featuredProducts = [
    {
      id: 'p-linen-coord',
      title: 'Linen Co-ord Set',
      price: 1250,
      image: '/images/reels/reel_1.jpg',
      category: 'Women',
      rating: 4.8,
      reviewsCount: 124,
      merchantId: 'm-1'
    },
    {
      id: 'p-oversized-hoodie',
      title: 'Oversized Hoodie',
      price: 950,
      image: '/images/products/wool_blazer.jpg',
      category: 'Men',
      rating: 4.9,
      reviewsCount: 86,
      merchantId: 'm-1'
    },
    {
      id: 'p-chic-jacket',
      title: 'Chic Linen Jacket',
      price: 890,
      image: '/images/products/linen_shirt.jpg',
      category: 'Women',
      rating: 4.7,
      reviewsCount: 52,
      merchantId: 'm-1'
    },
    {
      id: 'p-utility-jacket',
      title: 'Olive Utility Jacket',
      price: 1100,
      image: '/images/products/linen_abaya.jpg',
      category: 'Men',
      rating: 4.8,
      reviewsCount: 68,
      merchantId: 'm-1'
    }
  ];

  // Top Stores & Brands
  const topStores = [
    { id: 'store-1', name: 'Talieska', image: '/images/brands/talieska_logo.jpg' },
    { id: 'store-2', name: 'ZAY Fashion', image: '/images/products/linen_abaya.jpg' },
    { id: 'store-3', name: 'Khan', image: '/images/banners/khan_hero.jpg' },
    { id: 'store-4', name: 'Khat', image: '/images/products/copper_lantern.jpg' },
    { id: 'store-5', name: 'Dokan', image: '/images/products/kilim_rug.jpg' },
  ];

  // Featured Creators
  const featuredCreators = [
    { id: 'c-1', handle: 'mariam.style', avatar: '/images/reels/reel_1.jpg' },
    { id: 'c-2', handle: 'ahmed_fits', avatar: '/images/reels/reel_2.jpg' },
    { id: 'c-3', handle: 'sara.fashion', avatar: '/images/reels/reel_3.jpg' },
    { id: 'c-4', handle: 'omar.daily', avatar: '/images/reels/reel_4.jpg' },
    { id: 'c-5', handle: 'cairo.chic', avatar: '/images/products/silk_dress.jpg' },
  ];

  return (
    <div className="w-full flex-1 overflow-y-auto min-h-0 relative">
      {/* 1. DESKTOP VIEW (Screen 2: Explore Marketplace with full filters & 4-col grid) */}
      <div className="hidden md:block w-full max-w-[1780px] mx-auto px-4 md:px-8 py-6">
        <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
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
              onClick={() => setActiveTab('storefront')}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-gray-100 group-hover:ring-[#d00000]/50 transition-all">
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-bold text-slate-700">{store.name}</span>
            </div>
          ))}
        </div>

        {/* Category Visual Cards */}
        <div className="px-4 py-3 mt-1">
          <div className="grid grid-cols-3 gap-2.5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-28 rounded-2xl relative overflow-hidden cursor-pointer shadow-xs active:scale-95 transition-all flex flex-col justify-end p-2.5 ${
                  cat.isRedCard ? 'bg-[#d00000] text-white' : 'bg-gray-900 text-white'
                }`}
              >
                {!cat.isRedCard && (
                  <>
                    <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  </>
                )}
                <div className="relative z-10 text-left">
                  {cat.isRedCard && <span className="material-symbols-outlined text-[20px] mb-1">local_fire_department</span>}
                  <span className="text-[11px] font-black leading-tight block">{cat.label}</span>
                </div>
              </div>
            ))}
          </div>
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
              onClick={() => setActiveTab('profile')}
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

              <div className="p-2.5 text-left space-y-1">
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
