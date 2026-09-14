import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function QuickBuyDrawer() {
  const { isQuickBuyOpen, closeQuickBuy, quickBuyProduct, addToCart, setActiveTab, language } = useApp();
  const isAr = language === 'ar';

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Terracotta');
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (quickBuyProduct?.colors?.[0]) {
      setSelectedColor(quickBuyProduct.colors[0]);
    }
  }, [quickBuyProduct]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isQuickBuyOpen) {
        closeQuickBuy();
      }
    };
    if (isQuickBuyOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isQuickBuyOpen, closeQuickBuy]);

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
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 text-start"
      role="dialog"
      aria-modal="true"
      aria-label={isAr ? "نافذة الشراء السريع" : "Quick Buy Drawer"}
    >
      {/* Backdrop with smooth blur */}
      <div 
        onClick={closeQuickBuy}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-backdrop"
      />

      {/* Sheet Container with Spring Physics */}
      <div 
        dir={isAr ? 'rtl' : 'ltr'} 
        className="relative w-full max-w-lg bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl border border-surface-container-high shadow-2xl p-5 pb-8 sm:pb-6 z-10 animate-sheet-slide-up text-on-surface gpu-layer text-start"
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-surface-container-highest rounded-full mx-auto mb-3 opacity-80" aria-hidden="true" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex gap-3">
            <img 
              src={quickBuyProduct.image} 
              alt={quickBuyProduct.title}
              className="w-16 h-20 rounded-lg object-cover border border-surface-container-high bg-surface-container-low"
            />
            <div className="flex flex-col">
              <span className="text-xs text-secondary font-semibold">{quickBuyProduct.merchant || 'Talieska Studio'}</span>
              <h3 className="text-sm font-bold text-on-surface leading-snug">{quickBuyProduct.title}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-base font-bold text-on-surface">{quickBuyProduct.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                {quickBuyProduct.originalPrice && (
                  <span className="text-xs text-outline line-through">{quickBuyProduct.originalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-secondary mt-0.5">
                <span className="material-symbols-outlined text-[13px]">stars</span>
                <span>+{quickBuyProduct.pointsEarned || 50} {isAr ? 'نقطة مكافأة' : 'Points Reward'}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={closeQuickBuy}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Size Selection */}
        <div className="mb-3">
          <label className="block text-xs font-semibold text-on-surface mb-1.5">
            {isAr ? 'المقاس' : 'Size'}
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {(quickBuyProduct.sizes || ['S', 'M', 'L', 'XL']).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[42px] min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  selectedSize === size
                    ? 'border-primary bg-primary text-on-primary shadow-xs'
                    : 'border-surface-container-high bg-surface-container-low text-on-surface hover:border-outline'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-on-surface mb-1.5">
            {isAr ? 'اللون' : 'Color'}
          </label>
          <div className="flex gap-1.5 flex-wrap">
            {(quickBuyProduct.colors || ['Terracotta', 'Beige']).map((col) => (
              <button
                key={col}
                onClick={() => setSelectedColor(col)}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold border transition-all ${
                  selectedColor === col
                    ? 'border-secondary bg-secondary/10 text-secondary font-bold shadow-xs'
                    : 'border-surface-container-high bg-surface-container-low text-on-surface hover:border-outline'
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-3 border-t border-surface-container-high">
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-3 rounded-xl font-bold text-xs border border-primary transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              addedAnimation 
                ? 'bg-secondary text-on-secondary border-secondary' 
                : 'text-primary hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">
              {addedAnimation ? 'check' : 'shopping_bag'}
            </span>
            <span>{addedAnimation ? (isAr ? 'تم الإضافة بنجاح!' : 'Added!') : (isAr ? 'أضف للسلة' : 'Add to Cart')}</span>
          </button>
          <button
            onClick={handleInstantBuy}
            className="flex-1 py-3.5 px-3 rounded-xl font-bold text-xs bg-primary text-on-primary hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md"
          >
            <span className="material-symbols-outlined text-[17px]">flash_on</span>
            <span>{isAr ? 'شراء فوري' : 'Instant Buy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
