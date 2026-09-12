import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';

export default function UnifiedCart() {
  const { setActiveTab } = useApp();
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Exact 2 cart items from Screen 4
  const [cartItems, setCartItems] = useState([
    {
      id: 'c1',
      title: 'Linen Co-ord Set',
      price: 1250,
      size: 'M',
      qty: 1,
      image: '/images/reels/reel_1.jpg'
    },
    {
      id: 'c2',
      title: 'Oversized Hoodie',
      price: 950,
      size: 'L',
      qty: 1,
      image: '/images/products/wool_blazer.jpg'
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

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = 50;
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setOrderPlaced(false);
      setActiveTab('reels');
    }, 3000);
  };

  return (
    <div className="w-full min-h-[844px] bg-white text-slate-900 flex flex-col font-sans select-none pb-20">
      {/* 1. iOS Status Bar */}
      <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-slate-800">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
        </div>
      </div>

      {/* 2. Top Bar: Center Red Arch Logo */}
      <div className="w-full px-5 py-2 flex items-center justify-center relative">
        <div className="cursor-pointer" onClick={() => setActiveTab('reels')}>
          <EgLogo className="w-7 h-7" color="#d00000" />
        </div>
      </div>

      {/* 3. Title: Your Cart (2) */}
      <div className="px-5 pt-3 pb-2 text-left">
        <h1 className="text-base font-bold text-slate-900">
          Your Cart ({cartItems.length})
        </h1>
      </div>

      {/* 4. Cart Items List */}
      <div className="px-5 space-y-3">
        {cartItems.map((item, idx) => (
          <div 
            key={item.id}
            className="p-3 rounded-2xl bg-gray-50/90 border border-gray-100 flex items-center justify-between gap-3 text-left"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>

            {/* Info & Quantity Stepper */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
              <div className="text-xs font-black text-slate-900 mt-0.5">
                EGP {item.price.toLocaleString()}
              </div>
              <span className="text-[11px] text-gray-400 block mt-0.5">Size: {item.size}</span>

              {/* Stepper */}
              <div className="inline-flex items-center gap-2 mt-2 bg-white px-2 py-0.5 rounded-lg border border-gray-200">
                <button 
                  onClick={() => updateQty(item.id, -1)}
                  className="text-xs font-bold text-gray-600 px-1 hover:text-slate-900"
                >
                  -
                </button>
                <span className="text-xs font-bold text-slate-900 min-w-[12px] text-center">
                  {item.qty}
                </span>
                <button 
                  onClick={() => updateQty(item.id, 1)}
                  className="text-xs font-bold text-gray-600 px-1 hover:text-slate-900"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions: Heart + Trash */}
            <div className="flex flex-col items-center justify-between h-16 py-1">
              {idx === 0 && (
                <button className="text-gray-400 hover:text-[#d00000] transition-colors">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
              )}
              <button 
                onClick={() => removeItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors mt-auto"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 5. Delivery Address Card */}
      <div className="px-5 pt-4">
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-left cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-gray-700 mt-0.5">
              location_on
            </span>
            <div>
              <div className="text-xs font-bold text-slate-900">Delivery Address</div>
              <div className="text-[11px] font-semibold text-slate-800 mt-0.5">Cairo, Maadi</div>
              <div className="text-[11px] text-gray-500">12 Street 206, Cairo, Egypt</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px] text-gray-400">chevron_right</span>
        </div>
      </div>

      {/* 6. Order Summary Breakdown */}
      <div className="px-5 pt-4 space-y-2 text-left">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-800">EGP {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Delivery Fee</span>
          <span className="font-semibold text-slate-800">EGP {deliveryFee}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-gray-100">
          <span className="text-slate-900">Total</span>
          <span className="text-[#d00000] font-black text-base">EGP {total.toLocaleString()}</span>
        </div>
      </div>

      {/* 7. Big Red [ 🔒 Place Order ] CTA */}
      <div className="px-5 pt-5">
        <button
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
          className="w-full py-3.5 rounded-2xl bg-[#d00000] hover:bg-[#b00000] text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[17px]">lock</span>
          <span>Place Order</span>
        </button>
      </div>

      {/* Order Success Toast */}
      {orderPlaced && (
        <div className="fixed top-16 inset-x-8 z-50 bg-emerald-600 text-white py-2.5 px-4 rounded-xl text-xs font-bold text-center shadow-xl animate-fade-in">
          Order placed successfully! Bosta Express AWB assigned ✨
        </div>
      )}
    </div>
  );
}
