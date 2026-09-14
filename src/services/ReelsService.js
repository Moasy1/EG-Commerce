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
  }
};
