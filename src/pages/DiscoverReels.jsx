import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import { ReelsService } from '../services/ReelsService';
import DesktopFeed from '../components/desktop/DesktopFeed';


const ReelVideoPlayer = ({ reel, isActive, isGlobalMuted, toggleMute }) => {
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
      // Optionally reset time to 0: videoRef.current.currentTime = 0;
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
    <div className="absolute inset-0 w-full h-full z-0 cursor-pointer" onClick={togglePlay}>
      {(reel.videoBg.includes('.mp4') || reel.videoBg.startsWith('blob:')) ? (
        <video 
          ref={videoRef}
          src={reel.videoBg}
          loop
          playsInline
          autoPlay={isActive}
          muted={isGlobalMuted}
          className="w-full h-full object-cover object-center pointer-events-none"
        />
      ) : (
        <img 
          src={reel.videoBg} 
          alt={reel.creatorHandle}
          className="w-full h-full object-cover object-center pointer-events-none"
          loading="eager"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none" />
      
      {/* Play Icon when Paused */}
      {!isPlaying && (reel.videoBg.includes('.mp4') || reel.videoBg.startsWith('blob:')) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl border border-white/10">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </div>
        </div>
      )}

      {/* Floating Mute Toggle button (Desktop & Mobile) */}
      {(reel.videoBg.includes('.mp4') || reel.videoBg.startsWith('blob:')) && (
        <button 
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="absolute top-16 right-4 md:top-20 md:right-4 z-40 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-md border border-white/10 hover:bg-black/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isGlobalMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>
      )}

      
    </div>
  );
};
export default function DiscoverReels() {
  const [reelsList, setReelsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const fetchReels = async () => {
      try {
        const storedReels = await ReelsService.getReels();
        if (storedReels && storedReels.length > 0) {
          // Identify any new default reels not yet in storedReels
          const existingIds = new Set(storedReels.map(r => r.id));
          const missingDefaults = DEFAULT_REELS.filter(d => !existingIds.has(d.id));
          
          for (const m of missingDefaults) {
            await ReelsService.saveReel(m);
          }

          const combined = [...storedReels, ...missingDefaults];

          const processedReels = await Promise.all(combined.map(async (r) => {
            let item = { ...r };
            // Auto-migrate placeholders to high quality local video assets
            if (item.id === 'reel-sheglam-1' && (!item.videoBg.includes('sheglam_mascara') || item.videoBg.includes('w3.org'))) {
              item.videoBg = '/images/reels/sheglam_mascara.mp4';
              item.product = { ...item.product, id: 'p-sheglam-1', image: '/images/reels/sheglam_mascara_thumb.jpg' };
              await ReelsService.saveReel(item);
            } else if (item.id === 'reel-sheglam-2' && (!item.videoBg.includes('sheglam_liptint') || item.videoBg.includes('w3.org'))) {
              item.videoBg = '/images/reels/sheglam_liptint.mp4';
              item.product = { ...item.product, id: 'p-sheglam-2', image: '/images/reels/sheglam_liptint_thumb.jpg' };
              await ReelsService.saveReel(item);
            }
            if (item.videoBg instanceof File || item.videoBg instanceof Blob) {
              return { ...item, videoBg: URL.createObjectURL(item.videoBg) };
            }
            return item;
          }));
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
  const [desktopViewMode, setDesktopViewMode] = useState('player'); // 'player' or 'grid'
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  
  // Gesture & Swipe Tracking
  const [touchStartY, setTouchStartY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastScrollTime = useRef(0);

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
      product: {
        id: 'p-fashion-blazer',
        sku: 'TLK-BLZ-09',
        title: isAr ? 'بليزر أوفرسايز أصفر ليموني راقي' : 'Citrine Tailored Oversized Blazer',
        price: 2200,
        originalPrice: 2750,
        discount: '20% OFF',
        image: '/images/reels/fashion_citrine_blazer_thumb.jpg'
      }
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
      product: {
        id: 'p-fashion-oversized-shirt',
        sku: 'TLK-SHT-05',
        title: isAr ? 'قميص كتان سماوي بقصة أوفرسايز' : 'Oversized Sky Blue Linen Shirt',
        price: 950,
        originalPrice: 1200,
        discount: '21% OFF',
        image: '/images/reels/fashion_oversized_shirt_thumb.jpg'
      }
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
      product: {
        id: 'p-fashion-oneshoulder-top',
        sku: 'TLK-TOP-06',
        title: isAr ? 'توب بكتف واحد عاجي ناعم' : 'Asymmetric One-Shoulder White Top',
        price: 680,
        originalPrice: 850,
        discount: '20% OFF',
        image: '/images/reels/fashion_oneshoulder_top_thumb.jpg'
      }
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
      product: {
        id: 'p-fashion-shoulder-bags',
        sku: 'KHC-BAG-01',
        title: isAr ? 'حقيبة كتف جلدية كلاسيك بإبزيم ذهبي' : 'Classic Structured Leather Bag',
        price: 1850,
        originalPrice: 2300,
        discount: '20% OFF',
        image: '/images/reels/fashion_shoulder_bags_thumb.jpg'
      }
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
      product: {
        id: 'p-fashion-knit-sweater',
        sku: 'TLK-SWT-07',
        title: isAr ? 'سويتر صوف تريكو أوفرسايز بياقة عالية' : 'Chunky Knit Oversized Turtleneck',
        price: 1650,
        originalPrice: 2100,
        discount: '21% OFF',
        image: '/images/reels/fashion_knit_sweater_thumb.jpg'
      }
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
      product: {
        id: 'p-fashion-suede-jacket',
        sku: 'TLK-JCK-08',
        title: isAr ? 'جاكيت شمواه كلاسيكي بني بسحاب' : 'Classic Suede Harrington Jacket',
        price: 2600,
        originalPrice: 3200,
        discount: '19% OFF',
        image: '/images/reels/fashion_suede_jacket_thumb.jpg'
      }
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
      product: {
        id: 'p-fashion-vintage-watch',
        sku: 'TBA-WTC-01',
        title: isAr ? 'ساعة يد كلاسيكية برميليّة بعقارب رومانية' : 'Vintage Tonneau Rose Gold Watch',
        price: 3400,
        originalPrice: 4200,
        discount: '19% OFF',
        image: '/images/reels/fashion_vintage_watch_thumb.jpg'
      }
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
      product: {
        id: 'p-fashion-woven-bag',
        sku: 'KHC-BAG-02',
        title: isAr ? 'حقيبة جلد منسوجة يدوياً بمقبض مضفر' : 'Handcrafted Woven Leather Bag',
        price: 1950,
        originalPrice: 2500,
        discount: '22% OFF',
        image: '/images/reels/fashion_woven_bag_thumb.jpg'
      }
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
      product: {
        id: 'p-fashion-barrel-bag',
        sku: 'KHC-BAG-03',
        title: isAr ? 'حقيبة بولينج أسطوانية من الجلد الطبيعي' : 'Luxury Barrel Leather Handbag',
        price: 1750,
        originalPrice: 2200,
        discount: '20% OFF',
        image: '/images/reels/fashion_barrel_bag_thumb.jpg'
      }
    },
    {
      id: 'reel-fashion-cuban',
      creatorHandle: '@youssef_cairo',
      creatorName: 'يوسف ستايل • Youssef Cairo',
      avatar: '/images/reels/fashion_cuban_shirt_thumb.jpg',
      videoBg: '/images/reels/fashion_cuban_shirt.mp4',
      caption: isAr 
        ? 'قميص أبيض بياقة كوبية ريزورت مع بنطلون واسع أسود وكاب ستريت وير 🌴 لوك صيفي شبابي مميز!' 
        : 'Resort Cuban collar white shirt with relaxed streetwear trousers and sneakers 🌴 Summer energy!',
      music: isAr ? 'موسيقى تريند شوارع القاهرة' : 'Urban Street Beats',
      likes: 27800,
      comments: 720,
      saves: 4300,
      product: {
        id: 'p-fashion-cuban-shirt',
        sku: 'TLK-SHT-09',
        title: isAr ? 'قميص ريزورت بياقة كوبية مطرز' : 'Resort Cuban Collar White Shirt',
        price: 880,
        originalPrice: 1100,
        discount: '20% OFF',
        image: '/images/reels/fashion_cuban_shirt_thumb.jpg'
      }
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
      product: {
        id: 'p-sheglam-1',
        sku: 'SHG-MASC-01',
        title: isAr ? 'مجموعة شيجلام ماسكارا ومزيل' : 'SHEGLAM Lash Lift & Remover',
        price: 450,
        originalPrice: 550,
        discount: '18% OFF',
        image: '/images/reels/sheglam_mascara_thumb.jpg'
      }
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
      product: {
        id: 'p-sheglam-2',
        sku: 'SHG-LIP-02',
        title: isAr ? 'ملمع ومورد شفاه وبلاشر شيجلام' : 'SHEGLAM Jelly Lip Tint & Blusher',
        price: 280,
        originalPrice: 350,
        discount: '20% OFF',
        image: '/images/reels/sheglam_liptint_thumb.jpg'
      }
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
    setTimeout(() => setIsTransitioning(false), 380);
  };

  const handlePrevReel = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentReelIndex((prev) => (prev - 1 + reelsList.length) % reelsList.length);
    setIsLiked(false);
    setIsSaved(false);
    setTimeout(() => setIsTransitioning(false), 380);
  };

  const toggleLike = () => {
    setIsLiked(prev => !prev);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Mouse Wheel / Trackpad Scroll (Vertical Flick to swipe)
  const handleWheel = (e) => {
    const now = Date.now();
    if (now - lastScrollTime.current < 450) return;
    if (Math.abs(e.deltaY) > 25) {
      lastScrollTime.current = now;
      if (e.deltaY > 0) {
        handleNextReel();
      } else {
        handlePrevReel();
      }
    }
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    // Limit drag resistance
    setDragOffset(diff * 0.4);
  };

  const handleTouchEnd = (e) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    setTouchStartY(null);
    setDragOffset(0);

    if (diffY > 40) {
      // Swiped UP -> Next Reel
      handleNextReel();
    } else if (diffY < -40) {
      // Swiped DOWN -> Previous Reel
      handlePrevReel();
    }
  };

  // Mouse Drag Handlers for Desktop Swiping
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('a')) return;
    setIsDragging(true);
    setDragStartY(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientY - dragStartY;
    setDragOffset(diff * 0.4);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const diffY = dragStartY - e.clientY;
    setDragOffset(0);
    if (diffY > 45) {
      handleNextReel();
    } else if (diffY < -45) {
      handlePrevReel();
    }
  };

  // Keyboard navigation (ArrowUp, ArrowDown, PageUp, PageDown)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevReel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentReelIndex, isTransitioning]);

  // Render the core vertical interactive reel card
  const renderReelItem = (reel, index) => {
    const isActive = index === currentReelIndex;
    return (
      <div 
        key={reel.id}
        className="w-full h-full relative flex-shrink-0 flex flex-col justify-between select-none overflow-hidden"
      >
        {/* Full-Screen Background Image with Cinematic Scrim */}
                <ReelVideoPlayer 
          reel={reel} 
          isActive={isActive} 
          isGlobalMuted={isGlobalMuted} 
          toggleMute={() => setIsGlobalMuted(!isGlobalMuted)} 
        />

        {/* Top Header Overlay: Feed Tabs & Quick Icons (Desktop Only) */}
        <div className="hidden md:flex relative z-30 w-full px-4 pt-3 pb-2 items-center justify-between pointer-events-auto">
          {/* Red Arch Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-8 h-8 drop-shadow-md" color="#d00000" />
          </div>



          {/* Right Action Icons */}
          <div className="flex items-center gap-2 text-white">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('shop');
              }} 
              className="p-1 hover:text-[#d00000] transition-colors"
              title="Search"
            >
              <span className="material-symbols-outlined text-[22px] drop-shadow-sm">search</span>
            </button>
          </div>
        </div>

        {/* Audio Track Floating Pill (Desktop Only) */}
        <div className="hidden md:flex relative z-20 self-center px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-[11px] items-center gap-1.5 border border-white/10 shadow-sm mt-1">
          <span className="material-symbols-outlined text-[14px] text-[#d00000] animate-pulse">music_note</span>
          <span className="truncate max-w-[200px]">{reel.music}</span>
        </div>

        {/* Main Content Area (Action Sidebar + Creator Info + Product Card) */}
        <div className="relative z-30 w-full p-4 flex flex-col justify-end pb-4 h-full pointer-events-none">
          {/* Action Sidebar (Anchored on Right) */}
          <div className="absolute right-2 bottom-[90px] z-30 flex flex-col items-center gap-5 text-white drop-shadow-md pointer-events-auto">
            {/* Creator Avatar with Follow (+) */}
            <div 
              className="relative cursor-pointer group mb-2" 
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab('profile');
              }}
            >
              <img 
                src={reel.avatar} 
                alt={reel.creatorHandle} 
                className="w-[42px] h-[42px] rounded-full border-2 border-white object-cover shadow-xl group-hover:scale-105 transition-transform"
              />
              <div 
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[14px] shadow-md transition-all ${
                  isFollowed ? 'bg-emerald-500 text-white' : 'bg-[#d00000] text-white'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFollowed(!isFollowed);
                }}
              >
                <span className="material-symbols-outlined text-[14px] font-bold">
                  {isFollowed ? 'check' : 'add'}
                </span>
              </div>
            </div>

            {/* Like Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }} 
              className="flex flex-col items-center group"
            >
              <span 
                className={`material-symbols-outlined text-[34px] drop-shadow-lg transition-transform ${isLiked ? 'text-[#d00000] scale-110' : 'text-white/90 hover:scale-110'}`}
                style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
              <span className="text-[12px] font-bold mt-1 drop-shadow-md">
                {(likesCount / 1000).toFixed(1)}K
              </span>
            </button>

            {/* Comments Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsCommentsOpen(true);
              }} 
              className="flex flex-col items-center group text-white/90 hover:text-white"
            >
              <span className="material-symbols-outlined text-[32px] drop-shadow-lg transition-transform hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>
                chat_bubble
              </span>
              <span className="text-[12px] font-bold mt-1 drop-shadow-md">{reel.comments}</span>
            </button>

            {/* Share Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({ title: reel.caption, url: window.location.href })
                    .catch((err) => {
                      if (err.name !== 'AbortError') {
                        console.error('Error sharing:', err);
                      }
                    });
                }
              }} 
              className="flex flex-col items-center group text-white/90 hover:text-white"
            >
              <span className="material-symbols-outlined text-[34px] drop-shadow-lg transition-transform hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>
                reply
              </span>
              <span className="text-[12px] font-bold mt-1 drop-shadow-md">342</span>
            </button>

            {/* Pinterest/Save Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsSaved(!isSaved);
              }} 
              className="flex flex-col items-center group text-white/90 hover:text-white"
            >
              <div className="w-8 h-8 rounded-full bg-[#d00000] flex items-center justify-center text-white shadow-lg font-serif font-black text-lg leading-none pt-0.5">
                P
              </div>
            </button>
            
            {/* Spinning Music Disc */}
            <div className="w-[34px] h-[34px] mt-1 rounded-full bg-slate-900 border-[6px] border-white/20 flex items-center justify-center shadow-lg animate-spin" style={{ animationDuration: '4s' }}>
              <img src={reel.avatar} className="w-full h-full rounded-full object-cover" />
            </div>
          </div>

          <div className="w-full pr-[60px] flex flex-col justify-end space-y-3 mt-auto pointer-events-auto">
            {/* Floating Product Pill */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                const matched = products?.find(p => p.id === reel.product?.id) || reel.product;
                openProductDetail(matched);
              }}
              className="inline-flex w-fit items-center gap-2 bg-white rounded-xl py-1.5 px-1.5 pr-4 shadow-lg cursor-pointer hover:bg-gray-50 active:scale-95 transition-transform"
            >
              <img src={reel.product.image} className="w-8 h-8 rounded-lg object-cover" />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-900 leading-tight">{reel.product.title}</span>
                <span className="text-[10px] font-bold text-[#d00000] leading-tight">EGP {reel.product.price}</span>
              </div>
              <span className="material-symbols-outlined text-[14px] text-gray-400 ml-1">chevron_right</span>
            </div>

            {/* Creator Info */}
            <div className={`space-y-1 ${isAr ? 'text-right' : 'text-left'}`}>
              <div 
                className="flex items-center gap-1.5 cursor-pointer w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('profile');
                }}
              >
                <span className="font-bold text-[15px] text-white drop-shadow-md hover:underline">@{reel.creatorHandle}</span>
                <span className="material-symbols-outlined text-[16px] text-blue-500 bg-white rounded-full">check_circle</span>
              </div>
              <p className="text-[13px] text-white drop-shadow-md leading-snug">
                {reel.caption}
              </p>
              <p className="text-[13px] font-bold text-white drop-shadow-md">
                #EgyptianFashion #OOTD #Style
              </p>
            </div>
            
            {/* Shop Now Full Width Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickBuy(reel.product);
              }}
              className="w-full py-3 mt-1 rounded-xl bg-[#cc0000] text-white text-[15px] font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>{isAr ? 'تسوق الآن' : 'Shop Now'}</span>
            </button>
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
            {/* Smooth Sliding Reel Container */}
            <div 
              className="w-full h-full transition-transform duration-500 ease-out"
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
          {/* Smooth Sliding Reels Container */}
          <div 
            className="w-full h-full transition-transform duration-300 ease-out flex flex-col"
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
