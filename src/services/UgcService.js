import { supabase } from '../lib/supabase';

export const UgcService = {
  async getCampaigns() {
    try {
      const { data, error } = await supabase.from('ugc_campaigns').select('*, merchants(*), products(*)');
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('DB UGC fetch failed, using local mock data:', err.message);
      return [
        {
          id: 'camp-1',
          title: 'Kaizen Linen Summer Launch',
          merchant_name: 'Talieska Studio',
          reward_type: 'free_product',
          slots_available: 5,
          status: 'active'
        }
      ];
    }
  },

  async applyForCampaign(campaignId, creatorId) {
    try {
      const { data, error } = await supabase.from('ugc_applications').insert({
        campaign_id: campaignId,
        creator_id: creatorId,
        status: 'applied'
      }).select();
      if (error) throw error;
      return data[0];
    } catch (err) {
      console.warn('DB UGC apply failed:', err.message);
      return { id: `app-${Date.now()}`, status: 'applied' };
    }
  }
};
