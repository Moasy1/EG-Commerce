import React from 'react';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { OrderService } from '../services/OrderService';
import InvoiceModal from '../components/common/InvoiceModal';

export default function OrderTracking() {
  const { setActiveTab, user } = useApp();
  const [orders, setOrders] = useState([]);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      const allOrders = await OrderService.getOrders();
      const lastOrderId = typeof window !== 'undefined' ? sessionStorage.getItem('eg_last_order_id') : null;

      if (lastOrderId) {
        const found = allOrders.find(o => o.id === lastOrderId);
        if (found) {
          setOrders([found, ...allOrders.filter(o => o.id !== lastOrderId)]);
          return;
        }
      }

      if (user?.id) {
        const userOrders = allOrders.filter(o => o.userId === user.id);
        setOrders(userOrders.length > 0 ? userOrders : allOrders);
      } else {
        setOrders(allOrders);
      }
    };
    loadOrders();
  }, [user]);

  const latestOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div className="w-full flex-1 max-w-3xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      {/* Top Banner Confirmation */}
      <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high p-5 mb-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-xs font-semibold mb-1.5">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>{latestOrder?.shippingStatus === 'ready_for_pickup' ? 'جاري تجهيز الشحنة لدى المتجر ⏳' : latestOrder?.shippingStatus === 'in_transit' ? 'الشحنة مع مندوب بوسطة 🚚' : 'تم استلام الأوردر وتأكيده بنجاح! 🎉'}</span>
          </div>
          <h1 className="font-serif text-lg md:text-xl font-bold text-on-surface">
            تتبع الشحنة #{latestOrder ? latestOrder.id : 'EG-8841'} • {latestOrder?.merchantName || 'Talieska Studio'}
          </h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            المتجر بدأ تجهيز طلبك دلوقتي في مسار شحن بوسطة السريع (Bosta Express)
          </p>
        </div>

        {/* Pickup OTP & Tracking Number */}
        <div className="bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container-high text-center shrink-0">
          <span className="text-[10px] text-on-surface-variant font-medium block">Bosta Tracking • رقم التتبع</span>
          <span className="font-mono text-xs font-bold text-secondary tracking-wider block">
            {latestOrder?.trackingNumber || 'BST-77391024'}
          </span>
          <span className="text-[10px] text-gray-500 font-mono mt-1 block">
            OTP: <strong className="text-slate-800 font-bold">5829</strong>
          </span>
        </div>
      </div>

      {/* Official Tax Invoice & Waybill Quick Access */}
      {latestOrder && (
        <div className="mb-6">
          <button
            onClick={() => setActiveInvoiceOrder(latestOrder)}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-black hover:to-slate-900 text-white font-bold text-xs flex items-center justify-between shadow-md transition-all active:scale-98 border border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#d00000] text-white flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              </div>
              <div className="text-right">
                <span className="block text-xs sm:text-sm font-bold">الفاتورة الضريبية الرسمية وبوليصة الشحن (ETA Invoice)</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  فاتورة إلكترونية معتمدة برقم ${latestOrder?.id || ''} مع كود التحقق ومصاريف شحن بوسطة
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-red-400 font-bold bg-white/10 px-3 py-1.5 rounded-xl">
              <span>عرض / طباعة</span>
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </div>
          </button>
        </div>
      )}

      {/* Stepper Progress */}
      <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-5 mb-6 shadow-sm">
        <h2 className="text-xs font-bold text-on-surface mb-5">Order Tracking Status • حالة الشحنة</h2>

        <div className="relative flex justify-between items-center max-w-lg mx-auto">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-surface-container-highest z-0" />
          <div className="absolute top-1/2 right-4 w-1/2 -translate-y-1/2 h-0.5 bg-secondary z-0" />

          {[
            { label: 'تم التأكيد', icon: 'receipt_long', active: true },
            { label: 'قيد التجهيز', icon: 'inventory_2', active: true },
            { label: 'مع المندوب', icon: 'local_shipping', active: latestOrder?.shippingStatus === 'in_transit' || latestOrder?.shippingStatus === 'delivered', current: latestOrder?.shippingStatus === 'in_transit' },
            { label: 'تم التسليم', icon: 'home', active: latestOrder?.shippingStatus === 'delivered', current: latestOrder?.shippingStatus === 'delivered' },
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

        {orders.slice(0, 3).map((ord, idx) => (
          <div key={ord.id || idx} className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container-high">
              <div>
                <span className="text-[11px] font-semibold text-secondary font-mono">طرد {idx + 1} • {ord.id}</span>
                <h4 className="text-xs font-bold text-on-surface">{ord.merchantName || 'متجر مصري معتمد'}</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveInvoiceOrder(ord)}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-[10px] flex items-center gap-1 transition-colors"
                  title="معاينة الفاتورة"
                >
                  <span className="material-symbols-outlined text-[13px] text-[#d00000]">receipt_long</span>
                  <span>الفاتورة</span>
                </button>
                <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  {ord.shippingStatus === 'in_transit' ? 'مع المندوب' : ord.shippingStatus === 'delivered' ? 'مكتمل التسليم' : 'جاري التجهيز'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-on-surface-variant">
              <span className="font-semibold text-on-surface">{ord.productTitle}</span>
              <span className="font-bold text-primary font-mono">{ord.amount?.toLocaleString() || ord.total_amount || 0} ج.م</span>
            </div>
            <div className="mt-2 text-[11px] text-gray-500 flex items-center justify-between">
              <span>طريقة الدفع: {ord.paymentMethod || 'InstaPay'}</span>
              <span className="font-mono text-[10px]">بواسطة: {ord.courier || 'Bosta Express'}</span>
            </div>
          </div>
        ))}
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

      {/* Official Tax Invoice & Waybill Modal */}
      <InvoiceModal
        isOpen={!!activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
        order={activeInvoiceOrder}
      />
    </div>
  );
}
