import { supabase } from '../lib/supabase.js';
import { ReelsService } from './ReelsService.js';

const LOCAL_STORAGE_CREATOR_KEY = 'eg_creator_profile_v1';
const LOCAL_STORAGE_CAMPAIGNS_KEY = 'eg_creator_campaigns_v1';
const LOCAL_STORAGE_APPLICATIONS_KEY = 'eg_ugc_applications_v1';
const LOCAL_STORAGE_CONTENT_KEY = 'eg_creator_content_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'eg_creator_settings_v1';

// Initial Mock Datasets
const DEFAULT_PROFILE = {
  id: 'cr-01',
  name: 'ياسمين السيد • Yasmin El Sayed',
  handle: '@cairo_chic',
  avatar: '/images/reels/reel_1.jpg',
  cover: '/images/products/linen_abaya.jpg',
  bio: 'صانعة محتوى أزياء وستايلست معاصرة من القاهرة 🇪🇬✨ أعشق مزج القطن والكتان المصري مع اللمسات العالمية.',
  city: 'القاهرة، مصر',
  cityEn: 'Cairo, Egypt',
  niche: 'أزياء وستايل حياة (Fashion & Lifestyle)',
  verified: true,
  followers: '245K',
  engagementRate: '13.6%',
  reach: '1.2M',
  totalSales: '148,500 ج.م',
  totalCommission: '22,275 ج.م',
  activeDeals: 3,
  instagram: 'https://instagram.com/cairo_chic',
  tiktok: 'https://tiktok.com/@cairo_chic',
  youtube: 'https://youtube.com/@cairo_chic'
};

