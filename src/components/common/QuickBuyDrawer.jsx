import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function QuickBuyDrawer() {
  const { isQuickBuyOpen, closeQuickBuy, quickBuyProduct, addToCart, setActiveTab } = useApp();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(quickBuyProduct?.colors?.[0] || 'تيراكوتا (طوبي)');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!isQuickBuyOpen || !quickBuyProduct) return null;

  const handleAddToCart = () => {
    addToCart(quickBuyProduct, { size: selectedSize, color: selectedColor });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      closeQuickBuy();
    }, 600);
  };

  const handleInstantBuy = () => {
    addToCart(quickBuyProduct, { size: selectedSize, color: selectedColor });
    closeQuickBuy();
    setActiveTab('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        onClick={closeQuickBuy}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Sheet Container */}
      <div className="relative w-full max-w-lg bg-surface-container-low rounded-t-2xl sm:rounded-2xl border border-surface-variant/40 shadow-2xl p-5 pb-8 sm:pb-6 z-10 animate-fade-in text-on-surface">
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-surface-variant rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex gap-3">
            <img 
              src={quickBuyProduct.image} 
              alt={quickBuyProduct.title}
              className="w-16 h-20 rounded-lg object-cover border border-surface-variant/50"
            />
            <div className="flex flex-col">
              <span className="text-xs text-primary font-bold">{quickBuyProduct.merchant}</span>
              <h3 className="text-base font-bold leading-snug">{quickBuyProduct.title}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-lg font-black text-on-surface">{quickBuyProduct.price} ج.م</span>
                {quickBuyProduct.originalPrice && (
                  <span className="text-xs text-on-surface-variant line-through">{quickBuyProduct.originalPrice} ج.م</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-secondary mt-0.5">
                <span className="material-symbols-outlined text-[14px]">stars</span>
                <span>اكسب {quickBuyProduct.pointsEarned} نقطة مع هذا الطلب</span>
              </div>
            </div>
          </div>
          <button 
            onClick={closeQuickBuy}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Size Selection */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-on-surface-variant mb-2">المقاس</label>
          <div className="flex gap-2 flex-wrap">
            {quickBuyProduct.sizes?.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[42px] px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  selectedSize === size
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-variant/50 bg-surface text-on-surface hover:border-surface-variant'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-on-surface-variant mb-2">اللون</label>
          <div className="flex gap-2 flex-wrap">
            {quickBuyProduct.colors?.map((col) => (
              <button
                key={col}
                onClick={() => setSelectedColor(col)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  selectedColor === col
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-variant/50 bg-surface text-on-surface hover:border-surface-variant'
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3 px-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/10 transition-all active:scale-95 ${
              addedAnimation ? 'bg-primary text-white' : ''
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            <span>{addedAnimation ? 'تمت الإضافة بنجاح!' : 'أضف للسلة'}</span>
          </button>
          <button
            onClick={handleInstantBuy}
            className="flex-1 py-3 px-4 rounded-full font-bold text-sm bg-primary text-white hover:bg-primary-container shadow-lg shadow-primary/25 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">flash_on</span>
            <span>شراء فوري</span>
          </button>
        </div>
      </div>
    </div>
  );
}
