import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import DesktopProductDetail from '../components/desktop/DesktopProductDetail';
import SizeGuideModal from '../components/common/SizeGuideModal';

export default function ProductDetail() {
  const { selectedProduct, addToCart, setActiveTab, navigateToProfile, isAr, language, isSubdomainMode, merchants, navigateToStorefront } = useApp();

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
    merchantId: '171842bd-daed-40ef-853f-917eab2ed437'
  };

  const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];

  const availableSwatches = product.colorSwatches && product.colorSwatches.length > 0
    ? product.colorSwatches
    : (product.colors && product.colors.length > 0 
        ? product.colors.map(c => ({ name: c, hex: '#8b5a2b' })) 
        : []);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || null);
  const [selectedColor, setSelectedColor] = useState(availableSwatches[0]?.name || null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const productImages = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : ['/images/products/the_sharp_v_yellow_1.webp']);

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    addToCart(product, { size: selectedSize, color: selectedColor });
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
            onClick={() => setActiveTab(isSubdomainMode ? 'storefront' : 'shop')} 
            className="p-1.5 text-slate-800 hover:text-[#d00000] transition-colors"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[24px] rtl:rotate-180">chevron_left</span>
          </button>

          <div className="cursor-pointer" onClick={() => setActiveTab(isSubdomainMode ? 'storefront' : 'reels')}>
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
          {isPlayingVideo ? (
            <video 
              src={product.video || '/images/reels/fashion_citrine_blazer.mp4'} 
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

          {/* Watch Reel / Photo Badge (Always Accessible) */}
          <button 
            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
            className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg border border-white/20 hover:bg-black/90 transition-all z-10"
          >
            <span className="material-symbols-outlined text-[16px] text-red-400">
              {isPlayingVideo ? 'photo' : 'smart_display'}
            </span>
            <span>{isPlayingVideo ? (isAr ? 'عرض الصور' : 'Show Photos') : (isAr ? 'مشاهدة الريل • Watch Reel' : 'Watch Reel')}</span>
          </button>

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
        <div className="p-4 text-start space-y-4">
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

          {/* Color Swatches Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>{isAr ? 'اللون المحدد:' : 'Selected Color:'}</span>
              <span className="text-[#d00000] font-bold text-xs">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {availableSwatches.map((swatch, idx) => {
                const isSelected = selectedColor === swatch.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColor(swatch.name)}
                    className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-[#d00000] bg-red-50/50 text-[#d00000] shadow-xs'
                        : 'border-gray-200 bg-white text-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <span 
                      className={`w-4 h-4 rounded-full border border-black/10 shrink-0 transition-transform ${
                        isSelected ? 'scale-110 ring-2 ring-offset-1 ring-[#d00000]' : 'group-hover:scale-105'
                      }`}
                      style={{ backgroundColor: swatch.hex || '#d4af37' }}
                    />
                    <span>{swatch.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>{isAr ? 'اختر المقاس' : 'Select Size'}</span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-[#d00000] hover:text-[#900000] underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span className="material-symbols-outlined text-[15px]">straighten</span>
                <span>{isAr ? 'دليل المقاسات' : 'Size Guide'}</span>
                {product.sizeGuide && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d00000] animate-ping" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[44px] h-11 px-3 rounded-xl font-bold text-xs transition-all border ${
                    selectedSize === size
                      ? 'border-[#d00000] bg-[#d00000] text-white shadow-sm'
                      : 'border-gray-200 text-slate-700 hover:border-gray-300 bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Dedicated Shoppable Reel Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-black text-white flex items-center justify-between border border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-600/20 text-[#d00000] border border-red-500/30 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">smart_display</span>
              </div>
              <div>
                <h4 className="text-xs font-bold flex items-center gap-1.5">
                  <span>{isAr ? 'فيديو ريل المنتج وتنسيقه' : 'Shoppable Video Reel'}</span>
                  <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 text-[9px] font-mono">HD</span>
                </h4>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {isAr ? 'شاهد حركة القماش وتنسيق اللوك بالصوت والصورة' : 'Watch fabric motion and styling in action'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setIsPlayingVideo(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-md active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[15px]">play_arrow</span>
              <span>{isAr ? 'تشغيل' : 'Play'}</span>
            </button>
          </div>

          {/* Seller Profile Card */}
          {(() => {
            const matchedMerchant = (merchants || []).find(m => 
              (product?.merchantId && (m.id === product.merchantId || m.merchant_id === product.merchantId)) ||
              (product?.merchantSlug && m.slug?.toLowerCase() === product.merchantSlug.toLowerCase()) ||
              (product?.merchant && (
                m.name?.toLowerCase().includes(product.merchant.toLowerCase()) ||
                product.merchant.toLowerCase().includes(m.name?.toLowerCase()) ||
                (m.store_name && m.store_name.toLowerCase().includes(product.merchant.toLowerCase()))
              ))
            );

            const isDripFit = Boolean(
              product?.title?.toLowerCase().includes('drip fit') || 
              product?.description?.toLowerCase().includes('drip fit') ||
              product?.merchant?.toLowerCase().includes('drip fit') ||
              product?.merchantSlug?.toLowerCase() === 'drip-fit'
            );

            const sellerName = isDripFit 
              ? 'Drip Fit • دريب فيت' 
              : (matchedMerchant?.name || product?.merchant || 'Drip Fit • دريب فيت');

            const sellerSlug = isDripFit 
              ? 'drip-fit' 
              : (matchedMerchant?.slug || product?.merchantSlug || 'drip-fit');

            const sellerLogo = isDripFit 
              ? (matchedMerchant?.logo || '/images/brands/dripfit_logo.png') 
              : (matchedMerchant?.logo || (sellerName.toLowerCase().includes('khan') ? '/images/products/copper_lantern.jpg' : '/images/brands/dripfit_logo.png'));

            const sellerLocation = isDripFit
              ? (isAr ? 'القاهرة، مصر • براند مصري معتمد' : 'Cairo, Egypt • Verified Egyptian Brand')
              : (isAr ? 'القاهرة، مصر • ★ 4.9 متجر مصري معتمد' : 'Cairo, Egypt • ★ 4.9 Verified Egyptian Merchant');

            const handleSellerClick = () => {
              if (isSubdomainMode) {
                setActiveTab('storefront');
              } else if (navigateToStorefront && sellerSlug) {
                navigateToStorefront(sellerSlug);
              } else if (navigateToProfile) {
                navigateToProfile(sellerSlug);
              } else {
                setActiveTab('profile');
              }
            };

            return (
              <div 
                onClick={handleSellerClick}
                className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs border border-gray-200 overflow-hidden">
                    <img src={sellerLogo} alt={sellerName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{sellerName}</h4>
                    <span className="text-[10px] text-gray-500">{sellerLocation}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSellerClick();
                  }}
                  className="px-3 py-1 rounded-full border border-gray-300 text-xs font-bold text-slate-800 hover:border-[#d00000] hover:text-[#d00000]"
                >
                  {isAr ? 'زيارة المتجر' : 'Visit'}
                </button>
              </div>
            );
          })()}
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
            <span>{isAr ? 'إضافة للسلة' : 'Add to Cart'} • EGP {product.price}</span>
          </button>
        </div>

        {/* Added to Cart Toast */}
        {addedToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-1.5 animate-bounce">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span>Added to Cart! تم الإضافة للسلة</span>
          </div>
        )}

        {/* Size Guide Modal */}
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          product={product}
          selectedSize={selectedSize}
          onSelectSize={(sz) => setSelectedSize(sz)}
          isAr={isAr}
        />
      </div>
    </div>
  );
}
