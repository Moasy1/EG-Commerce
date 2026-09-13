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
      
      // Clean up legacy caches
      localStorage.removeItem('eg_reels_mock');
      localStorage.removeItem('eg_reels_mock_v2');

      const local = localStorage.getItem('eg_reels_mock_v3');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          // If local data exists and has products
          if (parsed && parsed.length > 0 && parsed[0].products && parsed[0].products.length > 1) {
             return parsed;
          }
        } catch(e) {}
      }
      
      // Return empty so DiscoverReels will populate and save fresh DEFAULT_REELS
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
      const localStr = localStorage.getItem('eg_reels_mock_v3');
      if (localStr) {
        try {
          local = JSON.parse(localStr);
        } catch(e) {}
      }
      
      // Check if already exists
      if (!local.find(r => r.id === reelData.id)) {
        local.push(reelData);
        localStorage.setItem('eg_reels_mock_v3', JSON.stringify(local));
      }
      
      return reelData;
    }
  }
};
