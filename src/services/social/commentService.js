import { supabase } from '../../lib/supabase.js';
import { toCanonicalReelId } from './engagementService.js';

export const commentService = {
  async getComments(reelId) {
    const canonicalId = toCanonicalReelId(reelId);
    let dbComments = [];

    // 1. Fetch live comments for this specific reel from Supabase
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .or(`reel_id.eq.${canonicalId},reel_id.eq.${reelId}`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        dbComments = data
          .filter(c => !c.id?.startsWith('cc000000-') && !c.id?.startsWith('c-seed-'))
          .map(c => ({
            id: c.id,
            userId: c.user_id,
            userName: c.user_name || 'متسوق مصري',
            userAvatar: c.user_avatar || '/images/reels/reel_1.jpg',
            userRole: c.user_role || 'buyer',
            text: c.body || c.content || c.text || '',
            parentId: c.parent_id,
            timeAgo: 'مؤخراً',
            likes: c.likes_count || 0,
            createdAt: c.created_at
          }));
      }
    } catch (e) {
      // Offline or database table not yet deployed
    }

    // 2. Check local storage for quick sync
    const key = `eg_reel_comments_${canonicalId}`;
    let local = [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Filter out any mock / seed comments from localStorage
          local = parsed.filter(c => !c.id?.startsWith('cc000000-') && !c.id?.startsWith('c-seed-'));
          if (local.length !== parsed.length) {
            localStorage.setItem(key, JSON.stringify(local));
          }
        }
      }
    } catch (e) {}


    // 4. Merge DB records and local comments
    if (dbComments.length > 0) {
      const localIds = new Set(local.map(c => c.id));
      const combined = [...local, ...dbComments.filter(c => !localIds.has(c.id))];
      return this.nestComments(combined);
    }

    return this.nestComments(local);
  },

  nestComments(flatList) {
    const map = {};
    const roots = [];

    flatList.forEach(item => {
      map[item.id] = { ...item, replies: item.replies || [] };
    });

    flatList.forEach(item => {
      if (item.parentId && map[item.parentId]) {
        map[item.parentId].replies.push(map[item.id]);
      } else {
        roots.push(map[item.id]);
      }
    });

    return roots;
  },

  async addComment(reelId, { text, userId = null, userName = 'مستخدم', userAvatar = '/images/reels/reel_1.jpg', userRole = 'buyer', parentId = null }) {
    const canonicalId = toCanonicalReelId(reelId);
    const key = `eg_reel_comments_${canonicalId}`;

    const newCommentId = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `cc${Date.now().toString(16).padStart(12, '0')}-${Math.random().toString(16).substr(2, 4)}`;

    const commentRecord = {
      id: newCommentId,
      reelId: canonicalId,
      userId,
      userName,
      userAvatar,
      userRole,
      text: text.trim(),
      parentId: parentId || null,
      timeAgo: 'الآن',
      likes: 0,
      createdAt: new Date().toISOString()
    };

    // 1. Local cache update immediately
    try {
      const stored = localStorage.getItem(key);
      const list = stored 
        ? JSON.parse(stored).filter(c => !c.id?.startsWith('cc000000-') && !c.id?.startsWith('c-seed-')) 
        : [];
      list.unshift(commentRecord);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {}

    // 2. Persist to Supabase comments table
    const effectiveUserId = userId || 'b0000000-0000-0000-0000-000000000001';
    try {
      await supabase.from('comments').insert({
        id: newCommentId.length === 36 ? newCommentId : undefined,
        user_id: effectiveUserId,
        reel_id: canonicalId,
        parent_id: parentId || null,
        body: text.trim(),
        content: text.trim(),
        user_name: userName,
        user_avatar: userAvatar,
        user_role: userRole,
        likes_count: 0,
        status: 'active'
      });
    } catch (e) {
      console.warn('DB Comment insert notice:', e.message);
    }

    return commentRecord;
  },

  async deleteComment(reelId, commentId) {
    const canonicalId = toCanonicalReelId(reelId);
    const key = `eg_reel_comments_${canonicalId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const list = JSON.parse(stored);
        const filtered = list.filter(c => c.id !== commentId && c.parentId !== commentId);
        localStorage.setItem(key, JSON.stringify(filtered));
      }
      await supabase.from('comments').delete().eq('id', commentId);
    } catch (e) {}
    return true;
  },

  async likeComment(reelId, commentId, userId = null) {
    const canonicalId = toCanonicalReelId(reelId);
    const key = `eg_reel_comments_${canonicalId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const list = JSON.parse(stored);
        const updated = list.map(c => c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c);
        localStorage.setItem(key, JSON.stringify(updated));
      }
      if (userId) {
        await supabase.from('comment_likes').insert({ user_id: userId, comment_id: commentId });
      }
    } catch (e) {}
    return true;
  }
};
