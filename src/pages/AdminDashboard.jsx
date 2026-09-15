import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdminService } from '../services/AdminService';

export default function AdminDashboard() {
  const { language, user, setIsAuthModalOpen } = useApp();
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  
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
    const loadData = async () => {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        AdminService.getPlatformStats(),
        AdminService.getUsers()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-[#d00000] border-t-transparent rounded-full animate-spin"></div>
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

  return (
    <div className="w-full flex-1 max-w-6xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-black">{isAr ? 'لوحة تحكم المنصة (Admin)' : 'Platform Admin Dashboard'}</h1>
          <p className="text-xs text-gray-500 mt-1">{isAr ? 'إدارة المستخدمين وعمولات المنصة' : 'Manage users and platform commissions'}</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'overview' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-900'}`}
          >
            {isAr ? 'نظرة عامة' : 'Overview'}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-slate-900'}`}
          >
            {isAr ? 'المستخدمين' : 'Users'}
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <span className="text-xs text-gray-400 font-medium block">{isAr ? 'أرباح المنصة (عمولات)' : 'Platform Revenue'}</span>
              <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
                {stats?.platformRevenue?.toLocaleString()} <span className="text-xs font-normal">ج.م</span>
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              </div>
              <span className="text-xs text-gray-400 font-medium block">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{stats?.totalOrders}</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[18px]">group</span>
              </div>
              <span className="text-xs text-gray-400 font-medium block">{isAr ? 'المستخدمين النشطين' : 'Active Users'}</span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">{stats?.activeUsers}</span>
            </div>
          </div>

          {/* Pure SVG Responsive GMV Chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900">{isAr ? 'حجم المعاملات الأسبوعي (GMV)' : 'Weekly GMV Trend (Last 7 Days)'}</h3>
                <span className="text-xs text-gray-400 font-mono">154,000 ج.م إجمالي الأسبوع • نمو +18.4%</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold font-mono">
                مباشر ✓ Live
              </span>
            </div>

            {/* Custom Interactive SVG Chart */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[640px] h-64 relative flex flex-col justify-between pt-4 pb-2">
                {/* SVG Visual Graphic */}
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 700 160" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="adminGmvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d00000" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#d00000" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Gridlines */}
                  <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="60" x2="700" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="100" x2="700" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="140" x2="700" y2="140" stroke="#e2e8f0" />

                  {/* Gradient Area */}
                  {/* Values mapped: Mon:12k->115, Tue:19k->88, Wed:15k->103, Thu:22k->76, Fri:28k->52, Sat:34k->28, Sun:24k->68 */}
                  <path
                    d="M 50 115 C 100 95, 120 90, 150 88 C 180 86, 220 101, 250 103 C 280 105, 320 80, 350 76 C 380 72, 420 56, 450 52 C 480 48, 520 30, 550 28 C 580 26, 620 62, 650 68 L 650 140 L 50 140 Z"
                    fill="url(#adminGmvGrad)"
                  />

                  {/* Stroke Line */}
                  <path
                    d="M 50 115 C 100 95, 120 90, 150 88 C 180 86, 220 101, 250 103 C 280 105, 320 80, 350 76 C 380 72, 420 56, 450 52 C 480 48, 520 30, 550 28 C 580 26, 620 62, 650 68"
                    fill="none"
                    stroke="#d00000"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points and Floating Value Pills */}
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
                      {/* Value tag */}
                      <rect x={pt.cx - 20} y={pt.cy - 24} width="40" height="18" rx="5" fill="#1e293b" />
                      <text x={pt.cx} y={pt.cy - 12} textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="monospace" fontWeight="bold">
                        {pt.val}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Day Labels Row */}
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

      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-sm">{isAr ? 'إدارة المستخدمين' : 'User Management'}</h3>
            <div className="relative">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
              <input type="text" placeholder={isAr ? 'بحث بالاسم...' : 'Search users...'} className="pl-4 pr-10 py-1.5 text-xs rounded-lg border border-gray-200 outline-none focus:border-slate-900" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-gray-50 text-xs text-gray-500 font-bold">
                <tr>
                  <th className="px-6 py-3 text-start">{isAr ? 'معرف المستخدم' : 'User ID'}</th>
                  <th className="px-6 py-3 text-start">{isAr ? 'الاسم' : 'Name'}</th>
                  <th className="px-6 py-3 text-start">{isAr ? 'الدور' : 'Role'}</th>
                  <th className="px-6 py-3 text-start">{isAr ? 'تاريخ الانضمام' : 'Joined Date'}</th>
                  <th className="px-6 py-3 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u, i) => (
                  <tr key={u.id || i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{u.id.substring(0,8)}...</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{u.name || 'Anonymous'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'merchant' ? 'bg-blue-100 text-blue-700' :
                        u.role === 'creator' ? 'bg-pink-100 text-pink-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role ? u.role.toUpperCase() : 'BUYER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-end">
                      <button onClick={() => setEditingUser(u)} className="text-blue-600 hover:text-blue-800 text-xs font-bold px-2 py-1 bg-blue-50 rounded">Edit</button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">No users found in database.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'commissions' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{isAr ? 'إعدادات العمولات' : 'Commission Settings'}</h3>
              <p className="text-xs text-gray-500">{isAr ? 'إدارة نسبة الخصم لكل عملية بيع' : 'Manage platform take-rate per transaction'}</p>
            </div>
          </div>
          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Standard Platform Fee (%)</label>
              <div className="flex items-center gap-2">
                <input type="number" defaultValue="12" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-slate-900 outline-none" />
                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-black">Save</button>
              </div>
            </div>
            <hr className="my-4 border-gray-100" />
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <h4 className="text-sm font-bold text-orange-800 flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                Pending Merchant Payouts
              </h4>
              <p className="text-xs text-orange-700 mb-3">You have 142,000 ج.م pending to be transferred to merchants for completed orders.</p>
              <button className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 shadow-sm">
                Initiate Batch Payout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">{isAr ? 'تعديل المستخدم' : 'Edit User'}</h3>
              <button onClick={() => setEditingUser(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isAr ? 'الاسم' : 'Name'}</label>
                <input type="text" defaultValue={editingUser.name} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-slate-900" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">{isAr ? 'الدور (Role)' : 'Role'}</label>
                <select defaultValue={editingUser.role || 'buyer'} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-slate-900">
                  <option value="buyer">Buyer</option>
                  <option value="creator">Creator</option>
                  <option value="merchant">Merchant</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => {
                    // Update user logic here
                    setEditingUser(null);
                  }}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-sm hover:bg-black transition-colors"
                >
                  {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
