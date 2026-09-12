import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import DesktopFeed from '../components/desktop/DesktopFeed';

export default function DiscoverReels() {
  const { openQuickBuy, openProductDetail, products, setActiveTab } = useApp();
  const [activeTabSub, setActiveTabSub] = useState('foryou');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(24500);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  // Target product for Screen 1 mobile view
  const shirtJacketProduct = {
    id: 'p-screen1',
    title: 'Oversized Shirt Jacket',
    category: 'Fashion • Cairo',
    price: 799,
    originalPrice: 950,
    image: '/images/products/linen_shirt.jpg',
    merchantId: 'm-1'
  };

  const toggleLike = () => {
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="w-full flex-1">
      {/* 1. DESKTOP VIEW (Screen 1: Discover Fashion You'll Love) */}
      <div className="hidden lg:block w-full max-w-[1780px] mx-auto px-4 md:px-8 py-6">
        <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
          <DesktopFeed />
        </div>
      </div>

      {/* 2. MOBILE VIEW (Screen 1: Immersive Video Feed) */}
      <div className="lg:hidden relative w-full h-[calc(100vh-64px)] max-h-[920px] bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans mx-auto max-w-[430px]">
        {/* iOS Status Bar */}
        <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 z-30 text-[13px] font-semibold text-white/90">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[15px]">wifi</span>
            <span className="material-symbols-outlined text-[18px]">battery_full</span>
          </div>
        </div>

        {/* Top Navigation Bar with Red Arch Logo & Feeds */}
        <div className="w-full px-4 py-2 flex items-center justify-between z-30">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-7 h-7" color="#d00000" />
          </div>

          {/* Feed Tabs */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            {[
              { id: 'foryou', label: 'For You' },
              { id: 'following', label: 'Following' },
              { id: 'fashion', label: 'Fashion' },
              { id: 'egypt', label: 'Egypt' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTabSub(tab.id)}
                className={`relative py-1 transition-all ${
                  activeTabSub === tab.id
                    ? 'text-white font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {activeTabSub === tab.id && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#d00000] rounded-full shadow-sm" />
                )}
              </button>
            ))}
          </div>

          {/* Right: Search & Live Icons */}
          <div className="flex items-center gap-2.5 text-white">
            <button onClick={() => setActiveTab('shop')} className="p-1 hover:text-[#d00000] transition-colors">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <button className="p-1 hover:text-[#d00000] transition-colors">
              <span className="material-symbols-outlined text-[20px]">live_tv</span>
            </button>
          </div>
        </div>

        {/* Full-Screen Background Video / Model Photo */}
        <div className="absolute inset-0 w-full h-full z-10">
          <img 
            src="/images/reels/reel_1.jpg" 
            alt="Mayar Fashion Cairo"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />
        </div>

        {/* Right Vertical Action Sidebar */}
        <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 text-white">
          <div className="relative cursor-pointer" onClick={() => setIsFollowed(!isFollowed)}>
            <img 
              src="/images/reels/reel_2.jpg" 
              alt="Maya Fashion" 
              className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-lg"
            />
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md transition-all ${
              isFollowed ? 'bg-emerald-500 text-white' : 'bg-[#d00000] text-white'
            }`}>
              {isFollowed ? '✓' : '+'}
            </div>
          </div>

          <button onClick={toggleLike} className="flex flex-col items-center group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isLiked ? 'bg-[#d00000] text-white scale-110' : 'bg-black/30 hover:bg-black/50 text-white'
            }`}>
              <span className="material-symbols-outlined text-[24px]">favorite</span>
            </div>
            <span className="text-[11px] font-medium mt-1 drop-shadow-md">
              {(likesCount / 1000).toFixed(1)}k
            </span>
          </button>

          <button onClick={() => setActiveTab('product')} className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all">
              <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
            </div>
            <span className="text-[11px] font-medium mt-1 drop-shadow-md">1.2k</span>
          </button>

          <button onClick={() => setIsSaved(!isSaved)} className="flex flex-col items-center group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isSaved ? 'bg-amber-500 text-white' : 'bg-black/30 hover:bg-black/50 text-white'
            }`}>
              <span className="material-symbols-outlined text-[24px]">bookmark</span>
            </div>
            <span className="text-[11px] font-medium mt-1 drop-shadow-md">4.5k</span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all">
              <span className="material-symbols-outlined text-[24px]">share</span>
            </div>
            <span className="text-[11px] font-medium mt-1 drop-shadow-md">Share</span>
          </button>
        </div>

        {/* Bottom Content Area */}
        <div className="relative z-30 p-4 pb-4 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">@mayaa.fashinn</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white/90">Creator</span>
            </div>
            <p className="text-xs text-white/90 leading-snug line-clamp-2">
              Linen vibes in Old Cairo ✨ Traditional touches with modern elegance. Tap below to get yours! #CairoFashion #LinenLove
            </p>
          </div>

          {/* Shoppable Product Card Banner */}
          <div 
            onClick={() => setActiveTab('product')}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 cursor-pointer hover:bg-black/75 transition-all shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/20">
                <img 
                  src={shirtJacketProduct.image} 
                  alt={shirtJacketProduct.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white line-clamp-1">{shirtJacketProduct.title}</span>
                  <span className="text-[10px] bg-[#d00000] text-white px-1.5 py-0.2 rounded font-bold">15% OFF</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-black text-white">EGP {shirtJacketProduct.price}</span>
                  <span className="text-[10px] text-gray-300 line-through">EGP {shirtJacketProduct.originalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickBuy(shirtJacketProduct);
              }}
              className="px-4 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <span>Shop Now</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
