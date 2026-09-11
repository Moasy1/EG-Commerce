import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function Marketplace() {
  const { openProductDetail, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['الكل', 'فساتين', 'عبايات', 'إكسسوارات', 'مجوهرات', 'أحذية', 'حقائب'];

  const filteredProducts = INITIAL_PRODUCTS.filter(item => {
    const matchesCat = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch = item.title.includes(searchQuery) || item.merchant.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 md:px-6 py-6 pb-24 md:pb-12 text-on-surface">
      {/* Search & Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface">سوق الموضة الموحد</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            تسوق من أرقى العلامات التجارية والمصممين المصريين في سلة واحدة
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="ابحث عن قطعة، مصمم، أو علامة تجارية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container pr-11 pl-4 py-2.5 rounded-xl border border-surface-variant/40 text-sm focus:outline-none focus:border-primary text-on-surface placeholder:text-on-surface-variant/70"
          />
        </div>
      </div>

      {/* Hero Content Banner */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-l from-primary/20 via-surface-container-high to-surface-container p-6 md:p-8 mb-8 border border-primary/20 shadow-lg">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-3 border border-primary/30">
            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
            تريند الموسم
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white leading-snug">
            اكتشف أزياء الموسم بتنسيقات حقيقية من صناع المحتوى (UGC)
          </h2>
          <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
            كل قطعة معروضة مدعومة بفيديوهات ريلز واقعية وتجارب حقيقية تضمن لك الجودة قبل الشراء.
          </p>
        </div>
      </div>

      {/* Horizontal Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface border border-surface-variant/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col rounded-2xl bg-surface-container-low border border-surface-variant/30 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            {/* Image & Overlay Badges */}
            <div 
              onClick={() => openProductDetail(product)}
              className="relative aspect-square w-full bg-surface-container overflow-hidden cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
                <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-secondary text-[10px] font-bold border border-white/10 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[12px]">stars</span>
                  +{product.pointsEarned} نقطة
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                title="إضافة سريعة للسلة"
                className="absolute bottom-2.5 left-2.5 w-9 h-9 rounded-full bg-primary hover:bg-primary-container text-white flex items-center justify-center shadow-lg transition-transform active:scale-90"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              </button>
            </div>

            {/* Product Meta */}
            <div 
              onClick={() => openProductDetail(product)}
              className="p-3 sm:p-4 flex flex-col flex-1 cursor-pointer"
            >
              <div className="flex items-center gap-1 text-[11px] text-primary font-bold mb-1">
                <span>{product.merchant}</span>
                {product.merchantVerified && (
                  <span className="material-symbols-outlined text-tertiary text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                {product.title}
              </h3>

              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center text-amber-400 text-xs">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-on-surface mr-0.5">{product.rating}</span>
                </div>
                <span className="text-[11px] text-on-surface-variant">({product.reviewsCount})</span>
              </div>

              <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-surface-variant/30">
                <span className="text-base font-black text-white">{product.price} ج.م</span>
                {product.originalPrice && (
                  <span className="text-xs text-on-surface-variant line-through">{product.originalPrice} ج.م</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
