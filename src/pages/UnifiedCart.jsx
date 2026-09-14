import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function UnifiedCart() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    shippingTotal, 
    discountFromPoints, 
    grandTotal, 
    setActiveTab, 
    language,
    isAr 
  } = useApp();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const applyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'eg10' || promoCode.trim().toLowerCase() === 'talieska15') {
      setPromoApplied(true);
    }
  };

  const promoDiscount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const calculatedGrandTotal = Math.max(0, (grandTotal || subtotal + shippingTotal) - promoDiscount);

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'} 
      className="w-full min-h-[calc(100vh-64px)] flex-1 bg-[#fcfbfa] text-slate-900 flex flex-col font-sans select-none pb-24 overflow-y-auto"
    >
      {/* Top Navigation Bar */}
      <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-[#fcfbfa]/95 backdrop-blur-md z-10">
        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>{isAr ? 'سلة التسوق الموحدة' : 'Your Unified Cart'}</span>
          <span className="text-gray-400 text-sm font-semibold">({cartItems.length})</span>
        </h1>
        {cartItems.length > 0 && (
          <span className="text-xs font-bold text-[#d00000] bg-red-50 px-2.5 py-1 rounded-full border border-red-100 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">timer</span>
            <span>{isAr ? 'محجوزة لمدة 15:00' : 'Reserved for 15:00'}</span>
          </span>
        )}
      </div>

      {/* Cart Items List */}
      {cartItems.length > 0 ? (
        <div className="px-4 md:px-6 max-w-3xl mx-auto w-full space-y-3.5 pt-4">
          {cartItems.map((item) => (
            <div 
              key={item.id}
              className="p-3.5 rounded-2xl bg-white border border-gray-200/90 flex items-start gap-3.5 text-start shadow-xs hover:border-gray-300 transition-all relative group"
            >
              {/* Thumbnail */}
              <div className="w-[84px] h-[100px] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100 relative">
                <img 
                  src={item.image || '/images/products/linen_abaya.jpg'} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Info & Quantity Stepper */}
              <div className="flex-1 flex flex-col min-w-0 h-[100px] justify-between">
                <div className="flex justify-between items-start w-full gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block truncate">
                      {item.brand || 'EG Brand'}
                    </span>
                    <h4 className="text-[13px] font-bold text-slate-900 truncate leading-tight mt-0.5">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                      <span>{isAr ? 'المقاس:' : 'Size:'} <span className="font-bold text-slate-700">{item.size || 'M'}</span></span>
                      {item.color && (
                        <span>• {item.color}</span>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors p-1"
                    title={isAr ? 'حذف من السلة' : 'Remove item'}
                    aria-label={isAr ? 'حذف من السلة' : 'Remove item'}
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="flex items-end justify-between pt-1">
                  <div className="text-[15px] font-black text-slate-900">
                    {Number(item.price || 0).toLocaleString()} <span className="text-xs font-bold text-gray-500">{isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                  {/* Stepper */}
                  <div className="inline-flex items-center bg-gray-50 rounded-xl border border-gray-200 shadow-2xs">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="text-[16px] font-bold text-gray-600 px-3 py-1 hover:text-slate-900 hover:bg-gray-100 rounded-s-xl transition-colors active:scale-95"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="text-[12px] font-bold text-slate-900 min-w-[24px] text-center">
                      {item.quantity || 1}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="text-[16px] font-bold text-gray-600 px-3 py-1 hover:text-slate-900 hover:bg-gray-100 rounded-e-xl transition-colors active:scale-95"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-20 flex flex-1 flex-col items-center justify-center text-center max-w-sm mx-auto">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-5 text-[#d00000]">
            <span className="material-symbols-outlined text-4xl">shopping_bag</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">
            {isAr ? 'سلة التسوق فارغة' : 'Your cart is empty'}
          </h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            {isAr 
              ? 'تصفح الريلز واستكشف أحدث تصميمات البراندات المصرية وأضف ما يعجبك بضغطة واحدة.' 
              : 'Discover authentic Egyptian designer collections, trending reels, and add your favorite pieces with 1-click.'}
          </p>
          <button 
            onClick={() => setActiveTab('shop')}
            className="px-8 py-3.5 rounded-full bg-[#d00000] hover:bg-[#b00000] text-white text-xs font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">explore</span>
            <span>{isAr ? 'استكشف المتجر' : 'Explore Marketplace'}</span>
          </button>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="px-4 md:px-6 max-w-3xl mx-auto w-full">
          {/* Promo Code Section */}
          <div className="pt-5">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={isAr ? "كود الخصم (جرب 'EG10')" : "Promo Code (Try 'EG10')"} 
                className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#d00000] focus:ring-1 focus:ring-[#d00000]"
                disabled={promoApplied}
              />
              <button 
                onClick={applyPromo}
                disabled={promoApplied || !promoCode}
                className="px-6 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-50 disabled:bg-slate-300 transition-colors shrink-0"
              >
                {promoApplied ? (isAr ? 'تم التطبيق ✓' : 'Applied ✓') : (isAr ? 'تطبيق' : 'Apply')}
              </button>
            </div>
            {promoApplied && (
              <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>{isAr ? 'تم خصم 10% بنجاح على إجمالي الطلب!' : '10% discount applied successfully!'}</span>
              </p>
            )}
          </div>

          {/* Order Summary Breakdown */}
          <div className="pt-5 pb-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <h3 className="text-[14px] font-black text-slate-900 mb-3.5 text-start">
                {isAr ? 'ملخص الطلب الموحد' : 'Order Summary'}
              </h3>
              <div className="space-y-3 text-start">
                <div className="flex items-center justify-between text-[13px] text-gray-600">
                  <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                  <span className="font-bold text-slate-800">{subtotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                </div>
                
                {promoApplied && (
                  <div className="flex items-center justify-between text-[13px] text-emerald-600">
                    <span>{isAr ? 'خصم الكود (10%)' : 'Promo Discount (10%)'}</span>
                    <span className="font-bold">- {promoDiscount.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                )}

                {discountFromPoints > 0 && (
                  <div className="flex items-center justify-between text-[13px] text-emerald-600">
                    <span>{isAr ? 'خصم نقاط المكافآت' : 'Points Reward Discount'}</span>
                    <span className="font-bold">- {discountFromPoints.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[13px] text-gray-600">
                  <span>{isAr ? 'شحن موحد (بوسطة)' : 'Unified Delivery (Bosta)'}</span>
                  <span className="font-bold text-slate-800">{shippingTotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                </div>

                <div className="w-full h-px bg-gray-100 my-1"></div>

                <div className="flex items-center justify-between text-[15px] font-black pt-1">
                  <span className="text-slate-900">{isAr ? 'الإجمالي الكلي' : 'Total'}</span>
                  <span className="text-[#d00000] text-lg">{calculatedGrandTotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating / Sticky Checkout Action */}
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-safe z-30 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] rounded-t-2xl">
            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full py-4 rounded-2xl bg-[#d00000] hover:bg-[#b00000] text-white text-[15px] font-bold shadow-xl shadow-red-500/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">lock</span>
              <span>{isAr ? 'متابعة الشراء والدفع الآمن' : 'Proceed to Secure Checkout'}</span>
              <span className="font-normal opacity-90">({calculatedGrandTotal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'})</span>
            </button>
            <div className="flex items-center justify-center gap-2 mt-2.5">
              <span className="material-symbols-outlined text-[14px] text-emerald-600">verified_user</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {isAr ? 'دفع آمن ومشفر 100% • توصيل بوسطة لجميع المحافظات' : '100% Secure & Encrypted Checkout'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
