import React, { useState, useEffect, useMemo } from 'react';
import { algorithmConfig, ALGORITHM_PRESETS, DEFAULT_EVENT_WEIGHTS } from '../../services/algorithm/algorithmConfig.js';
import { eventTracker } from '../../services/analytics/eventTracker.js';
import { feedService } from '../../services/algorithm/feedService.js';
import { reelService } from '../../services/social/reelService.js';
import { ReelsService } from '../../services/ReelsService.js';

export default function AlgorithmManagerTab({ isAr, showToast, user, stores = [], creators = [] }) {
  // Config state synced with algorithmConfig singleton
  const [config, setConfig] = useState(() => algorithmConfig.getConfig());
  const [weights, setWeights] = useState(() => ({ ...algorithmConfig.getWeights() }));
  const [penalties, setPenalties] = useState(() => ({ ...algorithmConfig.getPenalties() }));
  const [diversity, setDiversity] = useState(() => ({ ...algorithmConfig.getDiversityConfig() }));
  const [eventWeights, setEventWeights] = useState(() => ({ ...algorithmConfig.getEventWeights() }));

  // Live Event Stream State
  const [liveEvents, setLiveEvents] = useState(() => eventTracker.getLocalEvents().slice(0, 30));
  const [eventFilter, setEventFilter] = useState('all');
  const [isSimulatingEvent, setIsSimulatingEvent] = useState(false);
  const [selectedDemoEventType, setSelectedDemoEventType] = useState('purchase');

  // Feed Simulator State
  const [simTab, setSimTab] = useState('foryou');
  const [simulatedFeed, setSimulatedFeed] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeInspectorItem, setActiveInspectorItem] = useState(null);

  // Active sub-tab inside Algorithm Manager: 'strategy' | 'weights' | 'events' | 'stream' | 'simulator'
  const [subTab, setSubTab] = useState('strategy');

  // Listen to configuration updates
  useEffect(() => {
    const unsub = algorithmConfig.subscribe((updated) => {
      setConfig({ ...updated });
      setWeights({ ...updated.weights });
      setPenalties({ ...updated.penalties });
      setDiversity({ ...updated.diversity });
      setEventWeights({ ...updated.eventWeights });
    });
    return () => unsub();
  }, []);

  // Listen to live event bus
  useEffect(() => {
    const unsub = eventTracker.subscribe((newEvent) => {
      setLiveEvents((prev) => [newEvent, ...prev].slice(0, 50));
    });
    return () => unsub();
  }, []);

  // Run initial feed simulation
  useEffect(() => {
    runFeedSimulation(simTab);
  }, [simTab]);

  // Execute Feed Simulator
  const runFeedSimulation = async (targetTab = simTab) => {
    setIsSimulating(true);
    try {
      // Get base or fallback reels to guarantee feed contents
      const dbOrLocalReels = await reelService.getReels();
      let fallback = [];
      if (!dbOrLocalReels || dbOrLocalReels.length === 0) {
        fallback = await ReelsService.getReels();
      }

      const result = await feedService.getPersonalizedFeed({
        userId: user?.id || 'superadmin-inspector',
        tab: targetTab,
        limit: 8,
        fallbackReels: fallback
      });

      setSimulatedFeed(result.items || []);
      if (result.items && result.items.length > 0) {
        setActiveInspectorItem(result.items[0]);
      } else {
        setActiveInspectorItem(null);
      }
    } catch (err) {
      console.warn('Feed simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Calculate sum of weights
  const totalWeightPercent = useMemo(() => {
    const sum = Object.values(weights).reduce((acc, val) => acc + (Number(val) || 0), 0);
    return Math.round(sum * 100);
  }, [weights]);

  // Normalize weights to exactly 1.0 (100%)
  const handleAutoNormalizeWeights = () => {
    const sum = Object.values(weights).reduce((acc, val) => acc + (Number(val) || 0), 0);
    if (sum <= 0) return;

    const normalized = {};
    for (const [key, val] of Object.entries(weights)) {
      normalized[key] = Number((val / sum).toFixed(2));
    }
    setWeights(normalized);
    algorithmConfig.updateWeights(normalized);
    showToast(isAr ? 'تم ضبط وموازنة الأوزان تلقائياً إلى 100%' : 'Weights automatically normalized to 100%');
    runFeedSimulation();
  };

  // Apply a Preset
  const handleApplyPreset = (presetKey) => {
    algorithmConfig.applyPreset(presetKey);
    const updated = algorithmConfig.getConfig();
    setConfig({ ...updated });
    setWeights({ ...updated.weights });
    setPenalties({ ...updated.penalties });
    setDiversity({ ...updated.diversity });
    showToast(isAr ? `تم تفعيل نمط: ${ALGORITHM_PRESETS[presetKey]?.nameAr || presetKey}` : `Activated Preset: ${ALGORITHM_PRESETS[presetKey]?.nameEn || presetKey}`);
    runFeedSimulation();
  };

  // Save Custom Weights
  const handleSaveWeights = () => {
    algorithmConfig.updateWeights(weights);
    algorithmConfig.updatePenalties(penalties);
    algorithmConfig.updateDiversity(diversity);
    showToast(isAr ? 'تم حفظ وتطبيق أوزان الخوارزمية بنجاح ✓' : 'Algorithm weights & penalties deployed successfully ✓');
    runFeedSimulation();
  };

  // Save Event Rewards
  const handleSaveEventWeights = () => {
    algorithmConfig.updateEventWeights(eventWeights);
    showToast(isAr ? 'تم تحديث مصفوفة نقاط الأحداث اللحظية ✓' : 'Live event reward matrix updated ✓');
  };

  // Reset Everything to Defaults
  const handleResetToDefaults = () => {
    if (window.confirm(isAr ? 'هل تريد استعادة إعدادات الخوارزمية الافتراضية للوضع المتوازن؟' : 'Reset algorithm to Balanced default settings?')) {
      algorithmConfig.resetToDefaults();
      showToast(isAr ? 'تمت استعادة الإعدادات الافتراضية بنجاح' : 'Reset to default configuration');
      runFeedSimulation();
    }
  };

  // Simulate an Event on the Event Bus
  const handleSimulateDemoEvent = async () => {
    setIsSimulatingEvent(true);
    try {
      const mockReels = simulatedFeed.length > 0 
        ? simulatedFeed.map(f => f.reel) 
        : [{ id: 'reel-demo-citrine', caption: 'Citrine Linen Blazer Drop' }];
      const sampleReel = mockReels[Math.floor(Math.random() * mockReels.length)];

      await eventTracker.trackEvent(selectedDemoEventType, {
        userId: user?.id || 'demo_user_cairo',
        reelId: sampleReel?.id || 'reel-demo-citrine',
        productId: sampleReel?.products?.[0]?.id || 'p-fashion-blazer',
        creatorId: sampleReel?.creatorId || 'creator-maya',
        merchantId: sampleReel?.merchantId || 'merchant-talieska',
        position: 1,
        durationMs: 4200,
        metadata: {
          note: 'SuperAdmin Real-time Sandbox Trigger',
          triggerTime: new Date().toLocaleTimeString()
        }
      });

      showToast(isAr ? `تم بث حدث (${selectedDemoEventType}) بنجاح على الناقل الحي` : `Demo event (${selectedDemoEventType}) dispatched to live bus`);
    } catch (e) {
      console.warn('Simulated event dispatch failed:', e);
    } finally {
      setIsSimulatingEvent(false);
    }
  };

  // Filtered Live Events
  const filteredLiveEvents = useMemo(() => {
    if (eventFilter === 'all') return liveEvents;
    if (eventFilter === 'commerce') {
      return liveEvents.filter(e => ['product_click', 'quick_buy_open', 'add_to_cart', 'purchase'].includes(e.event_type));
    }
    if (eventFilter === 'video') {
      return liveEvents.filter(e => e.event_type.startsWith('reel_') && !['reel_skip', 'reel_not_interested'].includes(e.event_type));
    }
    if (eventFilter === 'negative') {
      return liveEvents.filter(e => ['reel_skip', 'reel_not_interested', 'report'].includes(e.event_type));
    }
    return liveEvents;
  }, [liveEvents, eventFilter]);

  // Helper badge color for event types
  const getEventBadge = (type) => {
    if (['purchase', 'add_to_cart'].includes(type)) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    if (['quick_buy_open', 'product_click'].includes(type)) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    if (['reel_complete', 'reel_rewatch', 'reel_like', 'reel_save', 'reel_share'].includes(type)) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (['reel_skip', 'reel_not_interested'].includes(type)) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Live Engine Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <span className="material-symbols-outlined text-[22px]">neurology</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-black">
                    {isAr ? 'محرك التوصيات والخوارزمية الذكية' : 'Social-Commerce Recommendation Engine'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    ENGINE v1.2 LIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isAr 
                    ? 'التحكم المركزي في أوزان الرانكينج، قيود التنوع، عقوبات السكيب، ونقاط تدريب الاهتمامات اللحظية' 
                    : 'Central control for ranking weights, diversity guardrails, skip penalties, and live interest learning'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetToDefaults}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 backdrop-blur-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>{isAr ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
            </button>

            <button
              onClick={handleSaveWeights}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>{isAr ? 'حفظ ونشر التعديلات فوراً' : 'Save & Deploy Live'}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 block">{isAr ? 'النمط الحالي المفعل' : 'Active Strategy Preset'}</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              <span className="text-sm font-bold text-white capitalize">
                {ALGORITHM_PRESETS[config.preset]?.nameAr || config.preset}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 block">{isAr ? 'أحداث تفاعل المستخدمين المرصودة' : 'Live Tracked Events'}</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
              {liveEvents.length} <span className="text-xs text-slate-400 font-normal">حدث محفوظ</span>
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 block">{isAr ? 'وزن التحويل التجاري' : 'Commerce Weight'}</span>
            <span className="text-lg font-bold font-mono text-amber-400 mt-1 block">
              {Math.round((weights.commerceProbability || 0) * 100)}%
            </span>
          </div>

          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5 backdrop-blur-xs">
            <span className="text-[11px] text-slate-400 block">{isAr ? 'عقوبة التخطي السريع' : 'Skip Penalty Multiplier'}</span>
            <span className="text-lg font-bold font-mono text-rose-400 mt-1 block">
              -{Math.round((penalties.skip || 0) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs within Algorithm Control Panel */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto hide-scrollbar">
        {[
          { id: 'strategy', icon: 'auto_mode', label: isAr ? '1. أنماط الاستراتيجية الجاهزة' : '1. Strategy Presets' },
          { id: 'weights', icon: 'tune', label: isAr ? '2. أوزان الرانكينج والقيود' : '2. Live Weights & Penalties' },
          { id: 'events', icon: 'military_tech', label: isAr ? '3. مصفوفة تدريب النقاط' : '3. Event Learning Matrix' },
          { id: 'stream', icon: 'sensors', label: isAr ? '4. مراقب الأحداث اللحظي' : '4. Live Event Stream', count: liveEvents.length },
          { id: 'simulator', icon: 'preview', label: isAr ? '5. محاكي ومختبر الفيد' : '5. Feed Simulator & Inspector' }
        ].map((tab) => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-white text-gray-600 hover:bg-gray-100/80 border border-gray-200'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: STRATEGY PRESETS */}
      {/* ========================================================================= */}
      {subTab === 'strategy' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isAr ? 'أنماط خوارزمية التشغيل السريع (One-Click Algorithm Presets)' : 'One-Click Algorithm Presets'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {isAr 
                    ? 'اختر النمط المناسب لأهداف المنصة الحالية. كل نمط يغير تلقائياً معادلة الرانكينج وأولويات الفيد.' 
                    : 'Choose the preset matching platform operational goals. Each preset rebalances ranking priorities.'}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold font-mono">
                {isAr ? `النمط الفعال الآن: ${ALGORITHM_PRESETS[config.preset]?.nameAr || config.preset}` : `Active: ${ALGORITHM_PRESETS[config.preset]?.nameEn || config.preset}`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(ALGORITHM_PRESETS).map((preset) => {
                const isSelected = config.preset === preset.id;
                return (
                  <div
                    key={preset.id}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/30 shadow-md ring-2 ring-indigo-500/20' 
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                    }`}
                    onClick={() => handleApplyPreset(preset.id)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${
                            preset.id === 'balanced' ? 'bg-blue-500' :
                            preset.id === 'commerce_heavy' ? 'bg-amber-500' :
                            preset.id === 'creator_discovery' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}></span>
                          <h4 className="font-bold text-sm text-slate-900">
                            {isAr ? preset.nameAr : preset.nameEn}
                          </h4>
                        </div>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                            {isAr ? 'مفعل حالياً ✓' : 'ACTIVE ✓'}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        {isAr ? preset.descriptionAr : preset.descriptionEn}
                      </p>

                      {/* Weight tags breakdown */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        <span className="px-2 py-0.5 rounded bg-white text-gray-600 border border-gray-200 text-[10px] font-mono">
                          {isAr ? 'الاهتمام' : 'Interest'}: {Math.round(preset.weights.interest * 100)}%
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white text-gray-600 border border-gray-200 text-[10px] font-mono">
                          {isAr ? 'المبدع' : 'Creator'}: {Math.round(preset.weights.creatorAffinity * 100)}%
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white text-gray-600 border border-gray-200 text-[10px] font-mono">
                          {isAr ? 'التجارة' : 'Commerce'}: {Math.round(preset.weights.commerceProbability * 100)}%
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white text-gray-600 border border-gray-200 text-[10px] font-mono">
                          {isAr ? 'المشاهدة' : 'Watch'}: {Math.round(preset.weights.watchProbability * 100)}%
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white text-gray-600 border border-gray-200 text-[10px] font-mono">
                          {isAr ? 'الحداثة' : 'Freshness'}: {Math.round(preset.weights.freshness * 100)}%
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleApplyPreset(preset.id); }}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isSelected ? 'task_alt' : 'touch_app'}
                      </span>
                      <span>
                        {isSelected 
                          ? (isAr ? 'النمط الفعال حالياً' : 'Currently Active') 
                          : (isAr ? 'تفعيل هذا النمط الآن' : 'Activate This Preset')}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: LIVE WEIGHTS & PENALTIES */}
      {/* ========================================================================= */}
      {subTab === 'weights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: Ranking Factor Weights */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {isAr ? 'أوزان معادلة الرانكينج (Ranking Scoring Weights)' : 'Ranking Scoring Weights'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isAr ? 'حدد نسبة تأثير كل عامل في ترتيب فيديوهات الفيد' : 'Adjust the proportional impact of each ranking signal'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
                    totalWeightPercent === 100 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {isAr ? `المجموع: ${totalWeightPercent}%` : `Total: ${totalWeightPercent}%`}
                  </span>

                  {totalWeightPercent !== 100 && (
                    <button
                      onClick={handleAutoNormalizeWeights}
                      className="px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1 transition-colors"
                      title={isAr ? 'موازنة النسب تلقائياً إلى 100%' : 'Normalize to 100%'}
                    >
                      <span className="material-symbols-outlined text-[14px]">balance</span>
                      <span>{isAr ? 'موازنة' : 'Normalize'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-4">
                {[
                  { key: 'interest', labelAr: 'توافق اهتمامات المستخدم والتصنيفات', labelEn: 'User Interest Affinity', desc: 'مطابقة الفئات وتاريخ الشراء', icon: 'interests', color: 'indigo' },
                  { key: 'creatorAffinity', labelAr: 'ألفة صانع المحتوى والتفاعل السابق', labelEn: 'Creator Affinity', desc: 'متابعة الصانع وتاريخ اللايكات', icon: 'verified_user', color: 'blue' },
                  { key: 'commerceProbability', labelAr: 'الدافع التجاري والمنتجات المربوطة', labelEn: 'Commerce Conversion Prob', desc: 'المنتجات المميزة وعروض التخفيض', icon: 'shopping_bag', color: 'emerald' },
                  { key: 'watchProbability', labelAr: 'احتمالية إكمال المشاهدة (Watch 75-100%)', labelEn: 'Watch Completion Prob', desc: 'التنبؤ بعدم التخطي السريع', icon: 'play_circle', color: 'purple' },
                  { key: 'engagementQuality', labelAr: 'جودة التفاعل المباشر (إعجاب، حفظ، مشاركة)', labelEn: 'Engagement Quality', desc: 'معدل الحفظ والمشاركة العضوي', icon: 'favorite', color: 'rose' },
                  { key: 'freshness', labelAr: 'حداثة الفيديو وسرعة النشر (Freshness)', labelEn: 'Content Freshness', desc: 'أولوية الفيديوهات المنشورة آخر 24-48 ساعة', icon: 'bolt', color: 'amber' },
                  { key: 'trend', labelAr: 'الانتشار الفيروسي والتريند العام (Trend Velocity)', labelEn: 'Trend Velocity', desc: 'المقاطع الأكثر مشاهدة اللحظة', icon: 'trending_up', color: 'cyan' },
                ].map((item) => {
                  const val = weights[item.key] ?? 0;
                  const pct = Math.round(val * 100);
                  return (
                    <div key={item.key} className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100/80">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px] text-slate-700">{item.icon}</span>
                          <span className="font-bold text-xs text-slate-800">{isAr ? item.labelAr : item.labelEn}</span>
                        </div>
                        <span className="font-mono text-xs font-extrabold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                          {pct}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={pct}
                          onChange={(e) => {
                            const newPct = Number(e.target.value);
                            setWeights(prev => ({ ...prev, [item.key]: Number((newPct / 100).toFixed(2)) }));
                          }}
                          className="w-full accent-indigo-600 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 block">{item.desc}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveWeights}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>{isAr ? 'حفظ وتطبيق أوزان الرانكينج' : 'Deploy Ranking Weights'}</span>
                </button>
              </div>
            </div>

            {/* Column 2: Guardrails, Negative Penalties & Diversity */}
            <div className="lg:col-span-5 space-y-6">
              {/* Negative Penalties */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-600 text-[20px]">gavel</span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {isAr ? 'عقوبات السلوك السلبي (Negative Penalties)' : 'Negative Feedback Penalties'}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isAr ? 'تخفيض ترتيب الفيديوهات في حال السكيب أو التكرار' : 'De-ranking factors applied to candidate items'}
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div className="bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-xs text-rose-900">
                        {isAr ? 'عقوبة التخطي السريع (Skip < 3s)' : 'Fast Skip Penalty'}
                      </span>
                      <span className="font-mono text-xs font-bold text-rose-700 bg-white px-2 py-0.5 rounded border border-rose-200">
                        -{Math.round((penalties.skip || 0) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={Math.round((penalties.skip || 0) * 100)}
                      onChange={(e) => {
                        const val = Number(e.target.value) / 100;
                        setPenalties(prev => ({ ...prev, skip: val }));
                      }}
                      className="w-full accent-rose-600 h-1.5 bg-rose-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-rose-600/80 mt-1 block">
                      {isAr ? 'تخفيض درجة الريل مباشرة إذا تخطاه المستخدم في أول 3 ثوانٍ' : 'Discount score if user skips before 3 seconds'}
                    </span>
                  </div>

                  <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-xs text-amber-900">
                        {isAr ? 'عقوبة المشاهدة الحديثة (Recent Seen)' : 'Recently Seen Penalty'}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                        -{Math.round((penalties.recentSeen || 0) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={Math.round((penalties.recentSeen || 0) * 100)}
                      onChange={(e) => {
                        const val = Number(e.target.value) / 100;
                        setPenalties(prev => ({ ...prev, recentSeen: val }));
                      }}
                      className="w-full accent-amber-600 h-1.5 bg-amber-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-[10px] text-amber-700/80 mt-1 block">
                      {isAr ? 'منع تكرار نفس المقطع خلال نفس الجلسة' : 'Prevent repetitive reels in the same user session'}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-xs text-gray-900">
                        {isAr ? 'عقوبة الضغط على "غير مهتم" (Dislike/Hide)' : 'Not Interested / Hide Penalty'}
                      </span>
                      <span className="font-mono text-xs font-bold text-gray-700 bg-white px-2 py-0.5 rounded border border-gray-200">
                        -{Math.round((penalties.negativeFeedback || 0) * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={Math.round((penalties.negativeFeedback || 0) * 100)}
                      onChange={(e) => {
                        const val = Number(e.target.value) / 100;
                        setPenalties(prev => ({ ...prev, negativeFeedback: val }));
                      }}
                      className="w-full accent-slate-800 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Diversity Guardrails */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 text-[20px]">view_agenda</span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {isAr ? 'ضوابط التنوع ومنع الملل (Diversity Guardrails)' : 'Feed Diversity Guardrails'}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isAr ? 'قيود المسافات بين فيديوهات نفس التصنيف أو الصانع' : 'Spacing rules to prevent feed saturation'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">
                        {isAr ? 'أقصى تكرار لنفس التصنيف متتالياً' : 'Max Consecutive Same Category'}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {isAr ? 'مثال: لا تظهر أكثر من فيديوهين عبايات وراء بعض' : 'e.g. max 2 Abayas in a row'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDiversity(d => ({ ...d, maxConsecutiveSameCategory: Math.max(1, d.maxConsecutiveSameCategory - 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-slate-700 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-xs w-4 text-center">{diversity.maxConsecutiveSameCategory}</span>
                      <button
                        onClick={() => setDiversity(d => ({ ...d, maxConsecutiveSameCategory: Math.min(5, d.maxConsecutiveSameCategory + 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-slate-700 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">
                        {isAr ? 'أدنى مسافة تباعد لنفس صانع المحتوى' : 'Min Spacing Between Same Creator'}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {isAr ? 'عدد الفيديوهات الفاصلة بين مقطعين لنفس الصانع' : 'Videos between reels from same creator'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDiversity(d => ({ ...d, minSpacingSameCreator: Math.max(1, d.minSpacingSameCreator - 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-slate-700 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-xs w-4 text-center">{diversity.minSpacingSameCreator}</span>
                      <button
                        onClick={() => setDiversity(d => ({ ...d, minSpacingSameCreator: Math.min(8, d.minSpacingSameCreator + 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-slate-700 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">
                        {isAr ? 'أدنى مسافة تباعد لنفس المتجر' : 'Min Spacing Between Same Merchant'}
                      </span>
                      <span className="text-[10px] text-gray-500">
                        {isAr ? 'عدد الفيديوهات الفاصلة بين منتجات نفس المتجر' : 'Videos between items from same store'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDiversity(d => ({ ...d, minSpacingSameMerchant: Math.max(1, d.minSpacingSameMerchant - 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-slate-700 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-xs w-4 text-center">{diversity.minSpacingSameMerchant}</span>
                      <button
                        onClick={() => setDiversity(d => ({ ...d, minSpacingSameMerchant: Math.min(8, d.minSpacingSameMerchant + 1) }))}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 font-bold text-slate-700 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: EVENT LEARNING REWARD MATRIX */}
      {/* ========================================================================= */}
      {subTab === 'events' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {isAr ? 'مصفوفة نقاط تدريب اهتمامات المستخدم (Event Learning Reward Matrix)' : 'Event Learning Reward Matrix'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isAr 
                    ? 'النقاط التي تضاف أو تخصم من ملف اهتمامات المستخدم فور تفاعله مع أي فيديو أو منتج' 
                    : 'Implicit score points credited or penalized to user interest vector upon real-time interaction'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEventWeights({ ...DEFAULT_EVENT_WEIGHTS });
                    algorithmConfig.updateEventWeights(DEFAULT_EVENT_WEIGHTS);
                    showToast(isAr ? 'تمت استعادة مصفوفة النقاط الافتراضية' : 'Default reward weights restored');
                  }}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 hover:bg-gray-50"
                >
                  {isAr ? 'استعادة النقاط الافتراضية' : 'Reset Event Matrix'}
                </button>

                <button
                  onClick={handleSaveEventWeights}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">save</span>
                  <span>{isAr ? 'حفظ التعديلات' : 'Save Rewards'}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-y border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-start">{isAr ? 'اسم الحدث (Event Type)' : 'Event Name'}</th>
                    <th className="px-4 py-3 text-start">{isAr ? 'تأثير الإجراء السلوكي' : 'Behavior Meaning'}</th>
                    <th className="px-4 py-3 text-center">{isAr ? 'النقاط الحالية' : 'Weight Score'}</th>
                    <th className="px-4 py-3 text-end">{isAr ? 'تعديل سريع' : 'Quick Adjust'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { key: 'purchase', nameAr: 'إتمام شراء منتج بنجاح', descAr: 'أقوى مؤشر تجاري على الإطلاق', icon: 'shopping_bag', color: 'emerald' },
                    { key: 'add_to_cart', nameAr: 'إضافة منتج إلى السلة', descAr: 'نية شراء عالية جداً', icon: 'add_shopping_cart', color: 'emerald' },
                    { key: 'quick_buy_open', nameAr: 'فتح نافذة الشراء السريع', descAr: 'اهتمام مباشر بالطلب الفوري', icon: 'shopping_cart_checkout', color: 'purple' },
                    { key: 'product_click', nameAr: 'النقر على منتج مثبت بالريل', descAr: 'رغبة في معرفة تفاصيل السلعة', icon: 'touch_app', color: 'purple' },
                    { key: 'reel_share', nameAr: 'مشاركة الريل مع صديق', descAr: 'مؤشر انتشار فيروسي عالي', icon: 'share', color: 'blue' },
                    { key: 'reel_save', nameAr: 'حفظ الريل في المفضلة', descAr: 'نية إعادة الرجوع أو الشراء لاحقاً', icon: 'bookmark', color: 'blue' },
                    { key: 'reel_like', nameAr: 'الإعجاب بالريل (Like)', descAr: 'تفاعل إيجابي صريح', icon: 'favorite', color: 'rose' },
                    { key: 'reel_rewatch', nameAr: 'إعادة مشاهدة الفيديو كاملاً (Loop)', descAr: 'اهتمام استثنائي بالمحتوى', icon: 'replay', color: 'indigo' },
                    { key: 'reel_complete', nameAr: 'مشاهدة الفيديو حتى النهاية (100%)', descAr: 'إكمال بدون ملل', icon: 'task_alt', color: 'indigo' },
                    { key: 'reel_75_percent', nameAr: 'مشاهدة 75% من المقطع', descAr: 'مشاهدة مستمرة', icon: 'motion_photos_paused', color: 'indigo' },
                    { key: 'reel_50_percent', nameAr: 'مشاهدة 50% من المقطع', descAr: 'تجاوز مرحلة التخطي الأولي', icon: 'timelapse', color: 'indigo' },
                    { key: 'reel_skip', nameAr: 'تخطي سريع للمقطع (< 3 ثوانٍ)', descAr: 'مؤشر سلبي مباشر على عدم الاهتمام', icon: 'fast_forward', color: 'rose' },
                    { key: 'reel_not_interested', nameAr: 'اختيار "غير مهتم بهذا المحتوى"', descAr: 'عقوبة سلبية قاسية جداً للموضوع', icon: 'thumb_down', color: 'rose' },
                  ].map((ev) => {
                    const currentPoints = eventWeights[ev.key] ?? DEFAULT_EVENT_WEIGHTS[ev.key] ?? 0;
                    const isPositive = currentPoints >= 0;
                    return (
                      <tr key={ev.key} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                              isPositive ? 'bg-indigo-50 text-indigo-600' : 'bg-rose-50 text-rose-600'
                            }`}>
                              <span className="material-symbols-outlined text-[18px]">{ev.icon}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block">{ev.nameAr}</span>
                              <span className="font-mono text-[10px] text-gray-400">{ev.key}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{ev.descAr}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-full font-mono font-extrabold text-xs ${
                            isPositive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {isPositive ? `+${currentPoints}` : currentPoints} نقطة
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEventWeights(prev => ({ ...prev, [ev.key]: currentPoints - 1 }))}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold flex items-center justify-center"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={currentPoints}
                              onChange={(e) => {
                                const num = Number(e.target.value);
                                setEventWeights(prev => ({ ...prev, [ev.key]: num }));
                              }}
                              className="w-14 px-2 py-1 text-center font-mono font-bold text-xs rounded-lg border border-gray-200 bg-white"
                            />
                            <button
                              onClick={() => setEventWeights(prev => ({ ...prev, [ev.key]: currentPoints + 1 }))}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 4: LIVE EVENT STREAM MONITOR */}
      {/* ========================================================================= */}
      {subTab === 'stream' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {isAr ? 'مراقب الأحداث الحية للريلز والمتجر (Real-Time Event Stream)' : 'Real-Time Event Stream'}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isAr 
                    ? 'بث مباشر للأحداث المتدفقة من تفاعلات الزوار والمتسوقين والمشاهدات' 
                    : 'Live reactive feed of behavioral events captured across shoppers and reels'}
                </p>
              </div>

              {/* Event Simulator Tool for SuperAdmin */}
              <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200">
                <select
                  value={selectedDemoEventType}
                  onChange={(e) => setSelectedDemoEventType(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-slate-800 focus:outline-none"
                >
                  <option value="purchase">🛍️ {isAr ? 'حدث شراء (Purchase)' : 'Purchase'}</option>
                  <option value="add_to_cart">🛒 {isAr ? 'إضافة للسلة (Add to Cart)' : 'Add to Cart'}</option>
                  <option value="product_click">👆 {isAr ? 'نقر على منتج (Product Click)' : 'Product Click'}</option>
                  <option value="reel_like">❤️ {isAr ? 'إعجاب بالريل (Like)' : 'Like Reel'}</option>
                  <option value="reel_complete">🎬 {isAr ? 'إكمال المشاهدة (100%)' : 'Watch Complete'}</option>
                  <option value="reel_skip">⏩ {isAr ? 'تخطي سريع (Skip)' : 'Skip Reel'}</option>
                </select>

                <button
                  onClick={handleSimulateDemoEvent}
                  disabled={isSimulatingEvent}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[15px]">send</span>
                  <span>{isAr ? 'بث حدث اختباري' : 'Dispatch Test Event'}</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: isAr ? 'جميع الأحداث' : 'All Events' },
                { id: 'commerce', label: isAr ? 'أحداث التجارة والشراء' : 'Commerce Events' },
                { id: 'video', label: isAr ? 'مشاهدات الفيديو والتفاعل' : 'Video & Engagement' },
                { id: 'negative', label: isAr ? 'السكيب والأحداث السلبية' : 'Negative & Skips' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setEventFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    eventFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Live Ticker Table */}
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-start text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold sticky top-0 border-y border-gray-100">
                  <tr>
                    <th className="px-4 py-2.5 text-start">{isAr ? 'الحدث' : 'Event'}</th>
                    <th className="px-4 py-2.5 text-start">{isAr ? 'المستخدم / الجلسة' : 'User / Session'}</th>
                    <th className="px-4 py-2.5 text-start">{isAr ? 'الريل / المنتج' : 'Entity'}</th>
                    <th className="px-4 py-2.5 text-start">{isAr ? 'المتجر / الصانع' : 'Merchant / Creator'}</th>
                    <th className="px-4 py-2.5 text-end">{isAr ? 'الوقت' : 'Time'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLiveEvents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-400">
                        {isAr ? 'لا توجد أحداث مسجلة في هذا التصنيف بعد' : 'No recorded events in this category yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredLiveEvents.map((evt) => {
                      const badgeCls = getEventBadge(evt.event_type);
                      return (
                        <tr key={evt.id || Math.random()} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-4 py-2.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${badgeCls}`}>
                              {evt.event_type}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-gray-600">
                            {evt.user_id ? `${evt.user_id.substring(0, 8)}...` : `Guest (${(evt.session_id || '').substring(0, 6)})`}
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="max-w-xs truncate">
                              <span className="font-bold text-slate-800">{evt.reel_id || evt.product_id || evt.entity_id || '—'}</span>
                              {evt.metadata?.caption && (
                                <span className="text-[10px] text-gray-400 block truncate">{evt.metadata.caption}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-gray-600">
                            {evt.merchant_id || evt.creator_id || 'EG-Commerce'}
                          </td>
                          <td className="px-4 py-2.5 text-end font-mono text-[10px] text-gray-400">
                            {evt.created_at ? new Date(evt.created_at).toLocaleTimeString() : 'الآن'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 5: FEED SIMULATOR & EXPLAINABILITY INSPECTOR */}
      {/* ========================================================================= */}
      {subTab === 'simulator' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {isAr ? 'مختبر محاكاة الفيد وتفكيك درجات التوصية (Feed Simulator & Inspector)' : 'Feed Simulator & Explainability Inspector'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isAr 
                    ? 'عاين كيف يرتب المحرك الفيديوهات في الوقت الفعلي مع كشف أسباب ظهور كل مقطع وتفكيك أرقامه' 
                    : 'Inspect exact mathematical ranking output and component breakdown for every reel in the feed'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Tab selector */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                  {[
                    { id: 'foryou', label: isAr ? 'لك (For You)' : 'For You' },
                    { id: 'following', label: isAr ? 'المتابعة (Following)' : 'Following' },
                    { id: 'trending', label: isAr ? 'الرائج (Trending)' : 'Trending' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSimTab(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        simTab === t.id ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => runFeedSimulation(simTab)}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-[16px] ${isSimulating ? 'animate-spin' : ''}`}>
                    autorenew
                  </span>
                  <span>{isAr ? 'إعادة المحاكاة' : 'Re-run Simulator'}</span>
                </button>
              </div>
            </div>

            {/* Results Grid: Feed items on left, Deep Explainability on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Ranked Candidates List */}
              <div className="lg:col-span-6 space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {simulatedFeed.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">view_compact</span>
                    <p className="text-xs text-gray-500">{isAr ? 'جاري محاكاة وتوليد الفيد...' : 'Simulating feed...'}</p>
                  </div>
                ) : (
                  simulatedFeed.map((item, index) => {
                    const reel = item.reel;
                    const r = item.ranking || {};
                    const isSelected = activeInspectorItem?.reel?.id === reel.id;
                    const finalScorePct = Math.round((r.finalScore || 0) * 100);

                    return (
                      <div
                        key={reel.id}
                        onClick={() => setActiveInspectorItem(item)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 ${
                          isSelected 
                            ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                          index === 0 ? 'bg-amber-400 text-amber-950 shadow-xs' :
                          index === 1 ? 'bg-slate-200 text-slate-800' :
                          index === 2 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'
                        }`}>
                          #{index + 1}
                        </div>

                        {/* Thumbnail / Video icon */}
                        <div className="w-12 h-16 rounded-xl bg-slate-900 relative overflow-hidden shrink-0 border border-gray-200">
                          {reel.avatar ? (
                            <img src={reel.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/40">
                              <span className="material-symbols-outlined text-[20px]">movie</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          {reel.products && reel.products.length > 0 && (
                            <span className="absolute bottom-1 right-1 bg-[#d00000] text-white text-[8px] font-bold px-1 rounded-sm">
                              🛍️ {reel.products.length}
                            </span>
                          )}
                        </div>

                        {/* Info & Source */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {reel.creatorName || reel.creatorHandle || 'صانع محتوى'}
                            </span>
                            <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono border border-gray-200">
                              {r.source || 'foryou_blend'}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 line-clamp-2 leading-tight">
                            {reel.caption || 'بدون وصف'}
                          </p>
                        </div>

                        {/* Score Pill */}
                        <div className="text-end shrink-0">
                          <span className="text-[10px] text-gray-400 block font-mono uppercase">{isAr ? 'الدرجة' : 'Score'}</span>
                          <span className={`text-base font-black font-mono block ${
                            finalScorePct >= 70 ? 'text-emerald-600' :
                            finalScorePct >= 50 ? 'text-indigo-600' : 'text-amber-600'
                          }`}>
                            {finalScorePct}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Explainability Inspector Deep-Dive */}
              <div className="lg:col-span-6 bg-gray-50/70 p-5 rounded-3xl border border-gray-100 space-y-4">
                {activeInspectorItem ? (
                  <>
                    <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-indigo-600 text-[18px]">psychology</span>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                            {isAr ? 'تفكيك درجات الرانكينج (Score Decomposition)' : 'Score Decomposition'}
                          </h4>
                        </div>
                        <span className="text-[11px] text-gray-500 font-mono">
                          ID: {activeInspectorItem.reel.id}
                        </span>
                      </div>

                      <div className="text-end">
                        <span className="text-[10px] text-gray-400 block font-mono">{isAr ? 'الدرجة المركبة النهائية' : 'Final Composite'}</span>
                        <span className="text-xl font-black font-mono text-indigo-600">
                          {((activeInspectorItem.ranking?.finalScore || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* Human Explanation Box */}
                    <div className="bg-indigo-50/80 p-3.5 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs mb-1">
                        <span className="material-symbols-outlined text-[15px]">info</span>
                        <span>{isAr ? 'لماذا ظهر هذا الريل في هذا الموضع؟' : 'Why is this reel ranked here?'}</span>
                      </div>
                      <p className="text-xs text-indigo-800 leading-relaxed">
                        {isAr 
                          ? `تم ترشيح هذا المقطع عبر مسار (${activeInspectorItem.ranking?.source || 'اهتمامات المستخدم'}). حقق توافق اهتمامات بنسبة ${(activeInspectorItem.ranking?.interestScore * 100 || 0).toFixed(0)}% ودافع تحويل تجاري ${(activeInspectorItem.ranking?.commerceProbability * 100 || 0).toFixed(0)}% لوجود ${activeInspectorItem.reel.products?.length || 0} منتجات مربوطة.`
                          : `Candidate emerged via (${activeInspectorItem.ranking?.source || 'user interest'}). Scored ${(activeInspectorItem.ranking?.interestScore * 100 || 0).toFixed(0)}% interest match and ${(activeInspectorItem.ranking?.commerceProbability * 100 || 0).toFixed(0)}% commerce conversion probability.`}
                      </p>
                    </div>

                    {/* Detailed Signal Gauges */}
                    <div className="space-y-2.5 text-xs">
                      {[
                        { labelAr: 'توافق الاهتمامات (Interest Match)', val: activeInspectorItem.ranking?.interestScore || 0, color: 'bg-indigo-500' },
                        { labelAr: 'ألفة صانع المحتوى (Creator Affinity)', val: activeInspectorItem.ranking?.creatorAffinity || 0, color: 'bg-blue-500' },
                        { labelAr: 'احتمالية الشراء (Commerce Probability)', val: activeInspectorItem.ranking?.commerceProbability || 0, color: 'bg-emerald-500' },
                        { labelAr: 'احتمالية إكمال المشاهدة (Watch Completion)', val: activeInspectorItem.ranking?.watchProbability || 0, color: 'bg-purple-500' },
                        { labelAr: 'جودة التفاعل (Engagement Quality)', val: activeInspectorItem.ranking?.engagementQuality || 0, color: 'bg-rose-500' },
                        { labelAr: 'حداثة المحتوى (Freshness)', val: activeInspectorItem.ranking?.freshnessScore || 0, color: 'bg-amber-500' },
                        { labelAr: 'معامل العقوبات (Penalty Multiplier)', val: activeInspectorItem.ranking?.penaltyMultiplier || 1, color: 'bg-slate-700' },
                      ].map((sig, idx) => {
                        const pct = Math.min(100, Math.max(0, Math.round(sig.val * 100)));
                        return (
                          <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-100">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-gray-700 text-[11px]">{sig.labelAr}</span>
                              <span className="font-mono font-bold text-slate-900">{pct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${sig.color} rounded-full transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tagged Products in this Reel */}
                    {activeInspectorItem.reel.products && activeInspectorItem.reel.products.length > 0 && (
                      <div className="bg-white p-3 rounded-2xl border border-gray-100">
                        <span className="font-bold text-slate-800 text-[11px] block mb-2">
                          {isAr ? 'المنتجات المربوطة التي رفعت الدافع التجاري:' : 'Tagged Products driving commerce score:'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {activeInspectorItem.reel.products.map((prod, pIdx) => (
                            <div key={pIdx} className="flex items-center gap-2 bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-200">
                              <span className="material-symbols-outlined text-[14px] text-[#d00000]">shopping_bag</span>
                              <span className="font-bold text-slate-900 text-[11px]">{prod.title || prod.sku}</span>
                              <span className="font-mono text-[10px] text-emerald-600 font-bold">{prod.price} ج.م</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">touch_app</span>
                    <p className="text-xs">{isAr ? 'اضغط على أي ريل من القائمة لمعاينة تفكيك درجاته' : 'Select any reel on the left to inspect score math'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
