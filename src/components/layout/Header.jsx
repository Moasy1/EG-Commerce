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

  const getSubTitle = () => {
    switch (activeTab) {
      case 'reels': return 'Reels • ريلز';
      case 'shop':
      case 'product': return 'Shop • السوق الموحد';
      case 'storefront': return 'Storefront • متجر مستقل';
      case 'dashboard':
      case 'merchant': return 'SaaS Hub • لوحة التاجر';
      case 'cart': return 'Cart • السلة';
      case 'checkout': return 'Checkout • الدفع';
      case 'tracking': return 'Tracking • التتبع';
      case 'rewards': return 'Rewards • مكافآت';
      case 'studio': return 'Creator Studio';
      case 'profile': return 'My Profile';
      default: return 'Reels';
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.03)] border-b border-surface-container-highest/60">
      <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setActiveTab('reels')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img 
            src="https://lh3.googleusercontent.com/aida/AEtjO1UsXahJOBRjcwbXiXmz3TE4x4htExvhEyoiAS-VhpZxl7TSsGo3f-_x6Nzo3bd6fUdk8XVLlkhu_LNVjAOLz5YkLhGNnJlFrbdfwwZ9HkhFGb6j1Ix7TEYGz59jTLLodtg5NNNejkcbXNor9JZLHkKKnts9DucaUoOYkWns-jxicpyqYpAUFdx_0u9OAd13k8x56JzWkNvt025UsBYL--PhogjlvLHma0ScCiAjTbZb8kaAfaMgjpv2hw" 
            alt="EG Fashion Logo" 
            className="h-8 w-auto object-contain"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-on-surface leading-none tracking-tight">
              EG COMMERCE
            </span>
            <span className="text-[11px] text-secondary font-medium leading-none mt-1">
              {getSubTitle()}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Egyptian mixed style) */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full border border-surface-container-high">
          <button
            onClick={() => setActiveTab('reels')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'reels'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Reels
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'shop' || activeTab === 'product'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Shop
          </button>
          <button
            onClick={() => setActiveTab('storefront')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'storefront'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🏬 المتجر المستقل</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'dashboard' || activeTab === 'merchant'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>⚙️ لوحة التاجر (SaaS)</span>
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'studio'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Creator Studio
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'rewards'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Rewards
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {/* Mobile vs Web toggle */}
          <button
            onClick={() => setDeviceMode(prev => prev === 'responsive' ? 'mobile-frame' : 'responsive')}
            title="Switch between Web & App Preview"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-low hover:bg-surface-container text-on-surface transition-all border border-surface-container-high"
          >
            <span className="material-symbols-outlined text-[17px]">
              {deviceMode === 'mobile-frame' ? 'desktop_windows' : 'smartphone'}
            </span>
            <span>{deviceMode === 'mobile-frame' ? 'Web View' : 'App View'}</span>
          </button>

          {/* Role Switcher */}
          <div className="hidden sm:flex items-center">
            <select
              value={role}
              onChange={(e) => {
                const newRole = e.target.value;
                setRole(newRole);
                if (newRole === 'creator') setActiveTab('studio');
                else if (newRole === 'merchant_admin') setActiveTab('dashboard');
                else if (newRole === 'merchant_store') setActiveTab('storefront');
                else setActiveTab('reels');
              }}
              className="bg-surface-container-low px-2.5 py-1 rounded-lg text-xs font-medium text-on-surface border border-surface-container-high focus:outline-none focus:border-secondary cursor-pointer"
            >
              <option value="buyer">👤 Buyer (مشتري)</option>
              <option value="merchant_store">🏬 Brand Store (متجر مستقل)</option>
              <option value="merchant_admin">⚙️ Merchant SaaS (لوحة التاجر)</option>
              <option value="creator">🎬 Creator (صانع محتوى)</option>
            </select>
          </div>

          {/* Search Button */}
          <button 
            onClick={() => setActiveTab('shop')}
            aria-label="Search"
            className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Notifications */}
          <button 
            onClick={() => setActiveTab('profile')}
            aria-label="Notifications"
            className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary relative transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadNotifications > 0 && (
              <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-secondary" />
            )}
          </button>

          {/* Cart Icon & Counter */}
          <button 
            onClick={() => setActiveTab('cart')}
            aria-label="Cart"
            className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary relative transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {totalCartCount > 0 && (
              <span className="absolute top-2 left-2 min-w-[16px] h-4 px-1 rounded-full bg-primary text-on-primary text-[9px] font-bold flex items-center justify-center leading-none">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="pr-1 flex items-center cursor-pointer"
          >
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBebD1XV7lyRsAl9IX8tKvw96y0vY-A3gyXbIFikiB9lcBqnBPraZyUu4KwB5cr8o2GSX3cq4h9v-tUoDKKT4cqFSr8eWnzqEj8vLK4YSx_rLs9XllzyohklMCsnt1PwT9FRovU6hVvUny8XCCEDLqQDyPOieiXb5w3HOCsbrm7L8CfFkF4E0PCcCZ1TA5VPM1qQ8214MO3rQB2O-zWXR5ggSKybljFH39T3QKh6AgE9rTLMKNbH4AW"
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-high"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
