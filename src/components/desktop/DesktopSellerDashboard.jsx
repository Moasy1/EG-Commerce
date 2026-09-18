import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MerchantService } from '../../services/MerchantService';
import EgLogo from '../common/EgLogo';
import ProductFormModal from '../merchant/ProductFormModal';
import InvoiceModal from '../common/InvoiceModal';
import NotificationCenter from '../common/NotificationCenter';
import { printOrderInvoice } from '../../utils/invoiceGenerator';

export default function DesktopSellerDashboard() {
  const { 
    setActiveTab, 
    orders, 
    setOrders, 
    updateOrderStatus, 
    selectedMerchantId, 
    setSelectedMerchantId, 
    merchants, 
    products, 
    deleteProduct, 
    user,
    unreadNotifications,
    refreshNotificationCount
  } = useApp();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('الأسبوع الماضي');
  const [orderFilter, setOrderFilter] = useState('all');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifBtnRef = useRef(null);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, reach: 0, engagement: 0 });

  // Product CRUD modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  const currentMerchant = merchants?.find(m => m.id === selectedMerchantId) || merchants?.[0];
  const merchantProducts = products?.filter(p => p.merchantId === currentMerchant?.id) || [];
  const merchantOrders = orders?.filter(o => o.merchantId === currentMerchant?.id) || [];

  useEffect(() => {
    if (currentMerchant?.id) {
      MerchantService.getDashboardStats(currentMerchant.id).then(setStats);
    }
  }, [currentMerchant?.id]);

  const handleOpenAddProduct = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setProductToEdit(prod);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (prodId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج من متجرك نهائياً؟')) {
      deleteProduct(prodId);
    }
  };

  const filteredProducts = merchantProducts.filter(p => 
    (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topVideos = [
    {
      id: 'v-1',
      title: 'إطلالة الجلابية الجديدة',
      views: '32.4K',
      orders: '428',
      growth: '42%',
      duration: '0:24',
      img: '/images/products/linen_abaya.jpg'
    },
    {
      id: 'v-2',
      title: 'تفاصيل التطريز اليدوي',
      views: '21.7K',
      orders: '312',
      growth: '36%',
      duration: '0:18',
      img: '/images/products/silk_dress.jpg'
    },
    {
      id: 'v-3',
      title: 'ستايل رجالي للصيف',
      views: '18.9K',
      orders: '241',
      growth: '28%',
      duration: '0:27',
      img: '/images/products/linen_shirt.jpg'
    },
    {
      id: 'v-4',
      title: 'عبايات كلاسيك',
      views: '15.6K',
      orders: '198',
      growth: '24%',
      duration: '0:21',
      img: '/images/products/wool_blazer.jpg'
    }
  ];

  return (
    <div className="w-full bg-white text-slate-900 flex flex-col md:flex-row font-sans min-h-[640px] md:h-auto overflow-hidden select-none text-right" dir="rtl">
      {/* 1. RIGHT SIDEBAR (RTL - Desktop Only) */}
      <aside className="hidden md:flex w-48 bg-gray-50/80 border-l border-gray-200/80 p-3.5 flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-7 h-7" color="#d00000" />
            <span className="font-black text-xs tracking-tight text-slate-900">EG-Commerce</span>
          </div>

          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
              { id: 'products', label: 'المنتجات', icon: 'inventory_2' },
              { id: 'orders', label: 'الطلبات', icon: 'receipt_long' },
              { id: 'customers', label: 'العملاء', icon: 'group' },
              { id: 'content', label: 'المحتوى', icon: 'smart_display' },
              { id: 'analytics', label: 'التحليلات', icon: 'trending_up' },
              { id: 'marketing', label: 'التسويق', icon: 'campaign' },
              { id: 'settings', label: 'الإعدادات', icon: 'settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeNav === item.id
                    ? 'bg-[#d00000] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-100/80 border border-gray-200 text-right">
          <span className="text-[10px] text-gray-500 block">المتجر الحالي:</span>
          <span className="text-xs font-bold text-slate-800">نيل ثريدز • Nile Threads</span>
        </div>
      </aside>

      {/* MOBILE TOP NAV (Visible only on small screens) */}
      <div className="md:hidden flex flex-col shrink-0 bg-white border-b border-gray-200/80 sticky top-0 z-20 shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar py-2 px-4 gap-2 hide-scroll">
          {[
            { id: 'dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
            { id: 'products', label: 'المنتجات', icon: 'inventory_2' },
            { id: 'orders', label: 'الطلبات', icon: 'receipt_long' },
            { id: 'customers', label: 'العملاء', icon: 'group' },
            { id: 'content', label: 'المحتوى', icon: 'smart_display' },
            { id: 'analytics', label: 'التحليلات', icon: 'trending_up' },
            { id: 'marketing', label: 'التسويق', icon: 'campaign' },
            { id: 'settings', label: 'الإعدادات', icon: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition-all text-xs font-bold border ${
                activeNav === item.id
                  ? 'bg-[#d00000] text-white border-[#d00000] shadow-xs'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
        {/* Top Header Bar */}
        <div className="px-4 md:px-6 py-3 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-black text-slate-900">لوحة التاجر</h1>
            <p className="text-xs text-gray-500">تابع أداء متجرك، وأدر منتجاتك، وحقق المزيد من المبيعات</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Timeframe Filter Dropdown */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none"
            >
              <option value="اليوم">اليوم</option>
              <option value="الأسبوع الماضي">الأسبوع الماضي</option>
              <option value="آخر 30 يوماً">آخر 30 يوماً</option>
            </select>

            {/* Notifications & Chat */}
            <div className="relative">
              <button 
                ref={notifBtnRef}
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-1 text-gray-500 hover:text-[#d00000] transition-colors"
                title="تنبيهات المتجر والطلبات"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-0.5 rounded-full bg-[#d00000] text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>

              <NotificationCenter
                isOpen={isNotifOpen}
                onClose={() => {
                  setIsNotifOpen(false);
                  refreshNotificationCount();
                }}
                anchorRef={notifBtnRef}
              />
            </div>
            <button className="p-1 text-gray-500 hover:text-[#d00000]">
              <span className="material-symbols-outlined text-[20px]">chat</span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 pr-2 border-r border-gray-200">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block leading-tight">أهلاً محمد أحمد</span>
                <span className="text-[10px] text-gray-500 block">تاجر معتمد</span>
              </div>
              <img src="/images/reels/reel_1.jpg" alt="User" className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-300" />
            </div>
          </div>
        </div>

        {/* Dashboard Workspace */}
        <div className="p-6 space-y-6">
          {activeNav === 'dashboard' && (
            <>
              {/* 4 KPI Cards (Matching Image 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* KPI 1: إجمالي المبيعات */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold">إجمالي المبيعات</span>
                    <span className="w-7 h-7 rounded-lg bg-red-50 text-[#d00000] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    284,750 <span className="text-xs font-bold text-gray-500">ج.م</span>
                  </div>
                  {/* Sparkline & Growth */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <span>18.5% ↑</span>
                      <span className="text-gray-400 font-normal">مقارنة بالأسبوع الماضي</span>
                    </span>
                    <svg className="w-16 h-5 text-[#d00000]" viewBox="0 0 60 20" fill="none">
                      <path d="M2 14 L15 16 L30 8 L45 11 L58 3" stroke="#d00000" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* KPI 2: إجمالي الطلبات */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold">إجمالي الطلبات</span>
                    <span className="w-7 h-7 rounded-lg bg-red-50 text-[#d00000] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    1,248
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <span>22.3% ↑</span>
                      <span className="text-gray-400 font-normal">مقارنة بالأسبوع الماضي</span>
                    </span>
                    <svg className="w-16 h-5 text-[#d00000]" viewBox="0 0 60 20" fill="none">
                      <path d="M2 16 L15 12 L30 14 L45 6 L58 2" stroke="#d00000" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* KPI 3: إجمالي المشاهدات */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold">إجمالي المشاهدات</span>
                    <span className="w-7 h-7 rounded-lg bg-red-50 text-[#d00000] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    96,420
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <span>37.8% ↑</span>
                      <span className="text-gray-400 font-normal">مقارنة بالأسبوع الماضي</span>
                    </span>
                    <svg className="w-16 h-5 text-[#d00000]" viewBox="0 0 60 20" fill="none">
                      <path d="M2 17 L15 13 L30 11 L45 5 L58 2" stroke="#d00000" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>

                {/* KPI 4: معدل التحويل */}
                <div className="p-4 rounded-2xl bg-white border border-gray-200/90 shadow-xs space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-bold">معدل التحويل</span>
                    <span className="w-7 h-7 rounded-lg bg-red-50 text-[#d00000] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">percent</span>
                    </span>
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    2.4%
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <span>0.8% ↑</span>
                      <span className="text-gray-400 font-normal">مقارنة بالأسبوع الماضي</span>
                    </span>
                    <svg className="w-16 h-5 text-[#d00000]" viewBox="0 0 60 20" fill="none">
                      <path d="M2 15 L15 14 L30 9 L45 8 L58 4" stroke="#d00000" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* TWO MAIN SECTIONS: Products Management (Left) & Content Performance (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* PRODUCTS MANAGEMENT TABLE (7 Cols) */}
                <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">إدارة المنتجات</h3>
                      <p className="text-xs text-gray-500">أضف وأدر منتجاتك بسهولة</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('add_product')}
                        className="px-3.5 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">video_call</span>
                        <span>رفع فيديو منتج</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="w-full flex items-center gap-2 px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                    <span className="material-symbols-outlined text-[16px] text-gray-400">search</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث في المنتجات..."
                      className="w-full bg-transparent focus:outline-none text-xs text-slate-800"
                    />
                  </div>

                  {/* Products Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-bold">
                          <th className="pb-2.5">المنتج</th>
                          <th className="pb-2.5">السعر</th>
                          <th className="pb-2.5">المخزون</th>
                          <th className="pb-2.5">الحالة</th>
                          <th className="pb-2.5 text-center">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3">
                              <div className="flex items-center gap-2.5">
                                <img src={p.image || p.img} alt={p.title || p.name} className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                                <div>
                                  <span className="font-bold text-slate-900 block leading-tight">{p.title || p.name}</span>
                                  <span className="text-[10px] text-gray-400 block">{p.category}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 font-bold text-slate-900">{typeof p.price === 'number' ? `${p.price.toLocaleString()} ج.م` : p.price}</td>
                            <td className="py-3 font-mono font-bold text-gray-600">{p.stock ?? '∞'}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${p.stock === 0 ? 'bg-red-50 text-red-600 border-red-200' : p.stock && p.stock < 10 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                {p.stock === 0 ? 'نفد المخزون' : p.stock && p.stock < 10 ? 'مخزون منخفض' : 'متاح'}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <div className="flex items-center justify-center gap-1 text-gray-400">
                                <button onClick={() => handleOpenEditProduct(p)} className="p-1 hover:text-slate-700" title="تعديل"><span className="material-symbols-outlined text-[15px]">edit</span></button>
                                <button onClick={() => handleDeleteProduct(p.id)} className="p-1 hover:text-[#d00000]" title="حذف"><span className="material-symbols-outlined text-[15px]">delete</span></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* CONTENT PERFORMANCE WIDGET (5 Cols - Matching Image 2) */}
                <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[17px] text-[#d00000]">leaderboard</span>
                        <span>أداء المحتوى</span>
                      </h3>
                      <p className="text-xs text-gray-500">أفضل الفيديوهات أداءً خلال 7 أيام</p>
                    </div>
                  </div>

                  {/* Videos List */}
                  <div className="space-y-3">
                    {topVideos.map((video) => (
                      <div 
                        key={video.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/60 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-gray-900 shrink-0">
                            <img src={video.img} alt={video.title} className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 right-1 text-[8px] bg-black/70 text-white px-1 rounded font-mono">
                              {video.duration}
                            </span>
                          </div>
                          <div className="text-right">
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">{video.title}</h4>
                            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
                              <span className="flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">visibility</span>
                                <span>{video.views} مشاهدة</span>
                              </span>
                              <span className="flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">shopping_cart</span>
                                <span>{video.orders} طلب</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-emerald-600">{video.growth} ↑</span>
                          <span className="material-symbols-outlined text-[16px] text-gray-300">chevron_left</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View All Videos Button */}
                  <div className="pt-2">
                    <button 
                      onClick={() => setActiveTab('reels')}
                      className="w-full py-2.5 rounded-xl bg-red-50 text-[#d00000] text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      <span>عرض جميع الفيديوهات</span>
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}

          {activeNav === 'products' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">إدارة المنتجات</h3>
                  <p className="text-xs text-gray-500">أضف وأدر منتجاتك بسهولة</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-3.5 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>+ إضافة منتج</span>
                  </button>
                </div>
              </div>
              <div className="w-full flex items-center gap-2 px-3.5 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <span className="material-symbols-outlined text-[16px] text-gray-400">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في المنتجات..."
                  className="w-full bg-transparent focus:outline-none text-xs text-slate-800"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-bold">
                      <th className="pb-2.5">المنتج</th>
                      <th className="pb-2.5">السعر</th>
                      <th className="pb-2.5">المخزون</th>
                      <th className="pb-2.5">الحالة</th>
                      <th className="pb-2.5 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <img src={p.image || p.img} alt={p.title || p.name} className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">{p.title || p.name}</span>
                              <span className="text-[10px] text-gray-400 block">{p.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-bold text-slate-900">{typeof p.price === 'number' ? `${p.price.toLocaleString()} ج.م` : p.price}</td>
                        <td className="py-3 font-mono font-bold text-gray-600">{p.stock ?? '∞'}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${p.stock === 0 ? 'bg-red-50 text-red-600 border-red-200' : p.stock && p.stock < 10 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                            {p.stock === 0 ? 'نفد المخزون' : p.stock && p.stock < 10 ? 'مخزون منخفض' : 'متاح'}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-400">
                            <button onClick={() => handleOpenEditProduct(p)} className="p-1 hover:text-slate-700" title="تعديل"><span className="material-symbols-outlined text-[15px]">edit</span></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-1 hover:text-[#d00000]" title="حذف"><span className="material-symbols-outlined text-[15px]">delete</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === 'marketing' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 bg-red-50 text-[#d00000] rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[32px]">campaign</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">التسويق وحملات صناع المحتوى</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">أطلق حملات محتوى جديدة مع أفضل صناع المحتوى لزيادة مبيعاتك.</p>
              <button onClick={() => setActiveTab('merchant_campaign')} className="px-6 py-3 rounded-xl bg-[#d00000] text-white font-bold text-sm shadow-xs hover:bg-[#b00000] transition-colors">
                إنشاء حملة جديدة
              </button>
            </div>
          )}

          
          {activeNav === 'orders' && (() => {
            const getStatusBadge = (status) => {
              switch(status) {
                case 'ready_for_pickup':
                case 'pending_cod':
                case 'processing':
                  return { label: 'قيد التجهيز', color: 'bg-amber-50 text-amber-600 border-amber-200' };
                case 'in_transit':
                  return { label: 'تم الشحن', color: 'bg-blue-50 text-blue-600 border-blue-200' };
                case 'delivered':
                  return { label: 'مكتمل التوصيل', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
                case 'returned':
                  return { label: 'مرتجع', color: 'bg-red-50 text-red-600 border-red-200' };
                default:
                  return { label: status, color: 'bg-gray-50 text-gray-600 border-gray-200' };
              }
            };

            const filteredOrders = merchantOrders.filter(o => {
              if (orderFilter === 'all') return true;
              if (orderFilter === 'pending') return ['ready_for_pickup', 'pending_cod', 'processing'].includes(o.shippingStatus);
              if (orderFilter === 'shipped') return o.shippingStatus === 'in_transit';
              if (orderFilter === 'completed') return o.shippingStatus === 'delivered';
              return true;
            });

            return (
              <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4 min-h-[400px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">إدارة الطلبات وشحن بوسطة</h3>
                    <p className="text-xs text-gray-500">تابع شحناتك وأوامر الدفع لحظة بلحظة</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none"
                    >
                      <option value="all">كل الحالات</option>
                      <option value="pending">قيد التجهيز</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="completed">مكتمل التوصيل</option>
                    </select>
                  </div>
                </div>
                
                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                    <p className="text-xs">لا توجد طلبات بهذه الحالة</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-bold">
                          <th className="pb-2.5">رقم الطلب / التاريخ</th>
                          <th className="pb-2.5">العميل</th>
                          <th className="pb-2.5">المنتج / الكمية</th>
                          <th className="pb-2.5">الإجمالي</th>
                          <th className="pb-2.5 w-36">تحديث الحالة</th>
                          <th className="pb-2.5 text-center w-28">إجراءات سريعة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map((o) => {
                          const badge = getStatusBadge(o.shippingStatus);
                          return (
                            <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3">
                                <span className="font-bold text-slate-900 block">{o.id}</span>
                                <span className="text-[10px] text-gray-400">{o.date}</span>
                              </td>
                              <td className="py-3">
                                <span className="font-bold text-slate-800 block">{o.customerName}</span>
                                <span className="text-[10px] text-gray-500 font-mono" dir="ltr">{o.phone}</span>
                              </td>
                              <td className="py-3 text-gray-600 max-w-[150px] truncate" title={o.productTitle}>
                                {o.productTitle} <br/> <span className="text-[10px] text-gray-400">({o.quantity} قطعة)</span>
                              </td>
                              <td className="py-3 font-bold text-[#d00000]">{o.amount.toLocaleString()} ج.م</td>
                              <td className="py-3">
                                <div className="flex flex-col gap-1.5">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border w-fit ${badge.color}`}>
                                    {badge.label}
                                  </span>
                                  <select 
                                    className="bg-white border border-gray-200 text-slate-700 text-[10px] rounded px-1 py-1 cursor-pointer focus:outline-none w-full shadow-sm"
                                    value={o.shippingStatus}
                                    onChange={async (e) => {
                                      const newStatus = e.target.value;
                                      setOrders(prev => prev.map(order => order.id === o.id ? { ...order, shippingStatus: newStatus } : order));
                                      if (updateOrderStatus) {
                                        await updateOrderStatus(o.id, newStatus);
                                      }
                                    }}
                                  >
                                    <option value="ready_for_pickup">قيد التجهيز</option>
                                    <option value="in_transit">تم الشحن (بوسطة)</option>
                                    <option value="delivered">مكتمل التوصيل</option>
                                    <option value="returned">مرتجع</option>
                                  </select>
                                </div>
                              </td>
                              <td className="py-3 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => {
                                      const phone = (o.phone || '').replace(/[^\d+]/g, '');
                                      const msg = encodeURIComponent(`مرحباً ${o.customerName || ''}، بخصوص طلبك ${o.id} من متجر ${currentMerchant?.name || ''}`);
                                      window.open(`https://wa.me/${phone.replace(/^\+/, '')}?text=${msg}`, '_blank', 'noopener,noreferrer');
                                    }}
                                    className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                                    title="واتساب العميل"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">chat</span>
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const lines = [
                                        `Order: ${o.id}`,
                                        `Store: ${currentMerchant?.name || ''}`,
                                        `Customer: ${o.customerName}`,
                                        `Phone: ${o.phone}`,
                                        `Address: ${o.address}`,
                                        `Items: ${o.productTitle}`,
                                        `Total: ${o.amount} EGP`,
                                        `Tracking: ${o.trackingNumber || '-'}`
                                      ];
                                      try {
                                        await navigator.clipboard.writeText(lines.join('\n'));
                                        alert('تم نسخ تفاصيل الطلب!');
                                      } catch (e) {}
                                    }}
                                    className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                    title="نسخ بيانات الطلب"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                                  </button>
                                  <button
                                    onClick={() => setActiveInvoiceOrder(o)}
                                    className="w-7 h-7 rounded-lg bg-red-50 text-[#d00000] flex items-center justify-center hover:bg-red-100 transition-colors"
                                    title="معاينة الفاتورة الضريبية والبوليصة"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                                  </button>
                                  <button
                                    onClick={() => printOrderInvoice(o, currentMerchant)}
                                    className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-colors"
                                    title="طباعة المستند الرسمي"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">print</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}
          {activeNav === 'content' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">إدارة المحتوى (UGC & Reels)</h3>
                  <p className="text-xs text-gray-500">مكتبة فيديوهات المتجر وصناع المحتوى</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-slate-800 text-xs font-bold shadow-xs hover:bg-gray-50 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">video_camera_front</span>
                    <span>طلب محتوى (UGC)</span>
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    <span>رفع فيديو للمتجر</span>
                  </button>
                </div>
              </div>
              
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80', views: '45.2K', sales: '312 طلب', status: 'نشط (تريند)' },
                  { img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80', views: '89.1K', sales: '840 طلب', status: 'نشط (تريند)' },
                  { img: '/images/reels/reel_1.jpg', views: '124K', sales: '84 طلب', status: 'نشط (الرئيسية)' },
                  { img: '/images/products/linen_abaya.jpg', views: '12K', sales: '8 طلبات', status: 'قيد المراجعة' },
                ].map((reel, i) => (

                  <div key={i} className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    <div className="aspect-[9/16] relative">
                      <img src={reel.img} alt="Reel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                      
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold">
                        {reel.status}
                      </div>
                      
                      <div className="absolute bottom-3 left-0 w-full px-3">
                        <div className="flex items-center justify-between text-white text-[11px] font-bold">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            <span>{reel.views}</span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-300">
                            <span className="material-symbols-outlined text-[14px]">shopping_cart</span>
                            <span>{reel.sales}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          
          {activeNav === 'customers' && (() => {
            const uniqueCustomersMap = new Map();
            merchantOrders.forEach(o => {
              if (!uniqueCustomersMap.has(o.phone)) {
                uniqueCustomersMap.set(o.phone, {
                  name: o.customerName,
                  phone: o.phone,
                  address: o.address || 'العنوان غير متوفر',
                  totalOrders: 0,
                  totalSpent: 0,
                  lastOrderDate: o.date
                });
              }
              const cust = uniqueCustomersMap.get(o.phone);
              cust.totalOrders += 1;
              cust.totalSpent += o.amount;
              cust.lastOrderDate = o.date;
            });
            const uniqueCustomers = Array.from(uniqueCustomersMap.values());

            return (
              <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4 min-h-[400px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">إدارة العملاء</h3>
                    <p className="text-xs text-gray-500">سجل بيانات عملائك وتاريخ طلباتهم</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                      <input 
                        type="text" 
                        placeholder="ابحث بالاسم أو رقم الهاتف..." 
                        className="pl-3 pr-9 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-slate-700 focus:outline-none focus:border-[#d00000] focus:ring-1 focus:ring-[#d00000] transition-all w-64"
                      />
                    </div>
                  </div>
                </div>
                
                {uniqueCustomers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">group</span>
                    <p className="text-xs">لا يوجد عملاء حتى الآن</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-bold">
                          <th className="pb-2.5">اسم العميل</th>
                          <th className="pb-2.5">رقم الهاتف</th>
                          <th className="pb-2.5">إجمالي الطلبات</th>
                          <th className="pb-2.5">إجمالي المدفوعات</th>
                          <th className="pb-2.5">آخر طلب</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {uniqueCustomers.map((c, i) => (
                          <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3">
                              <span className="font-bold text-slate-900 block">{c.name}</span>
                              <span className="text-[10px] text-gray-400">{c.address}</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700" dir="ltr">{c.phone}</td>
                            <td className="py-3 text-slate-700 font-bold">{c.totalOrders} طلب</td>
                            <td className="py-3 font-bold text-emerald-600">{c.totalSpent.toLocaleString()} ج.م</td>
                            <td className="py-3 text-gray-500 text-[11px]">{c.lastOrderDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {activeNav === 'analytics' && (() => {
            const totalRevenue = merchantOrders.reduce((sum, o) => sum + o.amount, 0);
            const totalOrders = merchantOrders.length;
            const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
            const conversionRate = totalOrders > 0 ? ((totalOrders / (totalOrders * 35)) * 100).toFixed(1) : 0;

            return (
              <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-6 min-h-[400px]">
                <div>
                  <h3 className="text-sm font-black text-slate-900">التحليلات والأداء</h3>
                  <p className="text-xs text-gray-500">نظرة شاملة على أداء متجرك خلال الفترة المحددة</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-[11px] font-bold">إجمالي المبيعات</span>
                      <span className="material-symbols-outlined text-[16px] text-emerald-500">payments</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">{totalRevenue.toLocaleString()} <span className="text-xs font-normal text-gray-500">ج.م</span></div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>
                      <span>+15% من الشهر الماضي</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-[11px] font-bold">عدد الطلبات</span>
                      <span className="material-symbols-outlined text-[16px] text-blue-500">local_shipping</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">{totalOrders} <span className="text-xs font-normal text-gray-500">طلب</span></div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>
                      <span>+8% من الشهر الماضي</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-[11px] font-bold">متوسط قيمة الطلب</span>
                      <span className="material-symbols-outlined text-[16px] text-amber-500">receipt_long</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">{avgOrderValue.toLocaleString()} <span className="text-xs font-normal text-gray-500">ج.م</span></div>
                    <div className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">trending_flat</span>
                      <span>ثابت نسبياً</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-[11px] font-bold">معدل التحويل (Conversion)</span>
                      <span className="material-symbols-outlined text-[16px] text-purple-500">touch_app</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">{conversionRate}%</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>
                      <span>+0.2% من الشهر الماضي</span>
                    </div>
                  </div>
                </div>

                {/* Simple CSS Chart */}
                <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs">
                  <h4 className="text-xs font-bold text-slate-800 mb-6">المبيعات خلال آخر 7 أيام</h4>
                  <div className="h-40 flex items-end justify-between gap-2 px-2">
                    {[35, 60, 45, 80, 55, 90, 70].map((val, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 gap-2 group relative">
                        <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {val * 100} ج.م
                        </div>
                        <div className="w-full max-w-[24px] bg-[#d00000]/20 rounded-t-md hover:bg-[#d00000]/40 transition-colors relative">
                          <div className="absolute bottom-0 w-full bg-[#d00000] rounded-t-md" style={{ height: `${val}%` }}></div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">1{i+2}/9</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {activeNav === 'settings' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-6 min-h-[400px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">إعدادات المتجر</h3>
                  <p className="text-xs text-gray-500">إدارة هويتك وطرق الشحن والدفع</p>
                </div>
                <button className="px-4 py-2 bg-[#d00000] text-white text-xs font-bold rounded-xl shadow-xs hover:brightness-110 transition-all">
                  حفظ التغييرات
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800">البيانات الأساسية</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">اسم المتجر</label>
                    <input type="text" defaultValue={currentMerchant?.name} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-slate-700 focus:border-[#d00000] focus:ring-1 focus:ring-[#d00000] outline-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">الرابط الفرعي (Subdomain)</label>
                    <div className="flex items-center">
                      <input type="text" defaultValue={currentMerchant?.subdomain?.replace('.egyptian-commerce.com', '').replace('.eg-commerce.com', '')} className="flex-1 px-3 py-2 rounded-r-xl border border-gray-200 bg-gray-50 text-xs text-slate-700 focus:border-[#d00000] focus:ring-1 focus:ring-[#d00000] outline-none text-left" dir="ltr" />
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-xs text-gray-500 font-mono" dir="ltr">.egyptian-commerce.com</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">لوجو المتجر</label>
                    <div className="flex items-center gap-3 mt-1">
                      <img src={currentMerchant?.logo} className="w-12 h-12 rounded-lg border border-gray-200 object-cover" alt="Logo" />
                      <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-gray-50">تغيير الصورة</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800">طرق الدفع والشحن</h4>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                    <div>
                      <div className="text-xs font-bold text-slate-800">الدفع عند الاستلام (COD)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">السماح للعملاء بالدفع نقداً عند استلام الشحنة</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                    <div>
                      <div className="text-xs font-bold text-slate-800">تفعيل شحن بوسطة (Bosta)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">إنشاء بوالص الشحن تلقائياً عند تأكيد الطلب</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d00000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                    <div>
                      <div className="text-xs font-bold text-slate-800">تفعيل الدفع الإلكتروني (Paymob)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">قبول البطاقات، فوري، والمحافظ الإلكترونية</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Product CRUD Modal */}
      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => { setIsProductModalOpen(false); setProductToEdit(null); }}
        productToEdit={productToEdit}
      />

      {/* Official Tax Invoice & Waybill Modal */}
      <InvoiceModal
        isOpen={!!activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
        order={activeInvoiceOrder}
        merchant={currentMerchant}
      />
    </div>
  );
}
