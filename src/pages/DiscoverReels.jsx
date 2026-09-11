import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function DiscoverReels() {
  const { openQuickBuy, openProductDetail, products } = useApp();
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(42800);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [feedType, setFeedType] = useState('foryou');

  const allProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;

  const reelsData = [
    {
      id: 'reel-1',
      creator: '@nour_style',
      creatorName: 'نور ستايل • القاهرة',
      creatorAvatar: '/images/brands/talieska_logo.jpg',
      videoBackdrop: '/images/reels/reel_1.jpg',
      caption: 'تنسيق عباية الكتان المغسول للمساء في شارع المعز 🇪🇬 أقمشة مصرية 100% تدوم طويلاً • كود الخصم: NOUR15',
      likes: '48.2K',
      comments: '1.4K',
      shares: '3.8K',
      product: allProducts[0] || INITIAL_PRODUCTS[0]
    },
    {
      id: 'reel-2',
      creator: '@salma_egypt',
      creatorName: 'سلمى الأحمدي • الزمالك',
      creatorAvatar: '/images/brands/talieska_logo.jpg',
      videoBackdrop: '/images/reels/reel_2.jpg',
      caption: 'إطلالة كيمونو رملي صيفي بالرووف لاونج المطل على النيل ☀️ إحساس الخفة والأناقة',
      likes: '34.8K',
      comments: '980',
      shares: '2.1K',
      product: allProducts[1] || INITIAL_PRODUCTS[1] || allProducts[0]
    },
    {
      id: 'reel-3',
      creator: '@cairo_atelier',
      creatorName: 'مشاغل تاليسكا بالقاهرة',
      creatorAvatar: '/images/brands/talieska_logo.jpg',
      videoBackdrop: '/images/reels/reel_3.jpg',
      caption: 'كواليس التطريز اليدوي بخيوط الذهب الخالص 🪡 فخر الصناعة الوطنية والحرفية المصرية العريقة',
      likes: '62.1K',
      comments: '2.1K',
      shares: '5.4K',
      product: allProducts[2] || INITIAL_PRODUCTS[2] || allProducts[0]
    },
    {
      id: 'reel-4',
      creator: '@khan_artisan',
      creatorName: 'ورش خان الخليلي التاريخية',
      creatorAvatar: '/images/products/copper_lantern.jpg',
      videoBackdrop: '/images/reels/reel_4.jpg',
      caption: 'طرق ونقش النحاس اليدوي بالأساليب التراثية الفاطمية 🏮 تحف معمارية لا تتكرر',
      likes: '29.4K',
      comments: '870',
      shares: '1.9K',
      product: allProducts[4] || allProducts[0]
    }
  ];

  const currentReel = reelsData[currentReelIndex];
  const currentProduct = currentReel.product;

  const nextReel = () => {
    setCurrentReelIndex((prev) => (prev + 1) % reelsData.length);
    setIsLiked(false);
  };

  const prevReel = () => {
    setCurrentReelIndex((prev) => (prev - 1 + reelsData.length) % reelsData.length);
    setIsLiked(false);
  };

  const toggleLike = () => {
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col bg-surface select-none pb-20 md:pb-6">
      {/* Reel Viewport Container */}
      <div className="relative w-full max-w-2xl mx-auto h-[calc(100vh-8rem)] md:h-[740px] md:my-4 rounded-none md:rounded-3xl overflow-hidden shadow-2xl bg-surface-container-lowest group/reel">
        {/* Editorial Visual Reel Layer */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url('${currentReel.videoBackdrop}')` }}
        >
          {/* Vignette and Contrast Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
        </div>

        {/* Top Feed Tabs (For You / Following) */}
        <div className="absolute top-4 inset-x-0 flex items-center justify-center gap-6 z-20">
          <button 
            onClick={() => setFeedType('foryou')}
            className={`relative py-1 font-bold text-sm tracking-wide transition-all flex flex-col items-center ${
              feedType === 'foryou' ? 'text-white drop-shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>For You • لك</span>
            {feedType === 'foryou' && (
              <span className="w-5 h-0.5 rounded-full bg-secondary mt-1 shadow-sm" />
            )}
          </button>
          <button 
            onClick={() => setFeedType('following')}
            className={`relative py-1 font-bold text-sm tracking-wide transition-all flex flex-col items-center ${
              feedType === 'following' ? 'text-white drop-shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>Following • المتابَعين</span>
            {feedType === 'following' && (
              <span className="w-5 h-0.5 rounded-full bg-secondary mt-1 shadow-sm" />
            )}
          </button>
        </div>

        {/* Audio Track Tag */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white shadow-sm border border-white/10">
          <span className="material-symbols-outlined text-[16px] animate-pulse text-secondary">music_note</span>
          <span className="text-xs truncate max-w-[130px]">Cairo Ambient Vibes • Track #04</span>
        </div>

        {/* Carousel Navigation Arrows (Hover on Desktop) */}
        <div className="absolute top-1/2 -translate-y-1/2 inset-x-2 flex justify-between z-20 pointer-events-none">
          <button 
            onClick={prevReel}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/reel:opacity-100 transition-opacity hover:bg-black/70 pointer-events-auto shadow-lg"
            title="السابق"
          >
            <span className="material-symbols-outlined text-[24px]">chevron_right</span>
          </button>
          <button 
            onClick={nextReel}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover/reel:opacity-100 transition-opacity hover:bg-black/70 pointer-events-auto shadow-lg"
            title="التالي"
          >
            <span className="material-symbols-outlined text-[24px]">chevron_left</span>
          </button>
        </div>

        {/* Reel Progress Dots */}
        <div className="absolute top-16 right-4 z-20 flex flex-col gap-1.5">
          {reelsData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentReelIndex(idx)}
              className={`w-1.5 rounded-full transition-all ${
                currentReelIndex === idx ? 'h-6 bg-secondary' : 'h-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* Left Interactive Rail (RTL) */}
        <aside className="absolute bottom-32 left-3 z-30 flex flex-col items-center gap-4 text-white">
          {/* Creator Avatar & Follow */}
          <div className="relative flex flex-col items-center mb-1">
            <div className="w-12 h-12 rounded-full p-0.5 bg-white/20 backdrop-blur-sm border border-white/30 overflow-hidden shadow-lg">
              <img 
                src={currentReel.creatorAvatar} 
                alt={currentReel.creator} 
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
              className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform active:scale-125 hover:bg-black/60 text-white"
            >
              <span 
                className={`material-symbols-outlined text-[24px] transition-colors ${
                  isLiked ? 'text-secondary' : 'text-white'
                }`}
                style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
            <span className="text-xs mt-1 drop-shadow-sm font-semibold">{currentReel.likes}</span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center">
            <button className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 hover:bg-black/60 text-white">
              <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
            </button>
            <span className="text-xs mt-1 drop-shadow-sm font-semibold">{currentReel.comments}</span>
          </div>

          {/* Save / Bookmark */}
          <div className="flex flex-col items-center">
            <button 
              onClick={() => setIsSaved(prev => !prev)}
              className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 hover:bg-black/60 text-white"
            >
              <span 
                className={`material-symbols-outlined text-[24px] ${isSaved ? 'text-secondary' : 'text-white'}`}
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
            <span className="text-xs mt-1 drop-shadow-sm font-semibold">حفظ</span>
          </div>

          {/* Next Reel Indicator */}
          <div className="flex flex-col items-center mt-1">
            <button 
              onClick={nextReel}
              className="w-11 h-11 rounded-full bg-secondary/80 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 hover:bg-secondary text-on-secondary shadow-lg animate-bounce"
              title="الريل التالي"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_downward</span>
            </button>
          </div>
        </aside>

        {/* Creator Info & Caption */}
        <div className="absolute bottom-32 right-4 left-20 z-20 text-white text-right pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1.5 pointer-events-auto">
            <span className="font-serif text-base font-bold tracking-wide">{currentReel.creator}</span>
            <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-white/80 text-[10px] px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 font-sans">
              صانع محتوى معتمد
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/95 line-clamp-2 leading-relaxed drop-shadow">
            {currentReel.caption}
          </p>
        </div>

        {/* Quick Buy Editorial Drawer Card */}
        <div className="absolute bottom-3 inset-x-3 z-30 bg-surface-container-lowest/95 backdrop-blur-xl rounded-2xl p-3 shadow-2xl border border-surface-container-high/60">
          <div className="flex items-center gap-3">
            {/* Product Thumbnail */}
            <div 
              onClick={() => openProductDetail(currentProduct)}
              className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container cursor-pointer border border-surface-container-high group/thumb"
            >
              <img 
                src={currentProduct.image} 
                alt={currentProduct.title}
                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-1 right-1 bg-primary text-on-primary px-1.5 py-0.5 rounded-full text-[8px] leading-none font-bold">
                حصرى
              </div>
            </div>

            {/* Product Specs & Price */}
            <div 
              onClick={() => openProductDetail(currentProduct)}
              className="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5 text-right cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary font-bold truncate max-w-[140px]">{currentProduct.merchant}</span>
                <div className="flex items-center gap-0.5 text-on-surface">
                  <span className="material-symbols-outlined text-[14px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold">{currentProduct.rating}</span>
                </div>
              </div>

              <h3 className="text-xs font-bold text-on-surface truncate">
                {currentProduct.title}
              </h3>

              <div className="flex items-baseline justify-between mt-auto">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-base font-bold text-on-surface">{currentProduct.price.toLocaleString()}</span>
                  <span className="text-[10px] text-on-surface-variant font-bold">ج.م</span>
                  {currentProduct.originalPrice && (
                    <span className="text-[10px] text-outline line-through">{currentProduct.originalPrice.toLocaleString()} ج.م</span>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-secondary/15 text-secondary px-2 py-0.5 rounded-full border border-secondary/20">
                  <span className="material-symbols-outlined text-[12px]">stars</span>
                  <span className="text-[10px] font-bold">+{currentProduct.pointsEarned} نقطة</span>
                </div>
              </div>
            </div>

            {/* Quick Buy CTA */}
            <button 
              onClick={() => openQuickBuy(currentProduct)}
              className="h-20 w-20 rounded-xl bg-primary text-on-primary flex flex-col items-center justify-center gap-1 hover:bg-primary/90 transition-all active:scale-95 flex-shrink-0 shadow-lg"
            >
              <span className="material-symbols-outlined text-[22px]">flash_on</span>
              <span className="text-[11px] font-bold">شراء فوري</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
