import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import SizeGuideModal from './SizeGuideModal';

export default function QuickBuyDrawer() {
  const { isQuickBuyOpen, closeQuickBuy, quickBuyProduct, addToCart, setActiveTab, language } = useApp();
  const isAr = language === 'ar';

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Terracotta');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const availableSizes = quickBuyProduct?.sizes && quickBuyProduct.sizes.length > 0
    ? quickBuyProduct.sizes
    : ['S', 'M', 'L', 'XL'];

  const availableSwatches = quickBuyProduct?.colorSwatches && quickBuyProduct.colorSwatches.length > 0
    ? quickBuyProduct.colorSwatches
    : (quickBuyProduct?.colors && quickBuyProduct.colors.length > 0
        ? quickBuyProduct.colors.map(c => ({ name: c, hex: '#8b5a2b' }))
        : [
            { name: 'أصفر ليموني • Lemon', hex: '#d4af37' },
            { name: 'بيج كتاني • Linen Beige', hex: '#d2b48c' }
          ]);

  useEffect(() => {
    if (availableSizes[0]) {
      setSelectedSize(availableSizes[0]);
    }
    if (availableSwatches[0]?.name) {
      setSelectedColor(availableSwatches[0].name);
    }
  }, [quickBuyProduct]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isQuickBuyOpen && !showSizeGuide) {
        closeQuickBuy();
      }
    };
    if (isQuickBuyOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isQuickBuyOpen, closeQuickBuy, showSizeGuide]);

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
        className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl border border-gray-200 shadow-2xl p-5 pb-8 sm:pb-6 z-10 animate-sheet-slide-up text-slate-900 gpu-layer text-start"
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-3 opacity-80" aria-hidden="true" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex gap-3">
            <img 
              src={quickBuyProduct.image} 
              alt={quickBuyProduct.title}
              className="w-16 h-20 rounded-lg object-cover border border-gray-200 bg-gray-100"
            />
            <div className="flex flex-col">
              <span className="text-xs text-amber-700 font-semibold">{quickBuyProduct.merchant || 'Talieska Studio'}</span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{quickBuyProduct.title}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif text-base font-bold text-slate-900">{quickBuyProduct.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                {quickBuyProduct.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">{quickBuyProduct.originalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-600 mt-0.5">
                <span className="material-symbols-outlined text-[13px]">stars</span>
                <span>+{quickBuyProduct.pointsEarned || 50} {isAr ? 'نقطة مكافأة' : 'Points Reward'}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={closeQuickBuy}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:text-slate-900 hover:bg-gray-200 transition-colors"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Size Selection with Size Guide Link */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              {isAr ? 'المقاس' : 'Size'}
            </label>
            <button
              type="button"
              onClick={() => setShowSizeGuide(true)}
              className="text-[#d00000] hover:text-[#900000] underline flex items-center gap-1 text-[11px] font-bold"
            >
              <span className="material-symbols-outlined text-[13px]">straighten</span>
              <span>{isAr ? 'دليل المقاسات' : 'Size Guide'}</span>
              {quickBuyProduct.sizeGuide && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#d00000] animate-ping" />
              )}
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[42px] min-h-[36px] px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  selectedSize === size
                    ? 'border-[#d00000] bg-[#d00000] text-white shadow-xs'
                    : 'border-gray-200 bg-white text-slate-700 hover:border-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection with Swatches */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              {isAr ? 'اللون' : 'Color'}
            </label>
            <span className="text-xs font-bold text-[#d00000]">{selectedColor}</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {availableSwatches.map((swatch, idx) => {
              const isSelected = selectedColor === swatch.name;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(swatch.name)}
                  className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'border-[#d00000] bg-red-50/50 text-[#d00000] font-bold shadow-xs'
                      : 'border-gray-200 bg-white text-slate-700 hover:border-gray-300'
                  }`}
                >
                  <span 
                    className={`w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 ${
                      isSelected ? 'ring-2 ring-offset-1 ring-[#d00000]' : ''
                    }`}
                    style={{ backgroundColor: swatch.hex || '#8b5a2b' }}
                  />
                  <span>{swatch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Guide Modal embedded inside QuickBuy context */}
        <SizeGuideModal
          isOpen={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          product={quickBuyProduct}
          selectedSize={selectedSize}
          onSelectSize={(sz) => setSelectedSize(sz)}
          isAr={isAr}
        />

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
