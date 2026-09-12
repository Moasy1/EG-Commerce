import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function UnifiedCart() {
  const { setActiveTab } = useApp();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  // Exact 2 cart items from Screen 4
  const [cartItems, setCartItems] = useState([
    {
      id: 'c1',
      title: 'Linen Co-ord Set',
      price: 1250,
      size: 'M',
      qty: 1,
      image: '/images/reels/reel_1.jpg',
      brand: 'Talieska'
    },
    {
      id: 'c2',
      title: 'Oversized Hoodie',
      price: 950,
      size: 'L',
      qty: 1,
      image: '/images/products/wool_blazer.jpg',
      brand: 'Ahmed Fits'
    }
  ]);

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const applyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'eg10') {
      setPromoApplied(true);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = 50;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal > 0 ? (subtotal + deliveryFee - discount) : 0;

  return (
    <div className="w-full min-h-[844px] bg-white text-slate-900 flex flex-col font-sans select-none pb-24 overflow-y-auto">
      
      {/* Top Navigation Bar */}
      <div className="px-5 pt-4 pb-2 text-left border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Your Cart <span className="text-gray-400 font-medium">({cartItems.length})</span>
        </h1>
        {cartItems.length > 0 && (
          <span className="text-xs font-bold text-[#d00000] bg-red-50 px-2 py-1 rounded-md">
            Reserve for 15:00
          </span>
        )}
      </div>

      {/* Cart Items List */}
      {cartItems.length > 0 ? (
        <div className="px-5 space-y-4 pt-4">
          {cartItems.map((item) => (
            <div 
              key={item.id}
              className="p-3 rounded-2xl bg-white border border-gray-200 flex items-start gap-3 text-left shadow-xs relative"
            >
              {/* Thumbnail */}
              <div className="w-[84px] h-[100px] rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>

              {/* Info & Quantity Stepper */}
              <div className="flex-1 flex flex-col min-w-0 h-[100px]">
                <div className="flex justify-between items-start w-full">
                  <div className="pr-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.brand}</span>
                    <h4 className="text-[13px] font-bold text-slate-900 truncate leading-tight mt-0.5">{item.title}</h4>
                    <span className="text-[11px] text-gray-500 block mt-1">Size: <span className="font-semibold text-slate-700">{item.size}</span></span>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="mt-auto flex items-end justify-between">
                  <div className="text-[14px] font-black text-slate-900">
                    EGP {item.price.toLocaleString()}
                  </div>
                  {/* Stepper */}
                  <div className="inline-flex items-center bg-gray-50 rounded-lg border border-gray-200">
                    <button 
                      onClick={() => updateQty(item.id, -1)}
                      className="text-[15px] font-bold text-gray-600 px-2.5 py-1 hover:text-slate-900 hover:bg-gray-100 rounded-l-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="text-[11px] font-bold text-slate-900 min-w-[20px] text-center">
                      {item.qty}
                    </span>
                    <button 
                      onClick={() => updateQty(item.id, 1)}
                      className="text-[15px] font-bold text-gray-600 px-2.5 py-1 hover:text-slate-900 hover:bg-gray-100 rounded-r-lg transition-colors"
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
        <div className="px-5 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-gray-300">shopping_bag</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Your cart is empty</h2>
          <p className="text-xs text-gray-500 mb-6">Explore the marketplace to find your style.</p>
          <button 
            onClick={() => setActiveTab('shop')}
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold"
          >
            Start Shopping
          </button>
        </div>
      )}

      {cartItems.length > 0 && (
        <>
          {/* Promo Code Section */}
          <div className="px-5 pt-5">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo Code (Try 'EG10')" 
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#d00000] focus:ring-1 focus:ring-[#d00000]"
                disabled={promoApplied}
              />
              <button 
                onClick={applyPromo}
                disabled={promoApplied || !promoCode}
                className="px-5 rounded-xl bg-slate-900 text-white text-xs font-bold disabled:opacity-50 disabled:bg-slate-300 transition-colors"
              >
                {promoApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
          </div>

          {/* Cross Sell / You Might Also Like */}
          <div className="pt-6 pb-2">
            <h3 className="px-5 text-[13px] font-bold text-slate-900 mb-3">You Might Also Like</h3>
            <div className="flex overflow-x-auto no-scrollbar gap-3 px-5 pb-2">
              {[
                { id: 's1', title: 'Copper Lantern', price: 450, image: '/images/products/copper_lantern.jpg' },
                { id: 's2', title: 'Silver Ring', price: 850, image: '/images/products/silver_ring.jpg' }
              ].map(prod => (
                <div key={prod.id} className="w-[120px] shrink-0">
                  <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-2 relative">
                    <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                    <button className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-500 shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 truncate">{prod.title}</h4>
                  <div className="text-[11px] font-bold text-[#d00000]">EGP {prod.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Breakdown */}
          <div className="px-5 pt-3 pb-6">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <h3 className="text-[13px] font-bold text-slate-900 mb-3">Order Summary</h3>
              <div className="space-y-2.5 text-left">
                <div className="flex items-center justify-between text-[13px] text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">EGP {subtotal.toLocaleString()}</span>
                </div>
                {promoApplied && (
                  <div className="flex items-center justify-between text-[13px] text-emerald-600">
                    <span>Discount (10%)</span>
                    <span className="font-semibold">- EGP {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[13px] text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-slate-800">EGP {deliveryFee}</span>
                </div>
                <div className="w-full h-px bg-gray-200 my-1"></div>
                <div className="flex items-center justify-between text-[14px] font-black pt-1">
                  <span className="text-slate-900">Total</span>
                  <span className="text-[#d00000]">EGP {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Checkout Action */}
          <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 pb-8 md:pb-4 z-40 max-w-[430px] md:max-w-full mx-auto md:relative md:bg-transparent md:border-none md:p-5 md:pt-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] md:shadow-none">
            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full py-3.5 rounded-2xl bg-[#d00000] hover:bg-[#b00000] text-white text-[14px] font-bold shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span>Checkout securely</span>
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-2.5">
              <span className="material-symbols-outlined text-[12px] text-emerald-600">verified_user</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">SSL Encrypted Payment</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
