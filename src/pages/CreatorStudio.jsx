import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function CreatorStudio() {
  const { setActiveTab } = useApp();
  const [appliedIds, setAppliedIds] = useState(['camp-1']);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  const campaigns = [
    {
      id: 'camp-1',
      brand: 'تاليسكا ستوديو',
      title: 'حملة استعراض كولكشن الكتان الصيفي 2026',
      product: 'فستان كتان صيفي بوهيمي أصيل',
      rewardType: 'منتج مجاني + 800 ج.م + 10% عمولة',
      slots: 'باقي 3 مقاعد من 10',
      status: 'تمت الموافقة • مطلوب تسليم المسودة'
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
    <div className="w-full flex-1 max-w-5xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      {/* Creator Top Profile Card */}
      <div className="rounded-2xl bg-surface-container-lowest border border-surface-container-high p-5 md:p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-surface-container shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZv9gw2oRrJXoipcG4_zjKKbFTkjPBAfducf2TrVLv9aicAV3y9i-MnmIktqOKCf_76Vyv93WEC3Mr9OvobtOtxA4FepmXHDdA8QVFKydJfU7OdjNv1-y3x25q6PYVC9F1_hge_w4uXUOoni36WnmVe03b9EDQAL4dnEHDR4cgkgvtxtQ_bGebQi411CyE8TSvzM_uVn_ISTDbLJYLqe0H3KkkNqVdXxF2ez_vjzYyxRpDUMVqMiK6"
                alt="Creator Avatar"
                className="w-full h-full object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-secondary border border-surface flex items-center justify-center text-on-secondary">
                <span className="material-symbols-outlined text-[11px]">check</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg font-bold text-on-surface">ليلى إبراهيم (@nour_style)</h1>
                <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[10px] font-semibold">
                  صانعة محتوى معتمدة
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                تخصص: أزياء الكتان المصري، ستايلينج كاجوال راقي ومحتشم
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('merchant')}
            className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1.5 self-start md:self-auto border border-surface-container-high"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">add_business</span>
            <span>التبديل إلى لوحة التاجر</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-surface-container-high">
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block font-medium">إجمالي الأرباح</span>
            <span className="font-serif text-lg font-bold text-secondary">18,450 ج.م</span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block font-medium">مبيعات منسوبة لريلزك</span>
            <span className="font-serif text-lg font-bold text-on-surface">84 طلب</span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block font-medium">متوسط عمولة المبيعات</span>
            <span className="font-serif text-lg font-bold text-secondary">12%</span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block font-medium">تقييم المتاجر</span>
            <span className="font-serif text-lg font-bold text-on-surface">4.9 ★</span>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-sm font-bold text-on-surface">حملات صناع المحتوى (UGC Campaigns)</h2>
          <span className="text-[11px] text-on-surface-variant">تحديث أسبوعي</span>
        </div>

        {submittedMessage && (
          <div className="mb-3 p-3 rounded-xl bg-secondary/10 text-secondary text-xs font-semibold flex items-center gap-1.5 border border-secondary/20 animate-fade-in">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{submittedMessage}</span>
          </div>
        )}

        <div className="space-y-3">
          {campaigns.map((camp) => {
            const isApplied = appliedIds.includes(camp.id);

            return (
              <div
                key={camp.id}
                className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-surface-container-high">
                  <div>
                    <span className="text-[11px] font-semibold text-secondary">{camp.brand}</span>
                    <h3 className="text-xs font-bold text-on-surface mt-0.5">{camp.title}</h3>
                    <span className="text-[10px] text-on-surface-variant">المنتج: {camp.product}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold self-start sm:self-auto ${
                    isApplied ? 'bg-secondary/10 text-secondary' : 'bg-surface-container-low text-on-surface-variant'
                  }`}>
                    {camp.status}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap gap-3 text-on-surface-variant text-[11px]">
                    <span>المكافأة: <b className="text-secondary">{camp.rewardType}</b></span>
                    <span>•</span>
                    <span>المقاعد: <b className="text-on-surface">{camp.slots}</b></span>
                  </div>

                  {isApplied ? (
                    <form onSubmit={handleSendDraft} className="flex gap-2 w-full sm:w-auto">
                      <input
                        type="url"
                        placeholder="رابط مسودة الفيديو (Drive / TikTok)..."
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        className="bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-surface-container-high text-xs text-on-surface flex-1 focus:outline-none focus:border-secondary"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-secondary shrink-0"
                      >
                        إرسال المسودة
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => handleApply(camp.id)}
                      className="px-4 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-secondary transition-all self-end"
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
