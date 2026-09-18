import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UgcService } from '../services/UgcService';

export default function MerchantCampaign() {
  const { setActiveTab, user, merchants, products, selectedMerchantId, language } = useApp();
  const isAr = language === 'ar';

  const [activeSubTab, setActiveSubTab] = useState('campaigns'); // 'campaigns' | 'create' | 'applications'
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');

  // Find active merchant profile
  const currentMerchant = merchants?.find(m => 
    m.id === user?.merchant_id || 
    m.id === selectedMerchantId || 
    m.user_id === user?.id
  ) || merchants?.[0];

  const merchantProducts = (products || []).filter(p => 
    p.merchantId === currentMerchant?.id || 
    p.merchant_id === currentMerchant?.id
  );
  const displayProducts = merchantProducts.length > 0 ? merchantProducts : (products || []).slice(0, 6);

  // Form State for New Campaign
  const [selectedProductId, setSelectedProductId] = useState(displayProducts[0]?.id || '');
  const [campaignTitle, setCampaignTitle] = useState('حملة ريلز استعراض كولكشن الكتان الصيفي 2026');
  const [campaignTitleEn, setCampaignTitleEn] = useState('Linen Summer 2026 Launch Campaign');
  const [brief, setBrief] = useState('مطلوب فيديو ريلز عمودي احترافي (9:16) يبرز فخامة الكتان الطبيعي في إضاءة النهار، مع تنسيق كامل وكود الخصم في الوصف.');
  const [rewardType, setRewardType] = useState('hybrid'); // 'hybrid' | 'fixed' | 'commission' | 'free_product'
  const [fixedAmount, setFixedAmount] = useState('1200');
  const [commissionRate, setCommissionRate] = useState('15');
  const [creatorSlots, setCreatorSlots] = useState('5');
  const [deadline, setDeadline] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21);
    return d.toISOString().split('T')[0];
  });

  // Action review state
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [activeReviewingAppId, setActiveReviewingAppId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Load merchant campaigns & applications
  const loadCampaignsAndApps = async () => {
    setLoading(true);
    try {
      const [camps, apps] = await Promise.all([
        UgcService.getCampaigns(currentMerchant?.id),
        UgcService.getApplications(null, currentMerchant?.id)
      ]);
      setCampaigns(camps);
      setApplications(apps);
    } catch (err) {
      console.error('Failed loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaignsAndApps();
  }, [currentMerchant?.id]);

  // Handler: Create Campaign
  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const targetProd = displayProducts.find(p => p.id === selectedProductId) || displayProducts[0];

      let rewardLabel = `${fixedAmount} ج.م كاش + ${commissionRate}% عمولة`;
      if (rewardType === 'fixed') rewardLabel = `${fixedAmount} ج.م كاش ثابت`;
      if (rewardType === 'commission') rewardLabel = `${commissionRate}% عمولة على المبيعات`;
      if (rewardType === 'free_product') rewardLabel = 'طقم كامل مجاني';

      const newCampaignData = {
        title: campaignTitle,
        titleEn: campaignTitleEn,
        brandName: currentMerchant?.name || currentMerchant?.shortName || 'متجر معتمد',
        brandLogo: currentMerchant?.logo || '/images/brands/talieska_logo.jpg',
        merchantId: currentMerchant?.id || 'm-01',
        productId: targetProd?.id,
        productName: targetProd?.title || targetProd?.name || 'منتج مختار',
        rewardType,
        rewardLabel,
        fixedAmount,
        commissionRate,
        creatorSlots: parseInt(creatorSlots, 10) || 5,
        deadline,
        brief
      };

      await UgcService.createCampaign(newCampaignData);
      await loadCampaignsAndApps();
      showToast(isAr ? 'تم إطلاق حملة صناع المحتوى بنجاح ونشرها في Creator Studio! 🚀' : 'Campaign launched and published to Creator Studio!');
      setActiveSubTab('campaigns');
    } catch (err) {
      console.error('Error creating campaign:', err);
      showToast(isAr ? 'حدث خطأ أثناء حفظ الحملة' : 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  // Handler: Toggle Campaign Status (Active / Paused)
  const handleToggleStatus = async (campaign) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    await UgcService.updateCampaign(campaign.id, { status: newStatus });
    await loadCampaignsAndApps();
    showToast(newStatus === 'active' ? 'تم تنشيط الحملة واستقبال طلبات جديدة' : 'تم إيقاف الحملة مؤقتاً');
  };

  // Handler: Delete Campaign
  const handleDeleteCampaign = async (campaignId) => {
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذه الحملة وجميع الطلبات المرتبطة بها؟' : 'Are you sure you want to delete this campaign?')) {
      await UgcService.deleteCampaign(campaignId);
      await loadCampaignsAndApps();
      showToast(isAr ? 'تم حذف الحملة بنجاح' : 'Campaign deleted');
    }
  };

  // Handler: Approve Creator Application
  const handleApproveApplication = async (appId) => {
    await UgcService.reviewApplication(appId, 'approved', 'تم قبول طلبك! يمكنك الآن البدء في تصوير الفيديو وإرسال المسودة.');
    await loadCampaignsAndApps();
    showToast(isAr ? 'تم قبول طلب صانع المحتوى بنجاح! تم إشعاره لتقديم مسودة الفيديو. ✨' : 'Creator approved for campaign!');
  };

  // Handler: Reject Creator Application
  const handleRejectApplication = async (appId) => {
    await UgcService.reviewApplication(appId, 'rejected', 'نعتذر، اكتمل عدد المقاعد المتاحة لهذه الحملة.');
    await loadCampaignsAndApps();
    showToast(isAr ? 'تم الاعتذار عن الطلب' : 'Application declined');
  };

  // Handler: Approve Draft Video and Publish Live to Reels!
  const handleApproveDraftAndPublish = async (app) => {
    setLoading(true);
    try {
      await UgcService.approveDraftAndPublish(app.campaignId, app.id, reviewFeedback || 'تم اعتماد الفيديو ونشره بنجاح في المنصة!');
      await loadCampaignsAndApps();
      setActiveReviewingAppId(null);
      setReviewFeedback('');
      showToast(isAr ? 'تم اعتماد الفيديو ونشره فوراً في ريلز المنصة الرئيسية! 🎉🚀' : 'Draft approved and published live to Reels feed!');
    } catch (err) {
      console.error('Error approving draft:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered applications
  const filteredApplications = applications.filter(app => {
    if (selectedCampaignFilter === 'all') return true;
    return app.campaignId === selectedCampaignFilter;
  });

  const activeCampaignsCount = campaigns.filter(c => c.status === 'active').length;
  const pendingReviewDraftsCount = applications.filter(a => a.status === 'draft_submitted').length;
  const completedUgcCount = applications.filter(a => a.status === 'completed').length;

  return (
    <div className="w-full flex-1 max-w-6xl mx-auto px-4 md:px-8 py-6 pb-28 text-slate-900 text-right font-sans" dir="rtl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce border border-slate-700">
          <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-50 via-white to-amber-50 rounded-3xl border border-red-100 p-6 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#d00000] text-white text-[10px] font-extrabold uppercase tracking-wide">
                Merchant UGC Center
              </span>
              <span className="text-xs text-gray-500 font-bold">
                {currentMerchant?.name || 'متجر معتمد'}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">
              مركز حملات صناع المحتوى (UGC Campaigns)
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
              اربط منتجات متجرك بأفضل المبدعين وصناع الريلز في مصر، راجع المسودات المصورة، واعتمد نشر الفيديوهات التسويقية لزيادة مبيعاتك فوراً.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('create')}
              className="px-4 py-2.5 rounded-xl bg-[#d00000] hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">add_circle</span>
              <span>إطلاق حملة جديدة</span>
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1"
            >
              <span>ستوديو الصناع</span>
              <span className="material-symbols-outlined text-[15px] rtl:rotate-180">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* 4 Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-gray-200/70">
          <div className="bg-white/80 p-3 rounded-2xl border border-gray-100 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 block">الحملات النشطة</span>
            <span className="text-lg font-black text-slate-900">{activeCampaignsCount}</span>
          </div>
          <div className="bg-white/80 p-3 rounded-2xl border border-gray-100 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 block">إجمالي طلبات الانضمام</span>
            <span className="text-lg font-black text-blue-600">{applications.length}</span>
          </div>
          <div className="bg-white/80 p-3 rounded-2xl border border-gray-100 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 block">مسودات بانتظار الاعتماد</span>
            <span className="text-lg font-black text-amber-600">{pendingReviewDraftsCount}</span>
          </div>
          <div className="bg-white/80 p-3 rounded-2xl border border-gray-100 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 block">ريلز معتمد ومنشور</span>
            <span className="text-lg font-black text-emerald-600">{completedUgcCount}</span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-6">
        {[
          { id: 'campaigns', label: 'حملاتي وإدارتها', icon: 'campaign', count: campaigns.length },
          { id: 'create', label: 'إطلاق حملة جديدة', icon: 'rocket_launch' },
          { id: 'applications', label: 'طلبات ومسودات الصناع', icon: 'reviews', count: applications.length, badge: pendingReviewDraftsCount > 0 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeSubTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeSubTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: CAMPAIGNS LIST */}
      {activeSubTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800">
              قائمة الحملات المسجلة لـ {currentMerchant?.name || 'متجرك'}
            </h3>
            <span className="text-xs text-gray-500">
              إجمالي {campaigns.length} حملة
            </span>
          </div>

          {campaigns.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-red-50 text-[#d00000] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">campaign</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">لم تطلق أي حملات محتوى بعد</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                ابدأ بتحديد أحد منتجاتك وحدد المكافأة المالية ونسبة العمولة لاستقطاب المبدعين.
              </p>
              <button
                onClick={() => setActiveSubTab('create')}
                className="px-5 py-2.5 rounded-xl bg-[#d00000] text-white font-bold text-xs hover:bg-red-700 transition-all shadow-xs"
              >
                إطلاق أول حملة الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((camp) => (
                <div 
                  key={camp.id}
                  className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-all space-y-3.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Status & Deadline Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        camp.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {camp.status === 'active' ? 'حملة نشطة' : 'متوقفة مؤقتاً'}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">event</span>
                        <span>حتى {camp.deadline}</span>
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 leading-tight">
                      {camp.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {camp.guidelines}
                    </p>

                    {/* Product & Reward pills */}
                    <div className="mt-3.5 p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-[#d00000]">checkroom</span>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 block font-bold">المنتج المستهدف</span>
                          <span className="text-xs font-bold text-slate-800">{camp.productName}</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 block font-bold">المقابل المالي</span>
                        <span className="text-xs font-black text-[#d00000]">{camp.rewardLabel}</span>
                      </div>
                    </div>

                    {/* Slots progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                        <span>المقاعد المتاحة للصناع</span>
                        <span className="font-bold text-slate-800">{camp.slotsAvailable} من {camp.slotsTotal || camp.slotsAvailable} مقاعد</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-slate-900 rounded-full"
                          style={{ width: `${Math.max(15, (1 - ((camp.slotsAvailable || 0) / (camp.slotsTotal || 5))) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedCampaignFilter(camp.id);
                        setActiveSubTab('applications');
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">group</span>
                      <span>عرض المتقدمين ({applications.filter(a => a.campaignId === camp.id).length})</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(camp)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          camp.status === 'active'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {camp.status === 'active' ? 'إيقاف مؤقت' : 'تنشيط'}
                      </button>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id)}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="حذف الحملة"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE CAMPAIGN WIZARD */}
      {activeSubTab === 'create' && (
        <form onSubmit={handleCreateCampaign} className="space-y-6">
          {/* 1. Target Product Selection */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">1. اختيار المنتج المستهدف للترويج</h3>
                <p className="text-xs text-gray-500">اختر المنتج الذي ترغب في استلام ريلز تسويقية وتنسيقات له</p>
              </div>
              <span className="text-[11px] font-bold text-gray-400">{displayProducts.length} منتجات متاحة</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {displayProducts.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProductId(prod.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    selectedProductId === prod.id
                      ? 'border-[#d00000] bg-red-50/40 ring-1 ring-[#d00000]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <img
                    src={prod.image || prod.img || '/images/products/linen_abaya.jpg'}
                    alt={prod.title || prod.name}
                    className="w-12 h-14 rounded-xl object-cover border border-black/5 bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{prod.title || prod.name}</h5>
                    <span className="text-xs font-black text-[#d00000] block mt-0.5">
                      {typeof prod.price === 'number' ? `${prod.price.toLocaleString()} ج.م` : prod.price}
                    </span>
                    <span className="text-[10px] text-gray-400 block truncate">{prod.category || 'أزياء'}</span>
                  </div>
                  {selectedProductId === prod.id && (
                    <span className="material-symbols-outlined text-[#d00000] text-[20px] shrink-0">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Campaign Details & Brief */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">2. تفاصيل الحملة وتعليمات صانع المحتوى (Creative Brief)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">عنوان الحملة (بالعربية)</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#d00000] focus:bg-white transition-all font-bold"
                  placeholder="مثال: حملة كولكشن الصيف للكتان"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Campaign Title (English)</label>
                <input
                  type="text"
                  value={campaignTitleEn}
                  onChange={(e) => setCampaignTitleEn(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#d00000] focus:bg-white transition-all text-left"
                  placeholder="e.g. Summer Linen Collection Launch"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">شروط وتعليمات التصوير والستايلينج (Brief)</label>
              <textarea
                rows={3}
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#d00000] focus:bg-white transition-all leading-relaxed"
                placeholder="وضّح للمبدعين زوايا التصوير المطلوبة، الإضاءة، كود الخصم، والرسالة الأساسية..."
                required
              />
            </div>
          </div>

          {/* 3. Compensation & Slots */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">3. نموذج التعاقد والمكافأة المالية للصناع</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'hybrid', title: 'Hybrid هجين', desc: 'كاش ثابت + عمولة مبيعات' },
                { id: 'fixed', title: 'Fixed كاش فقط', desc: 'مبلغ مالي محدد لكل فيديو' },
                { id: 'commission', title: 'Commission عمولة', desc: 'نسبة على كل مبيعة من الريلز' },
                { id: 'free_product', title: 'Free Outfit فقط', desc: 'إهداء المنتج بدون أجر إضافي' }
              ].map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setRewardType(type.id)}
                  className={`p-3 rounded-2xl border text-right transition-all ${
                    rewardType === type.id
                      ? 'border-[#d00000] bg-red-50/50 text-[#d00000] font-bold shadow-2xs'
                      : 'border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-white'
                  }`}
                >
                  <span className="block text-xs font-black">{type.title}</span>
                  <span className="block text-[10px] text-gray-400 mt-0.5">{type.desc}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">المبلغ الثابت (ج.م EGP)</label>
                <input
                  type="number"
                  value={fixedAmount}
                  disabled={rewardType === 'commission' || rewardType === 'free_product'}
                  onChange={(e) => setFixedAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#d00000] disabled:opacity-40"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">نسبة العمولة (%)</label>
                <input
                  type="number"
                  value={commissionRate}
                  disabled={rewardType === 'fixed' || rewardType === 'free_product'}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#d00000] disabled:opacity-40"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">عدد المقاعد المتاحة</label>
                <input
                  type="number"
                  value={creatorSlots}
                  onChange={(e) => setCreatorSlots(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#d00000]"
                  min="1"
                  max="50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">الموعد النهائي للتقديم واستلام الفيديوهات</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#d00000]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveSubTab('campaigns')}
              className="px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-[#d00000] hover:bg-red-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              <span>{loading ? 'جاري نشر الحملة...' : 'إطلاق الحملة ونشرها للصناع الآن'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: APPLICATIONS & VIDEO DRAFTS REVIEW */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-gray-200">
            <div>
              <h3 className="text-sm font-black text-slate-900">طلبات التقديم ومسودات الفيديوهات</h3>
              <p className="text-xs text-gray-500">راجع المبدعين المتقدمين، واعتمد مسودات الريلز لنشرها مباشرة</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500">تصفية حسب الحملة:</label>
              <select
                value={selectedCampaignFilter}
                onChange={(e) => setSelectedCampaignFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="all">كل الحملات ({applications.length})</option>
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">reviews</span>
              <h4 className="text-sm font-bold text-slate-800">لا توجد طلبات تقديم حتى الآن</h4>
              <p className="text-xs text-gray-400 mt-1">ستظهر هنا طلبات المبدعين ومسودات الفيديوهات بمجرد إرسالها.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map(app => (
                <div
                  key={app.id}
                  className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4 hover:border-gray-300 transition-all"
                >
                  {/* Creator Info Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.creatorAvatar || '/images/reels/reel_1.jpg'}
                        alt={app.creatorName}
                        className="w-12 h-12 rounded-2xl object-cover ring-1 ring-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-black text-slate-900">{app.creatorName}</h4>
                          <span className="text-[10px] text-gray-400 font-mono" dir="ltr">{app.creatorHandle}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500 font-medium">
                          <span>{app.creatorNiche}</span>
                          <span>•</span>
                          <span>{app.creatorFollowers} متابع</span>
                          <span>•</span>
                          <span>{app.creatorCity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                        app.status === 'draft_submitted'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                          : app.status === 'approved'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : app.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {app.status === 'draft_submitted' && '🎬 مسودة فيديو جاهزة للاعتماد'}
                        {app.status === 'applied' && 'طلب انضمام جديد'}
                        {app.status === 'approved' && 'تم القبول (بانتظار تصوير المسودة)'}
                        {app.status === 'completed' && '🚀 معتمد ومنشور في الريلز'}
                        {app.status === 'rejected' && 'تم الاعتذار'}
                      </span>
                    </div>
                  </div>

                  {/* Campaign Target & Creator Pitch */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold block mb-0.5">الحملة</span>
                      <span className="font-bold text-slate-800">{app.campaignTitle}</span>
                      <span className="text-[10px] text-gray-400 block mt-1">تاريخ التقديم: {app.appliedAt}</span>
                    </div>

                    <div className="md:col-span-2 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                      <span className="text-[10px] text-gray-400 font-bold block mb-0.5">ملاحظات ورؤية صانع المحتوى</span>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        "{app.notes || 'متحمسة جداً للتعاون واستعراض خامات المنتج في فيديو احترافي.'}"
                      </p>
                    </div>
                  </div>

                  {/* Video Draft Preview Section if draft_submitted or completed */}
                  {(app.status === 'draft_submitted' || app.status === 'completed') && (
                    <div className="p-4 rounded-2xl bg-red-50/40 border border-red-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                          <span className="material-symbols-outlined text-[#d00000]">play_circle</span>
                          <span>مسودة الفيديو المرسلة للمراجعة</span>
                        </div>
                        {app.submittedUrl && (
                          <span className="text-[10px] text-gray-400 font-mono" dir="ltr">{app.submittedUrl}</span>
                        )}
                      </div>

                      {app.draftNotes && (
                        <p className="text-xs text-gray-600 bg-white p-2.5 rounded-xl border border-red-100/60">
                          <span className="font-bold text-slate-800">ملاحظات المسودة: </span>
                          {app.draftNotes}
                        </p>
                      )}

                      {/* Video Player / Mock */}
                      <div className="relative rounded-2xl overflow-hidden bg-black max-w-sm mx-auto aspect-[9/16] max-h-72 shadow-md flex items-center justify-center">
                        <video
                          src={app.submittedUrl || '/images/reels/linen_abaya.mp4'}
                          controls
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Approval Box if Draft Submitted */}
                      {app.status === 'draft_submitted' && (
                        <div className="pt-2 border-t border-red-100 space-y-2">
                          <input
                            type="text"
                            value={activeReviewingAppId === app.id ? reviewFeedback : ''}
                            onChange={(e) => {
                              setActiveReviewingAppId(app.id);
                              setReviewFeedback(e.target.value);
                            }}
                            placeholder="اكتب ملاحظاتك أو كلمة شكر للمبدع (اختياري)..."
                            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#d00000]"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveDraftAndPublish(app)}
                              disabled={loading}
                              className="px-5 py-2 rounded-xl bg-[#d00000] hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[16px]">verified</span>
                              <span>اعتماد الفيديو ونشره فوراً في الريلز 🚀</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Initial Application Action (Approve / Reject) */}
                  {app.status === 'applied' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleRejectApplication(app.id)}
                        className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all"
                      >
                        اعتذار
                      </button>
                      <button
                        onClick={() => handleApproveApplication(app.id)}
                        className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[15px]">check</span>
                        <span>قبول الطلب وتأكيد المقعد</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
