import { supabase } from '../../lib/supabase.js';

const STORAGE_KEY = 'eg_algorithm_config_v1';

export const ALGORITHM_PRESETS = {
  balanced: {
    id: 'balanced',
    nameAr: 'الوضع المتوازن (افتراضي)',
    nameEn: 'Balanced Discovery (Default)',
    descriptionAr: 'توزيع طبيعي بين اهتمامات المستخدم، قوة صانع المحتوى، والفرص التجارية.',
    descriptionEn: 'Natural blend between user interest, creator strength, and commerce opportunities.',
    weights: {
      interest: 0.25,
      creatorAffinity: 0.15,
      engagementQuality: 0.15,
      watchProbability: 0.20,
      commerceProbability: 0.10,
      freshness: 0.10,
      trend: 0.05
    },
    penalties: {
      recentSeen: 0.15,
      skip: 0.30,
      negativeFeedback: 0.50
    },
    diversity: {
      maxConsecutiveSameCategory: 2,
      minSpacingSameCreator: 3,
      minSpacingSameMerchant: 3
    }
  },
  commerce_heavy: {
    id: 'commerce_heavy',
    nameAr: 'موسم المبيعات (تركيز تجاري)',
    nameEn: 'Commerce Boost (Sales Season)',
    descriptionAr: 'رفع أولوية المنتجات المربوطة بالريلز ومعدل تحويل الطلبات (مثالي للجمعة البيضاء والأعياد).',
    descriptionEn: 'Prioritizes tagged products and checkout conversions (ideal for White Friday & Eid).',
    weights: {
      interest: 0.15,
      creatorAffinity: 0.10,
      engagementQuality: 0.15,
      watchProbability: 0.15,
      commerceProbability: 0.35,
      freshness: 0.05,
      trend: 0.05
    },
    penalties: {
      recentSeen: 0.20,
      skip: 0.25,
      negativeFeedback: 0.50
    },
    diversity: {
      maxConsecutiveSameCategory: 3,
      minSpacingSameCreator: 2,
      minSpacingSameMerchant: 2
    }
  },
  creator_discovery: {
    id: 'creator_discovery',
    nameAr: 'نمو صناع المحتوى (UGC Growth)',
    nameEn: 'Creator Growth Mode',
    descriptionAr: 'مضاعفة أثر صانعي المحتوى الموثوقين وتسهيل استكشاف مواهب ومقاطع جديدة للمتسوقين.',
    descriptionEn: 'Boosts creator affinity and exposes new creator talent to shoppers.',
    weights: {
      interest: 0.20,
      creatorAffinity: 0.30,
      engagementQuality: 0.20,
      watchProbability: 0.15,
      commerceProbability: 0.05,
      freshness: 0.05,
      trend: 0.05
    },
    penalties: {
      recentSeen: 0.15,
      skip: 0.30,
      negativeFeedback: 0.50
    },
    diversity: {
      maxConsecutiveSameCategory: 2,
      minSpacingSameCreator: 4,
      minSpacingSameMerchant: 3
    }
  },
  freshness_first: {
    id: 'freshness_first',
    nameAr: 'إطلاقات جديدة (Viral Freshness)',
    nameEn: 'Fresh Content First',
    descriptionAr: 'تقديم المحتوى الأحدث المنشور خلال الـ 24 ساعة الماضية مع ترند الفيديوهات الصاعدة.',
    descriptionEn: 'Surfaces recently published drops and trending viral clips.',
    weights: {
      interest: 0.15,
      creatorAffinity: 0.10,
      engagementQuality: 0.15,
      watchProbability: 0.15,
      commerceProbability: 0.05,
      freshness: 0.30,
      trend: 0.10
    },
    penalties: {
      recentSeen: 0.25,
      skip: 0.35,
      negativeFeedback: 0.50
    },
    diversity: {
      maxConsecutiveSameCategory: 2,
      minSpacingSameCreator: 3,
      minSpacingSameMerchant: 3
    }
  }
};

export const DEFAULT_EVENT_WEIGHTS = {
  reel_50_percent: 1,
  reel_75_percent: 2,
  reel_complete: 3,
  reel_rewatch: 4,
  reel_like: 5,
  product_click: 6,
  reel_save: 7,
  reel_share: 8,
  quick_buy_open: 8,
  add_to_cart: 12,
  purchase: 20,
  reel_skip: -3,
  reel_not_interested: -15
};

class AlgorithmConfig {
  constructor() {
    this.config = this.loadConfig();
    this.subscribers = new Set();
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          preset: parsed.preset || 'balanced',
          weights: { ...ALGORITHM_PRESETS.balanced.weights, ...(parsed.weights || {}) },
          penalties: { ...ALGORITHM_PRESETS.balanced.penalties, ...(parsed.penalties || {}) },
          diversity: { ...ALGORITHM_PRESETS.balanced.diversity, ...(parsed.diversity || {}) },
          eventWeights: { ...DEFAULT_EVENT_WEIGHTS, ...(parsed.eventWeights || {}) }
        };
      }
    } catch (e) {}

    return {
      preset: 'balanced',
      weights: { ...ALGORITHM_PRESETS.balanced.weights },
      penalties: { ...ALGORITHM_PRESETS.balanced.penalties },
      diversity: { ...ALGORITHM_PRESETS.balanced.diversity },
      eventWeights: { ...DEFAULT_EVENT_WEIGHTS }
    };
  }

  saveConfig() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {}
    this.notify();

    // Async sync to Supabase if configured
    try {
      supabase.from('algorithm_settings').upsert({
        id: 'global',
        preset: this.config.preset,
        weights: this.config.weights,
        penalties: this.config.penalties,
        diversity: this.config.diversity,
        event_weights: this.config.eventWeights,
        updated_at: new Date().toISOString()
      }).then(() => {}).catch(() => {});
    } catch (e) {}
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    for (const sub of this.subscribers) {
      try { sub(this.config); } catch (e) {}
    }
  }

  applyPreset(presetKey) {
    const preset = ALGORITHM_PRESETS[presetKey];
    if (!preset) return false;

    this.config.preset = presetKey;
    this.config.weights = { ...preset.weights };
    this.config.penalties = { ...preset.penalties };
    this.config.diversity = { ...preset.diversity };
    this.saveConfig();
    return true;
  }

  updateWeights(newWeights) {
    this.config.weights = { ...this.config.weights, ...newWeights };
    this.config.preset = 'custom';
    this.saveConfig();
  }

  updatePenalties(newPenalties) {
    this.config.penalties = { ...this.config.penalties, ...newPenalties };
    this.saveConfig();
  }

  updateDiversity(newDiversity) {
    this.config.diversity = { ...this.config.diversity, ...newDiversity };
    this.saveConfig();
  }

  updateEventWeights(newEvents) {
    this.config.eventWeights = { ...this.config.eventWeights, ...newEvents };
    this.saveConfig();
  }

  resetToDefaults() {
    this.applyPreset('balanced');
    this.config.eventWeights = { ...DEFAULT_EVENT_WEIGHTS };
    this.saveConfig();
  }

  getConfig() {
    return this.config;
  }

  getWeights() {
    return this.config.weights;
  }

  getPenalties() {
    return this.config.penalties;
  }

  getDiversityConfig() {
    return this.config.diversity;
  }

  getEventWeights() {
    return this.config.eventWeights;
  }
}

export const algorithmConfig = new AlgorithmConfig();
