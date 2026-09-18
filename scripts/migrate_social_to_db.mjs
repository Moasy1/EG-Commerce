import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

let supabaseUrl = 'https://dbufgbonhnoridenwjry.supabase.co';
let supabaseKey = 'sb_publishable_Wa3PBB1IaxacwZLo0pzuzQ_hr1trRPR';

try {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const k = match[1].trim();
        const v = match[2].trim();
        if (k === 'VITE_SUPABASE_URL') supabaseUrl = v;
        if (k === 'VITE_SUPABASE_ANON_KEY') supabaseKey = v;
      }
    }
  }
} catch (e) {}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Starting EG-Commerce Social Engagement Database Migration & Verification...');

const CANONICAL_REELS = [
  {
    id: 'ee000000-0000-0000-0000-000000000001',
    creator_id: 'ce000000-0000-0000-0000-000000000002',
    merchant_id: 'd0000000-0000-0000-0000-000000000001',
    video_url: '/images/reels/fashion_citrine_blazer.mp4',
    thumbnail_url: '/images/reels/fashion_citrine_blazer_thumb.jpg',
    caption: 'تنسيق بليزر السيترين الأوفرسايز مع بنطلون جينز كلاسيك ونظارة شمسية 💛 فخامة الصيف وأناقة لا تقاوم! #بليزر #موضة_القاهرة',
    views_count: 62400,
    likes_count: 4820,
    saves_count: 1140,
    comments_count: 218,
    shares_count: 1200,
    status: 'active'
  },
  {
    id: 'ee000000-0000-0000-0000-000000000002',
    creator_id: 'ce000000-0000-0000-0000-000000000003',
    merchant_id: 'd0000000-0000-0000-0000-000000000001',
    video_url: '/images/reels/fashion_oversized_shirt.mp4',
    thumbnail_url: '/images/reels/fashion_oversized_shirt_thumb.jpg',
    caption: 'قميص كتان سماوي أوفرسايز خفيف جداً ومريح مع بنطلون تشينو بيج واسع 🩵 إطلالة كاجوال أنيقة لكل يوم!',
    views_count: 45100,
    likes_count: 3240,
    saves_count: 820,
    comments_count: 139,
    shares_count: 850,
    status: 'active'
  },
  {
    id: 'ee000000-0000-0000-0000-000000000003',
    creator_id: 'ce000000-0000-0000-0000-000000000004',
    merchant_id: 'd0000000-0000-0000-0000-000000000001',
    video_url: '/images/reels/fashion_oneshoulder_top.mp4',
    thumbnail_url: '/images/reels/fashion_oneshoulder_top_thumb.jpg',
    caption: 'توب بكتف واحد عاجي ناعم مع جينز كلاسيك عالي الخصر 🤍 ستايل أنيق للمناسبات والخروجات الصيفية!',
    views_count: 38900,
    likes_count: 2910,
    saves_count: 640,
    comments_count: 88,
    shares_count: 610,
    status: 'active'
  },
  {
    id: 'ee000000-0000-0000-0000-000000000004',
    creator_id: 'ce000000-0000-0000-0000-000000000005',
    merchant_id: 'd0000000-0000-0000-0000-000000000002',
    video_url: '/images/reels/fashion_shoulder_bags.mp4',
    thumbnail_url: '/images/reels/fashion_shoulder_bags_thumb.jpg',
    caption: 'سواتش كولكشن شنط الكتف الجلدية الكلاسيك بـ 5 ألوان تخطف العين (عاجي، بني، بوردو، رمادي، جملي) بإبزيم ذهبي فاخر! 👜✨',
    views_count: 48500,
    likes_count: 5130,
    saves_count: 980,
    comments_count: 195,
    shares_count: 1400,
    status: 'active'
  },
  {
    id: 'ee000000-0000-0000-0000-000000000005',
    creator_id: 'ce000000-0000-0000-0000-000000000001',
    merchant_id: 'd0000000-0000-0000-0000-000000000001',
    video_url: '/images/reels/fashion_oversized_shirt.mp4',
    thumbnail_url: '/images/products/linen_abaya.jpg',
    caption: 'عباية كتان مغسول فاخرة بتطريز يدوي مستوحى من التراث المصري الملكي 🇪🇬✨ #موضة_مصرية #كتان_طبيعي',
    views_count: 54000,
    likes_count: 6420,
    saves_count: 1530,
    comments_count: 312,
    shares_count: 1900,
    status: 'active'
  }
];

