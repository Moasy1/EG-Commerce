import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function Marketplace() {
  const { openProductDetail, addToCart, setActiveTab } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'الكل',
    'عبايات وقفاطين',
    'كاجوال كتان',
    'حقائب جلدية',
    'إكسسوارات ذهبية وفضية'
  ];

  const creatorStories = [
    {
      creator: '@layla_style',
      role: 'مصممة أزياء',
      caption: 'تنسيق كيمونو كتان رملي مع فستان أبيض خفيف',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx2U5J1mKvtOYiWzhpQW4Za5R89tel2hIhZLv72GVzbqdEDC8xfmHtp6b7LVoqbpa4dXH-_RH1slnuQVziFgRbDBEX17p2JNHuLm8ZGwDWXz4EEHIyxS7bncuxrWwlfA9qR8IBJYvFyv8mI51ST6MDVBpEbdhfCgbkv33cfNlTi1Rm0emv8PIgIEk2yVN1ZJaEc8-iOwsDVDcR2Apg0kn4jvdfV9laevlMPlHnSkO3zxfYrv57Coz8'
    },
    {
      creator: '@farah.cairo',
      role: 'ستايليست',
      caption: 'تفاصيل مجوهرات اللوتس اليومية',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZv9gw2oRrJXoipcG4_zjKKbFTkjPBAfducf2TrVLv9aicAV3y9i-MnmIktqOKCf_76Vyv93WEC3Mr9OvobtOtxA4FepmXHDdA8QVFKydJfU7OdjNv1-y3x25q6PYVC9F1_hge_w4uXUOoni36WnmVe03b9EDQAL4dnEHDR4cgkgvtxtQ_bGebQi411CyE8TSvzM_uVn_ISTDbLJYLqe0H3KkkNqVdXxF2ez_vjzYyxRpDUMVqMiK6'
    },
    {
      creator: '@yara_linen',
      role: 'صانعة محتوى',
      caption: 'خامات الكتان في شمس أسوان الهادئة',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6M9R0STgJd832SzAKcYCBaZhk4lsAzKzNpUB5n0JAA3r_XOv4G8K7SRfSjpFZX3X5DVQqEfIdf6qaXQ748hfWdQOUPny6vW4aM9gK-0hTe2qrsaPInpzFrR-6iMSoxdoDFEbD2TiJkzXX4PR4veBKMzG8olzd2ZgOJicW2d0e24Klq2ebAK1hRX09eProZ4BsgCNRQVpP5WP8gA8TnfF2WPVMam-pQfxkwL7jgYwnTNfzzmsF6ThB'
    }
  ];

  const filteredProducts = INITIAL_PRODUCTS.filter(item => {
    const matchesCat = selectedCategory === 'الكل' || item.category === selectedCategory;
    const matchesSearch = item.title.includes(searchQuery) || item.merchant.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface">
      {/* Smart Search & Visual Lens matching 02_shop_marketplace_ar */}
      <div className="relative w-full mb-4">
        <div className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm border border-surface-container-high transition-all focus-within:bg-surface-container-lowest focus-within:shadow-md">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
            <input
              type="text"
              placeholder="ابحثي عن فساتين، حقائب، براندات محلية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent w-full text-on-surface placeholder:text-on-surface-variant text-xs md:text-sm focus:outline-none"
            />
          </div>
          <button 
            type="button"
            aria-label="البحث بالصور"
            className="flex items-center justify-center p-1.5 rounded-lg bg-surface-container text-on-surface hover:text-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-[19px]">photo_camera</span>
          </button>
        </div>
      </div>

      {/* Minimal Fashion Taxonomy Chips */}
      <div className="w-full overflow-x-auto no-scrollbar mb-6">
        <div className="flex items-center gap-2 whitespace-nowrap py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial Section: Curated by Egyptian Creators */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <h2 className="font-serif text-lg font-bold text-on-surface">مختارات صناع الموضة</h2>
            <span className="text-xs text-on-surface-variant">تنسيقات وإطلالات حصرية من مبدعات القاهرة</span>
          </div>
          <button 
            onClick={() => setActiveTab('reels')}
            className="flex items-center gap-1 text-secondary text-xs font-semibold hover:opacity-80 transition-opacity"
          >
            <span>عرض الكل</span>
            <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
          </button>
        </div>

        {/* Creator Story Strips */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {creatorStories.map((story, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab('reels')}
              className="flex-shrink-0 w-40 relative group rounded-xl overflow-hidden shadow-sm bg-surface-container cursor-pointer aspect-[9/13]"
            >
              <img
                src={story.image}
                alt={story.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-between p-3 text-on-primary">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-surface/25 backdrop-blur-md text-[9px] text-on-primary">
                    {story.role}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-on-primary">play_circle</span>
                </div>
                <div>
                  <span className="font-serif text-xs font-bold text-on-primary block">{story.creator}</span>
                  <p className="text-[10px] text-on-primary/90 line-clamp-2 mt-0.5 leading-snug">
                    {story.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catalog Grid Section */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif text-lg font-bold text-on-surface">أحدث القطع المضافة</h2>
            <span className="text-xs text-on-surface-variant">({filteredProducts.length} قطعة)</span>
          </div>
          <button className="flex items-center gap-1 px-3 py-1 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface-variant hover:text-on-surface border border-surface-container-high">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>تصفية</span>
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative flex flex-col rounded-xl bg-surface-container-lowest border border-surface-container-high hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Image & Quick Add */}
              <div 
                onClick={() => openProductDetail(product)}
                className="relative aspect-[3/4] w-full bg-surface-container-low overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 rounded bg-surface/90 backdrop-blur-md text-secondary text-[9px] font-semibold flex items-center gap-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-[11px]">stars</span>
                    +{product.pointsEarned} نقطة
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  title="إضافة سريعة للسلة"
                  className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-primary hover:bg-secondary text-on-primary flex items-center justify-center shadow-md transition-all active:scale-90"
                >
                  <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
                </button>
              </div>

              {/* Product Meta in warm editorial style */}
              <div 
                onClick={() => openProductDetail(product)}
                className="p-3 flex flex-col flex-1 cursor-pointer text-right"
              >
                <div className="flex items-center justify-between text-[11px] text-secondary font-semibold mb-0.5">
                  <span>{product.merchant}</span>
                  {product.merchantVerified && (
                    <span className="material-symbols-outlined text-secondary text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-semibold text-on-surface line-clamp-1 leading-snug">
                  {product.title}
                </h3>

                <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-surface-container-high/60">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-sm font-bold text-on-surface">{product.price.toLocaleString()}</span>
                    <span className="text-[10px] text-on-surface-variant">ج.م</span>
                  </div>
                  {product.originalPrice && (
                    <span className="text-[10px] text-outline line-through">{product.originalPrice.toLocaleString()} ج.م</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
