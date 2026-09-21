import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';
import EgLogo from '../components/common/EgLogo';

export default function ProfileCloset() {
  const { setActiveTab, user, setUser, setIsAuthModalOpen, isAr, products, orders, rewardPoints } = useApp();
  const [profileTab, setProfileTab] = useState('items'); // 'items' | 'orders' | 'rewards'

  const handleSignOut = async () => {
    await AuthService.signOut();
    setUser(null);
  };

  if (!user) {
    return (
      <div className="w-full min-h-[calc(100vh-64px)] flex-1 bg-gray-50 flex flex-col items-center justify-center p-6 text-center select-none pb-20">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-300">
          <span className="material-symbols-outlined text-[40px]">person</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isAr ? 'حسابك الشخصي' : 'Your Profile'}
        </h2>
        <p className="text-sm text-gray-500 mb-8 max-w-[280px]">
          {isAr 
            ? 'قم بتسجيل الدخول للوصول إلى متجرك، فيديوهاتك، ونقاط المكافآت.' 
            : 'Sign in to access your store, reels, and reward balance.'}
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full max-w-[260px] bg-[#d00000] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all"
        >
          {isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Sign Up'}
        </button>
      </div>
    );
  }

  // Filter items created by or associated with this profile
  const userProducts = (products || []).filter(p => 
    p.createdBy === user.id || 
    (user.role === 'merchant' && (p.merchant?.toLowerCase().includes('drip-fit') || p.merchantId?.includes('0001')))
  );

  return (
    <div className="w-full min-h-[calc(100vh-64px)] flex-1 bg-white text-slate-900 flex flex-col font-sans select-none pb-20 pt-4" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Profile Header Info */}
      <div className="px-5 pt-3 pb-4 flex flex-col items-center text-center space-y-3 max-w-2xl mx-auto w-full">
        
        {/* Top actions */}
        <div className="w-full flex justify-between items-center">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            egyptian-commerce.com
          </span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all shadow-xs"
              title={isAr ? 'تعديل الملف الشخصي' : 'Edit Profile'}
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              {isAr ? 'تعديل الملف' : 'Edit Profile'}
            </button>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">logout</span>
              {isAr ? 'خروج' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Circular Avatar with Verified Badge */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-md overflow-hidden">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[36px]">person</span>
            )}
          </div>
          {['merchant', 'admin', 'creator'].includes(user.role) && (
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-sky-500 fill-current">
                verified
              </span>
            </div>
          )}
        </div>

        {/* Name & Title */}
        <div>
          <h1 className="text-base font-bold text-slate-900">{user.name || user.email?.split('@')[0]}</h1>
          {user.username && (
            <div className="text-xs font-mono text-gray-500 mt-0.5">
              @{user.username.replace(/^@/, '')}
            </div>
          )}
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700">
              {user.role}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              {user.email}
            </span>
          </div>

          {/* User Bio if present */}
          {user.bio && (
            <p className="text-xs text-gray-600 mt-2 max-w-sm mx-auto leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Location & Website badges if present */}
          {(user.location || user.website) && (
            <div className="flex items-center justify-center gap-3 mt-2 text-[11px] text-gray-500">
              {user.location && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-red-500">location_on</span>
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <a 
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1 text-[#d00000] hover:underline font-bold"
                >
                  <span className="material-symbols-outlined text-[13px]">link</span>
                  <span>{user.website}</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Role Quick Navigation Shortcuts */}
        <div className="w-full flex flex-wrap gap-2 justify-center pt-2">
          {user.role === 'merchant' && (
            <>
              <button
                onClick={() => setActiveTab('merchant-storefront')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                {isAr ? 'واجهة المتجر المستقل' : 'My Storefront'}
              </button>
              <button
                onClick={() => setActiveTab('add-product')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:bg-red-700 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                {isAr ? 'إضافة منتج جديد' : 'Add Product'}
              </button>
            </>
          )}

          {user.role === 'creator' && (
            <button
              onClick={() => setActiveTab('creator')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">smart_display</span>
              {isAr ? 'استوديو صناع المحتوى (UGC Studio)' : 'Creator Studio'}
            </button>
          )}

          {user.role === 'admin' && (
            <button
              onClick={() => setActiveTab('superadmin')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              {isAr ? 'لوحة إدارة المنصة (SuperAdmin)' : 'Admin Dashboard'}
            </button>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 pt-2 w-full border-t border-gray-100">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-900">{userProducts.length}</span>
            <span className="text-[11px] text-gray-400">{isAr ? 'المنتجات / المعروضات' : 'Products'}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-900">{(orders || []).length}</span>
            <span className="text-[11px] text-gray-400">{isAr ? 'الطلبات' : 'Orders'}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-emerald-600">{user.reward_points_balance || rewardPoints || 350}</span>
            <span className="text-[11px] text-gray-400">{isAr ? 'نقطة مكافآت' : 'Points'}</span>
          </div>
        </div>

      </div>

      {/* Profile Tabs */}
      <div className="w-full border-b border-gray-200 flex items-center mt-2 max-w-2xl mx-auto">
        <button
          onClick={() => setProfileTab('items')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
            profileTab === 'items' ? 'text-[#d00000]' : 'text-gray-400'
          }`}
        >
          <span>{isAr ? 'القطع والمنتجات' : 'Products'}</span>
          {profileTab === 'items' && (
            <span className="absolute bottom-0 inset-x-8 h-0.5 bg-[#d00000] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setProfileTab('orders')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
            profileTab === 'orders' ? 'text-[#d00000]' : 'text-gray-400'
          }`}
        >
          <span>{isAr ? 'الطلبات' : 'Orders'}</span>
          {profileTab === 'orders' && (
            <span className="absolute bottom-0 inset-x-8 h-0.5 bg-[#d00000] rounded-full" />
          )}
        </button>
      </div>

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {profileTab === 'items' && (
          userProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {userProducts.map((p) => (
                <div key={p.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-2.5 flex flex-col">
                  <img src={p.image} alt={p.title} className="w-full aspect-square object-cover rounded-xl mb-2" />
                  <span className="font-bold text-xs text-slate-800 line-clamp-1">{p.title}</span>
                  <span className="text-[11px] font-bold text-[#d00000] mt-1">{p.price} ج.م</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400 text-xs">
              {isAr ? 'لا توجد منتجات مسجلة لهذا الحساب حالياً.' : 'No products listed for this account.'}
            </div>
          )
        )}

        {profileTab === 'orders' && (
          <div className="space-y-2.5">
            {(orders || []).length > 0 ? (
              orders.map((o) => (
                <div key={o.id} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold block text-slate-800">{o.id}</span>
                    <span className="text-gray-400 text-[10px]">{o.date || '2026-09-15'}</span>
                  </div>
                  <div className="text-end">
                    <span className="font-bold block text-slate-900">{o.total || o.amount} ج.م</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold">
                      {o.status || 'مكتمل'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-400 text-xs">
                {isAr ? 'لا توجد طلبات سابقة.' : 'No previous orders.'}
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}
