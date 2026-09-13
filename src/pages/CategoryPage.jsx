import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductService, CATEGORIES_DATA } from '../services/ProductService';

export default function CategoryPage() {
  const { 
    selectedCategory, 
    setActiveTab, 
    openProductDetail, 
    openQuickBuy, 
    addToCart, 
    language,
    openCategoryPage
  } = useApp();

  const isAr = language === 'ar';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under500', '500-1000', 'over1000'
  const [addedToast, setAddedToast] = useState(null);

  // Fallback category details if not fully set
  const currentCategory = selectedCategory?.id 
    ? (ProductService.getCategoryBySlug(selectedCategory.id) || selectedCategory)
    : CATEGORIES_DATA[0];

  const subcategories = isAr 
    ? (currentCategory.subcategoriesAr || currentCategory.subcategories || ['الكل'])
    : (currentCategory.subcategories || ['All']);

  // Fetch products for this category from backend (Supabase / ProductService)
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadCategoryProducts() {
      try {
        const categoryId = currentCategory?.id || 'women';
        const data = await ProductService.getProducts(categoryId);
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load category products:', err);
        if (isMounted) setLoading(false);
      }
    }

    loadCategoryProducts();
    setSelectedSubcategory(isAr ? 'الكل' : 'All');

    return () => {
      isMounted = false;
    };
  }, [currentCategory?.id, isAr]);

  // Handle Toast feedback
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(null), 2500);
  };

  // Filter and sort products
  const filteredProducts = products.filter(prod => {
    // 1. Subcategory filter
    if (selectedSubcategory !== 'All' && selectedSubcategory !== 'الكل') {
      const sub = selectedSubcategory.toLowerCase();
      const prodText = `${prod.category || ''} ${prod.title || ''} ${prod.description || ''}`.toLowerCase();
      if (!prodText.includes(sub)) {
        return false;
      }
    }

    // 2. Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const prodText = `${prod.title} ${prod.category} ${prod.merchant || ''}`.toLowerCase();
      if (!prodText.includes(query)) return false;
    }

    // 3. Price filter
    if (priceFilter === 'under500' && prod.price >= 500) return false;
    if (priceFilter === '500-1000' && (prod.price < 500 || prod.price > 1000)) return false;
    if (priceFilter === 'over1000' && prod.price <= 1000) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // popular / default order
  });

  return (
    <div className="w-full flex-1 min-h-[calc(100vh-60px)] bg-[#fcfbfa] pb-24 text-slate-900 font-sans select-none">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md animate-fade-in border border-white/10">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span className="truncate max-w-xs">{isAr ? 'تمت الإضافة إلى السلة بنجاح' : 'Added to cart successfully'}</span>
        </div>
      )}

      {/* 1. Header & Breadcrumbs Bar */}
      <div className="bg-white border-b border-gray-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setActiveTab('shop')}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-slate-700 flex items-center justify-center transition-all active:scale-95"
              title={isAr ? 'العودة للاستكشاف' : 'Back to Explore'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isAr ? 'arrow_forward' : 'arrow_back'}
              </span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
              <span 
                onClick={() => setActiveTab('shop')} 
                className="cursor-pointer hover:text-[#d00000] transition-colors"
              >
                {isAr ? 'استكشاف' : 'Explore'}
              </span>
              <span className="text-gray-300">/</span>
              <span className="text-slate-900 font-bold truncate">
                {isAr ? (currentCategory.labelAr || currentCategory.label) : currentCategory.label}
              </span>
            </div>
          </div>

          {/* Quick Category Switcher Pills (Desktop & Mobile) */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES_DATA.slice(0, 6).map(cat => (
              <button
                key={cat.id}
                onClick={() => openCategoryPage(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 ${
                  currentCategory.id === cat.id
                    ? 'bg-[#d00000] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isAr ? (cat.labelAr || cat.label) : cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('cart')}
              className="p-1.5 rounded-full hover:bg-gray-100 text-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Category Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4 md:pt-6">
        <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-200/80 bg-gradient-to-r from-slate-950 via-slate-900 to-stone-900 text-white p-6 md:p-10 min-h-[170px] md:min-h-[220px] flex flex-col justify-end">
          {/* Background imagery with overlay */}
          {currentCategory.image && (
            <img 
              src={currentCategory.banner || currentCategory.image} 
              alt={currentCategory.label}
              className="absolute inset-0 w-full h-full object-cover opacity-35 filter brightness-90 mix-blend-luminosity"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          {/* Banner content */}
          <div className="relative z-10 space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d00000]/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
              <span className="material-symbols-outlined text-[14px]">
                {currentCategory.icon || 'sell'}
              </span>
              <span>{isAr ? 'تصنيف مميز' : 'Category'}</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white drop-shadow-sm">
              {isAr ? (currentCategory.labelAr || currentCategory.label) : currentCategory.label}
            </h1>

            <p className="text-xs md:text-sm text-gray-300 line-clamp-2 max-w-xl font-normal leading-relaxed">
              {isAr ? (currentCategory.descriptionAr || currentCategory.description) : currentCategory.description}
            </p>

            <div className="flex items-center gap-3 pt-1 text-xs text-gray-300 font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-emerald-400">check_circle</span>
                <span>{filteredProducts.length} {isAr ? 'قطعة متوفرة' : 'items available'}</span>
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-amber-300 font-bold">{isAr ? 'شحن فوري بوسطة 24-48 ساعة' : 'Fast Shipping via Bosta'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Subcategories & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5 space-y-3">
        {/* Subcategories Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {subcategories.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                selectedSubcategory === sub
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Search, Sort and Price Filters Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Inner Search */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100/90 rounded-xl text-xs text-gray-600 flex-1 max-w-md">
            <span className="material-symbols-outlined text-[18px] text-gray-400">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? `البحث في قسم ${currentCategory.labelAr || currentCategory.label}...` : `Search within ${currentCategory.label}...`}
              className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400 font-medium"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-slate-700">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Filter Pills & Sort Select */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Price Pill Filters */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-600">
              <button
                onClick={() => setPriceFilter(priceFilter === 'under500' ? 'all' : 'under500')}
                className={`px-2.5 py-1.5 rounded-lg border transition-colors shrink-0 ${
                  priceFilter === 'under500' ? 'bg-[#d00000]/10 border-[#d00000] text-[#d00000]' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                {isAr ? 'أقل من 500 ج.م' : '< 500 EGP'}
              </button>
              <button
                onClick={() => setPriceFilter(priceFilter === '500-1000' ? 'all' : '500-1000')}
                className={`px-2.5 py-1.5 rounded-lg border transition-colors shrink-0 ${
                  priceFilter === '500-1000' ? 'bg-[#d00000]/10 border-[#d00000] text-[#d00000]' : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                {isAr ? '500 - 1,000 ج.م' : '500 - 1,000 EGP'}
              </button>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-2.5 py-1.5 bg-white shrink-0">
              <span className="material-symbols-outlined text-[16px] text-gray-400">swap_vert</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="popular">{isAr ? 'الأكثر شعبية' : 'Popular'}</option>
                <option value="price-low">{isAr ? 'السعر: من الأقل' : 'Price: Low to High'}</option>
                <option value="price-high">{isAr ? 'السعر: من الأعلى' : 'Price: High to Low'}</option>
                <option value="rating">{isAr ? 'الأعلى تقييماً' : 'Highest Rated'}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Products Grid Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5">
        {loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl p-3 border border-gray-200/80 animate-pulse space-y-3">
                <div className="w-full aspect-[4/5] bg-gray-200 rounded-xl" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-5 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-md mx-auto my-8 space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <span className="material-symbols-outlined text-[32px]">inventory_2</span>
            </div>
            <h3 className="text-base font-black text-slate-900">
              {isAr ? 'لا توجد منتجات مطابقة' : 'No products found'}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {isAr ? 'جرب تغيير فلاتر البحث أو تصفح باقي تصنيفات الأزياء والمتاجر المصرية.' : 'Try adjusting your search filters or browse other categories.'}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubcategory('All');
                  setPriceFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-gray-100 text-slate-800 text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className="px-4 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] transition-colors"
              >
                {isAr ? 'كل التصنيفات' : 'All Categories'}
              </button>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => openProductDetail(product)}
                className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                {/* Image Container with Badges */}
                <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Top Reel Badge */}
                  {product.video && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1 shadow-md border border-white/20">
                      <span className="material-symbols-outlined text-[12px] text-[#ff3b5c]">play_arrow</span>
                      <span>{isAr ? 'فيديو ريل' : 'Reel'}</span>
                    </div>
                  )}

                  {/* Stock or Discount Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#d00000] text-white text-[9px] font-black shadow-md">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% {isAr ? 'خصم' : 'OFF'}
                    </div>
                  )}

                  {/* Quick Action Floating Buttons */}
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-between pointer-events-none">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuickBuy(product);
                      }}
                      className="pointer-events-auto px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 hover:bg-[#d00000] transition-colors shadow-sm"
                      title={isAr ? 'شراء سريع' : 'Quick Buy'}
                    >
                      <span className="material-symbols-outlined text-[13px] text-amber-300">bolt</span>
                      <span className="hidden sm:inline">{isAr ? 'شراء سريع' : 'Quick Buy'}</span>
                    </button>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="pointer-events-auto w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-slate-800 flex items-center justify-center hover:bg-[#d00000] hover:text-white transition-all shadow-md active:scale-90"
                      title={isAr ? 'أضف للسلة' : 'Add to cart'}
                    >
                      <span className="material-symbols-outlined text-[17px]">add_shopping_cart</span>
                    </button>
                  </div>
                </div>

                {/* Product Meta */}
                <div className="p-3 text-left space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                      <span>{product.rating || 4.9}</span>
                      <span className="text-gray-400 font-normal">({product.reviewsCount || 24})</span>
                    </div>
                    {product.pointsEarned && (
                      <span className="text-[#d00000] font-bold bg-[#d00000]/10 px-1.5 py-0.5 rounded text-[9px]">
                        +{product.pointsEarned} {isAr ? 'نقطة' : 'pts'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#d00000] transition-colors">
                    {product.title}
                  </h4>

                  <div className="flex items-baseline justify-between pt-1 border-t border-gray-100">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs md:text-sm font-black text-slate-900">
                        {product.price} <span className="text-[10px] font-normal">{isAr ? 'ج.م' : 'EGP'}</span>
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 truncate max-w-[90px]">
                      {product.merchant?.split('•')[0] || product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Bottom Navigation Shortcut to other categories */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-sm font-black text-slate-900 mb-4">
          {isAr ? 'استكشف تصنيفات أخرى' : 'Explore Other Categories'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES_DATA.filter(c => c.id !== currentCategory.id).slice(0, 6).map(cat => (
            <div
              key={cat.id}
              onClick={() => openCategoryPage(cat)}
              className="group relative rounded-2xl overflow-hidden h-24 cursor-pointer border border-gray-200 hover:border-[#d00000] transition-all p-3 flex flex-col justify-end text-white shadow-xs"
            >
              <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="relative z-10 text-left">
                <span className="text-xs font-black block">{isAr ? (cat.labelAr || cat.label) : cat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
