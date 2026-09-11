import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { 
    activeTab, 
    setActiveTab, 
    totalCartCount, 
    role, 
    setRole, 
    deviceMode, 
    setDeviceMode,
    unreadNotifications
  } = useApp();

  return (
    <header className="sticky top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl border-b border-surface-container-high shadow-sm">
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setActiveTab('reels')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img 
            src="/logo_eg_fashion_arabic.svg" 
            alt="EG Commerce Logo" 
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              // Fallback if SVG not loaded
              e.target.style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-on-surface leading-none">
              EG FASHION
            </span>
            <span className="text-[11px] font-medium text-primary leading-none mt-1">
              موضة • محتوى • مكافآت
            </span>
          </div>
        </div>

        {/* Desktop Top Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full border border-surface-variant/40">
          <button
            onClick={() => setActiveTab('reels')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'reels'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            اكتشاف الريلز
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'shop' || activeTab === 'product'
                ? 'bg-primary text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            السوق الموحد
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'rewards'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            المكافآت
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'studio'
                ? 'bg-tertiary text-on-tertiary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            ستوديو المحتوى
          </button>
          <button
            onClick={() => setActiveTab('merchant')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === 'merchant'
                ? 'bg-primary-container text-white shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            بوابة التاجر
          </button>
        </nav>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Device Mockup Toggle on Desktop */}
          <button
            onClick={() => setDeviceMode(prev => prev === 'responsive' ? 'mobile-frame' : 'responsive')}
            title="تبديل وضع العرض (موقع متجاوب / تطبيق هاتف)"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container-high hover:bg-surface-variant text-on-surface transition-all border border-surface-variant/50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {deviceMode === 'mobile-frame' ? 'desktop_windows' : 'smartphone'}
            </span>
            <span>{deviceMode === 'mobile-frame' ? 'وضع الويب' : 'عرض التطبيق'}</span>
          </button>

          {/* Role Dropdown / Switcher */}
          <div className="hidden sm:flex items-center">
            <select
              value={role}
              onChange={(e) => {
                const newRole = e.target.value;
                setRole(newRole);
                if (newRole === 'creator') setActiveTab('studio');
                else if (newRole === 'merchant') setActiveTab('merchant');
                else setActiveTab('reels');
              }}
              className="bg-surface-container px-2.5 py-1.5 rounded-lg text-xs font-medium text-on-surface border border-surface-variant/40 focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="buyer">👤 مشتري</option>
              <option value="creator">🎬 صانع محتوى (UGC)</option>
              <option value="merchant">🏪 تاجر / علامة تجارية</option>
            </select>
          </div>

          {/* Search Button */}
          <button 
            onClick={() => setActiveTab('shop')}
            aria-label="بحث في المنتجات"
            className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Notification Pip */}
          <button 
            onClick={() => setActiveTab('profile')}
            aria-label="التنبيهات"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotifications > 0 && (
              <span className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface animate-pulse" />
            )}
          </button>

          {/* Cart Icon & Badge */}
          <button 
            onClick={() => setActiveTab('cart')}
            aria-label="السلة الموحدة"
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {totalCartCount > 0 && (
              <span className="absolute top-1.5 left-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center leading-none ring-2 ring-surface">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="cursor-pointer pr-1 flex items-center"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBebD1XV7lyRsAl9IX8tKvw96y0vY-A3gyXbIFikiB9lcBqnBPraZyUu4KwB5cr8o2GSX3cq4h9v-tUoDKKT4cqFSr8eWnzqEj8vLK4YSx_rLs9XllzyohklMCsnt1PwT9FRovU6hVvUny8XCCEDLqQDyPOieiXb5w3HOCsbrm7L8CfFkF4E0PCcCZ1TA5VPM1qQ8214MO3rQB2O-zWXR5ggSKybljFH39T3QKh6AgE9rTLMKNbH4AW"
              alt="الملف الشخصي" 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-outline-variant/40 hover:ring-primary transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
