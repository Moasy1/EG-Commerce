import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductFormModal from '../components/merchant/ProductFormModal';
import StorefrontThemeCustomizer from '../components/merchant/StorefrontThemeCustomizer';
import DesktopSellerDashboard from '../components/desktop/DesktopSellerDashboard';
import AddProductStudio from './AddProductStudio';

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
    <div className="w-full min-h-screen bg-surface text-on-surface flex flex-col pb-28 md:pb-0">
      {/* 1. Top Merchant SaaS Header (Kept for Store Switching & CTAs) */}
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
                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono">
                  SaaS Active ✓
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant font-mono">
                <span className="text-secondary">{currentMerchant.subdomain}</span>
                <span className="hidden md:inline">•</span>
                <span className="hidden md:inline">باقة Growth 🚀</span>
              </div>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('storefront')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high text-xs font-bold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
              <span>عرض المتجر</span>
            </button>

            <button
              onClick={() => setActiveSubTab('add_product_tab')}
              className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:brightness-110 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">video_call</span>
              <span className="hidden md:inline">رفع فيديو ومعاينة 9:16</span>
              <span className="md:hidden">إضافة فيديو</span>
            </button>

            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 px-3 py-1.5 md:px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-surface-container-high text-xs font-bold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_box</span>
              <span className="hidden md:inline">نموذج سريع</span>
              <span className="md:hidden">منتج</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Dashboard Workspace (Unified Navigation via DesktopSellerDashboard) */}
      <main className="flex-1 w-full flex flex-col min-w-0 bg-white">
        {/* Toast Alert */}
        {themeSavedToast && (
          <div className="m-4 p-3.5 rounded-2xl bg-tertiary/15 border border-tertiary/30 text-tertiary text-xs font-bold flex items-center gap-2 animate-fade-in max-w-7xl mx-auto w-full">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>تم حفظ ونشر إعدادات المتجر وهوية الثيم على السيرفر الحي بنجاح! 🚀</span>
          </div>
        )}

        {/* If the user clicked "رفع فيديو", show the studio, otherwise show the unified dashboard */}
        {activeSubTab === 'add_product_tab' ? (
          <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6">
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={() => setActiveSubTab('overview')}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <h2 className="text-xl font-bold text-on-surface">استوديو رفع المحتوى 9:16</h2>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl border border-surface-container-high shadow-xs overflow-hidden">
              <AddProductStudio />
            </div>
          </div>
        ) : (
          <DesktopSellerDashboard />
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
