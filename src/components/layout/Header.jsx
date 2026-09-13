import React, { useState } from 'react';
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

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const isAr = language === 'ar';
  const isReels = activeTab === 'reels';
  const isDashboard = activeTab === 'dashboard' || activeTab === 'merchant' || activeTab === 'add_product' || activeTab === 'merchant_campaign';
  const isCheckout = activeTab === 'checkout' || activeTab === 'tracking';

  // Contextual Header for Checkout & Order Tracking (Isolated Flow)
  if (isCheckout) {
    return (
      <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 text-slate-900 shadow-xs">
        <div className="max-w-[1780px] mx-auto px-2 sm:px-4 md:px-8 py-2 sm:py-3 flex items-center justify-between gap-1 sm:gap-4">
          <div 
            onClick={() => setActiveTab('shop')}
            className="flex items-center gap-1.5 sm:gap-3.5 cursor-pointer shrink-0 group"
          >
            <EgLogo className="w-7 h-7 sm:w-9 sm:h-9 group-hover:scale-105 transition-transform" color="#d00000" />
            <div className="flex flex-col text-left">
              <span className="text-base sm:text-xl font-black tracking-tight leading-none text-slate-900">
                EG-Commerce
              </span>
              <span className="text-[11px] font-bold text-gray-400 mt-0.5">
                {isAr ? 'الدفع الآمن' : 'Secure Checkout'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600 text-[20px]">lock</span>
            <span className="text-xs font-bold text-gray-500 hidden sm:inline">
              {isAr ? 'مشفر وآمن 100%' : '100% Encrypted & Secure'}
            </span>
          </div>
        </div>
      </header>
    );
  }

  // Contextual Header for Dashboard/Seller Hub
  if (isDashboard) {
    return (
      <header className="sticky top-0 w-full z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-[1780px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div onClick={() => setActiveTab('reels')} className="cursor-pointer">
              <EgLogo className="w-8 h-8" color="#ffffff" />
            </div>
            <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
            <h1 className="text-sm font-bold tracking-wide hidden sm:block">
              {isAr ? 'مركز البائعين' : 'Seller Hub'}
            </h1>
            
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {[
                { id: 'dashboard', label: isAr ? 'نظرة عامة' : 'Overview' },
                { id: 'add_product', label: isAr ? 'المنتجات' : 'Products' },
                { id: 'merchant_campaign', label: isAr ? 'الحملات' : 'Campaigns' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    activeTab === tab.id ? 'bg-[#d00000] text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('reels')}
              className="px-3 py-1.5 rounded-full border border-slate-700 text-xs font-bold hover:bg-slate-800 transition-colors hidden sm:block"
            >
              {isAr ? 'العودة للتطبيق' : 'Back to App'}
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600">
              <img src="/images/brands/talieska_logo.jpg" alt="Store" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Standard App Header
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

        {/* 2. Center: Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xl mx-2">
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

        {/* 3. Navigation Links (Clean Core Nav) */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('reels')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'reels'
                ? 'bg-[#d00000] text-white shadow-xs'
                : isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            {isAr ? 'الرئيسية' : 'Feed'}
          </button>
          
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'shop'
                ? 'bg-[#d00000] text-white shadow-xs'
                : isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            {isAr ? 'السوق' : 'Marketplace'}
          </button>

          {/* Create Menu Dropdown */}
          <div className="relative" onMouseLeave={() => setIsCreateMenuOpen(false)}>
            <button
              onMouseEnter={() => setIsCreateMenuOpen(true)}
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                ['studio', 'dashboard'].includes(activeTab)
                  ? 'bg-slate-900 text-white shadow-xs'
                  : isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>{isAr ? 'إنشاء' : 'Create'}</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>

            {isCreateMenuOpen && (
              <div className="absolute top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-slate-900 z-50 flex flex-col py-1 animate-fade-in">
                <button onClick={() => { setActiveTab('studio'); setIsCreateMenuOpen(false); }} className="px-4 py-2.5 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px] text-[#d00000]">video_camera_front</span>
                  {isAr ? 'استوديو المبدعين' : 'Creator Studio'}
                </button>
                <div className="h-px w-full bg-gray-100 my-1"></div>
                <button onClick={() => { setActiveTab('dashboard'); setIsCreateMenuOpen(false); }} className="px-4 py-2.5 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px] text-slate-700">storefront</span>
                  {isAr ? 'لوحة التاجر' : 'Seller Hub'}
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* 4. Right: Action Icons & Profile */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setLanguage(l => l === 'ar' ? 'en' : 'ar')}
            className={`hidden sm:flex px-2.5 py-1 rounded-full border text-[11px] font-bold transition-colors items-center gap-1 shadow-xs ${
              isReels ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-slate-900'
            }`}
          >
            <span>{isAr ? '🇬🇧 EN' : '🇪🇬 AR'}</span>
          </button>

          <button 
            onClick={() => setActiveTab('shop')}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-[#d00000] hover:bg-red-50'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>

          <button 
            onClick={() => setActiveTab('cart')}
            className={`w-8 h-8 rounded-full flex items-center justify-center relative transition-colors ${
              isReels ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-[#d00000] hover:bg-red-50'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#d00000] text-white text-[10px] font-black flex items-center justify-center leading-none shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Profile Menu Dropdown */}
          <div className="relative" onMouseLeave={() => setIsProfileMenuOpen(false)}>
            <div 
              onMouseEnter={() => setIsProfileMenuOpen(true)}
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="cursor-pointer flex items-center gap-2 pl-1 ml-1"
            >
              <img 
                src="/images/reels/reel_2.jpg" 
                alt="Profile" 
                className={`w-8 h-8 rounded-full object-cover ring-2 transition-all ${isProfileMenuOpen ? 'ring-[#d00000]' : 'ring-transparent'}`}
              />
            </div>
            
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-slate-900 z-50 flex flex-col py-1 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <img src="/images/reels/reel_2.jpg" className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold">Ahmed Fits</span>
                    <span className="text-[10px] text-gray-500">@ahmed_fits</span>
                  </div>
                </div>

                <button onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left mt-1">
                  <span className="material-symbols-outlined text-[18px]">person</span> {isAr ? 'الملف الشخصي' : 'My Profile'}
                </button>
                <button onClick={() => { setLanguage(l => l === 'ar' ? 'en' : 'ar'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex sm:hidden items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">language</span> {isAr ? 'Switch to English' : 'التبديل للعربية'}
                </button>
                <button onClick={() => { setActiveTab('tracking'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span> {isAr ? 'الطلبات' : 'Orders'}
                </button>
                <button onClick={() => { setActiveTab('rewards'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span> {isAr ? 'المكافآت' : 'Rewards Hub'}
                </button>
                <button onClick={() => { setActiveTab('showcase'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left text-blue-600 mt-1 border-t border-gray-50 pt-3">
                  <span className="material-symbols-outlined text-[18px]">visibility</span> {isAr ? 'عرض الشاشات (Dev)' : 'Screen Index (Dev)'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
