import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';

export default function DiscoverReels() {
  const { openQuickBuy, openProductDetail, products, setActiveTab } = useApp();
  const [activeTabSub, setActiveTabSub] = useState('foryou');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(24500);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  // Target product for Screen 1
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
    <div className="relative w-full h-[844px] max-h-[100vh] bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. iOS Status Bar */}
      <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 z-30 text-[13px] font-semibold text-white/90">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
        </div>
      </div>

      {/* 2. Top Navigation Bar with Red Arch Logo & Feeds */}
      <div className="w-full px-4 py-2 flex items-center justify-between z-30">
        {/* Left: Red Arch Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('reels')}>
          <EgLogo className="w-7 h-7" color="#d00000" />
        </div>

        {/* Center: Feed Tabs */}
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

        {/* Right: Search & Cast/Live Icons */}
        <div className="flex items-center gap-2.5 text-white">
          <button onClick={() => setActiveTab('shop')} className="p-1 hover:text-[#d00000] transition-colors">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>
          <button className="p-1 hover:text-[#d00000] transition-colors">
            <span className="material-symbols-outlined text-[20px]">live_tv</span>
          </button>
        </div>
      </div>

      {/* 3. Full-Screen Background Video / Model Photo */}
      <div className="absolute inset-0 w-full h-full z-10">
        <img 
          src="/images/reels/reel_1.jpg" 
          alt="Mayar Fashion Cairo"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />
      </div>

      {/* 4. Right Vertical Action Sidebar */}
      <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 text-white">
        {/* Creator Avatar with Red (+) Follow Badge */}
        <div className="relative cursor-pointer" onClick={() => setIsFollowed(!isFollowed)}>
          <img 
            src="/images/reels/reel_2.jpg" 
            alt="mayaa.fashinn"
            className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md"
          />
          {!isFollowed && (
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#d00000] text-white flex items-center justify-center text-[12px] font-bold shadow-sm">
              +
            </div>
          )}
        </div>

        {/* Like */}
        <button onClick={toggleLike} className="flex flex-col items-center gap-0.5 group">
          <div className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-125">
            <span 
              className={`material-symbols-outlined text-[28px] ${isLiked ? 'text-[#d00000]' : 'text-white'}`}
              style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </div>
          <span className="text-[11px] font-semibold drop-shadow-md">
            {(likesCount / 1000).toFixed(1)}K
          </span>
        </button>

        {/* Comment */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">chat_bubble</span>
          </div>
          <span className="text-[11px] font-semibold drop-shadow-md">512</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-[26px]">share</span>
          </div>
          <span className="text-[11px] font-semibold drop-shadow-md">3.1K</span>
        </div>

        {/* Bookmark / Save */}
        <button onClick={() => setIsSaved(!isSaved)} className="flex flex-col items-center gap-0.5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <span 
              className={`material-symbols-outlined text-[26px] ${isSaved ? 'text-amber-400' : 'text-white'}`}
              style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
          </div>
          <span className="text-[11px] font-semibold drop-shadow-md">1.8K</span>
        </button>

        {/* Store Emblem Pill (Nada Fashion) */}
        <div 
          onClick={() => setActiveTab('profile')} 
          className="w-10 h-10 rounded-full border-2 border-[#d00000] p-0.5 overflow-hidden cursor-pointer shadow-md"
          title="Visit Nada Fashion"
        >
          <img src="/images/brands/talieska_logo.jpg" alt="Store" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>

      {/* 5. Bottom Left: Floating Product Card + Creator Info + Shop Now CTA */}
      <div className="relative z-30 px-4 pb-20 space-y-3 max-w-[80%]">
        {/* Shoppable Product Card Overlay */}
        <div 
          onClick={() => openProductDetail(shirtJacketProduct)}
          className="inline-flex items-center gap-2.5 bg-white/95 text-slate-900 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md cursor-pointer hover:bg-white transition-all group"
        >
          <img 
            src={shirtJacketProduct.image} 
            alt={shirtJacketProduct.title}
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold leading-tight line-clamp-1">{shirtJacketProduct.title}</span>
            <span className="text-xs font-extrabold text-[#d00000]">EGP {shirtJacketProduct.price}</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-gray-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all">
            chevron_right
          </span>
        </div>

        {/* Creator Info & Caption */}
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-1.5">
            <span 
              onClick={() => setActiveTab('profile')}
              className="text-sm font-bold text-white drop-shadow hover:underline cursor-pointer"
            >
              @mayaa.fashinn
            </span>
            <span className="material-symbols-outlined text-[15px] text-sky-400 fill-current">
              verified
            </span>
          </div>
          <p className="text-xs text-white/90 drop-shadow leading-snug line-clamp-2">
            Casual vibes in Cairo ✨ #EgyptianFashion #OOTD #Style
          </p>
        </div>

        {/* Big Red [ 🛍️ Shop Now ] CTA */}
        <button
          onClick={() => openQuickBuy(shirtJacketProduct)}
          className="w-full max-w-[200px] py-2.5 px-4 rounded-full bg-[#d00000] hover:bg-[#b00000] text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          <span>Shop Now</span>
        </button>
      </div>
    </div>
  );
}
