import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UgcService } from '../services/UgcService';
import { useEffect } from 'react';
import DesktopCreatorAnalytics from '../components/desktop/DesktopCreatorAnalytics';

export default function CreatorStudio() {
  const { setActiveTab, user } = useApp();
  const [campaignsList, setCampaignsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  
  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      const data = await UgcService.getCampaigns();
      setCampaignsList(data);
      // In a real app we would also fetch user applications to populate appliedIds
      setAppliedIds(data.filter(c => c.status === 'applied').map(c => c.id));
      setLoading(false);
    };
    loadCampaigns();
  }, []);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState('');

  

  const handleApply = async (id) => {
    if (!user) {
      alert("Please sign in to apply");
      return;
    }
    if (!appliedIds.includes(id)) {
      await UgcService.applyForCampaign(id, user.id);
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
      <div className="hidden md:block w-full max-w-[1780px] mx-auto px-4 md:px-8 py-6">
        <div className="rounded-3xl border border-gray-200/90 bg-white shadow-sm overflow-hidden">
          <DesktopCreatorAnalytics />
        </div>
      </div>

      {/* 2. MOBILE VIEW (Mobile Creator Studio) */}
      <div className="md:hidden w-full flex-1 max-w-5xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-slate-900 text-right font-sans">
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
            {campaignsList.map((camp) => (
              <div key={camp.id} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#d00000]">{camp.merchants?.name || camp.merchant_name || 'Brand'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {(camp.slots_available || 0) + ' Slots left'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">{camp.title}</h4>
                <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <p><span className="font-bold text-slate-700">المنتج:</span> {camp.products?.title || 'Product Name'}</p>
                  <p><span className="font-bold text-slate-700">المكافأة:</span> {camp.reward_type === 'free_product' ? 'Free Product' : (camp.reward_type || 'Reward')}</p>
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
