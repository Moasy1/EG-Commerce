import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import DesktopProductDetail from '../components/desktop/DesktopProductDetail';

export default function ProductDetail() {
  const { selectedProduct, addToCart, setActiveTab } = useApp();
  const [selectedSize, setSelectedSize] = useState('S');
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Fallback to Linen Co-ord Set if no product selected
  const product = selectedProduct || {
    id: 'p-linen-coord',
    title: 'Linen Co-ord Set',
    price: 1250,
    image: '/images/reels/reel_1.jpg',
    category: 'Women',
    rating: 4.8,
    reviewsCount: 124,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    merchantId: 'm-1'
  };

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div className="w-full flex-1">
      {/* 1. DESKTOP VIEW (Screen 3: Desktop Product Detail with 4-thumbnail strip) */}
      <div className="hidden lg:block w-full max-w-[1780px] mx-auto px-4 md:px-8 py-6">
        <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
          <DesktopProductDetail />
        </div>
      </div>

      {/* 2. MOBILE VIEW (Screen 3: Product Detail) */}
      <div className="lg:hidden w-full min-h-[calc(100vh-64px)] bg-white text-slate-900 flex flex-col font-sans select-none pb-24 relative max-w-[430px] mx-auto">
        {/* iOS Status Bar */}
        <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-slate-800">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[15px]">wifi</span>
            <span className="material-symbols-outlined text-[18px]">battery_full</span>
          </div>
        </div>

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

        {/* Big Product Image with Slider Dots */}
        <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-2 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#d00000]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>
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
