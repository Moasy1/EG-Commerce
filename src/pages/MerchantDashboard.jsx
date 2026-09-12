import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductFormModal from '../components/merchant/ProductFormModal';
import StorefrontThemeCustomizer from '../components/merchant/StorefrontThemeCustomizer';
import DesktopSellerDashboard from '../components/desktop/DesktopSellerDashboard';

export default function MerchantDashboard() {
  const { 
    merchants, 
    setMerchants,
    selectedMerchantId, 
    setSelectedMerchantId,
    products, 
    orders, 
    setOrders,
    setActiveTab,
    updateProductSyndication,
    updateProduct,
    deleteProduct
  } = useApp();

  const currentMerchant = merchants.find(m => m.id === selectedMerchantId) || merchants[0];
  const merchantProducts = products.filter(p => p.merchantId === currentMerchant.id);
  const merchantOrders = orders.filter(o => o.merchantId === currentMerchant.id);

  // Subtab navigation: overview, products, orders, theme, campaigns
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [overviewViewMode, setOverviewViewMode] = useState('desktop_screen'); // 'desktop_screen' | 'saas_analytics'
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d'); // 'today' | '7d' | '30d'

  // Product Form Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productSearch, setProductSearch] = useState('');

  // Orders Filters & Modals state
  const [orderFilter, setOrderFilter] = useState('all');
  const [activeBostaAwbOrder, setActiveBostaAwbOrder] = useState(null);
  const [activeInstapayReceipt, setActiveInstapayReceipt] = useState(null);

  // UGC Review Modal state
  const [activeUgcReviewDraft, setActiveUgcReviewDraft] = useState(null);
  const [approvedDrafts, setApprovedDrafts] = useState([]);

  // Theme Settings
  const [announcementInput, setAnnouncementInput] = useState(currentMerchant.announcement);
  const [promoCodeInput, setPromoCodeInput] = useState(currentMerchant.promoCode);
  const [customDomainInput, setCustomDomainInput] = useState(currentMerchant.customDomain || '');
  const [themeColor, setThemeColor] = useState(currentMerchant.themeColor || '#ff4646');
  const [themeSavedToast, setThemeSavedToast] = useState(false);

  // Filtered Products
  const displayedProducts = merchantProducts.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()))
  );

  // Filtered Orders
  const displayedOrders = orderFilter === 'all'
    ? merchantOrders
    : merchantOrders.filter(o => o.shippingStatus === orderFilter);

  // Handlers
  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج من كتالوج المتجر؟')) {
      deleteProduct(productId);
    }
  };

  const handleStockDelta = (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    updateProduct({ ...product, stock: newStock });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, shippingStatus: newStatus } : o));
  };

  const handleApproveUgc = (draftId) => {
    setApprovedDrafts(prev => [...prev, draftId]);
    setActiveUgcReviewDraft(null);
  };

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    setMerchants(prev => prev.map(m => 
      m.id === currentMerchant.id 
        ? { ...m, announcement: announcementInput, promoCode: promoCodeInput, customDomain: customDomainInput, themeColor: themeColor }
        : m
    ));
    setThemeSavedToast(true);
    setTimeout(() => setThemeSavedToast(false), 3000);
  };

  // 7-day visual chart data (Sat - Fri)
  const chartDays = [
    { day: 'السبت', direct: 12400, reels: 9200 },
    { day: 'الأحد', direct: 14800, reels: 8100 },
    { day: 'الإثنين', direct: 11200, reels: 10400 },
    { day: 'الثلاثاء', direct: 16500, reels: 12800 },
    { day: 'الأربعاء', direct: 15300, reels: 14500 },
    { day: 'الخميس', direct: 19800, reels: 18200 },
    { day: 'الجمعة', direct: 22400, reels: 21500 },
  ];

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface flex flex-col pb-28">
      {/* 1. Top Merchant SaaS Header */}
      <div className="w-full bg-surface-container-lowest border-b border-surface-container-high py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Store Switcher & Subdomain */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-high border border-surface-container-highest p-1 flex items-center justify-center shadow-xs">
              <img 
                src={currentMerchant.logo} 
                alt={currentMerchant.name} 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <select
                  value={currentMerchant.id}
                  onChange={(e) => setSelectedMerchantId(e.target.value)}
                  className="bg-transparent font-bold text-sm md:text-base text-on-surface cursor-pointer focus:outline-none"
                >
                  {merchants.map(m => (
                    <option key={m.id} value={m.id} className="bg-surface-container text-on-surface">
                      {m.name}
                    </option>
                  ))}
                </select>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                  SaaS Active ✓
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-mono">
                <span className="text-secondary">{currentMerchant.subdomain}</span>
                <span>•</span>
                <span>باقة Growth 🚀</span>
              </div>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('storefront')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high text-xs font-bold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
              <span>عرض المتجر الحي</span>
            </button>

            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_box</span>
              <span>إضافة قطعة جديدة (Add Product)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main SaaS Navigation Tabs */}
      <div className="w-full bg-surface-container-low border-b border-surface-container-high px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {[
            { id: 'overview', label: 'نظرة عامة والتحليلات', icon: 'analytics' },
            { id: 'products', label: `المنتجات والكتالوج (${merchantProducts.length})`, icon: 'inventory_2' },
            { id: 'orders', label: `الطلبات والشحن (${merchantOrders.length})`, icon: 'local_shipping' },
            { id: 'theme', label: 'مظهر المتجر والنطاق', icon: 'palette' },
            { id: 'campaigns', label: 'حملات صناع المحتوى (UGC)', icon: 'video_camera_front' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-surface-container-highest text-primary shadow-xs border border-primary/30'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Dashboard Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 space-y-6">
        {/* Toast Alert */}
        {themeSavedToast && (
          <div className="p-3.5 rounded-2xl bg-tertiary/15 border border-tertiary/30 text-tertiary text-xs font-bold flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>تم حفظ ونشر إعدادات المتجر وهوية الثيم على السيرفر الحي بنجاح! 🚀</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 1: OVERVIEW & ANALYTICS                                            */}
        {/* ========================================================================= */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* View Mode Switcher on Desktop */}
            <div className="hidden lg:flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface-variant">واجهة لوحة التاجر:</span>
                <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-surface-container-high text-xs font-bold">
                  <button
                    onClick={() => setOverviewViewMode('desktop_screen')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all ${
                      overviewViewMode === 'desktop_screen'
                        ? 'bg-[#d00000] text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>📊 لوحة البائع الرسمية (Desktop Seller Dashboard 100%)</span>
                  </button>
                  <button
                    onClick={() => setOverviewViewMode('saas_analytics')}
                    className={`px-3.5 py-1.5 rounded-lg transition-all ${
                      overviewViewMode === 'saas_analytics'
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span>📈 تحليلات تفصيلية وأدوات SaaS</span>
                  </button>
                </div>
              </div>
            </div>

            {overviewViewMode === 'desktop_screen' ? (
              <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm overflow-hidden mb-6">
                <DesktopSellerDashboard />
              </div>
            ) : (
              <div className="space-y-6">
            {/* Filter Timeframe Bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface-variant">مؤشرات الأداء المباشرة:</span>
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high text-xs">
                {['today', '7d', '30d'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      selectedTimeframe === tf ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tf === 'today' ? 'اليوم' : tf === '7d' ? 'آخر 7 أيام' : 'هذا الشهر'}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gross Sales */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>إجمالي المبيعات (Gross Sales)</span>
                  <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-on-surface mt-2">
                  {currentMerchant.stats.grossSales.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">ج.م</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-tertiary font-bold mt-1">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span>+{currentMerchant.stats.growthPct}% مقارنة بالشهر السابق</span>
                </div>
              </div>

              {/* Total Orders */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>إجمالي الطلبات (Total Orders)</span>
                  <span className="material-symbols-outlined text-secondary text-[18px]">shopping_cart</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-on-surface mt-2">
                  {currentMerchant.stats.totalOrders} <span className="text-xs font-normal text-on-surface-variant">طلب</span>
                </div>
                <div className="text-[11px] text-on-surface-variant mt-1">
                  <span className="text-secondary font-bold">{currentMerchant.stats.ordersPending}</span> قيد التجهيز • <span className="text-tertiary font-bold">{currentMerchant.stats.ordersShipping}</span> مع بوسطة
                </div>
              </div>

              {/* Reels Attribution (Platform Advantage) */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-secondary/30 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-secondary" />
                <div className="flex items-center justify-between text-xs text-secondary font-bold">
                  <span>مبيعات الريلز والمؤثرات</span>
                  <span className="material-symbols-outlined text-secondary text-[18px]">play_circle</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-on-surface mt-2">
                  {currentMerchant.stats.reelsAttributedSales.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">ج.م</span>
                </div>
                <div className="text-[11px] text-secondary font-bold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">bolt</span>
                  <span>{currentMerchant.stats.reelsAttributedPct}% من إجمالي المبيعات عبر UGC!</span>
                </div>
              </div>

              {/* Visitors & Conversion Funnel */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>الزيارات ومعدل التحويل</span>
                  <span className="material-symbols-outlined text-tertiary text-[18px]">query_stats</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-on-surface mt-2">
                  {currentMerchant.stats.visitors.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">زيارة</span>
                </div>
                <div className="text-[11px] text-on-surface-variant mt-1">
                  معدل التحويل: <span className="text-tertiary font-bold">{currentMerchant.stats.conversionRate}%</span> • AOV: {currentMerchant.stats.aov} ج.م
                </div>
              </div>
            </div>

            {/* Visual Revenue & Attribution Bar Chart (7 Days) */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-on-surface">تحليل الإيرادات الأسبوعية (Direct Store vs. Reels Attribution)</h3>
                  <p className="text-xs text-on-surface-variant">مقارنة بين المبيعات المباشرة عبر متجرك والمبيعات القادمة من ريلز صانعات المحتوى</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span>مبيعات المتجر المباشرة</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-secondary" />
                    <span>مبيعات ريلز المؤثرات (UGC)</span>
                  </div>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="h-56 pt-6 flex items-end justify-between gap-2 sm:gap-4 border-b border-surface-container-high pb-2">
                {chartDays.map((cd, idx) => {
                  const maxVal = 45000;
                  const directH = (cd.direct / maxVal) * 100;
                  const reelsH = (cd.reels / maxVal) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <div className="text-[10px] font-mono text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                        {((cd.direct + cd.reels) / 1000).toFixed(1)}k
                      </div>
                      <div className="w-full max-w-[40px] flex flex-col gap-0.5 items-center justify-end h-40">
                        {/* Direct Store Sales Bar */}
                        <div 
                          style={{ height: `${directH}%` }} 
                          className="w-full bg-primary/90 rounded-t-md hover:brightness-110 transition-all cursor-pointer"
                          title={`مبيعات المتجر: ${cd.direct.toLocaleString()} ج.م`}
                        />
                        {/* Reels Sales Bar */}
                        <div 
                          style={{ height: `${reelsH}%` }} 
                          className="w-full bg-secondary/90 rounded-b-md hover:brightness-110 transition-all cursor-pointer"
                          title={`مبيعات الريلز: ${cd.reels.toLocaleString()} ج.م`}
                        />
                      </div>
                      <span className="text-[11px] font-medium text-on-surface-variant">{cd.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-3">
              <h3 className="text-sm font-bold text-on-surface">مسار تحويل الزوار إلى مشترين (Store Conversion Funnel)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                  <span className="text-on-surface-variant text-[11px] block">1. إجمالي الزيارات</span>
                  <span className="text-base font-bold text-on-surface mt-1 block">4,820 زيارة</span>
                  <span className="text-[10px] text-tertiary font-bold">100% نسبة الوصول</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                  <span className="text-on-surface-variant text-[11px] block">2. مشاهدة المنتجات</span>
                  <span className="text-base font-bold text-on-surface mt-1 block">3,150 تفاعل</span>
                  <span className="text-[10px] text-tertiary font-bold">65.3% من الزوار</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high">
                  <span className="text-on-surface-variant text-[11px] block">3. الإضافة للسلة</span>
                  <span className="text-base font-bold text-on-surface mt-1 block">620 إضافة</span>
                  <span className="text-[10px] text-tertiary font-bold">19.6% إضافة للشراء</span>
                </div>
                <div className="p-3 rounded-xl bg-surface-container-low border border-primary/30">
                  <span className="text-on-surface-variant text-[11px] block">4. إتمام الطلب</span>
                  <span className="text-base font-bold text-primary mt-1 block">118 طلب مدفوع</span>
                  <span className="text-[10px] text-secondary font-bold">2.45% معدل التحويل النهائي</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )}

        {/* ========================================================================= */}
        {/* SUBTAB 2: PRODUCTS & CATALOG MANAGEMENT                                    */}
        {/* ========================================================================= */}
        {activeSubTab === 'products' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm md:text-base font-bold text-on-surface">إدارة كتالوج المنتجات والمخزون</h3>
                <p className="text-xs text-on-surface-variant">
                  تعديل الأسعار، التحكم في كميات المخزون، ونشر القطع في سوق EG الموحد وقنوات الريلز
                </p>
              </div>

              {/* Search and Add Button */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="بحث بالاسم أو SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="bg-surface-container-low px-3 py-1.5 pr-8 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                  />
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2.5 top-2">search</span>
                </div>

                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 shadow-xs transition-all shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>إضافة قطعة جديدة</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-surface-container-low text-on-surface-variant border-b border-surface-container-high">
                    <tr>
                      <th className="p-3">المنتج والـ SKU</th>
                      <th className="p-3">السعر</th>
                      <th className="p-3">المخزون المتوفر</th>
                      <th className="p-3">التقييم</th>
                      <th className="p-3">المزامنة مع الريلز والسوق</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    {displayedProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img 
                            src={prod.image} 
                            alt={prod.title} 
                            className="w-10 h-12 rounded-lg object-cover bg-surface-container shrink-0"
                          />
                          <div>
                            <div className="font-bold text-on-surface line-clamp-1">{prod.title}</div>
                            <div className="text-[10px] text-on-surface-variant font-mono">{prod.sku || `SKU-${prod.id.toUpperCase()}`}</div>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-on-surface">
                          <div>{prod.price.toLocaleString()} ج.م</div>
                          {prod.originalPrice > prod.price && (
                            <span className="text-[10px] text-on-surface-variant line-through">{prod.originalPrice.toLocaleString()} ج.م</span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStockDelta(prod, -1)}
                              className="w-6 h-6 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center font-bold"
                              title="تقليل المخزون"
                            >
                              -
                            </button>
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              (prod.stock || 0) > 5 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}>
                              {prod.stock || 0} قطعة
                            </span>
                            <button
                              onClick={() => handleStockDelta(prod, 1)}
                              className="w-6 h-6 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center font-bold"
                              title="زيادة المخزون"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-secondary font-bold">
                          ⭐ {prod.rating} ({prod.reviewsCount})
                        </td>
                        <td className="p-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={prod.isSyndicated !== false} 
                              onChange={() => updateProductSyndication && updateProductSyndication(prod.id)}
                              className="sr-only peer" 
                            />
                            <div className="w-9 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            <span className="ms-2 text-[11px] text-on-surface-variant font-medium">
                              {prod.isSyndicated !== false ? 'منشور في الريلز والسوق' : 'في متجري فقط'}
                            </span>
                          </label>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                              title="تعديل المنتج"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                              title="حذف القطعة"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 3: ORDERS & BOSTA FULFILLMENT                                      */}
        {/* ========================================================================= */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm md:text-base font-bold text-on-surface">الطلبات والشحن مع بوسطة Bosta Express</h3>
                <p className="text-xs text-on-surface-variant">
                  إدارة ومعالجة الطلبات، طباعة بوليصات الشحن، وتأكيد تحويلات InstaPay والدفع عند الاستلام COD
                </p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-high text-xs">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'ready_for_pickup', label: 'قيد التجهيز' },
                  { id: 'in_transit', label: 'مع المندوب' },
                  { id: 'delivered', label: 'تم التسليم' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setOrderFilter(f.id)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${
                      orderFilter === f.id ? 'bg-primary text-on-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Cards List */}
            <div className="space-y-3">
              {displayedOrders.map((ord) => (
                <div 
                  key={ord.id}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-high pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-secondary">#{ord.id}</span>
                      <span className="text-xs text-on-surface-variant">({ord.date})</span>
                      {ord.attributedCreator && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">play_circle</span>
                          <span>عبر ريل {ord.attributedCreator}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveInstapayReceipt(ord)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer hover:brightness-110 flex items-center gap-1 ${
                          ord.paymentStatus === 'paid' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        <span>{ord.paymentMethod}</span>
                        <span className="material-symbols-outlined text-[12px]">info</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-on-surface-variant block text-[11px]">بيانات العميل:</span>
                      <span className="font-bold text-on-surface">{ord.customerName}</span>
                      <p className="text-[11px] text-on-surface-variant mt-0.5 font-mono">{ord.phone}</p>
                      <p className="text-[11px] text-on-surface-variant">{ord.address}</p>
                    </div>

                    <div>
                      <span className="text-on-surface-variant block text-[11px]">المنتج والقيمة:</span>
                      <span className="font-bold text-on-surface">{ord.productTitle}</span>
                      <p className="text-xs font-bold text-primary mt-0.5">{ord.amount.toLocaleString()} ج.م</p>
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <span className="text-on-surface-variant block text-[11px]">الشحن والتتبع:</span>
                        <div className="flex items-center gap-1 text-xs font-mono text-tertiary">
                          <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                          <span>{ord.trackingNumber}</span>
                        </div>
                        <span className="text-[11px] text-on-surface-variant">
                          الحالة: <strong className="text-on-surface">
                            {ord.shippingStatus === 'ready_for_pickup' ? 'جاهز لاستلام مندوب بوسطة' : ord.shippingStatus === 'in_transit' ? 'في طريق التوصيل للعميل' : 'تم التسليم بنجاح'}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setActiveBostaAwbOrder(ord)}
                          className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high text-xs font-bold flex items-center gap-1 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[14px] text-secondary">print</span>
                          <span>طباعة بوليصة بوسطة (AWB)</span>
                        </button>
                        {ord.shippingStatus === 'ready_for_pickup' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'in_transit')}
                            className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-on-primary border border-primary/20 text-xs font-bold transition-all"
                          >
                            تحديث: تسليم للمندوب
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 4: THEME & DOMAIN SETTINGS                                         */}
        {/* ========================================================================= */}
        {activeSubTab === 'theme' && (
          <form onSubmit={handleSaveStoreSettings} className="space-y-6 max-w-4xl animate-fade-in">
            <div>
              <h3 className="text-sm md:text-base font-bold text-on-surface">إعدادات النطاق وهوية المتجر (Store Customizer)</h3>
              <p className="text-xs text-on-surface-variant">
                تخصيص رابط المتجر المستقل والألوان وشريط الإعلانات الترويجي
              </p>
            </div>

            {/* Subdomain & Custom Domain */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-3 shadow-xs">
              <h4 className="text-xs font-bold text-on-surface">1. رابط ونطاق المتجر (Domain Settings)</h4>
              
              <div>
                <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                  رابط المتجر على نطاق EG-Commerce الفرعي (Subdomain):
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-surface-container-high rounded-r-xl text-xs font-mono text-on-surface-variant border border-l-0 border-surface-container-highest">
                    https://
                  </span>
                  <input
                    type="text"
                    value={currentMerchant.slug}
                    readOnly
                    className="flex-1 bg-surface-container-low px-3 py-2 text-xs font-mono font-bold text-secondary border-y border-surface-container-high focus:outline-none"
                  />
                  <span className="px-3 py-2 bg-surface-container-high rounded-l-xl text-xs font-mono text-on-surface-variant border border-r-0 border-surface-container-highest">
                    .eg-commerce.com
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                  ربط دومين خاص (Custom Domain CNAME):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="shop.yourbrand.com"
                    value={customDomainInput}
                    onChange={(e) => setCustomDomainInput(e.target.value)}
                    className="flex-1 bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary font-mono"
                  />
                  <span className="px-3 py-2 rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/20 text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">lock</span>
                    <span>{currentMerchant.customDomainStatus}</span>
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant mt-1 font-mono">
                  سجل الـ DNS المطلوب: CNAME points to <code className="text-secondary">cname.eg-commerce.com</code>
                </p>
              </div>
            </div>

            {/* Theme Colors and Announcements */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-4 shadow-xs">
              <h4 className="text-xs font-bold text-on-surface">2. ألوان الهوية وشريط الإعلانات</h4>

              {/* Theme Color Presets */}
              <div>
                <label className="block text-[11px] font-medium text-on-surface-variant mb-1.5">لون هوية المتجر (Brand Accent Color):</label>
                <div className="flex items-center gap-3">
                  {[
                    { name: 'Sunset Coral', hex: '#ff4646' },
                    { name: 'Imperial Amber', hex: '#feb700' },
                    { name: 'Emerald Mint', hex: '#10b981' },
                    { name: 'Royal Sapphire', hex: '#3b82f6' },
                  ].map((color) => (
                    <button
                      type="button"
                      key={color.hex}
                      onClick={() => setThemeColor(color.hex)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                        themeColor === color.hex ? 'border-white ring-2 ring-primary/40' : 'border-surface-container-high'
                      }`}
                      style={{ backgroundColor: color.hex + '20', color: color.hex }}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color.hex }} />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                  نص شريط الإعلانات العلوي في المتجر:
                </label>
                <input
                  type="text"
                  value={announcementInput}
                  onChange={(e) => setAnnouncementInput(e.target.value)}
                  className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs text-on-surface border border-surface-container-high focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                    كود الخصم الترويجي:
                  </label>
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs font-mono font-bold text-secondary border border-surface-container-high focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                    حساب إنستاباي للدفع المباشر:
                  </label>
                  <input
                    type="text"
                    value={currentMerchant.instapayHandle}
                    readOnly
                    className="w-full bg-surface-container-low px-3 py-2 rounded-xl text-xs font-mono text-on-surface border border-surface-container-high"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>حفظ ونشر التعديلات</span>
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 5: UGC CAMPAIGNS HUB                                               */}
        {/* ========================================================================= */}
        {activeSubTab === 'campaigns' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm md:text-base font-bold text-on-surface">حملات صناع المحتوى (UGC Campaigns Hub)</h3>
                <p className="text-xs text-on-surface-variant">
                  إدارة حملات الفيديو، فحص مسودات الريلز المرسلة من المؤثرات واعتماد الدفعات والعمولات
                </p>
              </div>
              <button
                onClick={() => setActiveTab('merchant_campaign')}
                className="px-3.5 py-1.5 rounded-xl bg-secondary text-on-secondary text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                <span>إنشاء حملة ريلز جديدة</span>
              </button>
            </div>

            {/* Active Campaign Card */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    حملة نشطة حالياً
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-on-surface mt-1">
                    حملة ريلز استعراض كولكشن الكتان الصيفي 2026
                  </h4>
                </div>
                <div className="text-right text-xs">
                  <span className="text-on-surface-variant block">المكافأة:</span>
                  <span className="font-bold text-secondary">750 ج.م كاش + 12% عمولة مبيعات</span>
                </div>
              </div>

              {/* Submissions Pending Approval */}
              <div className="pt-2 border-t border-surface-container-high space-y-2">
                <span className="text-[11px] font-bold text-on-surface block">
                  مسودات فيديوهات قيد المراجعة والاعتماد:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'draft-1', creator: '@nour_style', name: 'نور ستايل', title: 'فيديو مسودة 38 ثانية • تنسيق عباية الكتان بشارع المعز', img: '/images/reels/reel_1.jpg' },
                    { id: 'draft-2', creator: '@farida_fashion', name: 'فريدة فاشون', title: 'فيديو مسودة 45 ثانية • إطلالة كيمونو رملي صيفي بالزمالك', img: '/images/reels/reel_2.jpg' }
                  ].map((draft) => {
                    const isApproved = approvedDrafts.includes(draft.id);
                    return (
                      <div key={draft.id} className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <img src={draft.img} alt={draft.creator} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <span className="text-xs font-bold text-on-surface block">{draft.creator}</span>
                            <span className="text-[10px] text-on-surface-variant">{draft.title}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setActiveUgcReviewDraft(draft)}
                            className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface"
                            title="معاينة مسودة الفيديو"
                          >
                            <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                          </button>
                          {isApproved ? (
                            <span className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                              تم الاعتماد ✓
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleApproveUgc(draft.id)}
                              className="px-2.5 py-1 rounded-lg bg-tertiary text-on-tertiary text-[10px] font-bold hover:brightness-110"
                            >
                              اعتماد ونشر
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 4: STOREFRONT THEME & LAYOUT CUSTOMIZER                            */}
        {/* ========================================================================= */}
        {activeSubTab === 'theme' && (
          <StorefrontThemeCustomizer />
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: PRODUCT FORM MODAL (ADD / EDIT)                                  */}
      {/* ========================================================================= */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
      />

      {/* ========================================================================= */}
      {/* MODAL 2: BOSTA SHIPPING WAYBILL (AWB) PREVIEW                             */}
      {/* ========================================================================= */}
      {activeBostaAwbOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white text-slate-900 rounded-3xl p-6 shadow-2xl space-y-4">
            {/* AWB Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                  B
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">بوسطة • BOSTA EXPRESS AWB</h4>
                  <span className="font-mono text-xs text-slate-500">Waybill: {activeBostaAwbOrder.trackingNumber}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveBostaAwbOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Barcode Mockup */}
            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-1">
              <div className="font-mono tracking-widest text-lg font-bold text-slate-800">||| |||| || ||||| |||| |||</div>
              <div className="font-mono text-xs text-slate-600">{activeBostaAwbOrder.trackingNumber}</div>
            </div>

            {/* Sender & Receiver Info */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-500 block font-bold">الراسل (Sender Atelier):</span>
                <strong className="block">{currentMerchant.name}</strong>
                <span className="text-[11px] text-slate-600 block">14 شارع دجلة، المعادي، القاهرة</span>
                <span className="text-[11px] font-mono text-slate-600">{currentMerchant.whatsapp}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl">
                <span className="text-[10px] text-slate-500 block font-bold">المرسل إليه (Consignee):</span>
                <strong className="block">{activeBostaAwbOrder.customerName}</strong>
                <span className="text-[11px] text-slate-600 block">{activeBostaAwbOrder.address}</span>
                <span className="text-[11px] font-mono text-slate-600">{activeBostaAwbOrder.phone}</span>
              </div>
            </div>

            {/* Financials & Package details */}
            <div className="p-3 bg-red-50 rounded-xl border border-red-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-red-700 block font-bold">المبلغ المطلوب تحصيله (COD Amount):</span>
                <span className="text-base font-bold text-red-600">
                  {activeBostaAwbOrder.paymentStatus === 'paid' ? '0 ج.م (مدفوع مسبقاً)' : `${activeBostaAwbOrder.amount.toLocaleString()} ج.م`}
                </span>
              </div>
              <span className="px-2 py-1 rounded bg-white text-slate-700 font-bold text-[10px] border border-red-200">
                طرد ملابس كتان (1 قطعة)
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`جاري إرسال بوليصة ${activeBostaAwbOrder.trackingNumber} إلى طابعة الباركود الحرارية...`);
                  setActiveBostaAwbOrder(null);
                }}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>طباعة البوليصة الحرارية (Print Label)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: INSTAPAY RECEIPT VERIFICATION MODAL                             */}
      {/* ========================================================================= */}
      {activeInstapayReceipt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-surface-container-lowest border border-surface-container-high rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[24px]">verified</span>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">إشعار التحويل البنكي الفوري • InstaPay</h4>
                  <span className="text-[11px] text-on-surface-variant font-mono">مرجع: REF-98124-EGP</span>
                </div>
              </div>
              <button
                onClick={() => setActiveInstapayReceipt(null)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">المرسل:</span>
                <span className="font-bold text-on-surface">{activeInstapayReceipt.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">الحساب المستلم:</span>
                <span className="font-mono font-bold text-secondary">{currentMerchant.instapayHandle}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">المبلغ المحول:</span>
                <span className="text-sm font-bold text-emerald-400">{activeInstapayReceipt.amount.toLocaleString()} ج.م</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">حالة التحويل:</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                  مكتمل ومؤكد بنكياً ✓
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveInstapayReceipt(null)}
              className="w-full py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110"
            >
              إغلاق الإشعار
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: UGC VIDEO DRAFT REVIEW MODAL                                    */}
      {/* ========================================================================= */}
      {activeUgcReviewDraft && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm bg-surface-container-lowest border border-surface-container-high rounded-3xl overflow-hidden shadow-2xl">
            <div className="aspect-[9/16] w-full relative">
              <img src={activeUgcReviewDraft.img} alt={activeUgcReviewDraft.creator} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-black/60 px-2.5 py-1 rounded-full">{activeUgcReviewDraft.creator}</span>
                  <button 
                    onClick={() => setActiveUgcReviewDraft(null)}
                    className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-amber-300">{activeUgcReviewDraft.title}</h5>
                    <p className="text-[11px] text-slate-200 mt-0.5">
                      فيديو ريلز عمودي يستعرض خامة الكتان وتفاصيل التطريز مع ذكر كود الخصم.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveUgc(activeUgcReviewDraft.id)}
                      className="flex-1 py-2 rounded-xl bg-tertiary text-on-tertiary text-xs font-bold hover:brightness-110 flex items-center justify-center gap-1 shadow-md"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>اعتماد وصرف المكافأة (750 ج.م)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
