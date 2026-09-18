import { supabase } from '../lib/supabase.js';
import { apiConfig } from '../config/apiConfig.js';


const DEFAULT_SEED_COMMENTS = [
  {
    id: 'c-seed-1',
    userId: 'b0000000-0000-0000-0000-000000000001',
    userName: 'مريم الشافعي',
    userAvatar: '/images/reels/reel_1.jpg',
    userRole: 'buyer',
    text: 'الكتان باين عليه تحفة وتفصيله يجنن! هل متاح شحن سريع لإسكندرية؟ ❤️',
    timeAgo: 'منذ ساعتين',
    likes: 14
  },
  {
    id: 'c-seed-2',
    userId: 'u-ahmed',
    userName: 'أحمد سامي',
    userAvatar: '/images/reels/reel_2.jpg',
    userRole: 'buyer',
    text: 'التطريز متقن جداً.. طلبت الأسبوع الماضي واستلمت في 48 ساعة عبر بوسطة 🚀',
    timeAgo: 'منذ 5 ساعات',
    likes: 9
  },
  {
    id: 'c-seed-3',
    userId: 'c0000000-0000-0000-0000-000000000001',
    userName: 'ياسمين السيد',
    userAvatar: '/images/reels/reel_2.jpg',
    userRole: 'creator',
    text: 'تنسيق رهيب مع الإكسسوارات النحاسية! الخامة باردة ومريحة جداً في الصيف ✨',
    timeAgo: 'منذ يوم',
    likes: 31
  }
];

export const ReelsService = {
  async getReels() {
    // 1. Fetch from Hostinger / Shared Backend API
    try {
      const res = await fetch(apiConfig.getApiUrl('/api/reels'), { cache: 'no-store' });
      if (res.ok) {
        const shared = await res.json();
        if (Array.isArray(shared) && shared.length > 0) {
          const normalized = shared.map(r => ({
            ...r,
            videoBg: apiConfig.getMediaUrl(r.videoBg || r.video_url),
            avatar: apiConfig.getMediaUrl(r.avatar || r.thumbnail_url)
          }));
          try {
            localStorage.setItem('eg_reels_mock_v3', JSON.stringify(normalized));
          } catch (e) {}
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

    // If we have custom local reels or DB reels, merge and return
    if (localReels.length > 0) {
      const localIds = new Set(localReels.map(r => r.id));
      return [...localReels, ...dbReels.filter(r => !localIds.has(r.id))];
    }

    if (dbReels.length > 0) {
      return dbReels;
    }

    return [];
  },

  async saveReel(reelData) {
    const formattedProducts = Array.isArray(reelData.products) && reelData.products.length > 0
      ? reelData.products
      : (reelData.product ? [reelData.product] : []);

    const formattedReel = {
      id: reelData.id || `reel-${Date.now()}`,
      creatorId: reelData.creatorId || reelData.userId || null,
      creatorHandle: reelData.creatorHandle || '@egyptian_creator',
      creatorName: reelData.creatorName || 'صانع محتوى مصري',
      avatar: reelData.avatar || '/images/reels/reel_1.jpg',
      videoBg: reelData.videoBg || reelData.video || '/images/reels/linen_abaya.mp4',
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
      await supabase.from('reels').insert({
        id: formattedReel.id.includes('-') && formattedReel.id.length === 36 ? formattedReel.id : undefined,
        video_url: formattedReel.videoBg,
        caption: formattedReel.caption,
        status: 'active'
      });
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
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed reading reel comments:', e);
    }
    // Return default seed comments for this reel
    return DEFAULT_SEED_COMMENTS;
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
