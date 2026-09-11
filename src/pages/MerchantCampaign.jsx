import React, { useState } from 'react';
import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';

export default function MerchantCampaign() {
  const { setActiveTab } = useApp();
  const [selectedProductId, setSelectedProductId] = useState(INITIAL_PRODUCTS[0].id);
  const [campaignTitle, setCampaignTitle] = useState('حملة ريلز استعراض خامات الكتان الطبيعي');
  const [brief, setBrief] = useState('مطلوب فيديو ريلز عمودي بدقة عالية يبرز انسيابية القماش وتنسيقات مناسبة للعمل والخروج اليومي.');
  const [rewardType, setRewardType] = useState('hybrid'); // 'free_product' | 'fixed' | 'commission' | 'hybrid'
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
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-6 pb-28 md:pb-12 text-on-surface">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold text-primary">لوحة تحكم التاجر • Soft Tenancy</span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-0.5">إطلاق حملة محتوى جديدة (UGC)</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            اربط منتجك بصناع المحتوى المحترفين لتحقيق مبيعات حقيقية مثبتة بالريلز
          </p>
        </div>
        <button
          onClick={() => setActiveTab('studio')}
          className="text-xs font-bold text-tertiary hover:underline flex items-center gap-1"
        >
          <span>عرض ستوديو الصناع</span>
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        </button>
      </div>

      {createdSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-tertiary/20 border border-tertiary/40 text-tertiary font-bold text-xs flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>تم إنشاء حملة المحتوى بنجاح ونشرها في ستوديو صناع المحتوى!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Product */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-5">
          <label className="block text-sm font-bold text-white mb-3">1. اختر المنتج المستهدف للحملة</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INITIAL_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProductId(prod.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedProductId === prod.id
                    ? 'border-primary bg-primary/10'
                    : 'border-surface-variant/40 bg-surface-container hover:border-surface-variant'
                }`}
              >
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-12 h-14 rounded-lg object-cover bg-surface-container-highest"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{prod.title}</h4>
                  <span className="text-[11px] text-on-surface-variant">{prod.price} ج.م</span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedProductId === prod.id ? 'border-primary bg-primary text-white' : 'border-surface-variant'
                }`}>
                  {selectedProductId === prod.id && <span className="material-symbols-outlined text-[14px]">check</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Campaign Details & Brief */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">2. تفاصيل ومتطلبات المحتوى</h3>
          
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">عنوان الحملة</label>
            <input
              type="text"
              value={campaignTitle}
              onChange={(e) => setCampaignTitle(e.target.value)}
              className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-surface-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">متطلبات الفيديو (Brief)</label>
            <textarea
              rows={3}
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              className="w-full bg-surface-container px-3.5 py-2.5 rounded-xl border border-surface-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary leading-relaxed"
              required
            />
          </div>
        </div>

        {/* Step 3: Compensation Model */}
        <div className="rounded-2xl bg-surface-container-low border border-surface-variant/30 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">3. نموذج مكافأة صناع المحتوى</h3>

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
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  rewardType === type.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-surface-variant/40 bg-surface-container text-on-surface-variant'
                }`}
              >
                {type.title}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-[11px] text-on-surface-variant mb-1">المبلغ الثابت لكل صانع (ج.م)</label>
              <input
                type="number"
                value={fixedAmount}
                onChange={(e) => setFixedAmount(e.target.value)}
                className="w-full bg-surface-container px-3 py-2 rounded-xl border border-surface-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface-variant mb-1">نسبة عمولة المبيعات المنسوبة (%)</label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                className="w-full bg-surface-container px-3 py-2 rounded-xl border border-surface-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[11px] text-on-surface-variant mb-1">عدد المقاعد المتاحة</label>
              <input
                type="number"
                value={creatorSlots}
                onChange={(e) => setCreatorSlots(e.target.value)}
                className="w-full bg-surface-container px-3 py-2 rounded-xl border border-surface-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
          <span>نشر الحملة في ستوديو صناع المحتوى الآن</span>
        </button>
      </form>
    </div>
  );
}