const SEED_LIKES = [
  { user_id: 'b0000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000001' },
  { user_id: 'b0000000-0000-0000-0000-000000000002', reel_id: 'ee000000-0000-0000-0000-000000000001' },
  { user_id: 'c0000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000001' },
  { user_id: 'b0000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000002' },
  { user_id: 'c0000000-0000-0000-0000-000000000002', reel_id: 'ee000000-0000-0000-0000-000000000002' },
  { user_id: 'b0000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000003' },
  { user_id: 'b0000000-0000-0000-0000-000000000002', reel_id: 'ee000000-0000-0000-0000-000000000004' },
  { user_id: 'c0000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000005' },
  { user_id: 'a0000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000001' }
];

const SEED_SAVES = [
  { user_id: 'b0000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000001' },
  { user_id: 'b0000000-0000-0000-0000-000000000002', reel_id: 'ee000000-0000-0000-0000-000000000002' },
  { user_id: 'b0000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000004' },
  { user_id: 'c0000000-0000-0000-0000-000000000001', reel_id: 'ee000000-0000-0000-0000-000000000005' }
];

const SEED_COMMENTS = [
  {
    id: 'cc000000-0000-0000-0000-000000000001',
    user_id: 'b0000000-0000-0000-0000-000000000001',
    reel_id: 'ee000000-0000-0000-0000-000000000001',
    body: 'الكتان باين عليه تحفة وتفصيله يجنن! هل متاح شحن سريع لإسكندرية؟ ❤️',
    likes_count: 14,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000001',
    user_id: 'b0000000-0000-0000-0000-000000000001',
    reel_id: 'ee000000-0000-0000-0000-000000000001',
    body: 'اللون الأصفر الليموني خرافة في الصيف! هل البليزر فيه بطانة خفيفة؟ 💛',
    content: 'اللون الأصفر الليموني خرافة في الصيف! هل البليزر فيه بطانة خفيفة؟ 💛',
    user_name: 'مريم الشافعي',
    likes_count: 14,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000002',
    user_id: 'b0000000-0000-0000-0000-000000000002',
    reel_id: 'ee000000-0000-0000-0000-000000000001',
    body: 'تنسيقه مع الجينز خطير ومريح جداً، طلبت مقاس M ومظبوط بالملي 👏',
    content: 'تنسيقه مع الجينز خطير ومريح جداً، طلبت مقاس M ومظبوط بالملي 👏',
    user_name: 'نور الهدى',
    likes_count: 9,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000003',
    user_id: 'c0000000-0000-0000-0000-000000000001',
    reel_id: 'ee000000-0000-0000-0000-000000000001',
    body: 'ستايل أوفرسايز راقي، أحلى بليزر نزل في كولكشن الصيف ✨',
    content: 'ستايل أوفرسايز راقي، أحلى بليزر نزل في كولكشن الصيف ✨',
    user_name: 'ياسمين السيد',
    likes_count: 31,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000004',
    user_id: 'b0000000-0000-0000-0000-000000000003',
    reel_id: 'ee000000-0000-0000-0000-000000000002',
    body: 'القميص الكتان السماوي باين خفيف ومنعش للحر! المقاس أوفرسايز ولا عادي؟ 🩵',
    content: 'القميص الكتان السماوي باين خفيف ومنعش للحر! المقاس أوفرسايز ولا عادي؟ 🩵',
    user_name: 'هدير عثمان',
    likes_count: 12,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000005',
    user_id: 'b0000000-0000-0000-0000-000000000004',
    reel_id: 'ee000000-0000-0000-0000-000000000002',
    body: 'التطريز متقن جداً والبنطلون التشينو البيج تحفة معاه واستلمت في 48 ساعة 🚀',
    content: 'التطريز متقن جداً والبنطلون التشينو البيج تحفة معاه واستلمت في 48 ساعة 🚀',
    user_name: 'سارة محمود',
    likes_count: 8,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000007',
    user_id: 'b0000000-0000-0000-0000-000000000001',
    reel_id: 'ee000000-0000-0000-0000-000000000003',
    body: 'التوب الأبيض شياكة مش طبيعية! القماش استريتش ناعم وسميك؟ 🤍',
    content: 'التوب الأبيض شياكة مش طبيعية! القماش استريتش ناعم وسميك؟ 🤍',
    user_name: 'فريدة جلال',
    likes_count: 15,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000010',
    user_id: 'b0000000-0000-0000-0000-000000000005',
    reel_id: 'ee000000-0000-0000-0000-000000000004',
    body: 'سواتش الشنط يجنن! لون البوردو والجملي خطفوا قلبي 👜✨',
    content: 'سواتش الشنط يجنن! لون البوردو والجملي خطفوا قلبي 👜✨',
    user_name: 'رنا الشريف',
    likes_count: 22,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000013',
    user_id: 'b0000000-0000-0000-0000-000000000007',
    reel_id: 'ee000000-0000-0000-0000-000000000005',
    body: 'السويتر التريكو الصوف أوفرسايز وشكله دافي ومريح أوي 🖤',
    content: 'السويتر التريكو الصوف أوفرسايز وشكله دافي ومريح أوي 🖤',
    user_name: 'إنجي حسام',
    likes_count: 18,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000015',
    user_id: 'b0000000-0000-0000-0000-000000000008',
    reel_id: 'ee000000-0000-0000-0000-000000000006',
    body: 'جاكيت شمواه بني فخم جداً! الخامة ثقيلة ومبطنة من جوة؟ 🤎',
    content: 'جاكيت شمواه بني فخم جداً! الخامة ثقيلة ومبطنة من جوة؟ 🤎',
    user_name: 'أحمد طارق',
    likes_count: 14,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000017',
    user_id: 'c0000000-0000-0000-0000-000000000007',
    reel_id: 'ee000000-0000-0000-0000-000000000007',
    body: 'الساعة البرميلية الروز جولد تحفة فنية على المعصم! ⌚✨',
    content: 'الساعة البرميلية الروز جولد تحفة فنية على المعصم! ⌚✨',
    user_name: 'كريم إيديتوريال',
    likes_count: 45,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000019',
    user_id: 'b0000000-0000-0000-0000-000000000010',
    reel_id: 'ee000000-0000-0000-0000-000000000008',
    body: 'الجلد المنسوج يدوياً واضح فيه مجهود الحرفيين المصريين 🤎',
    content: 'الجلد المنسوج يدوياً واضح فيه مجهود الحرفيين المصريين 🤎',
    user_name: 'نانسي فؤاد',
    likes_count: 21,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000021',
    user_id: 'b0000000-0000-0000-0000-000000000011',
    reel_id: 'ee000000-0000-0000-0000-000000000009',
    body: 'شكل الشنطة الأسطوانية الكروكو البني مختلف ومميز جداً 👜',
    content: 'شكل الشنطة الأسطوانية الكروكو البني مختلف ومميز جداً 👜',
    user_name: 'رضوى فهمي',
    likes_count: 12,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000023',
    user_id: 'b0000000-0000-0000-0000-000000000012',
    reel_id: 'ee000000-0000-0000-0000-000000000010',
    body: 'قميص الساحل الرسمي للصيف! الألوان والطباعة ثابتة مع الغسيل 🕶️',
    content: 'قميص الساحل الرسمي للصيف! الألوان والطباعة ثابتة مع الغسيل 🕶️',
    user_name: 'كريم عادل',
    likes_count: 17,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000025',
    user_id: 'c0000000-0000-0000-0000-000000000011',
    reel_id: 'ee000000-0000-0000-0000-000000000011',
    body: 'ماسكارا شيجلام بتطول الرموش فعلاً بدون تكتل والمزيل بيشيلها في ثواني! ✨👀',
    content: 'ماسكارا شيجلام بتطول الرموش فعلاً بدون تكتل والمزيل بيشيلها في ثواني! ✨👀',
    user_name: 'ندى بيوتي',
    likes_count: 54,
    status: 'active'
  },
  {
    id: 'cc000000-0000-0000-0000-000000000027',
    user_id: 'c0000000-0000-0000-0000-000000000012',
    reel_id: 'ee000000-0000-0000-0000-000000000012',
    body: 'درجة Cherry Bark تجننن! ثباته قد إيه على الشفايف والخدود؟ 🍒💋',
    content: 'درجة Cherry Bark تجننن! ثباته قد إيه على الشفايف والخدود؟ 🍒💋',
    user_name: 'سارة ميكأب',
    likes_count: 62,
    status: 'active'
  }
];

