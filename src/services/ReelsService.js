import { supabase } from '../lib/supabase';

// Fallback logic uses localStorage for now to avoid IndexedDB complexity while migrating
export const ReelsService = {
  async getReels() {
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

    // Return empty so DiscoverReels will populate and save fresh DEFAULT_REELS
    return [];
  },

  async saveReel(reelData) {
    const formattedReel = {
      id: reelData.id || `reel-${Date.now()}`,
      creatorHandle: reelData.creatorHandle || '@talieska_official',
      creatorName: reelData.creatorName || 'Talieska Studio • تاليسكا ستوديو',
      avatar: reelData.avatar || '/images/products/linen_abaya.jpg',
      videoBg: reelData.videoBg || reelData.video || '/images/reels/linen_abaya.mp4',
      caption: reelData.caption || 'إطلالة حصرية جديدة من كولكشن 2026 🇪🇬✨ #موضة_مصرية #ريلز',
      music: reelData.music || 'Summer Aesthetic Vibes • Instrumental',
      likes: reelData.likes || 120,
      comments: reelData.comments || 8,
      saves: reelData.saves || 45,
      products: reelData.products || []
    };

    // 1. Try to persist to Supabase
    try {
      await supabase.from('reels').insert({
        id: formattedReel.id.includes('-') && formattedReel.id.length === 36 ? formattedReel.id : undefined,
        video_url: formattedReel.videoBg,
        caption: formattedReel.caption,
        status: 'active'
      });
    } catch (err) {
      console.warn('DB Save Reel skipped (using synchronized local storage):', err.message);
    }

    // 2. Always prepend to local storage at the very top (index 0)
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
    // 1. Delete from Supabase
    try {
      await supabase.from('reels').delete().eq('id', reelId);
    } catch (err) {
      console.warn('DB delete reel skipped/failed:', err.message);
    }

    // 2. Remove from local storage
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
    // 1. Update in Supabase
    try {
      await supabase.from('reels').update(updates).eq('id', reelId);
    } catch (err) {
      console.warn('DB update reel skipped/failed:', err.message);
    }

    // 2. Update in local storage
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

  async reportReel(reelId, reason, details = '') {
    const reportItem = {
      id: `report-${Date.now()}`,
      reelId,
      reason,
      details,
      createdAt: new Date().toISOString()
    };

    // 1. Persist to Supabase reel_reports table if available
    try {
      await supabase.from('reel_reports').insert({
        reel_id: reelId,
        reason,
        details
      });
    } catch (err) {
      console.warn('DB report insert skipped/failed:', err.message);
    }

    // 2. Persist to local storage
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
