import React from 'react';
import { useApp } from '../context/AppContext';

export default function OrderTracking() {
  const { setActiveTab } = useApp();

  return (
    <div className="w-full flex-1 max-w-3xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 text-on-surface">
      {/* Top Banner Confirmation */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-500/20 via-surface-container-low to-surface-container-low border border-emerald-500/30 p-6 mb-8 text-center sm:text-right flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>تم استلام طلبك وتأكيد الدفع</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">رقم الطلب: #EG-984201</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            تم إرسال إشعار فوري للمتاجر لبدء تجهيز طلبك
          </p>
        </div>

        {/* Pickup Verification OTP */}
        <div className="bg-surface-container px-4 py-3 rounded-2xl border border-surface-variant/40 text-center shrink-0">
          <span className="text-[10px] text-on-surface-variant font-bold block">رمز استلام الشحنة (OTP)</span>
          <span className="text-2xl font-black text-secondary tracking-widest">5829</span>
        </div>
      </div>

      {/* Stepper Progress Visualizer */}
      <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-6 mb-8">
        <h2 className="text-sm font-bold text-white mb-6">مسار الطلب الموحد</h2>

        <div className="relative flex justify-between items-center max-w-xl mx-auto">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-surface-container-highest z-0" />
          <div className="absolute top-1/2 right-4 w-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0" />

          {[
            { label: 'تم التأكيد', icon: 'receipt_long', status: 'completed' },
            { label: 'قيد التجهيز', icon: 'inventory_2', status: 'completed' },
            { label: 'مع المندوب', icon: 'local_shipping', status: 'active' },
            { label: 'تم التسليم', icon: 'home', status: 'pending' },
          ].map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-md ${
                step.status === 'completed'
                  ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                  : step.status === 'active'
                  ? 'bg-secondary text-slate-950 ring-4 ring-secondary/20 animate-pulse'
                  : 'bg-surface-container text-on-surface-variant'
              }`}>
                <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
              </div>
              <span className="text-[11px] font-bold text-on-surface mt-2">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Merchant Split Shipments */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-bold text-white">تفاصيل الطرود المنفصلة من المتاجر</h3>

        {/* Package 1 */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-variant/30">
            <div>
              <span className="text-xs font-bold text-primary">طرد 1 من 2</span>
              <h4 className="text-sm font-bold text-white">دار الكتان المصري</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              خرجت للشحن مع المندوب
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>محتوى الطرد: فستان لينين كتان كايزن (مقاس M)</span>
            <span className="font-bold text-white">الوصول المتوقع: اليوم خلال 4 ساعات</span>
          </div>
        </div>

        {/* Package 2 */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-4 sm:p-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-variant/30">
            <div>
              <span className="text-xs font-bold text-primary">طرد 2 من 2</span>
              <h4 className="text-sm font-bold text-white">ورشة خان الخليلي</h4>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant" />
              جاري التجهيز والتغليف
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span>محتوى الطرد: حقيبة جلدية كانفاس يدوي</span>
            <span className="font-bold text-white">الوصول المتوقع: غداً بعد الظهر</span>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setActiveTab('rewards')}
          className="flex-1 py-3 px-6 rounded-2xl bg-surface-container hover:bg-surface-container-high border border-surface-variant/40 text-secondary font-bold text-xs flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">stars</span>
          <span>عرض نقاط المكافآت المكتسبة (+277 نقطة)</span>
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className="flex-1 py-3 px-6 rounded-2xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-lg"
        >
          العودة للتسوق واستكشاف الأزياء
        </button>
      </div>
    </div>
  );
}
