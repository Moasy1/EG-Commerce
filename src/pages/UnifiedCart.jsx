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

  // Group cart items by merchant
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
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
          <span className="material-symbols-outlined text-[36px]">shopping_bag</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">حقيبة التسوق فارغة</h2>
        <p className="text-sm text-on-surface-variant mb-6">
          استكشف أحدث الأزياء والريلز وأضف قطعك المفضلة إلى السلة الموحدة
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-lg"
        >
          تصفح المنتجات الآن
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 text-on-surface">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">السلة الموحدة</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            منتجات من متاجر متعددة تدفع ثمنها في طلب واحد
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-surface-container text-xs font-bold text-primary border border-surface-variant/40">
          {cartItems.length} منتجات
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items List by Merchant */}
        <div className="lg:col-span-2 space-y-6">
          {Object.entries(groupedByMerchant).map(([merchantName, items]) => (
            <div
              key={merchantName}
              className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-4 sm:p-5 shadow-sm"
            >
              {/* Merchant Section Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-surface-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">storefront</span>
                  <span className="text-sm font-bold text-white">{merchantName}</span>
                </div>
                <span className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                  شحن مباشر من المتجر
                </span>
              </div>

              {/* Items for this merchant */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 sm:gap-4 items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-20 rounded-xl object-cover bg-surface-container border border-surface-variant/40 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1">
                        <span>المقاس: <b className="text-white">{item.size}</b></span>
                        <span>•</span>
                        <span>اللون: <b className="text-white">{item.color}</b></span>
                      </div>
                      <div className="text-sm font-bold text-white mt-1">
                        {item.price} ج.م
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-on-surface-variant hover:text-red-400 p-1 transition-colors"
                        title="حذف من السلة"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>

                      <div className="flex items-center gap-2 bg-surface-container px-2 py-1 rounded-lg border border-surface-variant/40">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-on-surface hover:text-white"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center rounded text-on-surface hover:text-white"
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

          {/* Interactive Rewards Points Slider Card */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-surface-container-low to-surface-container-low border border-amber-500/30 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">stars</span>
                <span className="text-sm font-bold text-white">استبدال نقاط المكافآت</span>
              </div>
              <span className="text-xs font-bold text-secondary">
                رصيدك: {rewardPoints.toLocaleString()} نقطة
              </span>
            </div>

            <p className="text-xs text-on-surface-variant mb-4">
              يمكنك استخدام نقاطك للحصول على خصم فوري (كل 10 نقاط = 1 جنيه مصري)
            </p>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max={Math.min(rewardPoints, 2000)}
                step="100"
                value={pointsRedeemed}
                onChange={(e) => setPointsRedeemed(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface-variant">النقاط المستبدلة: {pointsRedeemed} نقطة</span>
                <span className="text-secondary font-bold">وفرت: {discountFromPoints} ج.م خصم</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl bg-surface-container-low border border-surface-variant/40 p-5 shadow-xl">
            <h3 className="text-base font-black text-white mb-4 pb-2 border-b border-surface-variant/30">
              ملخص الطلب
            </h3>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between text-on-surface-variant">
                <span>المجموع الفرعي</span>
                <span className="text-white font-bold">{subtotal} ج.م</span>
              </div>
              {discountFromPoints > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>خصم النقاط</span>
                  <span className="font-bold">-{discountFromPoints} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-on-surface-variant">
                <span>الشحن الموحد لجميع المتاجر</span>
                <span className="text-white font-bold">{shippingTotal} ج.م</span>
              </div>
            </div>

            <div className="pt-3 border-t border-surface-variant/40 flex justify-between items-baseline mb-6">
              <span className="text-base font-bold text-white">الإجمالي النهائي</span>
              <span className="text-2xl font-black text-white">{grandTotal} ج.م</span>
            </div>

            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>متابعة إتمام الشراء</span>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-on-surface-variant mt-4">
              <span className="material-symbols-outlined text-[15px] text-tertiary">lock</span>
              <span>دفع آمن 100% ومشفر ومضمون</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
