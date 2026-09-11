import React from 'react';
import { useApp } from '../context/AppContext';

export default function UnifiedCart() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountFromPoints,
    shippingTotal,
    grandTotal,
    rewardPoints,
    pointsRedeemed,
    setPointsRedeemed,
    setActiveTab
  } = useApp();

  const groupedByMerchant = cartItems.reduce((acc, item) => {
    if (!acc[item.merchant]) {
      acc[item.merchant] = [];
    }
    acc[item.merchant].push(item);
    return acc;
  }, {});

  if (cartItems.length === 0) {
    return (
      <div className="w-full flex-1 max-w-3xl mx-auto px-4 py-16 text-center text-on-surface">
        <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
        </div>
        <h2 className="font-serif text-xl font-bold mb-1">Your Cart is Empty • الـ Cart فاضية</h2>
        <p className="text-xs text-on-surface-variant mb-5">
          استكشفي أحدث إطلالات الـ Linen والموضة المصرية وضيفي قطعك المفضلة
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm"
        >
          Explore Shop • تصفحي المعروضات
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      {/* Cart Hero Meta Ribbon */}
      <div className="py-2 flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-xl md:text-2xl font-bold text-on-surface">Unified Cart • السلة الموحدة</h1>
            <span className="text-xs text-on-surface-variant font-medium">({cartItems.length} Items)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-[11px] tracking-wide font-medium">Independent Egyptian Brands</span>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant">
          تم تجميع اختياراتك من البراندات المصرية في شحن موحد (Consolidated Shipping).
        </p>
      </div>

      {/* Consolidated Logistics Banner */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-3.5 mb-6 border border-surface-container-high shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xs font-bold text-on-surface">Consolidated Shipping • شحن موحد لكل الأوردر</span>
            <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
              هنجمع كل القطع من الأتيليهات والبراندات ونوصلهالك في شحنة واحدة بسرعة وأقل تكلفة شحن.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {Object.entries(groupedByMerchant).map(([merchantName, items]) => (
            <div
              key={merchantName}
              className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm"
            >
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-surface-container-high">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">storefront</span>
                  <span className="text-xs font-bold text-on-surface">{merchantName}</span>
                </div>
                <span className="text-[10px] text-secondary font-medium">Direct from Atelier • شحن مباشر من الأتيليه</span>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-18 rounded-lg object-cover bg-surface-container-low border border-surface-container-high shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-on-surface truncate">{item.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-on-surface-variant mt-0.5">
                        <span>Size: <b className="text-on-surface">{item.size}</b></span>
                        <span>•</span>
                        <span>Color: <b className="text-on-surface">{item.color}</b></span>
                      </div>
                      <div className="font-serif text-xs font-bold text-on-surface mt-1">
                        {item.price.toLocaleString()} EGP
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-on-surface-variant hover:text-secondary p-0.5 transition-colors"
                        title="Delete • حذف"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>

                      <div className="flex items-center gap-1.5 bg-surface-container-low px-2 py-0.5 rounded-lg border border-surface-container-high">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-4 h-4 flex items-center justify-center text-xs text-on-surface"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-3 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-4 h-4 flex items-center justify-center text-xs text-on-surface"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Points Redemption Card */}
          <div className="rounded-xl bg-surface-container-low border border-surface-container-high p-4">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">stars</span>
                <span className="text-xs font-bold text-on-surface">Redeem Points • استبدال نقاط الولاء</span>
              </div>
              <span className="text-xs font-bold text-secondary">
                Balance: {rewardPoints.toLocaleString()} Points
              </span>
            </div>

            <p className="text-[11px] text-on-surface-variant mb-3">
              كل 10 Points = 1 EGP خصم فوري على الـ Cart
            </p>

            <div className="space-y-1.5">
              <input
                type="range"
                min="0"
                max={Math.min(rewardPoints, 2000)}
                step="100"
                value={pointsRedeemed}
                onChange={(e) => setPointsRedeemed(Number(e.target.value))}
                className="w-full accent-secondary cursor-pointer"
              />
              <div className="flex justify-between text-[11px]">
                <span className="text-on-surface-variant">النقاط المستخدمة: {pointsRedeemed} Points</span>
                <span className="text-secondary font-bold">خصم: -{discountFromPoints} EGP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
            <h3 className="font-serif text-sm font-bold text-on-surface mb-3 pb-2 border-b border-surface-container-high">
              Order Summary • ملخص الطلب
            </h3>

            <div className="space-y-2 text-xs mb-3">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal • المجموع</span>
                <span className="text-on-surface font-semibold">{subtotal.toLocaleString()} EGP</span>
              </div>
              {discountFromPoints > 0 && (
                <div className="flex justify-between text-secondary font-semibold">
                  <span>Points Discount • خصم النقاط</span>
                  <span>-{discountFromPoints} EGP</span>
                </div>
              )}
              <div className="flex justify-between text-on-surface-variant">
                <span>Shipping • الشحن الموحد</span>
                <span className="text-on-surface font-semibold">{shippingTotal} EGP</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-surface-container-high flex justify-between items-baseline mb-4">
              <span className="text-xs font-bold text-on-surface">Total • الإجمالي النهائي</span>
              <span className="font-serif text-xl font-bold text-on-surface">{grandTotal.toLocaleString()} EGP</span>
            </div>

            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-secondary transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <span>Proceed to Checkout • متابعة الدفع</span>
              <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
            </button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-on-surface-variant mt-3">
              <span className="material-symbols-outlined text-[13px] text-secondary">lock</span>
              <span>100% Secure Checkout • دفع آمن ومحمي</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
