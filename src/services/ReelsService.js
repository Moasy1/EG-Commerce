import { supabase } from '../lib/supabase.js';
import { apiConfig } from '../config/apiConfig.js';
import sharedReelsData from '../../data/shared_reels.json';


const DEFAULT_SEED_COMMENTS = [];

export const ReelsService = {
  async getReels(filter = null) {
    let queryUrl = '/api/reels';
    if (filter && typeof filter === 'object') {
      const params = new URLSearchParams();
      if (filter.merchantId) params.append('merchantId', filter.merchantId);
      if (filter.creatorId) params.append('creatorId', filter.creatorId);
      if (filter.publisherId) params.append('publisherId', filter.publisherId);
      if (filter.storeSlug) params.append('storeSlug', filter.storeSlug);
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
          if (!filter) {
            try {
              localStorage.setItem('eg_reels_mock_v3', JSON.stringify(normalized));
            } catch (e) {}
          }
          return normalized;
        }
      }
    } catch (err) {
      console.warn('Hostinger / Shared API unreachable, falling back:', err.message);
    }

    let dbReels = [];
    try {
      const { data, error } = await supabase.from('reels').select('*, creators(*), merchants(*)');
      if (!error && data && data.length > 0) {
        dbReels = data;
      }
    } catch (err) {
      console.warn('DB Reels fetch failed, checking local store:', err.message);
    }

    // Retrieve custom and persisted reels from localStorage
    let localReels = [];
    const localStr = localStorage.getItem('eg_reels_mock_v3');
    if (localStr) {
      try {
        const parsed = JSON.parse(localStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localReels = parsed;
        }
      } catch (e) {
        console.warn('Failed parsing local reels:', e);
      }
    }

    let allMerged = [];
    if (localReels.length > 0) {
      const localIds = new Set(localReels.map(r => r.id));
      allMerged = [...localReels, ...dbReels.filter(r => !localIds.has(r.id))];
    } else if (dbReels.length > 0) {
      allMerged = dbReels;
    } else {
      allMerged = sharedReelsData || [];
    }

    if (filter && typeof filter === 'object') {
      return allMerged.filter(r => {
        if (filter.merchantId && (
          r.merchantId === filter.merchantId || 
          r.creatorId === filter.merchantId ||
          (Array.isArray(r.products) && r.products.some(p => p.merchantId === filter.merchantId))
        )) return true;
        if (filter.storeSlug && (
          (r.storeSlug && r.storeSlug.toLowerCase() === filter.storeSlug.toLowerCase()) ||
          (r.creatorHandle && r.creatorHandle.toLowerCase().includes(filter.storeSlug.toLowerCase()))
        )) return true;
        if (filter.creatorId && (r.creatorId === filter.creatorId || r.publisherId === filter.creatorId)) return true;
        return false;
      });
    }

    return allMerged;
  },

  async getMerchantReels(merchantId, storeSlug = null) {
    return this.getReels({ merchantId, storeSlug });
  },

  async saveReel(reelData) {
    const formattedProducts = Array.isArray(reelData.products) && reelData.products.length > 0
      ? reelData.products
      : (reelData.product ? [reelData.product] : []);

    const isMerchant = Boolean(reelData.isMerchantReel) || reelData.publisherRole === 'merchant';
    const creatorHandle = reelData.creatorHandle || (isMerchant ? '@store_official' : '@egyptian_creator');
    const creatorName = reelData.creatorName || (isMerchant ? 'متجر معتمد' : 'صانع محتوى مصري');
    const publisherRole = reelData.publisherRole || (isMerchant ? 'merchant' : 'creator');

    const formattedReel = {
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
      videoBg: reelData.videoBg || reelData.video || reelData.image || (formattedProducts[0]?.image) || '',
      caption: reelData.caption || 'إطلالة حصرية جديدة متوفرة الآن في egyptian-commerce.com 🇪🇬✨ #موضة_مصرية #ريلز',
      music: reelData.music || 'Egyptian Aesthetic Vibes • Instrumental',
      likes: reelData.likes !== undefined ? reelData.likes : 15,
      comments: reelData.comments !== undefined ? reelData.comments : 0,
      saves: reelData.saves !== undefined ? reelData.saves : 5,
      products: formattedProducts,
      product: formattedProducts[0] || null,
      categoryId: reelData.categoryId || 'fashion',
      qualityScore: reelData.qualityScore || 0.95,
      trendScore: reelData.trendScore || 0.85,
      createdAt: reelData.createdAt || new Date().toISOString()
    };

    // 1. Persist to Hostinger / Shared Backend API
    try {
      const res = await fetch(apiConfig.getApiUrl('/api/reels'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedReel)
      });
      if (res.ok) {
        console.log('[ReelsService] Reel synced across all devices via Hostinger API:', formattedReel.id);
      }
    } catch (err) {
      console.warn('Hostinger API save skipped/failed:', err.message);
    }

    // 2. Try to persist to Supabase
    try {
      const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
      const reelPayload = {
        video_url: formattedReel.videoBg,
        thumbnail_url: formattedReel.avatar || formattedReel.thumbnail,
        caption: formattedReel.caption,
        status: 'active'
      };
      if (isUuid(formattedReel.id)) reelPayload.id = formattedReel.id;
      if (isUuid(formattedReel.merchantId)) reelPayload.merchant_id = formattedReel.merchantId;
      if (isUuid(formattedReel.creatorId)) reelPayload.creator_id = formattedReel.creatorId;

      const { data: dbReel, error: reelErr } = await supabase
        .from('reels')
        .insert(reelPayload)
        .select()
        .single();

      if (!reelErr && dbReel && formattedProducts.length > 0) {
        for (const p of formattedProducts) {
          if (isUuid(p.id)) {
            await supabase.from('reel_products').upsert({
              reel_id: dbReel.id,
              product_id: p.id
            }, { onConflict: 'reel_id,product_id' });
          }
        }
      }
    } catch (err) {
      console.warn('DB Save Reel skipped (using synchronized storage):', err.message);
    }

    // 3. Always prepend to local storage at the very top
    try {
      let local = [];
      const localStr = localStorage.getItem('eg_reels_mock_v3');
      if (localStr) {
        try { local = JSON.parse(localStr); } catch (e) {}
      }
      local = [formattedReel, ...local.filter(r => r.id !== formattedReel.id)];
      localStorage.setItem('eg_reels_mock_v3', JSON.stringify(local));
    } catch (err) {
      console.warn('Local storage reel save failed:', err);
    }

    return formattedReel;
  },

  async deleteReel(reelId) {
    // 1. Delete from Hostinger / Shared Backend API
    try {
      await fetch(apiConfig.getApiUrl(`/api/reels/${reelId}`), { method: 'DELETE' });
    } catch (err) {
      console.warn('Hostinger delete failed:', err.message);
    }

    // 2. Delete from Supabase
    try {
      await supabase.from('reels').delete().eq('id', reelId);
    } catch (err) {
      console.warn('DB delete reel skipped/failed:', err.message);
    }

    // 3. Remove from local storage
    try {
      const localStr = localStorage.getItem('eg_reels_mock_v3');
      if (localStr) {
        const list = JSON.parse(localStr);
        const filtered = list.filter(r => r.id !== reelId);
        localStorage.setItem('eg_reels_mock_v3', JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('Local storage delete reel failed:', e);
    }
    return true;
  },

  async updateReel(reelId, updates) {
    try {
      await supabase.from('reels').update(updates).eq('id', reelId);
    } catch (err) {
      console.warn('DB update reel skipped/failed:', err.message);
    }

    try {
      const localStr = localStorage.getItem('eg_reels_mock_v3');
      if (localStr) {
        const list = JSON.parse(localStr);
        const updated = list.map(r => r.id === reelId ? { ...r, ...updates } : r);
        localStorage.setItem('eg_reels_mock_v3', JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Local storage update reel failed:', e);
    }
    return true;
  },

  // ----------------------------------------------------
  // Interactive Comments Management
  // ----------------------------------------------------
  getComments(reelId) {
    try {
      const key = `eg_reel_comments_${reelId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter(c => !c.id?.startsWith('c-seed-') && !c.id?.startsWith('cc000000-'));
          if (filtered.length !== parsed.length) {
            localStorage.setItem(key, JSON.stringify(filtered));
          }
          return filtered;
        }
      }
    } catch (e) {
      console.warn('Failed reading reel comments:', e);
    }
    return [];
  },

  addComment(reelId, commentPayload) {
    const key = `eg_reel_comments_${reelId}`;
    const current = this.getComments(reelId);
    const newComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      reelId,
      userId: commentPayload.userId || null,
      userName: commentPayload.userName || 'مستخدم المنصة',
      userAvatar: commentPayload.userAvatar || '/images/reels/reel_1.jpg',
      userRole: commentPayload.userRole || 'buyer',
      text: commentPayload.text.trim(),
      timeAgo: 'الآن',
      likes: 0,
      createdAt: new Date().toISOString()
    };

    const updated = [newComment, ...current];
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save comment to localStorage:', e);
    }

    // Sync to Hostinger API
    try {
      fetch(apiConfig.getApiUrl('/api/comments'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reelId, comment: newComment })
      }).catch(() => {});
    } catch (e) {}

    // Increment comment count in reel
    try {
      const localStr = localStorage.getItem('eg_reels_mock_v3');
      if (localStr) {
        const list = JSON.parse(localStr);
        const newReels = list.map(r => {
          if (r.id === reelId) {
            return { ...r, comments: (Number(r.comments) || 0) + 1 };
          }
          return r;
        });
        localStorage.setItem('eg_reels_mock_v3', JSON.stringify(newReels));
      }
    } catch (e) {}

    return newComment;
  },

  deleteComment(reelId, commentId) {
    const key = `eg_reel_comments_${reelId}`;
    const current = this.getComments(reelId);
    const updated = current.filter(c => c.id !== commentId);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  likeComment(reelId, commentId) {
    const key = `eg_reel_comments_${reelId}`;
    const current = this.getComments(reelId);
    const updated = current.map(c => {
      if (c.id === commentId) {
        return { ...c, likes: (c.likes || 0) + 1 };
      }
      return c;
    });
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  async reportReel(reelId, reason, details = '') {
    const reportItem = {
      id: `report-${Date.now()}`,
      reelId,
      reason,
      details,
      createdAt: new Date().toISOString()
    };

    try {
      await supabase.from('reel_reports').insert({
        reel_id: reelId,
        reason,
        details
      });
    } catch (err) {
      console.warn('DB report insert skipped/failed:', err.message);
    }

    try {
      const existingStr = localStorage.getItem('eg_reel_reports');
      const list = existingStr ? JSON.parse(existingStr) : [];
      list.push(reportItem);
      localStorage.setItem('eg_reel_reports', JSON.stringify(list));
    } catch (e) {
      console.warn('Failed saving reel report locally:', e);
    }
    return reportItem;
  },

  async hideReel(reelId) {
    try {
      const hiddenStr = localStorage.getItem('eg_hidden_reels');
      const list = hiddenStr ? JSON.parse(hiddenStr) : [];
      if (!list.includes(reelId)) {
        list.push(reelId);
        localStorage.setItem('eg_hidden_reels', JSON.stringify(list));
      }
    } catch (e) {}
    return true;
  },

  async toggleSaveReel(reelId) {
    let isSaved = false;
    try {
      const savedStr = localStorage.getItem('eg_saved_reels');
      let list = savedStr ? JSON.parse(savedStr) : [];
      if (list.includes(reelId)) {
        list = list.filter(id => id !== reelId);
        isSaved = false;
      } else {
        list.push(reelId);
        isSaved = true;
      }
      localStorage.setItem('eg_saved_reels', JSON.stringify(list));
    } catch (e) {}
    return isSaved;
  }
};
