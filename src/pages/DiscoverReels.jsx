import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function DiscoverReels() {
  const { openQuickBuy, openProductDetail } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(4280);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [feedType, setFeedType] = useState('foryou'); // 'foryou' | 'following'

  const currentProduct = INITIAL_PRODUCTS[0];

  const toggleLike = () => {
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <div className="relative w-full flex-1 flex flex-col bg-surface select-none pb-20 md:pb-6">
      {/* Reel Viewport Container */}
      <div className="relative w-full max-w-2xl mx-auto h-[calc(100vh-8rem)] md:h-[720px] md:my-4 rounded-none md:rounded-2xl overflow-hidden shadow-2xl bg-surface-container-lowest">
        {/* Background Editorial Visual Layer */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url('${currentProduct.image}')`
          }}
        >
          {/* Gradients and Contrast Scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/95 via-surface/30 to-surface/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Top Floating Feed Switcher */}
        <div className="absolute top-4 inset-x-0 flex items-center justify-center gap-6 z-20">
          <button 
            onClick={() => setFeedType('foryou')}
            className={`relative py-1 font-bold text-base transition-all flex flex-col items-center ${
              feedType === 'foryou' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>لك</span>
            {feedType === 'foryou' && (
              <span className="w-5 h-0.5 bg-primary rounded-full mt-1 shadow-[0_0_8px_rgba(255,70,70,0.8)]" />
            )}
          </button>
          <button 
            onClick={() => setFeedType('following')}
            className={`relative py-1 font-bold text-base transition-all flex flex-col items-center ${
              feedType === 'following' ? 'text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            <span>المتابعون</span>
            {feedType === 'following' && (
              <span className="w-5 h-0.5 bg-secondary rounded-full mt-1 shadow-[0_0_8px_rgba(255,184,0,0.8)]" />
            )}
          </button>
        </div>

        {/* Top Sound Control */}
        <button
          onClick={() => setIsMuted(prev => !prev)}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-surface-container-low/60 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-90"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>

        {/* Floating Audio Track Pill */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/40 backdrop-blur-md text-white shadow-sm border border-white/10">
          <span className="material-symbols-outlined text-[16px] text-secondary animate-pulse">music_note</span>
          <span className="text-xs truncate max-w-[130px]">صوت أصلي - إيقاع شرقي كلاسيك</span>
        </div>

        {/* Interactive Action Rail (Left side in RTL) */}
        <aside className="absolute bottom-28 left-4 z-30 flex flex-col items-center gap-4 text-white">
          {/* Creator Avatar & Follow Button */}
          <div className="relative flex flex-col items-center mb-1">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-primary to-secondary shadow-lg">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZv9gw2oRrJXoipcG4_zjKKbFTkjPBAfducf2TrVLv9aicAV3y9i-MnmIktqOKCf_76Vyv93WEC3Mr9OvobtOtxA4FepmXHDdA8QVFKydJfU7OdjNv1-y3x25q6PYVC9F1_hge_w4uXUOoni36WnmVe03b9EDQAL4dnEHDR4cgkgvtxtQ_bGebQi411CyE8TSvzM_uVn_ISTDbLJYLqe0H3KkkNqVdXxF2ez_vjzYyxRpDUMVqMiK6"
                alt="Creator Avatar" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <button 
              onClick={() => setIsFollowing(prev => !prev)}
              className={`absolute -bottom-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-75 ${
                isFollowing ? 'bg-tertiary text-white' : 'bg-primary text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isFollowing ? 'check' : 'add'}
              </span>
            </button>
          </div>

          {/* Like Action */}
          <div className="flex flex-col items-center gap-0.5">
            <button 
              onClick={toggleLike}
              className="w-11 h-11 rounded-full bg-surface-container-low/70 backdrop-blur-md flex items-center justify-center transition-all active:scale-125 shadow-lg border border-white/10 group"
            >
              <span 
                className={`material-symbols-outlined text-[26px] transition-colors ${
                  isLiked ? 'text-primary' : 'text-white group-hover:text-primary'
                }`}
                style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
            <span className="text-xs font-bold drop-shadow">{likesCount.toLocaleString()}</span>
          </div>

          {/* Comments */}
          <div className="flex flex-col items-center gap-0.5">
            <button 
              className="w-11 h-11 rounded-full bg-surface-container-low/70 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-95 shadow-lg border border-white/10"
            >
              <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
            </button>
            <span className="text-xs font-bold drop-shadow">128</span>
          </div>

          {/* Bookmark */}
          <div className="flex flex-col items-center gap-0.5">
            <button 
              onClick={() => setIsSaved(prev => !prev)}
              className="w-11 h-11 rounded-full bg-surface-container-low/70 backdrop-blur-md flex items-center justify-center transition-transform active:scale-95 shadow-lg border border-white/10"
            >
              <span 
                className={`material-symbols-outlined text-[24px] ${isSaved ? 'text-secondary' : 'text-white'}`}
                style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
              >
                bookmark
              </span>
            </button>
            <span className="text-xs font-bold drop-shadow">940</span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center gap-0.5">
            <button 
              className="w-11 h-11 rounded-full bg-surface-container-low/70 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-95 shadow-lg border border-white/10"
            >
              <span className="material-symbols-outlined text-[24px]">share</span>
            </button>
            <span className="text-xs font-bold drop-shadow">مشاركة</span>
          </div>

          {/* Rotating Vinyl */}
          <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center p-1 animate-spin shadow-xl ring-1 ring-white/20" style={{ animationDuration: '6s' }}>
            <div 
              className="w-full h-full rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url('${currentProduct.image}')` }}
            />
          </div>
        </aside>

        {/* Bottom Right Creator Info & Captions (In RTL, Right is the start) */}
        <div className="absolute right-4 left-24 bottom-28 z-20 flex flex-col gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-white drop-shadow">@layla.designer</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-tertiary/20 text-tertiary text-[10px] font-bold border border-tertiary/30">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              صانعة محتوى معتمدة
            </span>
          </div>
          <p className="text-sm text-white/95 leading-relaxed drop-shadow line-clamp-2">
            ستايلينج لفستان الكتان المصري مع درابيه صيفي راقي! احصلي عليه مع كود خصم حصري 15% مع نقاط إضافية 👇
            <span className="font-bold text-primary mr-1">#أزياء_مصرية</span>
            <span className="font-bold text-primary mr-1">#ريلز_تسوق</span>
          </p>
        </div>

        {/* Pinned Quick Buy Product Card (Floating above bottom bar) */}
        <div className="absolute inset-x-4 bottom-4 z-30">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low/90 backdrop-blur-xl border border-white/15 shadow-2xl">
            {/* Clickable Product Info */}
            <div 
              onClick={() => openProductDetail(currentProduct)}
              className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
            >
              <img 
                src={currentProduct.image} 
                alt={currentProduct.title}
                className="w-12 h-14 rounded-lg object-cover border border-white/15"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-primary font-bold">{currentProduct.merchant}</span>
                <h4 className="text-xs font-bold text-white truncate">{currentProduct.title}</h4>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-sm font-black text-white">{currentProduct.price} ج.م</span>
                  <span className="text-[10px] text-secondary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">stars</span>
                    +{currentProduct.pointsEarned} نقطة
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Buy CTA */}
            <button
              onClick={() => openQuickBuy(currentProduct)}
              className="px-4 py-2 rounded-full bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-lg shadow-primary/30 transition-transform active:scale-95 flex items-center gap-1 shrink-0"
            >
              <span className="material-symbols-outlined text-[16px]">flash_on</span>
              <span>شراء سريع</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
