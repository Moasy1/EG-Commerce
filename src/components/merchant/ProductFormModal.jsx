import React, { useState, useEffect } from 'react';
import { useApp, MERCHANTS_DATA } from '../../context/AppContext';

export default function ProductFormModal({ isOpen, onClose, productToEdit = null }) {
  const { addProduct, updateProduct, selectedMerchantId, merchants, user } = useApp();
  const isPlatformAdmin = user && (user.role === 'admin' || user.role === 'superadmin');
  const userMerchantFallback = (user && user.role === 'merchant') ? {
    id: user.merchant_id || `m-${user.id}`,
    user_id: user.id,
    name: user.store_name || user.name || 'متجر معتمد',
    shortName: user.store_name || user.name || 'متجر',
    slug: user.store_slug || user.slug || 'store',
    logo: user.avatar_url || '/images/brands/dripfit_logo.png'
  } : null;

  const fallbackMerchant = userMerchantFallback || ((merchants && merchants.length > 0) ? merchants[0] : (MERCHANTS_DATA?.[0] || {}));
  const currentMerchant = (merchants && merchants.length > 0)
    ? (
        isPlatformAdmin
          ? (merchants.find(m => m.id === selectedMerchantId) || merchants[0])
          : (merchants.find(m => 
              m.id === user?.merchant_id || 
              m.user_id === user?.id || 
              (user?.store_slug && m.slug === user.store_slug) ||
              (user?.slug && m.slug === user.slug)
            ) || userMerchantFallback || fallbackMerchant)
      )
    : fallbackMerchant;

  const [activeFormTab, setActiveFormTab] = useState('general'); // 'general' | 'pricing' | 'inventory' | 'syndication'

  // Form fields state
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('ملابس وأزياء');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [stock, setStock] = useState('10');
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [isSyndicated, setIsSyndicated] = useState(true);
  const [affiliateRate, setAffiliateRate] = useState('10');

  const presetImages = [
    { label: 'The Sharp V Yellow', url: '/images/products/the_sharp_v_yellow_1.webp' },
    { label: 'The Sharp V Front', url: '/images/products/the_sharp_v_yellow_2.webp' },
    { label: 'لوجو المتجر', url: '/images/brands/dripfit_logo.png' }
  ];

  // Populate when editing
  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title || productToEdit.name || '');
      setSku(productToEdit.sku || '');
      setCategory(productToEdit.category || 'ملابس وأزياء');
      setDescription(productToEdit.description || '');
      setImage(productToEdit.image || '');
      setOriginalPrice(String(productToEdit.originalPrice || ''));
      setPrice(String(productToEdit.price || ''));
      setCostPrice(String(Math.round((productToEdit.price || 0) * 0.5)));
      setStock(String(productToEdit.stock || '10'));
      setSizes(productToEdit.sizes || []);
      setColors(productToEdit.colors || []);
      setIsSyndicated(productToEdit.isSyndicated !== false);
      setAffiliateRate(String(productToEdit.affiliateRate || '10'));
    } else {
      // Default new product values
      setTitle('');
      const rawPrefix = currentMerchant?.shortName || currentMerchant?.name || 'PRD';
      const cleanPrefix = (String(rawPrefix).replace(/[^a-zA-Z0-9]/g, '') || 'PRD').toUpperCase().slice(0, 3);
      setSku(`${cleanPrefix}-${Date.now().toString().slice(-4)}`);
      setCategory('ملابس وأزياء');
      setDescription('');
      setImage('');
      setOriginalPrice('');
      setPrice('');
      setCostPrice('');
      setStock('10');
      setSizes([]);
      setColors([]);
      setIsSyndicated(true);
      setAffiliateRate('10');
    }
  }, [productToEdit, isOpen, currentMerchant]);

  if (!isOpen) return null;

  // Profit Calculation
  const numPrice = parseFloat(price) || 0;
  const numCost = parseFloat(costPrice) || 0;
  const numOriginal = parseFloat(originalPrice) || numPrice;
  const profitAmount = Math.max(0, numPrice - numCost);
  const profitMarginPct = numPrice > 0 ? ((profitAmount / numPrice) * 100).toFixed(1) : 0;
  const discountSaved = Math.max(0, numOriginal - numPrice);

  const toggleSize = (s) => {
    setSizes(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const productPayload = {
      id: productToEdit ? productToEdit.id : `p-${Date.now()}`,
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      merchant: currentMerchant?.name || (user?.store_name || user?.name || 'متجر معتمد'),
      merchantId: currentMerchant?.id || user?.merchant_id || (user?.id ? `m-${user.id}` : '171842bd-daed-40ef-853f-917eab2ed437'),
      merchantSlug: currentMerchant?.slug || user?.store_slug || user?.slug || 'store',
      createdBy: user?.id || null,
      merchantVerified: true,
      price: numPrice,
      originalPrice: numOriginal,
      rating: productToEdit ? productToEdit.rating : 5.0,
      reviewsCount: productToEdit ? productToEdit.reviewsCount : 0,
      stock: parseInt(stock, 10) || 0,
      isSyndicated: isSyndicated,
      affiliateRate: parseFloat(affiliateRate) || 10,
      image: image || (currentMerchant?.logo || '/images/products/the_sharp_v_yellow_1.webp'),
      pointsEarned: Math.round(numPrice * 0.1),
      category: category,
      description: description,
      sizes: sizes,
      colors: colors
    };

    if (productToEdit) {
      updateProduct(productPayload);
    } else {
      addProduct(productPayload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-surface-container-lowest border border-surface-container-high rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-surface-container-high bg-surface-container-low flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">
                {productToEdit ? 'edit_note' : 'add_box'}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-on-surface">
                {productToEdit ? 'تعديل بيانات المنتج' : 'إضافة قطعة جديدة للكتالوج • New Product'}
              </h3>
              <p className="text-[11px] text-on-surface-variant">
                متجر {currentMerchant?.name || 'متجر معتمد'} ({currentMerchant?.subdomain || 'store.egyptian-commerce.com'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tab Navigation inside Form */}
        <div className="bg-surface-container-lowest border-b border-surface-container-high px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none py-2">
          {[
            { id: 'general', label: '1. البيانات الأساسية', icon: 'description' },
            { id: 'pricing', label: '2. السعر والأرباح', icon: 'attach_money' },
            { id: 'inventory', label: '3. المخزون والمقاسات', icon: 'inventory' },
            { id: 'syndication', label: '4. مزامنة الريلز والسوق', icon: 'hub' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFormTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFormTab === tab.id
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body + Live Preview Split Layout */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Form Inputs (7 cols on lg) */}
            <div className="lg:col-span-7 space-y-4">
              {/* TAB 1: GENERAL */}
              {activeFormTab === 'general' && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      اسم المنتج باللغتين (العربية والإنجليزية) <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: فستان كتان بوهيمي صيفي • Bohemian Linen Dress"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant mb-1">القسم / التصنيف:</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                      >
                        <option value="Linen كاجوال كتان">Linen كاجوال كتان</option>
                        <option value="Abayas عبايات وكيمونو">Abayas عبايات وكيمونو</option>
                        <option value="Shirts قمصان صيفية">Shirts قمصان صيفية</option>
                        <option value="Bags حقائب جلدية">Bags حقائب جلدية</option>
                        <option value="Jewelry إكسسوارات ومجوهرات">Jewelry إكسسوارات ومجوهرات</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant mb-1">رمز الـ SKU:</label>
                      <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs font-mono font-bold text-secondary border border-surface-container-high focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      صورة المنتج (اختر من المعرض المقترح أو أدخل رابط مباشر):
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {presetImages.map((imgItem, idx) => (
                        <div
                          key={idx}
                          onClick={() => setImage(imgItem.url)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            image === imgItem.url ? 'border-primary scale-95 ring-2 ring-primary/30' : 'border-surface-container-high opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={imgItem.url} alt={imgItem.label} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <input
                      type="url"
                      placeholder="https://images.example.com/product.jpg"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">وصف وتفاصيل القطعة:</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & PROFIT */}
              {activeFormTab === 'pricing' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-on-surface mb-1">
                        سعر البيع المخفض (EGP) <span className="text-primary">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-sm font-bold text-primary border border-surface-container-high focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                        السعر الأصلي قبل الخصم:
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface-variant border border-surface-container-high focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-on-surface-variant mb-1">
                        تكلفة تصنيع القطعة:
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Real-time Profit Margin Indicator */}
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high space-y-2">
                    <span className="text-[11px] font-bold text-secondary block">تحليل الأرباح للقطعة الواحدة (Unit Economics):</span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-surface-container-lowest border border-surface-container-high">
                        <span className="text-[10px] text-on-surface-variant block">صافي الربح:</span>
                        <span className="font-bold text-emerald-400 text-sm">{profitAmount.toLocaleString()} ج.م</span>
                      </div>
                      <div className="p-2 rounded-xl bg-surface-container-lowest border border-surface-container-high">
                        <span className="text-[10px] text-on-surface-variant block">هامش الربح:</span>
                        <span className="font-bold text-secondary text-sm">{profitMarginPct}%</span>
                      </div>
                      <div className="p-2 rounded-xl bg-surface-container-lowest border border-surface-container-high">
                        <span className="text-[10px] text-on-surface-variant block">وفر العميل:</span>
                        <span className="font-bold text-on-surface text-sm">{discountSaved.toLocaleString()} ج.م</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INVENTORY & SIZES */}
              {activeFormTab === 'inventory' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">الكمية المتوفرة في المخزن:</label>
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-sm font-bold text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Size Selection */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-2">المقاسات المتوفرة:</label>
                    <div className="flex flex-wrap gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', '52', '54', '56', 'One Size'].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => toggleSize(s)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                            sizes.includes(s)
                              ? 'bg-primary text-on-primary border-primary shadow-xs'
                              : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:border-outline'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color tags */}
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">الألوان المتاحة (مفصولة بفاصلة):</label>
                    <input
                      type="text"
                      value={colors.join(', ')}
                      onChange={(e) => setColors(e.target.value.split(',').map(c => c.trim()))}
                      placeholder="Terracotta تيراكوتا, Sandy Beige بيج رملي, Black أسود"
                      className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: SYNDICATION & PLATFORM MOAT */}
              {activeFormTab === 'syndication' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-primary/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">النشر في سوق EG الموحد وقنوات الريلز</h4>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">
                          تزامن فوري يجعل القطعة تظهر لملايين المشترين في ريلز الاستكشاف والسوق العام
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={isSyndicated} 
                          onChange={(e) => setIsSyndicated(e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {isSyndicated && (
                      <div className="pt-3 border-t border-surface-container-high space-y-3 animate-fade-in">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-on-surface">نسبة عمولة صانعات المحتوى (Affiliate Commission):</span>
                            <span className="font-mono font-bold text-secondary">{affiliateRate}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="30"
                            value={affiliateRate}
                            onChange={(e) => setAffiliateRate(e.target.value)}
                            className="w-full accent-secondary cursor-pointer"
                          />
                          <p className="text-[10px] text-on-surface-variant mt-0.5">
                            العمولة التي ستحصل عليها الصانعة عند إتمام بيع مؤكد عبر فيديو الريل الخاص بها.
                          </p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-surface-container-lowest text-xs flex items-center justify-between">
                          <span className="text-on-surface-variant">نقاط المكافأة للمشتري:</span>
                          <span className="font-bold text-tertiary">+{Math.round(numPrice * 0.1)} نقطة ولاء</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Storefront Product Card Preview (5 cols on lg) */}
            <div className="lg:col-span-5 bg-surface-container-low p-4 rounded-2xl border border-surface-container-high flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-2">
                  معاينة مظهر القطعة في متجرك (Live Preview)
                </span>

                {/* Preview Product Card */}
                <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high overflow-hidden shadow-md max-w-[260px] mx-auto">
                  <div className="aspect-[3/4] w-full relative bg-surface-container overflow-hidden">
                    <img src={image || presetImages[0].url} alt="Preview" className="w-full h-full object-cover" />
                    {discountSaved > 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-primary text-on-primary text-[9px] font-bold">
                        وفر {discountSaved} ج.م
                      </span>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-bold">
                      {category.split(' ')[0]}
                    </span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <h5 className="text-xs font-bold text-on-surface line-clamp-1">{title || 'اسم القطعة المقترح'}</h5>
                    <div className="flex items-center gap-1 text-[11px] text-secondary">
                      <span>⭐ 5.0</span>
                      <span className="text-[10px] text-on-surface-variant">(جديد)</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-surface-container-high">
                      <span className="text-xs font-bold text-on-surface">{numPrice.toLocaleString()} ج.م</span>
                      {numOriginal > numPrice && (
                        <span className="text-[10px] text-on-surface-variant line-through">{numOriginal.toLocaleString()} ج.م</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-center text-on-surface-variant">
                يتم حفظ القطعة وتحديث المخزون لحظياً على سيرفرات المتجر.
              </div>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="mt-6 pt-4 border-t border-surface-container-high flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              <span>{productToEdit ? 'تحديث ونشر التعديلات' : 'إضافة ونشر في المتجر'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
