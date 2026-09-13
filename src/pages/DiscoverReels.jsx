import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import { ReelsService } from '../services/ReelsService';
import DesktopFeed from '../components/desktop/DesktopFeed';

const ReelVideoPlayer = ({ reel, isActive, isAdjacent, isGlobalMuted, toggleMute }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Play only if active
    if (isActive) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.log("Autoplay prevented:", err);
          setIsPlaying(false);
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  // Sync mute state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isGlobalMuted;
    }
  }, [isGlobalMuted]);

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
        preload={isActive ? "auto" : isAdjacent ? "metadata" : "none"}
      />
      {/* Mute Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        className="absolute top-20 right-4 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"
      >
        <span className="material-symbols-outlined">{isGlobalMuted ? 'volume_off' : 'volume_up'}</span>
      </button>
    </div>
  );
};

export default function DiscoverReels() {
  const [reelsList, setReelsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        const storedReels = await ReelsService.getReels();
        if (storedReels && storedReels.length > 0) {
          const processedReels = storedReels.map(item => {
            if (typeof item.product === 'string') {
              try { item.product = JSON.parse(item.product); } catch(e) {}
            }
            if (typeof item.products === 'string') {
              try { item.products = JSON.parse(item.products); } catch(e) {}
            }
            return item;
          });
          setReelsList(processedReels);
        } else {
          for (const reel of DEFAULT_REELS) {
            await ReelsService.saveReel(reel);
          }
          setReelsList(DEFAULT_REELS);
        }
      } catch (err) {
        console.error("Failed to load reels", err);
        setReelsList(DEFAULT_REELS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReels();
  }, []);

  const { openQuickBuy, openProductDetail, products, setActiveTab, language } = useApp();
  const [activeTabSub, setActiveTabSub] = useState('foryou');
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(14200);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAr = language === 'ar';

  const DEFAULT_REELS = [
    {
      id: 'reel-fashion-blazer',
      creatorHandle: '@cairo_chic',
      creatorName: 'كايرو شيك • Cairo Chic',
      avatar: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      videoBg: '/images/reels/fashion_citrine_blazer.mp4',
      caption: isAr 
        ? 'تنسيق بليزر السيترين الأوفرسايز مع بنطلون جينز كلاسيك ونظارة شمسية 💛 فخامة الصيف وأناقة لا تقاوم! #بليزر #موضة_القاهرة' 
        : 'Styling the oversized Citrine Yellow Blazer with denim and sleek shades 💛 Effortless luxury! #FashionReels #OOTD',
      music: isAr ? 'ألحان إيقاعية هادية • صيف 2026' : 'Summer Aesthetic Vibes • Instrumental',
      likes: 62400,
      comments: 2180,
      saves: 11400,
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
      id: 'reel-fashion-shirt',
      creatorHandle: '@salma.styles',
      creatorName: 'سلمى ستايلز • Salma Styles',
      avatar: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      videoBg: '/images/reels/fashion_oversized_shirt.mp4',
      caption: isAr 
        ? 'قميص كتان سماوي أوفرسايز خفيف جداً ومريح مع بنطلون تشينو بيج واسع 🩵 إطلالة كاجوال أنيقة لكل يوم!' 
        : 'Sky blue linen oversized shirt paired with relaxed wide chinos 🩵 Summer perfection! #LinenStyle',
      music: isAr ? 'نغمات كاجوال مصرية' : 'Chill Acoustic Grooves',
      likes: 45100,
      comments: 1390,
      saves: 8200,
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
      id: 'reel-fashion-top',
      creatorHandle: '@zeina_ootd',
      creatorName: 'زينة أوفت • Zeina OOTD',
      avatar: '/images/reels/fashion_oneshoulder_top_thumb.jpg',
      videoBg: '/images/reels/fashion_oneshoulder_top.mp4',
      caption: isAr 
        ? 'توب بكتف واحد عاجي ناعم مع جينز كلاسيك عالي الخصر وحزام جلد 🤍 "Jeans and a cute top" هو الأساس دايماً!' 
        : 'Asymmetric one-shoulder white bodysuit with high-waist denim 🤍 The classic "jeans and a cute top" equation! ✨',
      music: isAr ? 'صوت تريند عالمي' : 'Trending Pop Rhythm',
      likes: 38900,
      comments: 1240,
      saves: 7300,
      products: [{
        id: 'p-fashion-oneshoulder-top',
        sku: 'TLK-TOP-06',
        title: isAr ? 'توب بكتف واحد عاجي ناعم' : 'Asymmetric One-Shoulder White Top',
        price: 680,
        originalPrice: 850,
        discount: '20% OFF',
        image: '/images/reels/fashion_oneshoulder_top_thumb.jpg'
      }]
    },
    {
      id: 'reel-fashion-bag',
      creatorHandle: '@maya_accessories',
      creatorName: 'مايا إكسسوارات • Maya Accessories',
      avatar: '/images/reels/fashion_shoulder_bags_thumb.jpg',
      videoBg: '/images/reels/fashion_shoulder_bags.mp4',
      caption: isAr 
        ? 'سواتش كولكشن شنط الكتف الجلدية الكلاسيك بـ 5 ألوان تخطف العين (عاجي، بني، بوردو، رمادي، جملي) بإبزيم ذهبي فاخر! 👜✨' 
        : 'All 5 iconic colorways of the structured leather shoulder bag with polished gold hardware! 👜✨ #Bags',
      music: isAr ? 'إيقاع إكسسوارات راقي' : 'High Fashion Beats',
      likes: 48500,
      comments: 1950,
      saves: 9800,
      products: [{
        id: 'p-fashion-shoulder-bags',
        sku: 'KHC-BAG-01',
        title: isAr ? 'حقيبة كتف جلدية كلاسيك بإبزيم ذهبي' : 'Classic Structured Leather Bag',
        price: 1850,
        originalPrice: 2300,
        discount: '20% OFF',
        image: '/images/reels/fashion_shoulder_bags_thumb.jpg'
      }]
    },
    {
      id: 'reel-fashion-knit',
      creatorHandle: '@layla_fashion',
      creatorName: 'ليلى فاشن • Layla Fashion',
      avatar: '/images/reels/fashion_knit_sweater_thumb.jpg',
      videoBg: '/images/reels/fashion_knit_sweater.mp4',
      caption: isAr 
        ? 'سويتر تريكو صوف أوفرسايز بياقة عالية مع جيبة صوف صوفية كاروهات 🖤 دفء وأناقة شتوية راقية!' 
        : 'Chunky oversized knit turtleneck sweater paired with wool argyle skirt 🖤 Winter warmth & elegance!',
      music: isAr ? 'موسيقى شتوية دافئة' : 'Cozy Winter Harmony',
      likes: 33400,
      comments: 980,
      saves: 5600,
      products: [{
        id: 'p-fashion-knit-sweater',
        sku: 'TLK-SWT-07',
        title: isAr ? 'سويتر صوف تريكو أوفرسايز بياقة عالية' : 'Chunky Knit Oversized Turtleneck',
        price: 1650,
        originalPrice: 2100,
        discount: '21% OFF',
        image: '/images/reels/fashion_knit_sweater_thumb.jpg'
      }]
    },
    {
      id: 'reel-fashion-suede',
      creatorHandle: '@omar_looks',
      creatorName: 'عمر لوكس • Omar Looks',
      avatar: '/images/reels/fashion_suede_jacket_thumb.jpg',
      videoBg: '/images/reels/fashion_suede_jacket.mp4',
      caption: isAr 
        ? 'ستايل كلاسيكي رجالي راقي: جاكيت شمواه بني فاخر مع بنطلون زيتي وحذاء سويد مريح 🤎 قمة الفخامة الهادية!' 
        : 'Refined menswear styling: Tobacco brown suede Harrington jacket with olive pleated trousers 🤎 #MenStyle',
      music: isAr ? 'جاز مصري حديث' : 'Modern Lo-Fi Beats',
      likes: 31200,
      comments: 870,
      saves: 6100,
      products: [{
        id: 'p-fashion-suede-jacket',
        sku: 'TLK-JCK-08',
        title: isAr ? 'جاكيت شمواه كلاسيكي بني بسحاب' : 'Classic Suede Harrington Jacket',
        price: 2600,
        originalPrice: 3200,
        discount: '19% OFF',
        image: '/images/reels/fashion_suede_jacket_thumb.jpg'
      }]
    },
    {
      id: 'reel-fashion-watch',
      creatorHandle: '@karim.editorial',
      creatorName: 'كريم إيديتوريال • Karim Editorial',
      avatar: '/images/reels/fashion_vintage_watch_thumb.jpg',
      videoBg: '/images/reels/fashion_vintage_watch.mp4',
      caption: isAr 
        ? 'تفاصيل الساعة البرميلية الكلاسيكية بطلاء الذهب الوردي وأرقام رومانية مع سويتر صوف عاجي أنيق ⌚✨ تحفة معصم!' 
        : 'Vintage tonneau rose gold watch with roman dial & brown leather strap ⌚✨ Complete quiet luxury!',
      music: isAr ? 'عزف بيانو كلاسيكي' : 'Classical Elegance Sound',
      likes: 54200,
      comments: 2310,
      saves: 12400,
      products: [{
        id: 'p-fashion-vintage-watch',
        sku: 'TBA-WTC-01',
        title: isAr ? 'ساعة يد كلاسيكية برميليّة بعقارب رومانية' : 'Vintage Tonneau Rose Gold Watch',
        price: 3400,
        originalPrice: 4200,
        discount: '19% OFF',
        image: '/images/reels/fashion_vintage_watch_thumb.jpg'
      }]
    },
    {
      id: 'reel-fashion-woven',
      creatorHandle: '@farida.atelier',
      creatorName: 'فريدة أتيليه • Farida Atelier',
      avatar: '/images/reels/fashion_woven_bag_thumb.jpg',
      videoBg: '/images/reels/fashion_woven_bag.mp4',
      caption: isAr 
        ? 'حقيبة الجلد المنسوجة يدوياً بحزام مضفر مع بنطلون كتان جملي واسع وميولز بيضاء 🤎 فخامة الحرف اليدوية المصرية!' 
        : 'Handcrafted woven leather bag with braided handle styled with camel linen trousers & white mules! 🤎',
      music: isAr ? 'أنغام ريترو هادية' : 'Aesthetic Retro Beats',
      likes: 32100,
      comments: 940,
      saves: 5900,
      products: [{
        id: 'p-fashion-woven-bag',
        sku: 'KHC-BAG-02',
        title: isAr ? 'حقيبة جلد منسوجة يدوياً بمقبض مضفر' : 'Handcrafted Woven Leather Bag',
        price: 1950,
        originalPrice: 2500,
        discount: '22% OFF',
        image: '/images/reels/fashion_woven_bag_thumb.jpg'
      }]
    },
    {
      id: 'reel-fashion-barrel',
      creatorHandle: '@huda_leather',
      creatorName: 'هدى ليذر • Huda Leather',
      avatar: '/images/reels/fashion_barrel_bag_thumb.jpg',
      videoBg: '/images/reels/fashion_barrel_bag.mp4',
      caption: isAr 
        ? 'حقائب البولينج الأسطوانية الجلد الطبيعي في 4 ألوان فخمة (بني كروكو، كونياك سويد، نبيذي، أسود) 👜 سعة مذهلة وخياطة دقيقة!' 
        : 'Luxury barrel bowling leather handbags in 4 rich finishes (croc dark brown, suede tan, deep wine, black) 👜',
      music: isAr ? 'إيقاع استوديو القاهرة' : 'Cairo Studio Lounge',
      likes: 29700,
      comments: 860,
      saves: 5100,
      products: [{
        id: 'p-fashion-barrel-bag',
        sku: 'KHC-BAG-03',
        title: isAr ? 'حقيبة بولينج أسطوانية كلاسيك' : 'Barrel Bowling Handbag',
        price: 2100,
        originalPrice: 2600,
        discount: '19% OFF',
        image: '/images/reels/fashion_barrel_bag_thumb.jpg'
      }]
    },
    {
      id: 'reel-fashion-cuban',
      creatorHandle: '@youssef_cairo',
      creatorName: 'يوسف ستايل • Youssef Cairo',
      avatar: '/images/reels/fashion_cuban_shirt_thumb.jpg',
      videoBg: '/images/reels/fashion_cuban_shirt.mp4',
      caption: isAr 
        ? 'قميص كوبي بنقشة ريترو مع بنطلون كتان أسود ونظارة كلاسيك 🕶️ إطلالة شبابية رايقة للصيف!' 
        : 'Retro print Cuban collar shirt styled with black linen trousers 🕶️ Smooth summer aesthetic! #MenSummer',
      music: isAr ? 'فانك مصري هادي' : 'Smooth Funk Grooves',
      likes: 28400,
      comments: 790,
      saves: 4300,
      products: [{
        id: 'p-fashion-cuban-shirt',
        sku: 'TLK-SHT-06',
        title: isAr ? 'قميص كوبي بنقشة ريترو' : 'Retro Print Cuban Collar Shirt',
        price: 850,
        originalPrice: 1100,
        discount: '22% OFF',
        image: '/images/reels/fashion_cuban_shirt_thumb.jpg'
      }]
    },
    {
      id: 'reel-sheglam-1',
      creatorHandle: '@beauty.by.nada',
      creatorName: 'ندى بيوتي • Nada Beauty',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      videoBg: '/images/reels/sheglam_mascara.mp4',
      caption: isAr 
        ? 'ريفيو جديد لماسكارا شيجلام! رهيبة بتطول وتكثف الرموش، ومعاها مزيل خاص بيها بيشيلها في ثواني! ✨👀 #Sheglam #ماسكارا #تجميل' 
        : 'Testing the new SHEGLAM Ultra Lash Lift Mascara & Easy Lash Removal! Amazing results! ✨👀 #Sheglam #Makeup',
      music: isAr ? 'تريند بيوتي • تيك توك' : 'Trending Beauty Sound',
      likes: 45200,
      comments: 1240,
      saves: 8900,
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
      id: 'reel-sheglam-2',
      creatorHandle: '@makeup.with.sara',
      creatorName: 'سارة ميكأب • Sara Makeup',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      videoBg: '/images/reels/sheglam_liptint.mp4',
      caption: isAr 
        ? 'سواتش لدرجات مرطب ومورد الشفاه والخدود من شيجلام 🍒 درجات تجنن (Cherry Bark, Plum Sauce, Bare Blush) ثبات وترطيب خيالي! 💋 #مكياج #شيجلام' 
        : 'SHEGLAM Jelly Lip Tint & Blusher swatches 🍒 Gorgeous shades (Cherry Bark, Plum Sauce) and amazing hydration! 💋 #LipTint #Sheglam',
      music: isAr ? 'موسيقى ريلز هادية' : 'Chill Aesthetic Vibes',
      likes: 89100,
      comments: 3420,
      saves: 15400,
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

  const currentReel = reelsList[currentReelIndex];

  // Navigation functions
  const handleNextReel = () => {
    if (isTransitioning) return;
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
              className="pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
                setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
              }}
            >
              <div className="w-[42px] h-[42px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110">
                <span className={`material-symbols-outlined text-[24px] transition-colors ${isLiked ? 'text-[#d00000] drop-shadow-md' : 'text-white'}`} style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </div>
            </button>
            <span className="text-white text-[12px] font-bold drop-shadow-md">{(likesCount / 1000).toFixed(1)}K</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="pointer-events-auto" onClick={(e) => { e.stopPropagation(); setIsCommentsOpen(true); }}>
              <div className="w-[42px] h-[42px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110">
                <span className="material-symbols-outlined text-[24px] text-white">chat_bubble</span>
              </div>
            </button>
            <span className="text-white text-[12px] font-bold drop-shadow-md">{reel.comments}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button 
              className="pointer-events-auto"
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
              }}
            >
              <div className="w-[42px] h-[42px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110">
                <span className={`material-symbols-outlined text-[24px] ${isSaved ? 'text-yellow-400' : 'text-white'}`} style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
              </div>
            </button>
            <span className="text-white text-[12px] font-bold drop-shadow-md">{reel.saves}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="pointer-events-auto" onClick={(e) => { e.stopPropagation(); }}>
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
            {/* Floating Product Pill(s) */}
            {(reel.products && reel.products.length > 1) ? (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShopTheLookOpen(true);
                }}
                className="inline-flex w-fit items-center gap-2 bg-white/95 backdrop-blur-md rounded-xl py-2 px-3 shadow-lg cursor-pointer hover:bg-white active:scale-95 transition-transform animate-fade-in"
              >
                <div className="flex -space-x-2">
                  {reel.products.slice(0,3).map((p, i) => (
                    <img key={i} src={p.image} className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-900 leading-tight">🛍️ {isAr ? 'تسوق الإطلالة' : 'Shop the Look'}</span>
                  <span className="text-[10px] font-bold text-gray-500 leading-tight">({reel.products.length} {isAr ? 'عناصر' : 'items'})</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-900 ml-1">open_in_new</span>
              </div>
            ) : (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  const singleProd = reel.products ? reel.products[0] : reel.product;
                  const matched = products?.find(p => p.id === singleProd?.id) || singleProd;
                  if (matched) openProductDetail(matched);
                }}
                className="inline-flex w-fit items-center gap-2 bg-white rounded-xl py-1.5 px-1.5 pr-4 shadow-lg cursor-pointer hover:bg-gray-50 active:scale-95 transition-transform"
              >
                <img src={reel.products ? reel.products[0].image : reel.product?.image} className="w-8 h-8 rounded-lg object-cover" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">{reel.products ? reel.products[0].title : reel.product?.title}</span>
                  <span className="text-[10px] font-bold text-[#d00000] leading-tight">EGP {reel.products ? reel.products[0].price : reel.product?.price}</span>
                </div>
                <span className="material-symbols-outlined text-[14px] text-gray-400 ml-1">chevron_right</span>
              </div>
            )}

            {/* Creator Info */}
            <div className={`space-y-1 ${isAr ? 'text-right' : 'text-left'}`}>
              <div 
                className="flex items-center gap-1.5 cursor-pointer w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('profile');
                }}
              >
                <span className="font-bold text-[15px] text-white drop-shadow-md hover:underline">{reel.creatorHandle}</span>
                <span className="material-symbols-outlined text-[16px] text-blue-500 bg-white rounded-full">check_circle</span>
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
            
            {/* Shop Now Full Width Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (reel.products && reel.products.length > 1) {
                  setIsShopTheLookOpen(true);
                } else {
                  const singleProd = reel.products ? reel.products[0] : reel.product;
                  if (singleProd) openQuickBuy(singleProd);
                }
              }}
              className="w-full py-3 mt-1 rounded-xl bg-[#cc0000] text-white text-[15px] font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>{isAr ? 'تسوق الآن' : 'Shop Now'}</span>
            </button>
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
            style={{ backgroundImage: `url(${currentReel.videoBg})` }}
          />

          {/* Up & Down Side Navigation Arrows */}
          <div className="flex flex-col gap-3 mr-6 z-20">
            <button 
              onClick={handlePrevReel}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#d00000] backdrop-blur-md text-white transition-all flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 border border-white/20"
              title="Previous Reel (↑)"
            >
              <span className="material-symbols-outlined text-[28px]">arrow_upward</span>
            </button>
            <button 
              onClick={handleNextReel}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#d00000] backdrop-blur-md text-white transition-all flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 border border-white/20"
              title="Next Reel (↓)"
            >
              <span className="material-symbols-outlined text-[28px]">arrow_downward</span>
            </button>
          </div>

          {/* Centered Phone Frame for Vertical Reels */}
          <div 
            className="w-full max-w-[420px] aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 bg-black relative flex flex-col z-10 cursor-grab active:cursor-grabbing"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setIsDragging(false); setDragOffset(0); }}
          >
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

            {/* Reel Counter Dots Indicator */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5 pointer-events-none">
              {reelsList.map((_, idx) => (
                <div 
                  key={idx}
                  className={`w-1.5 rounded-full transition-all ${
                    idx === currentReelIndex 
                      ? 'h-6 bg-[#d00000]' 
                      : 'h-1.5 bg-white/40'
                  }`}
                />
              ))}
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
        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent text-white pt-safe z-40 pointer-events-auto">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px] drop-shadow-md">search</span>
              </button>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors text-white flex items-center justify-center" onClick={(e) => { e.stopPropagation(); setIsEditModalOpen(true); }}>
                <span className="material-symbols-outlined text-[26px] drop-shadow-md">more_vert</span>
              </button>
            </div>
            <div className="flex items-center">
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

        {/* Floating Arrow Indicators for Mobile */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2">
          <button 
            onClick={handlePrevReel}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#d00000] transition-colors flex items-center justify-center shadow-lg active:scale-90"
            title="Previous Reel"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
          </button>
          <button 
            onClick={handleNextReel}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-[#d00000] transition-colors flex items-center justify-center shadow-lg active:scale-90"
            title="Next Reel"
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
          </button>
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

      {/* Shop the Look Drawer */}
      <div 
        className={`absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ${isShopTheLookOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ height: '55%' }}
      >
        <div className="w-full h-full flex flex-col relative text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/50 rounded-full"></div>
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h3 className="font-black text-lg">🛍️ {isAr ? 'تسوق الإطلالة' : 'Shop the Look'}</h3>
              <p className="text-xs text-gray-500 font-medium">{currentReel?.products?.length || 0} {isAr ? 'عناصر في هذا الفيديو' : 'items featured in this reel'}</p>
            </div>
            <button 
              onClick={() => setIsShopTheLookOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentReel?.products?.map((prod, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <img src={prod.image} className="w-20 h-24 rounded-xl object-cover" />
                <div className="flex flex-col flex-1 py-1">
                  <span className="text-[10px] font-bold text-gray-400 mb-1">{prod.sku}</span>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight mb-2 line-clamp-2">{prod.title}</h4>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="font-black text-[#d00000] text-sm block">EGP {prod.price}</span>
                      {prod.originalPrice && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-400 line-through">EGP {prod.originalPrice}</span>
                          <span className="text-[9px] font-bold bg-red-50 text-[#d00000] px-1 rounded">{prod.discount}</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setIsShopTheLookOpen(false);
                        const matched = products?.find(p => p.id === prod.id) || prod;
                        openQuickBuy(matched);
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black shadow-md"
                    >
                      {isAr ? 'شراء' : 'Buy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Comments Drawer */}
      {isCommentsOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex flex-col justify-end"
          onClick={() => setIsCommentsOpen(false)}
        >
          <div 
            className="w-full max-w-[500px] mx-auto bg-white text-slate-900 rounded-t-3xl p-5 max-h-[70vh] flex flex-col shadow-2xl animate-fade-in text-right"
            dir={isAr ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isAr ? `التعليقات (${currentReel.comments})` : `Comments (${currentReel.comments})`}
              </h3>
              <button 
                onClick={() => setIsCommentsOpen(false)} 
                className="p-1 hover:text-[#d00000] rounded-full hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Comment Items */}
            <div className="space-y-3.5 overflow-y-auto flex-1 pr-1">
              <div className="flex items-start gap-2.5">
                <img src="/images/reels/reel_2.jpg" alt="User" className="w-8 h-8 rounded-full object-cover shadow-xs" />
                <div className="bg-gray-100 p-2.5 rounded-2xl flex-1 text-xs">
                  <span className="font-bold block text-slate-800">مريم الشافعي</span>
                  <span className="text-slate-600">الكتان باين عليه تحفة! هل في شحن لإسكندرية؟ ❤️</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <img src="/images/reels/reel_1.jpg" alt="User" className="w-8 h-8 rounded-full object-cover shadow-xs" />
                <div className="bg-gray-100 p-2.5 rounded-2xl flex-1 text-xs">
                  <span className="font-bold block text-slate-800">أحمد سامي</span>
                  <span className="text-slate-600">التطريز ممتاز جداً.. طلبت واحدة ووصلتني في 48 ساعة مع بوسطة 🚀</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <img src="/images/products/linen_abaya.jpg" alt="User" className="w-8 h-8 rounded-full object-cover shadow-xs" />
                <div className="bg-gray-100 p-2.5 rounded-2xl flex-1 text-xs">
                  <span className="font-bold block text-slate-800">هدى طارق</span>
                  <span className="text-slate-600">المقاس مظبوط بالظبط ولا اطلب نمرة أكبر؟</span>
                </div>
              </div>
            </div>

            {/* Comment Input */}
            <div className="pt-3 border-t border-gray-100 flex items-center gap-2 mt-3">
              <input 
                type="text" 
                placeholder={isAr ? "أضف تعليقاً لطيفاً..." : "Add a comment..."}
                className="flex-1 bg-gray-100 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#d00000]"
              />
              <button className="px-4 py-2.5 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all">
                {isAr ? 'إرسال' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
