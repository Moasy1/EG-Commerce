import { supabase } from '../../lib/supabase.js';
import { toCanonicalReelId } from './engagementService.js';

const SEED_COMMENTS_BY_REEL = {
  // 1. Citrine Blazer
  'ee000000-0000-0000-0000-000000000001': [
    {
      id: 'cc000000-0000-0000-0000-000000000001',
      userId: 'b0000000-0000-0000-0000-000000000001',
      userName: 'مريم الشافعي',
      userAvatar: '/images/reels/reel_1.jpg',
      userRole: 'buyer',
      text: 'اللون الأصفر الليموني خرافة في الصيف! هل البليزر فيه بطانة خفيفة؟ 💛',
      timeAgo: 'منذ ساعتين',
      likes: 14,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000002',
      userId: 'b0000000-0000-0000-0000-000000000002',
      userName: 'نور الهدى',
      userAvatar: '/images/reels/reel_2.jpg',
      userRole: 'buyer',
      text: 'تنسيقه مع الجينز خطير ومريح جداً، طلبت مقاس M ومظبوط بالملي 👏',
      timeAgo: 'منذ 4 ساعات',
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
      text: 'ستايل أوفرسايز راقي، أحلى بليزر نزل في كولكشن الصيف ✨',
      timeAgo: 'منذ يوم',
      likes: 31,
      parentId: null,
      replies: []
    }
  ],

  // 2. Sky Blue Linen Shirt
  'ee000000-0000-0000-0000-000000000002': [
    {
      id: 'cc000000-0000-0000-0000-000000000004',
      userId: 'b0000000-0000-0000-0000-000000000003',
      userName: 'هدير عثمان',
      userAvatar: '/images/reels/reel_1.jpg',
      userRole: 'buyer',
      text: 'القميص الكتان السماوي باين خفيف ومنعش للحر! المقاس أوفرسايز ولا عادي؟ 🩵',
      timeAgo: 'منذ ساعة',
      likes: 12,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000005',
      userId: 'b0000000-0000-0000-0000-000000000004',
      userName: 'سارة محمود',
      userAvatar: '/images/reels/reel_2.jpg',
      userRole: 'buyer',
      text: 'التطريز متقن جداً والبنطلون التشينو البيج تحفة معاه واستلمت في 48 ساعة 🚀',
      timeAgo: 'منذ 3 ساعات',
      likes: 8,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000006',
      userId: 'c0000000-0000-0000-0000-000000000002',
      userName: 'سلمى ستايلز',
      userAvatar: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      userRole: 'merchant',
      text: 'الكتان طبيعي 100% ومصنوع بفخر في مصر، مريح جداً لكل يوم!',
      timeAgo: 'منذ 6 ساعات',
      likes: 24,
      parentId: null,
      replies: []
    }
  ],

  // 3. Asymmetric White Top
  'ee000000-0000-0000-0000-000000000003': [
    {
      id: 'cc000000-0000-0000-0000-000000000007',
      userId: 'b0000000-0000-0000-0000-000000000001',
      userName: 'فريدة جلال',
      userAvatar: '/images/reels/reel_1.jpg',
      userRole: 'buyer',
      text: 'التوب الأبيض شياكة مش طبيعية! القماش استريتش ناعم وسميك؟ 🤍',
      timeAgo: 'منذ 30 دقيقة',
      likes: 15,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000008',
      userId: 'c0000000-0000-0000-0000-000000000004',
      userName: 'دنيا الألفي',
      userAvatar: '/images/reels/reel_2.jpg',
      userRole: 'creator',
      text: 'معادلة jeans and a cute top ناجحة جداً، ستايل أنيق للمناسبات والخروجات الصيفية ✨',
      timeAgo: 'منذ ساعتين',
      likes: 19,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000009',
      userId: 'b0000000-0000-0000-0000-000000000002',
      userName: 'ميرنا كمال',
      userAvatar: '/images/reels/reel_1.jpg',
      userRole: 'buyer',
      text: 'الحزام الجلد مع الجينز طالع روعة، متوفر منه ألوان تانية؟',
      timeAgo: 'منذ 5 ساعات',
      likes: 6,
      parentId: null,
      replies: []
    }
  ],

  // 4. Classic Leather Shoulder Bag
  'ee000000-0000-0000-0000-000000000004': [
    {
      id: 'cc000000-0000-0000-0000-000000000010',
      userId: 'b0000000-0000-0000-0000-000000000005',
      userName: 'رنا الشريف',
      userAvatar: '/images/reels/reel_2.jpg',
      userRole: 'buyer',
      text: 'سواتش الشنط يجنن! لون البوردو والجملي خطفوا قلبي 👜✨',
      timeAgo: 'منذ 45 دقيقة',
      likes: 22,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000011',
      userId: 'b0000000-0000-0000-0000-000000000006',
      userName: 'نهال زكي',
      userAvatar: '/images/reels/reel_1.jpg',
      userRole: 'buyer',
      text: 'الإبزيم الذهبي تقيل وفاخر مابيغيرش لون، والجلد طبيعي ممتاز ❤️',
      timeAgo: 'منذ ساعتين',
      likes: 11,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000012',
      userId: 'c0000000-0000-0000-0000-000000000005',
      userName: 'مايا إكسسوارات',
      userAvatar: '/images/reels/fashion_shoulder_bags_thumb.jpg',
      userRole: 'merchant',
      text: 'السعة الداخلية تاخد كل مستلزماتك اليومية وفيه جيوب مبطنة!',
      timeAgo: 'منذ 3 ساعات',
      likes: 38,
      parentId: null,
      replies: []
    }
  ],

  // 5. Chunky Knit Turtleneck
  'ee000000-0000-0000-0000-000000000005': [
    {
      id: 'cc000000-0000-0000-0000-000000000013',
      userId: 'b0000000-0000-0000-0000-000000000007',
      userName: 'إنجي حسام',
      userAvatar: '/images/reels/reel_2.jpg',
      userRole: 'buyer',
      text: 'السويتر التريكو الصوف أوفرسايز وشكله دافي ومريح أوي 🖤',
      timeAgo: 'منذ ساعة',
      likes: 18,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000014',
      userId: 'c0000000-0000-0000-0000-000000000001',
      userName: 'ليلى فاشن',
      userAvatar: '/images/reels/fashion_knit_sweater_thumb.jpg',
      userRole: 'creator',
      text: 'تنسيقه مع التنورة الكاروهات والبوت كلاسيكي على طريقة شتاء الإسكندرية ❄️',
      timeAgo: 'منذ 4 ساعات',
      likes: 27,
      parentId: null,
      replies: []
    }
  ],

  // 6. Suede Harrington Jacket
  'ee000000-0000-0000-0000-000000000006': [
    {
      id: 'cc000000-0000-0000-0000-000000000015',
      userId: 'b0000000-0000-0000-0000-000000000008',
      userName: 'أحمد طارق',
      userAvatar: '/images/reels/reel_1.jpg',
      userRole: 'buyer',
      text: 'جاكيت شمواه بني فخم جداً! الخامة ثقيلة ومبطنة من جوة؟ 🤎',
      timeAgo: 'منذ 50 دقيقة',
      likes: 14,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000016',
      userId: 'c0000000-0000-0000-0000-000000000006',
      userName: 'عمر لوكس',
      userAvatar: '/images/reels/fashion_suede_jacket_thumb.jpg',
      userRole: 'creator',
      text: 'البنطلون الزيتي مع الجاكيت تنسيق عبقري، أحسن لوك كلاسيك رجالي!',
      timeAgo: 'منذ 3 ساعات',
      likes: 29,
      parentId: null,
      replies: []
    }
  ],

  // 7. Vintage Tonneau Watch
  'ee000000-0000-0000-0000-000000000007': [
    {
      id: 'cc000000-0000-0000-0000-000000000017',
      userId: 'c0000000-0000-0000-0000-000000000007',
      userName: 'كريم إيديتوريال',
      userAvatar: '/images/reels/fashion_vintage_watch_thumb.jpg',
      userRole: 'creator',
      text: 'الساعة البرميلية الروز جولد تحفة فنية على المعصم! ⌚✨',
      timeAgo: 'منذ ساعتين',
      likes: 45,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000018',
      userId: 'b0000000-0000-0000-0000-000000000009',
      userName: 'رامي عز الدين',
      userAvatar: '/images/reels/reel_2.jpg',
      userRole: 'buyer',
      text: 'المينا الروماني مع السوار الجلد البني قمة في الفخامة الكلاسيكية الهادية 👌',
      timeAgo: 'منذ 4 ساعات',
      likes: 16,
      parentId: null,
      replies: []
    }
  ],

  // 8. Handcrafted Woven Leather Bag
  'ee000000-0000-0000-0000-000000000008': [
    {
      id: 'cc000000-0000-0000-0000-000000000019',
      userId: 'b0000000-0000-0000-0000-000000000010',
      userName: 'نانسي فؤاد',
      userAvatar: '/images/reels/reel_1.jpg',
      userRole: 'buyer',
      text: 'الجلد المنسوج يدوياً واضح فيه مجهود الحرفيين المصريين 🤎',
      timeAgo: 'منذ ساعة',
      likes: 21,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000020',
      userId: 'c0000000-0000-0000-0000-000000000008',
      userName: 'فريدة أتيليه',
      userAvatar: '/images/reels/fashion_woven_bag_thumb.jpg',
      userRole: 'merchant',
      text: 'حجمها مناسب للجامعة والشغل اليومي، حبيت اليد المظفرة! فخر الصناعة المصرية 🇪🇬',
      timeAgo: 'منذ 3 ساعات',
      likes: 33,
      parentId: null,
      replies: []
    }
  ],

  // 9. Barrel Handbag
  'ee000000-0000-0000-0000-000000000009': [
    {
      id: 'cc000000-0000-0000-0000-000000000021',
      userId: 'b0000000-0000-0000-0000-000000000011',
      userName: 'رضوى فهمي',
      userAvatar: '/images/reels/reel_2.jpg',
      userRole: 'buyer',
      text: 'شكل الشنطة الأسطوانية الكروكو البني مختلف ومميز جداً 👜',
      timeAgo: 'منذ ساعتين',
      likes: 12,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000022',
      userId: 'c0000000-0000-0000-0000-000000000009',
      userName: 'هدى ليذر',
      userAvatar: '/images/reels/fashion_barrel_bag_thumb.jpg',
      userRole: 'merchant',
      text: 'معاها حزام كتف طويل قابل للتعديل ومحفظة جلد طبيعي هدية!',
      timeAgo: 'منذ 5 ساعات',
      likes: 25,
      parentId: null,
      replies: []
    }
  ],

  // 10. Cuban Collar Shirt
  'ee000000-0000-0000-0000-000000000010': [
    {
      id: 'cc000000-0000-0000-0000-000000000023',
      userId: 'b0000000-0000-0000-0000-000000000012',
      userName: 'كريم عادل',
      userAvatar: '/images/reels/reel_1.jpg',
      userRole: 'buyer',
      text: 'قميص الساحل الرسمي للصيف! الألوان والطباعة ثابتة مع الغسيل 🕶️',
      timeAgo: 'منذ 40 دقيقة',
      likes: 17,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000024',
      userId: 'c0000000-0000-0000-0000-000000000010',
      userName: 'يوسف ستايل',
      userAvatar: '/images/reels/fashion_cuban_shirt_thumb.jpg',
      userRole: 'creator',
      text: 'لبسته في دهب وكان خفيف جداً ومريح في الرطوبة، أنصح بيه بشدة!',
      timeAgo: 'منذ 3 ساعات',
      likes: 28,
      parentId: null,
      replies: []
    }
  ],

  // 11. Sheglam Mascara
  'ee000000-0000-0000-0000-000000000011': [
    {
      id: 'cc000000-0000-0000-0000-000000000025',
      userId: 'c0000000-0000-0000-0000-000000000011',
      userName: 'ندى بيوتي',
      userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      userRole: 'creator',
      text: 'ماسكارا شيجلام بتطول الرموش فعلاً بدون تكتل والمزيل بيشيلها في ثواني! ✨👀',
      timeAgo: 'منذ ساعة',
      likes: 54,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000026',
      userId: 'b0000000-0000-0000-0000-000000000013',
      userName: 'ميريت إبراهيم',
      userAvatar: '/images/reels/reel_2.jpg',
      userRole: 'buyer',
      text: 'أحسن ماسكارا ووتربروف جربتها، فرشتها بتفصل الرموش شعرة شعرة ومابتسيحش!',
      timeAgo: 'منذ ساعتين',
      likes: 31,
      parentId: null,
      replies: []
    }
  ],

  // 12. Sheglam Lip Tint
  'ee000000-0000-0000-0000-000000000012': [
    {
      id: 'cc000000-0000-0000-0000-000000000027',
      userId: 'c0000000-0000-0000-0000-000000000012',
      userName: 'سارة ميكأب',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      userRole: 'creator',
      text: 'درجة Cherry Bark تجننن! ثباته قد إيه على الشفايف والخدود؟ 🍒💋',
      timeAgo: 'منذ 30 دقيقة',
      likes: 62,
      parentId: null,
      replies: []
    },
    {
      id: 'cc000000-0000-0000-0000-000000000028',
      userId: 'b0000000-0000-0000-0000-000000000014',
      userName: 'نوران شريف',
      userAvatar: '/images/reels/reel_1.jpg',
      userRole: 'buyer',
      text: 'بيفضل ثابت طول اليوم وبيدي مظهر مورد طبيعي وصحي خيالي! طلبت درجتين ❤️',
      timeAgo: 'منذ ساعتين',
      likes: 27,
      parentId: null,
      replies: []
    }
  ]
};

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
        dbComments = data.map(c => ({
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
        // Check if cached data is obsolete generic comments from before
        const isObsoleteGeneric = parsed.some(c => c.id === 'cc000000-0000-0000-0000-000000000001') && canonicalId !== 'ee000000-0000-0000-0000-000000000001';
        if (!isObsoleteGeneric) {
          local = parsed;
        }
      }
    } catch (e) {}

    // 3. Fallback to distinct context-specific comments for THIS reel
    const seedForThisReel = SEED_COMMENTS_BY_REEL[canonicalId] || SEED_COMMENTS_BY_REEL['ee000000-0000-0000-0000-000000000001'];
    if (local.length === 0 && dbComments.length === 0) {
      local = seedForThisReel;
      try {
        localStorage.setItem(key, JSON.stringify(local));
      } catch (e) {}
    }

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
      const seedList = SEED_COMMENTS_BY_REEL[canonicalId] || SEED_COMMENTS_BY_REEL['ee000000-0000-0000-0000-000000000001'] || [];
      const list = stored ? JSON.parse(stored) : [...seedList];
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
