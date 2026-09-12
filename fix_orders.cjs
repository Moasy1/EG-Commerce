const fs = require('fs');
const content = fs.readFileSync('src/components/desktop/DesktopSellerDashboard.jsx', 'utf8');

const newOrdersView = `
          {activeNav === 'orders' && (() => {
            const getStatusBadge = (status) => {
              switch(status) {
                case 'ready_for_pickup':
                case 'pending_cod':
                case 'processing':
                  return { label: 'قيد التجهيز', color: 'bg-amber-50 text-amber-600 border-amber-200' };
                case 'in_transit':
                  return { label: 'تم الشحن', color: 'bg-blue-50 text-blue-600 border-blue-200' };
                case 'delivered':
                  return { label: 'مكتمل التوصيل', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
                case 'returned':
                  return { label: 'مرتجع', color: 'bg-red-50 text-red-600 border-red-200' };
                default:
                  return { label: status, color: 'bg-gray-50 text-gray-600 border-gray-200' };
              }
            };

            const filteredOrders = merchantOrders.filter(o => {
              if (orderFilter === 'all') return true;
              if (orderFilter === 'pending') return ['ready_for_pickup', 'pending_cod', 'processing'].includes(o.shippingStatus);
              if (orderFilter === 'shipped') return o.shippingStatus === 'in_transit';
              if (orderFilter === 'completed') return o.shippingStatus === 'delivered';
              return true;
            });

            return (
              <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4 min-h-[400px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">إدارة الطلبات وشحن بوسطة</h3>
                    <p className="text-xs text-gray-500">تابع شحناتك وأوامر الدفع لحظة بلحظة</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none"
                    >
                      <option value="all">كل الحالات</option>
                      <option value="pending">قيد التجهيز</option>
                      <option value="shipped">تم الشحن</option>
                      <option value="completed">مكتمل التوصيل</option>
                    </select>
                  </div>
                </div>
                
                {filteredOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                    <p className="text-xs">لا توجد طلبات بهذه الحالة</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-bold">
                          <th className="pb-2.5">رقم الطلب / التاريخ</th>
                          <th className="pb-2.5">العميل</th>
                          <th className="pb-2.5">المنتج / الكمية</th>
                          <th className="pb-2.5">الإجمالي</th>
                          <th className="pb-2.5 w-40">تحديث الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map((o) => {
                          const badge = getStatusBadge(o.shippingStatus);
                          return (
                            <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                              <td className="py-3">
                                <span className="font-bold text-slate-900 block">{o.id}</span>
                                <span className="text-[10px] text-gray-400">{o.date}</span>
                              </td>
                              <td className="py-3">
                                <span className="font-bold text-slate-800 block">{o.customerName}</span>
                                <span className="text-[10px] text-gray-500 font-mono" dir="ltr">{o.phone}</span>
                              </td>
                              <td className="py-3 text-gray-600 max-w-[150px] truncate" title={o.productTitle}>
                                {o.productTitle} <br/> <span className="text-[10px] text-gray-400">({o.quantity} قطعة)</span>
                              </td>
                              <td className="py-3 font-bold text-[#d00000]">{o.amount.toLocaleString()} ج.م</td>
                              <td className="py-3">
                                <div className="flex flex-col gap-1.5">
                                  <span className={\`px-2 py-0.5 rounded-full text-[10px] font-bold border w-fit \${badge.color}\`}>
                                    {badge.label}
                                  </span>
                                  <select 
                                    className="bg-white border border-gray-200 text-slate-700 text-[10px] rounded px-1 py-1 cursor-pointer focus:outline-none w-full shadow-sm"
                                    value={o.shippingStatus}
                                    onChange={(e) => {
                                      setOrders(prev => prev.map(order => order.id === o.id ? { ...order, shippingStatus: e.target.value } : order));
                                    }}
                                  >
                                    <option value="ready_for_pickup">قيد التجهيز</option>
                                    <option value="in_transit">تم الشحن (بوسطة)</option>
                                    <option value="delivered">مكتمل التوصيل</option>
                                    <option value="returned">مرتجع</option>
                                  </select>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}
`;

const regex = /\{activeNav === 'orders'.*?\)\}/s;

if (regex.test(content)) {
  const newContent = content.replace(regex, newOrdersView);
  fs.writeFileSync('src/components/desktop/DesktopSellerDashboard.jsx', newContent);
  console.log('Orders logic successfully updated.');
} else {
  console.log('Regex missed');
}

