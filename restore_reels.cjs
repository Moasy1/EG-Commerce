const fs = require('fs');

const missingMiddle = `
    <div className="absolute inset-0 bg-black" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={reel.videoBg}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isGlobalMuted}
      />
      {/* Mute Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"
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
        const storedReels = await ReelsService.getAllReels();
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
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevReel = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentReelIndex((prev) => (prev - 1 + reelsList.length) % reelsList.length);
    setIsLiked(false);
    setIsSaved(false);
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
    const diff = currentY - touchStartY;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!touchStartY) return;
    if (dragOffset < -80) {
      handleNextReel();
    } else if (dragOffset > 80) {
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
    const diff = e.clientY - dragStartY;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset < -100) {
      handleNextReel();
    } else if (dragOffset > 100) {
      handlePrevReel();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const renderReelItem = (reel, index) => {
    const isActive = index === currentReelIndex;
    return (
      <div className="w-full h-full relative" key={reel.id}>
        <ReelVideoPlayer reel={reel} isActive={isActive} isGlobalMuted={isGlobalMuted} toggleMute={() => setIsGlobalMuted(!isGlobalMuted)} />
        
        {/* Right Sidebar Interactions */}
        <div className="absolute right-4 bottom-28 flex flex-col gap-6 z-20 pointer-events-none items-center">
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
                <span className={\`material-symbols-outlined text-[24px] transition-colors \${isLiked ? 'text-[#d00000] drop-shadow-md' : 'text-white'}\`} style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
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
                <span className={\`material-symbols-outlined text-[24px] \${isSaved ? 'text-yellow-400' : 'text-white'}\`} style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
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

        <div className="w-full pr-[60px] flex flex-col justify-end space-y-3 mt-auto pointer-events-auto">
`;

let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// Replace the buggy start with the fully restored content up to the `Floating Product Pill`!
const brokenPart = content.split('            {/* Floating Product Pill(s) */}')[0];

content = content.replace(brokenPart, brokenPart.split("  return (")[0] + missingMiddle);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Restored DiscoverReels.jsx!");
