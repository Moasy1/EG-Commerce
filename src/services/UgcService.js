import { supabase } from '../lib/supabase';

const LOCAL_STORAGE_CREATOR_KEY = 'eg_creator_profile_v1';
const LOCAL_STORAGE_CAMPAIGNS_KEY = 'eg_creator_campaigns_v1';
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
    title: 'إطلاق كولكشن الكتان الصيفي 2026',
    titleEn: 'Kaizen Linen Summer 2026 Launch',
    brandName: 'Talieska Studio • تاليسكا',
    brandLogo: '/images/products/linen_abaya.jpg',
    productName: 'عباية كتان ناعمة وتوب كاجوال',
    rewardType: 'outfit_commission',
    rewardLabel: 'طقم مجاني + 15% عمولة مبيعات',
    rewardLabelEn: 'Free Outfit + 15% Commission',
    budgetEgp: 3500,
    slotsAvailable: 4,
    deadline: '2026-09-30',
    status: 'active',
    applied: true,
    applicationStatus: 'approved', // 'applied' | 'approved' | 'draft_submitted' | 'completed'
    submittedUrl: 'https://egyptian-commerce.com/reels/talieska-summer-look',
    guidelines: 'تصوير ريلز عالي الجودة يبرز خامة الكتان في ضوء النهار، مع توضيح كود الخصم في الوصف.'
  },
  {
    id: 'camp-2',
    title: 'تنسيقات الشارع المعاصرة • Cairo Streetwear',
    titleEn: 'Contemporary Streetwear Styling',
    brandName: 'Nilotic Threads • نايلوتيك',
    brandLogo: '/images/products/linen_shirt.jpg',
    productName: 'قميص كتان فضفاض وبنطال أوفرسايز',
    rewardType: 'fixed_fee',
    rewardLabel: '4,200 ج.م كاش + طقم كامل',
    rewardLabelEn: '4,200 EGP + Full Outfit',
    budgetEgp: 4200,
    slotsAvailable: 2,
    deadline: '2026-10-05',
    status: 'active',
    applied: true,
    applicationStatus: 'applied',
    submittedUrl: '',
    guidelines: 'ستايل عصري شبابي في شوارع المعادي أو الزمالك مع منشن للبراند واستخدام تراك التريند.'
  },
  {
    id: 'camp-3',
    title: 'تحدي ستايلنج العبايات الأنيقة للعمل',
    titleEn: 'Workwear Modest Styling Challenge',
    brandName: 'Rawas Modest Wear • رَواس',
    brandLogo: '/images/products/silk_dress.jpg',
    productName: 'فستان حرير مع جاكيت كيمونو محتشم',
    rewardType: 'fixed_fee',
    rewardLabel: '3,800 ج.م + كود خصم للمتابعين',
    rewardLabelEn: '3,800 EGP + Follower Discount Code',
    budgetEgp: 3800,
    slotsAvailable: 6,
    deadline: '2026-10-12',
    status: 'active',
    applied: false,
    applicationStatus: null,
    submittedUrl: '',
    guidelines: 'توضيح 3 طرق مختلفة لارتداء الفستان في مناسبات العمل والخروجات الصباحية.'
  },
  {
    id: 'camp-4',
    title: 'حملة إكسسوارات النحاس الفاطمي اليدوي',
    titleEn: 'Handcrafted Heritage Brass Accessories',
    brandName: 'Khan El Khalili Crafts',
    brandLogo: '/images/products/copper_lantern.jpg',
    productName: 'عقد نحاسي عريض وأقراط تراثية',
    rewardType: 'commission',
    rewardLabel: '20% عمولة على كل طلب عبر الرابط',
    rewardLabelEn: '20% Commission on each tagged sale',
    budgetEgp: 2500,
    slotsAvailable: 8,
    deadline: '2026-10-20',
    status: 'active',
    applied: false,
    applicationStatus: null,
    submittedUrl: '',
    guidelines: 'التركيز على تفاصيل الحرفية اليدوية المصرية وجودة لمعان النحاس.'
  },
  {
    id: 'camp-5',
    title: 'أسبوع القطن المصري فائق النعومة',
    titleEn: 'Premium Egyptian Cotton Week',
    brandName: 'Giza Cotton House',
    brandLogo: '/images/products/leather_bag.jpg',
    productName: 'تيشيرت وبلوفر قطن جيزة 100%',
    rewardType: 'fixed_fee',
    rewardLabel: '5,000 ج.م + بوكس هدايا فاخر',
    rewardLabelEn: '5,000 EGP + Luxury Gift Box',
    budgetEgp: 5000,
    slotsAvailable: 3,
    deadline: '2026-10-28',
    status: 'active',
    applied: false,
    applicationStatus: null,
    submittedUrl: '',
    guidelines: 'اختبار ملمس القطن الأصلي ومقارنته بالأقمشة العادية مع تركيز على شعور الراحة.'
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

    // City demographics in Egypt
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

  // 3. CAMPAIGNS HUB
  async getCampaigns() {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CAMPAIGNS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse stored campaigns:', e);
    }

    try {
      const { data, error } = await supabase.from('ugc_campaigns').select('*, merchants(*), products(*)');
      if (!error && data && data.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(data));
        return data;
      }
    } catch (err) {
      // Ignore Supabase connection fallback
    }

    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(DEFAULT_CAMPAIGNS));
    return DEFAULT_CAMPAIGNS;
  },

  async applyForCampaign(campaignId, creatorId = 'cr-01', notes = '') {
    const campaigns = await this.getCampaigns();
    const updated = campaigns.map(camp => {
      if (camp.id === campaignId) {
        return {
          ...camp,
          applied: true,
          applicationStatus: 'applied',
          slotsAvailable: Math.max(0, (camp.slotsAvailable || 1) - 1),
          notes
        };
      }
      return camp;
    });

    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(updated));

    try {
      await supabase.from('ugc_applications').insert({
        campaign_id: campaignId,
        creator_id: creatorId,
        status: 'applied',
        notes
      });
    } catch (err) {
      // Fallback handled locally
    }

    return updated.find(c => c.id === campaignId);
  },

  async submitCampaignDraft(campaignId, draftUrl, notes = '') {
    const campaigns = await this.getCampaigns();
    const updated = campaigns.map(camp => {
      if (camp.id === campaignId) {
        return {
          ...camp,
          submittedUrl: draftUrl,
          applicationStatus: 'draft_submitted',
          draftNotes: notes
        };
      }
      return camp;
    });

    localStorage.setItem(LOCAL_STORAGE_CAMPAIGNS_KEY, JSON.stringify(updated));
    return updated.find(c => c.id === campaignId);
  },

  // 4. CREATOR CONTENT / REELS
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

  // 5. CREATOR SETTINGS
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
