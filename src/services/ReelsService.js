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
      if (local) return JSON.parse(local);
      
      // Seed some initial Reels if none exist
      const mockReels = [
        {
          id: 'mock-1',
          video_url: '/images/reels/fashion_kaizen_dress.mp4',
          thumbnail_url: '/images/reels/fashion_kaizen_dress_thumb.jpg',
          caption: 'فستان بوهيمي أنيق للمحجبات #fashion #محجبات',
          likes_count: 1450,
          views_count: 5600,
          shares_count: 230,
          comments: 45
        },
        {
          id: 'mock-2',
          video_url: '/images/reels/fashion_oversized_shirt.mp4',
          thumbnail_url: '/images/reels/fashion_oversized_shirt_thumb.jpg',
          caption: 'أوفرسايز شيرت كتان مريح جداً للصيف 🔥',
          likes_count: 890,
          views_count: 3200,
          shares_count: 120,
          comments: 22
        }
      ];
      return mockReels;
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
      if (localStr) local = JSON.parse(localStr);
      
      const newReel = { ...reelData, id: `mock-${Date.now()}` };
      local.unshift(newReel);
      localStorage.setItem('eg_reels_mock', JSON.stringify(local));
      return newReel;
    }
  }
};
