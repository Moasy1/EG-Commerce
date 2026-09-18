import { supabase } from '../../lib/supabase.js';

const LOCAL_STORAGE_KEY = 'eg_reels_mock_v3';
const HIDDEN_REELS_KEY = 'eg_hidden_reels';
const REPORTS_KEY = 'eg_reel_reports';

export const reelService = {
  async getReels() {
    let dbReels = [];
    try {
      const { data, error } = await supabase
        .from('reels')
        .select(`
          *,
          creators (
            id,
            bio,
            rating,
            profiles (name, avatar_url, username)
          ),
          merchants (
            id,
            store_name,
            slug
          ),
          reel_products (
            display_order,
            tag_x,
            tag_y,
            is_primary,
            products (*)
          )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        dbReels = data.map(r => this.normalizeDbReel(r));
      }
    } catch (err) {
      console.warn('DB Reels query failed, utilizing local store:', err.message);
    }

    // Retrieve local reels
    let localReels = [];
    try {
      const localStr = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localStr) {
        const parsed = JSON.parse(localStr);
        if (Array.isArray(parsed)) localReels = parsed;
      }
    } catch (e) {}

    // Filter out hidden reels
    const hiddenIds = this.getHiddenReelIds();

    let combined = [];
    if (localReels.length > 0) {
      const localIds = new Set(localReels.map(r => r.id));
      combined = [...localReels, ...dbReels.filter(r => !localIds.has(r.id))];
    } else if (dbReels.length > 0) {
      combined = dbReels;
    }

    return combined.filter(r => !hiddenIds.includes(r.id));
  },

  normalizeDbReel(db) {
    const products = (db.reel_products || []).map(rp => ({
      id: rp.products?.id,
      title: rp.products?.title,
      price: rp.products?.sale_price || rp.products?.base_price,
      originalPrice: rp.products?.base_price,
      image: rp.products?.images?.[0] || '/images/products/linen_abaya.jpg',
      tagX: rp.tag_x,
      tagY: rp.tag_y,
      isPrimary: rp.is_primary
    })).filter(p => Boolean(p.id));

    return {
      id: db.id,
      creatorId: db.creator_id,
      creatorHandle: db.creators?.profiles?.username ? `@${db.creators.profiles.username}` : '@creator',
      creatorName: db.creators?.profiles?.name || 'صانع محتوى مصري',
      avatar: db.creators?.profiles?.avatar_url || db.thumbnail_url || '/images/reels/reel_1.jpg',
      videoBg: db.video_url,
      caption: db.caption || '',
      likes: db.likes_count || 0,
      comments: 0,
      saves: 0,
      products: products,
      categoryId: db.category_id || 'fashion',
      qualityScore: Number(db.quality_score) || 0.75,
      engagementScore: Number(db.engagement_score) || 0.50,
      conversionScore: Number(db.conversion_score) || 0.30,
      trendScore: Number(db.trend_score) || 0.50,
      durationMs: db.duration_ms || 15000,
      createdAt: db.created_at
    };
  },

  async saveReel(reelData) {
    const formatted = {
      id: reelData.id || `reel-${Date.now()}`,
      creatorId: reelData.creatorId || reelData.userId || null,
      creatorHandle: reelData.creatorHandle || '@egyptian_creator',
      creatorName: reelData.creatorName || 'صانع محتوى مصري',
      avatar: reelData.avatar || '/images/reels/reel_1.jpg',
      videoBg: reelData.videoBg || reelData.video || '/images/reels/linen_abaya.mp4',
      caption: reelData.caption || '',
      music: reelData.music || 'Egyptian Aesthetic Vibes',
      likes: Number(reelData.likes) || 120,
      comments: Number(reelData.comments) || 3,
      saves: Number(reelData.saves) || 45,
      products: reelData.products || [],
      categoryId: reelData.categoryId || (reelData.id?.includes('sheglam') ? 'beauty' : 'fashion'),
      qualityScore: reelData.qualityScore || 0.8,
      trendScore: reelData.trendScore || 0.6,
      createdAt: reelData.createdAt || new Date().toISOString()
    };

    // 1. Try Supabase
    try {
      await supabase.from('reels').insert({
        id: formatted.id.includes('-') && formatted.id.length === 36 ? formatted.id : undefined,
        video_url: formatted.videoBg,
        caption: formatted.caption,
        status: 'active',
        category_id: formatted.categoryId
      });
    } catch (e) {}

    // 2. Sync to local storage
    try {
      const localStr = localStorage.getItem(LOCAL_STORAGE_KEY);
      const list = localStr ? JSON.parse(localStr) : [];
      const updated = [formatted, ...list.filter(r => r.id !== formatted.id)];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}

    return formatted;
  },

  async updateReel(reelId, updates) {
    try {
      await supabase.from('reels').update(updates).eq('id', reelId);
    } catch (e) {}

    try {
      const localStr = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localStr) {
        const list = JSON.parse(localStr);
        const updated = list.map(r => r.id === reelId ? { ...r, ...updates } : r);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {}
    return true;
  },

  async deleteReel(reelId) {
    try {
      await supabase.from('reels').delete().eq('id', reelId);
    } catch (e) {}

    try {
      const localStr = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localStr) {
        const list = JSON.parse(localStr);
        const filtered = list.filter(r => r.id !== reelId);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch (e) {}
    return true;
  },

  getHiddenReelIds() {
    try {
      const raw = localStorage.getItem(HIDDEN_REELS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  async hideReel(reelId) {
    const list = this.getHiddenReelIds();
    if (!list.includes(reelId)) {
      list.push(reelId);
      localStorage.setItem(HIDDEN_REELS_KEY, JSON.stringify(list));
    }
    return true;
  },

  async reportReel(reelId, reason, details = '') {
    const reportItem = {
      id: `rep-${Date.now()}`,
      reel_id: reelId,
      reason,
      details,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.from('reel_reports').insert(reportItem);
    } catch (e) {}

    try {
      const raw = localStorage.getItem(REPORTS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push(reportItem);
      localStorage.setItem(REPORTS_KEY, JSON.stringify(list));
    } catch (e) {}

    return reportItem;
  }
};
