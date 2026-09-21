import { supabase } from '../../lib/supabase.js';
import { engagementService } from './engagementService.js';

export const profileService = {
  async getProfile(userId) {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          username: data.username || data.email?.split('@')[0],
          displayName: data.display_name || data.name || 'مستخدم المنصة',
          avatarUrl: data.avatar_url || '/images/reels/reel_1.jpg',
          coverUrl: data.cover_url || '/images/products/the_sharp_v_yellow_1.webp',
          bio: data.bio || '',
          role: data.role || 'buyer',
          isCreator: Boolean(data.is_creator || data.role === 'creator'),
          isMerchant: Boolean(data.is_merchant || data.role === 'merchant'),
          isVerified: Boolean(data.is_verified),
          rewardPoints: data.reward_points_balance || 0
        };
      }
    } catch (e) {}

    return null;
  },

  async getProfileReels(userId, allReels = []) {
    // Return reels created by or associated with this user
    return allReels.filter(r => 
      r.creatorId === userId || 
      r.creator_id === userId || 
      r.userId === userId
    );
  },

  async getProfileProducts(userId, allProducts = []) {
    // For merchant / creator profiles
    return allProducts.filter(p => 
      p.merchant_id === userId || 
      p.merchantId === userId ||
      p.creator_id === userId
    );
  },

  async getProfileSavedItems(userId = null, allReels = [], allProducts = []) {
    const savedReelIds = engagementService.getLocalSavedReels();
    const savedProductIds = engagementService.getLocalSavedProducts();

    const savedReels = allReels.filter(r => savedReelIds.includes(r.id));
    const savedProducts = allProducts.filter(p => savedProductIds.includes(p.id));

    return {
      savedReels,
      savedProducts
    };
  },

  async updateProfile(userId, updates) {
    try {
      const payload = {
        name: updates.name || updates.displayName,
        display_name: updates.displayName || updates.name,
        username: updates.username ? updates.username.replace(/^@/, '').trim() : undefined,
        bio: updates.bio,
        phone: updates.phone,
        location: updates.location,
        website: updates.website,
        avatar_url: updates.avatarUrl || updates.avatar_url,
        cover_url: updates.coverUrl || updates.cover_url,
        updated_at: new Date().toISOString()
      };

      // Clean undefined values
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId)
        .select()
        .single();

      if (!error && data) return data;
    } catch (e) {
      console.warn('profileService.updateProfile warning:', e);
    }

    return updates;
  }
};
