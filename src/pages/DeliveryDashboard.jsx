import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function DeliveryDashboard() {
  const { isAr, user } = useApp();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('available'); // available, active

  const [availableOrders, setAvailableOrders] = useState([
    { id: 'ORD-8211', merchant: 'Drip Fit', pickup: 'Zamalek, Cairo', dropoff: 'Maadi, Cairo', payout: 45, distance: '12 km', status: 'ready' },
    { id: 'ORD-9932', merchant: 'Theba Jewelry', pickup: 'Heliopolis, Cairo', dropoff: 'New Cairo', payout: 55, distance: '18 km', status: 'ready' }
  ]);
  const [activeOrders, setActiveOrders] = useState([]);

  const acceptOrder = (order) => {
    setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
    setActiveOrders(prev => [...prev, { ...order, status: 'accepted' }]);
    setActiveTab('active');
  };

  const updateOrderStatus = (orderId, newStatus) => {
    if (newStatus === 'delivered') {
      setActiveOrders(prev => prev.filter(o => o.id !== orderId));
      alert(isAr ? 'تم التسليم بنجاح!' : 'Order Delivered Successfully!');
    } else {
      setActiveOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <span className="material-symbols-outlined text-[48px] text-gray-300 mb-4">two_wheeler</span>
        <h2 className="text-xl font-bold mb-2">{isAr ? 'بوابة المناديب' : 'Rider Portal'}</h2>
        <p className="text-sm text-gray-500">{isAr ? 'يرجى تسجيل الدخول للوصول إلى طلبات التوصيل' : 'Please sign in to access delivery requests.'}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 max-w-md mx-auto bg-gray-50 min-h-screen pb-24 text-slate-900 shadow-xl border-x border-gray-200" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Driver Header */}
      <div className="bg-slate-900 text-white p-4 rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
              <img src={user?.profile?.avatar_url || "/images/reels/reel_2.jpg"} alt="Rider" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{user?.profile?.name || 'Driver'}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-amber-400">star</span>
                4.9 (120 trips)
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isOnline} onChange={() => setIsOnline(!isOnline)} />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
            <span className="text-[10px] font-bold mt-1 uppercase">{isOnline ? (isAr ? 'متاح للطلبات' : 'Online') : (isAr ? 'غير متاح' : 'Offline')}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-white/10 rounded-2xl p-3 relative z-10">
          <div className="text-center border-r border-white/10">
            <p className="text-[10px] text-slate-300 mb-0.5">{isAr ? 'أرباح اليوم' : 'Today Earnings'}</p>
            <p className="font-bold">245 <span className="text-[10px]">ج.م</span></p>
          </div>
          <div className="text-center border-r border-white/10">
            <p className="text-[10px] text-slate-300 mb-0.5">{isAr ? 'الرحلات' : 'Trips'}</p>
            <p className="font-bold">8</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-300 mb-0.5">{isAr ? 'ساعات العمل' : 'Hours'}</p>
            <p className="font-bold">4.5</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-4 gap-2">
        <button 
          onClick={() => setActiveTab('available')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'available' ? 'bg-[#d00000] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
        >
          {isAr ? 'متاح الآن' : 'Available'} 
          {availableOrders.length > 0 && <span className="ml-1.5 bg-white text-[#d00000] px-1.5 rounded-full text-[10px] py-0.5">{availableOrders.length}</span>}
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'}`}
        >
          {isAr ? 'الطلبات الحالية' : 'Active'}
          {activeOrders.length > 0 && <span className="ml-1.5 bg-[#d00000] text-white px-1.5 rounded-full text-[10px] py-0.5">{activeOrders.length}</span>}
        </button>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {!isOnline && activeTab === 'available' && (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-200 shadow-sm mt-4">
            <span className="material-symbols-outlined text-[40px] text-gray-300 mb-2">power_settings_new</span>
            <h3 className="font-bold text-gray-700">{isAr ? 'أنت غير متاح' : 'You are offline'}</h3>
            <p className="text-xs text-gray-500 mt-1">{isAr ? 'قم بتفعيل متاح لاستقبال الطلبات.' : 'Go online to start receiving delivery requests.'}</p>
          </div>
        )}

        {isOnline && activeTab === 'available' && availableOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{order.id}</span>
                <h3 className="font-bold text-slate-900 mt-1">{order.merchant}</h3>
              </div>
              <div className="text-right">
                <span className="block font-black text-emerald-600 text-lg">{order.payout} ج.م</span>
                <span className="text-[10px] text-gray-500">{order.distance}</span>
              </div>
            </div>
            
            <div className="space-y-3 mb-4 relative before:absolute before:inset-y-3 before:left-2.5 before:w-0.5 before:bg-gray-100">
              <div className="flex gap-3 relative z-10">
                <span className="w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'استلام' : 'Pickup'}</p>
                  <p className="text-xs font-medium text-slate-700">{order.pickup}</p>
                </div>
              </div>
              <div className="flex gap-3 relative z-10">
                <span className="w-5 h-5 rounded-full bg-[#d00000] border-2 border-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[12px] text-white">location_on</span>
                </span>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'تسليم' : 'Dropoff'}</p>
                  <p className="text-xs font-medium text-slate-700">{order.dropoff}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => acceptOrder(order)}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-black rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {isAr ? 'قبول الطلب' : 'Accept Order'}
              <span className="material-symbols-outlined text-[18px]">swipe_right</span>
            </button>
          </div>
        ))}

        {isOnline && activeTab === 'available' && availableOrders.length === 0 && (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
              <span className="material-symbols-outlined text-gray-400 text-[24px]">radar</span>
            </div>
            <p className="text-sm font-bold text-gray-600">{isAr ? 'جاري البحث عن طلبات...' : 'Looking for orders...'}</p>
          </div>
        )}

        {activeTab === 'active' && activeOrders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
             <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
               <div>
                 <span className="text-[10px] font-bold text-[#d00000] bg-red-50 px-2 py-0.5 rounded-md uppercase">{isAr ? 'طلب نشط' : 'Active Order'}</span>
                 <h3 className="font-bold text-slate-900 mt-1">{order.id}</h3>
               </div>
               <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center">
                 <span className="material-symbols-outlined text-[20px]">two_wheeler</span>
               </div>
             </div>

             <div className="space-y-4 mb-5">
               <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-gray-600">store</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'استلام من' : 'Pickup from'}</p>
                    <p className="text-sm font-bold text-slate-700">{order.merchant}</p>
                    <p className="text-xs text-gray-500">{order.pickup}</p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-gray-600">person_pin_circle</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{isAr ? 'تسليم إلى' : 'Deliver to'}</p>
                    <p className="text-sm font-bold text-slate-700">Customer</p>
                    <p className="text-xs text-gray-500">{order.dropoff}</p>
                  </div>
               </div>
             </div>

             <div className="space-y-2">
               {order.status === 'accepted' && (
                 <button onClick={() => updateOrderStatus(order.id, 'picked_up')} className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl shadow-sm">
                   {isAr ? 'تأكيد استلام الطلب من المتجر' : 'Confirm Pickup at Store'}
                 </button>
               )}
               {order.status === 'picked_up' && (
                 <button onClick={() => updateOrderStatus(order.id, 'delivered')} className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-xl shadow-sm">
                   {isAr ? 'تأكيد تسليم الطلب للعميل' : 'Confirm Dropoff to Customer'}
                 </button>
               )}
               <button className="w-full py-3 bg-gray-50 text-gray-600 font-bold rounded-xl border border-gray-200">
                 {isAr ? 'فتح الخريطة (GPS)' : 'Open Map (GPS)'}
               </button>
             </div>
          </div>
        ))}

        {activeTab === 'active' && activeOrders.length === 0 && (
          <div className="text-center p-8 text-gray-500 text-sm">
            {isAr ? 'لا توجد طلبات نشطة حالياً.' : 'No active orders right now.'}
          </div>
        )}
      </div>
    </div>
  );
}
