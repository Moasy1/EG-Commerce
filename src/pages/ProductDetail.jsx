import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import DesktopProductDetail from '../components/desktop/DesktopProductDetail';

export default function ProductDetail() {
  const { selectedProduct, addToCart, setActiveTab } = useApp();
  const [selectedSize, setSelectedSize] = useState('S');
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fallback to Linen Co-ord Set if no product selected
  const product = selectedProduct || {
    id: 'p-fashion-blazer',
    title: 'Citrine Yellow Oversized Blazer',
    price: 1850,
    image: '/images/reels/reel_1.jpg',
    video: '/images/reels/reel_1.mp4',
    category: 'Women',
    rating: 4.9,
    reviewsCount: 142,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    merchantId: 'm-01'
  };
  const productImages = product.images && product.images.length > 0 ? product.images : [
    product.image,
    product.image.replace('.jpg', '_2.jpg').replace('.webp', '_2.webp').replace('.png', '_2.png'),
    product.image.replace('.jpg', '_3.jpg').replace('.webp', '_3.webp').replace('.png', '_3.png'),
    product.image.replace('.jpg', '_4.jpg').replace('.webp', '_4.webp').replace('.png', '_4.png'),
  ];

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="w-full flex-1">
      {/* 1. DESKTOP VIEW (Screen 3: Desktop Product Detail with 4-thumbnail strip) */}
      <div className="hidden md:block w-full max-w-[1780px] mx-auto px-4 md:px-8 py-6">
        <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
          <DesktopProductDetail />
        </div>
      </div>

      {/* 2. MOBILE VIEW (Screen 3: Product Detail) */}
      <div className="md:hidden w-full min-h-[calc(100vh-64px)] bg-white text-slate-900 flex flex-col font-sans select-none pb-24 relative max-w-[430px] mx-auto">

        {/* Top Navigation Bar: Back Arrow, Center Red Logo, Heart & Share */}
        <div className="w-full px-4 py-2 flex items-center justify-between">
          <button 
            onClick={() => setActiveTab('shop')} 
            className="p-1.5 text-slate-800 hover:text-[#d00000] transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">chevron_left</span>
          </button>

          <div className="cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-7 h-7" color="#d00000" />
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <button 
              onClick={() => setIsFavorited(!isFavorited)}
              className="p-1.5 hover:text-[#d00000] transition-colors"
            >
              <span 
                className="material-symbols-outlined text-[22px]"
                style={{ color: isFavorited ? '#d00000' : 'inherit', fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
            <button className="p-1.5 hover:text-[#d00000] transition-colors">
              <span className="material-symbols-outlined text-[22px]">share</span>
            </button>
          </div>
        </div>

        {/* Big Product Image with Slider Dots / Video Toggle */}
        <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
          {isPlayingVideo && product.video ? (
            <video 
              src={product.video} 
              autoPlay 
              loop 
              playsInline 
              controls 
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
              onScroll={handleScroll}
            >
              {productImages.map((imgSrc, i) => (
                <img 
                  key={i}
                  src={imgSrc} 
                  alt={`${product.title} - Image ${i+1}`}
                  className="w-full h-full object-cover shrink-0 snap-center"
                  onError={(e) => {
                    // Fallback to main image if the mock numbered images don't exist
                    if (e.target.src !== product.image) {
                      e.target.src = product.image;
                    }
                  }}
                />
              ))}
            </div>
          )}

          {/* Watch Reel / Photo Badge */}
          {product.video && (
            <button 
              onClick={() => setIsPlayingVideo(!isPlayingVideo)}
              className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/65 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg border border-white/20 hover:bg-black/85 transition-all z-10"
            >
              <span className="material-symbols-outlined text-[16px] text-red-400">
                {isPlayingVideo ? 'photo' : 'play_circle'}
              </span>
              <span>{isPlayingVideo ? 'عرض الصورة' : 'مشاهدة الريل • Watch Reel'}</span>
            </button>
          )}

          {!isPlayingVideo && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full">
              {productImages.map((_, i) => (
                <span 
                  key={i} 
                  className={`rounded-full transition-all duration-300 ${
                    i === currentImageIndex ? 'w-2 h-2 bg-[#d00000]' : 'w-1.5 h-1.5 bg-white/70'
                  }`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="p-4 text-left space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#d00000] uppercase tracking-wider">Egyptian Heritage Linen</span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span>{product.rating || 4.8}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount || 124} reviews)</span>
              </div>
            </div>
            <h1 className="text-xl font-black text-slate-900 leading-snug">{product.title}</h1>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-2xl font-black text-[#d00000]">EGP {product.price}</span>
              <span className="text-sm text-gray-400 line-through">EGP {Math.round(product.price * 1.25)}</span>
              <span className="text-[10px] font-bold bg-red-100 text-[#d00000] px-1.5 py-0.5 rounded">20% OFF</span>
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Select Size</span>
              <span className="text-gray-500 underline cursor-pointer">Size Guide</span>
            </div>
            <div className="flex items-center gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-11 h-11 rounded-xl font-bold text-xs transition-all border ${
                    selectedSize === size
                      ? 'border-[#d00000] bg-[#d00000] text-white shadow-sm'
                      : 'border-gray-200 text-slate-700 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Merchant Profile Card */}
          <div 
            onClick={() => setActiveTab('storefront')}
            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200/80 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                <img src="/images/brands/talieska_logo.jpg" alt="Merchant" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900">Talieska Studio</span>
                  <span className="material-symbols-outlined text-[14px] text-blue-500">verified</span>
                </div>
                <span className="text-[10px] text-gray-500">Cairo, Egypt • 4.9 ★ (180 orders)</span>
              </div>
            </div>
            <button className="px-3 py-1 rounded-full border border-gray-300 text-xs font-bold text-slate-800 hover:border-[#d00000] hover:text-[#d00000]">
              Visit
            </button>
          </div>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 px-4 flex items-center gap-3 z-40 max-w-[430px] mx-auto">
          <button
            onClick={() => setActiveTab('cart')}
            className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-slate-700 hover:text-[#d00000] hover:border-[#d00000] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 h-12 rounded-2xl bg-[#d00000] text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
            <span>Add to Cart • EGP {product.price}</span>
          </button>
        </div>

        {/* Added to Cart Toast */}
        {addedToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5 animate-bounce">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span>Added to Cart! تم الإضافة للسلة</span>
          </div>
        )}
      </div>
    </div>
  );
}
