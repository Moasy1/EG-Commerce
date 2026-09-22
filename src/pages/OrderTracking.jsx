import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { OrderService } from '../services/OrderService';
import InvoiceModal from '../components/common/InvoiceModal';

export default function OrderTracking() {
  const { setActiveTab, user, isAr = true } = useApp();
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load orders on mount or user change
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const allOrders = await OrderService.getOrders();
        const lastOrderId = typeof window !== 'undefined' ? sessionStorage.getItem('eg_last_order_id') : null;

        let resolvedOrders = allOrders;

        if (user?.id) {
          const userOrders = allOrders.filter(o => o.userId === user.id);
          if (userOrders.length > 0) {
            resolvedOrders = userOrders;
          }
        }

        // If a lastOrderId was saved in this session (e.g. fresh checkout), place it first
        if (lastOrderId) {
          const found = allOrders.find(o => o.id === lastOrderId);
          if (found) {
            resolvedOrders = [found, ...resolvedOrders.filter(o => o.id !== lastOrderId)];
          }
        }

        setOrders(resolvedOrders);
        if (resolvedOrders.length > 0) {
          setSelectedOrderId(resolvedOrders[0].id);
        }
      } catch (err) {
        console.warn('Error loading orders in OrderTracking:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, [user]);

  // Selected or active order
  const activeOrder = useMemo(() => {
    if (!orders || orders.length === 0) return null;
    if (selectedOrderId) {
      const found = orders.find(o => o.id === selectedOrderId);
      if (found) return found;
    }
    return orders[0];
  }, [orders, selectedOrderId]);

  // Search order handler
  const handleSearchOrder = async (e) => {
    if (e) e.preventDefault();
    setSearchError('');
    const q = searchQuery.trim();
    if (!q) return;

    try {
      const matched = await OrderService.trackOrder(q);
      if (matched) {
        // Add to view if not present
        if (!orders.some(o => o.id === matched.id)) {
          setOrders(prev => [matched, ...prev]);
        }
        setSelectedOrderId(matched.id);
        setSearchQuery('');
      } else {
        setSearchError(isAr ? 'لم يتم العثور على شحنة بهذا الرقم. يرجى التحقق من رقم الطلب أو كود التتبع.' : 'No shipment found with this number. Please check the order ID or waybill code.');
      }
    } catch (err) {
      setSearchError(isAr ? 'حدث خطأ أثناء البحث. يرجى المحاولة لاحقاً.' : 'Search error. Please try again.');
    }
  };

  // Copy tracking number
  const copyTrackingNumber = (trk) => {
    if (!trk) return;
    navigator.clipboard.writeText(trk);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Calculate delivery milestones & progress
  const trackingData = useMemo(() => {
    if (!activeOrder) return null;

    const status = activeOrder.shippingStatus || 'ready_for_pickup';
    const createdAt = new Date(activeOrder.createdAt || Date.now());

    let activeStepIndex = 1;
    let progressPercent = 35;
    let statusBadgeText = isAr ? 'قيد التجهيز والتغليف لدى المتجر ⏳' : 'Order Being Prepared by Merchant ⏳';
    let statusColor = 'text-amber-700 bg-amber-50 border-amber-200';

    if (status === 'pending' || status === 'confirmed') {
      activeStepIndex = 0;
      progressPercent = 12;
      statusBadgeText = isAr ? 'تم استلام وتأكيد الطلب 🛍️' : 'Order Received & Confirmed 🛍️';
      statusColor = 'text-blue-700 bg-blue-50 border-blue-200';
    } else if (status === 'ready_for_pickup' || status === 'processing') {
      activeStepIndex = 1;
      progressPercent = 38;
      statusBadgeText = isAr ? 'قيد التجهيز والتغليف لدى المتجر ⏳' : 'Order Being Prepared ⏳';
      statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
    } else if (status === 'in_transit' || status === 'out_for_delivery') {
      activeStepIndex = 2;
      progressPercent = 75;
      statusBadgeText = isAr ? 'الشحنة مع مندوب بوسطة في الطريق لعنوانك 🚚' : 'Out for Delivery with Bosta 🚚';
      statusColor = 'text-purple-700 bg-purple-50 border-purple-200';
    } else if (status === 'delivered' || status === 'completed') {
      activeStepIndex = 3;
      progressPercent = 100;
      statusBadgeText = isAr ? 'تم تسليم الشحنة بنجاح واستلام الطلب 🎉' : 'Delivered Successfully 🎉';
      statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (status === 'cancelled' || status === 'returned') {
      activeStepIndex = 1;
      progressPercent = 100;
      statusBadgeText = isAr ? 'تم إلغاء / إرجاع الشحنة ⚠️' : 'Shipment Cancelled / Returned ⚠️';
      statusColor = 'text-red-700 bg-red-50 border-red-200';
    }

    const formatDate = (dateObj, minutesOffset = 0) => {
      const d = new Date(dateObj.getTime() + minutesOffset * 60000);
      return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const steps = [
      {
        key: 'confirmed',
        label: isAr ? 'تم التأكيد' : 'Confirmed',
        desc: isAr ? 'تم تأكيد الطلب والدفع' : 'Payment & order verified',
        icon: 'receipt_long',
        date: formatDate(createdAt, 0),
        active: activeStepIndex >= 0,
        current: activeStepIndex === 0
      },
      {
        key: 'processing',
        label: isAr ? 'قيد التجهيز' : 'Processing',
        desc: isAr ? `مستودع ${activeOrder.merchantName || 'المتجر'}` : 'Warehouse packaging',
        icon: 'inventory_2',
        date: formatDate(createdAt, 25),
        active: activeStepIndex >= 1,
        current: activeStepIndex === 1
      },
      {
        key: 'in_transit',
        label: isAr ? 'مع المندوب' : 'Out for Delivery',
        desc: isAr ? 'مندوب بوسطة إكسبريس' : 'Bosta Courier in transit',
        icon: 'local_shipping',
        date: formatDate(createdAt, 180),
        active: activeStepIndex >= 2,
        current: activeStepIndex === 2
      },
      {
        key: 'delivered',
        label: isAr ? 'تم التسليم' : 'Delivered',
        desc: isAr ? 'تم الاستلام بنجاح' : 'Order handed over',
        icon: 'check_circle',
        date: formatDate(createdAt, 1440),
        active: activeStepIndex >= 3,
        current: activeStepIndex === 3
      }
    ];

    // Estimated points earned (5% of order amount)
    const pointsEarned = Math.max(35, Math.round((activeOrder.amount || 500) * 0.05));

    return {
      activeStepIndex,
      progressPercent,
      statusBadgeText,
      statusColor,
      steps,
      pointsEarned,
      orderDate: formatDate(createdAt, 0)
    };
  }, [activeOrder, isAr]);

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-5 pb-28 md:pb-16 text-slate-900 text-right font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header & Back Action */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {isAr ? 'تتبع الشحنات والطلبات' : 'Order & Shipment Tracking'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isAr ? 'متابعة حية ومباشرة لحركة طرودك عبر شبكة شحن بوسطة السريعة' : 'Real-time live tracking of your parcels via Bosta Express courier'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('shop')}
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span className="material-symbols-outlined text-[17px] rtl:rotate-180">arrow_forward</span>
          <span>{isAr ? 'المتجر' : 'Marketplace'}</span>
        </button>
      </div>

      {/* Live Tracking Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs mb-6">
        <form onSubmit={handleSearchOrder} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <span className="material-symbols-outlined text-gray-400 absolute start-3.5 top-1/2 -translate-y-1/2 text-[19px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث برقم الطلب (EG-xxxx) أو رقم بوليصة بوسطة (BST-xxxx)...' : 'Search by Order ID (EG-xxxx) or Bosta Waybill (BST-xxxx)...'}
              className="w-full ps-10 pe-4 py-2.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#d00000] focus:ring-1 focus:ring-[#d00000] transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">radar</span>
            <span>{isAr ? 'تتبع الشحنة' : 'Track Package'}</span>
          </button>
        </form>
        {searchError && (
          <p className="text-xs text-red-600 font-medium mt-2.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{searchError}</span>
          </p>
        )}
      </div>

      {/* Orders Switcher Strip (if multiple orders exist) */}
      {orders.length > 1 && (
        <div className="mb-6">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            {isAr ? 'طلباتك النشطة' : 'Your Active Orders'} ({orders.length})
          </span>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {orders.map((ord) => {
              const isSelected = ord.id === activeOrder?.id;
              return (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-red-50 text-[#d00000] border-red-200 shadow-xs ring-1 ring-red-200'
                      : 'bg-white text-slate-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">package_2</span>
                  <span>#{ord.id}</span>
                  <span className="text-[11px] text-gray-400 font-normal">• {ord.merchantName || 'المتجر'}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State when no orders exist */}
      {!isLoading && !activeOrder && (
        <div className="p-12 rounded-3xl bg-white border border-gray-200 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#d00000] flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">local_shipping</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1.5">
            {isAr ? 'لا توجد شحنات نشطة حالياً' : 'No Active Shipments Found'}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed mb-6">
            {isAr 
              ? 'لم تقم بإتمام طلبات بعد. إذا كنت قد أتممت طلباً كزائر، يمكنك كتابة رقم الطلب أو رقم بوليصة بوسطة في صندوق البحث أعلاه لتتبع شحنتك فوراً.'
              : 'You have no active shipments. If you placed an order as guest, enter your order number or Bosta waybill in the search box above to track.'}
          </p>
          <button
            onClick={() => setActiveTab('shop')}
            className="px-6 py-3 rounded-full bg-[#d00000] hover:bg-[#b00000] text-white text-xs font-bold transition-all shadow-md shadow-red-500/20 active:scale-95 flex items-center gap-2 mx-auto"
          >
            <span className="material-symbols-outlined text-[18px]">explore</span>
            <span>{isAr ? 'تصفح المتاجر والريلز' : 'Explore Collections'}</span>
          </button>
        </div>
      )}

      {/* Active Order Details */}
      {activeOrder && trackingData && (
        <div className="space-y-6">
          {/* Main Status & Tracking Bar */}
          <div className="p-5 md:p-6 rounded-3xl bg-white border border-gray-200/90 shadow-sm relative overflow-hidden">
            {/* Top Bar Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-gray-100">
              <div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border mb-2 ${trackingData.statusColor}`}>
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  <span>{trackingData.statusBadgeText}</span>
                </div>
                <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
                  <span>طلب #{activeOrder.id}</span>
                  <span className="text-sm font-semibold text-gray-400">({activeOrder.merchantName || 'متجر معتمد'})</span>
                </h2>
                <span className="text-[11px] text-gray-500 block mt-0.5">
                  {isAr ? 'تاريخ الطلب:' : 'Order Date:'} {trackingData.orderDate}
                </span>
              </div>

              {/* Dynamic Delivery OTP & Bosta Waybill */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-gray-100">
                <div className="text-start sm:text-end">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                    Bosta Tracking • بوليصة الشحن
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono text-sm font-black text-slate-900 tracking-wider">
                      {activeOrder.trackingNumber}
                    </span>
                    <button
                      onClick={() => copyTrackingNumber(activeOrder.trackingNumber)}
                      className="p-1 rounded-md hover:bg-gray-200 text-gray-500 hover:text-slate-900 transition-colors"
                      title={isAr ? 'نسخ رقم التتبع' : 'Copy Waybill'}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {copiedTracking ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Delivery OTP */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span className="text-[11px] font-bold">
                    {isAr ? 'رمز أمان الاستلام (OTP):' : 'Delivery OTP:'}{' '}
                    <strong className="font-mono font-black text-sm tracking-wider text-emerald-950">
                      {activeOrder.deliveryOtp || '4921'}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Live Progress Stepper */}
            <div className="pt-6 pb-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                {isAr ? 'مسار الشحن اللحظي • Live Progress' : 'Live Shipment Milestones'}
              </h3>

              <div className="relative">
                {/* Connecting Track Background */}
                <div className="absolute top-5 start-6 end-6 h-1 bg-gray-100 rounded-full z-0" />
                
                {/* Active Connecting Fill */}
                <div 
                  className="absolute top-5 start-6 h-1 bg-[#d00000] rounded-full z-0 transition-all duration-700 ease-out" 
                  style={{ width: `${Math.min(100, Math.max(10, trackingData.progressPercent))}%` }}
                />

                {/* Stepper Nodes */}
                <div className="relative z-10 flex justify-between items-start">
                  {trackingData.steps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center max-w-[90px] sm:max-w-[120px]">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shadow-xs ${
                        step.active
                          ? step.current
                            ? 'bg-[#d00000] text-white ring-4 ring-red-100 scale-110'
                            : 'bg-slate-900 text-white'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}>
                        <span className="material-symbols-outlined text-[19px]">{step.icon}</span>
                      </div>
                      <span className={`text-[11px] font-bold mt-2 leading-tight ${step.active ? 'text-slate-900' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">
                        {step.desc}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono mt-1">
                        {step.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Official Tax Invoice & Waybill Card */}
          <button
            onClick={() => setActiveInvoiceOrder(activeOrder)}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-black hover:to-slate-900 text-white flex items-center justify-between shadow-md transition-all active:scale-98 border border-slate-700 text-start"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#d00000] text-white flex items-center justify-center shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[22px]">receipt_long</span>
              </div>
              <div>
                <span className="block text-xs sm:text-sm font-bold">
                  {isAr ? 'الفاتورة الضريبية الرسمية وبوليصة الشحن (ETA Tax Invoice)' : 'Official Tax Invoice & Bosta Waybill'}
                </span>
                <span className="block text-[11px] text-slate-400 mt-0.5">
                  {isAr 
                    ? `فاتورة إلكترونية معتمدة للطلب #${activeOrder.id} برمز QR وكود التحقق`
                    : `Verified digital tax invoice for order #${activeOrder.id} with QR code`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-red-300 font-bold bg-white/10 px-3 py-1.5 rounded-xl shrink-0">
              <span>{isAr ? 'معاينة / طباعة' : 'View / Print'}</span>
              <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
            </div>
          </button>

          {/* Package Details & Products */}
          <div className="p-5 md:p-6 rounded-3xl bg-white border border-gray-200/90 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-[#d00000]">inventory_2</span>
              <span>{isAr ? 'محتويات الطرد والمنتجات' : 'Package Contents'}</span>
            </h3>

            <div className="divide-y divide-gray-100">
              {activeOrder.items && activeOrder.items.length > 0 ? (
                activeOrder.items.map((it, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-100 shrink-0">
                        <img
                          src={it.image || '/images/products/the_sharp_v_yellow_1.webp'}
                          alt={it.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {it.title || activeOrder.productTitle}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                          <span>{isAr ? 'الكمية:' : 'Qty:'} <strong className="text-slate-800 font-bold">{it.quantity || 1}</strong></span>
                          <span>•</span>
                          <span>{isAr ? 'المقاس:' : 'Size:'} <strong className="text-slate-800 font-bold">{it.size || 'M'}</strong></span>
                          {it.color && it.color !== 'Default' && (
                            <>
                              <span>•</span>
                              <span>{it.color}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-end shrink-0">
                      <span className="font-mono text-sm font-black text-slate-900 block">
                        {Number(it.price || activeOrder.amount || 0).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-3.5 flex items-center justify-between gap-4">
                  <span className="text-xs font-bold text-slate-800">{activeOrder.productTitle}</span>
                  <span className="font-mono text-sm font-black text-slate-900">
                    {Number(activeOrder.amount || 0).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recipient & Shipping Address */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-[#d00000]">location_on</span>
                <span>{isAr ? 'عنوان وبيانات التوصيل' : 'Delivery Address'}</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700">
                <p className="font-bold text-slate-900 text-sm">{activeOrder.customerName || 'عميل تجارة مصرية'}</p>
                <p className="font-mono text-gray-600">{activeOrder.phone || 'غير مسجل'}</p>
                <p className="text-gray-600 leading-relaxed">{activeOrder.address || 'القاهرة، جمهورية مصر العربية'}</p>
                <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <span>{isAr ? 'شركة الشحن:' : 'Courier:'} <strong className="text-slate-800 font-semibold">{activeOrder.courier || 'Bosta Express'}</strong></span>
                  <span>{isAr ? 'المدة المقدرة:' : 'ETA:'} <strong className="text-slate-800 font-semibold">24-48 ساعة</strong></span>
                </div>
              </div>
            </div>

            {/* Payment & Order Summary */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[17px] text-[#d00000]">payments</span>
                  <span>{isAr ? 'تفاصيل الدفع والحساب' : 'Payment Summary'}</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span className="font-mono font-bold text-slate-800">{Number(activeOrder.subtotal || activeOrder.amount || 0).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{isAr ? 'مصاريف شحن بوسطة:' : 'Bosta Shipping:'}</span>
                    <span className="font-mono font-bold text-slate-800">{Number(activeOrder.shipping || 60).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                  {activeOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>{isAr ? 'خصم النقاط/الكوبون:' : 'Discount:'}</span>
                      <span className="font-mono">-{Number(activeOrder.discount).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-sm font-black text-slate-900">
                    <span>{isAr ? 'الإجمالي:' : 'Total:'}</span>
                    <span className="font-mono text-base text-[#d00000]">{Number(activeOrder.amount || 0).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">{isAr ? 'طريقة الدفع:' : 'Method:'}</span>
                <span className="font-bold text-slate-800">{activeOrder.paymentMethod || 'InstaPay'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setActiveTab('rewards')}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center gap-2 border border-amber-200 transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px] text-amber-600">stars</span>
              <span>{isAr ? `نقاطك المكتسبة من هذا الطلب (+${trackingData.pointsEarned} نقطة ولاء)` : `Points Earned (+${trackingData.pointsEarned} Points)`}</span>
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#d00000] hover:bg-[#b00000] text-white font-bold text-xs transition-all shadow-md shadow-red-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
              <span>{isAr ? 'متابعة التسوق واستكشاف البراندات' : 'Continue Shopping'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Official Tax Invoice & Waybill Modal */}
      <InvoiceModal
        isOpen={!!activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
        order={activeInvoiceOrder}
      />
    </div>
  );
}
