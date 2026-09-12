import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import DesktopFeed from '../components/desktop/DesktopFeed';

export default function DiscoverReels() {
  const { openQuickBuy, openProductDetail, products, setActiveTab, language } = useApp();
  const [activeTabSub, setActiveTabSub] = useState('foryou');
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(14200);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [desktopViewMode, setDesktopViewMode] = useState('player'); // 'player' or 'grid'
  
  // Gesture & Swipe Tracking
  const [touchStartY, setTouchStartY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastScrollTime = useRef(0);

  const isAr = language === 'ar';

  const reelsList = [
    {
      id: 'reel-1',
      creatorHandle: '@mayca.fashion',
      creatorName: 'مايا حسن • Maya Hassan',
      avatar: '/images/reels/reel_1.jpg',
      videoBg: '/images/reels/reel_1.jpg',
      caption: isAr 
        ? 'إطلالة كاجوال صيفية من شوارع القاهرة القديمة ✨ أناقة الكتان الطبيعي #CairoFashion #OOTD #كتان_مصري' 
        : 'Casual summer vibes in Old Cairo ✨ Authentic Egyptian linen comfort. #CairoFashion #OOTD',
      music: isAr ? 'ألحان مصرية أصيلة • استوديو القاهرة' : 'Original Sound • Cairo Beats',
      likes: 14200,
      comments: 842,
      saves: 312,
      product: {
        id: 'p-screen1',
        title: isAr ? 'جاكيت قميص كتان' : 'Oversized Shirt Jacket',
        price: 799,
        originalPrice: 950,
        discount: '15% OFF',
        image: '/images/products/linen_shirt.jpg'
      }
    },
    {
      id: 'reel-2',
      creatorHandle: '@sara.elmahdy',
      creatorName: 'سارة المهدي • Sara El Mahdy',
      avatar: '/images/reels/reel_2.jpg',
      videoBg: '/images/products/linen_abaya.jpg',
      caption: isAr 
        ? 'تفاصيل التطريز السيناوي اليدوي على الجلابية الملكية ❤️ فخامة التراث بأيادٍ مصرية #تطريز_يدوي #أزياء_مصرية' 
        : 'Royal Egyptian Galabeya with handcrafted embroidery ❤️ Egyptian Heritage. #EgyptianStyle',
      music: isAr ? 'نغمات العود المصري • دار الأوبرا' : 'Egyptian Oud Harmony',
      likes: 21500,
      comments: 1120,
      saves: 850,
      product: {
        id: 'p-galabeya',
        title: isAr ? 'جلابية مصرية مطرزة' : 'Embroidered Galabeya',
        price: 850,
        originalPrice: 1100,
        discount: '22% OFF',
        image: '/images/products/linen_abaya.jpg'
      }
    },
    {
      id: 'reel-3',
      creatorHandle: '@nour.adel',
      creatorName: 'نور عادل • Nour Adel',
      avatar: '/images/products/silk_dress.jpg',
      videoBg: '/images/products/silk_dress.jpg',
      caption: isAr 
        ? 'فستان حرير ناعم ومثالي لسهرات الإسكندرية والساحل 🌊 إطلالة تجمع البساطة والجاذبية #صيف_2026' 
        : 'Silk evening dress perfect for coastal sunsets 🌊 #Summer2026',
      music: isAr ? 'صوت البحر والرياح • إسكندرية' : 'Alexandria Breeze Sound',
      likes: 18900,
      comments: 630,
      saves: 420,
      product: {
        id: 'p-silk-dress',
        title: isAr ? 'فستان حرير ناعم' : 'Silk Summer Dress',
        price: 650,
        originalPrice: 850,
        discount: '20% OFF',
        image: '/images/products/silk_dress.jpg'
      }
    },
    {
      id: 'reel-4',
      creatorHandle: '@omar.fathy',
      creatorName: 'عمر فتحي • Omar Fathy',
      avatar: '/images/products/wool_blazer.jpg',
      videoBg: '/images/banners/khan_hero.jpg',
      caption: isAr 
        ? 'ستايل صيفي رجالي خفيف من أجود أنواع الكتان المصري الخالص بالقاهرة #موضة_رجالي #كتان' 
        : 'Summer linen shirt for men. Pure Egyptian cotton and linen. #MenStyle',
      music: isAr ? 'إيقاعات شرقية معاصرة' : 'Cairo Modern Grooves',
      likes: 9800,
      comments: 290,
      saves: 180,
      product: {
        id: 'p-men-shirt',
        title: isAr ? 'قميص كتان رجالي' : "Men's Linen Shirt",
        price: 490,
        originalPrice: 600,
        discount: '18% OFF',
        image: '/images/products/linen_shirt.jpg'
      }
    }
  ];

  const currentReel = reelsList[currentReelIndex];

  // Navigation functions
  const handleNextReel = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentReelIndex((prev) => (prev + 1) % reelsList.length);
    setIsLiked(false);
    setIsSaved(false);
    setTimeout(() => setIsTransitioning(false), 380);
  };

  const handlePrevReel = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentReelIndex((prev) => (prev - 1 + reelsList.length) % reelsList.length);
    setIsLiked(false);
    setIsSaved(false);
    setTimeout(() => setIsTransitioning(false), 380);
  };

  const toggleLike = () => {
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Mouse Wheel / Trackpad Scroll (Vertical Flick to swipe)
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 450) return;
    if (Math.abs(e.deltaY) > 25) {
      lastScrollTime.current = now;
      if (e.deltaY > 0) {
        handleNextReel();
      } else {
        handlePrevReel();
      }
    }
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    // Limit drag resistance
    setDragOffset(diff * 0.4);
  };

  const handleTouchEnd = (e) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    setTouchStartY(null);
    setDragOffset(0);

    if (diffY > 40) {
      // Swiped UP -> Next Reel
      handleNextReel();
    } else if (diffY < -40) {
      // Swiped DOWN -> Previous Reel
      handlePrevReel();
    }
  };

  // Mouse Drag Handlers for Desktop Swiping
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) return;
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientY - dragStartY;
    setDragOffset(diff * 0.4);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diffY = dragStartY - e.clientY;
    setDragOffset(0);
    if (diffY > 45) {
      handleNextReel();
    } else if (diffY < -45) {
      handlePrevReel();
    }
  };

  // Keyboard navigation (ArrowUp, ArrowDown, PageUp, PageDown)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevReel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReelIndex, isTransitioning]);

  // Render the core vertical interactive reel card
  const renderReelItem = (reel, index) => {
    const isActive = index === currentReelIndex;
    return (
      <div 
        key={reel.id}
        className="w-full h-full relative flex-shrink-0 flex flex-col justify-between select-none overflow-hidden"
      >
        {/* Full-Screen Background Image with Cinematic Scrim */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src={reel.videoBg} 
            alt={reel.creatorHandle}
            className="w-full h-full object-cover object-center pointer-events-none"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none" />
        </div>

        {/* Top Header Overlay: Feed Tabs & Quick Icons */}
        <div className="relative z-30 w-full px-4 pt-3 pb-2 flex items-center justify-between">
          {/* Red Arch Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-8 h-8 drop-shadow-md" color="#d00000" />
          </div>

          {/* Feed Tabs (لك / المتابعة / الموضة / مصر) */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            {[
              { id: 'foryou', label: isAr ? 'لك' : 'For You' },
              { id: 'following', label: isAr ? 'المتابعة' : 'Following' },
              { id: 'fashion', label: isAr ? 'الموضة' : 'Fashion' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTabSub(tab.id);
                }}
                className={`relative py-1 transition-all ${
                  activeTabSub === tab.id
                    ? 'text-white font-bold text-sm'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                {activeTabSub === tab.id && (
                  <span className="absolute -bottom-0.5 inset-x-0 h-0.5 bg-[#d00000] rounded-full shadow-sm" />
                )}
              </button>
            ))}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 text-white">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('shop');
              }} 
              className="p-1 hover:text-[#d00000] transition-colors"
              title="Search"
            >
              <span className="material-symbols-outlined text-[22px] drop-shadow-sm">search</span>
            </button>
          </div>
        </div>

        {/* Audio Track Floating Pill */}
        <div className="relative z-20 self-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[11px] flex items-center gap-1.5 border border-white/10 shadow-sm mt-1">
          <span className="material-symbols-outlined text-[14px] text-[#d00000] animate-pulse">music_note</span>
          <span className="truncate max-w-[200px]">{reel.music}</span>
        </div>

        {/* Main Content Area (Action Sidebar + Creator Info + Product Card) */}
        <div className="relative z-30 w-full p-4 flex flex-col justify-end space-y-3 pb-4">
          {/* Action Sidebar (Anchored on Right) */}
          <div className="absolute right-3 bottom-28 z-30 flex flex-col items-center gap-4 text-white">
            {/* Creator Avatar with Follow (+) */}
            <div 
              className="relative cursor-pointer group" 
              onClick={(e) => {
                e.stopPropagation();
                setIsFollowed(!isFollowed);
              }}
            >
              <img 
                src={reel.avatar} 
                alt={reel.creatorHandle} 
                className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-xl group-hover:scale-105 transition-transform"
              />
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md transition-all ${
                isFollowed ? 'bg-emerald-500 text-white' : 'bg-[#d00000] text-white'
              }`}>
                {isFollowed ? '✓' : '+'}
              </div>
            </div>

            {/* Like Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }} 
              className="flex flex-col items-center group"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all ${
                isLiked ? 'bg-[#d00000] text-white scale-110' : 'bg-black/40 hover:bg-black/60 text-white'
              }`}>
                <span className="material-symbols-outlined text-[24px]">favorite</span>
              </div>
              <span className="text-[11px] font-semibold mt-1 drop-shadow-md">
                {(likesCount / 1000).toFixed(1)}k
              </span>
            </button>

            {/* Comments Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsCommentsOpen(true);
              }} 
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white shadow-lg transition-all">
                <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
              </div>
              <span className="text-[11px] font-semibold mt-1 drop-shadow-md">{reel.comments}</span>
            </button>

            {/* Save / Bookmark Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
              }} 
              className="flex flex-col items-center group"
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg transition-all ${
                isSaved ? 'bg-amber-500 text-white' : 'bg-black/40 hover:bg-black/60 text-white'
              }`}>
                <span className="material-symbols-outlined text-[24px]">bookmark</span>
              </div>
              <span className="text-[11px] font-semibold mt-1 drop-shadow-md">{reel.saves}</span>
            </button>

            {/* Share Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({ title: reel.caption, url: window.location.href });
                }
              }} 
              className="flex flex-col items-center group"
            >
              <div className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center justify-center text-white shadow-lg transition-all">
                <span className="material-symbols-outlined text-[24px]">share</span>
              </div>
              <span className="text-[11px] font-semibold mt-1 drop-shadow-md">{isAr ? 'مشاركة' : 'Share'}</span>
            </button>

            {/* Spinning Music Disc */}
            <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-white/60 flex items-center justify-center shadow-lg animate-spin" style={{ animationDuration: '4s' }}>
              <span className="material-symbols-outlined text-[16px] text-white">music_note</span>
            </div>
          </div>

          {/* Bottom Left / Start Info (Creator Handle & Caption) */}
          <div className={`pr-16 space-y-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white drop-shadow-sm">{reel.creatorHandle}</span>
              <span className="text-[10px] bg-[#d00000] text-white px-1.5 py-0.5 rounded-full font-bold shadow-xs">
                {isAr ? 'صانع محتوى' : 'Creator'}
              </span>
            </div>
            <p className="text-xs text-white/95 leading-relaxed line-clamp-2 drop-shadow-sm">
              {reel.caption}
            </p>
          </div>

          {/* Shoppable Product Card Banner */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              openProductDetail(reel.product);
            }}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 cursor-pointer hover:bg-black/75 transition-all shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-14 rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/20">
                <img 
                  src={reel.product.image} 
                  alt={reel.product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={isAr ? "text-right" : "text-left"}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white line-clamp-1">{reel.product.title}</span>
                  <span className="text-[10px] bg-[#d00000] text-white px-1.5 py-0.2 rounded font-bold">{reel.product.discount}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-black text-white">{reel.product.price} {isAr ? 'ج.م' : 'EGP'}</span>
                  <span className="text-[10px] text-gray-300 line-through">{reel.product.originalPrice} {isAr ? 'ج.م' : 'EGP'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickBuy(reel.product);
              }}
              className="px-3.5 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <span>{isAr ? 'شراء فوري' : 'Shop Now'}</span>
              <span className="material-symbols-outlined text-[15px]">{isAr ? 'arrow_back' : 'arrow_forward'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center relative bg-[#121212] min-h-[calc(100vh-64px)]">
      {/* Top Desktop Controls Bar (Switch View & Swiping Hint) */}
      <div className="hidden lg:flex w-full max-w-[1780px] px-8 py-3 items-center justify-between text-white/80 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDesktopViewMode('player')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              desktopViewMode === 'player'
                ? 'bg-[#d00000] text-white shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            <span>{isAr ? 'مشغل الريلز (سحب عمودي)' : 'Interactive Reels (Swipe Mode)'}</span>
          </button>
          <button
            onClick={() => setDesktopViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              desktopViewMode === 'grid'
                ? 'bg-[#d00000] text-white shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            <span>{isAr ? 'شبكة الفيديوهات' : 'Feed Grid'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">mouse</span>
            {isAr ? 'استخدم عجلة الفأرة أو اسحب للأعلى/الأسفل' : 'Scroll wheel or drag up/down to swipe'}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">keyboard</span>
            {isAr ? 'الأسهم ↑ ↓ للتبديل السريع' : 'Use ↑ ↓ keys'}
          </span>
        </div>
      </div>

      {/* 1. DESKTOP GRID VIEW (when toggled to Grid) */}
      {desktopViewMode === 'grid' ? (
        <div className="hidden lg:block w-full max-w-[1780px] mx-auto px-8 py-4">
          <div className="rounded-3xl border border-gray-800 bg-white shadow-xl overflow-hidden">
            <DesktopFeed />
          </div>
        </div>
      ) : (
        /* 2. DESKTOP INTERACTIVE REELS CONTAINER (Center 9:16 Aspect with Vertical Swiping) */
        <div className="hidden lg:flex items-center justify-center w-full py-4 relative">
          {/* Ambient blurred backdrop of current reel */}
          <div 
            className="absolute inset-0 opacity-20 filter blur-3xl bg-cover bg-center pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url(${currentReel.videoBg})` }}
          />

          {/* Up & Down Side Navigation Arrows */}
          <div className="flex flex-col gap-3 mr-6 z-20">
            <button 
              onClick={handlePrevReel}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#d00000] backdrop-blur-md text-white transition-all flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 border border-white/20"
              title="Previous Reel (↑)"
            >
              <span className="material-symbols-outlined text-[28px]">arrow_upward</span>
            </button>
            <button 
              onClick={handleNextReel}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#d00000] backdrop-blur-md text-white transition-all flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 border border-white/20"
              title="Next Reel (↓)"
            >
              <span className="material-symbols-outlined text-[28px]">arrow_downward</span>
            </button>
          </div>

          {/* Centered Phone Frame for Vertical Reels */}
          <div 
            className="w-[420px] h-[780px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 bg-black relative flex flex-col z-10 cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setIsDragging(false); setDragOffset(0); }}
          >
            {/* Smooth Sliding Reel Container */}
            <div 
              className="w-full h-full transition-transform duration-500 ease-out"
              style={{
                transform: `translateY(calc(-${currentReelIndex * 100}% + ${dragOffset}px))`,
              }}
            >
              {reelsList.map((reel, idx) => renderReelItem(reel, idx))}
            </div>

            {/* Reel Counter Dots Indicator */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5 pointer-events-none">
              {reelsList.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-1.5 rounded-full transition-all ${
                    idx === currentReelIndex 
                      ? 'h-6 bg-[#d00000]' 
                      : 'h-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE FULL-SCREEN VIEW (Native Vertical Swipe Experience) */}
      <div 
        className="lg:hidden relative w-full h-[calc(100vh-64px)] max-h-[920px] bg-black text-white flex flex-col justify-between overflow-hidden select-none font-sans mx-auto max-w-[440px]"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setIsDragging(false); setDragOffset(0); }}
      >
        {/* Smooth Sliding Reels Container */}
        <div 
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(calc(-${currentReelIndex * 100}% + ${dragOffset}px))`,
          }}
        >
          {reelsList.map((reel, idx) => renderReelItem(reel, idx))}
        </div>

        {/* Floating Arrow Indicators for Mobile */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          <button 
            onClick={handlePrevReel}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#d00000] transition-colors flex items-center justify-center shadow-lg active:scale-90"
            title="Previous Reel"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
          </button>
          <button 
            onClick={handleNextReel}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#d00000] transition-colors flex items-center justify-center shadow-lg active:scale-90"
            title="Next Reel"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
          </button>
        </div>

        {/* Swipe Up Hint Badge (Fades after interaction) */}
        {currentReelIndex === 0 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[11px] font-medium flex items-center gap-1 animate-bounce pointer-events-none">
            <span className="material-symbols-outlined text-[14px]">swipe_up</span>
            <span>{isAr ? 'اسحب للأعلى للفيديو التالي' : 'Swipe up for next'}</span>
          </div>
        )}
      </div>

      {/* Interactive Comments Drawer */}
      {isCommentsOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex flex-col justify-end"
          onClick={() => setIsCommentsOpen(false)}
        >
          <div 
            className="w-full max-w-[500px] mx-auto bg-white text-slate-900 rounded-t-3xl p-5 max-h-[70vh] flex flex-col shadow-2xl animate-fade-in text-right"
            dir={isAr ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? `التعليقات (${currentReel.comments})` : `Comments (${currentReel.comments})`}
              </h3>
              <button 
                onClick={() => setIsCommentsOpen(false)} 
                className="p-1 hover:text-[#d00000] rounded-full hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Comment Items */}
            <div className="space-y-3.5 overflow-y-auto flex-1 pr-1">
              <div className="flex items-start gap-2.5">
                <img src="/images/reels/reel_2.jpg" alt="User" className="w-8 h-8 rounded-full object-cover shadow-xs" />
                <div className="bg-gray-100 p-2.5 rounded-2xl flex-1 text-xs">
                  <span className="font-bold block text-slate-800">مريم الشافعي</span>
                  <span className="text-slate-600">الكتان باين عليه تحفة! هل في شحن لإسكندرية؟ ❤️</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <img src="/images/reels/reel_1.jpg" alt="User" className="w-8 h-8 rounded-full object-cover shadow-xs" />
                <div className="bg-gray-100 p-2.5 rounded-2xl flex-1 text-xs">
                  <span className="font-bold block text-slate-800">أحمد سامي</span>
                  <span className="text-slate-600">التطريز ممتاز جداً.. طلبت واحدة ووصلتني في 48 ساعة مع بوسطة 🚀</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <img src="/images/products/linen_abaya.jpg" alt="User" className="w-8 h-8 rounded-full object-cover shadow-xs" />
                <div className="bg-gray-100 p-2.5 rounded-2xl flex-1 text-xs">
                  <span className="font-bold block text-slate-800">هدى طارق</span>
                  <span className="text-slate-600">المقاس مظبوط بالظبط ولا اطلب نمرة أكبر؟</span>
                </div>
              </div>
            </div>

            {/* Comment Input */}
            <div className="pt-3 border-t border-gray-100 flex items-center gap-2 mt-3">
              <input 
                type="text" 
                placeholder={isAr ? "أضف تعليقاً لطيفاً..." : "Add a comment..."}
                className="flex-1 bg-gray-100 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#d00000]"
              />
              <button className="px-4 py-2.5 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all">
                {isAr ? 'إرسال' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
