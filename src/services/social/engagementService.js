import { supabase } from '../../lib/supabase.js';

const LIKED_REELS_KEY = 'eg_liked_reels';
const SAVED_REELS_KEY = 'eg_saved_reels';
const SAVED_PRODUCTS_KEY = 'eg_saved_products';
const ENGAGEMENT_COUNTS_KEY = 'eg_engagement_counts_cache';

export const REEL_ID_MAP = {
  'reel-fashion-blazer': 'ee000000-0000-0000-0000-000000000001',
  'reel-fashion-shirt': 'ee000000-0000-0000-0000-000000000002',
  'reel-fashion-top': 'ee000000-0000-0000-0000-000000000003',
  'reel-fashion-bag': 'ee000000-0000-0000-0000-000000000004',
  'reel-fashion-knit': 'ee000000-0000-0000-0000-000000000005',
  'reel-fashion-suede': 'ee000000-0000-0000-0000-000000000006',
  'reel-fashion-watch': 'ee000000-0000-0000-0000-000000000007',
  'reel-fashion-woven': 'ee000000-0000-0000-0000-000000000008',
  'reel-fashion-barrel': 'ee000000-0000-0000-0000-000000000009',
  'reel-fashion-cuban': 'ee000000-0000-0000-0000-000000000010',
  'reel-sheglam-1': 'ee000000-0000-0000-0000-000000000011',
  'reel-sheglam-2': 'ee000000-0000-0000-0000-000000000012',
};

export const REVERSE_REEL_ID_MAP = Object.fromEntries(
  Object.entries(REEL_ID_MAP).map(([k, v]) => [v, k])
);

export const toCanonicalReelId = (id) => {
  if (!id) return 'ee000000-0000-0000-0000-000000000001';
  if (REEL_ID_MAP[id]) return REEL_ID_MAP[id];
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return id;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(12, '0');
  return `ee000000-0000-0000-0000-${hex.slice(0, 12)}`;
};

export const BASE_REEL_ENGAGEMENT = {
  'ee000000-0000-0000-0000-000000000001': { likes: 4820, saves: 1140, comments: 218 },
  'ee000000-0000-0000-0000-000000000002': { likes: 3240, saves: 820, comments: 139 },
  'ee000000-0000-0000-0000-000000000003': { likes: 2910, saves: 640, comments: 88 },
  'ee000000-0000-0000-0000-000000000004': { likes: 5130, saves: 980, comments: 195 },
  'ee000000-0000-0000-0000-000000000005': { likes: 6420, saves: 1530, comments: 312 },
};