const DEFAULT_CAMPAIGNS = [
  {
    id: 'camp-1',
    merchantId: 'm-01',
    productId: 'p-sheglam-1',
    title: 'إطلاق كولكشن الكتان الصيفي 2026',
    titleEn: 'Kaizen Linen Summer 2026 Launch',
    brandName: 'Talieska Studio • تاليسكا',
    brandLogo: '/images/brands/talieska_logo.jpg',
    productName: 'عباية كتان ناعمة وتوب كاجوال',
    rewardType: 'hybrid',
    rewardLabel: 'طقم مجاني + 15% عمولة مبيعات',
    rewardLabelEn: 'Free Outfit + 15% Commission',
    budgetEgp: 3500,
    commissionRate: 15,
    slotsAvailable: 4,
    slotsTotal: 5,
    deadline: '2026-09-30',
    status: 'active',
    applied: true,
    applicationStatus: 'draft_submitted', // 'applied' | 'approved' | 'draft_submitted' | 'completed'
    submittedUrl: '/images/reels/linen_abaya.mp4',
    draftNotes: 'تم تصوير الفيديو بأعلى جودة وإبراز الكولكشن الصيفي وكود التخفيض، يرجى المراجعة للاعتماد.',
    guidelines: 'تصوير ريلز عالي الجودة يبرز خامة الكتان في ضوء النهار، مع توضيح كود الخصم في الوصف.',
    createdAt: '2026-09-01'
  },
  {
    id: 'camp-2',
    merchantId: 'm-01',
    productId: 'p-sheglam-2',
    title: 'تنسيقات الشارع المعاصرة • Cairo Streetwear',
    titleEn: 'Contemporary Streetwear Styling',
    brandName: 'Talieska Studio • تاليسكا',
    brandLogo: '/images/brands/talieska_logo.jpg',
    productName: 'قميص كتان فضفاض وبنطال أوفرسايز',
    rewardType: 'fixed',
    rewardLabel: '4,200 ج.م كاش + طقم كامل',
    rewardLabelEn: '4,200 EGP + Full Outfit',
    budgetEgp: 4200,
    commissionRate: 10,
    slotsAvailable: 2,
    slotsTotal: 3,
    deadline: '2026-10-05',
    status: 'active',
    applied: true,
    applicationStatus: 'applied',
    submittedUrl: '',
    draftNotes: '',
    guidelines: 'ستايل عصري شبابي في شوارع المعادي أو الزمالك مع منشن للبراند واستخدام تراك التريند.',
    createdAt: '2026-09-05'
  },
  {
    id: 'camp-3',
    merchantId: 'm-01',
    productId: 'p-sheglam-3',
    title: 'تحدي ستايلنج العبايات الأنيقة للعمل',
    titleEn: 'Workwear Modest Styling Challenge',
    brandName: 'Talieska Studio • تاليسكا',
    brandLogo: '/images/brands/talieska_logo.jpg',
    productName: 'فستان حرير مع جاكيت كيمونو محتشم',
    rewardType: 'hybrid',
    rewardLabel: '3,800 ج.م + كود خصم للمتابعين',
    rewardLabelEn: '3,800 EGP + Follower Discount Code',
    budgetEgp: 3800,
    commissionRate: 12,
    slotsAvailable: 6,
    slotsTotal: 6,
    deadline: '2026-10-12',
    status: 'active',
    applied: false,
    applicationStatus: null,
    submittedUrl: '',
    guidelines: 'توضيح 3 طرق مختلفة لارتداء الفستان في مناسبات العمل والخروجات الصباحية.',
    createdAt: '2026-09-08'
  },
  {
    id: 'camp-4',
    merchantId: 'm-02',
    productId: 'p-fashion-copper-lantern',
    title: 'حملة إكسسوارات النحاس الفاطمي اليدوي',
    titleEn: 'Handcrafted Heritage Brass Accessories',
    brandName: 'Khan El Khalili Crafts',
    brandLogo: '/images/products/copper_lantern.jpg',
    productName: 'عقد نحاسي عريض وأقراط تراثية',
    rewardType: 'commission',
    rewardLabel: '20% عمولة على كل طلب عبر الرابط',
    rewardLabelEn: '20% Commission on each tagged sale',
    budgetEgp: 2500,
    commissionRate: 20,
    slotsAvailable: 8,
    slotsTotal: 8,
    deadline: '2026-10-20',
    status: 'active',
    applied: false,
    applicationStatus: null,
    submittedUrl: '',
    guidelines: 'التركيز على تفاصيل الحرفية اليدوية المصرية وجودة لمعان النحاس.',
    createdAt: '2026-09-10'
  },
  {
    id: 'camp-5',
    merchantId: 'm-01',
    productId: 'p-cotton-shirt-01',
    title: 'أسبوع القطن المصري فائق النعومة',
    titleEn: 'Premium Egyptian Cotton Week',
    brandName: 'Talieska Studio • تاليسكا',
    brandLogo: '/images/brands/talieska_logo.jpg',
    productName: 'تيشيرت وبلوفر قطن جيزة 100%',
    rewardType: 'fixed',
    rewardLabel: '5,000 ج.م + بوكس هدايا فاخر',
    rewardLabelEn: '5,000 EGP + Luxury Gift Box',
    budgetEgp: 5000,
    commissionRate: 8,
    slotsAvailable: 3,
    slotsTotal: 3,
    deadline: '2026-10-28',
    status: 'active',
    applied: false,
    applicationStatus: null,
    submittedUrl: '',
    guidelines: 'اختبار ملمس القطن الأصلي ومقارنته بالأقمشة العادية مع تركيز على شعور الراحة.',
    createdAt: '2026-09-11'
  }
];

const DEFAULT_APPLICATIONS = [
  {
    id: 'app-001',
    campaignId: 'camp-1',
    campaignTitle: 'إطلاق كولكشن الكتان الصيفي 2026',
    merchantId: 'm-01',
    creatorId: 'cr-01',
    creatorName: 'ياسمين السيد • Yasmin El Sayed',
    creatorHandle: '@cairo_chic',
    creatorAvatar: '/images/reels/reel_1.jpg',
    creatorFollowers: '245K',
    creatorNiche: 'أزياء وستايل حياة (Fashion & Lifestyle)',
    creatorCity: 'القاهرة، مصر',
    status: 'draft_submitted', // 'applied' | 'approved' | 'rejected' | 'draft_submitted' | 'completed'
    notes: 'أحببت خامة الكتان وتفاصيل القصّة، أخطط لعمل فيديو ستايلنج Morning to Night في حديقة الأزهر مع إبراز كود الخصم.',
    submittedUrl: '/images/reels/linen_abaya.mp4',
    draftNotes: 'تم تصوير الفيديو بأعلى جودة وإبراز الكولكشن الصيفي وكود التخفيض، يرجى المراجعة للاعتماد.',
    appliedAt: '2026-09-14',
    submittedAt: '2026-09-16'
  },
  {
    id: 'app-002',
    campaignId: 'camp-2',
    campaignTitle: 'تنسيقات الشارع المعاصرة • Cairo Streetwear',
    merchantId: 'm-01',
    creatorId: 'cr-02',
    creatorName: 'سلمى ستايلز • Salma Styles',
    creatorHandle: '@salma_fashion_eg',
    creatorAvatar: '/images/reels/reel_2.jpg',
    creatorFollowers: '180K',
    creatorNiche: 'ستريت وير مصري وستايل كاجوال',
    creatorCity: 'الإسكندرية',
    status: 'applied',
    notes: 'جاهزة لتصوير ريلز إبداعي في كورنيش الإسكندرية مع إبراز القميص الكتان الفضفاض.',
    submittedUrl: '',
    draftNotes: '',
    appliedAt: '2026-09-17'
  }
];

