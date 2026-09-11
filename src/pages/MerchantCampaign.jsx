import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function MerchantCampaign() {
  const { setActiveTab } = useApp();
  const [selectedProductId, setSelectedProductId] = useState(INITIAL_PRODUCTS[0].id);
  const [campaignTitle, setCampaignTitle] = useState('حملة ريلز استعراض كولكشن الكتان الصيفي');
  const [brief, setBrief] = useState('مطلوب فيديو ريلز عمودي بدقة عالية يبرز انسيابية القماش وتنسيقات Outfits مناسبة للعمل والخروج اليومي.');
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
          <span className="text-[11px] font-semibold text-secondary">Merchant Hub • لوحة التاجر</span>
          <h1 className="font-serif text-xl md:text-2xl font-bold text-on-surface mt-0.5">Create UGC Campaign • إطلاق حملة صناع محتوى</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            اربطي منتجك بـ Content Creators لتحقيق مبيعات مثبتة بالريلز والتنسيقات
          </p>
        </div>
        <button
          onClick={() => setActiveTab('studio')}
          className="text-xs font-semibold text-secondary hover:underline flex items-center gap-0.5"
        >
          <span>Creator Studio • ستوديو الصناع</span>
          <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
        </button>
      </div>

      {createdSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary font-bold text-xs flex items-center gap-1.5 animate-fade-in">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>تم إنشاء حملة المحتوى بنجاح ونشرها في ستوديو صناع المحتوى! ✨</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Select Product */}
        <div className="rounded-xl bg-surface-container-lowest border border-surface-container-high p-4 shadow-xs">
          <label className="block text-xs font-bold text-on-surface mb-2.5">1. Select Product • اختر المنتج المستهدف للحملة</label>
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
                  <span className="text-[10px] text-on-surface-variant">{prod.price.toLocaleString()} EGP</span>
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
          <h3 className="text-xs font-bold text-on-surface">2. Campaign Brief • تفاصيل ومتطلبات الفيديو</h3>
          
          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Campaign Title • اسم الحملة</label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Creator Brief • تعليمات التصوير والستايلينج</label>
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
          <h3 className="text-xs font-bold text-on-surface">3. Creator Compensation • نموذج المقابل المالي</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'hybrid', title: 'Hybrid هجين (شامل)' },
              { id: 'free_product', title: 'Free Product فقط' },
              { id: 'fixed', title: 'Fixed Cash كاش ثابت' },
              { id: 'commission', title: 'Commission عمولة فقط' }
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setRewardType(type.id)}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  rewardType === type.id
                    ? 'border-secondary bg-secondary/10 text-secondary font-bold'
                    : 'border-surface-container-high bg-surface-container-low text-on-surface-variant hover:border-outline'
                }`}
              >
                {type.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Fixed Amount • كاش ثابت (EGP)</label>
              <input
                type="number"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
                className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Commission Rate • نسبة العمولة (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-on-surface-variant mb-1">Creator Slots • عدد المقاعد</label>
              <input
                type="number"
                value={creatorSlots}
                onChange={(e) => setCreatorSlots(e.target.value)}
                className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg border border-surface-container-high text-xs text-on-surface focus:outline-none focus:border-secondary"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-secondary transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          <span>Launch Campaign • إطلاق الحملة الآن</span>
        </button>
      </form>
    </div>
  );
}
