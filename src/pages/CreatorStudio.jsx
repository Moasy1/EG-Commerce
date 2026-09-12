import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import DesktopCreatorAnalytics from '../components/desktop/DesktopCreatorAnalytics';

export default function CreatorStudio() {
  const { setActiveTab } = useApp();
  const [appliedIds, setAppliedIds] = useState(['camp-1']);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const campaigns = [
    {
      id: 'camp-1',
      brand: 'Talieska Studio • تاليسكا ستوديو',
      title: 'حملة استعراض كولكشن الكتان الصيفي 2026',
      product: 'فستان كتان صيفي بوهيمي أصيل',
      rewardType: 'Free Product + 800 EGP + 10% Commission',
      slots: 'باقي 3 مقاعد من 10 (Slots)',
      status: 'Approved • مطلوب تسليم الـ Draft'
    },
    {
      id: 'camp-2',
      brand: 'Theba Jewelry • مجوهرات طيبة',
      title: 'ريلز تنسيق عقد اللوتس مع أزياء العمل والـ Outfits اليومية',
      product: 'عقد ذهبي مستوحى من اللوتس الفرعوني',
      rewardType: 'Free Gift + 15% Sales Commission',
      slots: 'باقي 5 مقاعد من 8 (Slots)',
      status: 'Open for Application • متاح للتقديم'
    },
    {
      id: 'camp-3',
      brand: 'Khan El Khalili Workshop • ورشة خان الخليلي',
      title: 'فيديو ريفيو وتفاصيل صناعة شنط الجلد الطبيعي يدوياً',
      product: 'حقيبة كانفاس يدوية أصلية',
      rewardType: 'Free Bag + 500 EGP',
      slots: 'باقي مقعدين فقط (2 Slots)',
      status: 'Open for Application • متاح للتقديم'
    }
  ];

  const handleApply = (id) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds(prev => [...prev, id]);
    }
  };

  const handleSendDraft = (e) => {
    e.preventDefault();
    if (!submissionUrl) return;
    setSubmittedMessage('تم إرسال مسودة الـ Reel للبراند للمراجعة بنجاح! ✨');
    setSubmissionUrl('');
    setTimeout(() => setSubmittedMessage(''), 4000);
  };

  return (
    <div className="w-full flex-1">
      {/* 1. DESKTOP VIEW (Screen 5: Creator Analytics & Campaigns) */}
      <div className="hidden lg:block w-full max-w-[1780px] mx-auto px-4 md:px-8 py-6">
        <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
          <DesktopCreatorAnalytics />
        </div>
      </div>

      {/* 2. MOBILE VIEW (Mobile Creator Studio) */}
      <div className="lg:hidden w-full flex-1 max-w-5xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-slate-900 text-right font-sans">
        {/* Creator Top Profile Card */}
        <div className="rounded-2xl bg-white border border-gray-200 p-5 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="relative w-16 h-16 rounded-full p-0.5 bg-gray-100 shrink-0">
                <img 
                  src="/images/reels/reel_2.jpg" 
                  alt="Creator Avatar" 
                  className="w-full h-full rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">ياسمين السيد • Yasmin El Sayed</h2>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold">
                    موثق ✓
                  </span>
                </div>
                <p className="text-xs text-gray-500">صانعة محتوى أزياء مصرية معاصرة • القاهرة</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold text-gray-600">
                  <span>✨ 245K متابع</span>
                  <span>•</span>
                  <span>🎬 42 ريلز منشورة</span>
                  <span>•</span>
                  <span>⚡ 13.6% معدل التفاعل</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('reels')}
                className="px-4 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-xs hover:brightness-110 transition-all"
              >
                استعراض فيديوهات الريلز
              </button>
            </div>
          </div>
        </div>

        {/* Brand Campaigns Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">حملات البراندات المتاحة للتعاون (Brand Campaigns)</h3>
            <span className="text-xs font-bold text-[#d00000]">3 حملات نشطة</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaigns.map((camp) => (
              <div key={camp.id} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#d00000]">{camp.brand}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {camp.slots}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{camp.title}</h4>
                <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <p><span className="font-bold text-slate-700">المنتج:</span> {camp.product}</p>
                  <p><span className="font-bold text-slate-700">المكافأة:</span> {camp.rewardType}</p>
                </div>
                <div className="pt-1">
                  {appliedIds.includes(camp.id) ? (
                    <button disabled className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold">
                      تم التقديم والموافقة ✓
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleApply(camp.id)}
                      className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors"
                    >
                      تقديم طلب مشاركة
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