const DEFAULT_CONTENT = [
  {
    id: 'cnt-1',
    title: 'تنسيق لوك العباية الكتان في الصباح ☀️',
    titleEn: 'Linen Abaya Morning Look',
    views: '48.2K',
    viewsCount: 48200,
    likes: '3.4K',
    comments: 245,
    shares: '1.2K',
    salesGenerated: '18,200 ج.م',
    commissionEarned: '2,730 ج.م',
    date: '2026-09-10',
    status: 'published',
    thumbnail: '/images/products/linen_abaya.jpg',
    taggedProduct: 'عباية كتان ناعمة وتوب عصري'
  },
  {
    id: 'cnt-2',
    title: 'لوك الفستان الحريري للمناسبات المسائية ✨',
    titleEn: 'Evening Silk Dress Styling',
    views: '32.1K',
    viewsCount: 32100,
    likes: '2.1K',
    comments: 180,
    shares: '890',
    salesGenerated: '12,500 ج.م',
    commissionEarned: '1,875 ج.م',
    date: '2026-09-08',
    status: 'published',
    thumbnail: '/images/products/silk_dress.jpg',
    taggedProduct: 'فستان حرير بوهيمي ناعم'
  },
  {
    id: 'cnt-3',
    title: 'تنسيق قميص الكتان الرجالي مع إكسسوارات كاجوال 🌿',
    titleEn: 'Mens Linen Outfit Casual Mix',
    views: '19.8K',
    viewsCount: 19800,
    likes: '1.4K',
    comments: 96,
    shares: '430',
    salesGenerated: '9,100 ج.م',
    commissionEarned: '1,365 ج.م',
    date: '2026-09-04',
    status: 'published',
    thumbnail: '/images/products/linen_shirt.jpg',
    taggedProduct: 'قميص كتان بيج طبيعي'
  },
  {
    id: 'cnt-4',
    title: 'مراجعة خامات النحاس اليدوي من خان الخليلي 🏺',
    titleEn: 'Khan El Khalili Artisan Brass Review',
    views: '14.2K',
    viewsCount: 14200,
    likes: '980',
    comments: 64,
    shares: '210',
    salesGenerated: '4,700 ج.م',
    commissionEarned: '705 ج.م',
    date: '2026-09-01',
    status: 'published',
    thumbnail: '/images/products/copper_lantern.jpg',
    taggedProduct: 'إكسسوارات نحاسية يدوية'
  },
  {
    id: 'cnt-5',
    title: 'مسودة: تنسيقات البليزر السيترين مع البنطلون الواسع 👗',
    titleEn: 'Draft: Citrine Blazer Mix & Match',
    views: '0',
    viewsCount: 0,
    likes: '0',
    comments: 0,
    shares: '0',
    salesGenerated: '0 ج.م',
    commissionEarned: '0 ج.م',
    date: '2026-09-12',
    status: 'under_review',
    thumbnail: '/images/reels/fashion_citrine_blazer_thumb.jpg',
    taggedProduct: 'بليزر سيترين أصفر فاقع'
  }
];

const DEFAULT_SETTINGS = {
  payoutMethod: 'instapay', // 'instapay' | 'vodafone_cash' | 'bank_transfer'
  instapayHandle: 'yasmin.sayed@instapay',
  vodafoneCashPhone: '01012345678',
  bankName: 'البنك التجاري الدولي (CIB)',
  bankAccountHolder: 'ياسمين أحمد السيد',
  bankIban: 'EG380010004500000123456789012',
  autoPayoutThreshold: 1000,
  emailNotifications: true,
  smsAlerts: true,
  campaignInvites: true,
  showSalesOnProfile: true
};

