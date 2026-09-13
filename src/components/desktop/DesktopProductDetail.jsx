import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function DesktopProductDetail() {
  const { selectedProduct, products, addToCart, setActiveTab } = useApp();
  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState('S');
  const [quantity, setQuantity] = useState(1);
  const [activeTabSub, setActiveTabSub] = useState('reviews');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Fallback to first product if none selected
  const product = selectedProduct || (products && products[0]) || {
    id: 'p-01',
    title: 'عباية كتان ناعمة وتوب عصري • Asymmetric Cutout Top & Linen Style',
    price: 1450,
    originalPrice: 1850,
    image: '/images/products/linen_abaya.jpg',
    video: '/images/products/linen_abaya.mp4',
    category: 'Linen كاجوال كتان',
    merchant: 'Talieska Studio • تاليسكا',
    rating: 4.9,
    reviewsCount: 142,
    sizes: ['S', 'M', 'L', 'XL']
  };

  const galleryThumbs = [
    product.image,
    ...(product.secondaryImages || [
      '/images/products/linen_abaya.jpg',
      '/images/products/silk_dress.jpg',
      '/images/products/wool_blazer.jpg'
    ])
  ].slice(0, 4);

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 20;

  return (
    <div className="w-full bg-white text-slate-900 flex flex-col font-sans min-h-[580px] overflow-hidden select-none text-left">
      {/* 1. Top Bar */}
      <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('reels')}>
          <EgLogo className="w-6 h-6" color="#d00000" />
          <span className="font-black text-xs tracking-tight">EG-Commerce</span>
        </div>

        <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 bg-gray-100/90 rounded-full text-xs text-gray-500">
          <span className="material-symbols-outlined text-[17px] text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search products, brands, orders..."
            className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">favorite</span></button>
          <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">chat</span></button>
          <button onClick={() => setActiveTab('cart')} className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">shopping_cart</span></button>
          <img src="/images/reels/reel_2.jpg" alt="User" className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-300" />
        </div>
      </div>

      {/* 2. Main Product Content (Split Two Columns) */}
      <div className="p-6 grid grid-cols-12 gap-6 flex-1 overflow-y-auto">
        {/* Left Column: Vertical Thumbnails + Main Large Photo / Video */}
        <div className="col-span-6 flex gap-3">
          {/* 4 Thumbnails Column */}
          <div className="flex flex-col gap-2 shrink-0">
            {galleryThumbs.map((img, i) => (
              <div
                key={i}
                onClick={() => { setSelectedThumb(i); setIsPlayingVideo(false); }}
                className={`w-14 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedThumb === i && !isPlayingVideo ? 'border-[#d00000] shadow-xs' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </div>
            ))}
            {product.video && (
              <button
                onClick={() => setIsPlayingVideo(true)}
                className={`w-14 h-16 rounded-xl overflow-hidden cursor-pointer border-2 flex flex-col items-center justify-center bg-slate-900 text-white gap-1 transition-all ${
                  isPlayingVideo ? 'border-[#d00000] shadow-xs' : 'border-gray-200 hover:border-red-400'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-red-400">play_circle</span>
                <span className="text-[9px] font-bold">ريل</span>
              </button>
            )}
          </div>

          {/* Main Large Product Photo / Video */}
          <div className="flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-black border border-gray-200 relative">
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
              <img 
                src={galleryThumbs[selectedThumb] || product.image} 
                alt={product.title} 
                className="w-full h-full object-cover"
              />
            )}
            
            {product.video && (
              <button
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm border border-white/20 hover:bg-black/80 transition-all z-10"
              >
                <span className="material-symbols-outlined text-[15px] text-red-400">
                  {isPlayingVideo ? 'photo' : 'play_circle'}
                </span>
                <span>{isPlayingVideo ? 'عرض الصور' : 'مشاهدة الريل • Watch Reel'}</span>
              </button>
            )}

            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#d00000] shadow-sm cursor-pointer z-10">
              <span className="material-symbols-outlined text-[18px]">favorite</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details, Pricing, Size, Actions, Vendor */}
        <div className="col-span-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Title & Reviews */}
            <div>
              <div className="text-[11px] font-bold text-[#d00000] uppercase tracking-wider mb-1">
                {product.category || 'Egyptian Fashion & Design'}
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {product.title}
              </h2>
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                <div className="flex items-center text-[#d00000]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[15px] fill-current">star</span>
                  ))}
                </div>
                <span className="font-bold text-slate-800">{product.rating || 4.9}</span>
                <span className="text-gray-400 font-medium">({product.reviewsCount || 124} reviews)</span>
              </div>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-xl font-black text-[#d00000]">EGP {product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">EGP {product.originalPrice}</span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-[#d00000] text-[10px] font-bold">
                {discountPercent}% OFF
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description || 'تصميم استثنائي راقٍ مصنوع بأيدي أمهر المصممين المصريين، يجمع بين البساطة والفخامة.'}
            </p>

            {/* Size Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-800">Size:</span>
              <div className="flex items-center gap-2">
                {(product.sizes || ['XS', 'S', 'M', 'L', 'XL']).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      selectedSize === sz
                        ? 'bg-[#d00000] text-white border-[#d00000] shadow-xs'
                        : 'bg-white text-slate-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center border border-gray-200 rounded-xl bg-white px-2 py-1.5">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 text-xs font-bold text-gray-500 hover:text-slate-900"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-2 text-xs font-bold text-gray-500 hover:text-slate-900"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart({
                    ...product,
                    selectedSize
                  });
                  setActiveTab('cart');
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] transition-colors flex items-center justify-center gap-1.5 shadow-md active:scale-98"
              >
                <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
                <span>Add to Cart • EGP {product.price * quantity}</span>
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <div 
            onClick={() => setActiveTab('storefront')}
            className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-100/80 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <img src="/images/brands/talieska_logo.jpg" alt="Seller" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-900">{product.merchant || 'Talieska Studio'}</span>
                  <span className="material-symbols-outlined text-[14px] text-sky-500 fill-current">verified</span>
                </div>
                <div className="text-[10px] text-gray-500">Cairo, Egypt • ★ 4.9 Verified Egyptian Merchant</div>
              </div>
            </div>
            <button className="px-3 py-1 rounded-lg border border-gray-300 text-slate-700 text-xs font-bold hover:bg-white">
              زيارة المتجر
            </button>
          </div>

          {/* 4 Trust Value Pillars */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 font-medium pt-1">
            <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span><span>Authentic Egyptian Fashion</span></div>
            <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-emerald-600">local_shipping</span><span>Ships within 1-3 days</span></div>
            <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-emerald-600">redeem</span><span>Free shipping over 1,000 EGP</span></div>
            <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[15px] text-emerald-600">restart_alt</span><span>Easy returns (14 days)</span></div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Tabs: Reviews, Shipping, Q&A */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-6 border-b border-gray-200 pb-2 mb-3 text-xs font-bold text-gray-500">
          <button 
            onClick={() => setActiveTabSub('reviews')} 
            className={`${activeTabSub === 'reviews' ? 'text-[#d00000] border-b-2 border-[#d00000] pb-2 -mb-2' : ''}`}
          >
            Reviews ({product.reviewsCount || 124})
          </button>
          <button 
            onClick={() => setActiveTabSub('shipping')} 
            className={`${activeTabSub === 'shipping' ? 'text-[#d00000] border-b-2 border-[#d00000] pb-2 -mb-2' : ''}`}
          >
            Shipping & Returns
          </button>
          <button 
            onClick={() => setActiveTabSub('qa')} 
            className={`${activeTabSub === 'qa' ? 'text-[#d00000] border-b-2 border-[#d00000] pb-2 -mb-2' : ''}`}
          >
            Q&A
          </button>
        </div>

        {/* Review Item Preview */}
        <div className="flex items-start gap-3 text-left">
          <img src="/images/reels/reel_2.jpg" alt="Reviewer" className="w-7 h-7 rounded-full object-cover" />
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">Salma A.</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700 text-[9px] font-bold">Verified Buyer</span>
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => <span key={i} className="material-symbols-outlined text-[12px] fill-current">star</span>)}
              </div>
            </div>
            <p className="text-[11px] text-gray-600">
              Amazing quality and flawless finish! Matches the video reel demonstration perfectly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
