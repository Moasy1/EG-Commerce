import { eventTracker } from '../analytics/eventTracker.js';

const INTERESTS_STORAGE_KEY = 'eg_user_interests_v1';
const CREATOR_AFFINITY_KEY = 'eg_creator_affinity_v1';
const MERCHANT_AFFINITY_KEY = 'eg_merchant_affinity_v1';

// Engineering event weights for interest & affinity
const EVENT_WEIGHTS = {
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

// Half-life in days for exponential time decay
const HALF_LIFE_DAYS = 7;
const DECAY_LAMBDA = Math.LN2 / (HALF_LIFE_DAYS * 24 * 3600 * 1000);

class InterestService {
  constructor() {
    this.userInterests = this.loadMap(INTERESTS_STORAGE_KEY);
    this.creatorAffinities = this.loadMap(CREATOR_AFFINITY_KEY);
    this.merchantAffinities = this.loadMap(MERCHANT_AFFINITY_KEY);

    // Subscribe to event stream for continuous real-time learning
    eventTracker.subscribe((event) => this.handleEvent(event));
  }

  loadMap(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  saveMap(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  }

  handleEvent(event) {
    const weight = EVENT_WEIGHTS[event.event_type];
    if (weight === undefined) return;

    const now = Date.now();
    const category = event.metadata?.categoryId || (event.entity_id?.includes('sheglam') ? 'beauty' : 'fashion');

    // 1. Update Category Interest
    if (category) {
      const current = this.userInterests[category] || { score: 0, lastUpdated: now, count: 0 };
      const decayedScore = this.applyDecay(current.score, current.lastUpdated, now);
      const newScore = Math.max(0, decayedScore + weight);

      this.userInterests[category] = {
        score: Number(newScore.toFixed(3)),
        lastUpdated: now,
        count: current.count + 1
      };
      this.saveMap(INTERESTS_STORAGE_KEY, this.userInterests);
    }

    // 2. Update Creator Affinity
    if (event.creator_id) {
      const current = this.creatorAffinities[event.creator_id] || { score: 0, lastUpdated: now, count: 0 };
      const decayedScore = this.applyDecay(current.score, current.lastUpdated, now);
      const newScore = Math.max(0, decayedScore + (weight > 0 ? weight * 0.8 : weight));

      this.creatorAffinities[event.creator_id] = {
        score: Number(newScore.toFixed(3)),
        lastUpdated: now,
        count: current.count + 1
      };
      this.saveMap(CREATOR_AFFINITY_KEY, this.creatorAffinities);
    }

    // 3. Update Merchant Affinity
    if (event.merchant_id) {
      const current = this.merchantAffinities[event.merchant_id] || { score: 0, lastUpdated: now, count: 0 };
      const decayedScore = this.applyDecay(current.score, current.lastUpdated, now);
      const newScore = Math.max(0, decayedScore + (weight > 0 ? weight * 0.8 : weight));

      this.merchantAffinities[event.merchant_id] = {
        score: Number(newScore.toFixed(3)),
        lastUpdated: now,
        count: current.count + 1
      };
      this.saveMap(MERCHANT_AFFINITY_KEY, this.merchantAffinities);
    }
  }

  applyDecay(score, lastTime, currentTime) {
    if (!score || score <= 0) return 0;
    const deltaMs = currentTime - lastTime;
    return score * Math.exp(-DECAY_LAMBDA * deltaMs);
  }

  getCategoryInterestScore(categoryId) {
    const data = this.userInterests[categoryId];
    if (!data) return 0.1; // Baseline exploration prior
    const decayed = this.applyDecay(data.score, data.lastUpdated, Date.now());
    // Normalize to 0.0 - 1.0 range (log scale)
    return Math.min(1.0, Math.max(0.05, Math.log1p(decayed) / 4));
  }

  getCreatorAffinity(creatorId) {
    if (!creatorId) return 0;
    const data = this.creatorAffinities[creatorId];
    if (!data) return 0;
    const decayed = this.applyDecay(data.score, data.lastUpdated, Date.now());
    return Math.min(1.0, Math.log1p(decayed) / 3.5);
  }

  getMerchantAffinity(merchantId) {
    if (!merchantId) return 0;
    const data = this.merchantAffinities[merchantId];
    if (!data) return 0;
    const decayed = this.applyDecay(data.score, data.lastUpdated, Date.now());
    return Math.min(1.0, Math.log1p(decayed) / 3.5);
  }

  getAllInterests() {
    const result = {};
    const now = Date.now();
    for (const [cat, data] of Object.entries(this.userInterests)) {
      result[cat] = Number(this.applyDecay(data.score, data.lastUpdated, now).toFixed(2));
    }
    return result;
  }
}

export const interestService = new InterestService();
