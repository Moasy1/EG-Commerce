import React from 'react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const { activeTab, setActiveTab, totalCartCount, language, user } = useApp();
  const isAr = language === 'ar';

  return (
    <nav 
      aria-label="Mobile navigation"
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] w-full mx-auto md:relative transition-colors duration-300 text-slate-900 gpu-layer"
    >
      <div className="flex items-center justify-between h-14 px-4 sm:px-6 pb-safe max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('reels')}
          aria-label={isAr ? 'الرئيسية' : 'Home'}
          aria-current={activeTab === 'reels' ? 'page' : undefined}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-all active:scale-90 duration-150 ${
            activeTab === 'reels' ? 'text-[#d00000] scale-105' : 'text-gray-400 hover:text-gray-600'
          }`}
          title={isAr ? 'الرئيسية' : 'Home'}
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'reels' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[10px] font-medium tracking-tight">
            {isAr ? 'الرئيسية' : 'Home'}
          </span>
        </button>

        {/* 2. Explore */}
        <button
          onClick={() => setActiveTab('shop')}
          aria-label={isAr ? 'استكشف' : 'Explore'}
          aria-current={activeTab === 'shop' || activeTab === 'product' || activeTab === 'category' ? 'page' : undefined}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-all active:scale-90 duration-150 ${
            activeTab === 'shop' || activeTab === 'product' || activeTab === 'category'
              ? 'text-[#d00000] scale-105'
              : 'text-gray-400 hover:text-gray-600'
          }`}
          title={isAr ? 'استكشف' : 'Explore'}
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'shop' || activeTab === 'product' || activeTab === 'category' ? "'FILL' 1" : "'FILL' 0" }}
          >
            search
          </span>
          <span className="text-[10px] font-medium tracking-tight">
            {isAr ? 'استكشف' : 'Explore'}
          </span>
        </button>

        {/* 3. Center Red (+) Button */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => setActiveTab('studio')}
            aria-label={isAr ? 'إنشاء محتوى أو منتج' : 'Create'}
            className="w-11 h-11 -mt-2 rounded-full bg-[#d00000] text-white flex items-center justify-center shadow-lg shadow-red-500/30 hover:brightness-110 active:scale-90 transition-all duration-150"
            title={isAr ? 'إنشاء' : 'Create'}
          >
            <span className="material-symbols-outlined text-[26px] font-bold">add</span>
          </button>
        </div>

        {/* 4. Cart */}
        <button
          onClick={() => setActiveTab('cart')}
          aria-label={isAr ? 'سلة المشتريات' : 'Cart'}
          aria-current={activeTab === 'cart' || activeTab === 'checkout' ? 'page' : undefined}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center relative transition-all active:scale-90 duration-150 ${
            activeTab === 'cart' || activeTab === 'checkout' 
              ? 'text-[#d00000] scale-105'
              : 'text-gray-400 hover:text-gray-600'
          }`}
          title={isAr ? 'السلة' : 'Cart'}
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'cart' || activeTab === 'checkout' ? "'FILL' 1" : "'FILL' 0" }}
          >
            shopping_bag
          </span>
          {totalCartCount > 0 && (
            <span className="absolute top-0 right-1/4 bg-[#d00000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-fade-in">
              {totalCartCount}
            </span>
          )}
          <span className="text-[10px] font-medium tracking-tight">
            {isAr ? 'السلة' : 'Cart'}
          </span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          aria-label={isAr ? 'الملف الشخصي' : 'Profile'}
          aria-current={activeTab === 'profile' ? 'page' : undefined}
          className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-all active:scale-90 duration-150 ${
            activeTab === 'profile' 
              ? 'text-[#d00000] scale-105'
              : 'text-gray-400 hover:text-gray-600'
          }`}
          title={isAr ? 'حسابي' : 'Profile'}
        >
          {user?.profile?.avatar_url ? (
            <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${activeTab === 'profile' ? 'border-[#d00000]' : 'border-transparent'}`}>
              <img src={user.profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <span 
              className="material-symbols-outlined text-[24px]"
              style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
            >
              person
            </span>
          )}
          <span className="text-[10px] font-medium tracking-tight">
            {isAr ? 'حسابي' : 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  );
}
