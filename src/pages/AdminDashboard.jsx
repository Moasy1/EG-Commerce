import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdminService } from '../services/AdminService';
import { OrderService } from '../services/OrderService';
import InvoiceModal from '../components/common/InvoiceModal';
import { printOrderInvoice } from '../utils/invoiceGenerator';
import AlgorithmManagerTab from '../components/admin/AlgorithmManagerTab';

export default function AdminDashboard() {
  const { language, user, setIsAuthModalOpen, setActiveTab: setAppTab, orders: appOrders, updateOrderStatus: updateAppOrderStatus } = useApp();
  const isAr = language === 'ar';
  
  // Superadmin Tabs: overview | stores | creators | users | catalog
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [stores, setStores] = useState([]);
  const [creators, setCreators] = useState([]);
  const [users, setUsers] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformOrders, setPlatformOrders] = useState([]);
  const [orderStoreFilter, setOrderStoreFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderSortMode, setOrderSortMode] = useState('newest');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  
  // Filter States
  const [roleFilter, setRoleFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  // Modal Dialog States
  const [modalType, setModalType] = useState(null); // 'addStore' | 'editStore' | 'addUser' | 'editUser' | 'addProduct' | 'editProduct' | 'addCreator' | 'editCreator'
  const [activeItem, setActiveItem] = useState(null);

  // Form Field States
  const [formData, setFormData] = useState({});

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

  const loadAllData = async () => {
    setLoading(true);
    const [statsData, storesData, creatorsData, usersData, catalogData] = await Promise.all([
      AdminService.getPlatformStats(),
      AdminService.getStores(),
      AdminService.getCreators(),
      AdminService.getUsers(),
      AdminService.getDemoCatalog()
    ]);
    setStats(statsData);
    setStores(storesData);
    setCreators(creatorsData);
    setUsers(usersData);
    setCatalogItems(catalogData);
    // Load all platform orders across the main domain and store subdomains
    const allOrders = await OrderService.getOrders();
    setPlatformOrders(allOrders);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (appOrders && appOrders.length > 0) {
      setPlatformOrders(appOrders);
    }
  }, [appOrders]);

  // Modal Open Handlers
  const openModal = (type, item = null) => {
    setModalType(type);
    setActiveItem(item);
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({});
    }
  };

  const closeModal = () => {
    setModalType(null);
    setActiveItem(null);
    setFormData({});
  };

  // ==========================================
  // STORES ACTIONS (CRUD)
  // ==========================================
  const handleSaveStore = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subdomain) {
      alert(isAr ? 'يرجى إدخال اسم المتجر والساب دومين' : 'Please enter store name and subdomain');
      return;
    }
    if (modalType === 'addStore') {
      const updated = await AdminService.createStore(formData);
      setStores(updated);
      showToast(isAr ? 'تم إنشاء المتجر وتخصيص الساب دومين بنجاح' : 'Store created and subdomain assigned');
    } else if (modalType === 'editStore') {
      const updated = await AdminService.updateStore(activeItem.id, formData);
      setStores(updated);
      showToast(isAr ? 'تم حفظ تعديلات المتجر' : 'Store updated successfully');
    }
    closeModal();
  };

  const handleDeleteStore = async (storeId) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المتجر؟' : 'Are you sure you want to delete this store?')) {
      const updated = await AdminService.deleteStore(storeId);
      setStores(updated);
      showToast(isAr ? 'تم حذف المتجر بنجاح' : 'Store deleted successfully');
    }
  };

  const handleToggleStoreStatus = async (storeId) => {
    const updated = await AdminService.toggleStoreStatus(storeId);
    setStores(updated);
    showToast(isAr ? 'تم تحديث حالة المتجر' : 'Store status updated');
  };

  // ==========================================
  // USERS ACTIONS (CRUD)
  // ==========================================
  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert(isAr ? 'يرجى إدخال الاسم والبريد الإلكتروني' : 'Please enter name and email');
      return;
    }
    if (modalType === 'addUser') {
      const updated = await AdminService.createUser(formData);
      setUsers(updated);
      showToast(isAr ? 'تمت إضافة المستخدم بنجاح' : 'User added successfully');
    } else if (modalType === 'editUser') {
      const updated = await AdminService.updateUser(activeItem.id, formData);
      setUsers(updated);
      showToast(isAr ? 'تم حفظ بيانات المستخدم وتعيين الصلاحيات' : 'User updated successfully');
    }
    closeModal();
  };

  const handleDeleteUser = async (userId) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المستخدم؟' : 'Are you sure you want to delete this user?')) {
      const updated = await AdminService.deleteUser(userId);
      setUsers(updated);
      showToast(isAr ? 'تم حذف المستخدم بنجاح' : 'User deleted');
    }
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

  // ==========================================
  // CATALOG / DEMO ITEMS ACTIONS (CRUD)
  // ==========================================
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert(isAr ? 'يرجى إدخال اسم المنتج وسعره' : 'Please enter product title and price');
      return;
    }
    if (modalType === 'addProduct') {
      const updated = await AdminService.createDemoProduct(formData);
      setCatalogItems(updated);
      showToast(isAr ? 'تمت إضافة المنتج التجريبي بنجاح' : 'Demo product created');
    } else if (modalType === 'editProduct') {
      const updated = await AdminService.updateDemoProduct(activeItem.id, formData);
      setCatalogItems(updated);
      showToast(isAr ? 'تم حفظ تعديلات المنتج' : 'Product updated successfully');
    }
    closeModal();
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      const updated = await AdminService.deleteDemoProduct(productId);
      setCatalogItems(updated);
      showToast(isAr ? 'تم حذف المنتج من الكتالوج' : 'Product deleted from catalog');
    }
  };

  const handleToggleProductVisibility = async (productId) => {
    const item = catalogItems.find(p => p.id === productId);
    if (!item) return;
    const updated = await AdminService.updateDemoProduct(productId, { isHidden: !item.isHidden });
    setCatalogItems(updated);
    showToast(isAr ? 'تم تعديل ظهور المنتج في المتجر' : 'Product visibility toggled');
  };

  // ==========================================
  // CREATORS ACTIONS (CRUD)
  // ==========================================
  const handleSaveCreator = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.handle) {
      alert(isAr ? 'يرجى إدخال اسم المبدع وحسابه' : 'Please enter creator name and handle');
      return;
    }
    if (modalType === 'addCreator') {
      const updated = await AdminService.createCreator(formData);
      setCreators(updated);
      showToast(isAr ? 'تمت إضافة المبدع وتحديد نسبة العمولة' : 'Creator added successfully');
    } else if (modalType === 'editCreator') {
      const updated = await AdminService.updateCreator(activeItem.id, formData);
      setCreators(updated);
      showToast(isAr ? 'تم حفظ بيانات المبدع' : 'Creator updated');
    }
    closeModal();
  };

  const handleDeleteCreator = async (creatorId) => {
    if (confirm(isAr ? 'هل أنت متأكد من حذف هذا المبدع؟' : 'Are you sure you want to delete this creator?')) {
      const updated = await AdminService.deleteCreator(creatorId);
      setCreators(updated);
      showToast(isAr ? 'تم حذف المبدع' : 'Creator deleted');
    }
  };

  const handleUpdateCommission = async (creatorId, rate) => {
    const updated = await AdminService.updateCreatorCommission(creatorId, rate);
    setCreators(updated);
    showToast(isAr ? `تم تحديث نسبة العمولة إلى %${rate}` : `Commission rate updated to ${rate}%`);
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
      {/* Official Tax Invoice & Waybill Modal */}
      <InvoiceModal
        isOpen={!!activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
        order={activeInvoiceOrder}
        merchant={stores.find(s => s.id === activeInvoiceOrder?.merchantId)}
      />

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
            {isAr ? 'التحكم الشامل: إضافة وتعديل وحذف المتاجر، الساب دومين، المبدعين، صلاحيات المستخدمين، والمنتجات' : 'Full CRUD control: add, edit, and delete stores, subdomains, creators, user roles, and catalog items'}
          </p>
        </div>

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
          { id: 'orders', icon: 'receipt_long', label: isAr ? 'الطلبات والمبيعات المركزية' : 'Platform Orders & Sync', count: platformOrders.length },
          { id: 'stores', icon: 'domain', label: isAr ? 'المتاجر والساب دومين' : 'Stores & Subdomains', count: stores.length },
          { id: 'creators', icon: 'verified', label: isAr ? 'المبدعين والمسوقين' : 'Creators & Affiliates', count: creators.length },
          { id: 'users', icon: 'manage_accounts', label: isAr ? 'المستخدمين وتعيين الصلاحيات' : 'Users & Roles', count: users.length },
          { id: 'catalog', icon: 'inventory_2', label: isAr ? 'المنتجات والعناصر التجريبية' : 'Demo Catalog & Items', count: catalogItems.length },
          { id: 'algorithm', icon: 'neurology', label: isAr ? 'محرك الخوارزمية وتوزيع الفيد' : 'Algorithm Engine & Feed', count: 'Live' }
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
              <span className="text-xs text-gray-400 font-medium block">{isAr ? 'المتاجر والساب دومينات' : 'Active Subdomains'}</span>
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
                    <linearGradient id="superadminGmvGrad2" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#superadminGmvGrad2)"
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
      {/* PLATFORM ORDERS & SYNC TAB */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (() => {
        const COMMISSION_RATE = 0.12;
        
        const getStatusBadge = (status) => {
          switch(status) {
            case 'ready_for_pickup':
            case 'pending_cod':
            case 'processing':
              return { label: isAr ? 'قيد التجهيز' : 'Processing', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'inventory_2' };
            case 'in_transit':
              return { label: isAr ? 'تم الشحن' : 'In transit', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: 'local_shipping' };
            case 'delivered':
              return { label: isAr ? 'مكتمل التوصيل' : 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'check_circle' };
            case 'returned':
              return { label: isAr ? 'مرتجع' : 'Returned', color: 'bg-red-50 text-red-700 border-red-200', icon: 'assignment_return' };
            default:
              return { label: status || (isAr ? 'غير محدد' : 'Unknown'), color: 'bg-gray-50 text-gray-600 border-gray-200', icon: 'help' };
          }
        };

        const getPaymentLabel = (order) => {
          if (order.paymentStatus === 'paid') return isAr ? 'مدفوع' : 'Paid';
          if ((order.paymentMethod || '').toLowerCase().includes('cod') || order.paymentStatus === 'pending_cod') return isAr ? 'دفع عند الاستلام' : 'COD';
          return isAr ? 'بانتظار الدفع' : 'Pending';
        };

        const normalizedQuery = orderSearchQuery.trim().toLowerCase();
        const filtered = platformOrders.filter(o => {
          const storeMatch = orderStoreFilter === 'all' || o.merchantId === orderStoreFilter;
          let statusMatch = true;
          if (orderStatusFilter === 'pending') statusMatch = ['ready_for_pickup', 'pending_cod', 'processing'].includes(o.shippingStatus);
          else if (orderStatusFilter === 'shipped') statusMatch = o.shippingStatus === 'in_transit';
          else if (orderStatusFilter === 'completed') statusMatch = o.shippingStatus === 'delivered';
          else if (orderStatusFilter === 'returned') statusMatch = o.shippingStatus === 'returned';
          const paymentMatch = orderPaymentFilter === 'all'
            || (orderPaymentFilter === 'paid' && o.paymentStatus === 'paid')
            || (orderPaymentFilter === 'cod' && (o.paymentStatus === 'pending_cod' || (o.paymentMethod || '').toLowerCase().includes('cod')))
            || (orderPaymentFilter === 'pending' && o.paymentStatus !== 'paid' && o.paymentStatus !== 'pending_cod');
          const haystack = [
            o.id,
            o.merchantName,
            o.customerName,
            o.phone,
            o.productTitle,
            o.trackingNumber,
            o.address
          ].filter(Boolean).join(' ').toLowerCase();
          const searchMatch = !normalizedQuery || haystack.includes(normalizedQuery);
          return storeMatch && statusMatch && paymentMatch && searchMatch;
        }).sort((a, b) => {
          if (orderSortMode === 'highest') return (b.amount || 0) - (a.amount || 0);
          if (orderSortMode === 'lowest') return (a.amount || 0) - (b.amount || 0);
          if (orderSortMode === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        const totalGMV = filtered.reduce((sum, o) => sum + (o.amount || 0), 0);
        const platformCommission = Math.round(totalGMV * COMMISSION_RATE);
        const merchantPayout = totalGMV - platformCommission;
        const pendingCount = filtered.filter(o => ['ready_for_pickup', 'pending_cod', 'processing'].includes(o.shippingStatus)).length;
        const shippedCount = filtered.filter(o => o.shippingStatus === 'in_transit').length;
        const paidCount = filtered.filter(o => o.paymentStatus === 'paid').length;
        const codCount = filtered.filter(o => o.paymentStatus === 'pending_cod' || (o.paymentMethod || '').toLowerCase().includes('cod')).length;
        const selectedOrders = filtered.filter(o => selectedOrderIds.includes(o.id));
        const allFilteredSelected = filtered.length > 0 && filtered.every(o => selectedOrderIds.includes(o.id));

        const handlePlatformOrderStatusUpdate = async (orderId, newStatus) => {
          setPlatformOrders(prev => prev.map(o => o.id === orderId ? { ...o, shippingStatus: newStatus } : o));
          if (updateAppOrderStatus) {
            await updateAppOrderStatus(orderId, newStatus);
          } else {
            await OrderService.updateOrderStatus(orderId, newStatus);
          }
          showToast(isAr ? 'تم تحديث حالة الطلب' : 'Order status updated');
        };

        const toggleOrderSelection = (orderId) => {
          setSelectedOrderIds(prev => prev.includes(orderId)
            ? prev.filter(id => id !== orderId)
            : [...prev, orderId]
          );
        };

        const toggleAllFilteredOrders = () => {
          if (allFilteredSelected) {
            setSelectedOrderIds(prev => prev.filter(id => !filtered.some(o => o.id === id)));
          } else {
            setSelectedOrderIds(prev => Array.from(new Set([...prev, ...filtered.map(o => o.id)])));
          }
        };

        const handleBulkStatusUpdate = async (newStatus) => {
          await Promise.all(selectedOrders.map(order => 
            updateAppOrderStatus 
              ? updateAppOrderStatus(order.id, newStatus) 
              : OrderService.updateOrderStatus(order.id, newStatus)
          ));
          setPlatformOrders(prev => prev.map(order => selectedOrderIds.includes(order.id) ? { ...order, shippingStatus: newStatus } : order));
          setSelectedOrderIds([]);
          showToast(isAr ? `تم تحديث ${selectedOrders.length} طلب` : `${selectedOrders.length} orders updated`);
        };

        const handleRefreshOrders = async () => {
          const latest = await OrderService.getOrders();
          setPlatformOrders(latest);
          setSelectedOrderIds([]);
          showToast(isAr ? 'تم تحديث الطلبات' : 'Orders refreshed');
        };

        const copyOrderText = async (order) => {
          const lines = [
            `Order: ${order.id}`,
            `Store: ${order.merchantName || order.merchantId}`,
            `Customer: ${order.customerName}`,
            `Phone: ${order.phone}`,
            `Address: ${order.address}`,
            `Items: ${order.productTitle}`,
            `Total: ${order.amount || 0} EGP`,
            `Tracking: ${order.trackingNumber || '-'}`
          ];
          try {
            await navigator.clipboard.writeText(lines.join('\n'));
            showToast(isAr ? 'تم نسخ بيانات الطلب' : 'Order details copied');
          } catch (err) {
            showToast(isAr ? 'تعذر النسخ من المتصفح' : 'Copy failed in this browser');
          }
        };

        const openWhatsApp = (order) => {
          const phone = (order.phone || '').replace(/[^\d+]/g, '');
          const message = encodeURIComponent(`مرحباً ${order.customerName || ''}، طلبك ${order.id} حالته: ${getStatusBadge(order.shippingStatus).label}`);
          window.open(`https://wa.me/${phone.replace(/^\+/, '')}?text=${message}`, '_blank', 'noopener,noreferrer');
        };

        const printOrder = (order) => {
          const store = stores.find(s => s.id === order.merchantId) || null;
          printOrderInvoice(order, store);
        };

        return (
          <div className="space-y-4">
            {/* Summary KPIs */}
            <div className="grid grid-cols-2 xl:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-red-50 text-[#d00000] flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block">{isAr ? 'إجمالي الطلبات المعروضة' : 'Filtered Orders'}</span>
                <span className="text-lg font-bold font-mono text-slate-900 block">{filtered.length} <span className="text-xs font-normal">طلب</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block">{isAr ? 'إجمالي المعاملات (GMV)' : 'Total GMV'}</span>
                <span className="text-lg font-bold font-mono text-slate-900 block">{totalGMV.toLocaleString()} <span className="text-xs font-normal">ج.م</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block">{isAr ? `عمولة المنصة (${COMMISSION_RATE * 100}%)` : `Commission (${COMMISSION_RATE * 100}%)`}</span>
                <span className="text-lg font-bold font-mono text-purple-600 block">{platformCommission.toLocaleString()} <span className="text-xs font-normal">ج.م</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block">{isAr ? 'صافي مستحقات التجار' : 'Merchant Payout'}</span>
                <span className="text-lg font-bold font-mono text-blue-600 block">{merchantPayout.toLocaleString()} <span className="text-xs font-normal">ج.م</span></span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[16px]">pending_actions</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block">{isAr ? 'بانتظار التجهيز' : 'Needs Action'}</span>
                <span className="text-lg font-bold font-mono text-amber-700 block">{pendingCount}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-[16px]">route</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block">{isAr ? 'في الشحن / مدفوع' : 'Transit / Paid'}</span>
                <span className="text-lg font-bold font-mono text-sky-700 block">{shippedCount} / {paidCount}</span>
              </div>
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-bold text-slate-900">{isAr ? 'الطلبات والمبيعات المركزية (Platform Orders & Sync)' : 'Central Platform Orders'}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isAr ? 'جميع الطلبات عبر كل المتاجر مع حساب العمولات والتوزيع' : 'All orders across all stores with commission split and sync status'}
                  </p>
                </div>
                <button
                  onClick={handleRefreshOrders}
                  className="h-9 px-3 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  <span>{isAr ? 'تحديث' : 'Refresh'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-2">
                <label className="xl:col-span-2 h-10 flex items-center gap-2 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs">
                  <span className="material-symbols-outlined text-[17px] text-gray-400">search</span>
                  <input
                    value={orderSearchQuery}
                    onChange={e => setOrderSearchQuery(e.target.value)}
                    placeholder={isAr ? 'ابحث برقم الطلب، العميل، الهاتف، التتبع...' : 'Search order, customer, phone, tracking...'}
                    className="w-full bg-transparent outline-none text-slate-700"
                  />
                </label>
                  <select
                    value={orderStoreFilter}
                    onChange={e => setOrderStoreFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none"
                  >
                    <option value="all">{isAr ? 'كل المتاجر' : 'All Stores'}</option>
                    <option value="171842bd-daed-40ef-853f-917eab2ed437">Drip Fit</option>
                    <option value="171842bd-daed-40ef-853f-917eab2ed437">Khan El Khalili Craft</option>
                    <option value="171842bd-daed-40ef-853f-917eab2ed437">Tiba Jewelry</option>
                  </select>
                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none"
                  >
                    <option value="all">{isAr ? 'كل الحالات' : 'All Statuses'}</option>
                    <option value="pending">{isAr ? 'قيد التجهيز' : 'Pending'}</option>
                    <option value="shipped">{isAr ? 'تم الشحن' : 'Shipped'}</option>
                    <option value="completed">{isAr ? 'مكتمل التوصيل' : 'Delivered'}</option>
                    <option value="returned">{isAr ? 'مرتجع' : 'Returned'}</option>
                  </select>
                <select
                  value={orderPaymentFilter}
                  onChange={e => setOrderPaymentFilter(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none"
                >
                  <option value="all">{isAr ? 'كل طرق الدفع' : 'All Payments'}</option>
                  <option value="paid">{isAr ? 'مدفوع مسبقاً' : 'Paid'}</option>
                  <option value="cod">{isAr ? 'الدفع عند الاستلام' : 'COD'}</option>
                  <option value="pending">{isAr ? 'بانتظار الدفع' : 'Pending'}</option>
                </select>
                <select
                  value={orderSortMode}
                  onChange={e => setOrderSortMode(e.target.value)}
                  className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none"
                >
                  <option value="newest">{isAr ? 'الأحدث أولاً' : 'Newest first'}</option>
                  <option value="oldest">{isAr ? 'الأقدم أولاً' : 'Oldest first'}</option>
                  <option value="highest">{isAr ? 'الأعلى قيمة' : 'Highest value'}</option>
                  <option value="lowest">{isAr ? 'الأقل قيمة' : 'Lowest value'}</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={toggleAllFilteredOrders}
                    className="h-8 px-3 rounded-lg bg-white border border-gray-200 text-slate-700 font-bold flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">{allFilteredSelected ? 'check_box' : 'check_box_outline_blank'}</span>
                    <span>{allFilteredSelected ? (isAr ? 'إلغاء تحديد الكل' : 'Clear all') : (isAr ? 'تحديد الكل' : 'Select all')}</span>
                  </button>
                  <span className="text-gray-500 font-semibold">{selectedOrders.length} {isAr ? 'محدد' : 'selected'}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">{isAr ? 'COD' : 'COD'}: <strong className="text-amber-700">{codCount}</strong></span>
                  <span className="text-gray-500">{isAr ? 'مدفوع' : 'Paid'}: <strong className="text-emerald-700">{paidCount}</strong></span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button disabled={selectedOrders.length === 0} onClick={() => handleBulkStatusUpdate('in_transit')} className="h-8 px-3 rounded-lg bg-blue-600 text-white font-bold disabled:opacity-40 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">local_shipping</span>
                    <span>{isAr ? 'شحن المحدد' : 'Ship selected'}</span>
                  </button>
                  <button disabled={selectedOrders.length === 0} onClick={() => handleBulkStatusUpdate('delivered')} className="h-8 px-3 rounded-lg bg-emerald-600 text-white font-bold disabled:opacity-40 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>
                    <span>{isAr ? 'تسليم المحدد' : 'Deliver selected'}</span>
                  </button>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <span className="material-symbols-outlined text-5xl mb-3">inbox</span>
                  <p className="text-sm font-bold">{isAr ? 'لا توجد طلبات بهذه المعايير' : 'No orders match the selected filters'}</p>
                </div>
              ) : (
                <>
                <div className="lg:hidden space-y-3">
                  {filtered.map(o => {
                    const badge = getStatusBadge(o.shippingStatus);
                    const commission = Math.round((o.amount || 0) * COMMISSION_RATE);
                    const payout = (o.amount || 0) - commission;
                    return (
                      <div key={o.id} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0">
                            <button onClick={() => toggleOrderSelection(o.id)} className="mt-0.5 text-slate-500">
                              <span className="material-symbols-outlined text-[19px]">{selectedOrderIds.includes(o.id) ? 'check_box' : 'check_box_outline_blank'}</span>
                            </button>
                            <div className="min-w-0">
                              <p className="font-mono font-black text-slate-900 text-sm">{o.id}</p>
                              <p className="text-[11px] text-gray-500 truncate">{o.merchantName?.split(' • ')[0] || o.merchantId}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 shrink-0 ${badge.color}`}>
                            <span className="material-symbols-outlined text-[13px]">{badge.icon}</span>
                            {badge.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-lg bg-gray-50 p-2">
                            <span className="block text-[10px] text-gray-400 font-bold">{isAr ? 'العميل' : 'Customer'}</span>
                            <span className="block font-bold text-slate-800 truncate">{o.customerName}</span>
                            <span className="block text-[10px] text-gray-500 font-mono" dir="ltr">{o.phone}</span>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-2">
                            <span className="block text-[10px] text-gray-400 font-bold">{isAr ? 'الإجمالي / الصافي' : 'Total / Payout'}</span>
                            <span className="block font-mono font-black text-slate-900">{(o.amount || 0).toLocaleString()} ج.م</span>
                            <span className="block text-[10px] text-gray-500">{payout.toLocaleString()} ج.م</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 leading-5 line-clamp-2">{o.productTitle}</p>

                        <div className="flex items-center gap-2">
                          <select
                            className="flex-1 h-9 bg-white border border-gray-200 text-slate-700 text-xs rounded-lg px-2 cursor-pointer focus:outline-none"
                            value={o.shippingStatus}
                            onChange={e => handlePlatformOrderStatusUpdate(o.id, e.target.value)}
                          >
                            <option value="ready_for_pickup">قيد التجهيز</option>
                            <option value="in_transit">تم الشحن (بوسطة)</option>
                            <option value="delivered">مكتمل التوصيل</option>
                            <option value="returned">مرتجع</option>
                          </select>
                          <button onClick={() => openWhatsApp(o)} className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center" title="واتساب العميل">
                            <span className="material-symbols-outlined text-[17px]">chat</span>
                          </button>
                          <button onClick={() => copyOrderText(o)} className="w-9 h-9 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center" title="نسخ بيانات الطلب">
                            <span className="material-symbols-outlined text-[17px]">content_copy</span>
                          </button>
                          <button onClick={() => setActiveInvoiceOrder(o)} className="w-9 h-9 rounded-lg bg-red-50 text-[#d00000] flex items-center justify-center" title="معاينة الفاتورة الضريبية والبوليصة">
                            <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                          </button>
                          <button onClick={() => printOrder(o)} className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center" title="طباعة فورية">
                            <span className="material-symbols-outlined text-[17px]">print</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-start text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-y border-gray-100">
                      <tr>
                        <th className="px-3 py-3 text-start w-10"></th>
                        <th className="px-3 py-3 text-start">{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                        <th className="px-3 py-3 text-start">{isAr ? 'المتجر' : 'Store'}</th>
                        <th className="px-3 py-3 text-start">{isAr ? 'العميل' : 'Customer'}</th>
                        <th className="px-3 py-3 text-start">{isAr ? 'المنتج' : 'Product'}</th>
                        <th className="px-3 py-3 text-start">{isAr ? 'الإجمالي' : 'Total'}</th>
                        <th className="px-3 py-3 text-start">{isAr ? 'عمولة المنصة' : 'Commission'}</th>
                        <th className="px-3 py-3 text-start">{isAr ? 'الدفع' : 'Payment'}</th>
                        <th className="px-3 py-3 text-start w-36">{isAr ? 'حالة الشحن' : 'Status'}</th>
                        <th className="px-3 py-3 text-start">{isAr ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filtered.map(o => {
                        const badge = getStatusBadge(o.shippingStatus);
                        const commission = Math.round((o.amount || 0) * COMMISSION_RATE);
                        const payout = (o.amount || 0) - commission;
                        return (
                          <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                            <td className="px-3 py-3">
                              <button onClick={() => toggleOrderSelection(o.id)} className="text-slate-500">
                                <span className="material-symbols-outlined text-[18px]">{selectedOrderIds.includes(o.id) ? 'check_box' : 'check_box_outline_blank'}</span>
                              </button>
                            </td>
                            <td className="px-3 py-3">
                              <span className="font-bold text-slate-900 block font-mono">{o.id}</span>
                              <span className="text-[10px] text-gray-400">{o.date || new Date(o.createdAt || Date.now()).toLocaleDateString()}</span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold whitespace-nowrap">
                                {o.merchantName?.split(' • ')[0] || o.merchantId}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <span className="font-bold text-slate-800 block text-[11px]">{o.customerName}</span>
                              <span className="text-[10px] text-gray-500 font-mono" dir="ltr">{o.phone}</span>
                            </td>
                            <td className="px-3 py-3 text-gray-600 max-w-[140px] truncate text-[11px]" title={o.productTitle}>
                              {o.productTitle}
                            </td>
                            <td className="px-3 py-3 font-bold font-mono text-slate-900">
                              {(o.amount || 0).toLocaleString()}
                              <span className="text-[10px] font-normal text-gray-400"> ج.م</span>
                            </td>
                            <td className="px-3 py-3">
                              <div className="space-y-0.5">
                                <span className="text-purple-600 font-mono font-bold block">{commission.toLocaleString()} ج.م</span>
                                <span className="text-[10px] text-gray-400">صافي: {payout.toLocaleString()} ج.م</span>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                o.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              }`}>
                                {getPaymentLabel(o)}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex flex-col gap-1">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border w-fit ${badge.color}`}>
                                  <span className="inline-flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[13px]">{badge.icon}</span>
                                    {badge.label}
                                  </span>
                                </span>
                                <select
                                  className="bg-white border border-gray-200 text-slate-700 text-[10px] rounded px-1 py-1 cursor-pointer focus:outline-none w-full shadow-sm"
                                  value={o.shippingStatus}
                                  onChange={e => handlePlatformOrderStatusUpdate(o.id, e.target.value)}
                                >
                                  <option value="ready_for_pickup">قيد التجهيز</option>
                                  <option value="in_transit">تم الشحن (بوسطة)</option>
                                  <option value="delivered">مكتمل التوصيل</option>
                                  <option value="returned">مرتجع</option>
                                </select>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => openWhatsApp(o)} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center" title={isAr ? 'واتساب العميل' : 'WhatsApp customer'}>
                                  <span className="material-symbols-outlined text-[16px]">chat</span>
                                </button>
                                <button onClick={() => copyOrderText(o)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center" title={isAr ? 'نسخ الطلب' : 'Copy order'}>
                                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                                </button>
                                <button onClick={() => setActiveInvoiceOrder(o)} className="w-8 h-8 rounded-lg bg-red-50 text-[#d00000] flex items-center justify-center hover:bg-red-100 transition-colors" title={isAr ? 'معاينة الفاتورة والبوليصة' : 'View Tax Invoice & Waybill'}>
                                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                                </button>
                                <button onClick={() => printOrder(o)} className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-colors" title={isAr ? 'طباعة المستند الرسمي' : 'Print Official Invoice'}>
                                  <span className="material-symbols-outlined text-[16px]">print</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                </>
              )}
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* 2. STORES & SUBDOMAINS TAB (With Add, Edit, Delete) */}
      {/* ========================================================================= */}
      {activeTab === 'stores' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900">{isAr ? 'متاجر المنصة والساب دومينات (Shopify-Style Subdomains)' : 'Subdomain Stores Directory'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAr ? 'إمكانية إضافة متجر جديد بساب دومين فوري، تعديل البيانات، أو حذف المتجر' : 'Add new stores with automatic subdomain provision, edit details, or remove stores'}
              </p>
            </div>
            <button
              onClick={() => openModal('addStore')}
              className="px-4 py-2 rounded-xl bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add_business</span>
              <span>{isAr ? 'إضافة متجر ساب دومين جديد' : 'Add New Store'}</span>
            </button>
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

                {/* Store Action Bar: Visit, Edit, Toggle, Delete */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <a
                    href={`https://${st.subdomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold text-center flex items-center justify-center gap-1 transition-all"
                  >
                    <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                    <span>{isAr ? 'زيارة المتجر' : 'Visit'}</span>
                  </a>
                  <button
                    onClick={() => openModal('editStore', st)}
                    className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-slate-700 hover:bg-gray-50 text-xs font-bold transition-colors"
                  >
                    {isAr ? 'تعديل' : 'Edit'}
                  </button>
                  <button
                    onClick={() => handleToggleStoreStatus(st.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      st.status === 'active' 
                        ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {st.status === 'active' ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'تفعيل' : 'Activate')}
                  </button>
                  <button
                    onClick={() => handleDeleteStore(st.id)}
                    className="p-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title={isAr ? 'حذف المتجر' : 'Delete Store'}
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. CREATORS & AFFILIATES TAB (With Add, Edit, Delete) */}
      {/* ========================================================================= */}
      {activeTab === 'creators' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-900">{isAr ? 'صناع المحتوى والمسوقين بالعمولة (Creators & Affiliates)' : 'Content Creators & Affiliates'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAr ? 'إضافة مبدعين، ربطهم بالبراندات، وتعديل نسب العمولات والأرباح' : 'Add creators, assign to brands, and manage commission rates'}
              </p>
            </div>
            <button
              onClick={() => openModal('addCreator')}
              className="px-4 py-2 rounded-xl bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>{isAr ? 'إضافة مبدع جديد' : 'Add Creator'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creators.map(c => (
              <div key={c.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex items-start justify-between">
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openModal('editCreator', c)}
                      className="p-1.5 rounded-lg border border-gray-200 text-slate-700 hover:bg-gray-100"
                      title={isAr ? 'تعديل' : 'Edit'}
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCreator(c.id)}
                      className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
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

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
                  <span className="font-bold text-slate-700">{isAr ? 'نسبة العمولة:' : 'Commission:'}</span>
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
      {/* 4. USERS & ROLE ASSIGNMENT TAB (With Add, Edit, Delete) */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-slate-900">{isAr ? 'إدارة المستخدمين وتعيين الصلاحيات (Role Assignment)' : 'Users Management & Permissions'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAr ? 'إضافة مستخدم جديد، ترقية الحسابات، وربط التجار بالمتاجر' : 'Add users, elevate permissions, and assign merchants to boutiques'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal('addUser')}
                className="px-3.5 py-1.5 rounded-xl bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span>
                <span>{isAr ? 'إضافة مستخدم جديد' : 'Add User'}</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
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

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-y border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-start">{isAr ? 'المستخدم' : 'User'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'الدور (Role)' : 'Role'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'المتجر المعين' : 'Assigned Entity'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="px-4 py-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
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
                    <td className="px-4 py-3 text-gray-600 font-mono text-[11px]">
                      {u.assignedStore || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        u.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {u.status === 'active' ? '● Active' : '○ Suspended'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openModal('editUser', u)}
                          className="px-2 py-1 rounded border border-gray-200 text-slate-700 hover:bg-gray-100 font-bold"
                        >
                          {isAr ? 'تعديل' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-2 py-1 rounded font-bold ${
                            u.status === 'active' 
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' 
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {u.status === 'active' ? (isAr ? 'تجميد' : 'Suspend') : (isAr ? 'تنشيط' : 'Activate')}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50"
                          title={isAr ? 'حذف المستخدم' : 'Delete'}
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
      )}

      {/* ========================================================================= */}
      {/* 5. CATALOG & DEMO ITEMS TAB (With Add, Edit, Delete) */}
      {/* ========================================================================= */}
      {activeTab === 'catalog' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-slate-900">{isAr ? 'إدارة العناصر والمنتجات التجريبية (Demo Catalog Items)' : 'Demo Products & Catalog Control'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isAr ? 'إضافة منتجات جديدة، تعديل الأسعار، إخفاء المنتجات أو حذفها' : 'Add new items, adjust pricing, toggle visibility, and delete products'}
              </p>
            </div>

            <div className="flex items-center gap-3">
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

              <button
                onClick={() => openModal('addProduct')}
                className="px-3.5 py-1.5 rounded-xl bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>{isAr ? 'إضافة منتج تجريبي' : 'Add Product'}</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-bold border-y border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-start">{isAr ? 'المنتج' : 'Product'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'المتجر المالك' : 'Store'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'السعر (EGP)' : 'Price'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'التصنيف' : 'Category'}</th>
                  <th className="px-4 py-3 text-start">{isAr ? 'الحالة' : 'Visibility'}</th>
                  <th className="px-4 py-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCatalog.map(prod => (
                  <tr key={prod.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={prod.image} alt={prod.title} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-xs">{prod.title}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{prod.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {prod.merchant || 'Drip Fit'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{prod.price.toLocaleString()} ج.م</td>
                    <td className="px-4 py-3 text-gray-600">{prod.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                        !prod.isHidden ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {!prod.isHidden ? '● معروض' : '○ مخفي'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openModal('editProduct', prod)}
                          className="px-2 py-1 rounded border border-gray-200 text-slate-700 hover:bg-gray-100 font-bold"
                        >
                          {isAr ? 'تعديل' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleToggleProductVisibility(prod.id)}
                          className={`px-2 py-1 rounded font-bold ${
                            !prod.isHidden 
                              ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' 
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {!prod.isHidden ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'إظهار' : 'Unhide')}
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1 rounded text-red-600 hover:bg-red-50"
                          title={isAr ? 'حذف المنتج' : 'Delete'}
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
      )}

      {/* ========================================================================= */}
      {/* 6. ALGORITHM ENGINE & FEED CONTROLS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'algorithm' && (
        <AlgorithmManagerTab
          isAr={isAr}
          showToast={showToast}
          user={user}
          stores={stores}
          creators={creators}
          catalogItems={catalogItems}
        />
      )}

      {/* ========================================================================= */}
      {/* UNIVERSAL MODAL (ADD / EDIT FOR STORES, USERS, PRODUCTS, CREATORS) */}
      {/* ========================================================================= */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in text-start">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-slate-900 text-base">
                {modalType === 'addStore' && (isAr ? 'إضافة متجر ساب دومين جديد' : 'Add New Subdomain Store')}
                {modalType === 'editStore' && (isAr ? 'تعديل بيانات المتجر' : 'Edit Store Details')}
                {modalType === 'addUser' && (isAr ? 'إضافة مستخدم جديد' : 'Add New Platform User')}
                {modalType === 'editUser' && (isAr ? 'تعديل المستخدم وتعيين الصلاحيات' : 'Edit User & Permissions')}
                {modalType === 'addProduct' && (isAr ? 'إضافة منتج تجريبي جديد' : 'Add Demo Product')}
                {modalType === 'editProduct' && (isAr ? 'تعديل بيانات المنتج' : 'Edit Product')}
                {modalType === 'addCreator' && (isAr ? 'إضافة صانع محتوى' : 'Add Content Creator')}
                {modalType === 'editCreator' && (isAr ? 'تعديل بيانات المبدع' : 'Edit Creator')}
              </h3>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Form Content Depending on Modal Type */}
            <form onSubmit={
              modalType.includes('Store') ? handleSaveStore :
              modalType.includes('User') ? handleSaveUser :
              modalType.includes('Product') ? handleSaveProduct :
              handleSaveCreator
            } className="p-6 space-y-4 text-xs">
              {/* STORES FORM */}
              {modalType.includes('Store') && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'اسم المتجر (البراند)' : 'Store Name'}</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name || ''} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none" 
                      placeholder="e.g. Cairo Linen Studio"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'الساب دومين المخصص' : 'Subdomain'}</label>
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        required 
                        value={formData.subdomain || ''} 
                        onChange={e => setFormData({ ...formData, subdomain: e.target.value })} 
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                        placeholder="e.g. linen.egyptian-commerce.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'الدومين المخصص (اختياري)' : 'Custom Domain (Optional)'}</label>
                    <input 
                      type="text" 
                      value={formData.customDomain || ''} 
                      onChange={e => setFormData({ ...formData, customDomain: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                      placeholder="e.g. linenatelier.eg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'البريد الإلكتروني للمالك' : 'Owner Email'}</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.ownerEmail || ''} 
                      onChange={e => setFormData({ ...formData, ownerEmail: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                      placeholder="merchant@egyptian-commerce.com"
                    />
                  </div>
                </>
              )}

              {/* USERS FORM */}
              {modalType.includes('User') && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name || ''} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input 
                      type="email" 
                      required 
                      value={formData.email || ''} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'الدور والصلاحية (Role)' : 'Role'}</label>
                    <select 
                      value={formData.role || 'buyer'} 
                      onChange={e => setFormData({ ...formData, role: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-bold"
                    >
                      <option value="superadmin">SUPERADMIN (مشرف عام)</option>
                      <option value="admin">ADMIN (مسؤول منصة)</option>
                      <option value="merchant">MERCHANT (تاجر معتمد)</option>
                      <option value="creator">CREATOR (صانع محتوى)</option>
                      <option value="driver">DRIVER (مندوب شحن)</option>
                      <option value="buyer">BUYER (مشتري عادي)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'المتجر أو الكيان المعين له' : 'Assigned Store'}</label>
                    <input 
                      type="text" 
                      value={formData.assignedStore || ''} 
                      onChange={e => setFormData({ ...formData, assignedStore: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                      placeholder="e.g. Drip Fit (talieska)"
                    />
                  </div>
                </>
              )}

              {/* PRODUCTS FORM */}
              {modalType.includes('Product') && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'اسم المنتج' : 'Product Title'}</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.title || ''} 
                      onChange={e => setFormData({ ...formData, title: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{isAr ? 'السعر الحالي (ج.م)' : 'Price (EGP)'}</label>
                      <input 
                        type="number" 
                        required 
                        value={formData.price || ''} 
                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} 
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{isAr ? 'السعر قبل الخصم (اختياري)' : 'Original Price'}</label>
                      <input 
                        type="number" 
                        value={formData.originalPrice || ''} 
                        onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })} 
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'المتجر التابع له' : 'Assign to Store'}</label>
                    <select 
                      value={formData.merchantId || stores[0]?.id} 
                      onChange={e => {
                        const st = stores.find(s => s.id === e.target.value);
                        setFormData({ 
                          ...formData, 
                          merchantId: e.target.value,
                          merchant: st?.name || 'Drip Fit'
                        });
                      }} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none"
                    >
                      {stores.map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'رابط ريل الفيديو (MP4 Reel)' : 'Video Reel URL'}</label>
                    <input 
                      type="text" 
                      value={formData.video || ''} 
                      onChange={e => setFormData({ ...formData, video: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono text-[11px]" 
                      placeholder="/images/reels/fashion_citrine_blazer.mp4"
                    />
                  </div>
                </>
              )}

              {/* CREATORS FORM */}
              {modalType.includes('Creator') && (
                <>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'اسم صانع المحتوى' : 'Creator Name'}</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.name || ''} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">{isAr ? 'حساب السوشيال ميديا' : 'Handle'}</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.handle || ''} 
                      onChange={e => setFormData({ ...formData, handle: e.target.value })} 
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                      placeholder="@handle"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{isAr ? 'عدد المتابعين' : 'Followers'}</label>
                      <input 
                        type="text" 
                        value={formData.followers || ''} 
                        onChange={e => setFormData({ ...formData, followers: e.target.value })} 
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                        placeholder="100K"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">{isAr ? 'نسبة العمولة (%)' : 'Commission (%)'}</label>
                      <input 
                        type="number" 
                        value={formData.commissionRate || 12} 
                        onChange={e => setFormData({ ...formData, commissionRate: Number(e.target.value) })} 
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none font-mono" 
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-slate-700 font-bold hover:bg-gray-50"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl bg-[#d00000] hover:bg-red-700 text-white font-bold shadow-md transition-all active:scale-95"
                >
                  {isAr ? 'حفظ البيانات' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
