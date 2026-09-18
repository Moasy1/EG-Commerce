import { supabase } from '../../lib/supabase.js';
import { toCanonicalReelId } from './engagementService.js';

const SEED_COMMENTS = [
  {
    id: 'cc000000-0000-0000-0000-000000000001',
    userId: 'b0000000-0000-0000-0000-000000000001',
    userName: 'مريم الشافعي',
    userAvatar: '/images/reels/reel_1.jpg',
    userRole: 'buyer',
    text: 'الكتان باين عليه تحفة وتفصيله يجنن! هل متاح شحن سريع لإسكندرية؟ ❤️',
    timeAgo: 'منذ ساعتين',
    likes: 14,
    parentId: null,
    replies: []
  },
  {
    id: 'cc000000-0000-0000-0000-000000000002',
    userId: 'b0000000-0000-0000-0000-000000000002',
    userName: 'نورهان كريم',
    userAvatar: '/images/reels/reel_2.jpg',
    userRole: 'buyer',
    text: 'التطريز متقن جداً.. طلبت الأسبوع الماضي واستلمت في 48 ساعة عبر بوسطة 🚀',
    timeAgo: 'منذ 5 ساعات',
    likes: 9,
    parentId: null,
    replies: []
  },
  {
    id: 'cc000000-0000-0000-0000-000000000003',
    userId: 'c0000000-0000-0000-0000-000000000001',
    userName: 'ياسمين السيد',
    userAvatar: '/images/reels/reel_2.jpg',
    userRole: 'creator',
    text: 'تنسيق رهيب مع الإكسسوارات النحاسية! الخامة باردة ومريحة جداً في الصيف ✨',
    timeAgo: 'منذ يوم',
    likes: 31,
    parentId: null,
    replies: []
  }
];

export const commentService = {
  async getComments(reelId) {
    const canonicalId = toCanonicalReelId(reelId);
    let dbComments = [];

    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(name, avatar_url, role)')
        .or(`reel_id.eq.${canonicalId},reel_id.eq.${reelId}`)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        dbComments = data.map(c => ({
          id: c.id,
          userId: c.user_id,
          userName: c.profiles?.name || 'مستخدم المنصة',
          userAvatar: c.profiles?.avatar_url || '/images/reels/reel_1.jpg',
          userRole: c.profiles?.role || 'buyer',
          text: c.body,
          parentId: c.parent_id,
          timeAgo: 'مؤخراً',
          likes: c.likes_count || 0,
          createdAt: c.created_at
        }));
      }
    } catch (e) {
      // Table may not exist or offline
    }

    // Check local storage for quick sync
    const key = `eg_reel_comments_${canonicalId}`;
    let local = [];
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        local = JSON.parse(stored);
      }
    } catch (e) {}

    if (local.length === 0 && dbComments.length === 0) {
      local = SEED_COMMENTS;
      try {
        localStorage.setItem(key, JSON.stringify(local));
      } catch (e) {}
    }

    // Merge DB records and local comments
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
      const list = stored ? JSON.parse(stored) : [...SEED_COMMENTS];
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
