import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function ProfileCloset() {
  const { rewardPoints, role, setRole, setActiveTab, deviceMode, setDeviceMode } = useApp();
  const [profileTab, setProfileTab] = useState('orders'); // 'orders' | 'saved' | 'settings'

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 text-on-surface">
      {/* Profile Header Card */}
      <div className="rounded-3xl bg-surface-container-low border border-surface-variant/30 p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-right">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBebD1XV7lyRsAl9IX8tKvw96y0vY-A3gyXbIFikiB9lcBqnBPraZyUu4KwB5cr8o2GSX3cq4h9v-tUoDKKT4cqFSr8eWnzqEj8vLK4YSx_rLs9XllzyohklMCsnt1PwT9FRovU6hVvUny8XCCEDLqQDyPOieiXb5w3HOCsbrm7L8CfFkF4E0PCcCZ1TA5VPM1qQ8214MO3rQB2O-zWXR5ggSKybljFH39T3QKh6AgE9rTLMKNbH4AW"
            alt="Profile Avatar"
            className="w-20 h-20 rounded-full object-cover ring-4 ring-surface-container-high shrink-0"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white">مريم القاضي</h1>
            <p className="text-xs text-on-surface-variant mt-0.5 font-medium">mariam.elkady@example.com • 01023456789</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">stars</span>
                {rewardPoints.toLocaleString()} نقطة مكافأة
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold">
                عضو فضي
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setActiveTab('rewards')}
          className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-surface-variant/40 text-xs font-bold text-secondary flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">redeem</span>
          <span>محفظة المكافآت</span>
        </button>
      </div>

      {/* Role & Interface Quick Switcher */}
      <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-4 mb-8">
        <h3 className="text-xs font-bold text-on-surface-variant mb-3">تبديل الأدوار في المنصة (تجربة النظام المتكامل)</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'buyer', label: '👤 مشتري', desc: 'تصفح الريلز والسوق' },
            { id: 'creator', label: '🎬 صانع محتوى (UGC)', desc: 'الحملات والعمولات' },
            { id: 'merchant', label: '🏪 تاجر / علامة', desc: 'إدارة المنتجات والحملات' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => {
                setRole(r.id);
                if (r.id === 'creator') setActiveTab('studio');
                else if (r.id === 'merchant') setActiveTab('merchant');
                else setActiveTab('reels');
              }}
              className={`p-2.5 rounded-xl text-right border transition-all ${
                role === r.id
                  ? 'border-primary bg-primary/10 text-white shadow-sm'
                  : 'border-surface-variant/30 bg-surface-container text-on-surface-variant hover:border-surface-variant'
              }`}
            >
              <span className="text-xs font-bold block text-white">{r.label}</span>
              <span className="text-[10px] text-on-surface-variant mt-0.5 block">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-surface-variant/40 mb-6">
        <button
          onClick={() => setProfileTab('orders')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            profileTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-white'
          }`}
        >
          طلباتي السابقة
        </button>
        <button
          onClick={() => setProfileTab('saved')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            profileTab === 'saved'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-white'
          }`}
        >
          خزانتي المحفوظة (المفضلة)
        </button>
        <button
          onClick={() => setProfileTab('settings')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            profileTab === 'settings'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-white'
          }`}
        >
          الإعدادات والشحن
        </button>
      </div>

      {/* Tab Contents */}
      {profileTab === 'orders' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-4 sm:p-5">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-variant/30">
              <div>
                <span className="text-xs font-bold text-white">طلب رقم #EG-984201</span>
                <span className="text-[11px] text-on-surface-variant block mt-0.5">تاريخ الطلب: 11 سبتمبر 2026</span>
              </div>
              <button
                onClick={() => setActiveTab('tracking')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 flex items-center gap-1"
              >
                <span>تتبع الشحنة</span>
                <span className="material-symbols-outlined text-[15px]">near_me</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-on-surface-variant">المنتجات: فستان كتان كايزن + حقيبة كانفاس يدوية</span>
              <span className="font-bold text-white">2,770 ج.م</span>
            </div>
          </div>
        </div>
      )}

      {profileTab === 'saved' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {INITIAL_PRODUCTS.slice(0, 2).map((item) => (
            <div key={item.id} className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-3">
              <img src={item.image} alt={item.title} className="w-full aspect-square rounded-xl object-cover mb-2" />
              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
              <span className="text-xs font-black text-primary mt-1 block">{item.price} ج.م</span>
            </div>
          ))}
        </div>
      )}

      {profileTab === 'settings' && (
        <div className="space-y-4 text-xs">
          <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-4">
            <h4 className="font-bold text-white mb-2">العناوين المحفوظة</h4>
            <p className="text-on-surface-variant">القاهرة، مصر الجديدة، شارع الثورة عمارة 14 (الافتراضي)</p>
          </div>
          <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-4">
            <h4 className="font-bold text-white mb-2">تطبيق الهاتف وتثبيت PWA</h4>
            <p className="text-on-surface-variant leading-relaxed mb-3">
              يمكنك تثبيت EG Commerce كتطبيق هاتف مستقل عبر الضغط على "إضافة للشاشة الرئيسية" في متصفحك أو تشغيله كـ Native App عبر Capacitor.
            </p>
            <button
              onClick={() => setDeviceMode(prev => prev === 'responsive' ? 'mobile-frame' : 'responsive')}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-surface-variant/40 font-bold text-white"
            >
              {deviceMode === 'mobile-frame' ? 'الرجوع إلى وضع الويب العادي' : 'معاينة وضع التطبيق الآن'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
