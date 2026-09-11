import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CreatorStudio() {
  const { setActiveTab } = useApp();
  const [activeTabSub, setActiveTabSub] = useState('campaigns'); // 'campaigns' | 'submissions' | 'earnings'
  const [appliedIds, setAppliedIds] = useState(['camp-1']);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const campaigns = [
    {
      id: 'camp-1',
      brand: 'دار الكتان المصري',
      title: 'حملة إطلاق كولكشن لينين الخريف 2026',
      product: 'فستان لينين كتان كايزن',
      rewardType: 'منتج مجاني + 800 ج.م + 10% عمولة',
      slots: 'باقي 3 مقاعد من 10',
      status: 'تمت الموافقة • مطلوب تسليم المحتوى'
    },
    {
      id: 'camp-2',
      brand: 'مجوهرات طيبة',
      title: 'ريلز تنسيق عقد اللوتس مع أزياء العمل اليومية',
      product: 'عقد ذهبي مستوحى من اللوتس',
      rewardType: 'منتج مجاني + 15% عمولة مبيعات',
      slots: 'باقي 5 مقاعد من 8',
      status: 'متاح للتقديم'
    },
    {
      id: 'camp-3',
      brand: 'ورشة خان الخليلي',
      title: 'فيديو ريفيو وتفاصيل صناعة حقائب الجلد الطبيعي',
      product: 'حقيبة كانفاس يدوية',
      rewardType: 'منتج مجاني + 500 ج.م',
      slots: 'باقي مقعدين فقط',
      status: 'متاح للتقديم'
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
    setSubmittedMessage('تم إرسال مسودة الفيديو للتاجر للمراجعة بنجاح!');
    setSubmissionUrl('');
    setTimeout(() => setSubmittedMessage(''), 4000);
  };

  return (
    <div className="w-full flex-1 max-w-5xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 text-on-surface">
      {/* Creator Top Profile Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-500/20 via-surface-container-low to-surface-container-low border border-emerald-500/30 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full p-1 bg-gradient-to-tr from-tertiary to-secondary shadow-xl shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZv9gw2oRrJXoipcG4_zjKKbFTkjPBAfducf2TrVLv9aicAV3y9i-MnmIktqOKCf_76Vyv93WEC3Mr9OvobtOtxA4FepmXHDdA8QVFKydJfU7OdjNv1-y3x25q6PYVC9F1_hge_w4uXUOoni36WnmVe03b9EDQAL4dnEHDR4cgkgvtxtQ_bGebQi411CyE8TSvzM_uVn_ISTDbLJYLqe0H3KkkNqVdXxF2ez_vjzYyxRpDUMVqMiK6"
                alt="Creator Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-tertiary border-2 border-surface flex items-center justify-center text-slate-950">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-white">ليلى إبراهيم (@layla.fashion)</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-tertiary/20 text-tertiary text-xs font-bold">
                  صانعة محتوى معتمدة
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                تخصص: أزياء محتشمة، درابيه وكتان مصري، تنسيقات كاجوال راقية
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('merchant')}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-surface-variant/40 text-xs font-bold text-white flex items-center gap-2 self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">add_business</span>
            <span>التبديل إلى بوابة التاجر</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-surface-variant/30">
          <div className="bg-surface-container/60 p-3.5 rounded-2xl border border-surface-variant/20">
            <span className="text-[11px] text-on-surface-variant block font-medium">إجمالي الأرباح المكتسبة</span>
            <span className="text-xl font-black text-tertiary">18,450 ج.م</span>
          </div>
          <div className="bg-surface-container/60 p-3.5 rounded-2xl border border-surface-variant/20">
            <span className="text-[11px] text-on-surface-variant block font-medium">مبيعات منسوبة لريلزك</span>
            <span className="text-xl font-black text-white">84 طلب</span>
          </div>
          <div className="bg-surface-container/60 p-3.5 rounded-2xl border border-surface-variant/20">
            <span className="text-[11px] text-on-surface-variant block font-medium">متوسط عمولة المبيعات</span>
            <span className="text-xl font-black text-secondary">12%</span>
          </div>
          <div className="bg-surface-container/60 p-3.5 rounded-2xl border border-surface-variant/20">
            <span className="text-[11px] text-on-surface-variant block font-medium">تقييم العلامات التجارية</span>
            <span className="text-xl font-black text-amber-400">4.9 ★</span>
          </div>
        </div>
      </div>

      {/* Campaign Discovery & Management */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white">فرص وحملات صناع المحتوى (UGC Campaigns)</h2>
          <span className="text-xs text-on-surface-variant">يتم تحديث الفرص أسبوعياً</span>
        </div>

        {submittedMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-tertiary/20 text-tertiary text-xs font-bold flex items-center gap-2 border border-tertiary/40 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{submittedMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          {campaigns.map((camp) => {
            const isApplied = appliedIds.includes(camp.id);

            return (
              <div
                key={camp.id}
                className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-surface-variant/30">
                  <div>
                    <span className="text-xs font-bold text-primary">{camp.brand}</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{camp.title}</h3>
                    <span className="text-xs text-on-surface-variant">المنتج: {camp.product}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isApplied ? 'bg-tertiary/15 text-tertiary' : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap gap-4 text-on-surface-variant">
                    <span>المكافأة: <b className="text-secondary">{camp.rewardType}</b></span>
                    <span>•</span>
                    <span>المقاعد: <b className="text-white">{camp.slots}</b></span>
                  </div>

                  {isApplied ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <form onSubmit={handleSendDraft} className="flex gap-2 w-full">
                        <input
                          type="url"
                          placeholder="رابط مسودة الفيديو (Google Drive / TikTok)..."
                          value={submissionUrl}
                          onChange={(e) => setSubmissionUrl(e.target.value)}
                          className="bg-surface-container px-3 py-1.5 rounded-xl border border-surface-variant/40 text-xs text-on-surface flex-1 focus:outline-none focus:border-primary"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 rounded-xl bg-tertiary text-slate-950 font-bold text-xs hover:bg-emerald-400 shrink-0"
                        >
                          إرسال المسودة
                        </button>
                      </form>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(camp.id)}
                      className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-md transition-all self-end"
                    >
                      تقديم على الحملة
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
