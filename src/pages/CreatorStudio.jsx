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
      brand: 'Talisca Studio • تاليسكا ستوديو',
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
                  Verified Creator • صانعة موثقة
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Niche: أزياء الكتان المصري، ستايلينج كاجوال راقي ومحتشم (Fashion & Modest Wear)
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('merchant')}
            className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1.5 self-start md:self-auto border border-surface-container-high"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">add_business</span>
            <span>Switch to Merchant Hub • لوحة التاجر</span>
          </button>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-surface-container-high">
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block font-medium">Total Earnings • إجمالي الأرباح</span>
            <span className="font-serif text-lg font-bold text-secondary">18,450 EGP</span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block font-medium">Reels Orders • مبيعات الريلز</span>
            <span className="font-serif text-lg font-bold text-on-surface">84 Orders</span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block font-medium">Commission • متوسط العمولة</span>
            <span className="font-serif text-lg font-bold text-secondary">12%</span>
          </div>
          <div className="bg-surface-container-low p-3 rounded-xl">
            <span className="text-[10px] text-on-surface-variant block font-medium">Rating • تقييم البراندات</span>
            <span className="font-serif text-lg font-bold text-on-surface">4.9 ★</span>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-sm font-bold text-on-surface">UGC Campaigns • حملات صناع المحتوى</h2>
          <span className="text-[11px] text-on-surface-variant">Weekly Drops • تحديث أسبوعي</span>
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
                className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 sm:p-5 shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-secondary">{camp.brand}</span>
                      <span className="text-[10px] text-on-surface-variant px-2 py-0.5 rounded bg-surface-container-low">
                        {camp.slots}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-on-surface mb-1.5">{camp.title}</h3>
                    <p className="text-xs text-on-surface-variant mb-3">
                      المنتج المستهدف: <b className="text-on-surface">{camp.product}</b>
                    </p>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low text-xs font-semibold text-on-surface border border-surface-container-high">
                      <span className="material-symbols-outlined text-[16px] text-secondary">redeem</span>
                      <span>{camp.rewardType}</span>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold text-center ${
                      isApplied
                        ? 'bg-secondary/10 text-secondary'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}>
                      {camp.status}
                    </span>

                    {!isApplied ? (
                      <button
                        onClick={() => handleApply(camp.id)}
                        className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-secondary transition-all shadow-xs"
                      >
                        Apply for Campaign • تقديم على الحملة
                      </button>
                    ) : (
                      <span className="text-[11px] text-on-surface-variant font-medium">Applied • مسجل بالفعل</span>
                    )}
                  </div>
                </div>

                {/* Submit Video Draft Link (if approved) */}
                {isApplied && camp.id === 'camp-1' && (
                  <form onSubmit={handleSendDraft} className="mt-4 pt-3 border-t border-surface-container-high flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="رابط مسودة الريلز (Instagram Reel / TikTok / Drive URL)..."
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      className="flex-1 bg-surface-container-low px-3 py-2 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-secondary text-on-secondary text-xs font-bold hover:opacity-90 transition-all shrink-0"
                    >
                      Submit Draft • إرسال للمراجعة
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
