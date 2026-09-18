import { followService } from '../social/followService.js';
import { interestService } from './interestService.js';
import { eventTracker } from '../analytics/eventTracker.js';

export const candidateService = {
  /**
   * Assemble candidate reels for feed scoring
   */
  async generateCandidates(allReels = [], userId = null, { tab = 'foryou' } = {}) {
    if (!allReels || allReels.length === 0) return [];

    // If tab is 'following', filter strictly for followed creators
    if (tab === 'following') {
      const followedIds = await followService.getFollowingIds(userId);
      const followingCandidates = allReels.filter(r => 
        followedIds.includes(r.creatorId) || 
        followedIds.includes(r.creator_id) ||
        followedIds.includes(r.creatorHandle)
      );
      return followingCandidates.length > 0 ? followingCandidates : allReels.slice(0, 10);
    }

    // If tab is 'trending', return by trend & engagement velocity
    if (tab === 'trending') {
      return [...allReels].sort((a, b) => {
        const scoreA = (Number(a.trendScore) || 0.5) * 0.6 + (Number(a.likes) || 0) * 0.4;
        const scoreB = (Number(b.trendScore) || 0.5) * 0.6 + (Number(b.likes) || 0) * 0.4;
        return scoreB - scoreA;
      });
    }

    // Tab 'foryou': Multi-source candidate generator
    const candidateMap = new Map();

    // Source 1: Followed Creators
    const followedIds = await followService.getFollowingIds(userId);
    allReels.forEach(r => {
      if (followedIds.includes(r.creatorId) || followedIds.includes(r.creator_id)) {
        candidateMap.set(r.id, { reel: r, source: 'following' });
      }
    });

    // Source 2: Interest-matched Reels
    const userInterests = interestService.getAllInterests();
    const sortedCategories = Object.keys(userInterests).sort((a, b) => userInterests[b] - userInterests[a]);
    const topCategories = sortedCategories.slice(0, 3);

    allReels.forEach(r => {
      const cat = r.categoryId || (r.id.includes('sheglam') ? 'beauty' : 'fashion');
      if (topCategories.includes(cat) && !candidateMap.has(r.id)) {
        candidateMap.set(r.id, { reel: r, source: 'interest' });
      }
    });

    // Source 3: Similar Content (recently liked / watched reels)
    const recentEvents = eventTracker.getLocalEvents();
    const likedReelIds = recentEvents
      .filter(e => e.event_type === 'reel_like' || e.event_type === 'reel_save')
      .map(e => e.reel_id)
      .filter(Boolean);

    allReels.forEach(r => {
      if (likedReelIds.includes(r.id) && !candidateMap.has(r.id)) {
        candidateMap.set(r.id, { reel: r, source: 'similar_content' });
      }
    });

    // Source 4: Trending / Top Conversion Content
    const sortedTrending = [...allReels].sort((a, b) => (Number(b.trendScore) || 0.5) - (Number(a.trendScore) || 0.5));
    sortedTrending.slice(0, 10).forEach(r => {
      if (!candidateMap.has(r.id)) {
        candidateMap.set(r.id, { reel: r, source: 'trending' });
      }
    });

    // Source 5: Exploration (Random 15% sample to prevent filter bubbles)
    allReels.forEach(r => {
      if (!candidateMap.has(r.id) && Math.random() < 0.20) {
        candidateMap.set(r.id, { reel: r, source: 'exploration' });
      }
    });

    // Fallback: If map is smaller than total reels, fill up with remaining
    if (candidateMap.size < allReels.length) {
      allReels.forEach(r => {
        if (!candidateMap.has(r.id)) {
          candidateMap.set(r.id, { reel: r, source: 'platform' });
        }
      });
    }

    return Array.from(candidateMap.values());
  }
};
