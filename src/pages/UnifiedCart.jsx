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
        <h2 className="font-serif text-xl font-bold mb-1">حقيبة التسوق فارغة</h2>
        <p className="text-xs text-on-surface-variant mb-5">
          استكشفي أحدث إطلالات الكتان والموضة وأضيفي قطعك المفضلة
        </p>
        <button
          onClick={() => setActiveTab('shop')}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-sm"
        >
          تصفحي المعروضات
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      {/* Cart Hero Meta Ribbon matching 04_unified_cart_ar */}
      <div className="py-2 flex flex-col gap-1 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-xl md:text-2xl font-bold text-on-surface">سلة التسوق الموحدة</h1>
            <span className="text-xs text-on-surface-variant font-medium">({cartItems.length} قطع)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-[11px] tracking-wide font-medium">متاجر مصرية مستقلة</span>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant">
          تم تجميع اختياراتك من دور الأزياء المستقلة في مسار شحن موحد ومستدام.
        </p>
      </div>

      {/* Consolidated Logistics Banner matching 04_unified_cart_ar */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low p-3.5 mb-6 border border-surface-container-high shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xs font-bold text-on-surface">شحن موحد لجميع الطرود</span>
            <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
              سيتم تنسيق استلام القطع من المتاجر وتوصيلها إلى عنوانك بمسار موحد لضمان سرعة الوصول.
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
                <span className="text-[10px] text-secondary font-medium">شحن مباشر من الأتيليه</span>
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
                        <span>المقاس: <b className="text-on-surface">{item.size}</b></span>
                        <span>•</span>
                        <span>اللون: <b className="text-on-surface">{item.color}</b></span>
                      </div>
                      <div className="font-serif text-xs font-bold text-on-surface mt-1">
                        {item.price.toLocaleString()} ج.م
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-on-surface-variant hover:text-secondary p-0.5 transition-colors"
                        title="حذف"
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
                <span className="text-xs font-bold text-on-surface">استبدال نقاط الولاء</span>
              </div>
              <span className="text-xs font-bold text-secondary">
                رصيدك: {rewardPoints.toLocaleString()} نقطة
              </span>
            </div>

            <p className="text-[11px] text-on-surface-variant mb-3">
              كل 10 نقاط = 1 جنيه مصري خصم فوري على سلتك
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
                <span className="text-on-surface-variant">النقاط المستخدمة: {pointsRedeemed}</span>
                <span className="text-secondary font-bold">خصم: -{discountFromPoints} ج.م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
            <h3 className="font-serif text-sm font-bold text-on-surface mb-3 pb-2 border-b border-surface-container-high">
              ملخص الطلب
            </h3>

            <div className="space-y-2 text-xs mb-3">
              <div className="flex justify-between text-on-surface-variant">
                <span>مجموع المنتجات</span>
                <span className="text-on-surface font-semibold">{subtotal.toLocaleString()} ج.م</span>
              </div>
              {discountFromPoints > 0 && (
                <div className="flex justify-between text-secondary font-semibold">
                  <span>خصم النقاط</span>
                  <span>-{discountFromPoints} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-on-surface-variant">
                <span>تكلفة الشحن الموحد</span>
                <span className="text-on-surface font-semibold">{shippingTotal} ج.م</span>
              </div>
            </div>

            <div className="pt-2.5 border-t border-surface-container-high flex justify-between items-baseline mb-4">
              <span className="text-xs font-bold text-on-surface">الإجمالي النهائي</span>
              <span className="font-serif text-xl font-bold text-on-surface">{grandTotal.toLocaleString()} ج.م</span>
            </div>

            <button
              onClick={() => setActiveTab('checkout')}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-secondary transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
            >
              <span>متابعة إتمام الشراء</span>
              <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
            </button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-on-surface-variant mt-3">
              <span className="material-symbols-outlined text-[13px] text-secondary">lock</span>
              <span>دفع آمن ومحمي بالكامل</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