export const engagementService = {
  // Local storage helpers
  getLocalLikedReels() {
    try {
      const stored = localStorage.getItem(LIKED_REELS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  setLocalLikedReels(list) {
    try {
      localStorage.setItem(LIKED_REELS_KEY, JSON.stringify(list));
    } catch (e) {}
  },

  getLocalSavedReels() {
    try {
      const stored = localStorage.getItem(SAVED_REELS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  setLocalSavedReels(list) {
    try {
      localStorage.setItem(SAVED_REELS_KEY, JSON.stringify(list));
    } catch (e) {}
  },

  getLocalCountsCache() {
    try {
      const stored = localStorage.getItem(ENGAGEMENT_COUNTS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  },

  setLocalCountsCache(counts) {
    try {
      localStorage.setItem(ENGAGEMENT_COUNTS_KEY, JSON.stringify(counts));
    } catch (e) {}
  },

  /**
   * Fetch complete live engagement state for a reel
   * Returns: { isLiked, isSaved, likesCount, savesCount, commentsCount }
   */
  async getReelEngagement(reelId, userId = null) {
    const canonicalId = toCanonicalReelId(reelId);
    const base = BASE_REEL_ENGAGEMENT[canonicalId] || { likes: 120, saves: 45, comments: 12 };
    const localCounts = this.getLocalCountsCache();
    const cached = localCounts[canonicalId] || {};

    let isLiked = false;
    let isSaved = false;

    // 1. Check local arrays first
    const localLikes = this.getLocalLikedReels();
    const localSaves = this.getLocalSavedReels();
    if (localLikes.includes(reelId) || localLikes.includes(canonicalId)) isLiked = true;
    if (localSaves.includes(reelId) || localSaves.includes(canonicalId)) isSaved = true;

    // 2. Query database for user's like/save and live counts
    let dbLikesCount = null;
    let dbSavesCount = null;
    let dbCommentsCount = null;

    try {
      // Query like status
      if (userId) {
        const { data: likeRow } = await supabase
          .from('reel_likes')
          .select('reel_id')
          .eq('user_id', userId)
          .eq('reel_id', canonicalId)
          .maybeSingle();

        if (likeRow) {
          isLiked = true;
          if (!localLikes.includes(canonicalId)) {
            this.setLocalLikedReels([...localLikes, canonicalId]);
          }
        }

        const { data: saveRow } = await supabase
          .from('reel_saves')
          .select('reel_id')
          .eq('user_id', userId)
          .eq('reel_id', canonicalId)
          .maybeSingle();

        if (saveRow) {
          isSaved = true;
          if (!localSaves.includes(canonicalId)) {
            this.setLocalSavedReels([...localSaves, canonicalId]);
          }
        }
      }

      // Query live counts from Supabase
      const { count: likeCountRes } = await supabase
        .from('reel_likes')
        .select('*', { count: 'exact', head: true })
        .eq('reel_id', canonicalId);

      if (typeof likeCountRes === 'number') {
        dbLikesCount = likeCountRes;
      }

      const { count: saveCountRes } = await supabase
        .from('reel_saves')
        .select('*', { count: 'exact', head: true })
        .eq('reel_id', canonicalId);

      if (typeof saveCountRes === 'number') {
        dbSavesCount = saveCountRes;
      }

      const { count: commentCountRes } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('reel_id', canonicalId);

      if (typeof commentCountRes === 'number') {
        dbCommentsCount = commentCountRes;
      }
    } catch (err) {
      // Offline or database table not yet present, fallback smoothly
    }

    // Calculate dynamic totals combining baseline with live database rows and local toggles
    const localDelta = cached.delta || (isLiked ? 1 : 0);
    const calculatedLikes = (dbLikesCount !== null && dbLikesCount > 0)
      ? base.likes + dbLikesCount
      : (cached.likesCount || base.likes + localDelta);

    const calculatedSaves = (dbSavesCount !== null && dbSavesCount > 0)
      ? base.saves + dbSavesCount
      : (cached.savesCount || base.saves + (isSaved ? 1 : 0));

    const calculatedComments = (dbCommentsCount !== null && dbCommentsCount > 0)
      ? dbCommentsCount
      : (cached.commentsCount || base.comments);

    return {
      isLiked,
      isSaved,
      likesCount: calculatedLikes,
      savesCount: calculatedSaves,
      commentsCount: calculatedComments
    };
  },

  // --- REEL LIKES ---
  async isReelLiked(reelId, userId = null) {
    const res = await this.getReelEngagement(reelId, userId);
    return res.isLiked;
  },

  async toggleLikeReel(reelId, userId = null) {
    const canonicalId = toCanonicalReelId(reelId);
    const currentEngagement = await this.getReelEngagement(canonicalId, userId);
    const willBeLiked = !currentEngagement.isLiked;

    // Update local like array
    const local = this.getLocalLikedReels();
    const updatedLocal = willBeLiked
      ? [...new Set([...local, canonicalId, reelId])]
      : local.filter(id => id !== canonicalId && id !== reelId);
    this.setLocalLikedReels(updatedLocal);

    // Update counts cache
    const newLikesCount = Math.max(0, currentEngagement.likesCount + (willBeLiked ? 1 : -1));
    const allCounts = this.getLocalCountsCache();
    allCounts[canonicalId] = {
      ...(allCounts[canonicalId] || {}),
      likesCount: newLikesCount,
      delta: willBeLiked ? 1 : 0
    };
    this.setLocalCountsCache(allCounts);

    // Persist to Supabase database
    const effectiveUserId = userId || 'b0000000-0000-0000-0000-000000000001';
    try {
      if (willBeLiked) {
        await supabase
          .from('reel_likes')
          .upsert({ user_id: effectiveUserId, reel_id: canonicalId }, { onConflict: 'user_id, reel_id' });
      } else {
        await supabase
          .from('reel_likes')
          .delete()
          .eq('user_id', effectiveUserId)
          .eq('reel_id', canonicalId);
      }
    } catch (e) {
      console.warn('DB like persist notice:', e.message);
    }

    return {
      isLiked: willBeLiked,
      likesCount: newLikesCount,
      likesDelta: willBeLiked ? 1 : -1
    };
  },

  // --- REEL SAVES ---
  async isReelSaved(reelId, userId = null) {
    const res = await this.getReelEngagement(reelId, userId);
    return res.isSaved;
  },

  async toggleSaveReel(reelId, userId = null) {
    const canonicalId = toCanonicalReelId(reelId);
    const currentEngagement = await this.getReelEngagement(canonicalId, userId);
    const willBeSaved = !currentEngagement.isSaved;

    // Update local save array
    const local = this.getLocalSavedReels();
    const updatedLocal = willBeSaved
      ? [...new Set([...local, canonicalId, reelId])]
      : local.filter(id => id !== canonicalId && id !== reelId);
    this.setLocalSavedReels(updatedLocal);

    // Update counts cache
    const newSavesCount = Math.max(0, currentEngagement.savesCount + (willBeSaved ? 1 : -1));
    const allCounts = this.getLocalCountsCache();
    allCounts[canonicalId] = {
      ...(allCounts[canonicalId] || {}),
      savesCount: newSavesCount
    };
    this.setLocalCountsCache(allCounts);

    // Persist to Supabase database
    const effectiveUserId = userId || 'b0000000-0000-0000-0000-000000000001';
    try {
      if (willBeSaved) {
        await supabase
          .from('reel_saves')
          .upsert({ user_id: effectiveUserId, reel_id: canonicalId }, { onConflict: 'user_id, reel_id' });
      } else {
        await supabase
          .from('reel_saves')
          .delete()
          .eq('user_id', effectiveUserId)
          .eq('reel_id', canonicalId);
      }
    } catch (e) {
      console.warn('DB save persist notice:', e.message);
    }

    return {
      isSaved: willBeSaved,
      savesCount: newSavesCount
    };
  },

  // --- PRODUCT SAVES ---
  getLocalSavedProducts() {
    try {
      const stored = localStorage.getItem(SAVED_PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  setLocalSavedProducts(list) {
    try {
      localStorage.setItem(SAVED_PRODUCTS_KEY, JSON.stringify(list));
    } catch (e) {}
  },

  async isProductSaved(productId, userId = null) {
    const local = this.getLocalSavedProducts();
    if (local.includes(productId)) return true;

    if (userId) {
      try {
        const { data } = await supabase
          .from('saved_products')
          .select('product_id')
          .eq('user_id', userId)
          .eq('product_id', productId)
          .maybeSingle();
        if (data) {
          if (!local.includes(productId)) this.setLocalSavedProducts([...local, productId]);
          return true;
        }
      } catch (e) {}
    }
    return false;
  },

  async toggleSaveProduct(productId, userId = null) {
    const isSaved = await this.isProductSaved(productId, userId);
    const local = this.getLocalSavedProducts();

    if (isSaved) {
      const updated = local.filter(id => id !== productId);
      this.setLocalSavedProducts(updated);
      if (userId) {
        try {
          await supabase.from('saved_products').delete().eq('user_id', userId).eq('product_id', productId);
        } catch (e) {}
      }
      return false;
    } else {
      if (!local.includes(productId)) this.setLocalSavedProducts([...local, productId]);
      if (userId) {
        try {
          await supabase.from('saved_products').insert({ user_id: userId, product_id: productId });
        } catch (e) {}
      }
      return true;
    }
  },

  // --- REEL SHARES ---
  async recordShare(reelId, shareType = 'copy_link', userId = null) {
    const canonicalId = toCanonicalReelId(reelId);
    try {
      await supabase.from('reel_shares').insert({
        reel_id: canonicalId,
        user_id: userId,
        share_type: shareType
      });
    } catch (e) {}
    return true;
  }
};
