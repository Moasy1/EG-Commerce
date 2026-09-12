import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function DesktopProductDetail() {
  const { 
    selectedProduct, 
    products, 
    merchants, 
    addToCart, 
    setActiveTab, 
    language 
  } = useApp();

  const isAr = language === 'ar';

  const product = selectedProduct || products[0] || {
    id: 'p-1',
    title: 'جلابية مصرية مطرزة',
    price: 850,
    originalPrice: 1100,
    category: 'أزياء مصرية',
    image: '/images/products/linen_abaya.jpg',
    description: 'جلابية مصرية فاخرة مصنوعة بحب وبأيادٍ مصرية أصيلة من أجود خامات الكتان الطبيعي والقطن طويل التيلة.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    merchantId: 'm-01'
  };

  const merchant = merchants.find(m => m.id === product.merchantId) || merchants[0] || {
    name: 'Nile Threads • نيل ثريدز',
    rating: 4.9,
    reviewsCount: 180,
    subdomain: 'nilethreads.eg-commerce.com'
  };

  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTabSub, setActiveTabSub] = useState('reviews');
  const [addedToast, setAddedToast] = useState(false);

  const galleryThumbs = [
    product.image || '/images/products/linen_abaya.jpg',
    '/images/products/silk_dress.jpg',
    '/images/reels/reel_1.jpg',
    '/images/products/wool_blazer.jpg'
  ];

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize, quantity });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  const availableSizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="w-full bg-white text-slate-900 flex flex-col font-sans min-h-[580px] overflow-hidden select-none relative" dir={isAr ? 'rtl' : 'ltr'}>
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
            placeholder={isAr ? "ابحث عن منتجات، علامات تجارية، طلبات..." : "Search products, brands, orders..."}
            className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
            onKeyDown={(e) => { if (e.key === 'Enter') setActiveTab('shop'); }}
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
      <div className="p-6 grid grid-cols-12 gap-8 flex-1 overflow-y-auto">
        {/* Left Column: Vertical Thumbnails + Main Large Photo */}
        <div className="col-span-12 lg:col-span-6 flex gap-3.5">
          {/* 4 Thumbnails Column */}
          <div className="flex flex-col gap-2 shrink-0">
            {galleryThumbs.map((img, i) => (
              <div
                key={i}
                onClick={() => setSelectedThumb(i)}
                className={`w-14 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedThumb === i ? 'border-[#d00000] shadow-xs scale-105' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img src={img} alt="Thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Main Large Product Photo */}
          <div className="flex-1 aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 border border-gray-200 relative shadow-sm">
            <img 
              src={galleryThumbs[selectedThumb]} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3.5 end-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#d00000] shadow-md cursor-pointer">
              <span className="material-symbols-outlined text-[20px]">favorite</span>
            </div>
            {product.category && (
              <span className="absolute bottom-3 start-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                {product.category}
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Details, Pricing, Size, Actions, Vendor */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between space-y-5 text-start">
          <div className="space-y-4">
            {/* Title & Reviews */}
            <div>
              <div className="flex items-center gap-1.5 text-amber-500 text-xs font-bold mb-1">
                <span className="material-symbols-outlined text-[15px] fill-current">star</span>
                <span>{product.rating || 4.9}</span>
                <span className="text-gray-400 font-normal">({product.reviewsCount || 124} {isAr ? 'تقييم موثق' : 'reviews'})</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 leading-snug">{product.title}</h1>
            </div>

            {/* Price & Discount */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-[#d00000]">EGP {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through">EGP {product.originalPrice.toLocaleString()}</span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-red-100 text-[#d00000] text-xs font-bold">
                22% OFF
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {product.description || 'قطعة أزياء مصرية أصيلة منسوجة بأجود خامات الكتان الطبيعي والتطريز اليدوي الفاخر، صممت لتمنحك إطلالة راقية في كافة المناسبات.'}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{isAr ? 'المقاس:' : 'Size:'}</span>
                <span className="text-gray-500 underline cursor-pointer text-[11px]">{isAr ? 'دليل المقاسات' : 'Size Guide'}</span>
              </div>
              <div className="flex items-center gap-2">
                {availableSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-9 h-9 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
                      selectedSize === s
                        ? 'border-[#d00000] bg-[#d00000] text-white shadow-xs'
                        : 'border-gray-200 text-slate-700 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart Action */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-2 py-1.5 shrink-0">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                >
                  -
                </button>
                <span className="w-8 text-center font-mono font-bold text-xs">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-2xl bg-[#d00000] text-white font-black text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">add_shopping_cart</span>
                <span>{isAr ? `أضف إلى السلة • EGP ${(product.price * quantity).toLocaleString()}` : `Add to Cart • EGP ${(product.price * quantity).toLocaleString()}`}</span>
              </button>
            </div>

            {/* Seller Info Card */}
            <div 
              onClick={() => setActiveTab('storefront')}
              className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300 shrink-0">
                  <img src="/images/brands/talieska_logo.jpg" alt="Vendor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">{merchant.name}</span>
                    <span className="material-symbols-outlined text-[15px] text-blue-500">verified</span>
                  </div>
                  <span className="text-[10px] text-gray-500 block">القاهرة، مصر • 4.9 ★ (180+ طلب ناجح)</span>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-800 hover:border-[#d00000] hover:text-[#d00000] transition-colors">
                {isAr ? 'زيارة المتجر' : 'Visit Store'}
              </button>
            </div>

            {/* 4 Trust Value Props */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-[11px] text-gray-600 font-medium">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                <span className="material-symbols-outlined text-[18px] text-[#d00000]">verified</span>
                <span>{isAr ? 'أزياء مصرية أصيلة 100%' : 'Authentic Egyptian Fashion'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                <span className="material-symbols-outlined text-[18px] text-[#d00000]">local_shipping</span>
                <span>{isAr ? 'شحن سريع خلال 1-3 أيام' : 'Ships within 1-3 days'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                <span className="material-symbols-outlined text-[18px] text-[#d00000]">payments</span>
                <span>{isAr ? 'دفع عند الاستلام وإنستاباي' : 'Cash on Delivery & InstaPay'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-gray-50/80 border border-gray-100">
                <span className="material-symbols-outlined text-[18px] text-[#d00000]">assignment_return</span>
                <span>{isAr ? 'استبدال ومعاينة خلال 14 يوم' : '14-day Easy Returns'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Added Toast */}
      {addedToast && (
        <div className="fixed bottom-6 end-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span>{isAr ? `تمت إضافة القطعة إلى سلتك بنجاح! 🛍️` : `Product added to your cart successfully! 🛍️`}</span>
        </div>
      )}
    </div>
  );
}
