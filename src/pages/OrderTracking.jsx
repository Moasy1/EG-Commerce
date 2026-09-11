import React from 'react';
import { useApp } from '../context/AppContext';

export default function OrderTracking() {
  const { setActiveTab } = useApp();

  return (
    <div className="w-full flex-1 max-w-3xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      {/* Top Banner Confirmation */}
      <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high p-5 mb-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-1.5">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>Order Confirmed • تم تأكيد الأوردر بنجاح! 🎉</span>
          </div>
          <h1 className="font-serif text-lg md:text-xl font-bold text-on-surface">Tracking #EG-984201 • رقم الشحنة</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            البراندات بدأت تجهيز طلبك دلوقتي في مسار الشحن الموحد
          </p>
        </div>

        {/* Pickup OTP */}
        <div className="bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container-high text-center shrink-0">
          <span className="text-[10px] text-on-surface-variant font-medium block">Pickup OTP • كود الاستلام</span>
          <span className="font-serif text-xl font-bold text-secondary tracking-wider">5829</span>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-5 mb-6 shadow-sm">
        <h2 className="text-xs font-bold text-on-surface mb-5">Order Tracking Status • حالة الشحنة</h2>

        <div className="relative flex justify-between items-center max-w-lg mx-auto">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-surface-container-highest z-0" />
          <div className="absolute top-1/2 right-4 w-1/2 -translate-y-1/2 h-0.5 bg-secondary z-0" />

          {[
            { label: 'Confirmed • تم التأكيد', icon: 'receipt_long', active: true },
            { label: 'Preparing • تجهيز', icon: 'inventory_2', active: true },
            { label: 'Out for Delivery • مع المندوب', icon: 'local_shipping', active: true, current: true },
            { label: 'Delivered • تم التسليم', icon: 'home', active: false },
          ].map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all shadow-xs ${
                step.active
                  ? step.current
                    ? 'bg-secondary text-on-secondary ring-3 ring-secondary/20'
                    : 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-on-surface mt-1.5 text-center leading-tight">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Merchant Split Shipments */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs font-bold text-on-surface">Shipment Packages • طرود الطلب من المتاجر</h3>

        {/* Package 1 */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container-high">
            <div>
              <span className="text-[11px] font-semibold text-secondary">Package 1 of 2 • طرد 1</span>
              <h4 className="text-xs font-bold text-on-surface">Talisca Studio • تاليسكا ستوديو</h4>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Out for Delivery • مع المندوب
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>فستان كتان صيفي بوهيمي (M)</span>
            <span className="font-semibold text-on-surface">Estimated: Tonight • الليلة</span>
          </div>
        </div>

        {/* Package 2 */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container-high">
            <div>
              <span className="text-[11px] font-semibold text-secondary">Package 2 of 2 • طرد 2</span>
              <h4 className="text-xs font-bold text-on-surface">Khan El Khalili Workshop • ورشة خان الخليلي</h4>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-low text-on-surface-variant text-[11px] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant" />
              Packaging • جاري التجهيز والتغليف
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>حقيبة جلدية كانفاس يدوية</span>
            <span className="font-semibold text-on-surface">Estimated: Tomorrow • غداً بعد الظهر</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          onClick={() => setActiveTab('rewards')}
          className="flex-1 py-2.5 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container text-secondary font-bold text-xs flex items-center justify-center gap-1.5 border border-surface-container-high"
        >
          <span className="material-symbols-outlined text-[16px]">stars</span>
          <span>View Rewards • نقاطك المكتسبة (+140 Points)</span>
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-secondary transition-all shadow-sm"
        >
          Continue Shopping • تابعي التسوق
        </button>
      </div>
    </div>
  );
}
