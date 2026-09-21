import { reelService } from '../social/reelService.js';
import { candidateService } from './candidateService.js';
import { rankingService } from './rankingService.js';
import { diversityService } from './diversityService.js';

export const feedService = {
  /**
   * Main feed API endpoint
   * Returns: { items: [{ reel, ranking }], nextCursor, hasMore }
   *
   * @param {string|null} merchantId  - When set, only reels for this merchant are shown.
   *                                    Pass null for the public Discover feed.
   */
  async getPersonalizedFeed({
    userId = null,
    merchantId = null,
    tab = 'foryou',
    cursor = 0,
    limit = 10,
    fallbackReels = []
  } = {}) {
    // Build tenant filter — public Discover page passes merchantId = null
    const reelFilter = merchantId
      ? { merchantId }
      : (userId && tab !== 'foryou' ? { creatorId: userId } : null);

    // 1. Fetch available reels scoped to the correct tenant
    let baseReels = await reelService.getReels(reelFilter);
    if (!baseReels || baseReels.length === 0) {
      baseReels = fallbackReels;
    }

    if (!baseReels || baseReels.length === 0) {
      return {
        items: [],
        nextCursor: null,
        hasMore: false
      };
    }

    // 2. Candidate Generation (Following, Interests, Similar, Trending, Exploration)
    const candidates = await candidateService.generateCandidates(baseReels, userId, { tab });

    // 3. Ranking Engine
    const ranked = rankingService.rankCandidates(candidates, userId);

    // 4. Diversity Engine
    const diversified = diversityService.applyDiversity(ranked);

    // 5. Cursor Pagination
    const startIndex = Number(cursor) || 0;
    const paginatedItems = diversified.slice(startIndex, startIndex + limit);
    const nextCursor = (startIndex + limit < diversified.length) ? startIndex + limit : null;

    return {
      items: paginatedItems,
      nextCursor,
      hasMore: nextCursor !== null,
      totalCount: diversified.length
    };
  }
};
