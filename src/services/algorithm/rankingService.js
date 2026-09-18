import { interestService } from './interestService.js';
import { eventTracker } from '../analytics/eventTracker.js';
import { algorithmConfig } from './algorithmConfig.js';

export const rankingService = {
  rankCandidates(candidates = [], userId = null) {
    const recentEvents = eventTracker.getLocalEvents();
    const seenReelMap = this.buildRecentImpressionsMap(recentEvents);
    const skippedReelSet = this.buildSkippedReelSet(recentEvents);
    const weights = algorithmConfig.getWeights();
    const penalties = algorithmConfig.getPenalties();

    const scored = candidates.map(candidateItem => {
      const reel = candidateItem.reel || candidateItem;
      const source = candidateItem.source || 'default';

      // 1. Interest Score [0.0 - 1.0]
      const categoryId = reel.categoryId || (reel.id.includes('sheglam') ? 'beauty' : 'fashion');
      const interestScore = interestService.getCategoryInterestScore(categoryId);

      // 2. Creator Affinity [0.0 - 1.0]
      const creatorAffinity = interestService.getCreatorAffinity(reel.creatorId || reel.creator_id);

      // 3. Merchant Affinity [0.0 - 1.0]
      const merchantAffinity = interestService.getMerchantAffinity(reel.merchantId || reel.merchant_id);

      // 4. Engagement Quality [0.0 - 1.0]
      const engagementQuality = Math.min(1.0, (reel.likes || 0) / 50000 + (reel.comments || 0) / 2000);

      // 5. Watch Probability [0.0 - 1.0]
      // Modeled from interest alignment + creator affinity
      const watchProbability = Math.min(1.0, interestScore * 0.6 + creatorAffinity * 0.4);

      // 6. Commerce Probability [0.0 - 1.0]
      // Does this reel have tagged products with discounts/offers?
      const hasProducts = reel.products && reel.products.length > 0;
      const commerceProbability = hasProducts 
        ? Math.min(1.0, 0.4 + merchantAffinity * 0.6) 
        : 0.1;

      // 7. Freshness [0.0 - 1.0]
      const reelAgeDays = reel.createdAt 
        ? (Date.now() - new Date(reel.createdAt).getTime()) / (1000 * 3600 * 24) 
        : 1;
      const freshness = Math.max(0.1, 1.0 / (1.0 + reelAgeDays * 0.1));

      // 8. Trend Score [0.0 - 1.0]
      const trendScore = Number(reel.trendScore) || 0.5;

      // Base Weighted Score
      let score = 
        (interestScore * (weights.interest ?? 0.25)) +
        (creatorAffinity * (weights.creatorAffinity ?? 0.15)) +
        (engagementQuality * (weights.engagementQuality ?? 0.15)) +
        (watchProbability * (weights.watchProbability ?? 0.20)) +
        (commerceProbability * (weights.commerceProbability ?? 0.10)) +
        (freshness * (weights.freshness ?? 0.10)) +
        (trendScore * (weights.trend ?? 0.05));

      // Penalties:
      // Seen recently penalty
      if (seenReelMap.has(reel.id)) {
        const timesSeen = seenReelMap.get(reel.id);
        score -= Math.min(0.40, timesSeen * (penalties.recentSeen ?? 0.15));
      }

      // Fast skip penalty
      if (skippedReelSet.has(reel.id)) {
        score -= (penalties.skip ?? 0.30);
      }

      return {
        reel,
        ranking: {
          score: Number(Math.max(0.01, score).toFixed(3)),
          source,
          breakdown: {
            interestScore: Number(interestScore.toFixed(2)),
            creatorAffinity: Number(creatorAffinity.toFixed(2)),
            commerceProbability: Number(commerceProbability.toFixed(2))
          }
        }
      };
    });

    return scored.sort((a, b) => b.ranking.score - a.ranking.score);
  },

  buildRecentImpressionsMap(events) {
    const map = new Map();
    events.forEach(e => {
      if (e.event_type === 'reel_impression' && e.reel_id) {
        map.set(e.reel_id, (map.get(e.reel_id) || 0) + 1);
      }
    });
    return map;
  },

  buildSkippedReelSet(events) {
    const set = new Set();
    events.forEach(e => {
      if (e.event_type === 'reel_skip' && e.reel_id) {
        set.add(e.reel_id);
      }
    });
    return set;
  }
};
