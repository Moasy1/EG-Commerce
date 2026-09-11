import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function MerchantDashboard() {
  const { 
    merchants, 
    selectedMerchantId, 
    setSelectedMerchantId,
    products, 
    orders, 
    setOrders,
    setActiveTab,
    updateProductSyndication
  } = useApp();

  const currentMerchant = merchants.find(m => m.id === selectedMerchantId) || merchants[0];
  const merchantProducts = products.filter(p => p.merchantId === currentMerchant.id);
  const merchantOrders = orders.filter(o => o.merchantId === currentMerchant.id);

  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, products, orders, theme, campaigns
  const [announcementInput, setAnnouncementInput] = useState(currentMerchant.announcement);
  const [promoCodeInput, setPromoCodeInput] = useState(currentMerchant.promoCode);
  const [customDomainInput, setCustomDomainInput] = useState(currentMerchant.customDomain || '');
  const [themeSavedToast, setThemeSavedToast] = useState(false);

  // Quick Order Status Updater
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, shippingStatus: newStatus } : o));
  };

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    setThemeSavedToast(true);
    setTimeout(() => setThemeSavedToast(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface flex flex-col pb-28">
      {/* Top Merchant SaaS Header */}
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
                  SaaS Active
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high text-xs font-bold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
              <span>عرض المتجر الحي (Storefront)</span>
            </button>

            <button
              onClick={() => setActiveTab('merchant_campaign')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              <span>إطلاق حملة UGC جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main SaaS Navigation Tabs */}
      <div className="w-full bg-surface-container-low border-b border-surface-container-high px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          {[
            { id: 'overview', label: 'نظرة عامة والتحليلات', icon: 'analytics' },
            { id: 'products', label: `المنتجات والمخزون (${merchantProducts.length})`, icon: 'inventory_2' },
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

      {/* Main Dashboard Workspace */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-6 space-y-6">
        {/* Toast Alert */}
        {themeSavedToast && (
          <div className="p-3 rounded-2xl bg-tertiary/15 border border-tertiary/30 text-tertiary text-xs font-bold flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>تم حفظ ونشر إعدادات المتجر والنطاق على السيرفر الحي بنجاح! 🚀</span>
          </div>
        )}

        {/* SUBTAB 1: OVERVIEW */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
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

              {/* Orders Count */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs">
                <div className="flex items-center justify-between text-xs text-on-surface-variant">
                  <span>إجمالي الطلبات (Orders)</span>
                  <span className="material-symbols-outlined text-secondary text-[18px]">shopping_cart</span>
                </div>
                <div className="text-xl md:text-2xl font-bold text-on-surface mt-2">
                  {currentMerchant.stats.totalOrders} <span className="text-xs font-normal text-on-surface-variant">طلب</span>
                </div>
                <div className="text-[11px] text-on-surface-variant mt-1">
                  <span className="text-secondary font-bold">{currentMerchant.stats.ordersPending}</span> قيد التجهيز • <span className="text-tertiary font-bold">{currentMerchant.stats.ordersShipping}</span> مع بوسطة
                </div>
              </div>

              {/* Reels Sales Attribution (The Platform Moat!) */}
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-secondary/30 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-secondary" />
                <div className="flex items-center justify-between text-xs text-secondary font-bold">
                  <span>مبيعات الريلز وصناع المحتوى</span>
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

              {/* Visitors & Conversion */}
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

            {/* Syndication Banner: The Shopify + TikTok Commerce Bridge */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-lowest border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">hub</span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-on-surface">
                    قوة الربط المزدوج: متجرك المستقل + سوق EG الموحد
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    منتجاتك متاحة للشراء المباشر على <code className="text-secondary font-mono">{currentMerchant.subdomain}</code> ومتزامنة تلقائياً مع ريلز المشترين!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveSubTab('products')}
                className="px-3.5 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface text-xs font-bold border border-surface-container-highest transition-all shrink-0"
              >
                إدارة مزامنة الكتالوج
              </button>
            </div>

            {/* Attributed Creators Leaderboard */}
            <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-on-surface">صانعات المحتوى الأكثر تحقيقاً للمبيعات • UGC Attribution</h3>
                  <p className="text-xs text-on-surface-variant">المؤثرات اللاتي قمن بتصوير ريلز وحققن مبيعات مؤكدة لمتجرك</p>
                </div>
                <button 
                  onClick={() => setActiveSubTab('campaigns')}
                  className="text-xs text-secondary font-bold hover:underline"
                >
                  عرض تفاصيل الحملات
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {[
                  { name: 'نور ستايل (@nour_style)', orders: '24 طلب', revenue: '34,800 ج.م', commission: '4,176 ج.م (12%)', badge: '🥇 الأكثر مبيعاً' },
                  { name: 'فريدة فاشون (@farida_fashion)', orders: '12 طلب', revenue: '17,400 ج.م', commission: '2,088 ج.م (12%)', badge: '🥈 المركز الثاني' },
                  { name: 'سلمى إيجيبت (@salma_egypt)', orders: '7 طلبات', revenue: '10,150 ج.م', commission: '1,218 ج.م (12%)', badge: '🥉 المركز الثالث' },
                ].map((c, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col justify-between space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface">{c.name}</span>
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">{c.badge}</span>
                    </div>
                    <div className="text-xs text-on-surface-variant space-y-0.5">
                      <div>المبيعات المحققة: <span className="text-on-surface font-bold">{c.revenue}</span> ({c.orders})</div>
                      <div>العمولة المستحقة: <span className="text-tertiary font-bold">{c.commission}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: PRODUCTS & INVENTORY */}
        {activeSubTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm md:text-base font-bold text-on-surface">إدارة كتالوج المنتجات والمخزون</h3>
                <p className="text-xs text-on-surface-variant">
                  التحكم في أسعار ومخزون منتجاتك، وتفعيل نشرها في سوق EG الموحد وفيديوهات الريلز
                </p>
              </div>
              <button
                onClick={() => alert('إضافة منتج جديد: ميزة الكتالوج السريع')}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 transition-all self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>إضافة قطعة جديدة</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-surface-container-low text-on-surface-variant border-b border-surface-container-high">
                    <tr>
                      <th className="p-3">المنتج والـ SKU</th>
                      <th className="p-3">السعر</th>
                      <th className="p-3">المخزون</th>
                      <th className="p-3">التقييم</th>
                      <th className="p-3">النشر في سوق EG والريلز</th>
                      <th className="p-3">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    {merchantProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img 
                            src={prod.image} 
                            alt={prod.title} 
                            className="w-10 h-12 rounded-lg object-cover bg-surface-container"
                          />
                          <div>
                            <div className="font-bold text-on-surface line-clamp-1">{prod.title}</div>
                            <div className="text-[10px] text-on-surface-variant font-mono">{prod.sku || `SKU-${prod.id.toUpperCase()}`}</div>
                          </div>
                        </td>
                        <td className="p-3 font-bold text-on-surface">
                          {prod.price.toLocaleString()} ج.م
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                            متوفر ({prod.stock || 18} قطعة)
                          </span>
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
                              {prod.isSyndicated !== false ? 'منشور في الريلز والسوق' : 'في متجري الخاص فقط'}
                            </span>
                          </label>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setActiveTab('storefront')}
                            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                            title="معاينة في المتجر"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: ORDERS & SHIPPING */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm md:text-base font-bold text-on-surface">الطلبات والشحن مع بوسطة Bosta</h3>
                <p className="text-xs text-on-surface-variant">
                  معالجة الطلبات، تتبع حالة الشحن، والتحقق من تحويلات InstaPay والدفع عند الاستلام COD
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-on-surface-variant">حساب بوسطة المتصل:</span>
                <span className="font-mono text-xs font-bold text-tertiary bg-tertiary/10 px-2.5 py-1 rounded-lg border border-tertiary/20">
                  {currentMerchant.bostaAccount}
                </span>
              </div>
            </div>

            {/* Orders List Cards */}
            <div className="space-y-3">
              {merchantOrders.map((ord) => (
                <div 
                  key={ord.id}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-high pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-secondary">#{ord.id}</span>
                      <span className="text-xs text-on-surface-variant">({ord.date})</span>
                      {ord.attributedCreator && (
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          عبر ريل {ord.attributedCreator}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.paymentStatus === 'paid' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {ord.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-on-surface-variant block text-[11px]">بيانات العميل:</span>
                      <span className="font-bold text-on-surface">{ord.customerName}</span>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{ord.phone}</p>
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
                          الحالة: <strong className="text-on-surface">{ord.shippingStatus === 'ready_for_pickup' ? 'جاهز لاستلام مندوب بوسطة' : ord.shippingStatus === 'in_transit' ? 'في طريق التوصيل للعميل' : 'تم التسليم'}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => alert(`طباعة بوليصة شحن بوسطة للطلب ${ord.id}`)}
                          className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high text-[11px] font-bold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[13px]">print</span>
                          <span>طباعة البوليصة</span>
                        </button>
                        {ord.shippingStatus === 'ready_for_pickup' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'in_transit')}
                            className="px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-on-primary border border-primary/20 text-[11px] font-bold"
                          >
                            تحديث: تم التسليم للمندوب
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

        {/* SUBTAB 4: THEME & DOMAIN SETTINGS */}
        {activeSubTab === 'theme' && (
          <form onSubmit={handleSaveStoreSettings} className="space-y-5 max-w-3xl">
            <div>
              <h3 className="text-sm md:text-base font-bold text-on-surface">إعدادات النطاق وهوية المتجر (SaaS Customizer)</h3>
              <p className="text-xs text-on-surface-variant">
                تخصيص رابط المتجر المستقل والألوان وشريط الإعلانات الترويجي
              </p>
            </div>

            {/* Subdomain & Custom Domain */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-3">
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
              </div>
            </div>

            {/* Promo & Announcement Bar */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-3">
              <h4 className="text-xs font-bold text-on-surface">2. شريط الإعلانات وكود الخصم (Promo & Announcement)</h4>
              
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
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-110 shadow-md transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>حفظ ونشر التعديلات</span>
            </button>
          </form>
        )}

        {/* SUBTAB 5: UGC CAMPAIGNS */}
        {activeSubTab === 'campaigns' && (
          <div className="space-y-4">
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
                  مسودات فيديوهات قيد المراجعة والاعتماد (2 مسودة):
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">
                        N
                      </div>
                      <div>
                        <span className="text-xs font-bold text-on-surface block">@nour_style</span>
                        <span className="text-[10px] text-on-surface-variant">فيديو مسودة 38 ثانية • بجودة 4K</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => alert('معاينة مسودة الفيديو')}
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface"
                        title="معاينة الفيديو"
                      >
                        <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                      </button>
                      <button 
                        onClick={() => alert('تم اعتماد الفيديو وصرف المكافأة للصانعة!')}
                        className="px-2 py-1 rounded-lg bg-tertiary text-on-tertiary text-[10px] font-bold"
                      >
                        اعتماد ونشر
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                        F
                      </div>
                      <div>
                        <span className="text-xs font-bold text-on-surface block">@farida_fashion</span>
                        <span className="text-[10px] text-on-surface-variant">فيديو مسودة 45 ثانية • تنسيق كيمونو</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => alert('معاينة مسودة الفيديو')}
                        className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface"
                        title="معاينة الفيديو"
                      >
                        <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                      </button>
                      <button 
                        onClick={() => alert('تم اعتماد الفيديو وصرف المكافأة للصانعة!')}
                        className="px-2 py-1 rounded-lg bg-tertiary text-on-tertiary text-[10px] font-bold"
                      >
                        اعتماد ونشر
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
