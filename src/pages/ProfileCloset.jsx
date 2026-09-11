import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function ProfileCloset() {
  const { rewardPoints, role, setRole, setActiveTab, deviceMode, setDeviceMode } = useApp();
  const [profileTab, setProfileTab] = useState('orders');

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      {/* Profile Header Card */}
      <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high p-5 mb-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 text-center sm:text-right">
        <div className="flex flex-col sm:flex-row items-center gap-3.5">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBebD1XV7lyRsAl9IX8tKvw96y0vY-A3gyXbIFikiB9lcBqnBPraZyUu4KwB5cr8o2GSX3cq4h9v-tUoDKKT4cqFSr8eWnzqEj8vLK4YSx_rLs9XllzyohklMCsnt1PwT9FRovU6hVvUny8XCCEDLqQDyPOieiXb5w3HOCsbrm7L8CfFkF4E0PCcCZ1TA5VPM1qQ8214MO3rQB2O-zWXR5ggSKybljFH39T3QKh6AgE9rTLMKNbH4AW"
            alt="Profile Avatar"
            className="w-16 h-16 rounded-full object-cover ring-2 ring-surface-container-high shrink-0"
          />
          <div>
            <h1 className="font-serif text-lg md:text-xl font-bold text-on-surface">Mariam El-Kady • مريم القاضي</h1>
            <p className="text-xs text-on-surface-variant mt-0.5">mariam.elkady@example.com • 01023456789</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1.5">
              <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[11px] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">stars</span>
                {rewardPoints.toLocaleString()} Points مكافأة
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant text-[11px] font-medium">
                Silver Member • عضو فضي
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('rewards')}
          className="px-3.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-secondary flex items-center gap-1 shrink-0 border border-surface-container-high"
        >
          <span className="material-symbols-outlined text-[15px]">redeem</span>
          <span>Rewards Hub • محفظة النقاط</span>
        </button>
      </div>

      {/* Role Switcher */}
      <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-3.5 mb-6 shadow-xs">
        <h3 className="text-xs font-bold text-on-surface mb-2.5">Switch Role • التبديل بين الحسابات</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'buyer', label: '👤 Buyer • متسوق', desc: 'تصفح الريلز والـ Shop' },
            { id: 'creator', label: '🎬 Creator • صانع محتوى', desc: 'الـ Studio والحملات' },
            { id: 'merchant', label: '🏪 Merchant • تاجر', desc: 'إدارة المنتجات وحملات الـ UGC' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => {
                setRole(r.id);
                if (r.id === 'creator') setActiveTab('studio');
                else if (r.id === 'merchant') setActiveTab('merchant');
                else setActiveTab('reels');
              }}
              className={`p-2.5 rounded-lg text-right border transition-all ${
                role === r.id
                  ? 'border-secondary bg-secondary/5 text-on-surface'
                  : 'border-surface-container-high bg-surface-container-low text-on-surface-variant hover:border-outline'
              }`}
            >
              <span className="text-xs font-bold block text-on-surface">{r.label}</span>
              <span className="text-[10px] text-on-surface-variant mt-0.5 block">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-surface-container-high mb-4">
        <button
          onClick={() => setProfileTab('orders')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
            profileTab === 'orders'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          My Orders • طلباتي
        </button>
        <button
          onClick={() => setProfileTab('saved')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
            profileTab === 'saved'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Saved Items • المحفوظات
        </button>
        <button
          onClick={() => setProfileTab('settings')}
          className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
            profileTab === 'settings'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Settings & App • الإعدادات والتطبيق
        </button>
      </div>

      {/* Tab Contents */}
      {profileTab === 'orders' && (
        <div className="space-y-3">
          <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container-high">
              <div>
                <span className="text-xs font-bold text-on-surface">Order #EG-984201</span>
                <span className="text-[10px] text-on-surface-variant block mt-0.5">11 September 2026</span>
              </div>
              <button
                onClick={() => setActiveTab('tracking')}
                className="px-2.5 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-semibold hover:bg-secondary/20 flex items-center gap-1"
              >
                <span>Track Order • تتبع الأوردر</span>
                <span className="material-symbols-outlined text-[14px]">near_me</span>
              </button>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span>فستان كتان صيفي بوهيمي + حقيبة كانفاس يدوية</span>
              <span className="font-serif font-bold text-on-surface">2,370 EGP</span>
            </div>
          </div>
        </div>
      )}

      {profileTab === 'saved' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INITIAL_PRODUCTS.slice(0, 2).map((item) => (
            <div key={item.id} className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-2.5 shadow-xs">
              <img src={item.image} alt={item.title} className="w-full aspect-[3/4] rounded-lg object-cover mb-1.5" />
              <h4 className="text-xs font-semibold text-on-surface truncate">{item.title}</h4>
              <span className="font-serif text-xs font-bold text-secondary mt-1 block">{item.price.toLocaleString()} EGP</span>
            </div>
          ))}
        </div>
      )}

      {profileTab === 'settings' && (
        <div className="space-y-3 text-xs">
          <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-3.5 shadow-xs">
            <h4 className="font-bold text-on-surface mb-1">Saved Addresses • العناوين المحفوظة</h4>
            <p className="text-on-surface-variant text-[11px]">القاهرة، مصر الجديدة، شارع الثورة عمارة 14 (Default)</p>
          </div>
          <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-3.5 shadow-xs">
            <h4 className="font-bold text-on-surface mb-1">Mobile App & PWA • تثبيت التطبيق</h4>
            <p className="text-on-surface-variant text-[11px] leading-relaxed mb-2.5">
              تقدري تثبتي EG Fashion كتطبيق مستقل على موبايلك من خلال الضغط على "Add to Home Screen" في المتصفح.
            </p>
            <button
              onClick={() => setDeviceMode(prev => prev === 'responsive' ? 'mobile-frame' : 'responsive')}
              className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-surface-container-high font-semibold text-xs text-on-surface"
            >
              {deviceMode === 'mobile-frame' ? 'الرجوع إلى وضع الويب (Web Mode)' : 'معاينة وضع التطبيق (Mobile App Preview)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
