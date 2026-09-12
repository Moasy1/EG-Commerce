import React from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function Header() {
  const { 
    activeTab, 
    setActiveTab, 
    totalCartCount, 
    language,
    setLanguage
  } = useApp();

  const isAr = language === 'ar';
  const isReels = activeTab === 'reels';

  return (
    <header className={`sticky top-0 w-full z-40 transition-colors duration-300 shadow-xs ${
      isReels ? 'bg-black/90 backdrop-blur-md border-b border-white/10 text-white' : 'bg-white/95 backdrop-blur-md border-b border-gray-200/80 text-slate-900'
    }`}>
      <div className="max-w-[1780px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* 1. Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('reels')}
          className="flex items-center gap-3.5 cursor-pointer shrink-0 group"
        >
          <EgLogo className="w-9 h-9 group-hover:scale-105 transition-transform" color="#d00000" />
          <div className="flex flex-col text-right">
            <div className="flex items-baseline gap-2">
              <span className={`text-xl font-black tracking-tight leading-none ${isReels ? 'text-white' : 'text-slate-900'}`}>
                EG-Commerce
              </span>
              <span className={`hidden xl:inline text-xs font-bold ${isReels ? 'text-gray-300' : 'text-slate-600'}`}>
                {isAr ? 'منصة التجارة الاجتماعية للأزياء المصرية' : 'Social Commerce for Egyptian Fashion'}
              </span>
            </div>
            <span className={`text-[11px] font-medium hidden sm:inline mt-0.5 ${isReels ? 'text-gray-400' : 'text-gray-500'}`}>
              {isAr ? 'اكتشف · تسوق · ادعم المبدعين المحليين' : 'Discover · Shop · Support Local Creators'}
            </span>
          </div>
        </div>

        {/* 2. Center: Desktop Search Bar (Matching Mockup) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-2">
          <div className={`w-full flex items-center gap-2.5 px-4 py-2 rounded-full border focus-within:border-[#d00000] transition-all text-xs ${
            isReels ? 'bg-white/10 border-white/20 focus-within:bg-black text-white' : 'bg-gray-100/90 border-gray-200/80 focus-within:bg-white text-gray-600'
          }`}>
            <span className={`material-symbols-outlined text-[18px] ${isReels ? 'text-gray-300' : 'text-gray-400'}`}>search</span>
            <input
              type="text"
              placeholder={isAr ? "ابحث عن منتجات، أزياء، جلابيات، مصممين..." : "Search for outfits, creators, brands, galabeyas..."}
              className={`w-full bg-transparent focus:outline-none text-xs ${isReels ? 'text-white placeholder:text-gray-400' : 'text-slate-800 placeholder:text-gray-400'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setActiveTab('shop');
              }}
            />
          </div>
        </div>

        {/* 3. Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('reels')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'reels'
                ? 'bg-[#d00000] text-white shadow-xs'
                : isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            {isAr ? 'الرئيسية' : 'Feed'}
          </button>
          
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'shop'
                ? 'bg-[#d00000] text-white shadow-xs'
                : isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            {isAr ? 'السوق' : 'Marketplace'}
          </button>

          {/* New Add Product Studio Tab (Image 1) */}
          <button
            onClick={() => setActiveTab('add_product')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'add_product'
                ? 'bg-[#d00000] text-white shadow-xs'
                : isReels ? 'text-[#ff6b6b] hover:bg-red-500/10 border border-red-500/30' : 'text-[#d00000] hover:bg-red-50 bg-red-50/50 border border-red-200/80'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">add_circle</span>
            <span>{isAr ? 'إضافة منتج' : '+ Add Product'}</span>
          </button>

          <button
            onClick={() => setActiveTab('product')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'product'
                ? 'bg-[#d00000] text-white shadow-xs'
                : isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            {isAr ? 'المنتج' : 'Product'}
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'dashboard' || activeTab === 'merchant'
                ? 'bg-[#d00000] text-white shadow-xs'
                : isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            {isAr ? 'لوحة التاجر' : 'Seller Hub'}
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'studio'
                ? 'bg-[#d00000] text-white shadow-xs'
                : isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            {isAr ? 'استوديو المبدعين' : 'Creator Studio'}
          </button>

          <button
            onClick={() => setActiveTab('storefront')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'storefront'
                ? 'bg-[#d00000] text-white shadow-xs'
                : isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            {isAr ? 'متجر البراند' : 'Brand Store'}
          </button>
        </nav>

        {/* 4. Right: Language Switcher, Action Icons & Slogan */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Language Toggle Button */}
          <button
            onClick={() => setLanguage(l => l === 'ar' ? 'en' : 'ar')}
            className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs ${
              isReels ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-slate-900'
            }`}
            title="تبديل اللغة / Switch Language"
          >
            <span>{isAr ? '🇬🇧 English' : '🇪🇬 العربية'}</span>
          </button>

          {/* Wishlist */}
          <button 
            onClick={() => setActiveTab('shop')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-[#d00000] hover:bg-red-50'
            }`}
            title={isAr ? "المفضلة" : "Wishlist"}
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>

          {/* Cart with Live Badge */}
          <button 
            onClick={() => setActiveTab('cart')}
            className={`w-8 h-8 rounded-full flex items-center justify-center relative transition-colors ${
              isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-[#d00000] hover:bg-red-50'
            }`}
            title={isAr ? "السلة" : "Cart"}
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
            title={isAr ? "الملف الشخصي" : "Profile"}
          >
            <img 
              src="/images/reels/reel_2.jpg" 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-[#d00000] transition-all"
            />
          </div>

          {/* Slogan pill (Matching Image 3 & 4) */}
          <div className={`hidden 2xl:flex flex-col items-end border-r pr-4 mr-1 text-right ${isReels ? 'border-white/20' : 'border-gray-200'}`}>
            <span className={`text-[10px] font-bold tracking-wider uppercase leading-none ${isReels ? 'text-gray-400' : 'text-gray-400'}`}>
              {isAr ? 'أشخاص حقيقيون / أسلوب حقيقي / مصر' : 'REAL PEOPLE / REAL STYLE / EGYPT'}
            </span>
            <div className="w-8 h-0.5 bg-[#d00000] rounded-full mt-1" />
          </div>
        </div>
      </div>
    </header>
  );
}
