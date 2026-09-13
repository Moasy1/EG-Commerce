import { supabase } from '../lib/supabase';

// Fallback logic uses localStorage for now to avoid IndexedDB complexity while migrating
export const ReelsService = {
  async getReels() {
    try {
      const { data, error } = await supabase.from('reels').select('*, creators(*), merchants(*)');
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('DB Reels fetch failed, using local mock data:', err.message);
      
      const local = localStorage.getItem('eg_reels_mock');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          // If local data exists but it's the old format without creatorHandle/products, ignore it to force re-seed
          if (parsed && parsed.length > 0 && !parsed[0].creatorHandle) {
             return [];
          }
          return parsed;
        } catch(e) {
          return [];
        }
      }
      
      // Return empty so DiscoverReels can seed its rich DEFAULT_REELS
      return [];
    }
  },

  async saveReel(reelData) {
    try {
      const { data, error } = await supabase.from('reels').insert(reelData).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.warn('DB Save Reel failed, saving to local storage:', err.message);
      let local = [];
      const localStr = localStorage.getItem('eg_reels_mock');
      if (localStr) {
        try {
          local = JSON.parse(localStr);
          // Clean up old format if present before adding
          if (local.length > 0 && !local[0].creatorHandle) {
             local = [];
          }
        } catch(e) {}
      }
      
      // Check if already exists
      if (!local.find(r => r.id === reelData.id)) {
        local.push(reelData);
        localStorage.setItem('eg_reels_mock', JSON.stringify(local));
      }
      
      return reelData;
    }
  }
};
