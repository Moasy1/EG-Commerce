import { supabase } from '../../lib/supabase.js';
import { eventTracker } from '../analytics/eventTracker.js';

const LOCAL_FOLLOWS_KEY = 'eg_user_follows';

export const followService = {
  getLocalFollows() {
    try {
      const stored = localStorage.getItem(LOCAL_FOLLOWS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  setLocalFollows(list) {
    try {
      localStorage.setItem(LOCAL_FOLLOWS_KEY, JSON.stringify(list));
    } catch (e) {}
  },

  async isFollowing(targetUserId, currentUserId = null) {
    if (!targetUserId) return false;

    // Check local storage first for fast response
    const local = this.getLocalFollows();
    if (local.includes(targetUserId)) return true;

    if (currentUserId) {
      try {
        const { data, error } = await supabase
          .from('follows')
          .select('follower_id')
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId)
          .maybeSingle();

        if (!error && data) {
          if (!local.includes(targetUserId)) {
            this.setLocalFollows([...local, targetUserId]);
          }
          return true;
        }
      } catch (err) {}
    }

    return false;
  },

  async toggleFollow(targetUserId, currentUserId = null, creatorHandle = null) {
    const isCurrentlyFollowing = await this.isFollowing(targetUserId, currentUserId);
    const local = this.getLocalFollows();

    if (isCurrentlyFollowing) {
      // Unfollow
      const updated = local.filter(id => id !== targetUserId);
      this.setLocalFollows(updated);

      if (currentUserId) {
        try {
          await supabase
            .from('follows')
            .delete()
            .eq('follower_id', currentUserId)
            .eq('following_id', targetUserId);
        } catch (e) {}
      }

      await eventTracker.trackEvent('unfollow', {
        userId: currentUserId,
        entityType: 'user',
        entityId: targetUserId,
        creatorId: targetUserId,
        metadata: { handle: creatorHandle }
      });

      return false;
    } else {
      // Follow
      if (!local.includes(targetUserId)) {
        this.setLocalFollows([...local, targetUserId]);
      }

      if (currentUserId) {
        try {
          await supabase
            .from('follows')
            .insert({
              follower_id: currentUserId,
              following_id: targetUserId
            });
        } catch (e) {}
      }

      await eventTracker.trackEvent('follow', {
        userId: currentUserId,
        entityType: 'user',
        entityId: targetUserId,
        creatorId: targetUserId,
        metadata: { handle: creatorHandle }
      });

      return true;
    }
  },

  async getFollowingIds(currentUserId = null) {
    const local = this.getLocalFollows();
    if (currentUserId) {
      try {
        const { data, error } = await supabase
          .from('follows')
          .select('following_id')
          .eq('follower_id', currentUserId);

        if (!error && data) {
          const ids = data.map(d => d.following_id);
          const combined = Array.from(new Set([...local, ...ids]));
          this.setLocalFollows(combined);
          return combined;
        }
      } catch (e) {}
    }
    return local;
  }
};
