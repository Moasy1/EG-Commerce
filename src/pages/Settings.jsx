import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';

export default function Settings() {
  const { user, language, setLanguage, isAr } = useApp();
  const [activeTab, setActiveSettingsTab] = useState('profile');

  const handleSignOut = async () => {
    await AuthService.signOut();
    window.location.reload();
  };

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-black">{isAr ? 'الإعدادات' : 'Settings'}</h1>
        <p className="text-xs text-gray-500 mt-1">{isAr ? 'إدارة حسابك والتفضيلات' : 'Manage your account and preferences'}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveSettingsTab('profile')}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'profile' ? 'bg-slate-900 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            {isAr ? 'الملف الشخصي' : 'Profile'}
          </button>
          <button 
            onClick={() => setActiveSettingsTab('preferences')}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'preferences' ? 'bg-slate-900 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            {isAr ? 'التفضيلات' : 'Preferences'}
          </button>
          <button 
            onClick={() => setActiveSettingsTab('notifications')}
            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'notifications' ? 'bg-slate-900 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {isAr ? 'الإشعارات' : 'Notifications'}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">{isAr ? 'تعديل الملف الشخصي' : 'Edit Profile'}</h2>
              <div className="flex items-center gap-4">
                <img src={user?.profile?.avatar_url || "/images/reels/reel_2.jpg"} className="w-16 h-16 rounded-full border border-gray-200" alt="Avatar" />
                <button className="px-4 py-2 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50">
                  {isAr ? 'تغيير الصورة' : 'Change Avatar'}
                </button>
              </div>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isAr ? 'الاسم بالكامل' : 'Full Name'}</label>
                  <input type="text" defaultValue={user?.profile?.name || ''} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-slate-900 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <input type="email" defaultValue={user?.email || ''} readOnly className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 outline-none text-sm cursor-not-allowed" />
                </div>
                <button className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold mt-2">
                  {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">{isAr ? 'تفضيلات التطبيق' : 'App Preferences'}</h2>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isAr ? 'لغة العرض' : 'Display Language'}</label>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-slate-900 outline-none text-sm"
                  >
                    <option value="ar">العربية (Arabic)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold">{isAr ? 'إعدادات الإشعارات' : 'Notification Settings'}</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-slate-900" />
                  <span className="text-sm font-medium">{isAr ? 'إشعارات الطلبات والشحن' : 'Order & Shipping Updates'}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-slate-900" />
                  <span className="text-sm font-medium">{isAr ? 'العروض الترويجية والخصومات' : 'Promotions & Discounts'}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-slate-900" />
                  <span className="text-sm font-medium">{isAr ? 'إشعارات حملات المحتوى (UGC)' : 'UGC Campaign Alerts'}</span>
                </label>
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-gray-100">
            <button onClick={handleSignOut} className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              {isAr ? 'تسجيل الخروج من الحساب' : 'Sign out of your account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
