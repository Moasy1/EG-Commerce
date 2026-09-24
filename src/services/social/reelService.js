import { supabase } from '../../lib/supabase.js';
import { apiConfig } from '../../config/apiConfig.js';

const LOCAL_STORAGE_KEY = 'eg_reels_mock_v3';
const HIDDEN_REELS_KEY = 'eg_hidden_reels';
const REPORTS_KEY = 'eg_reel_reports';

export const reelService = {
  async getReels(filter = null) {
    // Build query URL with tenant filter params
    let queryUrl = '/api/reels';
    if (filter && typeof filter === 'object') {
      const params = new URLSearchParams();
      if (filter.merchantId)    params.append('merchantId',    filter.merchantId);
      if (filter.creatorId)     params.append('creatorId',     filter.creatorId);
      if (filter.storeSlug)     params.append('storeSlug',     filter.storeSlug);
      if (filter.creatorHandle) params.append('creatorHandle', filter.creatorHandle);
      if (params.toString()) queryUrl += `?${params.toString()}`;
    }

    // 1. Fetch from Hostinger / Shared Backend API
    try {
      const res = await fetch(apiConfig.getApiUrl(queryUrl), { cache: 'no-store' });
      if (res.ok) {
        const shared = await res.json();
        if (Array.isArray(shared) && shared.length > 0) {
          const normalized = shared.map(r => ({
            ...r,
            videoBg: apiConfig.getMediaUrl(r.videoBg || r.video_url),
            avatar: apiConfig.getMediaUrl(r.avatar || r.thumbnail_url)
          }));
          // Only cache globally when fetching without filter (public feed)
          if (!filter) {
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(normalized));
            } catch (e) {}
          }
          const hiddenIds = this.getHiddenReelIds();
          let filtered = normalized.filter(r => !hiddenIds.includes(r.id));
          if (filter && typeof filter === 'object') {
            filtered = filtered.filter(r => {
              if (filter.merchantId && (
                r.merchantId === filter.merchantId ||
                r.creatorId === filter.merchantId ||
                (Array.isArray(r.products) && r.products.some(p => p.merchantId === filter.merchantId))
              )) return true;
              if (filter.creatorId && (
                r.creatorId === filter.creatorId || r.publisherId === filter.creatorId
              )) return true;
              if (filter.storeSlug && r.storeSlug?.toLowerCase() === filter.storeSlug.toLowerCase()) return true;
              if (filter.creatorHandle && r.creatorHandle?.toLowerCase() === filter.creatorHandle.toLowerCase()) return true;
              return false;
            });
          }
          return filtered;
        }
      }
    } catch (err) {
      console.warn('Hostinger reels query failed, falling back:', err.message);
    }

    let dbReels = [];
    try {
      let query = supabase
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

      // Apply server-side filter when available
      if (filter?.merchantId) {
        query = query.eq('merchant_id', filter.merchantId);
      } else if (filter?.creatorId) {
        query = query.eq('creator_id', filter.creatorId);
      }

      const { data, error } = await query;
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

    // Apply tenant filter to local/DB fallback results
    if (filter && typeof filter === 'object') {
      combined = combined.filter(r => {
        if (filter.merchantId && (
          r.merchantId === filter.merchantId ||
          r.creatorId === filter.merchantId ||
          (Array.isArray(r.products) && r.products.some(p => p.merchantId === filter.merchantId))
        )) return true;
        if (filter.creatorId && (
          r.creatorId === filter.creatorId || r.publisherId === filter.creatorId
        )) return true;
        if (filter.storeSlug && r.storeSlug?.toLowerCase() === filter.storeSlug.toLowerCase()) return true;
        if (filter.creatorHandle && r.creatorHandle?.toLowerCase() === filter.creatorHandle.toLowerCase()) return true;
        return false;
      });
    }

    return combined.filter(r => !hiddenIds.includes(r.id));
  },

  normalizeDbReel(db) {
    const products = (db.reel_products || []).map(rp => ({
      id: rp.products?.id,
      title: rp.products?.title,
      price: rp.products?.sale_price || rp.products?.base_price,
      originalPrice: rp.products?.base_price,
      image: rp.products?.images?.[0] || '/images/products/the_sharp_v_yellow_1.webp',
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
      likes: Number(db.likes_count) || 4820,
      comments: Number(db.comments_count) || 0,
      saves: Number(db.saves_count) || 1140,
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
    const isMerchant = Boolean(reelData.isMerchantReel) || reelData.publisherRole === 'merchant';
    const creatorHandle = reelData.creatorHandle || (isMerchant ? '@store_official' : '@egyptian_creator');
    const creatorName = reelData.creatorName || (isMerchant ? 'متجر معتمد' : 'صانع محتوى مصري');
    const publisherRole = reelData.publisherRole || (isMerchant ? 'merchant' : 'creator');

    const formatted = {
      id: reelData.id || `reel-${Date.now()}`,
      creatorId: reelData.creatorId || reelData.publisherId || reelData.userId || null,
      creatorHandle: creatorHandle,
      creatorName: creatorName,
      avatar: reelData.avatar || '/images/reels/reel_1.jpg',
      publisherId: reelData.publisherId || reelData.creatorId || reelData.userId || null,
      publisherRole: publisherRole,
      merchantId: reelData.merchantId || null,
      storeSlug: reelData.storeSlug || null,
      isMerchantReel: isMerchant,
      videoBg: reelData.videoBg || reelData.video || '/images/reels/the_sharp_v_yellow_reel.mp4',
      caption: reelData.caption || '',
      music: reelData.music || 'Egyptian Aesthetic Vibes',
      likes: Number(reelData.likes) || 120,
      comments: Number(reelData.comments) || 0,
      saves: Number(reelData.saves) || 45,
      products: reelData.products || [],
      categoryId: reelData.categoryId || (reelData.id?.includes('sheglam') ? 'beauty' : 'fashion'),
      qualityScore: reelData.qualityScore || 0.8,
      trendScore: reelData.trendScore || 0.6,
      createdAt: reelData.createdAt || new Date().toISOString()
    };

    // 1. Persist to Hostinger / Shared Backend API
    try {
      await fetch(apiConfig.getApiUrl('/api/reels'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formatted)
      });
    } catch (e) {
      console.warn('Hostinger API save skipped:', e);
    }

    // 2. Try Supabase
    try {
      await supabase.from('reels').insert({
        id: formatted.id.includes('-') && formatted.id.length === 36 ? formatted.id : undefined,
        video_url: formatted.videoBg,
        caption: formatted.caption,
        status: 'active',
        category_id: formatted.categoryId
      });
    } catch (e) {}

    // 3. Sync to local storage
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
      await fetch(apiConfig.getApiUrl(`/api/reels/${reelId}`), { method: 'DELETE' });
    } catch (e) {}

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
