import React, { useState } from 'react';
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

  const handleNextReel = () => {
    setCurrentReelIndex((prev) => (prev + 1) % reelsList.length);
    setIsLiked(false);
    setIsSaved(false);
  };

  const handlePrevReel = () => {
    setCurrentReelIndex((prev) => (prev - 1 + reelsList.length) % reelsList.length);
    setIsLiked(false);
    setIsSaved(false);
  };

  const toggleLike = () => {
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="w-full flex-1">
      {/* 1. DESKTOP VIEW (Screen 1: Discover Fashion You'll Love - Matching Image 3) */}
      <div className="hidden lg:block w-full max-w-[1780px] mx-auto px-4 md:px-8 py-6">
        <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
          <DesktopFeed />
        </div>
      </div>

      {/* 2. MOBILE VIEW (Screen 1: Immersive Video Feed - Matching Image 4) */}
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
              { id: 'foryou', label: isAr ? 'لك' : 'For You' },
              { id: 'following', label: isAr ? 'المتابعة' : 'Following' },
              { id: 'fashion', label: isAr ? 'الموضة' : 'Fashion' },
              { id: 'egypt', label: isAr ? 'مصر' : 'Egypt' },
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

        {/* Full-Screen Background Video / Photo with Reel Transition */}
        <div className="absolute inset-0 w-full h-full z-10 transition-all duration-500">
          <img 
            src={currentReel.videoBg} 
            alt={currentReel.creatorHandle}
            className="w-full h-full object-cover object-center animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 pointer-events-none" />
        </div>

        {/* Floating Reel Navigation Arrows (Up / Down) */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          <button 
            onClick={handlePrevReel}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#d00000] transition-colors flex items-center justify-center shadow-lg"
            title="Previous Reel"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
          </button>
          <button 
            onClick={handleNextReel}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#d00000] transition-colors flex items-center justify-center shadow-lg"
            title="Next Reel"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
          </button>
        </div>

        {/* Right Vertical Action Sidebar (Matching Image 4) */}
        <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 text-white">
          {/* Creator Avatar with Red (+) Follow Badge */}
          <div className="relative cursor-pointer" onClick={() => setIsFollowed(!isFollowed)}>
            <img 
              src={currentReel.avatar} 
              alt={currentReel.creatorHandle} 
              className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-lg"
            />
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-bold shadow-md transition-all ${
              isFollowed ? 'bg-emerald-500 text-white' : 'bg-[#d00000] text-white'
            }`}>
              {isFollowed ? '✓' : '+'}
            </div>
          </div>

          {/* Like Button */}
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

          {/* Comments Button */}
          <button onClick={() => setIsCommentsOpen(true)} className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all">
              <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
            </div>
            <span className="text-[11px] font-medium mt-1 drop-shadow-md">{currentReel.comments}</span>
          </button>

          {/* Save / Bookmark Button */}
          <button onClick={() => setIsSaved(!isSaved)} className="flex flex-col items-center group">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isSaved ? 'bg-amber-500 text-white' : 'bg-black/30 hover:bg-black/50 text-white'
            }`}>
              <span className="material-symbols-outlined text-[24px]">bookmark</span>
            </div>
            <span className="text-[11px] font-medium mt-1 drop-shadow-md">{currentReel.saves}</span>
          </button>

          {/* Share Button */}
          <button className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md flex items-center justify-center text-white transition-all">
              <span className="material-symbols-outlined text-[24px]">share</span>
            </div>
            <span className="text-[11px] font-medium mt-1 drop-shadow-md">{isAr ? 'مشاركة' : 'Share'}</span>
          </button>

          {/* Spinning Music Disc */}
          <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-white/60 flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
            <span className="material-symbols-outlined text-[16px] text-white">music_note</span>
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className={`relative z-30 p-4 pb-4 space-y-3 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{currentReel.creatorHandle}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full text-white/90">
                {isAr ? 'صانع محتوى' : 'Creator'}
              </span>
            </div>
            <p className="text-xs text-white/90 leading-snug line-clamp-2">
              {currentReel.caption}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-white/70">
              <span className="material-symbols-outlined text-[12px]">graphic_eq</span>
              <span>{currentReel.music}</span>
            </div>
          </div>

          {/* Shoppable Product Card Banner (Matching Image 4) */}
          <div 
            onClick={() => setActiveTab('product')}
            className="flex items-center justify-between p-2.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 cursor-pointer hover:bg-black/75 transition-all shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/20">
                <img 
                  src={currentReel.product.image} 
                  alt={currentReel.product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={isAr ? "text-right" : "text-left"}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white line-clamp-1">{currentReel.product.title}</span>
                  <span className="text-[10px] bg-[#d00000] text-white px-1.5 py-0.2 rounded font-bold">{currentReel.product.discount}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-black text-white">{currentReel.product.price} {isAr ? 'ج.م' : 'EGP'}</span>
                  <span className="text-[10px] text-gray-300 line-through">{currentReel.product.originalPrice} {isAr ? 'ج.م' : 'EGP'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickBuy(currentReel.product);
              }}
              className="px-4 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <span>{isAr ? 'اشتري الآن' : 'Shop Now'}</span>
              <span className="material-symbols-outlined text-[14px]">{isAr ? 'arrow_back' : 'arrow_forward'}</span>
            </button>
          </div>
        </div>

        {/* Interactive Comments Drawer */}
        {isCommentsOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end">
            <div className="w-full bg-white text-slate-900 rounded-t-3xl p-4 max-h-[70vh] flex flex-col shadow-2xl animate-fade-in text-right" dir="rtl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
                <h3 className="text-sm font-bold text-slate-900">التعليقات ({currentReel.comments})</h3>
                <button onClick={() => setIsCommentsOpen(false)} className="p-1 hover:text-[#d00000]">
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Comment Items */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                <div className="flex items-start gap-2.5">
                  <img src="/images/reels/reel_2.jpg" alt="User" className="w-7 h-7 rounded-full object-cover" />
                  <div className="bg-gray-100 p-2 rounded-2xl flex-1 text-xs">
                    <span className="font-bold block text-slate-800">مريم الشافعي</span>
                    <span>الكتان باين عليه تحفة! هل في شحن لإسكندرية؟ ❤️</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <img src="/images/reels/reel_1.jpg" alt="User" className="w-7 h-7 rounded-full object-cover" />
                  <div className="bg-gray-100 p-2 rounded-2xl flex-1 text-xs">
                    <span className="font-bold block text-slate-800">أحمد سامي</span>
                    <span>التطريز ممتاز جداً.. طلبت واحدة ووصلتني في 48 ساعة مع بوسطة 🚀</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <img src="/images/products/linen_abaya.jpg" alt="User" className="w-7 h-7 rounded-full object-cover" />
                  <div className="bg-gray-100 p-2 rounded-2xl flex-1 text-xs">
                    <span className="font-bold block text-slate-800">هدى طارق</span>
                    <span>المقاس مظبوط بالظبط ولا اطلب نمرة أكبر؟</span>
                  </div>
                </div>
              </div>

              {/* Comment Input */}
              <div className="pt-3 border-t border-gray-100 flex items-center gap-2 mt-2">
                <input 
                  type="text" 
                  placeholder="أضف تعليقاً لطيفاً..."
                  className="flex-1 bg-gray-100 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#d00000]"
                />
                <button className="px-3 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold">
                  إرسال
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
