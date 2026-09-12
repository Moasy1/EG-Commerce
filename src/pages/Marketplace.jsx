import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';

export default function Marketplace() {
  const { openProductDetail, totalCartCount, setActiveTab, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Categories corresponding to the exact 6 cards in Screen 2
  const categories = [
    { id: 'new', label: 'New Arrivals', isRedCard: true },
    { id: 'women', label: 'Women', image: '/images/products/silk_dress.jpg' },
    { id: 'men', label: 'Men', image: '/images/products/linen_shirt.jpg' },
    { id: 'modest', label: 'Modest Fashion', image: '/images/products/linen_abaya.jpg' },
    { id: 'streetwear', label: 'Streetwear', image: '/images/products/wool_blazer.jpg' },
    { id: 'accessories', label: 'Accessories', image: '/images/products/copper_lantern.jpg' },
  ];

  // Exact 4 Featured Products shown on Screen 2
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

  return (
    <div className="w-full min-h-[844px] bg-white text-slate-900 flex flex-col font-sans select-none pb-20">
      {/* 1. iOS Status Bar */}
      <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-slate-800">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
        </div>
      </div>

      {/* 2. Top Bar: Red Arch Logo & Cart Icon with Badge */}
      <div className="w-full px-5 py-2 flex items-center justify-between">
        <div className="cursor-pointer" onClick={() => setActiveTab('reels')}>
          <EgLogo className="w-7 h-7" color="#d00000" />
        </div>
        <button 
          onClick={() => setActiveTab('cart')}
          className="relative p-1.5 text-slate-800 hover:text-[#d00000] transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
          {totalCartCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#d00000] text-white text-[10px] font-bold flex items-center justify-center">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>

      {/* 3. Search Bar */}
      <div className="px-5 py-2">
        <div className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-gray-100/90 rounded-full text-slate-600 border border-gray-200 focus-within:border-gray-300">
          <span className="material-symbols-outlined text-[20px] text-gray-400">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for outfits, brands, creators..."
            className="w-full bg-transparent text-xs text-slate-900 focus:outline-none placeholder:text-gray-400 font-normal"
          />
        </div>
      </div>

      {/* 4. Categories Grid (6 Cards: Red New Arrivals + 5 Photo Cards) */}
      <div className="px-5 py-3">
        <div className="grid grid-cols-3 gap-2.5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="group aspect-[4/3] rounded-2xl overflow-hidden relative cursor-pointer shadow-xs transition-transform active:scale-95"
            >
              {cat.isRedCard ? (
                /* Card 1: Solid Red Card with White Star */
                <div className="w-full h-full bg-[#d00000] flex flex-col items-center justify-center text-white p-2">
                  <span className="material-symbols-outlined text-[24px] mb-1">star</span>
                  <span className="text-[11px] font-bold text-center leading-tight">
                    {cat.label}
                  </span>
                </div>
              ) : (
                /* Cards 2-6: Photo Cards */
                <div className="w-full h-full relative">
                  <img 
                    src={cat.image} 
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end justify-center pb-2">
                    <span className="text-[11px] font-bold text-white text-center leading-tight drop-shadow-sm px-1">
                      {cat.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Featured Products Section Header */}
      <div className="px-5 pt-3 pb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Featured Products</h3>
        <button 
          onClick={() => setSelectedCategory('all')} 
          className="text-xs font-semibold text-gray-500 hover:text-[#d00000] flex items-center gap-0.5"
        >
          <span>See All</span>
          <span className="material-symbols-outlined text-[15px]">chevron_right</span>
        </button>
      </div>

      {/* 6. 2-Column Products Grid */}
      <div className="px-5 pb-6">
        <div className="grid grid-cols-2 gap-3.5">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              onClick={() => openProductDetail(prod)}
              className="group flex flex-col cursor-pointer"
            >
              {/* Image Container with Heart Favorite Icon */}
              <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden relative bg-gray-100 border border-gray-100 shadow-xs">
                <img 
                  src={prod.image} 
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-[#d00000] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                </button>
              </div>

              {/* Product Info */}
              <div className="pt-2 text-left">
                <h4 className="text-xs font-semibold text-slate-900 truncate">
                  {prod.title}
                </h4>
                <span className="text-xs font-bold text-slate-900 block mt-0.5">
                  EGP {prod.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