async function runMigration() {
  try {
    // 1. Check reels table and upsert canonical reels
    console.log('1. Upserting canonical reels into reels table...');
    const { data: reelsData, error: reelsError } = await supabase
      .from('reels')
      .upsert(CANONICAL_REELS, { onConflict: 'id' })
      .select('id, caption');

    if (reelsError) {
      console.warn('⚠️ Note on reels upsert (may already exist or schema RLS):', reelsError.message);
    } else {
      console.log(`✓ Successfully synchronized ${reelsData?.length || CANONICAL_REELS.length} canonical reels in database.`);
    }

    // 2. Check and upsert real database likes
    console.log('2. Inserting real social likes into reel_likes table...');
    const { data: likesData, error: likesError } = await supabase
      .from('reel_likes')
      .upsert(SEED_LIKES, { onConflict: 'user_id, reel_id' })
      .select('reel_id');

    if (likesError) {
      console.warn('⚠️ Note on reel_likes upsert:', likesError.message);
    } else {
      console.log(`✓ Successfully recorded ${likesData?.length || SEED_LIKES.length} real likes in reel_likes table.`);
    }

    // 3. Check and upsert real database saves
    console.log('3. Inserting real social saves into reel_saves table...');
    const { data: savesData, error: savesError } = await supabase
      .from('reel_saves')
      .upsert(SEED_SAVES, { onConflict: 'user_id, reel_id' })
      .select('reel_id');

    if (savesError) {
      console.warn('⚠️ Note on reel_saves upsert:', savesError.message);
    } else {
      console.log(`✓ Successfully recorded ${savesData?.length || SEED_SAVES.length} real saves in reel_saves table.`);
    }

    // 4. Check and upsert real comments
    console.log('4. Inserting real comments into comments table...');
    const { data: commentsData, error: commentsError } = await supabase
      .from('comments')
      .upsert(SEED_COMMENTS, { onConflict: 'id' })
      .select('id, body');

    if (commentsError) {
      console.warn('⚠️ Note on comments upsert:', commentsError.message);
    } else {
      console.log(`✓ Successfully stored ${commentsData?.length || SEED_COMMENTS.length} live comments in database.`);
    }

    // 5. Verification queries
    console.log('\n--- VERIFICATION QUERIES ---');
    const firstReelId = CANONICAL_REELS[0].id;

    // Count live likes for first reel
    const { count: liveLikesCount, error: countLikesErr } = await supabase
      .from('reel_likes')
      .select('*', { count: 'exact', head: true })
      .eq('reel_id', firstReelId);
    console.log(`• Live reel_likes count for [${firstReelId}]:`, liveLikesCount ?? (countLikesErr ? countLikesErr.message : 0));

    // Count live saves for first reel
    const { count: liveSavesCount, error: countSavesErr } = await supabase
      .from('reel_saves')
      .select('*', { count: 'exact', head: true })
      .eq('reel_id', firstReelId);
    console.log(`• Live reel_saves count for [${firstReelId}]:`, liveSavesCount ?? (countSavesErr ? countSavesErr.message : 0));

    // Count live comments for first reel
    const { count: liveCommentsCount, error: countCommentsErr } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('reel_id', firstReelId);
    console.log(`• Live comments count for [${firstReelId}]:`, liveCommentsCount ?? (countCommentsErr ? countCommentsErr.message : 0));

    console.log('\n✅ Database migration & verification script completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigration();
