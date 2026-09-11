import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function DiscoverReels() {
  const { openQuickBuy, openProductDetail } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(42800);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [feedType, setFeedType] = useState('foryou');

  const currentProduct = INITIAL_PRODUCTS[0];

  const toggleLike = () => {
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col bg-surface select-none pb-20 md:pb-6">
      {/* Reel Viewport Container */}
      <div className="relative w-full max-w-2xl mx-auto h-[calc(100vh-8rem)] md:h-[720px] md:my-4 rounded-none md:rounded-2xl overflow-hidden shadow-md bg-surface-container-lowest">
        {/* Editorial Visual Reel Layer */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('${currentProduct.image}')` }}
        >
          {/* Vignette and Contrast Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-primary/40 pointer-events-none" />
        </div>

        {/* Top Feed Tabs (For You / Following) */}
        <div className="absolute top-4 inset-x-0 flex items-center justify-center gap-6 z-20">
          <button 
            onClick={() => setFeedType('foryou')}
            className={`relative py-1 font-bold text-sm tracking-wide transition-all flex flex-col items-center ${
              feedType === 'foryou' ? 'text-on-primary' : 'text-on-primary/60 hover:text-on-primary'
            }`}
          >
            <span>For You</span>
            {feedType === 'foryou' && (
              <span className="w-5 h-0.5 bg-on-primary rounded-full mt-1" />
            )}
          </button>
          <button 
            onClick={() => setFeedType('following')}
            className={`relative py-1 font-bold text-sm tracking-wide transition-all flex flex-col items-center ${
              feedType === 'following' ? 'text-on-primary' : 'text-on-primary/60 hover:text-on-primary'
            }`}
          >
            <span>Following</span>
            {feedType === 'following' && (
              <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1" />
            )}
          </button>
        </div>

        {/* Audio Track Tag */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/40 backdrop-blur-md text-on-primary shadow-sm border border-white/10">
          <span className="material-symbols-outlined text-[16px] animate-pulse text-secondary-fixed">music_note</span>
          <span className="text-xs truncate max-w-[130px]">Original Audio • Lo-Fi Chill</span>
        </div>

        {/* Left Interactive Rail (RTL) */}
        <aside className="absolute bottom-28 left-3 z-30 flex flex-col items-center gap-4 text-on-primary">
          {/* Creator Avatar & Follow */}
          <div className="relative flex flex-col items-center mb-1">
            <div className="w-12 h-12 rounded-full p-0.5 bg-surface/30 backdrop-blur-sm">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA--c1EluTpdFZd8jp0TbEWVz4ErCjK5UWViwqGZ857kDbBlvhT02XlSzYQRbziZho4cgWA3b6LMujkD7o7HlkkA1wH5PPr3bx66Z6PftabagJsFCQwBxv1xHj79Dg4477QAnG0sLgGD7sEkVZhULtkxL9ciOnsswocbOc4iAwELmxCXAQMRxqzr_FekI50Q4K-da-VKWWTuk0dOm6cU7EASsego2-REhvzOz5w_nAdrkYDfEVTicaN"
                alt="Creator Avatar" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button 
              onClick={() => setIsFollowing(prev => !prev)}
              className="absolute -bottom-2 w-5 h-5 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-md transition-transform active:scale-75"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isFollowing ? 'check' : 'add'}
              </span>
            </button>
          </div>

          {/* Like */}
          <div className="flex flex-col items-center">
            <button 
              onClick={toggleLike}
              className="w-11 h-11 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center transition-transform active:scale-125 hover:bg-primary/50 text-on-primary"
            >
              <span 
                className={`material-symbols-outlined text-[24px] transition-colors ${
                  isLiked ? 'text-secondary' : 'text-on-primary'
                }`}
                style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
            <span className="text-xs mt-1 drop-shadow-sm font-semibold">42.8K</span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center">
            <button className="w-11 h-11 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 hover:bg-primary/50 text-on-primary">
              <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
            </button>
            <span className="text-xs mt-1 drop-shadow-sm font-semibold">1.2K</span>
          </div>

          {/* Save / Bookmark */}
          <div className="flex flex-col items-center">
            <button 
              onClick={() => setIsSaved(prev => !prev)}
              className="w-11 h-11 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 hover:bg-primary/50 text-on-primary"
            >
              <span 
                className={`material-symbols-outlined text-[24px] ${isSaved ? 'text-secondary-fixed' : 'text-on-primary'}`}
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
            <span className="text-xs mt-1 drop-shadow-sm font-semibold">14K</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center">
            <button className="w-11 h-11 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 hover:bg-primary/50 text-on-primary">
              <span className="material-symbols-outlined text-[24px] transform -scale-x-100">share</span>
            </button>
            <span className="text-xs mt-1 drop-shadow-sm font-semibold">Share</span>
          </div>
        </aside>

        {/* Creator Info & Caption */}
        <div className="absolute bottom-28 right-4 left-20 z-20 text-on-primary text-right pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1.5 pointer-events-auto">
            <span className="font-serif text-base font-semibold tracking-wide">@nour_style</span>
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-on-primary/70 text-[10px] px-1.5 py-0.5 rounded bg-on-primary/10">Verified Creator</span>
          </div>
          <p className="text-xs text-on-primary/95 line-clamp-2 leading-relaxed">
            ستايلينج كاجوال لصيف القاهرة، الكتان المصري الطبيعي 100% ✨ كود خصم إضافي: <b>NOUR15</b>
          </p>
        </div>

        {/* Quick Buy Editorial Drawer Card */}
        <div className="absolute bottom-3 inset-x-3 z-30 bg-surface-container-lowest/95 backdrop-blur-xl rounded-xl p-3 shadow-xl border border-surface-container-high/60">
          <div className="flex items-center gap-3">
            {/* Product Thumbnail */}
            <div 
              onClick={() => openProductDetail(currentProduct)}
              className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container cursor-pointer"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAKhGQRyouK880_bTQ1_mcFJYdJknmkrqAP-GcAH13iN-SSU9DMvpUB1_izQvcsDhwFfRxaICcqNvRY1wYTsFMqnBd7rNgwGuvCEsfE26YyRwWmULCzNhO3F2iSEnBbWHH0yFQxy9kao8dv56NIfuADGi2fKuP70HrsMrPnEBmEfiwmu8B0Vu-b8JtANuranQJiz0iM8HD-gkY0iTN3moa6iZhuMCAFfc-TScbCmXQ5KS2loCuzylP" 
                alt={currentProduct.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 right-1 bg-primary text-on-primary px-1 py-0.5 rounded text-[8px] leading-none font-bold">
                Exclusive
              </div>
            </div>

            {/* Product Specs & Price */}
            <div 
              onClick={() => openProductDetail(currentProduct)}
              className="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5 text-right cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary font-semibold">{currentProduct.merchant}</span>
                <div className="flex items-center gap-0.5 text-on-surface">
                  <span className="material-symbols-outlined text-[14px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold">{currentProduct.rating}</span>
                </div>
              </div>

              <h3 className="text-xs font-semibold text-on-surface truncate">
                {currentProduct.title}
              </h3>

              <div className="flex items-baseline justify-between mt-auto">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-base font-bold text-on-surface">{currentProduct.price.toLocaleString()}</span>
                  <span className="text-[10px] text-on-surface-variant font-bold">EGP</span>
                  <span className="text-[10px] text-outline line-through">{currentProduct.originalPrice.toLocaleString()} EGP</span>
                </div>
                <div className="flex items-center gap-1 bg-secondary-fixed/50 text-on-secondary-fixed-variant px-1.5 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[12px]">stars</span>
                  <span className="text-[10px] font-semibold">+{currentProduct.pointsEarned} Pts</span>
                </div>
              </div>
            </div>

            {/* Quick Buy CTA */}
            <button 
              onClick={() => openQuickBuy(currentProduct)}
              className="h-20 w-16 rounded-lg bg-primary text-on-primary flex flex-col items-center justify-center gap-1 hover:bg-secondary transition-all active:scale-95 flex-shrink-0 shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">flash_on</span>
              <span className="text-[11px] font-bold">Quick Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
