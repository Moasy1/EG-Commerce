import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ProductDetail() {
  const { selectedProduct, addToCart, setActiveTab } = useApp();
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors?.[0] || 'تيراكوتا (طوبي)');
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState('');

  if (!selectedProduct) return null;

  const handleAddToCart = () => {
    addToCart(selectedProduct, { size: selectedSize, color: selectedColor });
    setNotification('تمت إضافة المنتج إلى سلتك الموحدة بنجاح!');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, { size: selectedSize, color: selectedColor });
    setActiveTab('checkout');
  };

  return (
    <div className="w-full flex-1 max-w-5xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-16 text-on-surface">
      {/* Back button */}
      <button
        onClick={() => setActiveTab('shop')}
        className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        <span>العودة إلى السوق</span>
      </button>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-tertiary text-on-tertiary px-5 py-3 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Top Product Hero Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Gallery Image */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface-container border border-surface-variant/40 shadow-2xl">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-secondary flex items-center gap-1 border border-white/10">
            <span className="material-symbols-outlined text-[16px]">stars</span>
            <span>+{selectedProduct.pointsEarned} نقطة مكافأة</span>
          </div>
        </div>

        {/* Product Details & Variant Selectors */}
        <div className="flex flex-col justify-between">
          <div>
            {/* Merchant Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                {selectedProduct.merchant}
              </span>
              {selectedProduct.merchantVerified && (
                <span className="flex items-center gap-0.5 text-xs text-tertiary font-semibold">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  علامة تجارية موثقة
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white leading-snug mb-3">
              {selectedProduct.title}
            </h1>

            {/* Price & Rating */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-variant/40">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white">{selectedProduct.price} ج.م</span>
                {selectedProduct.originalPrice && (
                  <span className="text-base text-on-surface-variant line-through">{selectedProduct.originalPrice} ج.م</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm bg-surface-container px-3 py-1.5 rounded-xl border border-surface-variant/30">
                <span className="material-symbols-outlined text-amber-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-bold text-white">{selectedProduct.rating}</span>
                <span className="text-xs text-on-surface-variant">({selectedProduct.reviewsCount} تقييم)</span>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
              {selectedProduct.description}
            </p>

            {/* Size Options */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-white">اختر المقاس</label>
                <button className="text-[11px] text-primary hover:underline font-semibold">دليل المقاسات</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary/15 text-primary shadow-sm'
                        : 'border-surface-variant/50 bg-surface-container text-on-surface hover:border-surface-variant'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Options */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-white mb-2">اللون المتاح</label>
              <div className="flex gap-2 flex-wrap">
                {selectedProduct.colors?.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all ${
                      selectedColor === col
                        ? 'border-primary bg-primary/15 text-primary shadow-sm'
                        : 'border-surface-variant/50 bg-surface-container text-on-surface hover:border-surface-variant'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-surface-variant/40">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm border-2 border-primary text-primary hover:bg-primary/10 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>أضف إلى السلة</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm bg-primary hover:bg-primary-container text-white shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">flash_on</span>
              <span>شراء فوري</span>
            </button>
          </div>
        </div>
      </div>

      {/* UGC Showcase Section: فيديوهات الريلز المرتبطة بالقطعة */}
      <section className="mt-12 pt-8 border-t border-surface-variant/40">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">تنسيقات الريلز من صناع المحتوى (UGC)</h2>
              <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary text-[11px] font-bold">
                3 فيديوهات
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              شاهدي كيف ارتدت صانعات المحتوى هذه القطعة في مناسبات مختلفة
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('reels')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>عرض في شاشة الريلز</span>
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
          </button>
        </div>

        {/* Creator Video Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              creator: '@elena.fashion',
              caption: 'تنسيق صباحي كاجوال مع صندل كلاسيك',
              views: '18.4K',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6M9R0STgJd832SzAKcYCBaZhk4lsAzKzNpUB5n0JAA3r_XOv4G8K7SRfSjpFZX3X5DVQqEfIdf6qaXQ748hfWdQOUPny6vW4aM9gK-0hTe2qrsaPInpzFrR-6iMSoxdoDFEbD2TiJkzXX4PR4veBKMzG8olzd2ZgOJicW2d0e24Klq2ebAK1hRX09eProZ4BsgCNRQVpP5WP8gA8TnfF2WPVMam-pQfxkwL7jgYwnTNfzzmsF6ThB'
            },
            {
              creator: '@nour_stylist',
              caption: 'إطلالة مسائية فاخرة مع حزام ومجوهرات ذهبية',
              views: '32.1K',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZv9gw2oRrJXoipcG4_zjKKbFTkjPBAfducf2TrVLv9aicAV3y9i-MnmIktqOKCf_76Vyv93WEC3Mr9OvobtOtxA4FepmXHDdA8QVFKydJfU7OdjNv1-y3x25q6PYVC9F1_hge_w4uXUOoni36WnmVe03b9EDQAL4dnEHDR4cgkgvtxtQ_bGebQi411CyE8TSvzM_uVn_ISTDbLJYLqe0H3KkkNqVdXxF2ez_vjzYyxRpDUMVqMiK6'
            },
            {
              creator: '@cairo.modest',
              caption: 'تجربة ملمس قماش الكتان في شمس الصباح',
              views: '14.9K',
              image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNw8oHJNy-iuluOMJkZtPITehUTfKsAy6gonznoc7BK1dnPSNx6c0GcsNsYqQBVburDLidf8N75P8B6TsR-ZbJgjkiL7rRLdGIglykt-D784IpJ0yW8Qm_KZApdx6XKH2oRx-K0eBOGvBfxv3HKsKbdk270VBclA24as6PkV6Klh-RXsmR3Nx55SabuCE6hULUPE66YadEXdrWwrVRphcJRKI8xzylI74xZAqoQTOM-acylJZBMeBp'
            }
          ].map((video, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab('reels')}
              className="relative aspect-[9/14] rounded-2xl overflow-hidden bg-surface-container group cursor-pointer border border-surface-variant/30 hover:border-primary transition-all"
            >
              <img
                src={video.image}
                alt={video.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              </div>

              <div className="absolute bottom-3 inset-x-3 text-white">
                <div className="flex items-center justify-between text-[11px] font-bold text-secondary mb-1">
                  <span>{video.creator}</span>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px]">visibility</span>
                    {video.views}
                  </span>
                </div>
                <p className="text-xs font-semibold text-white/90 line-clamp-2 leading-snug">
                  {video.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
