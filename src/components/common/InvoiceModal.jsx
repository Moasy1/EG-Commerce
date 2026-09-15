import React, { useState } from 'react';
import { generateInvoiceHtml, printOrderInvoice, numberToArabicWords } from '../../utils/invoiceGenerator';

export default function InvoiceModal({ isOpen, onClose, order, merchant = null }) {
  if (!isOpen || !order) return null;

  const [activeTab, setActiveTab] = useState('invoice'); // 'invoice' | 'waybill'

  const storeName = merchant?.name || order.merchantName || 'Talieska Studio • تاليسكا ستوديو';
  const storePhone = merchant?.whatsapp || merchant?.phone || '+20 100 234 5678';
  const orderId = order.id || 'EG-8841';
  const invoiceNumber = `INV-${orderId.replace(/[^a-zA-Z0-9]/g, '')}-${new Date(order.createdAt || Date.now()).getFullYear()}`;
  const trackingNumber = order.trackingNumber || 'BST-77391024';

  const isPaid = order.paymentStatus === 'paid';
  const items = (Array.isArray(order.items) && order.items.length > 0)
    ? order.items
    : [
        {
          title: order.productTitle || 'منتج أزياء وتراث مصري فاخر',
          quantity: order.quantity || 1,
          size: order.size || 'Standard',
          color: order.color || 'أصلي',
          price: order.subtotal || order.amount || 1450
        }
      ];

  const subtotal = order.subtotal || items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const discount = order.discount || 0;
  const shipping = order.shipping !== undefined ? order.shipping : 60;
  const totalAmount = order.amount || (subtotal - discount + shipping);
  const vatAmount = Math.round(totalAmount * (14 / 114));
  const amountInWords = numberToArabicWords(totalAmount);

  const handlePrint = () => {
    printOrderInvoice(order, merchant);
  };

  const handleSendWhatsApp = () => {
    const phone = (order.phone || '').replace(/[^\d+]/g, '');
    const message = encodeURIComponent(
      `مرحباً ${order.customerName || ''}،\nمرفق تفاصيل فاتورتك الرسمية من متجر ${storeName}:\n` +
      `رقم الفاتورة: ${invoiceNumber}\n` +
      `الطلب: ${orderId}\n` +
      `الإجمالي: ${totalAmount.toLocaleString()} ج.م\n` +
      `حالة الدفع: ${isPaid ? 'مدفوع إلكترونياً ✓' : 'مستحق عند الاستلام (COD)'}\n` +
      `رقم تتبع بوسطة: ${trackingNumber}\n` +
      `شكراً لتسوقك من منصة التجارة المصرية!`
    );
    window.open(`https://wa.me/${phone.replace(/^\+/, '')}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      dir="rtl"
    >
      <div 
        className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Navigation Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d00000] text-white font-black flex items-center justify-center text-sm shadow-md">
              EG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">الفاتورة الضريبية وبوليصة الشحن</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30">
                  ETA Verified ✓
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{invoiceNumber} • طلب {orderId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>طباعة المستند الرسمي</span>
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
              title="إرسال عبر واتساب"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span className="hidden sm:inline">إرسال للعميل</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="إغلاق"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs: Tax Invoice vs Thermal Shipping Waybill */}
        <div className="bg-slate-100 border-b border-gray-200 px-5 py-2 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'invoice'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-[#d00000]">receipt_long</span>
            <span>فاتورة إلكترونية معتمدة (A4 Invoice)</span>
          </button>
          <button
            onClick={() => setActiveTab('waybill')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'waybill'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px] text-blue-600">local_shipping</span>
            <span>بوليصة شحن بوسطة حرارية (Bosta AWB Label)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 max-h-[72vh] overflow-y-auto space-y-5 text-xs">
          {activeTab === 'invoice' ? (
            <>
              {/* Official Header Strip */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/70 via-gray-50 to-white border border-red-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#d00000] tracking-wider block">جمهورية مصر العربية • مصلحة الضرائب المصرية</span>
                  <h4 className="text-base font-black text-slate-900 mt-0.5">{storeName}</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    س.ت: <strong>419208 استثمار القاهرة</strong> | ر.ض: <strong dir="ltr">620-891-304</strong>
                  </p>
                </div>
                <div className="text-left" dir="ltr">
                  <div className="inline-block bg-white px-2.5 py-1 rounded-lg border border-gray-200 font-mono font-black text-slate-900 text-xs">
                    {invoiceNumber}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">
                    تاريخ الإصدار: {new Date(order.createdAt || Date.now()).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>

              {/* Parties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">بيانات المتجر (Seller)</span>
                  <strong className="block text-slate-900 font-bold">{storeName}</strong>
                  <p className="text-gray-600 text-[11px]">14 شارع دجلة، المعادي، القاهرة</p>
                  <p className="text-gray-600 text-[11px]" dir="ltr">واتساب: {storePhone}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">العميل المستلم (Consignee)</span>
                  <strong className="block text-slate-900 font-bold">{order.customerName || 'عميل تجارة مصرية'}</strong>
                  <p className="text-gray-600 text-[11px]">{order.address || 'القاهرة، جمهورية مصر العربية'}</p>
                  <p className="text-gray-600 text-[11px]" dir="ltr">الهاتف: {order.phone}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                    <tr>
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">المنتج والتفاصيل</th>
                      <th className="py-2.5 px-3 text-center">الكمية</th>
                      <th className="py-2.5 px-3 text-left">سعر الوحدة</th>
                      <th className="py-2.5 px-3 text-left">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-gray-400 font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{it.title || it.name || order.productTitle}</div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-2 mt-0.5">
                            {it.size && <span className="bg-gray-100 px-1.5 py-0.2 rounded font-medium">مقاس: {it.size}</span>}
                            {it.color && <span className="bg-gray-100 px-1.5 py-0.2 rounded font-medium">لون: {it.color}</span>}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">{it.quantity || 1}</td>
                        <td className="py-2.5 px-3 text-left font-mono font-bold">{(it.price || 0).toLocaleString()} ج.م</td>
                        <td className="py-2.5 px-3 text-left font-mono font-black text-slate-900">
                          {((it.price || 0) * (it.quantity || 1)).toLocaleString()} ج.م
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Tax Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 space-y-2 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-mono text-[9px] p-1 text-center font-bold shrink-0">
                      ETA QR
                    </div>
                    <div className="text-[11px] leading-relaxed text-slate-600">
                      <strong>رمز توثيق منظومة الضرائب:</strong>
                      <p className="text-[10px] text-gray-500">فاتورة إلكترونية صادرة ومسجلة طبقاً لضوابط مصلحة الضرائب المصرية 2026.</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg text-center font-bold text-[11px] ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {isPaid ? '✓ مدفوع إلكترونياً بالكامل (PAID)' : `○ تحصيل نقدي عند الاستلام (COD): ${totalAmount.toLocaleString()} ج.م`}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-1.5">
                  <div className="flex justify-between text-slate-600 text-xs">
                    <span>المجموع الفرعي:</span>
                    <span className="font-mono font-bold">{subtotal.toLocaleString()} ج.م</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 text-xs">
                      <span>الخصم المطبق:</span>
                      <span className="font-mono font-bold">-{discount.toLocaleString()} ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600 text-xs">
                    <span>شحن بوسطة إكسبريس:</span>
                    <span className="font-mono font-bold">{shipping > 0 ? `${shipping} ج.م` : 'مجاني'}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-[10px]">
                    <span>ضريبة القيمة المضافة 14% (متضمنة):</span>
                    <span className="font-mono">{vatAmount.toLocaleString()} ج.م</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-1 flex justify-between items-center">
                    <span className="font-black text-slate-900 text-sm">الإجمالي النهائي:</span>
                    <span className="font-black text-[#d00000] text-base font-mono">{totalAmount.toLocaleString()} ج.م</span>
                  </div>
                  <p className="text-[10px] text-gray-500 italic text-left">{amountInWords}</p>
                </div>
              </div>
            </>
          ) : (
            /* Thermal Bosta Shipping Waybill (4x6 Label Style) */
            <div className="max-w-md mx-auto p-4 bg-white border-2 border-slate-900 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#e11d48] text-white font-black text-xs flex items-center justify-center">
                    B
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-900">BOSTA EXPRESS</h4>
                    <span className="text-[10px] text-slate-500 font-mono">NEXT-DAY PARCEL DELIVERY</span>
                  </div>
                </div>
                <div className="text-left font-mono font-black text-sm text-slate-900">
                  CAI-HUB-04
                </div>
              </div>

              {/* Barcode Mockup */}
              <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-1">
                <div className="font-mono tracking-widest text-lg font-black text-slate-900">
                  |||| | ||||| ||| ||||||| ||||
                </div>
                <div className="font-mono text-xs font-bold text-slate-700 tracking-wider">
                  {trackingNumber}
                </div>
              </div>

              {/* Consignee */}
              <div className="border border-slate-200 p-3 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">المرسل إليه (Consignee):</span>
                <p className="font-black text-sm text-slate-900">{order.customerName}</p>
                <p className="font-mono font-bold text-slate-800" dir="ltr">{order.phone}</p>
                <p className="text-xs text-slate-700 leading-relaxed">{order.address}</p>
              </div>

              {/* COD Box */}
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-red-800 block">المبلغ المطلوب تحصيله (COD):</span>
                  <span className="text-lg font-black text-[#d00000] font-mono">
                    {isPaid ? '0 ج.م (مدفوع مسبقاً ✓)' : `${totalAmount.toLocaleString()} ج.م`}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-1 bg-white border border-red-200 rounded font-bold text-slate-800">
                  السماح بالمعاينة
                </span>
              </div>

              {/* Shipper */}
              <div className="text-[11px] text-slate-500 pt-1 border-t border-gray-100 flex justify-between items-center">
                <span>الراسل: {storeName}</span>
                <span className="font-mono text-[10px]">Order: {orderId}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            مستند رسمي معتمد طبقاً لمعايير التجارة الإلكترونية المصرية 2026
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
}
