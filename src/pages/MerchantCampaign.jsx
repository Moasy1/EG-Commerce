import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function MerchantCampaign() {
  const { setActiveTab } = useApp();
  const [selectedProductId, setSelectedProductId] = useState(INITIAL_PRODUCTS[0].id);
  const [campaignTitle, setCampaignTitle] = useState('حملة ريلز استعراض خامات الكتان الطبيعي');
  const [brief, setBrief] = useState('مطلوب فيديو ريلز عمودي بدقة عالية يبرز انسيابية القماش وتنسيقات مناسبة للعمل والخروج اليومي.');
  const [rewardType, setRewardType] = useState('hybrid');
  const [fixedAmount, setFixedAmount] = useState('750');
  const [commissionRate, setCommissionRate] = useState('12');
  const [creatorSlots, setCreatorSlots] = useState('5');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      setActiveTab('studio');
    }, 2000);
  };

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-on-surface text-right">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[11px] font-semibold text-secondary">لوحة التاجر • نظام Soft Tenancy</span>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-on-surface mt-0.5">إطلاق حملة محتوى جديدة (UGC)</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            اربط منتجك بصناع المحتوى المحترفين لتحقيق مبيعات حقيقية مثبتة بالريلز
          </p>
        </div>
        <button
          onClick={() => setActiveTab('studio')}
          className="text-xs font-semibold text-secondary hover:underline flex items-center gap-0.5"
        >
          <span>عرض ستوديو الصناع</span>
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        </button>
      </div>

      {createdSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary font-bold text-xs flex items-center gap-1.5 animate-fade-in">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>تم إنشاء حملة المحتوى بنجاح ونشرها في ستوديو صناع المحتوى!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Select Product */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-xs">
          <label className="block text-xs font-bold text-on-surface mb-2.5">1. اختر المنتج المستهدف للحملة</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {INITIAL_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProductId(prod.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                  selectedProductId === prod.id
                    ? 'border-secondary bg-secondary/5'
                    : 'border-surface-container-high bg-surface-container-low hover:border-outline'
                }`}
              >
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-10 h-12 rounded object-cover bg-surface-container"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-on-surface truncate">{prod.title}</h4>
                  <span className="text-[10px] text-on-surface-variant">{prod.price.toLocaleString()} ج.م</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedProductId === prod.id ? 'border-secondary bg-secondary text-on-secondary' : 'border-surface-container-high'
                }`}>
                  {selectedProductId === prod.id && <span className="material-symbols-outlined text-[11px]">check</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Campaign Details */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-on-surface">2. تفاصيل ومتطلبات المحتوى</h3>
          
          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant mb-1">عنوان الحملة</label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant mb-1">متطلبات الفيديو (Brief)</label>
            <textarea
              rows={2}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Step 3: Rewards */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-on-surface">3. نموذج مكافأة صناع المحتوى</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'hybrid', title: 'مزيج هجين (شامل)' },
              { id: 'free_product', title: 'منتج مجاني فقط' },
              { id: 'fixed', title: 'مبلغ نقدي ثابت' },
              { id: 'commission', title: 'عمولة مبيعات فقط' }
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setRewardType(type.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                  rewardType === type.id
                    ? 'border-secondary bg-secondary/10 text-secondary'
                    : 'border-surface-container-high bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {type.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div>
              <label className="block text-[10px] text-on-surface-variant mb-1">المبلغ الثابت لكل صانع (ج.م)</label>
              <input
                type="number"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
                className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-[10px] text-on-surface-variant mb-1">نسبة عمولة المبيعات (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-[10px] text-on-surface-variant mb-1">عدد المقاعد المتاحة</label>
              <input
                type="number"
                value={creatorSlots}
                onChange={(e) => setCreatorSlots(e.target.value)}
                className="w-full bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-secondary transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          <span>نشر الحملة في ستوديو صناع المحتوى الآن</span>
        </button>
      </form>
    </div>
  );
}
