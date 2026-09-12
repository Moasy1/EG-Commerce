import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function DesktopSellerDashboard() {
  const { setActiveTab } = useApp();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('الأسبوع الماضي');

  const productsData = [
    { 
      id: 1, 
      name: 'جلابية بتطريز يدوي', 
      category: 'ملابس نسائية • جلابيات', 
      price: '850 ج.م', 
      stock: 56, 
      status: 'متاح', 
      statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200', 
      img: '/images/products/linen_abaya.jpg' 
    },
    { 
      id: 2, 
      name: 'بلوزة قطن مطرزة', 
      category: 'ملابس نسائية • بلوز', 
      price: '650 ج.م', 
      stock: 120, 
      status: 'متاح', 
      statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200', 
      img: '/images/products/silk_dress.jpg' 
    },
    { 
      id: 3, 
      name: 'قميص كتان رجالي', 
      category: 'ملابس رجالية • قمصان', 
      price: '1,200 ج.م', 
      stock: 8, 
      status: 'مخزون منخفض', 
      statusColor: 'bg-amber-50 text-amber-600 border-amber-200', 
      img: '/images/products/linen_shirt.jpg' 
    },
    { 
      id: 4, 
      name: 'عباية كلاسيك', 
      category: 'ملابس نسائية • عبايات', 
      price: '980 ج.م', 
      stock: 34, 
      status: 'متاح', 
      statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200', 
      img: '/images/products/wool_blazer.jpg' 
    },
    { 
      id: 5, 
      name: 'جلابية رجالية', 
      category: 'ملابس رجالية • جلابيات', 
      price: '1,450 ج.م', 
      stock: 0, 
      status: 'غير متاح', 
      statusColor: 'bg-red-50 text-red-600 border-red-200', 
      img: '/images/banners/talieska_hero.jpg' 
    },
  ];

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

  const filteredProducts = productsData.filter(p => 
    p.name.includes(searchQuery) || p.category.includes(searchQuery)
  );

  return (
    <div className="w-full bg-white text-slate-900 flex font-sans min-h-[640px] overflow-hidden select-none text-right" dir="rtl">
      {/* 1. RIGHT SIDEBAR (RTL - Matching Image 2) */}
      <aside className="w-48 bg-gray-50/80 border-l border-gray-200/80 p-3.5 flex flex-col justify-between shrink-0">
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

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
        {/* Top Header Bar */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
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
            <button className="relative p-1 text-gray-500 hover:text-[#d00000]">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d00000] text-white text-[9px] font-bold flex items-center justify-center">
                1
              </span>
            </button>
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
                            <img src={p.img} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">{p.name}</span>
                              <span className="text-[10px] text-gray-400 block">{p.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-bold text-slate-900">{p.price}</td>
                        <td className="py-3 font-mono font-bold text-gray-600">{p.stock}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${p.statusColor}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-gray-400">
                            <button className="p-1 hover:text-slate-700"><span className="material-symbols-outlined text-[15px]">edit</span></button>
                            <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[15px]">delete</span></button>
                            <button className="p-1 hover:text-slate-700"><span className="material-symbols-outlined text-[15px]">more_horiz</span></button>
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
        </div>
      </main>
    </div>
  );
}