export const UgcService = {
  // 1. CREATOR PROFILE
  async getProfile() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CREATOR_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored creator profile:', e);
    }
    localStorage.setItem(LOCAL_STORAGE_CREATOR_KEY, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  },

  async updateProfile(updates) {
    try {
      const current = await this.getProfile();
      const updated = { ...current, ...updates };
      localStorage.setItem(LOCAL_STORAGE_CREATOR_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to update creator profile:', e);
      return updates;
    }
  },

  // 2. ANALYTICS & STATS
  async getAnalytics(timeframe = '7d') {
    const profile = await this.getProfile();
    const content = await this.getContent();

    const totalViews = content.reduce((acc, c) => acc + (c.viewsCount || 0), 0);
    const totalLikes = content.reduce((acc, c) => acc + parseInt(c.likes || 0) * 1000, 0);

    const demographicsCities = [
      { city: 'القاهرة (Cairo)', percentage: 56, count: '137K' },
      { city: 'الإسكندرية (Alexandria)', percentage: 22, count: '54K' },
      { city: 'الجيزة (Giza)', percentage: 12, count: '29K' },
      { city: 'المنصورة والدلتا', percentage: 6, count: '15K' },
      { city: 'الصعيد ومدن القناة', percentage: 4, count: '10K' }
    ];

    const ageDistribution = [
      { age: '18 - 24', percentage: 48 },
      { age: '25 - 34', percentage: 38 },
      { age: '35 - 44', percentage: 10 },
      { age: '45+', percentage: 4 }
    ];

    const weeklyTrend = [
      { day: 'السبت', date: 'Sep 06', views: 5800, reach: 4100, sales: 1800 },
      { day: 'الأحد', date: 'Sep 07', views: 7200, reach: 5600, sales: 2400 },
      { day: 'الإثنين', date: 'Sep 08', views: 9100, reach: 7400, sales: 3100 },
      { day: 'الثلاثاء', date: 'Sep 09', views: 6400, reach: 4900, sales: 2100 },
      { day: 'الأربعاء', date: 'Sep 10', views: 11200, reach: 8900, sales: 4800 },
      { day: 'الخميس', date: 'Sep 11', views: 14600, reach: 11400, sales: 6200 },
      { day: 'الجمعة', date: 'Sep 12', views: 18400, reach: 14800, sales: 8500 }
    ];

    return {
      profile,
      timeframe,
      totalViews: '124.5K',
      totalReach: '82.3K',
      engagementRate: '13.6%',
      salesGenerated: '44,500 ج.م',
      commissionEarned: '6,675 ج.م',
      totalShares: '3.7K',
      totalComments: '785',
      avgWatchTime: '18.4s',
      completionRate: '68%',
      demographicsCities,
      ageDistribution,
      weeklyTrend
    };
  },

  // 3. CAMPAIGNS HUB (CRUD & Queries)
  async getCampaigns(merchantId = null) {
    let campaigns = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CAMPAIGNS_KEY);
      if (stored) {
        campaigns = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored campaigns:', e);
    }

    if (!campaigns || campaigns.length === 0) {
      campaigns = DEFAULT_CAMPAIGNS;
      localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(DEFAULT_CAMPAIGNS));
    }

    // Try Supabase sync
    try {
      const { data, error } = await supabase.from('ugc_campaigns').select('*');
      if (!error && data && data.length > 0) {
        const localIds = new Set(campaigns.map(c => c.id));
        const mergedFromDb = data.map(d => ({
          id: d.id,
          merchantId: d.merchant_id,
          productId: d.product_id,
          title: d.title,
          brandName: d.brand_name || 'متجر معتمد',
          brandLogo: d.brand_logo || '/images/brands/talieska_logo.jpg',
          productName: d.product_name || 'منتج مميز',
          rewardType: d.reward_type,
          rewardLabel: d.reward_label || `${d.fixed_reward_amount || 0} ج.م`,
          budgetEgp: d.fixed_reward_amount,
          commissionRate: d.commission_rate || 10,
          slotsAvailable: d.slots_available,
          slotsTotal: d.slots_total || d.slots_available,
          deadline: d.deadline,
          status: d.status,
          guidelines: d.brief_requirements
        }));
        campaigns = [...campaigns, ...mergedFromDb.filter(m => !localIds.has(m.id))];
      }
    } catch (err) {}

    if (merchantId) {
      return campaigns.filter(c => c.merchantId === merchantId || c.merchant_id === merchantId);
    }

    return campaigns;
  },

  async getCampaignById(campaignId) {
    const list = await this.getCampaigns();
    return list.find(c => c.id === campaignId) || null;
  },

  async createCampaign(campaignData) {
    const newCamp = {
      id: campaignData.id || `camp-${Date.now()}`,
      title: campaignData.title || 'حملة ريلز جديدة',
      titleEn: campaignData.titleEn || campaignData.title || 'New UGC Campaign',
      brandName: campaignData.brandName || 'متجر معتمد',
      brandLogo: campaignData.brandLogo || '/images/brands/talieska_logo.jpg',
      merchantId: campaignData.merchantId || campaignData.merchant_id || 'm-01',
      productId: campaignData.productId || campaignData.product_id || null,
      productName: campaignData.productName || 'منتج مختار',
      rewardType: campaignData.rewardType || 'hybrid',
      rewardLabel: campaignData.rewardLabel || (
        campaignData.rewardType === 'commission'
          ? `${campaignData.commissionRate || 15}% عمولة مبيعات`
          : campaignData.rewardType === 'free_product'
            ? 'منتج مجاني'
            : campaignData.rewardType === 'fixed'
              ? `${campaignData.fixedAmount || 1000} ج.م كاش`
              : `${campaignData.fixedAmount || 1000} ج.م + ${campaignData.commissionRate || 10}% عمولة`
      ),
      rewardLabelEn: campaignData.rewardLabelEn || 'Reward & Commission',
      budgetEgp: Number(campaignData.fixedAmount || campaignData.budgetEgp || 1000),
      commissionRate: Number(campaignData.commissionRate || 10),
      slotsAvailable: Number(campaignData.creatorSlots || campaignData.slotsAvailable || 5),
      slotsTotal: Number(campaignData.creatorSlots || campaignData.slotsTotal || 5),
      deadline: campaignData.deadline || '2026-10-31',
      status: 'active',
      guidelines: campaignData.brief || campaignData.guidelines || 'مطلوب ريلز عمودي بدقة عالية يبرز خامة ومميزات المنتج.',
      applied: false,
      applicationStatus: null,
      submittedUrl: '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    // 1. Try Supabase insert
    try {
      await supabase.from('ugc_campaigns').insert({
        merchant_id: newCamp.merchantId,
        product_id: newCamp.productId,
        title: newCamp.title,
        brief_requirements: newCamp.guidelines,
        reward_type: newCamp.rewardType,
        fixed_reward_amount: newCamp.budgetEgp,
        commission_rate: newCamp.commissionRate,
        slots_available: newCamp.slotsAvailable,
        deadline: newCamp.deadline,
        status: newCamp.status
      });
    } catch (err) {
      console.warn('DB create campaign failed, stored locally:', err.message);
    }

    // 2. Persist locally at top
    const all = await this.getCampaigns();
    const updated = [newCamp, ...all.filter(c => c.id !== newCamp.id)];
    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(updated));

    return newCamp;
  },

  async updateCampaign(campaignId, updates) {
    const list = await this.getCampaigns();
    let updatedItem = null;
    const updated = list.map(c => {
      if (c.id === campaignId) {
        updatedItem = { ...c, ...updates };
        return updatedItem;
      }
      return c;
    });

    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(updated));

    try {
      await supabase.from('ugc_campaigns').update(updates).eq('id', campaignId);
    } catch (err) {}

    return updatedItem;
  },

  async deleteCampaign(campaignId) {
    const list = await this.getCampaigns();
    const filtered = list.filter(c => c.id !== campaignId);
    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(filtered));

    try {
      await supabase.from('ugc_campaigns').delete().eq('id', campaignId);
    } catch (err) {}

    // Clean up applications for this campaign
    const apps = await this.getApplications();
    const filteredApps = apps.filter(a => a.campaignId !== campaignId);
    localStorage.setItem(LOCAL_STORAGE_APPLICATIONS_KEY, JSON.stringify(filteredApps));

    return true;
  },

  // 4. CREATOR APPLICATIONS & DRAFTS LIFECYCLE
  async getApplications(campaignId = null, merchantId = null) {
    let apps = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_APPLICATIONS_KEY);
      if (stored) {
        apps = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored applications:', e);
    }

    if (!apps || apps.length === 0) {
      apps = DEFAULT_APPLICATIONS;
      localStorage.setItem(LOCAL_STORAGE_APPLICATIONS_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
    }

    // Try Supabase fetch
    try {
      const { data, error } = await supabase.from('ugc_applications').select('*');
      if (!error && data && data.length > 0) {
        const localIds = new Set(apps.map(a => a.id));
        const fromDb = data.map(d => ({
          id: d.id,
          campaignId: d.campaign_id,
          creatorId: d.creator_id,
          status: d.status,
          notes: d.notes,
          submittedUrl: d.draft_video_url,
          feedback: d.feedback,
          appliedAt: d.created_at?.split('T')[0] || '2026-09-15'
        }));
        apps = [...apps, ...fromDb.filter(a => !localIds.has(a.id))];
      }
    } catch (err) {}

    if (campaignId) {
      apps = apps.filter(a => a.campaignId === campaignId || a.campaign_id === campaignId);
    }
    if (merchantId) {
      apps = apps.filter(a => a.merchantId === merchantId || a.merchant_id === merchantId);
    }

    return apps;
  },

  async applyForCampaign(campaignId, creatorData = {}, notes = '') {
    const creatorId = typeof creatorData === 'string' ? creatorData : (creatorData?.id || 'cr-01');
    const campaigns = await this.getCampaigns();
    let targetCamp = null;

    const updatedCamps = campaigns.map(camp => {
      if (camp.id === campaignId) {
        targetCamp = {
          ...camp,
          applied: true,
          applicationStatus: 'applied',
          slotsAvailable: Math.max(0, (camp.slotsAvailable || 1) - 1),
          notes
        };
        return targetCamp;
      }
      return camp;
    });

    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(updatedCamps));

    // Register new application in applications storage
    const apps = await this.getApplications();
    const newApp = {
      id: `app-${Date.now()}`,
      campaignId,
      campaignTitle: targetCamp?.title || 'حملة محتوى',
      merchantId: targetCamp?.merchantId || 'm-01',
      creatorId,
      creatorName: typeof creatorData === 'object' && creatorData.name ? creatorData.name : 'ياسمين السيد • Yasmin El Sayed',
      creatorHandle: typeof creatorData === 'object' && creatorData.handle ? creatorData.handle : '@cairo_chic',
      creatorAvatar: typeof creatorData === 'object' && creatorData.avatar ? creatorData.avatar : '/images/reels/reel_1.jpg',
      creatorFollowers: typeof creatorData === 'object' && creatorData.followers ? creatorData.followers : '245K',
      creatorNiche: typeof creatorData === 'object' && creatorData.niche ? creatorData.niche : 'أزياء وستايل حياة',
      creatorCity: typeof creatorData === 'object' && creatorData.city ? creatorData.city : 'القاهرة، مصر',
      status: 'applied',
      notes,
      submittedUrl: '',
      draftNotes: '',
      appliedAt: new Date().toISOString().split('T')[0]
    };

    const updatedApps = [newApp, ...apps];
    localStorage.setItem(LOCAL_STORAGE_APPLICATIONS_KEY, JSON.stringify(updatedApps));

    try {
      await supabase.from('ugc_applications').insert({
        campaign_id: campaignId,
        creator_id: creatorId,
        status: 'applied',
        notes
      });
    } catch (err) {}

    return targetCamp;
  },

  async reviewApplication(applicationId, newStatus, feedback = '') {
    const apps = await this.getApplications();
    let updatedApp = null;
    const updated = apps.map(app => {
      if (app.id === applicationId) {
        updatedApp = {
          ...app,
          status: newStatus,
          feedback,
          reviewedAt: new Date().toISOString()
        };
        return updatedApp;
      }
      return app;
    });
    localStorage.setItem(LOCAL_STORAGE_APPLICATIONS_KEY, JSON.stringify(updated));

    // Also sync campaign application status if matching
    if (updatedApp?.campaignId) {
      const camps = await this.getCampaigns();
      const updatedCamps = camps.map(camp => {
        if (camp.id === updatedApp.campaignId) {
          return {
            ...camp,
            applicationStatus: newStatus
          };
        }
        return camp;
      });
      localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(updatedCamps));
    }

    try {
      await supabase.from('ugc_applications').update({
        status: newStatus,
        feedback
      }).eq('id', applicationId);
    } catch (err) {}

    return updatedApp;
  },

  async submitCampaignDraft(campaignId, draftUrl, notes = '', creatorId = null) {
    const campaigns = await this.getCampaigns();
    let updatedCamp = null;
    const updated = campaigns.map(camp => {
      if (camp.id === campaignId) {
        updatedCamp = {
          ...camp,
          submittedUrl: draftUrl,
          applicationStatus: 'draft_submitted',
          draftNotes: notes
        };
        return updatedCamp;
      }
      return camp;
    });

    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(updated));

    // Also update matching application in application registry
    const apps = await this.getApplications();
    const updatedApps = apps.map(app => {
      if (app.campaignId === campaignId) {
        return {
          ...app,
          status: 'draft_submitted',
          submittedUrl: draftUrl,
          draftNotes: notes,
          submittedAt: new Date().toISOString().split('T')[0]
        };
      }
      return app;
    });
    localStorage.setItem(LOCAL_STORAGE_APPLICATIONS_KEY, JSON.stringify(updatedApps));

    try {
      await supabase.from('ugc_applications').update({
        status: 'draft_submitted',
        draft_video_url: draftUrl,
        notes
      }).eq('campaign_id', campaignId);
    } catch (err) {}

    return updatedCamp;
  },

  async approveDraftAndPublish(campaignId, applicationId, feedback = '') {
    // 1. Update application status
    const reviewed = await this.reviewApplication(applicationId, 'completed', feedback);

    // 2. Fetch campaign details
    const camps = await this.getCampaigns();
    const camp = camps.find(c => c.id === campaignId) || {};

    // 3. Mark campaign applicationStatus completed
    await this.updateCampaign(campaignId, { applicationStatus: 'completed' });

    // 4. Publish to platform Reels feed via ReelsService
    const creatorHandle = reviewed?.creatorHandle || '@cairo_chic';
    const creatorName = reviewed?.creatorName || 'صانعة محتوى معتمدة';
    const videoUrl = reviewed?.submittedUrl || camp.submittedUrl || '/images/reels/linen_abaya.mp4';
    
    await ReelsService.saveReel({
      id: `reel-ugc-${Date.now()}`,
      creatorId: reviewed?.creatorId || null,
      creatorHandle,
      creatorName,
      avatar: reviewed?.creatorAvatar || '/images/reels/reel_1.jpg',
      videoBg: videoUrl,
      caption: `${camp.title} • تنسيق مميز بالتعاون مع ${camp.brandName} 🇪🇬✨\n${reviewed?.draftNotes || camp.guidelines}`,
      music: 'Authentic Egyptian Vibes • Trending Sound',
      likes: 42,
      comments: 1,
      saves: 18,
      products: camp.productId ? [{
        id: camp.productId,
        title: camp.productName,
        price: camp.budgetEgp || 950,
        merchantId: camp.merchantId
      }] : []
    });

    // 5. Add to creator's content library
    await this.createContent({
      title: camp.title,
      titleEn: camp.titleEn || camp.title,
      status: 'published',
      taggedProduct: camp.productName,
      thumbnail: camp.brandLogo || '/images/products/linen_abaya.jpg'
    });

    return { success: true, application: reviewed, campaign: camp };
  },

  // 5. CREATOR CONTENT / REELS
  async getContent() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored content:', e);
    }
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(DEFAULT_CONTENT));
    return DEFAULT_CONTENT;
  },

  async createContent(contentData) {
    const content = await this.getContent();
    const newItem = {
      id: `cnt-${Date.now()}`,
      title: contentData.title || 'ريلز جديد',
      titleEn: contentData.titleEn || 'New Reel',
      views: '0',
      viewsCount: 0,
      likes: '0',
      comments: 0,
      shares: '0',
      salesGenerated: '0 ج.م',
      commissionEarned: '0 ج.م',
      date: new Date().toISOString().split('T')[0],
      status: contentData.status || 'published',
      thumbnail: contentData.thumbnail || '/images/products/linen_abaya.jpg',
      taggedProduct: contentData.taggedProduct || 'منتج مميز'
    };

    const updated = [newItem, ...content];
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(updated));
    return newItem;
  },

  async deleteContent(id) {
    const content = await this.getContent();
    const filtered = content.filter(item => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_CONTENT_KEY, JSON.stringify(filtered));
    return true;
  },

  // 6. CREATOR SETTINGS
  async getSettings() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored creator settings:', e);
    }
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },

  async updateSettings(newSettings) {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...newSettings };
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to update creator settings:', e);
      return newSettings;
    }
  }
};
