import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';

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
    <div className="w-full min-h-[844px] bg-white text-slate-900 flex flex-col font-sans select-none pb-24 relative">
      {/* 1. iOS Status Bar */}
      <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-slate-800">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
        </div>
      </div>

      {/* 2. Top Navigation Bar: Back Arrow, Center Red Logo, Heart & Share */}
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
              className={`material-symbols-outlined text-[22px] ${isFavorited ? 'text-[#d00000] fill-current' : ''}`}
            >
              favorite
            </span>
          </button>
          <button className="p-1.5 hover:text-[#d00000] transition-colors">
            <span className="material-symbols-outlined text-[22px]">ios_share</span>
          </button>
        </div>
      </div>

      {/* 3. Product Hero Image with 1/5 Badge */}
      <div className="w-full px-5 py-2">
        <div className="aspect-[4/5] w-full rounded-3xl overflow-hidden relative bg-gray-100 shadow-sm">
          <img 
            src={product.image || '/images/reels/reel_1.jpg'} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {/* 1/5 Carousel Count Pill */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
            1/5
          </div>
        </div>
      </div>

      {/* 4. Product Title, Price & Reviews */}
      <div className="px-5 pt-3 space-y-1 text-left">
        <h1 className="text-lg font-bold text-slate-900 leading-tight">
          {product.title}
        </h1>
        <div className="text-lg font-black text-[#d00000]">
          EGP {product.price.toLocaleString()}
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-xs pt-1">
          <div className="flex items-center text-[#d00000]">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-symbols-outlined text-[15px] fill-current">star</span>
            ))}
          </div>
          <span className="font-bold text-slate-800 ml-1">4.8</span>
          <span className="text-gray-400 font-medium">(124 reviews)</span>
        </div>
      </div>

      {/* 5. Size Selector */}
      <div className="px-5 pt-4 space-y-2 text-left">
        <span className="text-xs font-bold text-slate-900 block">Size</span>
        <div className="flex items-center gap-2.5">
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-10 h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                selectedSize === size
                  ? 'bg-[#d00000] text-white shadow-md'
                  : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Seller Info Card (By Nada Fashion) */}
      <div className="px-5 pt-4">
        <div 
          onClick={() => setActiveTab('profile')}
          className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <img 
              src="/images/reels/reel_2.jpg" 
              alt="Nada Fashion"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-900">By Nada Fashion</span>
                <span className="material-symbols-outlined text-[14px] text-sky-500 fill-current">verified</span>
              </div>
              <span className="text-[11px] text-gray-500 block">Egypt · Cairo</span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-700 hover:text-[#d00000] flex items-center gap-0.5">
            <span>View Store</span>
            <span className="material-symbols-outlined text-[15px]">chevron_right</span>
          </span>
        </div>
      </div>

      {/* 7. Delivery Info Card */}
      <div className="px-5 pt-3">
        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-gray-200/70 text-slate-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Delivery in 2-5 days</div>
            <div className="text-[11px] text-gray-500">Cash on delivery available</div>
          </div>
        </div>
      </div>

      {/* 8. Reviews Preview Card */}
      <div className="px-5 pt-3">
        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-gray-600">star</span>
            <span className="text-xs font-bold text-slate-900">Reviews (124)</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-gray-400">chevron_right</span>
        </div>
      </div>

      {/* Added Toast */}
      {addedToast && (
        <div className="fixed top-16 inset-x-8 z-50 bg-[#d00000] text-white py-2 px-4 rounded-xl text-xs font-bold text-center shadow-xl animate-fade-in">
          Added to cart successfully! 🛍️
        </div>
      )}

      {/* 9. Fixed Bottom Add to Cart CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 max-w-[390px] mx-auto md:relative md:max-w-none">
        <button
          onClick={handleAddToCart}
          className="w-full py-3.5 rounded-2xl bg-[#d00000] hover:bg-[#b00000] text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
