import { supabase } from '../../lib/supabase.js';

const LIKED_REELS_KEY = 'eg_liked_reels';
const SAVED_REELS_KEY = 'eg_saved_reels';
const SAVED_PRODUCTS_KEY = 'eg_saved_products';

export const engagementService = {
  // --- REEL LIKES ---
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

  async isReelLiked(reelId, userId = null) {
    const local = this.getLocalLikedReels();
    if (local.includes(reelId)) return true;

    if (userId) {
      try {
        const { data } = await supabase
          .from('reel_likes')
          .select('reel_id')
          .eq('user_id', userId)
          .eq('reel_id', reelId)
          .maybeSingle();
        if (data) {
          if (!local.includes(reelId)) this.setLocalLikedReels([...local, reelId]);
          return true;
        }
      } catch (e) {}
    }
    return false;
  },

  async toggleLikeReel(reelId, userId = null) {
    const isLiked = await this.isReelLiked(reelId, userId);
    const local = this.getLocalLikedReels();

    if (isLiked) {
      const updated = local.filter(id => id !== reelId);
      this.setLocalLikedReels(updated);
      if (userId) {
        try {
          await supabase.from('reel_likes').delete().eq('user_id', userId).eq('reel_id', reelId);
        } catch (e) {}
      }
      return false;
    } else {
      if (!local.includes(reelId)) this.setLocalLikedReels([...local, reelId]);
      if (userId) {
        try {
          await supabase.from('reel_likes').insert({ user_id: userId, reel_id: reelId });
        } catch (e) {}
      }
      return true;
    }
  },

  // --- REEL SAVES ---
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

  async isReelSaved(reelId, userId = null) {
    const local = this.getLocalSavedReels();
    if (local.includes(reelId)) return true;

    if (userId) {
      try {
        const { data } = await supabase
          .from('reel_saves')
          .select('reel_id')
          .eq('user_id', userId)
          .eq('reel_id', reelId)
          .maybeSingle();
        if (data) {
          if (!local.includes(reelId)) this.setLocalSavedReels([...local, reelId]);
          return true;
        }
      } catch (e) {}
    }
    return false;
  },

  async toggleSaveReel(reelId, userId = null) {
    const isSaved = await this.isReelSaved(reelId, userId);
    const local = this.getLocalSavedReels();

    if (isSaved) {
      const updated = local.filter(id => id !== reelId);
      this.setLocalSavedReels(updated);
      if (userId) {
        try {
          await supabase.from('reel_saves').delete().eq('user_id', userId).eq('reel_id', reelId);
        } catch (e) {}
      }
      return false;
    } else {
      if (!local.includes(reelId)) this.setLocalSavedReels([...local, reelId]);
      if (userId) {
        try {
          await supabase.from('reel_saves').insert({ user_id: userId, reel_id: reelId });
        } catch (e) {}
      }
      return true;
    }
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
    try {
      await supabase.from('reel_shares').insert({
        reel_id: reelId,
        user_id: userId,
        share_type: shareType
      });
    } catch (e) {}
    return true;
  }
};
