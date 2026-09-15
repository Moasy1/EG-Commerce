import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderService } from '../services/OrderService';

export default function Checkout() {
  const { cartItems, grandTotal, discountFromPoints, shippingTotal, subtotal, setActiveTab, setOrders, user } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('instapay');
  const [customerName, setCustomerName] = useState(user?.name || 'سلمى الأحمدي');
  const [phone, setPhone] = useState(user?.phone || '+20 102 345 6789');
  const [address, setAddress] = useState('القاهرة، مصر الجديدة، شارع الثورة عمارة 14');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate Paymob / Stripe Gateway redirection & processing delay
    if (paymentMethod === 'card') {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulating 3D secure
    } else if (paymentMethod === 'instapay') {
      await new Promise(resolve => setTimeout(resolve, 700)); // Simulating Instapay deep link verification
    }
    
    try {
      const created = await OrderService.createOrder({
        cartItems,
        subtotal,
        discount: discountFromPoints,
        shipping: shippingTotal,
        total: grandTotal,
        user,
        userId: user?.id || null,
        customerName: customerName.trim() || user?.name || 'عميل تجارة مصرية',
        phone: phone.trim() || '+20 102 345 6789',
        address: address.trim() || 'القاهرة، مصر الجديدة، شارع الثورة عمارة 14',
        paymentMethod
      });
      
      const newOrders = Array.isArray(created) ? created : [created];
      // Update local orders list conceptually across platform and merchant dashboard
      setOrders(prev => [...newOrders, ...prev]);
      
      setIsProcessing(false);
      setActiveTab('tracking');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert('Failed to place order. Payment gateway declined.');
    }
  };

  return (
    <div className="w-full flex-1 max-w-3xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      <button
        onClick={() => setActiveTab('cart')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary mb-4"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        <span>Back to Cart • العودة للـ Cart</span>
      </button>

      <h1 className="font-serif text-xl md:text-2xl font-bold text-on-surface mb-1">Checkout • إتمام الشراء والدفع</h1>
      <p className="text-xs text-on-surface-variant mb-6">
        أوردر موحد هيتجمع ويتشحن من البراندات المصرية لعنوانك مباشرة
      </p>

      <div className="space-y-4">
        {/* Shipping Address & Recipient Info */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
            <h2 className="text-xs font-bold text-on-surface">Recipient & Shipping • بيانات المستلم والشحن</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-gray-500 font-bold mb-1">اسم المستلم</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="الاسم ثلاثي"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 font-bold mb-1">رقم الهاتف (للتواصل مع المندوب)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 10X XXX XXXX"
                dir="ltr"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-3 py-2 text-xs text-on-surface text-right focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 font-bold mb-1">عنوان التوصيل بالتفصيل</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="المحافظة، المنطقة، اسم الشارع، رقم العمارة والشقة"
              className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary"
            />
          </div>
        </div>

        {/* Merchant Deliveries Breakdown */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="material-symbols-outlined text-secondary text-[18px]">local_shipping</span>
            <h2 className="text-xs font-bold text-on-surface">Estimated Delivery • مواعيد وصول الطرود</h2>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-xs border border-surface-container-high">
              <span className="font-semibold text-on-surface">Talisca Studio • تاليسكا ستوديو</span>
              <span className="text-[11px] text-secondary font-medium">Delivery in 24-48 hrs • التوصيل خلال 24-48 ساعة</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low text-xs border border-surface-container-high">
              <span className="font-semibold text-on-surface">Khan El Khalili Workshop • ورشة خان الخليلي</span>
              <span className="text-[11px] text-on-surface-variant font-medium">Delivery in 3-4 days • خلال 3-4 أيام عمل</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
            <h2 className="text-xs font-bold text-on-surface">Payment Method • طريقة الدفع</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: 'instapay', title: 'InstaPay • إنستاباي', desc: 'تحويل لحظي فوري (Instant Transfer)', icon: 'bolt' },
              { id: 'card', title: 'Credit / Debit Card • كارت بنكي', desc: 'Visa, Mastercard, Meeza (ميزة)', icon: 'credit_card' },
              { id: 'vodafone', title: 'E-Wallets • محافظ إلكترونية', desc: 'Vodafone Cash, Orange, Etisalat', icon: 'account_balance_wallet' },
              { id: 'cod', title: 'Cash on Delivery (COD) • كاش', desc: 'الدفع نقداً مع مندوب الشحن', icon: 'handshake' }
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
              <span>Subtotal • المجموع:</span>
              <span className="text-on-surface font-semibold">{subtotal.toLocaleString()} EGP</span>
            </div>
            {discountFromPoints > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Points Discount • خصم النقاط:</span>
                <span className="font-semibold">-{discountFromPoints} EGP</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Consolidated Shipping • الشحن الموحد:</span>
              <span className="text-on-surface font-semibold">{shippingTotal} EGP</span>
            </div>
            <div className="flex justify-between text-sm pt-1.5 text-on-surface font-bold">
              <span>Total to Pay • الإجمالي للدفع:</span>
              <span className="font-serif text-lg text-secondary font-bold">{grandTotal.toLocaleString()} EGP</span>
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
                <span>Processing Order • جاري معالجة الطلب...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[17px]">verified</span>
                <span>Confirm Order • تأكيد الطلب ({grandTotal.toLocaleString()} EGP)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
