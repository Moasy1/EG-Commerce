import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdminService } from '../services/AdminService';

export default function AdminDashboard() {
  const { language, user, setIsAuthModalOpen, setActiveTab: setAppTab, products, merchants } = useApp();
  const isAr = language === 'ar';
  
  // Superadmin Tabs: overview | stores | creators | users | catalog
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [creators, setCreators] = useState([]);
  const [users, setUsers] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Action States
  const [editingUser, setEditingUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const chartData = [
    { name: 'Mon', labelAr: 'الإثنين', GMV: 12000 },
    { name: 'Tue', labelAr: 'الثلاثاء', GMV: 19000 },
    { name: 'Wed', labelAr: 'الأربعاء', GMV: 15000 },
    { name: 'Thu', labelAr: 'الخميس', GMV: 22000 },
    { name: 'Fri', labelAr: 'الجمعة', GMV: 28000 },
    { name: 'Sat', labelAr: 'السبت', GMV: 34000 },
    { name: 'Sun', labelAr: 'الأحد', GMV: 24000 },
  ];

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      const [statsData, storesData, creatorsData, usersData] = await Promise.all([
        AdminService.getPlatformStats(),
        AdminService.getStores(),
        AdminService.getCreators(),
        AdminService.getUsers()
      ]);
      setStats(statsData);
      setStores(storesData);
      setCreators(creatorsData);
      setUsers(usersData);
      setCatalogItems(products || []);
      setLoading(false);
    };
    loadAllData();
  }, [products]);

  // Actions
  const handleToggleStoreStatus = async (storeId) => {
    const updated = await AdminService.toggleStoreStatus(storeId);
    setStores(updated);
    showToast(isAr ? 'تم تحديث حالة المتجر بنجاح' : 'Store status updated successfully');
  };

  const handleUpdateRole = async (userId, newRole) => {
    const updated = await AdminService.updateUserRole(userId, newRole);
    setUsers(updated);
    showToast(isAr ? `تم تعديل الصلاحية إلى ${newRole}` : `User role updated to ${newRole}`);
  };

  const handleToggleUserStatus = async (userId) => {
    const updated = await AdminService.toggleUserStatus(userId);
    setUsers(updated);
    showToast(isAr ? 'تم تحديث حالة الحساب' : 'User account status updated');
  };

  const handleAssignUserStore = async (userId, storeName) => {
    const updated = await AdminService.assignUserStore(userId, storeName);
    setUsers(updated);
    showToast(isAr ? `تم تعيين المستخدم إلى ${storeName}` : `User assigned to ${storeName}`);
  };

  const handleUpdateCommission = async (creatorId, rate) => {
    const updated = await AdminService.updateCreatorCommission(creatorId, rate);
    setCreators(updated);
    showToast(isAr ? `تم تحديث نسبة العمولة إلى %${rate}` : `Commission rate updated to ${rate}%`);
  };

  const handleToggleProductVisibility = (productId) => {
    setCatalogItems(prev => prev.map(p => 
      p.id === productId ? { ...p, isHidden: !p.isHidden } : p
    ));
    showToast(isAr ? 'تم تعديل ظهور المنتج في السوق' : 'Product visibility updated');
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-[#d00000] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-500">{isAr ? 'جاري تحميل لوحة التحكم المركزية...' : 'Loading Superadmin Command Center...'}</span>
        </div>
      </div>
    );
  }

  const isSuperadmin = user?.role === 'superadmin' || user?.role === 'admin';
  if (!isSuperadmin) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4 max-w-md mx-auto" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 rounded-full bg-red-100 text-[#d00000] flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[36px]">admin_panel_settings</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {isAr ? 'الوصول مخصص للمشرف العام فقط' : 'Superadmin Access Restricted'}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          {isAr 
            ? 'لوحة الإدارة والتحكم في المستخدمين والمتاجر مخصصة فقط للمشرف العام superadmin@egyptian-commerce.com' 
            : 'The administration dashboard is restricted to platform superadmins only.'}
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-full bg-[#d00000] text-white text-xs font-bold hover:brightness-110 shadow-md transition-all active:scale-95"
        >
          {isAr ? 'تسجيل الدخول كمشرف عام' : 'Sign in as Superadmin'}
        </button>
      </div>
    );
  }

  const filteredUsers = users.filter(u => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  const filteredCatalog = catalogItems.filter(p => {
    if (storeFilter === 'all') return true;
    return p.merchantId === storeFilter || p.merchant?.toLowerCase().includes(storeFilter.toLowerCase());
  });

  return (
    <div className="w-full flex-1 max-w-7xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Superadmin Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-black">{isAr ? 'لوحة تحكم المنصة المركزية • Superadmin' : 'Central Platform Superadmin Hub'}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-[#d00000] border border-red-200 text-[10px] font-mono font-bold">
              SUPERADMIN ACTIVE ✓
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isAr ? 'إدارة المتاجر وساب دومينات التجار، المبدعين، صلاحيات المستخدمين، وعناصر الكتالوج' : 'Control stores & subdomains, creators, user role assignments, and catalog items'}
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:inline font-mono">
            {user?.email || 'superadmin@egyptian-commerce.com'}
          </span>
          <button 
            onClick={() => setAppTab('shop')}
            className="px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-slate-700 hover:bg-gray-50 flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[15px]">storefront</span>
            <span>{isAr ? 'معاينة السوق العام' : 'View Marketplace'}</span>
          </button>
        </div>
      </div>

      {/* Superadmin Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', icon: 'monitoring', label: isAr ? 'نظرة عامة والتحليلات' : 'Overview & GMV', count: null },
          { id: 'stores', icon: 'domain', label: isAr ? 'المتاجر والساب دومين' : 'Stores & Subdomains', count: stores.length },
          { id: 'creators', icon: 'verified', label: isAr ? 'المبدعين والمسوقين' : 'Creators & Affiliates', count: creators.length },
          { id: 'users', icon: 'manage_accounts', label: isAr ? 'المستخدمين وتعيين الصلاحيات' : 'Users & Roles', count: users.length },
          { id: 'catalog', icon: 'inventory_2', label: isAr ? 'المنتجات والعناصر التجريبية' : 'Demo Catalog & Items', count: catalogItems.length }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW TAB */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#d00000] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <span className="text-xs text-gray-400 font-medium block">{isAr ? 'إجمالي المبيعات (GMV)' : 'Total GMV'}</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                {stats?.totalGMV?.toLocaleString()} <span className="text-xs font-normal">ج.م</span>
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <span className="text-xs text-gray-400 font-medium block">{isAr ? 'أرباح المنصة (عمولات 12%)' : 'Platform Revenue'}</span>
              <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
                {stats?.platformRevenue?.toLocaleString()} <span className="text-xs font-normal">ج.م</span>
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[18px]">domain</span>
              </div>
              <span className="text-xs text-gray-400 font-medium block">{isAr ? 'المتاجر النشطة (Subdomains)' : 'Active Subdomain Stores'}</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{stores.length} متاجر</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[18px]">group</span>
              </div>
              <span className="text-xs text-gray-400 font-medium block">{isAr ? 'المستخدمين المسجلين' : 'Total Registered Users'}</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{users.length} مستخدمين</span>
            </div>
          </div>

          {/* SVG Responsive GMV Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900">{isAr ? 'حجم المعاملات الأسبوعي (GMV)' : 'Weekly GMV Trend (Last 7 Days)'}</h3>
                <span className="text-xs text-gray-400 font-mono">154,000 ج.م إجمالي الأسبوع • نمو +18.4%</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold font-mono">
                مباشر ✓ Live
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[640px] h-64 relative flex flex-col justify-between pt-4 pb-2">
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 700 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="superadminGmvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d00000" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#d00000" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="60" x2="700" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="140" x2="700" y2="140" stroke="#e2e8f0" />

                  <path
                    d="M 50 115 C 100 95, 120 90, 150 88 C 180 86, 220 101, 250 103 C 280 105, 320 80, 350 76 C 380 72, 420 56, 450 52 C 480 48, 520 30, 550 28 C 580 26, 620 62, 650 68 L 650 140 L 50 140 Z"
                    fill="url(#superadminGmvGrad)"
                  />

                  <path
                    d="M 50 115 C 100 95, 120 90, 150 88 C 180 86, 220 101, 250 103 C 280 105, 320 80, 350 76 C 380 72, 420 56, 450 52 C 480 48, 520 30, 550 28 C 580 26, 620 62, 650 68"
                    fill="none"
                    stroke="#d00000"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {[
                    { cx: 50, cy: 115, val: '12K', label: 'Mon' },
                    { cx: 150, cy: 88, val: '19K', label: 'Tue' },
                    { cx: 250, cy: 103, val: '15K', label: 'Wed' },
                    { cx: 350, cy: 76, val: '22K', label: 'Thu' },
                    { cx: 450, cy: 52, val: '28K', label: 'Fri' },
                    { cx: 550, cy: 28, val: '34K', label: 'Sat' },
                    { cx: 650, cy: 68, val: '24K', label: 'Sun' },
                  ].map((pt, idx) => (
                    <g key={idx} className="group cursor-pointer">
                      <circle cx={pt.cx} cy={pt.cy} r="5" fill="#ffffff" stroke="#d00000" strokeWidth="3" />
                      <rect x={pt.cx - 20} y={pt.cy - 24} width="40" height="18" rx="5" fill="#1e293b" />
                      <text x={pt.cx} y={pt.cy - 12} textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        {pt.val}
                      </text>
                    </g>
                  ))}
                </svg>

                <div className="grid grid-cols-7 text-center pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  {chartData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="font-bold text-slate-700">{isAr ? d.labelAr : d.name}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{d.GMV.toLocaleString()} ج.م</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STORES & SUBDOMAINS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'stores' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900">{isAr ? 'متاجر المنصة والساب دومينات (Shopify-Style Subdomains)' : 'Subdomain Stores Directory'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAr ? 'لكل تاجر واجهة متجر مستقلة معزولة تعمل على الساب دومين الخاص به' : 'Each merchant operates an isolated branded boutique on their designated subdomain'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono">
              {stores.length} {isAr ? 'متاجر مسجلة' : 'Registered Boutiques'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map(st => (
              <div key={st.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 block">{st.category}</span>
                      <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                        {st.name}
                        <span className="material-symbols-outlined text-[16px] text-sky-500 fill-current">verified</span>
                      </h4>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                      st.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {st.status === 'active' ? '● متاح ونشط' : '○ متوقف مؤقتاً'}
                    </span>
                  </div>

                  {/* Subdomain & Custom Domain Badges */}
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-[11px] font-medium">{isAr ? 'الساب دومين المعتمد:' : 'Subdomain:'}</span>
                      <a 
                        href={`https://${st.subdomain}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="font-mono text-[#d00000] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>{st.subdomain}</span>
                        <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                      </a>
                    </div>
                    {st.customDomain && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                        <span className="text-gray-500 text-[11px] font-medium">{isAr ? 'الدومين المخصص (Custom):' : 'Custom Domain:'}</span>
                        <span className="font-mono text-slate-700 font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-emerald-500">lock</span>
                          {st.customDomain}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                      <span className="text-gray-500 text-[11px] font-medium">{isAr ? 'المالك المسجل:' : 'Owner:'}</span>
                      <span className="text-slate-800 text-[11px] font-mono">{st.ownerEmail}</span>
                    </div>
                  </div>

                  {/* Products & Revenue Row */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'المنتجات في الكتالوج' : 'Active Products'}</span>
                      <span className="font-bold text-slate-800 font-mono text-sm">{st.productsCount} منتج</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50">
                      <span className="text-[10px] text-gray-400 block font-bold">{isAr ? 'مبيعات المتجر' : 'Total Revenue'}</span>
                      <span className="font-bold text-emerald-600 font-mono text-sm">{st.revenue.toLocaleString()} ج.م</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <a
                    href={`https://${st.subdomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center flex items-center justify-center gap-1 transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">store</span>
                    <span>{isAr ? 'زيارة المتجر المستقل' : 'Visit Boutique'}</span>
                  </a>
                  <button
                    onClick={() => handleToggleStoreStatus(st.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      st.status === 'active' 
                        ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {st.status === 'active' ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تفعيل' : 'Activate')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CREATORS & AFFILIATES TAB */}
      {/* ========================================================================= */}
      {activeTab === 'creators' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900">{isAr ? 'صناع المحتوى والمسوقين بالعمولة (Creators & Affiliates)' : 'Content Creators & Affiliates'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAr ? 'إدارة شراكات المبدعين مع البراندات ونسب العمولات على مبيعات الريلز' : 'Manage creator affiliations, video reels conversion, and take-rate commissions'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold font-mono">
              {creators.length} {isAr ? 'مبدعين معتمدين' : 'Active Creators'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creators.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-start gap-3">
                  <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#d00000] p-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{c.name}</h4>
                      <span className="material-symbols-outlined text-[15px] text-sky-500 fill-current">verified</span>
                    </div>
                    <span className="text-xs font-mono text-[#d00000] font-bold block">{c.handle}</span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">{c.specialty}</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-[11px] font-medium">{isAr ? 'البراند المتعاقد معه:' : 'Affiliated Store:'}</span>
                    <span className="font-bold text-slate-800">{c.brandAffiliation}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-[11px] font-medium">{isAr ? 'المتابعين على المنصة:' : 'Audience / Followers:'}</span>
                    <span className="font-mono font-bold text-slate-800">{c.followers}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-[11px] font-medium">{isAr ? 'إجمالي الأرباح المحققة:' : 'Total Earnings:'}</span>
                    <span className="font-mono font-bold text-emerald-600">{c.totalEarnings.toLocaleString()} ج.م</span>
                  </div>
                </div>

                {/* Commission Rate Control */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="font-bold text-slate-700">{isAr ? 'نسبة العمولة (Commission):' : 'Commission Rate:'}</span>
                  <div className="flex items-center gap-1.5">
                    {[10, 12, 15, 20].map(rate => (
                      <button
                        key={rate}
                        onClick={() => handleUpdateCommission(c.id, rate)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          c.commissionRate === rate 
                            ? 'bg-[#d00000] text-white shadow-xs' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        %{rate}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. USERS & ROLE ASSIGNMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-slate-900">{isAr ? 'إدارة المستخدمين وتعيين الصلاحيات (Role Assignment)' : 'Users Management & Permissions'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAr ? 'صلاحية المشرف العام الكاملة لتعيين الأدوار، ربط التجار بالمتاجر، وتجميد الحسابات' : 'Superadmin controls to assign roles, link merchants to boutiques, and manage permissions'}
              </p>
            </div>

            {/* Filter by Role */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'superadmin', 'admin', 'merchant', 'creator', 'driver', 'buyer'].map(r => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                    roleFilter === r 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-y border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-start">{isAr ? 'المستخدم' : 'User'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'الدور الحالي (Role)' : 'Role'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'المتجر / المركز المعين' : 'Assigned Entity'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3 text-end">{isAr ? 'إجراءات المشرف' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-bold">{u.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{u.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border focus:outline-none cursor-pointer ${
                          u.role === 'superadmin' ? 'bg-red-50 text-[#d00000] border-red-200' :
                          u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          u.role === 'merchant' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          u.role === 'creator' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                          u.role === 'driver' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-gray-50 text-gray-700 border-gray-200'
                        }`}
                      >
                        <option value="superadmin">SUPERADMIN (مشرف عام)</option>
                        <option value="admin">ADMIN (مسؤول منصة)</option>
                        <option value="merchant">MERCHANT (تاجر معتمد)</option>
                        <option value="creator">CREATOR (صانع محتوى)</option>
                        <option value="driver">DRIVER (مندوب شحن)</option>
                        <option value="buyer">BUYER (مشتري عادي)</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {u.role === 'merchant' ? (
                        <select
                          value={u.assignedStore || 'Talieska Studio (talieska)'}
                          onChange={(e) => handleAssignUserStore(u.id, e.target.value)}
                          className="px-2 py-0.5 rounded border border-gray-200 text-[11px] bg-white font-medium focus:outline-none"
                        >
                          {stores.map(st => (
                            <option key={st.id} value={`${st.name} (${st.subdomain.split('.')[0]})`}>
                              {st.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[11px] text-gray-500 font-mono">{u.assignedStore || '—'}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {u.status === 'active' ? '● Active' : '○ Suspended'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button
                        onClick={() => handleToggleUserStatus(u.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          u.status === 'active' 
                            ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' 
                            : 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {u.status === 'active' ? (isAr ? 'تجميد الحساب' : 'Suspend') : (isAr ? 'تفعيل' : 'Reactivate')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CATALOG & DEMO ITEMS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-slate-900">{isAr ? 'إدارة العناصر والمنتجات التجريبية (Demo Catalog Items)' : 'Demo Products & Catalog Control'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAr ? 'التحكم في المنتجات المعروضة في المتاجر، إخفاء/إظهار القطع، وتتبع المخزون' : 'Control items distributed across merchant stores, toggle visibility, and monitor inventory'}
              </p>
            </div>

            {/* Filter by Store */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-bold">{isAr ? 'تصفية حسب المتجر:' : 'Filter by Store:'}</span>
              <select
                value={storeFilter}
                onChange={(e) => setStoreFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="all">{isAr ? 'جميع المتاجر' : 'All Stores'}</option>
                {stores.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-y border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-start">{isAr ? 'المنتج' : 'Product'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'المتجر المالك' : 'Store / Merchant'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'السعر (EGP)' : 'Price'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'التصنيف' : 'Category'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'الحالة' : 'Visibility'}</th>
                  <th className="px-4 py-3 text-end">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCatalog.map(prod => (
                  <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={prod.image} alt={prod.title} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-xs">{prod.title}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{prod.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {prod.merchant || 'Talieska Studio'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{prod.price.toLocaleString()} ج.م</td>
                    <td className="px-4 py-3 text-gray-600">{prod.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        !prod.isHidden ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {!prod.isHidden ? '● معروض في المتجر' : '○ مخفي مؤقتاً'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <button
                        onClick={() => handleToggleProductVisibility(prod.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                          !prod.isHidden 
                            ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                            : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {!prod.isHidden ? (isAr ? 'إخفاء من المتجر' : 'Hide') : (isAr ? 'إظهار' : 'Unhide')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
