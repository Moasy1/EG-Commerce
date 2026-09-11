import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Checkout() {
  const { grandTotal, discountFromPoints, shippingTotal, subtotal, setActiveTab } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('instapay');
  const [address, setAddress] = useState('القاهرة، مصر الجديدة، شارع الثورة عمارة 14');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveTab('tracking');
    }, 1000);
  };

  return (
    <div className="w-full flex-1 max-w-3xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      <button
        onClick={() => setActiveTab('cart')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary mb-4"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        <span>العودة إلى السلة</span>
      </button>

      <h1 className="font-serif text-xl md:text-2xl font-bold text-on-surface mb-1">إتمام الشراء والدفع الموحد</h1>
      <p className="text-xs text-on-surface-variant mb-6">
        طلب موحد سيتم تجميعه وتوصيله من دور الأزياء المستقلة مباشرة إلى عنوانك
      </p>

      <div className="space-y-4">
        {/* Shipping Address */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
              <h2 className="text-xs font-bold text-on-surface">عنوان التوصيل</h2>
            </div>
            <button className="text-[11px] text-secondary font-semibold hover:underline">تعديل</button>
          </div>
          <p className="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg border border-surface-container-high">
            {address}
          </p>
        </div>

        {/* Merchant Deliveries Breakdown */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="material-symbols-outlined text-secondary text-[18px]">local_shipping</span>
            <h2 className="text-xs font-bold text-on-surface">مواعيد التوصيل المقدرة للطرود</h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-xs border border-surface-container-high">
              <span className="font-semibold text-on-surface">تاليسكا ستوديو</span>
              <span className="text-[11px] text-secondary font-medium">التوصيل خلال 48 ساعة</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-xs border border-surface-container-high">
              <span className="font-semibold text-on-surface">ورشة خان الخليلي</span>
              <span className="text-[11px] text-on-surface-variant font-medium">التوصيل خلال 3-4 أيام عمل</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
            <h2 className="text-xs font-bold text-on-surface">طريقة الدفع المتاحة</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'instapay', title: 'إنستاباي (InstaPay)', desc: 'تحويل لحظي مباشر', icon: 'bolt' },
              { id: 'card', title: 'بطاقة بنكية', desc: 'فيزا، ماستركارد، ميزة', icon: 'credit_card' },
              { id: 'vodafone', title: 'المحافظ الإلكترونية', desc: 'فودافون كاش ومحفظتي', icon: 'account_balance_wallet' },
              { id: 'cod', title: 'الدفع عند الاستلام', desc: 'نقداً لمندوب الشحن', icon: 'handshake' }
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-start gap-2.5 p-3 rounded-lg border text-right transition-all ${
                  paymentMethod === method.id
                    ? 'border-secondary bg-secondary/5 text-on-surface shadow-xs'
                    : 'border-surface-container-high bg-surface-container-low text-on-surface-variant hover:border-outline'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] mt-0.5 ${
                  paymentMethod === method.id ? 'text-secondary' : 'text-on-surface-variant'
                }`}>
                  {method.icon}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">{method.title}</h4>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">{method.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Review & Final Button */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="space-y-2 text-xs text-on-surface-variant mb-3 pb-3 border-b border-surface-container-high">
            <div className="flex justify-between">
              <span>المجموع الفرعي:</span>
              <span className="text-on-surface font-semibold">{subtotal.toLocaleString()} ج.م</span>
            </div>
            {discountFromPoints > 0 && (
              <div className="flex justify-between text-secondary">
                <span>خصم نقاط الولاء:</span>
                <span className="font-semibold">-{discountFromPoints} ج.م</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>الشحن الموحد:</span>
              <span className="text-on-surface font-semibold">{shippingTotal} ج.م</span>
            </div>
            <div className="flex justify-between text-sm pt-1.5 text-on-surface font-bold">
              <span>المبلغ الإجمالي المطلوب:</span>
              <span className="font-serif text-lg text-secondary font-bold">{grandTotal.toLocaleString()} ج.م</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-secondary transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري معالجة الطلب...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[17px]">verified</span>
                <span>تأكيد الطلب والدفع ({grandTotal.toLocaleString()} ج.م)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
