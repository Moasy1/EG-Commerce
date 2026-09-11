import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Checkout() {
  const { cartItems, grandTotal, discountFromPoints, shippingTotal, subtotal, setActiveTab } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('instapay'); // 'instapay' | 'card' | 'vodafone' | 'cod'
  const [address, setAddress] = useState('القاهرة، مصر الجديدة، شارع الثورة عمارة 14');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveTab('tracking');
    }, 1200);
  };

  return (
    <div className="w-full flex-1 max-w-3xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 text-on-surface">
      <button
        onClick={() => setActiveTab('cart')}
        className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary mb-6"
      >
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        <span>العودة إلى السلة</span>
      </button>

      <h1 className="text-2xl md:text-3xl font-black text-white mb-2">إتمام الشراء والدفع الموحد</h1>
      <p className="text-xs text-on-surface-variant mb-6">
        طلب موحد سيتم تقسيمه وتوصيله من المتاجر مباشرة إلى عنوانك
      </p>

      <div className="space-y-6">
        {/* Shipping Address */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
              <h2 className="text-sm font-bold text-white">عنوان التوصيل</h2>
            </div>
            <button className="text-xs text-primary font-bold hover:underline">تعديل</button>
          </div>
          <p className="text-sm text-on-surface-variant leading-relaxed font-medium bg-surface-container p-3 rounded-xl border border-surface-variant/30">
            {address}
          </p>
        </div>

        {/* Merchant Deliveries Breakdown */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-tertiary text-[20px]">local_shipping</span>
            <h2 className="text-sm font-bold text-white">مواعيد التوصيل المقدرة لكل متجر</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-surface-variant/30 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                <span className="font-bold text-white">دار الكتان المصري</span>
              </div>
              <span className="text-on-surface-variant font-medium">التوصيل خلال 48 ساعة (شحن سريع)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-surface-variant/30 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-bold text-white">ورشة خان الخليلي</span>
              </div>
              <span className="text-on-surface-variant font-medium">التوصيل خلال 3-4 أيام عمل</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary text-[20px]">payments</span>
            <h2 className="text-sm font-bold text-white">طريقة الدفع</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'instapay', title: 'إنستاباي (InstaPay)', desc: 'دفع لحظي ومباشر', icon: 'bolt' },
              { id: 'card', title: 'بطاقة ائتمانية / خصم', desc: 'فيزا وماستركارد وميزة', icon: 'credit_card' },
              { id: 'vodafone', title: 'المحافظ الإلكترونية', desc: 'فودافون كاش، أورنج، وي', icon: 'account_balance_wallet' },
              { id: 'cod', title: 'الدفع عند الاستلام', desc: 'دفع نقدي لمندوب الشحن', icon: 'handshake' }
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-right transition-all ${
                  paymentMethod === method.id
                    ? 'border-primary bg-primary/10 text-white shadow-sm'
                    : 'border-surface-variant/40 bg-surface-container text-on-surface-variant hover:border-surface-variant'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] mt-0.5 ${
                  paymentMethod === method.id ? 'text-primary' : 'text-on-surface-variant'
                }`}>
                  {method.icon}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-white">{method.title}</h4>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{method.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Review & Final CTA */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/40 p-5 shadow-xl">
          <div className="space-y-2.5 text-xs text-on-surface-variant mb-4 pb-4 border-b border-surface-variant/30">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="text-white font-bold">{subtotal} ج.م</span>
            </div>
            {discountFromPoints > 0 && (
              <div className="flex justify-between text-secondary">
                <span>خصم نقاط المكافآت:</span>
                <span className="font-bold">-{discountFromPoints} ج.م</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>تكلفة الشحن الموحد:</span>
              <span className="text-white font-bold">{shippingTotal} ج.م</span>
            </div>
            <div className="flex justify-between text-sm pt-2 text-white font-black">
              <span>المبلغ المطلوب دفعه:</span>
              <span className="text-xl text-primary">{grandTotal} ج.م</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري معالجة الطلب...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>تأكيد الطلب والدفع ({grandTotal} ج.م)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
