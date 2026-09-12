const fs = require('fs');
const content = fs.readFileSync('src/components/desktop/DesktopSellerDashboard.jsx', 'utf8');

const replacement = `
          {activeNav === 'orders' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">إدارة الطلبات وشحن بوسطة</h3>
                  <p className="text-xs text-gray-500">تابع شحناتك وأوامر الدفع لحظة بلحظة</p>
                </div>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer focus:outline-none">
                    <option>كل الحالات</option>
                    <option>قيد التجهيز</option>
                    <option>تم الشحن</option>
                    <option>تم التوصيل</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-bold">
                      <th className="pb-2.5">رقم الطلب / التاريخ</th>
                      <th className="pb-2.5">العميل</th>
                      <th className="pb-2.5">المنتجات</th>
                      <th className="pb-2.5">الإجمالي</th>
                      <th className="pb-2.5">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { id: '#1045', date: 'اليوم, 10:24 ص', customer: 'أحمد محمود', products: '2 قطعة', total: '2,400 ج.م', status: 'قيد التجهيز', statusColor: 'bg-amber-50 text-amber-600 border-amber-200' },
                      { id: '#1044', date: 'أمس, 05:12 م', customer: 'سارة خالد', products: '1 قطعة', total: '850 ج.م', status: 'تم الشحن (بوسطة)', statusColor: 'bg-blue-50 text-blue-600 border-blue-200' },
                      { id: '#1043', date: 'أمس, 02:30 م', customer: 'عمر حسين', products: '3 قطع', total: '3,250 ج.م', status: 'مكتمل الدفع', statusColor: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
                      { id: '#1042', date: '11 سبتمبر, 11:00 ص', customer: 'نورهان سعيد', products: '1 قطعة', total: '980 ج.م', status: 'مرتجع', statusColor: 'bg-red-50 text-red-600 border-red-200' },
                    ].map((o, i) => (
                      <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3">
                          <span className="font-bold text-slate-900 block">{o.id}</span>
                          <span className="text-[10px] text-gray-400">{o.date}</span>
                        </td>
                        <td className="py-3 font-bold text-slate-800">{o.customer}</td>
                        <td className="py-3 text-gray-600">{o.products}</td>
                        <td className="py-3 font-bold text-[#d00000]">{o.total}</td>
                        <td className="py-3">
                          <span className={\`px-2 py-0.5 rounded-full text-[10px] font-bold border \${o.statusColor}\`}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeNav === 'content' && (
            <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-slate-900">إدارة المحتوى (UGC & Reels)</h3>
                  <p className="text-xs text-gray-500">مكتبة فيديوهات المتجر وصناع المحتوى</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container-high text-slate-800 text-xs font-bold shadow-xs hover:bg-gray-50 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">video_camera_front</span>
                    <span>طلب محتوى (UGC)</span>
                  </button>
                  <button
                    className="px-3.5 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">upload</span>
                    <span>رفع فيديو للمتجر</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { img: '/images/reels/reel_1.jpg', views: '124K', sales: '84 طلب', status: 'نشط (الرئيسية)' },
                  { img: '/images/reels/reel_2.jpg', views: '89K', sales: '52 طلب', status: 'نشط' },
                  { img: '/images/reels/reel_3.jpg', views: '45K', sales: '21 طلب', status: 'نشط' },
                  { img: '/images/products/linen_abaya.jpg', views: '12K', sales: '8 طلبات', status: 'قيد المراجعة' },
                ].map((reel, i) => (
                  <div key={i} className="relative group rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    <div className="aspect-[9/16] relative">
                      <img src={reel.img} alt="Reel" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                      
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold">
                        {reel.status}
                      </div>
                      
                      <div className="absolute bottom-3 left-0 w-full px-3">
                        <div className="flex items-center justify-between text-white text-[11px] font-bold">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            <span>{reel.views}</span>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-300">
                            <span className="material-symbols-outlined text-[14px]">shopping_cart</span>
                            <span>{reel.sales}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {['customers', 'analytics', 'settings'].includes(activeNav) && (
`;

// Replace lines 547 to 565 with our new content
const regex = /\{activeNav === 'orders'.*?\}\s*\)\}\s*\{\['customers', 'content', 'analytics', 'settings'\].includes\(activeNav\) && \(/s;

if (regex.test(content)) {
  const newContent = content.replace(regex, replacement);
  fs.writeFileSync('src/components/desktop/DesktopSellerDashboard.jsx', newContent);
  console.log('Successfully updated Dashboard sub-views');
} else {
  console.log('Regex did not match');
}
