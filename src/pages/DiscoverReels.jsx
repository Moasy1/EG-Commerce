import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import { ReelsService } from '../services/ReelsService';
import DesktopFeed from '../components/desktop/DesktopFeed';
import { feedService } from '../services/algorithm/feedService.js';
import { socialService } from '../services/social/socialService.js';
import { eventTracker } from '../services/analytics/eventTracker.js';
import { attributionService } from '../services/analytics/attributionService.js';

const ReelVideoPlayer = ({ reel, isActive, isAdjacent, isGlobalMuted, toggleMute }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const trackedMilestones = useRef({ 25: false, 50: false, 75: false, 100: false });

  useEffect(() => {
    if (!videoRef.current) return;
    trackedMilestones.current = { 25: false, 50: false, 75: false, 100: false };
    
    // Play only if active
    if (isActive) {
      videoRef.current.play()
        .then(() => {
          setIsPlaying(true);
          eventTracker.trackReelStart(reel);
        })
        .catch(err => {
          console.log("Autoplay prevented:", err);
          setIsPlaying(false);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, reel.id]);

  // Sync mute state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isGlobalMuted;
    }
  }, [isGlobalMuted]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const { currentTime, duration } = videoRef.current;
    if (!duration || duration <= 0) return;

    const progress = (currentTime / duration) * 100;
    const watchMs = Math.round(currentTime * 1000);

    if (progress >= 25 && !trackedMilestones.current[25]) {
      trackedMilestones.current[25] = true;
      eventTracker.trackReelProgress(reel, 25, watchMs);
    }
    if (progress >= 50 && !trackedMilestones.current[50]) {
      trackedMilestones.current[50] = true;
      eventTracker.trackReelProgress(reel, 50, watchMs);
    }
    if (progress >= 75 && !trackedMilestones.current[75]) {
      trackedMilestones.current[75] = true;
      eventTracker.trackReelProgress(reel, 75, watchMs);
    }
    if (progress >= 95 && !trackedMilestones.current[100]) {
      trackedMilestones.current[100] = true;
      eventTracker.trackReelComplete(reel, watchMs);
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <div className="absolute inset-0 bg-black" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={reel.videoBg}
        poster={reel.avatar}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isGlobalMuted}
        onTimeUpdate={handleTimeUpdate}
        preload={isActive ? "auto" : isAdjacent ? "metadata" : "none"}
      />
      {/* Mute Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        className="absolute top-20 right-4 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-black/60 transition-colors"
      >
        <span className="material-symbols-outlined">{isGlobalMuted ? 'volume_off' : 'volume_up'}</span>
      </button>
    </div>
  );
};

const getDefaultReels = (isAr = true) => [
    {
      id: 'ee000000-0000-0000-0000-000000000001',
      creatorHandle: '@cairo_chic',
      creatorName: 'كايرو شيك • Cairo Chic',
      avatar: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      videoBg: '/images/reels/fashion_citrine_blazer.mp4',
      caption: isAr 
        ? 'تنسيق بليزر السيترين الأوفرسايز مع بنطلون جينز كلاسيك ونظارة شمسية 💛 فخامة الصيف وأناقة لا تقاوم! #بليزر #موضة_القاهرة' 
        : 'Styling the oversized Citrine Yellow Blazer with denim and sleek shades 💛 Effortless luxury! #FashionReels #OOTD',
      music: isAr ? 'ألحان إيقاعية هادية • صيف 2026' : 'Summer Aesthetic Vibes • Instrumental',
      likes: 4820,
      comments: 218,
      saves: 1140,
      products: [
        {
          id: 'p-fashion-blazer',
          sku: 'TLK-BLZ-09',
          title: isAr ? 'بليزر أوفرسايز أصفر ليموني راقي' : 'Citrine Tailored Oversized Blazer',
          price: 2200,
          originalPrice: 2750,
          discount: '20% OFF',
          image: '/images/reels/fashion_citrine_blazer_thumb.jpg'
        },
        {
          id: 'p-fashion-jeans-1',
          sku: 'TLK-JNS-01',
          title: isAr ? 'بنطلون جينز كلاسيك عالي الخصر' : 'Classic High-Waist Denim',
          price: 850,
          originalPrice: 1100,
          discount: '22% OFF',
          image: '/images/products/linen_abaya.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000002',
      creatorHandle: '@salma.styles',
      creatorName: 'سلمى ستايلز • Salma Styles',
      avatar: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      videoBg: '/images/reels/fashion_oversized_shirt.mp4',
      caption: isAr 
        ? 'قميص كتان سماوي أوفرسايز خفيف جداً ومريح مع بنطلون تشينو بيج واسع 🩵 إطلالة كاجوال أنيقة لكل يوم!' 
        : 'Sky blue linen oversized shirt paired with relaxed wide chinos 🩵 Summer perfection! #LinenStyle',
      music: isAr ? 'نغمات كاجوال مصرية' : 'Chill Acoustic Grooves',
      likes: 3450,
      comments: 139,
      saves: 820,
      products: [
        {
          id: 'p-fashion-oversized-shirt',
          sku: 'TLK-SHT-05',
          title: isAr ? 'قميص كتان سماوي بقصة أوفرسايز' : 'Oversized Sky Blue Linen Shirt',
          price: 950,
          originalPrice: 1200,
          discount: '21% OFF',
          image: '/images/reels/fashion_oversized_shirt_thumb.jpg'
        },
        {
          id: 'p-fashion-chinos-1',
          sku: 'TLK-CHN-02',
          title: isAr ? 'بنطلون تشينو واسع بيج' : 'Relaxed Beige Wide Chinos',
          price: 720,
          originalPrice: 900,
          discount: '20% OFF',
          image: '/images/products/embroidered_blouse.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000003',
      creatorHandle: '@zeina_ootd',
      creatorName: 'زينة أوفت • Zeina OOTD',
      avatar: '/images/reels/fashion_oneshoulder_top_thumb.jpg',
      videoBg: '/images/reels/fashion_oneshoulder_top.mp4',
      caption: isAr 
        ? 'توب بكتف واحد عاجي ناعم مع جينز كلاسيك عالي الخصر وحزام جلد 🤍 "Jeans and a cute top" هو الأساس دايماً!' 
        : 'Asymmetric one-shoulder white bodysuit with high-waist denim 🤍 The classic "jeans and a cute top" equation! ✨',
      music: isAr ? 'صوت تريند عالمي' : 'Trending Pop Rhythm',
      likes: 2910,
      comments: 124,
      saves: 730,
      products: [
        {
          id: 'p-fashion-oneshoulder-top',
          sku: 'TLK-TOP-06',
          title: isAr ? 'توب بكتف واحد عاجي ناعم' : 'Asymmetric One-Shoulder White Top',
          price: 680,
          originalPrice: 850,
          discount: '20% OFF',
          image: '/images/reels/fashion_oneshoulder_top_thumb.jpg'
        },
        {
          id: 'p-fashion-jeans-2',
          sku: 'TLK-JNS-02',
          title: isAr ? 'بنطلون جينز كلاسيك عالي الخصر' : 'Classic High-Waist Denim',
          price: 850,
          originalPrice: 1100,
          discount: '22% OFF',
          image: '/images/products/linen_abaya.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000004',
      creatorHandle: '@maya_accessories',
      creatorName: 'مايا إكسسوارات • Maya Accessories',
      avatar: '/images/reels/fashion_shoulder_bags_thumb.jpg',
      videoBg: '/images/reels/fashion_shoulder_bags.mp4',
      caption: isAr 
        ? 'سواتش كولكشن شنط الكتف الجلدية الكلاسيك بـ 5 ألوان تخطف العين (عاجي، بني، بوردو، رمادي، جملي) بإبزيم ذهبي فاخر! 👜✨' 
        : 'All 5 iconic colorways of the structured leather shoulder bag with polished gold hardware! 👜✨ #Bags',
      music: isAr ? 'إيقاع إكسسوارات راقي' : 'High Fashion Beats',
      likes: 5120,
      comments: 195,
      saves: 980,
      products: [
        {
          id: 'p-fashion-shoulder-bags',
          sku: 'KHC-BAG-01',
          title: isAr ? 'حقيبة كتف جلدية كلاسيك بإبزيم ذهبي' : 'Classic Structured Leather Bag',
          price: 1850,
          originalPrice: 2300,
          discount: '20% OFF',
          image: '/images/reels/fashion_shoulder_bags_thumb.jpg'
        },
        {
          id: 'p-fashion-silk-scarf',
          sku: 'TLK-SCF-01',
          title: isAr ? 'سكارف حرير منقوش فاخر' : 'Luxury Printed Silk Scarf',
          price: 450,
          originalPrice: 600,
          discount: '25% OFF',
          image: '/images/products/silk_scarf.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000005',
      creatorHandle: '@layla_fashion',
      creatorName: 'ليلى فاشن • Layla Fashion',
      avatar: '/images/reels/fashion_knit_sweater_thumb.jpg',
      videoBg: '/images/reels/fashion_knit_sweater.mp4',
      caption: isAr 
        ? 'سويتر تريكو صوف أوفرسايز بياقة عالية مع جيبة صوف صوفية كاروهات 🖤 دفء وأناقة شتوية راقية!' 
        : 'Chunky oversized knit turtleneck sweater paired with wool argyle skirt 🖤 Winter warmth & elegance!',
      music: isAr ? 'موسيقى شتوية دافئة' : 'Cozy Winter Harmony',
      likes: 2140,
      comments: 98,
      saves: 560,
      products: [
        {
          id: 'p-fashion-knit-sweater',
          sku: 'TLK-SWT-07',
          title: isAr ? 'سويتر صوف تريكو أوفرسايز بياقة عالية' : 'Chunky Knit Oversized Turtleneck',
          price: 1650,
          originalPrice: 2100,
          discount: '21% OFF',
          image: '/images/reels/fashion_knit_sweater_thumb.jpg'
        },
        {
          id: 'p-fashion-wool-skirt',
          sku: 'TLK-SKT-03',
          title: isAr ? 'تنورة صوف بكسرات كاروهات' : 'Pleated Wool Argyle Skirt',
          price: 920,
          originalPrice: 1150,
          discount: '20% OFF',
          image: '/images/products/embroidered_blouse.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000006',
      creatorHandle: '@omar_looks',
      creatorName: 'عمر لوكس • Omar Looks',
      avatar: '/images/reels/fashion_suede_jacket_thumb.jpg',
      videoBg: '/images/reels/fashion_suede_jacket.mp4',
      caption: isAr 
        ? 'ستايل كلاسيكي رجالي راقي: جاكيت شمواه بني فاخر مع بنطلون زيتي وحذاء سويد مريح 🤎 قمة الفخامة الهادية!' 
        : 'Refined menswear styling: Tobacco brown suede Harrington jacket with olive pleated trousers 🤎 #MenStyle',
      music: isAr ? 'جاز مصري حديث' : 'Modern Lo-Fi Beats',
      likes: 3120,
      comments: 87,
      saves: 610,
      products: [
        {
          id: 'p-fashion-suede-jacket',
          sku: 'TLK-JCK-08',
          title: isAr ? 'جاكيت شمواه كلاسيكي بني بسحاب' : 'Classic Suede Harrington Jacket',
          price: 2600,
          originalPrice: 3200,
          discount: '19% OFF',
          image: '/images/reels/fashion_suede_jacket_thumb.jpg'
        },
        {
          id: 'p-fashion-olive-pants',
          sku: 'TLK-PNT-04',
          title: isAr ? 'بنطلون كلاسيك زيتي واسع' : 'Pleated Olive Trousers',
          price: 980,
          originalPrice: 1250,
          discount: '21% OFF',
          image: '/images/products/linen_trousers.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000007',
      creatorHandle: '@karim.editorial',
      creatorName: 'كريم إيديتوريال • Karim Editorial',
      avatar: '/images/reels/fashion_vintage_watch_thumb.jpg',
      videoBg: '/images/reels/fashion_vintage_watch.mp4',
      caption: isAr 
        ? 'تفاصيل الساعة البرميلية الكلاسيكية بطلاء الذهب الوردي وأرقام رومانية مع سويتر صوف عاجي أنيق ⌚✨ تحفة معصم!' 
        : 'Vintage tonneau rose gold watch with roman dial & brown leather strap ⌚✨ Complete quiet luxury!',
      music: isAr ? 'عزف بيانو كلاسيكي' : 'Classical Elegance Sound',
      likes: 5420,
      comments: 231,
      saves: 1240,
      products: [
        {
          id: 'p-fashion-vintage-watch',
          sku: 'TBA-WTC-01',
          title: isAr ? 'ساعة يد كلاسيكية برميليّة بعقارب رومانية' : 'Vintage Tonneau Rose Gold Watch',
          price: 3400,
          originalPrice: 4200,
          discount: '19% OFF',
          image: '/images/reels/fashion_vintage_watch_thumb.jpg'
        },
        {
          id: 'p-fashion-leather-bracelet',
          sku: 'TBA-BRC-02',
          title: isAr ? 'سوار معصم جلد مضفر راقي' : 'Braided Leather Cuff Bracelet',
          price: 520,
          originalPrice: 650,
          discount: '20% OFF',
          image: '/images/brands/talieska_logo.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000008',
      creatorHandle: '@farida.atelier',
      creatorName: 'فريدة أتيليه • Farida Atelier',
      avatar: '/images/reels/fashion_woven_bag_thumb.jpg',
      videoBg: '/images/reels/fashion_woven_bag.mp4',
      caption: isAr 
        ? 'حقيبة الجلد المنسوجة يدوياً بحزام مضفر مع بنطلون كتان جملي واسع وميولز بيضاء 🤎 فخامة الحرف اليدوية المصرية!' 
        : 'Handcrafted woven leather bag with braided handle styled with camel linen trousers & white mules! 🤎',
      music: isAr ? 'أنغام ريترو هادية' : 'Aesthetic Retro Beats',
      likes: 3210,
      comments: 94,
      saves: 590,
      products: [
        {
          id: 'p-fashion-woven-bag',
          sku: 'KHC-BAG-02',
          title: isAr ? 'حقيبة جلد منسوجة يدوياً بمقبض مضفر' : 'Handcrafted Woven Leather Bag',
          price: 1950,
          originalPrice: 2500,
          discount: '22% OFF',
          image: '/images/reels/fashion_woven_bag_thumb.jpg'
        },
        {
          id: 'p-fashion-linen-pants-1',
          sku: 'TLK-LNN-01',
          title: isAr ? 'بنطلون كتان جملي واسع' : 'Wide Camel Linen Trousers',
          price: 880,
          originalPrice: 1100,
          discount: '20% OFF',
          image: '/images/products/linen_abaya.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000009',
      creatorHandle: '@huda_leather',
      creatorName: 'هدى ليذر • Huda Leather',
      avatar: '/images/reels/fashion_barrel_bag_thumb.jpg',
      videoBg: '/images/reels/fashion_barrel_bag.mp4',
      caption: isAr 
        ? 'حقائب البولينج الأسطوانية الجلد الطبيعي في 4 ألوان فخمة (بني كروكو، كونياك سويد، نبيذي، أسود) 👜 سعة مذهلة وخياطة دقيقة!' 
        : 'Luxury barrel bowling leather handbags in 4 rich finishes (croc dark brown, suede tan, deep wine, black) 👜',
      music: isAr ? 'إيقاع استوديو القاهرة' : 'Cairo Studio Lounge',
      likes: 2970,
      comments: 86,
      saves: 510,
      products: [
        {
          id: 'p-fashion-barrel-bag',
          sku: 'KHC-BAG-03',
          title: isAr ? 'حقيبة بولينج أسطوانية كلاسيك' : 'Barrel Bowling Handbag',
          price: 2100,
          originalPrice: 2600,
          discount: '19% OFF',
          image: '/images/reels/fashion_barrel_bag_thumb.jpg'
        },
        {
          id: 'p-fashion-leather-wallet',
          sku: 'KHC-WLT-01',
          title: isAr ? 'محفظة جلد طبيعي مدمجة' : 'Compact Leather Cardholder',
          price: 490,
          originalPrice: 650,
          discount: '25% OFF',
          image: '/images/products/copper_lantern.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000010',
      creatorHandle: '@youssef_cairo',
      creatorName: 'يوسف ستايل • Youssef Cairo',
      avatar: '/images/reels/fashion_cuban_shirt_thumb.jpg',
      videoBg: '/images/reels/fashion_cuban_shirt.mp4',
      caption: isAr 
        ? 'قميص كوبي بنقشة ريترو مع بنطلون كتان أسود ونظارة كلاسيك 🕶️ إطلالة شبابية رايقة للصيف!' 
        : 'Retro print Cuban collar shirt styled with black linen trousers 🕶️ Smooth summer aesthetic! #MenSummer',
      music: isAr ? 'فانك مصري هادي' : 'Smooth Funk Grooves',
      likes: 2840,
      comments: 79,
      saves: 430,
      products: [
        {
          id: 'p-fashion-cuban-shirt',
          sku: 'TLK-SHT-06',
          title: isAr ? 'قميص كوبي بنقشة ريترو' : 'Retro Print Cuban Collar Shirt',
          price: 850,
          originalPrice: 1100,
          discount: '22% OFF',
          image: '/images/reels/fashion_cuban_shirt_thumb.jpg'
        },
        {
          id: 'p-fashion-black-trousers',
          sku: 'TLK-TRS-09',
          title: isAr ? 'بنطلون كتان أسود صيفي' : 'Black Linen Summer Trousers',
          price: 790,
          originalPrice: 990,
          discount: '20% OFF',
          image: '/images/products/linen_trousers.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000011',
      creatorHandle: '@beauty.by.nada',
      creatorName: 'ندى بيوتي • Nada Beauty',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      videoBg: '/images/reels/sheglam_mascara.mp4',
      caption: isAr 
        ? 'ريفيو جديد لماسكارا شيجلام! رهيبة بتطول وتكثف الرموش، ومعاها مزيل خاص بيها بيشيلها في ثواني! ✨👀 #Sheglam #ماسكارا #تجميل' 
        : 'Testing the new SHEGLAM Ultra Lash Lift Mascara & Easy Lash Removal! Amazing results! ✨👀 #Sheglam #Makeup',
      music: isAr ? 'تريند بيوتي • تيك توك' : 'Trending Beauty Sound',
      likes: 4520,
      comments: 124,
      saves: 890,
      products: [
        {
          id: 'p-sheglam-1',
          sku: 'SHG-MASC-01',
          title: isAr ? 'ماسكارا شيجلام لتكثيف الرموش' : 'SHEGLAM Ultra Lash Lift Mascara',
          price: 350,
          originalPrice: 400,
          discount: '12% OFF',
          image: '/images/reels/sheglam_mascara_thumb.jpg'
        },
        {
          id: 'p-sheglam-1-remover',
          sku: 'SHG-REM-01',
          title: isAr ? 'مزيل مكياج ومسكارا سريع' : 'SHEGLAM Easy Lash Removal',
          price: 150,
          originalPrice: 200,
          discount: '25% OFF',
          image: '/images/reels/sheglam_mascara_thumb.jpg'
        }
      ]
    },
    {
      id: 'ee000000-0000-0000-0000-000000000012',
      creatorHandle: '@makeup.with.sara',
      creatorName: 'سارة ميكأب • Sara Makeup',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      videoBg: '/images/reels/sheglam_liptint.mp4',
      caption: isAr 
        ? 'سواتش لدرجات مرطب ومورد الشفاه والخدود من شيجلام 🍒 درجات تجنن (Cherry Bark, Plum Sauce, Bare Blush) ثبات وترطيب خيالي! 💋 #مكياج #شيجلام' 
        : 'SHEGLAM Jelly Lip Tint & Blusher swatches 🍒 Gorgeous shades (Cherry Bark, Plum Sauce) and amazing hydration! 💋 #LipTint #Sheglam',
      music: isAr ? 'موسيقى ريلز هادية' : 'Chill Aesthetic Vibes',
      likes: 3870,
      comments: 98,
      saves: 650,
      products: [
        {
          id: 'p-sheglam-2',
          sku: 'SHG-LIP-02',
          title: isAr ? 'ملمع ومورد شفاه وبلاشر شيجلام' : 'SHEGLAM Jelly Lip Tint & Blusher',
          price: 280,
          originalPrice: 350,
          discount: '20% OFF',
          image: '/images/reels/sheglam_liptint_thumb.jpg'
        },
        {
          id: 'p-sheglam-3-brush',
          sku: 'SHG-BRS-01',
          title: isAr ? 'فرشاة دمج البلاشر' : 'SHEGLAM Blending Brush',
          price: 120,
          originalPrice: 180,
          discount: '33% OFF',
          image: '/images/reels/sheglam_liptint_thumb.jpg'
        }
      ]
    }
  ];

const formatCount = (count) => {
  const num = Number(count) || 0;
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 10_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  if (num >= 1_000) {
    return num.toLocaleString();
  }
  return num.toString();
};

export default function DiscoverReels() {
  const { openQuickBuy, openProductDetail, products, setActiveTab, navigateToProfile, language, user, role, setIsAuthModalOpen } = useApp();
  const isAr = language === 'ar';
  const defaultReels = useMemo(() => getDefaultReels(isAr), [isAr]);

  const [reelsList, setReelsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);

  const currentReel = reelsList[currentReelIndex] || reelsList[0] || defaultReels[0] || null;

  const [activeTabSub, setActiveTabSub] = useState('foryou');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(4820);
  const [isSaved, setIsSaved] = useState(false);
  const [savesCount, setSavesCount] = useState(1140);
  const [commentsCount, setCommentsCount] = useState(218);
  const [isFollowed, setIsFollowed] = useState(false);
  const reelMountTime = useRef(Date.now());

  useEffect(() => {
    const fetchPersonalizedReels = async () => {
      setIsLoading(true);
      try {
        const feedResult = await feedService.getPersonalizedFeed({
          userId: user?.id || null,
          tab: activeTabSub,
          cursor: 0,
          limit: 20,
          fallbackReels: defaultReels
        });

        if (feedResult && feedResult.items && feedResult.items.length > 0) {
          const processedReels = feedResult.items.map(item => {
            const r = item.reel || item;
            if (typeof r.product === 'string') {
              try { r.product = JSON.parse(r.product); } catch(e) {}
            }
            if (typeof r.products === 'string') {
              try { r.products = JSON.parse(r.products); } catch(e) {}
            }
            return r;
          });
          setReelsList(processedReels);
        } else {
          setReelsList(defaultReels);
        }
      } catch (err) {
        console.warn("Failed to load personalized reels, using fallback", err);
        setReelsList(defaultReels);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPersonalizedReels();
  }, [defaultReels, activeTabSub, user?.id]);

  // Sync likes, saves, comments counts, follow status, and impression tracking when current reel changes
  useEffect(() => {
    if (currentReel?.id) {
      reelMountTime.current = Date.now();
      eventTracker.trackReelImpression(currentReel, currentReelIndex);

      // Fetch live DB engagement metrics (likes, saves, comments counts + user state)
      socialService.engagement.getReelEngagement(currentReel.id, user?.id)
        .then(eng => {
          if (eng) {
            setIsLiked(Boolean(eng.isLiked));
            setIsSaved(Boolean(eng.isSaved));
            setLikesCount(eng.likesCount ?? (Number(currentReel.likes) || 0));
            setSavesCount(eng.savesCount ?? (Number(currentReel.saves) || 0));
            setCommentsCount(eng.commentsCount ?? (Number(currentReel.comments) || 0));
          }
        })
        .catch(err => {
          console.warn("Error fetching reel engagement from database:", err);
          setLikesCount(Number(currentReel.likes) || 0);
          setSavesCount(Number(currentReel.saves) || 0);
          setCommentsCount(Number(currentReel.comments) || 0);
        });

      const creatorTarget = currentReel.creatorId || currentReel.creatorHandle;
      if (creatorTarget) {
        socialService.follow.isFollowing(creatorTarget, user?.id).then(followed => {
          setIsFollowed(followed);
        });
      }
    }
  }, [currentReel?.id, currentReelIndex, user?.id]);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isShopTheLookOpen, setIsShopTheLookOpen] = useState(false);
  const [desktopViewMode, setDesktopViewMode] = useState('player'); // 'player' or 'grid'
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  
  // Gesture & Swipe Tracking
  const [touchStartY, setTouchStartY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastScrollTime = useRef(0);

  // Shop the Look Drawer Slide-Down Gesture State
  const [drawerDragY, setDrawerDragY] = useState(0);
  const [isDrawerDragging, setIsDrawerDragging] = useState(false);
  const drawerStartY = useRef(0);
  const currentDragY = useRef(0);
  const drawerListRef = useRef(null);
  const listTouchStartY = useRef(0);
  const isListDragging = useRef(false);

  // Close Shop the Look drawer helper
  const closeShopTheLook = () => {
    setIsShopTheLookOpen(false);
    setDrawerDragY(0);
    currentDragY.current = 0;
    setIsDrawerDragging(false);
  };

  const handleDrawerPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    drawerStartY.current = e.clientY;
    currentDragY.current = 0;
    setIsDrawerDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDrawerPointerMove = (e) => {
    if (!isDrawerDragging) return;
    const deltaY = e.clientY - drawerStartY.current;
    if (deltaY > 0) {
      currentDragY.current = deltaY;
      setDrawerDragY(deltaY);
    } else {
      currentDragY.current = 0;
      setDrawerDragY(0);
    }
  };

  const handleDrawerPointerUp = (e) => {
    if (!isDrawerDragging) return;
    setIsDrawerDragging(false);
    try {
      if (e.currentTarget?.hasPointerCapture?.(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (err) {}

    if (currentDragY.current > 70) {
      closeShopTheLook();
    } else {
      setDrawerDragY(0);
      currentDragY.current = 0;
    }
  };

  const handleListTouchStart = (e) => {
    listTouchStartY.current = e.touches[0].clientY;
    isListDragging.current = false;
  };

  const handleListTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - listTouchStartY.current;

    if (drawerListRef.current && drawerListRef.current.scrollTop <= 0 && deltaY > 0) {
      isListDragging.current = true;
      setIsDrawerDragging(true);
      currentDragY.current = deltaY;
      setDrawerDragY(deltaY);
    } else if (isListDragging.current && deltaY > 0) {
      currentDragY.current = deltaY;
      setDrawerDragY(deltaY);
    }
  };

  const handleListTouchEnd = () => {
    if (isListDragging.current) {
      isListDragging.current = false;
      setIsDrawerDragging(false);
      if (currentDragY.current > 70) {
        closeShopTheLook();
      } else {
        setDrawerDragY(0);
        currentDragY.current = 0;
      }
    }
  };

  // Three Dots Options Menu & Backend States
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('inappropriate');
  const [reportDetails, setReportDetails] = useState('');
  const [isEditReelModalOpen, setIsEditReelModalOpen] = useState(false);
  const [editCaption, setEditCaption] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Load interactive comments when drawer opens or active reel changes
  useEffect(() => {
    if (currentReel?.id) {
      socialService.comments.getComments(currentReel.id).then(fetched => {
        setCommentsList(fetched);
      });
    }
  }, [currentReel?.id, isCommentsOpen]);

  const handlePostComment = async (e) => {
    if (e) e.preventDefault();
    if (!newCommentText.trim() || !currentReel?.id) return;

    const authorName = user?.name || user?.profile?.name || user?.email?.split('@')[0] || (isAr ? 'متسوق مصري' : 'Shopper');
    const authorAvatar = user?.avatar_url || (user?.role === 'merchant' ? '/images/brands/talieska_logo.jpg' : '/images/reels/reel_1.jpg');
    const authorRole = user?.role || 'buyer';

    const newComment = await socialService.postComment(currentReel, {
      userId: user?.id || null,
      userName: authorName,
      userAvatar: authorAvatar,
      userRole: authorRole,
      text: newCommentText.trim()
    });

    setCommentsList(prev => [newComment, ...prev]);
    setNewCommentText('');
    setCommentsCount(prev => prev + 1);

    // Dynamically increment reel comments count in state
    setReelsList(prev => prev.map(r => r.id === currentReel.id ? { ...r, comments: (Number(r.comments) || 0) + 1 } : r));
    showToast(isAr ? 'تم نشر تعليقك بنجاح! 💬' : 'Comment posted successfully! 💬');
  };

  const handleLikeCommentItem = async (commentId) => {
    if (!currentReel?.id) return;
    await socialService.comments.likeComment(currentReel.id, commentId, user?.id);
    setCommentsList(prev => prev.map(c => c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c));
  };

  const handleDeleteCommentItem = async (commentId) => {
    if (!currentReel?.id) return;
    await socialService.comments.deleteComment(currentReel.id, commentId);
    setCommentsList(prev => prev.filter(c => c.id !== commentId));
    setCommentsCount(prev => Math.max(0, prev - 1));
    setReelsList(prev => prev.map(r => r.id === currentReel.id ? { ...r, comments: Math.max(0, (Number(r.comments) || 1) - 1) } : r));
    showToast(isAr ? 'تم حذف التعليق' : 'Comment deleted');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleShareLink = async (e) => {
    if (e) e.stopPropagation();
    if (!currentReel) return;
    const url = `${window.location.origin}${window.location.pathname}?reel=${currentReel?.id || ''}`;
    try {
      await navigator.clipboard.writeText(url);
      await socialService.shareReel(currentReel, 'copy_link', user?.id);
      showToast(isAr ? 'تم نسخ رابط الفيديو إلى الحافظة 📋' : 'Reel link copied to clipboard! 📋');
    } catch (err) {
      showToast(isAr ? 'تم نسخ الرابط بنجاح' : 'Link copied');
    }
    setIsOptionsMenuOpen(false);
  };

  const handleToggleSaveReel = async (e) => {
    if (e) e.stopPropagation();
    if (!currentReel) return;

    // Optimistic UI toggle
    const prevSaved = isSaved;
    const optimisticSaved = !prevSaved;
    setIsSaved(optimisticSaved);
    setSavesCount(prev => Math.max(0, prev + (optimisticSaved ? 1 : -1)));

    try {
      const res = await socialService.saveReel(currentReel, user?.id);
      const newSaved = typeof res === 'object' ? res.isSaved : Boolean(res);
      setIsSaved(newSaved);
      if (typeof res === 'object' && typeof res.savesCount === 'number') {
        setSavesCount(res.savesCount);
      }
      showToast(
        newSaved 
          ? (isAr ? 'تم حفظ الفيديو في المفضلة بنجاح 📌' : 'Saved to favorites! 📌')
          : (isAr ? 'تمت إزالة الفيديو من المفضلة' : 'Removed from favorites')
      );
    } catch (err) {
      // Revert on error
      setIsSaved(prevSaved);
      setSavesCount(prev => Math.max(0, prev + (prevSaved ? 1 : -1)));
    }
    setIsOptionsMenuOpen(false);
  };

  const handleLikeReel = async (e) => {
    if (e) e.stopPropagation();
    if (!currentReel) return;

    // Optimistic UI toggle
    const prevLiked = isLiked;
    const optimisticLiked = !prevLiked;
    setIsLiked(optimisticLiked);
    setLikesCount(prev => Math.max(0, prev + (optimisticLiked ? 1 : -1)));

    try {
      const res = await socialService.likeReel(currentReel, user?.id);
      setIsLiked(res.isLiked);
      if (typeof res.likesCount === 'number') {
        setLikesCount(res.likesCount);
      } else {
        setLikesCount(prev => prev + res.likesDelta);
      }
    } catch (err) {
      // Revert on error
      setIsLiked(prevLiked);
      setLikesCount(prev => Math.max(0, prev + (prevLiked ? 1 : -1)));
    }
  };

  const handleFollowCreator = async (e) => {
    if (e) e.stopPropagation();
    if (!currentReel) return;
    const targetId = currentReel.creatorId || currentReel.creatorHandle;
    const newFollowed = await socialService.toggleFollow(targetId, user?.id, currentReel.creatorHandle);
    setIsFollowed(newFollowed);
    showToast(newFollowed ? (isAr ? 'تمت المتابعة بنجاح ✨' : 'Followed creator! ✨') : (isAr ? 'تم إلغاء المتابعة' : 'Unfollowed'));
  };

  const handleHideReel = async () => {
    if (!currentReel) return;
    await eventTracker.trackNotInterested(currentReel);
    await socialService.reels.hideReel(currentReel.id);
    const updated = reelsList.filter(r => r.id !== currentReel.id);
    setReelsList(updated);
    if (currentReelIndex >= updated.length) {
      setCurrentReelIndex(Math.max(0, updated.length - 1));
    }
    showToast(isAr ? 'تم إخفاء هذا المحتوى من خلاصتك 👍' : 'Video hidden from your feed 👍');
    setIsOptionsMenuOpen(false);
  };

  const handleSubmitReport = async (e) => {
    if (e) e.preventDefault();
    if (!currentReel) return;
    await eventTracker.trackReportContent(currentReel, reportReason);
    await socialService.reels.reportReel(currentReel.id, reportReason, reportDetails);
    setIsReportModalOpen(false);
    setIsOptionsMenuOpen(false);
    setReportDetails('');
    showToast(isAr ? 'شكراً لك، تم إرسال البلاغ وسيقوم فريق المراجعة بفحصه فوراً 🛡️' : 'Report submitted successfully. We will review it shortly. 🛡️');
  };

  const handleSaveEditReel = async (e) => {
    if (e) e.preventDefault();
    if (!currentReel) return;
    await socialService.reels.updateReel(currentReel.id, { caption: editCaption });
    setReelsList(prev => prev.map(r => r.id === currentReel.id ? { ...r, caption: editCaption } : r));
    setIsEditReelModalOpen(false);
    setIsOptionsMenuOpen(false);
    showToast(isAr ? 'تم حفظ تعديلات الفيديو بنجاح ✅' : 'Reel updated successfully ✅');
  };

  const handleDeleteReel = async () => {
    if (!currentReel) return;
    if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الفيديو نهائياً؟' : 'Are you sure you want to delete this reel?')) {
      await socialService.reels.deleteReel(currentReel.id);
      const updated = reelsList.filter(r => r.id !== currentReel.id);
      setReelsList(updated);
      if (currentReelIndex >= updated.length) {
        setCurrentReelIndex(Math.max(0, updated.length - 1));
      }
      setIsOptionsMenuOpen(false);
      showToast(isAr ? 'تم حذف الفيديو بنجاح 🗑️' : 'Reel deleted successfully 🗑️');
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Navigation functions
  const handleNextReel = () => {
    if (isTransitioning) return;
    const watchMs = Date.now() - reelMountTime.current;
    if (watchMs < 2500 && currentReel) {
      eventTracker.trackReelSkip(currentReel, watchMs);
    }
    reelMountTime.current = Date.now();
    setIsTransitioning(true);
    setCurrentReelIndex((prev) => (prev + 1) % reelsList.length);
    setIsLiked(false);
    setIsSaved(false);
    setIsCaptionExpanded(false);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevReel = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentReelIndex((prev) => (prev - 1 + reelsList.length) % reelsList.length);
    setIsLiked(false);
    setIsSaved(false);
    setIsCaptionExpanded(false);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Mouse wheel handling for desktop swipe
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 500) return;
    
    if (e.deltaY > 30) {
      handleNextReel();
      lastScrollTime.current = now;
    } else if (e.deltaY < -30) {
      handlePrevReel();
      lastScrollTime.current = now;
    }
  };

  // Mobile Touch handling
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!touchStartY || !isDragging) return;
    const currentY = e.touches[0].clientY;
    let diff = currentY - touchStartY;
    // Rubber-band resistance at list boundaries
    if ((currentReelIndex === 0 && diff > 0) || (currentReelIndex === reelsList.length - 1 && diff < 0)) {
      diff = diff * 0.35;
    }
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!touchStartY) return;
    if (dragOffset < -60) {
      handleNextReel();
    } else if (dragOffset > 60) {
      handlePrevReel();
    }
    setTouchStartY(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  // Desktop Mouse Drag Handling
  const handleMouseDown = (e) => {
    setDragStartY(e.clientY);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    let diff = e.clientY - dragStartY;
    // Rubber-band resistance at list boundaries
    if ((currentReelIndex === 0 && diff > 0) || (currentReelIndex === reelsList.length - 1 && diff < 0)) {
      diff = diff * 0.35;
    }
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset < -70) {
      handleNextReel();
    } else if (dragOffset > 70) {
      handlePrevReel();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const renderReelItem = (reel, index) => {
    const isActive = index === currentReelIndex;
    const isAdjacent = Math.abs(index - currentReelIndex) <= 1;
    return (
      <div className="w-full h-full relative" key={reel.id}>
        <ReelVideoPlayer 
          reel={reel} 
          isActive={isActive} 
          isAdjacent={isAdjacent}
          isGlobalMuted={isGlobalMuted} 
          toggleMute={() => setIsGlobalMuted(!isGlobalMuted)} 
        />
        
        {/* Right Sidebar Interactions */}
        <div className="absolute right-4 bottom-6 flex flex-col gap-6 z-20 pointer-events-none items-center">
          <div className="flex flex-col items-center gap-1">
            <button 
              className="pointer-events-auto cursor-pointer"
              onClick={handleLikeReel}
              aria-label="Like"
            >
              <div className="w-[42px] h-[42px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110">
                <span className={`material-symbols-outlined text-[24px] transition-colors ${(isActive ? isLiked : false) ? 'text-[#d00000] drop-shadow-md' : 'text-white'}`} style={{ fontVariationSettings: (isActive ? isLiked : false) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </div>
            </button>
            <span className="text-white text-[12px] font-bold drop-shadow-md">{formatCount(isActive ? likesCount : reel.likes)}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="pointer-events-auto cursor-pointer" onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(true); }} aria-label="Comments">
              <div className="w-[42px] h-[42px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110">
                <span className="material-symbols-outlined text-[24px] text-white">chat_bubble</span>
              </div>
            </button>
            <span className="text-white text-[12px] font-bold drop-shadow-md">{formatCount(isActive ? commentsCount : reel.comments)}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button 
              className="pointer-events-auto cursor-pointer"
              onClick={handleToggleSaveReel}
              aria-label="Save"
            >
              <div className="w-[42px] h-[42px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110">
                <span className={`material-symbols-outlined text-[24px] ${(isActive ? isSaved : false) ? 'text-yellow-400' : 'text-white'}`} style={{ fontVariationSettings: (isActive ? isSaved : false) ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
              </div>
            </button>
            <span className="text-white text-[12px] font-bold drop-shadow-md">{formatCount(isActive ? savesCount : reel.saves)}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="pointer-events-auto cursor-pointer" onClick={handleShareLink}>
              <div className="w-[42px] h-[42px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110">
                <span className="material-symbols-outlined text-[24px] text-white">share</span>
              </div>
            </button>
            <span className="text-white text-[12px] font-bold drop-shadow-md">{isAr ? 'مشاركة' : 'Share'}</span>
          </div>
          
          <div className="w-[34px] h-[34px] mt-1 rounded-full bg-slate-900 border-[6px] border-white/20 flex items-center justify-center shadow-lg animate-spin" style={{ animationDuration: '4s' }}>
            <img src={reel.avatar} className="w-full h-full rounded-full object-cover" />
          </div>
        </div>

        <div className="absolute bottom-6 left-4 right-[60px] flex flex-col justify-end space-y-3 z-20 pointer-events-auto">
            {/* Floating Shop Action: Bag Icon Circle on the Left + Product Pill */}
            {(() => {
              const allProducts = (reel.products && reel.products.length > 0)
                ? reel.products
                : (reel.product ? [reel.product] : []);
              
              if (allProducts.length === 0) return null;

              const handleShopAction = (e) => {
                e.stopPropagation();
                if (allProducts.length > 1) {
                  setIsShopTheLookOpen(true);
                  eventTracker.trackEvent('shop_the_look_open', {
                    entityType: 'reel',
                    reelId: reel.id,
                    creatorId: reel.creatorId
                  });
                } else {
                  const singleProd = allProducts[0];
                  const matched = products?.find(p => p.id === singleProd?.id) || singleProd;
                  if (matched) {
                    attributionService.registerTouchpoint({
                      reelId: reel.id,
                      productId: matched.id,
                      creatorId: reel.creatorId,
                      merchantId: matched.merchantId || matched.merchant_id,
                      userId: user?.id
                    });
                    eventTracker.trackQuickBuyOpen(matched, reel);
                    openQuickBuy(matched);
                  }
                }
              };

              return (
                <div className="inline-flex items-center gap-2 w-fit animate-fade-in" style={{ direction: 'ltr' }}>
                  {/* Shop Now Bag Icon Circle (Beside the pill on the left) */}
                  <button
                    onClick={handleShopAction}
                    className="w-10 h-10 rounded-full bg-[#cc0000] text-white flex items-center justify-center shadow-lg hover:brightness-110 active:scale-90 transition-all shrink-0 cursor-pointer border border-white/30"
                    title={isAr ? 'تسوق الآن' : 'Shop Now'}
                  >
                    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  </button>

                  {/* Product Pill */}
                  <div 
                    onClick={handleShopAction}
                    dir={isAr ? 'rtl' : 'ltr'}
                    className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-2xl py-1.5 px-3 shadow-lg cursor-pointer hover:bg-white active:scale-95 transition-transform"
                  >
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      {allProducts.slice(0, 3).map((p, i) => (
                        <img key={i} src={p.image} alt={p.title || ''} className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs shrink-0" />
                      ))}
                    </div>
                    <div className="flex flex-col text-left rtl:text-right">
                      <span className="text-[11px] font-bold text-slate-900 leading-tight line-clamp-1 max-w-[130px]">
                        {allProducts.length > 1 ? (isAr ? 'تسوق التنسيق بالكامل' : 'Shop Complete Look') : allProducts[0]?.title}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 leading-tight">
                        {allProducts.length > 1 
                          ? `(${allProducts.length} ${isAr ? 'عناصر' : 'items'})`
                          : (allProducts[0]?.price ? `${allProducts[0].price} ${isAr ? 'ج.م' : 'EGP'}` : (isAr ? 'عرض المنتج' : 'View'))}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-600 ml-0.5 rtl:mr-0.5 rtl:ml-0">
                      {isAr ? 'chevron_left' : 'chevron_right'}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Creator Info */}
            <div className={`space-y-1 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center gap-2">
                <div 
                  className="flex items-center gap-1.5 cursor-pointer w-fit"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToProfile(reel.creatorHandle);
                  }}
                >
                  <span className="font-bold text-[15px] text-white drop-shadow-md hover:underline">{reel.creatorHandle}</span>
                  <span className="material-symbols-outlined text-[16px] text-blue-500 bg-white rounded-full">check_circle</span>
                </div>
                <button
                  onClick={handleFollowCreator}
                  className={`px-3 py-0.5 rounded-full text-[11px] font-bold transition-all border cursor-pointer ${
                    isFollowed 
                      ? 'bg-white/20 text-white border-white/30 backdrop-blur-sm' 
                      : 'bg-[#d00000] text-white border-transparent shadow-sm hover:brightness-110'
                  }`}
                >
                  {isFollowed ? (isAr ? 'مُتابع' : 'Following') : (isAr ? 'متابعة' : 'Follow')}
                </button>
              </div>
              
              <div 
                className="cursor-pointer space-y-1"
                onClick={(e) => { e.stopPropagation(); setIsCaptionExpanded(!isCaptionExpanded); }}
              >
                <div className={`text-[13px] text-white drop-shadow-md leading-snug transition-all ${isCaptionExpanded ? '' : 'line-clamp-1'}`}>
                  {reel.caption}
                </div>
                {!isCaptionExpanded && (
                  <div className="font-bold text-white/90 text-[12px] drop-shadow-md hover:underline">{isAr ? 'عرض المزيد' : 'more'}</div>
                )}
                {isCaptionExpanded && (
                  <p className="text-[13px] font-bold text-white drop-shadow-md animate-fade-in">
                    #EgyptianFashion #OOTD #Style
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
    );
  };

  if (isLoading || reelsList.length === 0) return <div className="w-full h-full bg-black flex items-center justify-center text-white"><span className="material-symbols-outlined animate-spin text-4xl">sync</span></div>;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative bg-black md:bg-[#121212]">
      {/* Top Desktop Controls Bar (Switch View & Swiping Hint) */}
      <div className="hidden md:flex w-full max-w-[1780px] px-8 py-3 items-center justify-between text-white/80 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDesktopViewMode('player')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              desktopViewMode === 'player'
                ? 'bg-[#d00000] text-white shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">play_circle</span>
            <span>{isAr ? 'مشغل الريلز (سحب عمودي)' : 'Interactive Reels (Swipe Mode)'}</span>
          </button>
          <button
            onClick={() => setDesktopViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              desktopViewMode === 'grid'
                ? 'bg-[#d00000] text-white shadow-md'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            <span>{isAr ? 'شبكة الفيديوهات' : 'Feed Grid'}</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">mouse</span>
            {isAr ? 'استخدم عجلة الفأرة أو اسحب للأعلى/الأسفل' : 'Scroll wheel or drag up/down to swipe'}
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">keyboard</span>
            {isAr ? 'الأسهم ↑ ↓ للتبديل السريع' : 'Use ↑ ↓ keys'}
          </span>
        </div>
      </div>

      {!isMobile && (
        <>
        {/* 1. DESKTOP GRID VIEW (when toggled to Grid) */}
      {desktopViewMode === 'grid' ? (
        <div className="hidden md:block w-full max-w-[1780px] mx-auto px-8 py-4 overflow-y-auto flex-1 min-h-0">
          <div className="rounded-3xl border border-gray-800 bg-white shadow-xl overflow-hidden">
            <DesktopFeed />
          </div>
        </div>
      ) : (
        /* 2. DESKTOP INTERACTIVE REELS CONTAINER (Center 9:16 Aspect with Vertical Swiping) */
        <div className="hidden md:flex items-center justify-center w-full py-4 relative flex-1 min-h-0">
          {/* Ambient blurred backdrop of current reel */}
          <div 
            className="absolute inset-0 opacity-20 filter blur-3xl bg-cover bg-center pointer-events-none transition-all duration-700"
            style={{ backgroundImage: `url(${currentReel?.videoBg || ''})` }}
          />

          {/* Centered Phone Frame for Vertical Reels */}
          <div 
            className="w-full max-w-[420px] aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 bg-black relative flex flex-col z-10 cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setIsDragging(false); setDragOffset(0); }}
          >
            {/* Top Floating Action Bar for Desktop Frame (Brand, Search, Three Dots Options) */}
            <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 via-black/25 to-transparent text-white pt-3 pb-6 px-4 z-40 pointer-events-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('shop');
                  }}
                  className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all text-white flex items-center justify-center border border-white/10 active:scale-95 cursor-pointer"
                  title={isAr ? 'البحث والتسوق' : 'Search & Shop'}
                >
                  <span className="material-symbols-outlined text-[20px] drop-shadow-md">search</span>
                </button>
                
                {/* Three Dots Button */}
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setEditCaption(currentReel?.caption || '');
                    setIsOptionsMenuOpen(true); 
                  }}
                  className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all text-white flex items-center justify-center border border-white/10 active:scale-95 cursor-pointer"
                  title={isAr ? 'خيارات الفيديو' : 'More options'}
                >
                  <span className="material-symbols-outlined text-[22px] drop-shadow-md">more_vert</span>
                </button>
              </div>

              {/* Algorithm Feed Tabs */}
              <div className="flex items-center gap-4 text-xs font-bold pointer-events-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTabSub('foryou');
                    setCurrentReelIndex(0);
                  }}
                  className={`pb-1 transition-all cursor-pointer ${
                    activeTabSub === 'foryou'
                      ? 'text-white border-b-2 border-[#d00000] drop-shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isAr ? 'لك' : 'For You'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTabSub('following');
                    setCurrentReelIndex(0);
                  }}
                  className={`pb-1 transition-all cursor-pointer ${
                    activeTabSub === 'following'
                      ? 'text-white border-b-2 border-[#d00000] drop-shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isAr ? 'أتابعهم' : 'Following'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTabSub('trending');
                    setCurrentReelIndex(0);
                  }}
                  className={`pb-1 transition-all cursor-pointer ${
                    activeTabSub === 'trending'
                      ? 'text-white border-b-2 border-[#d00000] drop-shadow-md'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {isAr ? 'الرائج' : 'Trending'}
                </button>
              </div>

              <div 
                className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('shop');
                }}
              >
                <EgLogo className="w-8 h-8 drop-shadow-md" color="#d00000" />
              </div>
            </div>

            {/* Smooth Sliding Reel Container with Zero-Lag Dragging */}
            <div 
              className={`w-full h-full gpu-layer ${
                isDragging 
                  ? 'transition-none' 
                  : 'transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]'
              }`}
              style={{
                transform: `translateY(calc(-${currentReelIndex * 100}% + ${dragOffset}px))`,
              }}
            >
              {reelsList.map((reel, idx) => renderReelItem(reel, idx))}
            </div>
          </div>
        </div>
      )}

        </>
      )}
      {/* 3. MOBILE FULL-SCREEN VIEW (Native Vertical Swipe Experience) */}
      {isMobile && (
      <div 
        className="md:hidden relative w-full h-full pb-14 bg-black text-white flex flex-col overflow-hidden select-none font-sans mx-auto max-w-[440px]"
      >
        {/* Custom Mobile Header (Transparent Overlay) */}
        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/70 via-black/25 to-transparent text-white pt-safe z-40 pointer-events-auto">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('shop');
                }}
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all text-white flex items-center justify-center border border-white/10 active:scale-95 cursor-pointer"
                title={isAr ? 'البحث والتسوق' : 'Search & Shop'}
              >
                <span className="material-symbols-outlined text-[20px] drop-shadow-md">search</span>
              </button>
              <button 
                className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-all text-white flex items-center justify-center border border-white/10 active:scale-95 cursor-pointer" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setEditCaption(currentReel?.caption || '');
                  setIsOptionsMenuOpen(true); 
                }}
                title={isAr ? 'خيارات الفيديو' : 'More options'}
              >
                <span className="material-symbols-outlined text-[22px] drop-shadow-md">more_vert</span>
              </button>
            </div>

            {/* Mobile Algorithm Feed Tabs */}
            <div className="flex items-center gap-3 text-xs font-bold pointer-events-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTabSub('foryou');
                  setCurrentReelIndex(0);
                }}
                className={`pb-1 transition-all cursor-pointer ${
                  activeTabSub === 'foryou'
                    ? 'text-white border-b-2 border-[#d00000] drop-shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'لك' : 'For You'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTabSub('following');
                  setCurrentReelIndex(0);
                }}
                className={`pb-1 transition-all cursor-pointer ${
                  activeTabSub === 'following'
                    ? 'text-white border-b-2 border-[#d00000] drop-shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'أتابعهم' : 'Following'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTabSub('trending');
                  setCurrentReelIndex(0);
                }}
                className={`pb-1 transition-all cursor-pointer ${
                  activeTabSub === 'trending'
                    ? 'text-white border-b-2 border-[#d00000] drop-shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {isAr ? 'الرائج' : 'Trending'}
              </button>
            </div>

            <div 
              className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('shop');
              }}
            >
              <EgLogo className="w-8 h-8 drop-shadow-md" color="#d00000" />
            </div>
          </div>
        </div>

        {/* Swipeable Video Area */}
        <div 
          className="relative flex-1 w-full overflow-hidden"
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => { setIsDragging(false); setDragOffset(0); }}
        >
          {/* Smooth Sliding Reels Container with Zero-Lag Dragging */}
          <div 
            className={`w-full h-full gpu-layer flex flex-col ${
              isDragging 
                ? 'transition-none' 
                : 'transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]'
            }`}
            style={{
              transform: `translateY(calc(-${currentReelIndex * 100}% + ${dragOffset}px))`,
            }}
          >
            {reelsList.map((reel, idx) => (
              <div key={reel.id} className="w-full h-full shrink-0">
                {renderReelItem(reel, idx)}
              </div>
            ))}
          </div>

        {/* Swipe Up Hint Badge (Fades after interaction) */}
        {currentReelIndex === 0 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[11px] font-medium flex items-center gap-1 animate-bounce pointer-events-none">
            <span className="material-symbols-outlined text-[14px]">swipe_up</span>
            <span>{isAr ? 'اسحب للأعلى للفيديو التالي' : 'Swipe up for next'}</span>
          </div>
        )}
        </div>
      </div>

      )}

      {/* Shop the Look Backdrop Overlay */}
      {isShopTheLookOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity animate-fade-in"
          onClick={closeShopTheLook}
        />
      )}

      {/* Shop the Look Drawer with Slide Down to Cancel */}
      <div 
        className={`fixed md:absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 ${
          isDrawerDragging ? 'transition-none' : 'transition-transform duration-300 ease-out'
        }`}
        style={{ 
          height: '55%',
          transform: isShopTheLookOpen 
            ? `translateY(${Math.max(0, drawerDragY)}px)` 
            : 'translateY(100%)'
        }}
      >
        <div className="w-full h-full flex flex-col relative text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
          {/* Top Slide Down Drag Zone & Handle */}
          <div 
            className="w-full pt-3 pb-1 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none hover:bg-gray-50/70 transition-colors rounded-t-3xl"
            onPointerDown={handleDrawerPointerDown}
            onPointerMove={handleDrawerPointerMove}
            onPointerUp={handleDrawerPointerUp}
            onPointerCancel={handleDrawerPointerUp}
            title={isAr ? 'اسحب للأسفل للإلغاء' : 'Slide down to cancel'}
          >
            <div className="w-14 h-1.5 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors" />
            <span className="text-[10px] text-gray-400 font-medium mt-1 select-none flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[13px]">keyboard_arrow_down</span>
              {isAr ? 'اسحب للأسفل للإلغاء' : 'Slide down to cancel'}
            </span>
          </div>
          
          <div 
            className="flex items-center justify-between px-4 pb-3 pt-1 border-b border-gray-100 cursor-grab active:cursor-grabbing select-none touch-none"
            onPointerDown={handleDrawerPointerDown}
            onPointerMove={handleDrawerPointerMove}
            onPointerUp={handleDrawerPointerUp}
            onPointerCancel={handleDrawerPointerUp}
          >
            <div>
              <h3 className="font-black text-lg">🛍️ {isAr ? 'تسوق الإطلالة' : 'Shop the Look'}</h3>
              <p className="text-xs text-gray-500 font-medium">{(currentReel?.products?.length || (currentReel?.product ? 1 : 0))} {isAr ? 'عناصر في هذا الفيديو' : 'items featured in this reel'}</p>
            </div>
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeShopTheLook();
              }}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
              title={isAr ? 'إغلاق' : 'Close'}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div 
            ref={drawerListRef}
            onTouchStart={handleListTouchStart}
            onTouchMove={handleListTouchMove}
            onTouchEnd={handleListTouchEnd}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {(currentReel?.products && currentReel.products.length > 0 ? currentReel.products : (currentReel?.product ? [currentReel.product] : [])).map((prod, idx) => {
              const handleOpenDetails = () => {
                closeShopTheLook();
                const matched = products?.find(p => p.id === prod.id || p.sku === prod.sku || p.title === prod.title) || {
                  ...prod,
                  title: prod.title,
                  price: prod.price,
                  image: prod.image,
                  category: 'Fashion',
                  rating: 4.9,
                  reviewsCount: 120,
                  merchantId: 'm-01',
                  merchant: currentReel?.creatorName || 'Talieska Studio',
                  description: prod.title
                };
                openProductDetail(matched);
              };

              return (
                <div key={idx} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  {/* Clickable Product Image */}
                  <div 
                    onClick={handleOpenDetails}
                    className="relative cursor-pointer group flex-shrink-0"
                    title={isAr ? 'عرض تفاصيل المنتج' : 'View product details'}
                  >
                    <img 
                      src={prod.image} 
                      alt={prod.title}
                      className="w-20 h-24 rounded-xl object-cover group-hover:opacity-90 group-hover:scale-105 active:scale-95 transition-all shadow-xs" 
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 rounded-xl transition-colors flex items-center justify-center pointer-events-none">
                      <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-[20px] drop-shadow-md">open_in_new</span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 py-1 min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 mb-1">{prod.sku}</span>
                    
                    {/* Clickable Product Title */}
                    <h4 
                      onClick={handleOpenDetails}
                      className="font-bold text-sm text-slate-900 leading-tight mb-2 line-clamp-2 cursor-pointer hover:text-[#d00000] active:opacity-75 transition-colors"
                      title={isAr ? 'عرض تفاصيل المنتج' : 'View product details'}
                    >
                      {prod.title}
                    </h4>

                    <div className="mt-auto flex items-end justify-between gap-2">
                      <div onClick={handleOpenDetails} className="cursor-pointer group">
                        <span className="font-black text-[#d00000] text-sm block group-hover:underline">EGP {prod.price}</span>
                        {prod.originalPrice && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-gray-400 line-through">EGP {prod.originalPrice}</span>
                            <span className="text-[9px] font-bold bg-red-50 text-[#d00000] px-1 rounded">{prod.discount}</span>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          closeShopTheLook();
                          const matched = products?.find(p => p.id === prod.id || p.sku === prod.sku || p.title === prod.title) || prod;
                          openQuickBuy(matched);
                        }}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black active:scale-95 shadow-md transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">shopping_bag</span>
                        <span>{isAr ? 'شراء' : 'Buy'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Comments Drawer Linked to Profiles */}
      {isCommentsOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex flex-col justify-end"
          onClick={() => setIsCommentsOpen(false)}
        >
          <div 
            className="w-full max-w-[500px] mx-auto bg-white text-slate-900 rounded-t-3xl p-4 sm:p-5 max-h-[75vh] flex flex-col shadow-2xl animate-fade-in text-right"
            dir={isAr ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#d00000] text-[20px]">chat</span>
                <h3 className="text-sm font-bold text-slate-900">
                  {isAr ? `التعليقات (${commentsList.length})` : `Comments (${commentsList.length})`}
                </h3>
              </div>
              <button 
                onClick={() => setIsCommentsOpen(false)} 
                className="p-1 hover:text-[#d00000] rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Profile Status Banner */}
            <div className="mb-3 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <img 
                  src={user?.avatar_url || (user?.role === 'merchant' ? '/images/brands/talieska_logo.jpg' : '/images/reels/reel_1.jpg')} 
                  alt="Avatar" 
                  className="w-6 h-6 rounded-full object-cover border border-gray-200" 
                />
                <span className="text-slate-700 font-bold truncate max-w-[160px]">
                  {user?.name || user?.email?.split('@')[0] || (isAr ? 'متسوق (غير مسجل)' : 'Guest User')}
                </span>
                {user?.role && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-700">
                    {user.role}
                  </span>
                )}
              </div>
              {!user && (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-[#d00000] font-bold text-[11px] hover:underline"
                >
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </button>
              )}
            </div>

            {/* Comment Items List */}
            <div className="space-y-3 overflow-y-auto flex-1 pr-1 pl-1">
              {commentsList.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs">
                  {isAr ? 'كن أول من يترك تعليقاً على هذا الفيديو! ✨' : 'Be the first to comment on this reel! ✨'}
                </div>
              ) : (
                commentsList.map((c) => (
                  <div key={c.id} className="flex items-start gap-2.5 group">
                    <img 
                      src={c.userAvatar || '/images/reels/reel_1.jpg'} 
                      alt={c.userName} 
                      className="w-8 h-8 rounded-full object-cover shadow-2xs shrink-0 border border-gray-200" 
                    />
                    <div className="bg-gray-100/90 hover:bg-gray-100 p-2.5 sm:p-3 rounded-2xl flex-1 text-xs transition-colors">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">{c.userName}</span>
                          {c.userRole === 'merchant' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800">
                              {isAr ? 'تاجر موثق' : 'Merchant'}
                            </span>
                          )}
                          {c.userRole === 'creator' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                              {isAr ? 'صانع محتوى' : 'Creator'}
                            </span>
                          )}
                          {c.userRole === 'buyer' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                              {isAr ? 'متسوق' : 'Shopper'}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">{c.timeAgo || 'الآن'}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed break-words">{c.text}</p>
                      
                      <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-gray-200/50 text-[10px] text-gray-500">
                        <button 
                          onClick={() => handleLikeCommentItem(c.id)}
                          className="flex items-center gap-1 hover:text-[#d00000] font-bold transition-colors"
                        >
                          <span className="material-symbols-outlined text-[13px] fill-current">favorite</span>
                          <span>{c.likes || 0}</span>
                        </button>
                        
                        {(user?.id === c.userId || user?.role === 'admin') && (
                          <button 
                            onClick={() => handleDeleteCommentItem(c.id)}
                            className="text-gray-400 hover:text-red-600 font-bold transition-colors text-[10px]"
                          >
                            {isAr ? 'حذف' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handlePostComment} className="pt-3 border-t border-gray-100 flex items-center gap-2 mt-2">
              <input 
                type="text" 
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder={isAr ? "أضف تعليقاً على هذا الريلز..." : "Add a comment on this reel..."}
                className="flex-1 bg-gray-100 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all text-slate-800"
              />
              <button 
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {isAr ? 'إرسال' : 'Post'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Three Dots Options Menu Drawer */}
      {isOptionsMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[60] flex flex-col justify-end items-center p-0 sm:p-4 animate-fade-in"
          onClick={() => setIsOptionsMenuOpen(false)}
        >
          <div 
            dir={isAr ? 'rtl' : 'ltr'}
            className="w-full max-w-md bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-sheet-slide-up flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Current Reel Preview */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3 min-w-0">
                <img 
                  src={currentReel?.avatar || '/images/products/linen_abaya.jpg'} 
                  alt="avatar" 
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-xs shrink-0" 
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 truncate">{currentReel?.creatorName || 'Creator'}</h4>
                  <p className="text-xs text-gray-500 truncate">{currentReel?.creatorHandle}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOptionsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-slate-900 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Actions List */}
            <div className="space-y-1 text-sm font-semibold text-slate-800">
              {/* Copy / Share */}
              <button 
                onClick={handleShareLink}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-start cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span>{isAr ? 'مشاركة ونسخ الرابط' : 'Share & Copy Link'}</span>
                  <span className="text-[11px] text-gray-400 font-normal">{isAr ? 'انسخ رابط هذا الريل لمشاركته' : 'Copy link to clipboard'}</span>
                </div>
              </button>

              {/* Bookmark / Save to collection */}
              <button 
                onClick={handleToggleSaveReel}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-start cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">{isSaved ? 'bookmark_added' : 'bookmark_add'}</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span>{isSaved ? (isAr ? 'محفوظ في المفضلة' : 'Saved in collection') : (isAr ? 'حفظ الفيديو في المفضلة' : 'Save to collection')}</span>
                  <span className="text-[11px] text-gray-400 font-normal">{isAr ? 'حفظ للرجوع إليه لاحقاً ومزامنته في السيرفر' : 'Save to watch later & sync with backend'}</span>
                </div>
              </button>

              {/* Creator Profile / Store */}
              <button 
                onClick={() => {
                  setIsOptionsMenuOpen(false);
                  navigateToProfile(currentReel?.creatorHandle || 'talieska');
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-start cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span>{isAr ? 'زيارة صفحة المصمم / الصانع' : 'View Creator Profile'}</span>
                  <span className="text-[11px] text-gray-400 font-normal">{isAr ? 'استكشف كافة تصاميم وأعمال الصانع' : 'Explore creator shop and reels'}</span>
                </div>
              </button>

              {/* Not interested / Hide */}
              <button 
                onClick={handleHideReel}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-start cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">visibility_off</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span>{isAr ? 'غير مهتم بهذا المحتوى' : 'Not interested in this'}</span>
                  <span className="text-[11px] text-gray-400 font-normal">{isAr ? 'إخفاء هذا الفيديو وتحديث التفضيلات في الباك إند' : 'Hide from feed & update backend preferences'}</span>
                </div>
              </button>

              {/* Report Reel */}
              <button 
                onClick={() => {
                  setIsOptionsMenuOpen(false);
                  setIsReportModalOpen(true);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 active:bg-red-100 transition-colors text-start text-red-600 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">flag</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold">{isAr ? 'إبلاغ عن هذا الفيديو' : 'Report Reel'}</span>
                  <span className="text-[11px] text-red-400 font-normal">{isAr ? 'إبلاغ الإدارة عن محتوى مضلل أو مخالف' : 'Report violation to backend moderation'}</span>
                </div>
              </button>

              {/* Management Actions (Edit Caption / Delete) */}
              <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                <button 
                  onClick={() => {
                    setIsOptionsMenuOpen(false);
                    setEditCaption(currentReel?.caption || '');
                    setIsEditReelModalOpen(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>{isAr ? 'تعديل الوصف' : 'Edit Caption'}</span>
                </button>
                <button 
                  onClick={handleDeleteReel}
                  className="px-3.5 py-2.5 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  title={isAr ? 'حذف الريل' : 'Delete Reel'}
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>{isAr ? 'حذف' : 'Delete'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div 
            dir={isAr ? 'rtl' : 'ltr'}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-sheet-slide-up text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-base">
                <span className="material-symbols-outlined text-[24px]">flag</span>
                <h3>{isAr ? 'إبلاغ عن محتوى' : 'Report Reel'}</h3>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-gray-600">
              {isAr 
                ? 'يساعدنا بلاغك في الحفاظ على أمان مجتمع EG-Commerce وجودة المحتوى.' 
                : 'Your report helps keep the EG-Commerce community safe and trustworthy.'}
            </p>

            {/* Reasons List */}
            <div className="space-y-2">
              {[
                { id: 'misleading', ar: 'محتوى مضلل أو احتيال تجاري', en: 'Misleading or commercial fraud' },
                { id: 'inappropriate', ar: 'محتوى غير لائق أو مسيء', en: 'Inappropriate or offensive content' },
                { id: 'copyright', ar: 'انتهاك حقوق الملكية الفكرية والعلامة التجارية', en: 'Intellectual property / Copyright infringement' },
                { id: 'broken', ar: 'عطل تقني أو فيديو رديء وغير صالح', en: 'Broken playback or low quality' }
              ].map((reason) => (
                <label 
                  key={reason.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-colors ${
                    reportReason === reason.id 
                      ? 'border-[#d00000] bg-red-50/50 text-[#d00000]' 
                      : 'border-gray-200 hover:bg-gray-50 text-slate-700'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="reportReason" 
                    value={reason.id} 
                    checked={reportReason === reason.id} 
                    onChange={(e) => setReportReason(e.target.value)}
                    className="accent-[#d00000]"
                  />
                  <span>{isAr ? reason.ar : reason.en}</span>
                </label>
              ))}
            </div>

            {/* Additional details */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isAr ? 'ملاحظات إضافية (اختياري)' : 'Additional Details (Optional)'}
              </label>
              <textarea 
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder={isAr ? 'صف المشكلة بالتفصيل لمساعدة المشرفين...' : 'Explain the issue in detail...'}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-[#d00000] focus:outline-none"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button 
                onClick={handleSubmitReport}
                className="flex-1 py-3 bg-[#d00000] text-white rounded-2xl text-xs font-bold hover:bg-[#b00000] shadow-md active:scale-95 transition-all cursor-pointer"
              >
                {isAr ? 'إرسال البلاغ الآن' : 'Submit Report'}
              </button>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="px-5 py-3 bg-gray-100 text-slate-700 rounded-2xl text-xs font-bold hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reel Modal */}
      {isEditReelModalOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsEditReelModalOpen(false)}
        >
          <div 
            dir={isAr ? 'rtl' : 'ltr'}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-sheet-slide-up text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <span className="material-symbols-outlined text-[24px]">edit_note</span>
                <h3>{isAr ? 'تعديل وصف الريلز' : 'Edit Reel Caption'}</h3>
              </div>
              <button 
                onClick={() => setIsEditReelModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {isAr ? 'نص الوصف والهاشتاجات' : 'Caption & Hashtags'}
              </label>
              <textarea 
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-[#d00000] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button 
                onClick={handleSaveEditReel}
                className="flex-1 py-3 bg-[#d00000] text-white rounded-2xl text-xs font-bold hover:bg-[#b00000] shadow-md active:scale-95 transition-all cursor-pointer"
              >
                {isAr ? 'حفظ التعديلات' : 'Save Changes'}
              </button>
              <button 
                onClick={() => setIsEditReelModalOpen(false)}
                className="px-5 py-3 bg-gray-100 text-slate-700 rounded-2xl text-xs font-bold hover:bg-gray-200 active:scale-95 transition-all cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Toast Message */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-slate-950/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 text-xs font-bold flex items-center gap-2.5 backdrop-blur-md animate-fade-in pointer-events-none">
          <span className="material-symbols-outlined text-[20px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
