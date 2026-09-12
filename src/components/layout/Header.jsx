import React from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

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
      case 'showcase': return '5-Screens Showcase • المعرض الموحد';
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
          onClick={() => setActiveTab('showcase')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <EgLogo className="w-9 h-9 group-hover:scale-105 transition-transform" color="#d00000" />
          <div className="flex flex-col text-left">
            <span className="text-sm font-black text-on-surface leading-none tracking-tight">
              EG-COMMERCE
            </span>
            <span className="text-[11px] text-[#d00000] font-bold leading-none mt-1">
              {getSubTitle()}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full border border-surface-container-high">
          {/* Showcase Tab (Matching Reference Image) */}
          <button
            onClick={() => setActiveTab('showcase')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'showcase'
                ? 'bg-[#d00000] text-white shadow-md'
                : 'text-[#d00000] hover:bg-[#d00000]/10'
            }`}
          >
            <span>📱 الشاشات الـ 5 (Showcase)</span>
          </button>

          <button
            onClick={() => setActiveTab('reels')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'reels'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            1. Reels
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'shop'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            2. Shop
          </button>
          <button
            onClick={() => setActiveTab('product')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'product'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            3. Product
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'cart' || activeTab === 'checkout'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            4. Cart
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            5. Profile
          </button>
          <button
            onClick={() => setActiveTab('storefront')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'storefront'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>🏬 المتجر المستقل</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              activeTab === 'dashboard' || activeTab === 'merchant'
                ? 'bg-secondary text-on-secondary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span>⚙️ لوحة التاجر</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Mobile vs Web toggle */}
          <button
            onClick={() => setDeviceMode(prev => prev === 'responsive' ? 'mobile-frame' : 'responsive')}
            title="Switch between Web & App Preview"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-container-low hover:bg-surface-container text-on-surface transition-all border border-surface-container-high"
          >
            <span className="material-symbols-outlined text-[17px]">
              {deviceMode === 'mobile-frame' ? 'desktop_windows' : 'smartphone'}
            </span>
            <span>{deviceMode === 'mobile-frame' ? 'Web View' : 'App Frame'}</span>
          </button>

          {/* Role Switcher */}
          <div className="hidden sm:flex items-center">
            <select
              value={role}
              onChange={(e) => {
                const newRole = e.target.value;
                setRole(newRole);
                if (newRole === 'creator') setActiveTab('profile');
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
            className="w-9 h-9 flex items-center justify-center text-on-surface hover:text-[#d00000] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Cart Icon & Counter */}
          <button 
            onClick={() => setActiveTab('cart')}
            aria-label="Cart"
            className="w-9 h-9 flex items-center justify-center text-on-surface hover:text-[#d00000] relative transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            {totalCartCount > 0 && (
              <span className="absolute top-1 left-1 min-w-[15px] h-[15px] px-1 rounded-full bg-[#d00000] text-white text-[9px] font-bold flex items-center justify-center leading-none">
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
              src="/images/reels/reel_2.jpg" 
              alt="Profile" 
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#d00000]/40"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
