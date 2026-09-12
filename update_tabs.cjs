const fs = require('fs');
const content = fs.readFileSync('src/components/desktop/DesktopSellerDashboard.jsx', 'utf8');

const replacement = `
          {activeNav === 'customers' && (() => {
            const uniqueCustomersMap = new Map();
            merchantOrders.forEach(o => {
              if (!uniqueCustomersMap.has(o.phone)) {
                uniqueCustomersMap.set(o.phone, {
                  name: o.customerName,
                  phone: o.phone,
                  address: o.address || 'العنوان غير متوفر',
                  totalOrders: 0,
                  totalSpent: 0,
                  lastOrderDate: o.date
                });
              }
              const cust = uniqueCustomersMap.get(o.phone);
              cust.totalOrders += 1;
              cust.totalSpent += o.amount;
              cust.lastOrderDate = o.date;
            });
            const uniqueCustomers = Array.from(uniqueCustomersMap.values());

            return (
              <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4 min-h-[400px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">إدارة العملاء</h3>
                    <p className="text-xs text-gray-500">سجل بيانات عملائك وتاريخ طلباتهم</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                      <input 
                        type="text" 
                        placeholder="ابحث بالاسم أو رقم الهاتف..." 
                        className="pl-3 pr-9 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-slate-700 focus:outline-none focus:border-[#d00000] focus:ring-1 focus:ring-[#d00000] transition-all w-64"
                      />
                    </div>
                  </div>
                </div>
                
                {uniqueCustomers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">group</span>
                    <p className="text-xs">لا يوجد عملاء حتى الآن</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-bold">
                          <th className="pb-2.5">اسم العميل</th>
                          <th className="pb-2.5">رقم الهاتف</th>
                          <th className="pb-2.5">إجمالي الطلبات</th>
                          <th className="pb-2.5">إجمالي المدفوعات</th>
                          <th className="pb-2.5">آخر طلب</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {uniqueCustomers.map((c, i) => (
                          <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3">
                              <span className="font-bold text-slate-900 block">{c.name}</span>
                              <span className="text-[10px] text-gray-400">{c.address}</span>
                            </td>
                            <td className="py-3 font-mono text-slate-700" dir="ltr">{c.phone}</td>
                            <td className="py-3 text-slate-700 font-bold">{c.totalOrders} طلب</td>
                            <td className="py-3 font-bold text-emerald-600">{c.totalSpent.toLocaleString()} ج.م</td>
                            <td className="py-3 text-gray-500 text-[11px]">{c.lastOrderDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {activeNav === 'analytics' && (() => {
            const totalRevenue = merchantOrders.reduce((sum, o) => sum + o.amount, 0);
            const totalOrders = merchantOrders.length;
            const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
            const conversionRate = totalOrders > 0 ? ((totalOrders / (totalOrders * 35)) * 100).toFixed(1) : 0;

            return (
              <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-6 min-h-[400px]">
                <div>
                  <h3 className="text-sm font-black text-slate-900">التحليلات والأداء</h3>
                  <p className="text-xs text-gray-500">نظرة شاملة على أداء متجرك خلال الفترة المحددة</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-[11px] font-bold">إجمالي المبيعات</span>
                      <span className="material-symbols-outlined text-[16px] text-emerald-500">payments</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">{totalRevenue.toLocaleString()} <span className="text-xs font-normal text-gray-500">ج.م</span></div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>
                      <span>+15% من الشهر الماضي</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-[11px] font-bold">عدد الطلبات</span>
                      <span className="material-symbols-outlined text-[16px] text-blue-500">local_shipping</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">{totalOrders} <span className="text-xs font-normal text-gray-500">طلب</span></div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>
                      <span>+8% من الشهر الماضي</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-[11px] font-bold">متوسط قيمة الطلب</span>
                      <span className="material-symbols-outlined text-[16px] text-amber-500">receipt_long</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">{avgOrderValue.toLocaleString()} <span className="text-xs font-normal text-gray-500">ج.م</span></div>
                    <div className="text-[10px] text-gray-400 font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">trending_flat</span>
                      <span>ثابت نسبياً</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 shadow-xs">
                    <div className="flex items-center justify-between text-gray-500 mb-2">
                      <span className="text-[11px] font-bold">معدل التحويل (Conversion)</span>
                      <span className="material-symbols-outlined text-[16px] text-purple-500">touch_app</span>
                    </div>
                    <div className="text-xl font-black text-slate-900">{conversionRate}%</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">trending_up</span>
                      <span>+0.2% من الشهر الماضي</span>
                    </div>
                  </div>
                </div>

                {/* Simple CSS Chart */}
                <div className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs">
                  <h4 className="text-xs font-bold text-slate-800 mb-6">المبيعات خلال آخر 7 أيام</h4>
                  <div className="h-40 flex items-end justify-between gap-2 px-2">
                    {[35, 60, 45, 80, 55, 90, 70].map((val, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 gap-2 group relative">
                        <div className="absolute -top-8 bg-slate-800 text-white text-[10px] py-0.5 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {val * 100} ج.م
                        </div>
                        <div className="w-full max-w-[24px] bg-[#d00000]/20 rounded-t-md hover:bg-[#d00000]/40 transition-colors relative">
                          <div className="absolute bottom-0 w-full bg-[#d00000] rounded-t-md" style={{ height: \`\${val}%\` }}></div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">1{i+2}/9</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {activeNav === 'settings' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-6 min-h-[400px]">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900">إعدادات المتجر</h3>
                  <p className="text-xs text-gray-500">إدارة هويتك وطرق الشحن والدفع</p>
                </div>
                <button className="px-4 py-2 bg-[#d00000] text-white text-xs font-bold rounded-xl shadow-xs hover:brightness-110 transition-all">
                  حفظ التغييرات
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800">البيانات الأساسية</h4>
                  
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">اسم المتجر</label>
                    <input type="text" defaultValue={currentMerchant?.name} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-slate-700 focus:border-[#d00000] focus:ring-1 focus:ring-[#d00000] outline-none" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">الرابط الفرعي (Subdomain)</label>
                    <div className="flex items-center">
                      <input type="text" defaultValue={currentMerchant?.subdomain?.replace('.eg-commerce.com', '')} className="flex-1 px-3 py-2 rounded-r-xl border border-gray-200 bg-gray-50 text-xs text-slate-700 focus:border-[#d00000] focus:ring-1 focus:ring-[#d00000] outline-none text-left" dir="ltr" />
                      <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-xs text-gray-500 font-mono" dir="ltr">.eg-commerce.com</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">لوجو المتجر</label>
                    <div className="flex items-center gap-3 mt-1">
                      <img src={currentMerchant?.logo} className="w-12 h-12 rounded-lg border border-gray-200 object-cover" alt="Logo" />
                      <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-gray-50">تغيير الصورة</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800">طرق الدفع والشحن</h4>
                  
                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                    <div>
                      <div className="text-xs font-bold text-slate-800">الدفع عند الاستلام (COD)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">السماح للعملاء بالدفع نقداً عند استلام الشحنة</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                    <div>
                      <div className="text-xs font-bold text-slate-800">تفعيل شحن بوسطة (Bosta)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">إنشاء بوالص الشحن تلقائياً عند تأكيد الطلب</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d00000]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                    <div>
                      <div className="text-xs font-bold text-slate-800">تفعيل الدفع الإلكتروني (Paymob)</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">قبول البطاقات، فوري، والمحافظ الإلكترونية</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
`;

const regex = /\{?\['customers', 'analytics', 'settings'\].includes\(activeNav\) && \(\s*<div.*?قريباً.*?<\/div>\s*\)\}?/s;

if (regex.test(content)) {
  const newContent = content.replace(regex, replacement);
  fs.writeFileSync('src/components/desktop/DesktopSellerDashboard.jsx', newContent);
  console.log('Successfully updated settings, customers, and analytics tabs.');
} else {
  console.log('Regex missed!');
}

