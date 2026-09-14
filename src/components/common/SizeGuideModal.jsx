import React, { useState } from 'react';

export default function SizeGuideModal({ 
  isOpen, 
  onClose, 
  product, 
  selectedSize, 
  onSelectSize,
  isAr = true 
}) {
  const [unit, setUnit] = useState('cm'); // 'cm' | 'in'
  const [userBust, setUserBust] = useState('');
  const [userWaist, setUserWaist] = useState('');
  const [recommendedSize, setRecommendedSize] = useState(null);

  if (!isOpen) return null;

  // Measurement presets / custom merchant chart
  const customChart = product?.sizeGuide?.chart;
  const merchantImage = product?.sizeGuide?.image;

  // Fallback high-standard Egyptian fashion size chart
  const defaultChart = [
    { size: 'XS', bust: 82, waist: 64, hips: 90, length: 115 },
    { size: 'S', bust: 88, waist: 70, hips: 96, length: 118 },
    { size: 'M', bust: 94, waist: 76, hips: 102, length: 120 },
    { size: 'L', bust: 100, waist: 82, hips: 108, length: 122 },
    { size: 'XL', bust: 108, waist: 90, hips: 116, length: 124 },
    { size: '2XL', bust: 116, waist: 98, hips: 124, length: 125 }
  ];

  const activeChart = (customChart && customChart.length > 0) ? customChart : defaultChart;

  const formatValue = (val) => {
    if (!val && val !== 0) return '-';
    if (unit === 'in') {
      return `${(Math.round((val / 2.54) * 10) / 10)} in`;
    }
    return `${val} cm`;
  };

  // Smart Fit Advisor calculation
  const calculateRecommendedSize = (bust, waist) => {
    const b = parseFloat(bust);
    const w = parseFloat(waist);
    if (!b && !w) {
      setRecommendedSize(null);
      return;
    }

    const metric = b || (w ? w * 1.25 : 0);
    let best = activeChart[0]?.size || 'M';
    for (let i = 0; i < activeChart.length; i++) {
      const row = activeChart[i];
      if (metric <= (row.bust || 90)) {
        best = row.size;
        break;
      }
      best = row.size;
    }
    setRecommendedSize(best);
  };

  const handleBustChange = (e) => {
    const val = e.target.value;
    setUserBust(val);
    calculateRecommendedSize(val, userWaist);
  };

  const handleWaistChange = (e) => {
    const val = e.target.value;
    setUserWaist(val);
    calculateRecommendedSize(userBust, val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        dir={isAr ? 'rtl' : 'ltr'} 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden animate-scale-up"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50/80 via-white to-red-50/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#d00000] flex items-center justify-center border border-red-100">
              <span className="material-symbols-outlined text-[20px]">straighten</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  {isAr ? 'دليل المقاسات المعتمد' : 'Official Size Guide'}
                </h3>
                {merchantImage && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {isAr ? 'معتمد من التاجر' : 'Merchant Verified'}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 line-clamp-1">
                {product?.title || (isAr ? 'جدول القياسات الدقيقة' : 'Garment Measurements')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-slate-900 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 text-start">
          {/* Merchant Uploaded Image (if present) */}
          {merchantImage && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#d00000]">image</span>
                  {isAr ? 'مخطط المقاسات المرفق من التاجر' : 'Merchant Size Chart Image'}
                </span>
                <a 
                  href={merchantImage} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs font-bold text-[#d00000] hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  {isAr ? 'فتح بدقة كاملة' : 'View Full Image'}
                </a>
              </div>
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center max-h-[360px] p-2">
                <img 
                  src={merchantImage} 
                  alt="Size Chart" 
                  className="w-full h-auto object-contain max-h-[340px] rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Measurements Table & Unit Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#d00000]">table_chart</span>
                  {isAr ? 'جدول القياسات بالسنتيمتر' : 'Detailed Measurement Table'}
                </h4>
                <p className="text-[11px] text-gray-500">
                  {isAr ? 'القياسات مأخوذة للمنتج بشكل مسطح' : 'Measurements taken with garment laid flat'}
                </p>
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    unit === 'cm' ? 'bg-white text-[#d00000] shadow-xs' : 'text-gray-500 hover:text-slate-800'
                  }`}
                >
                  {isAr ? 'سم (CM)' : 'CM'}
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    unit === 'in' ? 'bg-white text-[#d00000] shadow-xs' : 'text-gray-500 hover:text-slate-800'
                  }`}
                >
                  {isAr ? 'بوصة (IN)' : 'IN'}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-xs">
              <table className="w-full text-xs text-slate-700 text-center">
                <thead className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 text-start font-bold">{isAr ? 'المقاس' : 'Size'}</th>
                    <th className="py-3 px-3">{isAr ? 'محيط الصدر' : 'Bust/Chest'}</th>
                    <th className="py-3 px-3">{isAr ? 'محيط الخصر' : 'Waist'}</th>
                    <th className="py-3 px-3">{isAr ? 'محيط الأرداف' : 'Hips'}</th>
                    <th className="py-3 px-3">{isAr ? 'الطول' : 'Length'}</th>
                    <th className="py-3 px-3">{isAr ? 'اختيار' : 'Select'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeChart.map((row, idx) => {
                    const isSelected = selectedSize === row.size;
                    const isRec = recommendedSize === row.size;
                    return (
                      <tr 
                        key={idx} 
                        className={`transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-red-50/70 font-bold text-[#d00000]' 
                            : isRec 
                              ? 'bg-amber-50/70 font-semibold' 
                              : 'hover:bg-gray-50/80'
                        }`}
                        onClick={() => onSelectSize && onSelectSize(row.size)}
                      >
                        <td className="py-3 px-4 text-start font-black text-slate-900 flex items-center gap-2">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                            isSelected ? 'bg-[#d00000] text-white' : 'bg-gray-100 text-slate-800'
                          }`}>
                            {row.size}
                          </span>
                          {isRec && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
                              {isAr ? 'موصى به لك' : 'Recommended'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap"><span dir="ltr">{formatValue(row.bust)}</span></td>
                        <td className="py-3 px-3 whitespace-nowrap"><span dir="ltr">{formatValue(row.waist)}</span></td>
                        <td className="py-3 px-3 whitespace-nowrap"><span dir="ltr">{formatValue(row.hips)}</span></td>
                        <td className="py-3 px-3 whitespace-nowrap"><span dir="ltr">{formatValue(row.length)}</span></td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectSize) onSelectSize(row.size);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              isSelected
                                ? 'bg-[#d00000] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-[#d00000] hover:text-white'
                            }`}
                          >
                            {isSelected ? (isAr ? 'محدد' : 'Selected') : (isAr ? 'اختر' : 'Choose')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Smart Fit Calculator */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-50/40 via-amber-50/30 to-gray-50 border border-red-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-amber-600">calculate</span>
                {isAr ? 'مساعد المقاس الذكي (Smart Fit Advisor)' : 'Smart Fit Advisor'}
              </span>
              {recommendedSize && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-xs">
                  <span>{isAr ? 'مقاسك الأنسب:' : 'Best Fit:'}</span>
                  <span className="text-sm font-black">{recommendedSize}</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-gray-600">
              {isAr 
                ? 'أدخلي قياس محيط الصدر أو الخصر بالسنتيمتر لنقترح عليك المقاس المثالي فوراً:' 
                : 'Enter your bust or waist measurement in cm to calculate your recommended size:'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">
                  {isAr ? 'محيط الصدر (سم)' : 'Bust (cm)'}
                </label>
                <input
                  type="number"
                  placeholder="مثال: 94"
                  value={userBust}
                  onChange={handleBustChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#d00000]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 mb-1">
                  {isAr ? 'محيط الخصر (سم)' : 'Waist (cm)'}
                </label>
                <input
                  type="number"
                  placeholder="مثال: 76"
                  value={userWaist}
                  onChange={handleWaistChange}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#d00000]"
                />
              </div>
            </div>
          </div>

          {/* How to Measure Visual Tips */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#d00000]">help_outline</span>
              {isAr ? 'كيف تقيسين أبعاد جسمك بدقة؟' : 'How to Measure Accurately'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-start space-y-1">
                <span className="text-xs font-bold text-slate-900 block">1. الصدر (Bust)</span>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {isAr ? 'مرري شريط القياس حول أعرض جزء من الصدر مع الحفاظ على الشريط مستوياً.' : 'Measure around the fullest part of your chest.'}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-start space-y-1">
                <span className="text-xs font-bold text-slate-900 block">2. الخصر (Waist)</span>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {isAr ? 'قيسي حول أضيق نقطة من خصرك الطبيعي (عادة فوق السرة بـ 2 سم).' : 'Measure around your natural waistline.'}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-start space-y-1">
                <span className="text-xs font-bold text-slate-900 block">3. الأرداف (Hips)</span>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {isAr ? 'قفي وقدميك معاً، وقيسي حول محيط أوسع نقطة في الأرداف.' : 'Measure around the fullest part of your hips.'}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-start space-y-1">
                <span className="text-xs font-bold text-slate-900 block">4. الطول (Length)</span>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {isAr ? 'من أعلى نقطة في الكتف عمودياً وحتى طرف الحافة السفلية للقطعة.' : 'From the highest shoulder point to the hem.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-600">
            {isAr ? 'المقاس المحدد حالياً:' : 'Currently selected:'}{' '}
            <span className="font-black text-[#d00000] text-sm">{selectedSize || 'M'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>{isAr ? 'تأكيد المقاس ومتابعة الشراء' : 'Confirm Size & Continue'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
