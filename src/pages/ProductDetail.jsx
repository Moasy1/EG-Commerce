import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProductDetail() {
  const { selectedProduct, addToCart, setActiveTab } = useApp();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors?.[0] || 'تيراكوتا (طوبي)');
  const [notification, setNotification] = useState('');

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, { size: selectedSize, color: selectedColor });
    setNotification('تمت إضافة القطعة إلى سلتك الموحدة بنجاح');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, { size: selectedSize, color: selectedColor });
    setActiveTab('checkout');
  };

  return (
    <div className="w-full flex-1 max-w-5xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-16 text-on-surface">
      {/* Back Button */}
      <button
        onClick={() => setActiveTab('shop')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary mb-4 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        <span>العودة إلى المعروضات</span>
      </button>

      {/* Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-secondary text-on-secondary px-5 py-2.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
        {/* Product Media */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-low border border-surface-container-high shadow-sm">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold text-secondary flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[13px]">stars</span>
            <span>+{selectedProduct.pointsEarned} نقطة مكافأة</span>
          </div>
        </div>

        {/* Specs & Ordering Details */}
        <div className="flex flex-col justify-between text-right">
          <div>
            {/* Merchant Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-secondary">
                {selectedProduct.merchant}
              </span>
              {selectedProduct.merchantVerified && (
                <span className="flex items-center gap-0.5 text-[11px] text-on-surface-variant font-medium">
                  <span className="material-symbols-outlined text-secondary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  دار أزياء موثقة
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-surface leading-snug mb-3">
              {selectedProduct.title}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-baseline justify-between pb-3 mb-4 border-b border-surface-container-high">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl md:text-3xl font-bold text-on-surface">{selectedProduct.price.toLocaleString()}</span>
                <span className="text-xs text-on-surface-variant">ج.م</span>
                {selectedProduct.originalPrice && (
                  <span className="text-xs text-outline line-through">{selectedProduct.originalPrice.toLocaleString()} ج.م</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs bg-surface-container-low px-2.5 py-1 rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-bold text-on-surface">{selectedProduct.rating}</span>
                <span className="text-[10px] text-on-surface-variant">({selectedProduct.reviewsCount})</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed mb-5">
              {selectedProduct.description}
            </p>

            {/* Size Options */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-on-surface">المقاس</label>
                <button className="text-[11px] text-secondary hover:underline">دليل المقاسات</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[42px] py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-on-primary'
                        : 'border-surface-container-high bg-surface-container-lowest text-on-surface hover:border-outline'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Options */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-on-surface mb-1.5">اللون</label>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.colors?.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                      selectedColor === col
                        ? 'border-secondary bg-secondary/10 text-secondary font-bold'
                        : 'border-surface-container-high bg-surface-container-lowest text-on-surface hover:border-outline'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex gap-3 pt-4 border-t border-surface-container-high">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs border border-primary text-primary hover:bg-surface-container-low transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>أضف إلى السلة</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-primary text-on-primary hover:bg-secondary transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">flash_on</span>
              <span>شراء فوري</span>
            </button>
          </div>
        </div>
      </div>

      {/* UGC Showcase Section: فيديوهات الريلز المرتبطة */}
      <section className="mt-8 pt-6 border-t border-surface-container-high">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-base font-bold text-on-surface">تنسيقات الريلز من صناع المحتوى (UGC)</h2>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              شاهدي تجارب وتنسيقات حقيقية لهذه القطعة بأعين مبدعات الموضة
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('reels')}
            className="text-xs font-semibold text-secondary hover:underline flex items-center gap-0.5"
          >
            <span>شاهد في الريلز</span>
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              creator: '@layla_style',
              caption: 'تنسيق كيمونو كتان رملي مع فستان أبيض خفيف',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx2U5J1mKvtOYiWzhpQW4Za5R89tel2hIhZLv72GVzbqdEDC8xfmHtp6b7LVoqbpa4dXH-_RH1slnuQVziFgRbDBEX17p2JNHuLm8ZGwDWXz4EEHIyxS7bncuxrWwlfA9qR8IBJYvFyv8mI51ST6MDVBpEbdhfCgbkv33cfNlTi1Rm0emv8PIgIEk2yVN1ZJaEc8-iOwsDVDcR2Apg0kn4jvdfV9laevlMPlHnSkO3zxfYrv57Coz8'
            },
            {
              creator: '@nour_style',
              caption: 'كتان طبيعي منسوج يدوياً في المعز',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6M9R0STgJd832SzAKcYCBaZhk4lsAzKzNpUB5n0JAA3r_XOv4G8K7SRfSjpFZX3X5DVQqEfIdf6qaXQ748hfWdQOUPny6vW4aM9gK-0hTe2qrsaPInpzFrR-6iMSoxdoDFEbD2TiJkzXX4PR4veBKMzG8olzd2ZgOJicW2d0e24Klq2ebAK1hRX09eProZ4BsgCNRQVpP5WP8gA8TnfF2WPVMam-pQfxkwL7jgYwnTNfzzmsF6ThB'
            },
            {
              creator: '@cairo.modest',
              caption: 'إطلالة شمس الصباح الهادئة',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNw8oHJNy-iuluOMJkZtPITehUTfKsAy6gonznoc7BK1dnPSNx6c0GcsNsYqQBVburDLidf8N75P8B6TsR-ZbJgjkiL7rRLdGIglykt-D784IpJ0yW8Qm_KZApdx6XKH2oRx-K0eBOGvBfxv3HKsKbdk270VBclA24as6PkV6Klh-RXsmR3Nx55SabuCE6hULUPE66YadEXdrWwrVRphcJRKI8xzylI74xZAqoQTOM-acylJZBMeBp'
            }
          ].map((video, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab('reels')}
              className="relative aspect-[9/13] rounded-xl overflow-hidden bg-surface-container group cursor-pointer border border-surface-container-high hover:border-secondary transition-all"
            >
              <img
                src={video.image}
                alt={video.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex flex-col justify-between p-3 text-on-primary">
                <span className="w-7 h-7 rounded-full bg-surface/30 backdrop-blur-sm flex items-center justify-center self-end">
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                </span>
                <div>
                  <span className="font-serif text-xs font-bold block">{video.creator}</span>
                  <p className="text-[10px] text-on-primary/90 line-clamp-2 mt-0.5 leading-snug">
                    {video.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
