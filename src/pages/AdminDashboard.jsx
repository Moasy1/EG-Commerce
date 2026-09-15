import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AdminService } from '../services/AdminService';

export default function AdminDashboard() {
  const { isAr, user } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  
  const chartData = [
    { name: 'Mon', GMV: 12000 },
    { name: 'Tue', GMV: 19000 },
    { name: 'Wed', GMV: 15000 },
    { name: 'Thu', GMV: 22000 },
    { name: 'Fri', GMV: 28000 },
    { name: 'Sat', GMV: 34000 },
    { name: 'Sun', GMV: 24000 },
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
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'overview', icon: 'monitoring', label: isAr ? 'نظرة عامة' : 'Overview' },
          { id: 'users', icon: 'group', label: isAr ? 'المستخدمين' : 'Users' },
          { id: 'commissions', icon: 'account_balance', label: isAr ? 'العمولات والمدفوعات' : 'Commissions & Payouts' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <span className="text-xs font-bold text-gray-500 mb-1">{isAr ? 'إجمالي المبيعات' : 'Total Platform GMV'}</span>
              <span className="text-2xl font-black text-slate-900">{stats?.totalRevenue.toLocaleString()} ج.م</span>
              <span className="text-[10px] text-emerald-600 font-bold mt-2 bg-emerald-50 px-2 py-0.5 rounded w-fit">+14.2% vs last month</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <span className="text-xs font-bold text-gray-500 mb-1">{isAr ? 'عمولة المنصة (12%)' : 'Platform Revenue'}</span>
              <span className="text-2xl font-black text-emerald-600">{stats?.platformCommission.toLocaleString()} ج.م</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <span className="text-xs font-bold text-gray-500 mb-1">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</span>
              <span className="text-2xl font-black text-slate-900">{stats?.totalOrders}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
              <span className="text-xs font-bold text-gray-500 mb-1">{isAr ? 'التجار النشطين' : 'Active Merchants'}</span>
              <span className="text-2xl font-black text-slate-900">{stats?.activeMerchants}</span>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
            <h3 className="font-bold text-slate-900 mb-6">{isAr ? 'حجم المعاملات (أخر 7 أيام)' : 'GMV Trend (Last 7 Days)'}</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} width={60} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="GMV" stroke="#d00000" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
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
