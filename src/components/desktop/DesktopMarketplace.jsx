import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function DesktopMarketplace() {
  const { 
    products: appProducts, 
    addToCart, 
    setSelectedProduct, 
    setActiveTab, 
    language 
  } = useApp();

  const isAr = language === 'ar';

  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSize, setSelectedSize] = useState('M');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedToast, setAddedToast] = useState(null);

  const topCategoryIcons = [
    { label: 'All', labelAr: 'الكل', icon: 'apps' },
    { label: 'Women', labelAr: 'نسائي', icon: 'woman' },
    { label: 'Men', labelAr: 'رجالي', icon: 'man' },
    { label: 'Abayas', labelAr: 'عبايات', icon: 'dry_cleaning' },
    { label: 'Accessories', labelAr: 'إكسسوارات', icon: 'handbag' },
    { label: 'Shoes', labelAr: 'أحذية', icon: 'footprint' },
  ];

  // Dynamic Filtering based on selected filters
  const filteredProducts = useMemo(() => {
    return appProducts.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (p.title || '').toLowerCase().includes(q);
        const matchCat = (p.category || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCat) return false;
      }

      // 2. Top Category Filter
      if (selectedCat !== 'All') {
        const catLower = (p.category || '').toLowerCase();
        if (selectedCat === 'Women' && !catLower.includes('women') && !catLower.includes('نسائ') && !catLower.includes('فستان') && !catLower.includes('dress')) return false;
        if (selectedCat === 'Men' && !catLower.includes('men') && !catLower.includes('رجال') && !catLower.includes('قميص') && !catLower.includes('shirt')) return false;
        if (selectedCat === 'Abayas' && !catLower.includes('abaya') && !catLower.includes('عباي') && !catLower.includes('جلابي') && !catLower.includes('galabeya')) return false;
        if (selectedCat === 'Accessories' && !catLower.includes('accessor') && !catLower.includes('إكسسوار') && !catLower.includes('فانوس') && !catLower.includes('كليم') && !catLower.includes('craft')) return false;
      }

      // 3. Price Filter
      if (selectedPriceRange === 'under300' && p.price >= 300) return false;
      if (selectedPriceRange === '300-600' && (p.price < 300 || p.price > 600)) return false;
      if (selectedPriceRange === '600-1000' && (p.price < 600 || p.price > 1000)) return false;
      if (selectedPriceRange === '1000+' && p.price <= 1000) return false;

      return true;
    });
  }, [appProducts, searchQuery, selectedCat, selectedPriceRange]);

  const handleProductClick = (prod) => {
    setSelectedProduct(prod);
    setActiveTab('product');
  };

  const handleAddToCart = (e, prod) => {
    e.stopPropagation();
    addToCart({ ...prod, selectedSize });
    setAddedToast(prod.title);
    setTimeout(() => setAddedToast(null), 2200);
  };

  return (
    <div className="w-full bg-white text-slate-900 flex flex-col font-sans min-h-[580px] overflow-hidden select-none relative" dir={isAr ? 'rtl' : 'ltr'}>
      {/* 1. Top Search & Controls Bar */}
      <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('reels')}>
          <EgLogo className="w-6 h-6" color="#d00000" />
          <span className="font-black text-xs tracking-tight">EG-Commerce</span>
        </div>

        <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 bg-gray-100/90 rounded-full text-xs text-gray-500">
          <span className="material-symbols-outlined text-[17px] text-gray-400">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? "ابحث عن أزياء، جلابيات، قمصان، فساتين..." : "Search products, categories, brands..."}
            className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 text-xs">✕</button>
          )}
        </div>

        <div className="flex items-center gap-3 text-gray-600 text-xs font-semibold">
          <button 
            onClick={() => setSelectedCat('All')}
            className="flex items-center gap-1 hover:text-[#d00000] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
          </button>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 text-gray-500">
            <span>{isAr ? 'الترتيب:' : 'Sort by:'}</span>
            <span className="text-slate-900 font-bold">{isAr ? 'الأكثر رواجاً' : 'Most Popular'}</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <button onClick={() => setActiveTab('cart')} className="p-1 hover:text-[#d00000]">
              <span className="material-symbols-outlined text-[19px]">shopping_cart</span>
            </button>
            <img src="/images/reels/reel_2.jpg" alt="User" className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-300" />
          </div>
        </div>
      </div>

      {/* 2. Top Category Icons Bar */}
      <div className="px-5 py-2 border-b border-gray-100 flex items-center gap-4 overflow-x-auto scrollbar-none bg-white">
        {topCategoryIcons.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setSelectedCat(cat.label)}
            className={`flex items-center gap-1.5 py-1 px-3.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCat === cat.label
                ? 'bg-[#d00000] text-white shadow-xs font-bold'
                : 'text-gray-600 hover:text-slate-900 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">{cat.icon}</span>
            <span>{isAr ? cat.labelAr : cat.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Main Content: Left Filter Sidebar + 4-Column Product Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Filter Column */}
        <aside className="w-52 p-4 border-e border-gray-100 space-y-4 text-start shrink-0 bg-gray-50/50 overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold text-slate-900 mb-2">{isAr ? 'الفئات' : 'Category'}</h4>
            <div className="space-y-1.5 text-[11px] text-gray-600 font-medium">
              {[
                { id: 'All', label: isAr ? 'جميع التصنيفات' : 'All Categories' },
                { id: 'Women', label: isAr ? 'فساتين وسيدات' : 'Dresses & Women' },
                { id: 'Men', label: isAr ? 'أزياء رجالية' : "Men's Wear" },
                { id: 'Abayas', label: isAr ? 'عبايات وجلابيات' : 'Abayas & Galabeyas' },
                { id: 'Accessories', label: isAr ? 'إكسسوارات وتحف' : 'Accessories & Crafts' },
              ].map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input 
                    type="radio" 
                    name="category_filter"
                    checked={selectedCat === c.id}
                    onChange={() => setSelectedCat(c.id)}
                    className="accent-[#d00000]" 
                  />
                  <span>{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200/60">
            <h4 className="text-xs font-bold text-slate-900 mb-2">{isAr ? 'نطاق السعر' : 'Price Range'}</h4>
            <div className="space-y-1.5 text-[11px] text-gray-600 font-medium">
              {[
                { id: 'all', label: isAr ? 'جميع الأسعار' : 'All Prices' },
                { id: 'under300', label: isAr ? 'أقل من 300 ج.م' : 'Under 300 EGP' },
                { id: '300-600', label: isAr ? '300 - 600 ج.م' : '300 - 600 EGP' },
                { id: '600-1000', label: isAr ? '600 - 1,000 ج.م' : '600 - 1,000 EGP' },
                { id: '1000+', label: isAr ? 'أكثر من 1,000 ج.م' : '1,000+ EGP' },
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                  <input 
                    type="radio" 
                    name="price_filter"
                    checked={selectedPriceRange === p.id}
                    onChange={() => setSelectedPriceRange(p.id)}
                    className="accent-[#d00000]" 
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200/60">
            <h4 className="text-xs font-bold text-slate-900 mb-2">{isAr ? 'المقاس المفضل' : 'Size'}</h4>
            <div className="flex flex-wrap gap-1.5">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-7 h-7 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                    selectedSize === s
                      ? 'bg-[#d00000] text-white border-[#d00000] shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200/60">
            <button
              onClick={() => setActiveTab('add_product')}
              className="w-full py-2 rounded-xl bg-red-50 text-[#d00000] border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add_box</span>
              <span>{isAr ? 'أضف قطعتك للسوق' : 'List Product'}</span>
            </button>
          </div>
        </aside>

        {/* 4-Column Product Cards Grid */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? 'استكشف سوق الأزياء المصرية' : 'Explore Marketplace'}
              </h3>
              <p className="text-[11px] text-gray-500">
                {isAr 
                  ? `عرض ${filteredProducts.length} قطعة أزياء حقيقية من ورش ومصممي مصر` 
                  : `Showing ${filteredProducts.length} authentic Egyptian pieces from local designers`}
              </p>
            </div>
            <span className="text-xs text-gray-400 font-mono font-bold">
              {filteredProducts.length} {isAr ? 'قطع' : 'items'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-gray-400 space-y-3">
              <span className="material-symbols-outlined text-[48px] text-gray-300">search_off</span>
              <p className="text-xs font-bold">{isAr ? 'لا توجد قطع تطابق هذا الفلتر' : 'No products match this filter'}</p>
              <button 
                onClick={() => { setSelectedCat('All'); setSelectedPriceRange('all'); setSearchQuery(''); }}
                className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-bold text-slate-800 hover:bg-gray-200"
              >
                {isAr ? 'إعادة ضبط الفلاتر' : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => handleProductClick(prod)}
                  className="group rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
                >
                  {/* Image with Heart Wishlist */}
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                    <img 
                      src={prod.image} 
                      alt={prod.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="absolute top-2.5 end-2.5 w-7 h-7 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-gray-600 hover:text-[#d00000] shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[15px]">favorite</span>
                    </button>
                    {prod.stock !== undefined && prod.stock <= 5 && prod.stock > 0 && (
                      <span className="absolute bottom-2 start-2 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[9px] font-bold">
                        {isAr ? `متبقي ${prod.stock} فقط!` : `Only ${prod.stock} left!`}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 truncate leading-tight">{prod.title}</h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-black text-[#d00000]">
                          EGP {prod.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                          <span className="material-symbols-outlined text-[13px] fill-current">star</span>
                          <span className="text-slate-700">{prod.rating || 4.9}</span>
                          <span className="text-gray-400 font-normal">({prod.reviewsCount || 42})</span>
                        </div>
                      </div>
                    </div>

                    {/* Red [ Add to Cart ] Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="w-full py-2 rounded-xl bg-[#d00000] text-white text-[11px] font-bold hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">shopping_cart</span>
                      <span>{isAr ? 'أضف للسلة' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Real-time Added to Cart Toast */}
      {addedToast && (
        <div className="fixed bottom-6 end-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{isAr ? `تمت إضافة "${addedToast}" إلى سلة المشتريات!` : `Added "${addedToast}" to Cart!`}</span>
        </div>
      )}
    </div>
  );
}
