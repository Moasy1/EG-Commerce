import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';

// Mobile Screens
import DiscoverReels from './DiscoverReels';
import Marketplace from './Marketplace';
import ProductDetail from './ProductDetail';
import UnifiedCart from './UnifiedCart';
import ProfileCloset from './ProfileCloset';

// Desktop Screens
import DesktopFeed from '../components/desktop/DesktopFeed';
import DesktopMarketplace from '../components/desktop/DesktopMarketplace';
import DesktopProductDetail from '../components/desktop/DesktopProductDetail';
import DesktopSellerDashboard from '../components/desktop/DesktopSellerDashboard';
import DesktopCreatorAnalytics from '../components/desktop/DesktopCreatorAnalytics';

export default function ScreenShowcase() {
  const { setActiveTab, language, setLanguage } = useApp();
  const [platformView, setPlatformView] = useState('desktop'); // 'desktop' | 'mobile'

  const isAr = language === 'ar';

  const mobileScreens = isAr ? [
    {
      num: 1,
      title: 'تغذية اكتشاف الفيديوهات',
      desc: 'فيديوهات قصيرة من صناع محتوى مصريين مع منتجات قابلة للشراء.',
      tabId: 'reels',
      component: <DiscoverReels />
    },
    {
      num: 2,
      title: 'البحث والاكتشاف',
      desc: 'ابحث عن ما تحبه مع الفئات، والعلامات التجارية، وصناع المحتوى.',
      tabId: 'shop',
      component: <Marketplace />
    },
    {
      num: 3,
      title: 'تفاصيل المنتج',
      desc: 'كل ما تحتاج معرفته عن المقاسات، البائع، التوصيل، والتقييمات.',
      tabId: 'product',
      component: <ProductDetail />
    },
    {
      num: 4,
      title: 'سلة التسوق والدفع',
      desc: 'تسوق بسهولة وأمان مع خيارات دفع متعددة وتوصيل لجميع أنحاء مصر.',
      tabId: 'cart',
      component: <UnifiedCart />
    },
    {
      num: 5,
      title: 'ملف صانع المحتوى / البائع',
      desc: 'تابع صناع المحتوى المفضلين لديك، واكشف منتجاتهم ومفضلاتهم.',
      tabId: 'profile',
      component: <ProfileCloset />
    }
  ] : [
    {
      num: 1,
      title: 'Video Discovery Feed',
      desc: 'Short videos from Egyptian creators with shoppable product tags.',
      tabId: 'reels',
      component: <DiscoverReels />
    },
    {
      num: 2,
      title: 'Search & Discovery',
      desc: 'Find what you love with categories, trending styles and new arrivals.',
      tabId: 'shop',
      component: <Marketplace />
    },
    {
      num: 3,
      title: 'Product Detail',
      desc: 'Everything you need to know — sizes, seller info, delivery and reviews.',
      tabId: 'product',
      component: <ProductDetail />
    },
    {
      num: 4,
      title: 'Cart & Checkout',
      desc: 'Simple, secure and convenient checkout with local delivery.',
      tabId: 'cart',
      component: <UnifiedCart />
    },
    {
      num: 5,
      title: 'Creator / Vendor Profile',
      desc: 'Follow your favorite creators, explore their videos and shop their products.',
      tabId: 'profile',
      component: <ProfileCloset />
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#fcfbfa] text-slate-900 flex flex-col font-sans select-none overflow-x-auto pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      {/* ========================================================================= */}
      {/* 1. MASTER HEADER (Matching Image 3 & Image 4)                             */}
      {/* ========================================================================= */}
      <header className="w-full bg-white border-b border-gray-100 py-4 px-4 md:px-8 shadow-xs">
        <div className="max-w-[1780px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Logo & Subtitle */}
          <div className="flex items-center gap-3.5">
            <EgLogo className="w-10 h-10" color="#d00000" />
            <div className={isAr ? "text-right" : "text-left"}>
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                  EG-Commerce
                </h1>
                <span className="hidden sm:inline text-xs font-bold text-slate-700">
                  {isAr ? 'منصة التجارة الاجتماعية للأزياء المصرية' : 'Social Commerce for Egyptian Fashion'}
                </span>
              </div>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {isAr ? 'اكتشف · تسوق · ادعم المبدعين المحليين' : 'Discover · Shop · Support Local Creators'}
              </p>
            </div>
          </div>

          {/* Center: Platform Switcher (Desktop Web vs Mobile App) */}
          <div className="flex items-center p-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-bold shadow-inner">
            <button
              onClick={() => setPlatformView('desktop')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                platformView === 'desktop'
                  ? 'bg-[#d00000] text-white shadow-md'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
              <span>{isAr ? '💻 شاشات الديسكتوب (5 Screens)' : '💻 Desktop Version (5 Screens)'}</span>
            </button>

            <button
              onClick={() => setPlatformView('mobile')}
              className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                platformView === 'mobile'
                  ? 'bg-[#d00000] text-white shadow-md'
                  : 'text-gray-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">smartphone</span>
              <span>{isAr ? '📱 شاشات الجوال (5 Phones)' : '📱 Mobile App (5 Phones)'}</span>
            </button>
          </div>

          {/* Right: Language toggle & Slogan */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(l => l === 'ar' ? 'en' : 'ar')}
              className="px-3 py-1 rounded-full border border-gray-200 text-xs font-bold bg-gray-50 hover:bg-gray-100 transition-colors shadow-xs"
            >
              <span>{isAr ? '🇬🇧 English' : '🇪🇬 العربية'}</span>
            </button>

            <div className="hidden xl:flex flex-col items-end text-end">
              <div className="text-[11px] font-mono font-bold tracking-widest text-gray-500 uppercase">
                {isAr ? 'أشخاص حقيقيون / أسلوب حقيقي / مصر' : 'REAL PEOPLE / REAL STYLE / EGYPT'}
              </div>
              <div className="w-8 h-1 bg-[#d00000] rounded-full mt-1" />
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. DESKTOP VERSION (Matching Image 3 in 2-2-1 Grid)                        */}
      {/* ========================================================================= */}
      {platformView === 'desktop' && (
        <main className="max-w-[1780px] mx-auto w-full px-4 md:px-8 py-8 space-y-8 animate-fade-in">
          {/* Row 1: Desktop Feed (Screen 1) & Desktop Marketplace (Screen 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
            {/* Desktop Screen 1: Feed */}
            <div className="rounded-3xl border border-gray-200/90 bg-white shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all">
              <div className="px-4 py-2.5 bg-gray-100/90 border-b border-gray-200/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[11px] font-mono text-gray-400">eg-commerce.vercel.app/feed</span>
                <span className="material-symbols-outlined text-[15px] text-gray-400">lock</span>
              </div>
              <div className="h-[530px] overflow-y-auto">
                <DesktopFeed />
              </div>
            </div>

            {/* Desktop Screen 2: Explore Marketplace */}
            <div className="rounded-3xl border border-gray-200/90 bg-white shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all">
              <div className="px-4 py-2.5 bg-gray-100/90 border-b border-gray-200/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[11px] font-mono text-gray-400">eg-commerce.vercel.app/marketplace</span>
                <span className="material-symbols-outlined text-[15px] text-gray-400">lock</span>
              </div>
              <div className="h-[530px] overflow-y-auto">
                <DesktopMarketplace />
              </div>
            </div>
          </div>

          {/* Row 2: Desktop Product Detail (Screen 3) & Desktop Seller Dashboard (Screen 4) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
            {/* Desktop Screen 3: Product Detail */}
            <div className="rounded-3xl border border-gray-200/90 bg-white shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all">
              <div className="px-4 py-2.5 bg-gray-100/90 border-b border-gray-200/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[11px] font-mono text-gray-400">eg-commerce.vercel.app/product/galabeya</span>
                <span className="material-symbols-outlined text-[15px] text-gray-400">lock</span>
              </div>
              <div className="h-[530px] overflow-y-auto">
                <DesktopProductDetail />
              </div>
            </div>

            {/* Desktop Screen 4: Seller Dashboard */}
            <div className="rounded-3xl border border-gray-200/90 bg-white shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all">
              <div className="px-4 py-2.5 bg-gray-100/90 border-b border-gray-200/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-[11px] font-mono text-gray-400">eg-commerce.vercel.app/seller/dashboard</span>
                <span className="material-symbols-outlined text-[15px] text-gray-400">lock</span>
              </div>
              <div className="h-[530px] overflow-y-auto">
                <DesktopSellerDashboard />
              </div>
            </div>
          </div>

          {/* Row 3: Desktop Creator Analytics & Campaigns (Screen 5) */}
          <div className="rounded-3xl border border-gray-200/90 bg-white shadow-lg overflow-hidden flex flex-col group hover:shadow-xl transition-all">
            <div className="px-4 py-2.5 bg-gray-100/90 border-b border-gray-200/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[11px] font-mono text-gray-400">eg-commerce.vercel.app/creator/analytics</span>
              <span className="material-symbols-outlined text-[15px] text-gray-400">lock</span>
            </div>
            <div className="h-[560px] overflow-y-auto">
              <DesktopCreatorAnalytics />
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 3. MOBILE VERSION (Matching Image 4: 4 Value Props & 5 iPhones)            */}
      {/* ========================================================================= */}
      {platformView === 'mobile' && (
        <main className="max-w-[1780px] mx-auto w-full px-4 md:px-8 py-6 animate-fade-in space-y-8">
          {/* Top 4 Value Props (Matching Image 4 header) */}
          {isAr && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-2">
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#d00000] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">favorite</span>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900">أزياء مصرية</h4>
                  <p className="text-[10px] text-gray-500">محلية، أصيلة، ملهمة، الطموح</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#d00000] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">group</span>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900">صناع محتوى داعمين</h4>
                  <p className="text-[10px] text-gray-500">مواهب محلية، تأثير حقيقي</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#d00000] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900">تسوق مباشر</h4>
                  <p className="text-[10px] text-gray-500">من الفيديو إلى سلة المشتريات</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 text-[#d00000] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">play_circle</span>
                </div>
                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-900">فيديوهات قصيرة</h4>
                  <p className="text-[10px] text-gray-500">أسلوب حقيقي، غير تقليدي</p>
                </div>
              </div>
            </div>
          )}

          {/* 5 iPhone Devices in Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 xl:gap-8 items-start">
            {mobileScreens.map((item) => (
              <div key={item.num} className="flex flex-col items-center group">
                {/* iPhone 15 Frame */}
                <div className="relative w-full max-w-[320px] xl:max-w-[335px] h-[680px] xl:h-[700px] bg-white rounded-[44px] border-[8px] border-slate-900 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)] overflow-hidden flex flex-col group-hover:shadow-[0_25px_60px_-15px_rgba(208,0,0,0.22)] group-hover:border-slate-800 transition-all duration-300">
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-end px-2 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                  </div>

                  {/* Scaled Screen Body */}
                  <div className="w-full h-full overflow-y-auto overflow-x-hidden relative scrollbar-none flex flex-col scale-[0.88] origin-top w-[113.6%] h-[113.6%]">
                    {item.component}
                  </div>

                  {/* Home Bar Indicator */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-900/40 rounded-full z-50 pointer-events-none" />

                  {/* Click to open */}
                  <div 
                    onClick={() => setActiveTab(item.tabId)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-40 flex flex-col items-center justify-center p-4 cursor-pointer backdrop-blur-[2px]"
                  >
                    <button className="px-4 py-2 rounded-full bg-[#d00000] text-white text-xs font-bold shadow-xl flex items-center gap-1.5 hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[16px]">touch_app</span>
                      <span>{isAr ? 'فتح الشاشة تفاعلياً' : 'Open Screen Live'}</span>
                    </button>
                  </div>
                </div>

                {/* Numbered Red Badge & Title / Subtitle Underneath (Matching Image 4) */}
                <div className="mt-5 text-right w-full max-w-[320px] px-2 flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#d00000] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    {item.num}
                  </span>
                  <div>
                    <h3 
                      onClick={() => setActiveTab(item.tabId)}
                      className="text-sm font-bold text-slate-900 hover:text-[#d00000] cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
