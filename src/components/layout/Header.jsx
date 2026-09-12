import React from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function Header() {
  const { 
    activeTab, 
    setActiveTab, 
    totalCartCount, 
    role, 
    setRole
  } = useApp();

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-[1780px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* 1. Left: Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('reels')}
          className="flex items-center gap-3.5 cursor-pointer shrink-0 group"
        >
          <EgLogo className="w-9 h-9 group-hover:scale-105 transition-transform" color="#d00000" />
          <div className="flex flex-col text-left">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                EG-Commerce
              </span>
              <span className="hidden xl:inline text-xs font-bold text-slate-600">
                Social Commerce for Egyptian Fashion
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium hidden sm:inline mt-0.5">
              Discover · Shop · Support Local Creators
            </span>
          </div>
        </div>

        {/* 2. Center: Desktop Search Bar (Matching Mockup) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-2">
          <div className="w-full flex items-center gap-2.5 px-4 py-2 bg-gray-100/90 rounded-full border border-gray-200/80 focus-within:border-[#d00000] focus-within:bg-white transition-all text-xs text-gray-600">
            <span className="material-symbols-outlined text-[18px] text-gray-400">search</span>
            <input
              type="text"
              placeholder="Search for outfits, creators, brands, galabeyas..."
              className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') setActiveTab('shop');
              }}
            />
          </div>
        </div>

        {/* 3. Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('reels')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'reels'
                ? 'bg-[#d00000] text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'shop'
                ? 'bg-[#d00000] text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('product')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'product'
                ? 'bg-[#d00000] text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            Product
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'dashboard' || activeTab === 'merchant'
                ? 'bg-[#d00000] text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            Seller Hub
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'studio'
                ? 'bg-[#d00000] text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            Creator Studio
          </button>
          <button
            onClick={() => setActiveTab('storefront')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'storefront'
                ? 'bg-[#d00000] text-white shadow-xs'
                : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            Brand Store
          </button>
        </nav>

        {/* 4. Right: Action Icons + Slogan */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Wishlist */}
          <button 
            onClick={() => setActiveTab('shop')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-[#d00000] hover:bg-red-50 transition-colors"
            title="Wishlist"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>

          {/* Cart with Live Badge */}
          <button 
            onClick={() => setActiveTab('cart')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-[#d00000] hover:bg-red-50 relative transition-colors"
            title="Cart"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#d00000] text-white text-[10px] font-black flex items-center justify-center leading-none shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="cursor-pointer group flex items-center gap-2 pl-1"
            title="Profile"
          >
            <img 
              src="/images/reels/reel_2.jpg" 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#d00000] transition-all"
            />
          </div>

          {/* Slogan pill (Matching reference design) */}
          <div className="hidden 2xl:flex flex-col items-end border-l border-gray-200 pl-4 ml-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase leading-none">
              REAL PEOPLE / REAL STYLE / EGYPT
            </span>
            <div className="w-8 h-0.5 bg-[#d00000] rounded-full mt-1" />
          </div>
        </div>
      </div>
    </header>
  );
}
