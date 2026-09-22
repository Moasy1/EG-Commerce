import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { OrderService } from '../services/OrderService';
import { NotificationService } from '../services/NotificationService';

export default function Checkout() {
  const { cartItems, grandTotal, discountFromPoints, shippingTotal, subtotal, setActiveTab, setOrders, user, clearCart } = useApp();
  const [paymentMethod, setPaymentMethod] = useState('instapay');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Dynamically group stores and packages from actual cart items
  const storesInCart = useMemo(() => {
    const map = new Map();
    (cartItems || []).forEach(item => {
      const storeId = item.merchantId || item.merchant_id || item.storeSlug || 'store-general';
      const storeName = item.merchant || item.merchantName || item.brand || 'متجر معتمد';
      const storeLogo = item.merchantLogo || item.brandLogo || item.image || null;
      if (!map.has(storeId)) {
        map.set(storeId, { id: storeId, name: storeName, logo: storeLogo, itemCount: 0, items: [] });
      }
      const entry = map.get(storeId);
      entry.itemCount += (item.quantity || 1);
      entry.items.push(item);
    });
    return Array.from(map.values());
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    setValidationError('');

    if (!cartItems || cartItems.length === 0) {
      setValidationError('سلة المشتريات فارغة. يرجى إضافة منتجات قبل إتمام الطلب.');
      return;
    }

    if (!customerName.trim()) {
      setValidationError('يرجى إدخال اسم المستلم ثلاثي.');
      return;
    }

    if (!phone.trim()) {
      setValidationError('يرجى إدخال رقم الهاتف للتواصل مع مندوب بوسطة.');
      return;
    }

    if (!address.trim()) {
      setValidationError('يرجى إدخال عنوان التوصيل بالتفصيل (المحافظة والمنطقة والشارع).');
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment verification delay
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
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        paymentMethod
      });
      
      const newOrders = Array.isArray(created) ? created : [created];
      
      // Update local orders list conceptually across platform and merchant dashboard
      setOrders(prev => [...newOrders, ...prev]);

      // Trigger dynamic notifications for the buyer and each merchant
      newOrders.forEach(order => {
        NotificationService.createOrderNotification(order);
      });
      
      // Clear dynamic cart now that order has been placed
      if (clearCart) {
        await clearCart();
      }

      setIsProcessing(false);
      setActiveTab('tracking');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert('تعذر إتمام الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="w-full flex-1 max-w-3xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right" dir="rtl">
      <button
        onClick={() => setActiveTab('cart')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant hover:text-primary mb-4 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        <span>العودة للسلة (Cart)</span>
      </button>

      <h1 className="font-serif text-xl md:text-2xl font-bold text-on-surface mb-1">إتمام الشراء والدفع • Secure Checkout</h1>
      <p className="text-xs text-on-surface-variant mb-6">
        أوردر موحد يتم شحنه مباشرة من أرقى البراندات المصرية لعنوانك عبر بوسطة
      </p>

      {validationError && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold flex items-center gap-2 animate-shake">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{validationError}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Shipping Address & Recipient Info */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
            <h2 className="text-xs font-bold text-on-surface">بيانات المستلم وعنوان الشحن • Recipient & Shipping</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[11px] text-gray-500 font-bold mb-1">اسم المستلم (ثلاثي) *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="مثال: أحمد محمود إبراهيم"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 font-bold mb-1">رقم الهاتف (للتواصل مع المندوب) *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010XXXXXXXX أو +20 1X XXX XXXX"
                dir="ltr"
                className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-3 py-2 text-xs text-on-surface text-right focus:outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 font-bold mb-1">عنوان التوصيل بالتفصيل *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="المحافظة، الحي/المنطقة، اسم الشارع، رقم العمارة والشقة"
              className="w-full bg-surface-container-low border border-surface-container-high rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-secondary transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Merchant Deliveries Breakdown */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="material-symbols-outlined text-secondary text-[18px]">local_shipping</span>
            <h2 className="text-xs font-bold text-on-surface">مواعيد وصول الطرود والشحن • Estimated Deliveries</h2>
          </div>

          <div className="space-y-2">
            {storesInCart.length > 0 ? (
              storesInCart.map((store) => (
                <div 
                  key={store.id} 
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low text-xs border border-surface-container-high hover:border-secondary/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {store.logo ? (
                      <img 
                        src={store.logo} 
                        alt={store.name} 
                        className="w-9 h-9 rounded-lg object-cover border border-surface-container-highest shadow-xs" 
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
                        <span className="material-symbols-outlined text-[18px]">storefront</span>
                      </div>
                    )}
                    <div>
                      <span className="font-bold text-on-surface block leading-tight">{store.name}</span>
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        {store.itemCount} {store.itemCount === 1 ? 'منتج' : 'منتجات'}
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] text-secondary font-bold block">التوصيل خلال 24-48 ساعة</span>
                    <span className="text-[10px] text-on-surface-variant">عبر بوسطة إكسبريس (Bosta)</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 rounded-xl bg-surface-container-low text-center text-xs text-on-surface-variant border border-dashed border-surface-container-high space-y-2">
                <span className="material-symbols-outlined text-[26px] text-gray-400 block mx-auto">remove_shopping_cart</span>
                <p>سلة المشتريات فارغة حالياً</p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-4 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:bg-secondary transition-all"
                >
                  تصفح المنتجات في السوق
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="material-symbols-outlined text-secondary text-[18px]">payments</span>
            <h2 className="text-xs font-bold text-on-surface">طريقة الدفع • Payment Method</h2>
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
                type="button"
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
              <span>المجموع الفرعي • Subtotal:</span>
              <span className="text-on-surface font-semibold">{subtotal.toLocaleString()} ج.م</span>
            </div>
            {discountFromPoints > 0 && (
              <div className="flex justify-between text-secondary">
                <span>خصم النقاط • Points Discount:</span>
                <span className="font-semibold">-{discountFromPoints} ج.م</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>الشحن الموحد (بوسطة) • Consolidated Shipping:</span>
              <span className="text-on-surface font-semibold">{shippingTotal} ج.م</span>
            </div>
            <div className="flex justify-between text-sm pt-1.5 text-on-surface font-bold">
              <span>الإجمالي للدفع • Total to Pay:</span>
              <span className="font-serif text-lg text-secondary font-bold">{grandTotal.toLocaleString()} ج.م</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing || !cartItems || cartItems.length === 0}
            className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-secondary transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {isProcessing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري معالجة وتأكيد الطلب...</span>
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
