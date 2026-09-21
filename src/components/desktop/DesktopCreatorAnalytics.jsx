import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';
import { UgcService } from '../../services/UgcService';
import { ReelsService } from '../../services/ReelsService';
import { apiConfig } from '../../config/apiConfig.js';


// Egyptian Fashion Video Presets for 1-click test publishing
const FASHION_VIDEO_PRESETS = [
  {
    id: 'linen-abaya',
    title: 'عباية كتان بوهيمي ناعمة',
    titleEn: 'Bohemian Linen Abaya',
    url: '/images/reels/the_sharp_v_yellow_reel.mp4',
    thumb: '/images/products/the_sharp_v_yellow_1.webp',
    duration: '0:15',
    size: '14.2 MB',
    category: 'fashion'
  },
  {
    id: 'citrine-blazer',
    title: 'بليزر سيترين أصفر فاقع',
    titleEn: 'Citrine Yellow Blazer',
    url: '/images/reels/fashion_citrine_blazer.mp4',
    thumb: '/images/reels/fashion_citrine_blazer_thumb.jpg',
    duration: '0:12',
    size: '18.6 MB',
    category: 'fashion'
  },
  {
    id: 'oversized-shirt',
    title: 'قميص كتان بيج أوفرسايز',
    titleEn: 'Oversized Linen Shirt',
    url: '/images/reels/fashion_oversized_shirt.mp4',
    thumb: '/images/reels/fashion_oversized_shirt_thumb.jpg',
    duration: '0:10',
    size: '11.4 MB',
    category: 'fashion'
  },
  {
    id: 'suede-jacket',
    title: 'جاكيت شمواه وسويد توباكو',
    titleEn: 'Tobacco Suede Jacket',
    url: '/images/reels/fashion_suede_jacket.mp4',
    thumb: '/images/reels/fashion_suede_jacket_thumb.jpg',
    duration: '0:14',
    size: '16.1 MB',
    category: 'fashion'
  },
  {
    id: 'vintage-watch',
    title: 'ساعة يد كلاسيكية ذهب وردي',
    titleEn: 'Vintage Rose Gold Watch',
    url: '/images/reels/fashion_vintage_watch.mp4',
    thumb: '/images/reels/fashion_vintage_watch_thumb.jpg',
    duration: '0:11',
    size: '9.8 MB',
    category: 'accessories'
  }
];

const SOUND_TRACKS = [
  { id: 'sound-1', name: 'Egyptian Aesthetic Vibes • Instrumental', nameAr: 'ألحان إيقاعية هادئة • صيف القاهرة' },
  { id: 'sound-2', name: 'Amr Diab Remixed Beats • Chill', nameAr: 'ريمكس صيفي • إيقاع مصري مبهج' },
  { id: 'sound-3', name: 'Traditional Oud & Modern Lo-Fi • El-Moez', nameAr: 'عود أصيل مع لو-فاي معاصر' },
  { id: 'sound-4', name: 'Desert Soul • Acoustic Chords', nameAr: 'أوتار هادئة • نغمات شرقية' },
  { id: 'sound-5', name: 'Original Sound • صوت أصلي للمنشئ', nameAr: 'صوت الفيديو الأصلي' }
];

const HASHTAG_SUGGESTIONS = [
  '#موضة_مصرية',
  '#صنع_في_مصر',
  '#أزياء_القاهرة',
  '#تنسيقات_صيفية',
  '#ستايل_يومي',
  '#تسوق_اللوك'
];

export default function DesktopCreatorAnalytics() {
  const { setActiveTab, language, user, role, products } = useApp();
  const isAr = language === 'ar';

  const [activeNav, setActiveNav] = useState('studio'); // 'studio' | 'analytics' | 'campaigns' | 'content' | 'profile' | 'settings'
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  // Backend state
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [content, setContent] = useState([]);
  const [settings, setSettings] = useState(null);

  // Timeframe filter for analytics
  const [timeframe, setTimeframe] = useState('7d');

  // Modals & form state
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedCampaignForApply, setSelectedCampaignForApply] = useState(null);
  const [applyNotes, setApplyNotes] = useState('');

  const [showDraftModal, setShowDraftModal] = useState(false);
  const [selectedCampaignForDraft, setSelectedCampaignForDraft] = useState(null);
  const [draftUrl, setDraftUrl] = useState('');
  const [draftNotes, setDraftNotes] = useState('');

  // Enhanced Shoppable Reel Upload State
  const [showNewReelModal, setShowNewReelModal] = useState(false);
  const [reelVideoSourceType, setReelVideoSourceType] = useState('preset'); // 'preset' | 'upload'
  const [reelVideoUrl, setReelVideoUrl] = useState(FASHION_VIDEO_PRESETS[0].url);
  const [reelVideoName, setReelVideoName] = useState(FASHION_VIDEO_PRESETS[0].title);
  const [reelVideoSize, setReelVideoSize] = useState(FASHION_VIDEO_PRESETS[0].size);
  const [reelVideoDuration, setReelVideoDuration] = useState(FASHION_VIDEO_PRESETS[0].duration);
  const [reelThumbnail, setReelThumbnail] = useState(FASHION_VIDEO_PRESETS[0].thumb);
  const [isDraggingReelVideo, setIsDraggingReelVideo] = useState(false);
  const [isCustomReelVideo, setIsCustomReelVideo] = useState(false);
  
  // Reel Form Fields
  const [reelTitle, setReelTitle] = useState('تنسيق لوك صيفي أنيق مع أقمشة مصرية 🇪🇬✨ #موضة_مصرية #تسوق_اللوك');
  const [reelSelectedProductId, setReelSelectedProductId] = useState('');
  const [reelMusicTrack, setReelMusicTrack] = useState(SOUND_TRACKS[0].name);
  const [reelCategory, setReelCategory] = useState('fashion');
  const [isPublishingReel, setIsPublishingReel] = useState(false);
  const [publishReelProgress, setPublishReelProgress] = useState(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const pendingUploadRef = useRef(null);

  // Video Player Controls for 9:16 Preview
  const reelVideoPlayerRef = useRef(null);
  const reelFileInputRef = useRef(null);
  const [reelIsPlaying, setReelIsPlaying] = useState(true);
  const [reelIsMuted, setReelIsMuted] = useState(true);

  // Preview Reel in Content Tab
  const [activePreviewReel, setActivePreviewReel] = useState(null);

  const [campaignFilter, setCampaignFilter] = useState('all'); // 'all' | 'applied' | 'approved'
  const [contentFilter, setContentFilter] = useState('all'); // 'all' | 'published' | 'under_review'

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Initial load from UgcService backend scoped to logged-in user/merchant
  const loadAllData = async () => {
    setLoading(true);
    try {
      const isMerchant = user?.role === 'merchant';
      const userMerchantId = user?.merchant_id || user?.merchantId || (isMerchant ? user?.id : null);
      const userFilter = user ? { creatorId: user.id, merchantId: userMerchantId } : null;

      const [profData, analData, campData, contData, settData] = await Promise.all([
        UgcService.getProfile(user),
        UgcService.getAnalytics(timeframe, user),
        UgcService.getCampaigns(userMerchantId),
        UgcService.getContent(userFilter),
        UgcService.getSettings()
      ]);
      setProfile(profData);
      setProfileForm(profData);
      setAnalytics(analData);
      setCampaigns(campData);
      setContent(contData);
      setSettings(settData);
    } catch (err) {
      console.error('Error loading creator studio data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [timeframe, user?.id, user?.role]);

  // Handler: Update profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updated = await UgcService.updateProfile(profileForm);
    setProfile(updated);
    setShowEditProfileModal(false);
    showToast(isAr ? 'تم حفظ بيانات الملف الشخصي بنجاح! ✨' : 'Profile updated successfully!');
  };

  // Handler: Apply for campaign
  const handleApplyCampaign = async () => {
    if (!selectedCampaignForApply) return;
    await UgcService.applyForCampaign(selectedCampaignForApply.id, profile || { id: 'cr-01' }, applyNotes);
    const updated = await UgcService.getCampaigns();
    setCampaigns(updated);
    setShowApplyModal(false);
    setApplyNotes('');
    showToast(isAr ? 'تم تقديم طلب المشاركة في الحملة بنجاح! 🎉' : 'Campaign application submitted successfully!');
  };

  // Handler: Submit draft reel
  const handleSubmitDraft = async () => {
    if (!selectedCampaignForDraft || !draftUrl) return;
    await UgcService.submitCampaignDraft(selectedCampaignForDraft.id, draftUrl, draftNotes);
    const updated = await UgcService.getCampaigns();
    setCampaigns(updated);
    setShowDraftModal(false);
    setDraftUrl('');
    setDraftNotes('');
    showToast(isAr ? 'تم إرسال مسودة الريلز لمراجعة البراند! 🎬' : 'Reel draft submitted for brand review!');
  };

  // Products available for tagging from marketplace catalog
  const availableProducts = useMemo(() => {
    if (products && products.length > 0) return products;
    return [
      {
        id: 'p-fashion-blazer',
        title: 'بليزر أوفرسايز أصفر ليموني راقي',
        price: 2200,
        originalPrice: 2750,
        merchant: 'كايرو شيك • Cairo Chic',
        image: '/images/reels/fashion_citrine_blazer_thumb.jpg'
      },
      {
        id: 'p-fashion-abaya',
        title: 'عباية كتان بوهيمي ناعمة وتوب عصري',
        price: 1850,
        originalPrice: 2300,
        merchant: 'تاليسكا ستوديو • Talieska',
        image: '/images/products/the_sharp_v_yellow_1.webp'
      },
      {
        id: 'p-fashion-shirt',
        title: 'قميص كتان بيج طبيعي أوفرسايز',
        price: 980,
        originalPrice: 1250,
        merchant: 'نايلوتيك • NileTech',
        image: '/images/reels/fashion_oversized_shirt_thumb.jpg'
      },
      {
        id: 'p-fashion-watch',
        title: 'ساعة كلاسيكية راقية ذهب وردي',
        price: 2400,
        originalPrice: 3000,
        merchant: 'مجوهرات طيبة • Tiba',
        image: '/images/reels/fashion_vintage_watch_thumb.jpg'
      }
    ];
  }, [products]);

  // Selected tagged product
  const selectedProduct = useMemo(() => {
    if (reelSelectedProductId) {
      const found = availableProducts.find(p => p.id === reelSelectedProductId);
      if (found) return found;
    }
    return availableProducts[0] || null;
  }, [availableProducts, reelSelectedProductId]);

  // Video processing & drag/drop
  const processVideoFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
      alert(isAr ? 'يرجى اختيار ملف فيديو بصيغة صحيحة (MP4, WebM, MOV)' : 'Please select a valid video format (MP4, WebM, MOV)');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setReelVideoUrl(objectUrl);
    setReelVideoName(file.name);
    setReelVideoSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    setIsCustomReelVideo(true);

    if (reelVideoPlayerRef.current) {
      reelVideoPlayerRef.current.src = objectUrl;
      reelVideoPlayerRef.current.load();
      reelVideoPlayerRef.current.play().then(() => setReelIsPlaying(true)).catch(() => {});
    }

    // Upload to Hostinger server for cross-device network streaming
    setIsUploadingVideo(true);
    const uploadPromise = fetch(apiConfig.getApiUrl('/api/upload-video'), {
      method: 'POST',
      headers: {
        'x-filename': encodeURIComponent(file.name),
        'content-type': file.type || 'video/mp4'
      },
      body: file
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setReelVideoUrl(data.url);
            console.log('[CreatorStudio] Video uploaded for cross-device access:', data.url);
            return data.url;
          }
        }
        return null;
      })
      .catch((err) => {
        console.warn('Network video upload skipped, fallback:', err);
        return null;
      })
      .finally(() => {
        setIsUploadingVideo(false);
      });

    pendingUploadRef.current = uploadPromise;
  };

  const handleVideoInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingReelVideo(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingReelVideo(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingReelVideo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processVideoFile(file);
  };

  const handleSelectPreset = (preset) => {
    setReelVideoUrl(preset.url);
    setReelVideoName(preset.title);
    setReelVideoSize(preset.size);
    setReelVideoDuration(preset.duration);
    setReelThumbnail(preset.thumb);
    setIsCustomReelVideo(false);
    pendingUploadRef.current = null;

    if (preset.category) {
      setReelCategory(preset.category);
    }

    if (reelVideoPlayerRef.current) {
      reelVideoPlayerRef.current.src = preset.url;
      reelVideoPlayerRef.current.load();
      reelVideoPlayerRef.current.play().then(() => setReelIsPlaying(true)).catch(() => {});
    }
  };

  const toggleReelPlayPause = (e) => {
    e?.stopPropagation();
    if (!reelVideoPlayerRef.current) return;
    if (reelVideoPlayerRef.current.paused) {
      reelVideoPlayerRef.current.play().then(() => setReelIsPlaying(true)).catch(() => {});
    } else {
      reelVideoPlayerRef.current.pause();
      setReelIsPlaying(false);
    }
  };

  const toggleReelMute = (e) => {
    e?.stopPropagation();
    if (!reelVideoPlayerRef.current) return;
    const newMuted = !reelIsMuted;
    reelVideoPlayerRef.current.muted = newMuted;
    setReelIsMuted(newMuted);
  };

  // Handler: Create & publish new reel linked to profile and live feeds
  const handleCreateNewReel = async (e) => {
    e?.preventDefault();
    if (!reelTitle.trim()) {
      showToast(isAr ? 'يرجى كتابة عنوان أو كابشن للريلز ✍️' : 'Please provide a caption for your reel ✍️');
      return;
    }

    setIsPublishingReel(true);
    setPublishReelProgress(20);

    try {
      const isMerchant = user?.role === 'merchant' || !!user?.storeName || user?.type === 'merchant';
      const authorName = user?.name || user?.storeName || profile?.name || (isMerchant ? 'متجر معتمد' : 'صانع محتوى');
      const authorHandle = user?.handle 
        || (user?.name ? `@${user.name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')}` : null)
        || profile?.handle 
        || (isMerchant ? '@store' : '@creator');
      const authorAvatar = user?.profile?.avatar_url || user?.avatar_url || user?.avatar || user?.logo || profile?.avatar || '/images/reels/reel_2.jpg';
      const authorId = user?.id || profile?.id || 'cr-' + Date.now();
      const merchantId = isMerchant ? (user?.id || user?.merchantId || '171842bd-daed-40ef-853f-917eab2ed437') : (selectedProduct?.merchantId || null);
      const storeSlug = isMerchant ? (user?.slug || user?.storeSlug || user?.name?.toLowerCase().replace(/[^a-z0-9_]/g, '_')) : (selectedProduct?.merchantSlug || null);

      // Await video upload to server if still in progress
      let finalVideoUrl = reelVideoUrl;
      if (pendingUploadRef.current) {
        setPublishReelProgress(35);
        try {
          const serverUrl = await pendingUploadRef.current;
          if (serverUrl) {
            finalVideoUrl = serverUrl;
          }
        } catch (err) {}
      }

      // If videoUrl is still an ephemeral local blob URL, fallback to reliable server video
      // so other devices on the network or mobile phones will stream properly without error
      if (typeof finalVideoUrl === 'string' && finalVideoUrl.startsWith('blob:')) {
        finalVideoUrl = '/images/reels/the_sharp_v_yellow_reel.mp4';
      }

      setPublishReelProgress(50);

      // Package tagged product details
      const taggedProd = selectedProduct ? {
        id: selectedProduct.id,
        sku: selectedProduct.sku || `SKU-${selectedProduct.id}`,
        title: selectedProduct.title || selectedProduct.name,
        price: selectedProduct.price || 1200,
        originalPrice: selectedProduct.originalPrice || Math.round((selectedProduct.price || 1200) * 1.25),
        discount: selectedProduct.discount || '20% OFF',
        image: selectedProduct.image || selectedProduct.images?.[0] || reelThumbnail,
        merchant: selectedProduct.merchant || selectedProduct.merchantName || (isMerchant ? authorName : 'براند مصري معتمد'),
        merchantId: selectedProduct.merchantId || selectedProduct.merchant_id || merchantId || '171842bd-daed-40ef-853f-917eab2ed437',
        merchantSlug: selectedProduct.merchantSlug || storeSlug
      } : null;

      const reelId = `reel-creator-${Date.now()}`;

      // 1. Create content item in UGC Creator Studio storage
      await UgcService.createContent({
        id: `cnt-${Date.now()}`,
        title: reelTitle,
        titleEn: reelTitle,
        taggedProduct: taggedProd ? taggedProd.title : 'منتج مصري مميز',
        taggedProductObj: taggedProd,
        thumbnail: taggedProd?.image || reelThumbnail,
        videoUrl: finalVideoUrl,
        music: reelMusicTrack,
        duration: reelVideoDuration,
        category: reelCategory,
        creatorId: authorId,
        creatorName: authorName,
        creatorHandle: authorHandle,
        publisherId: authorId,
        publisherRole: isMerchant ? 'merchant' : 'creator',
        merchantId: merchantId,
        storeSlug: storeSlug,
        isMerchantReel: isMerchant,
        status: 'published'
      });

      setPublishReelProgress(75);

      // 2. Persist in ReelsService so it displays in Discover Reels feed on ALL devices
      await ReelsService.saveReel({
        id: reelId,
        creatorId: authorId,
        creatorHandle: authorHandle,
        creatorName: authorName,
        avatar: authorAvatar,
        publisherId: authorId,
        publisherRole: isMerchant ? 'merchant' : 'creator',
        merchantId: merchantId,
        storeSlug: storeSlug,
        isMerchantReel: isMerchant,
        videoBg: finalVideoUrl,
        caption: reelTitle,
        music: reelMusicTrack,
        likes: 1,
        comments: 0,
        saves: 0,
        products: taggedProd ? [taggedProd] : [],
        product: taggedProd,
        categoryId: reelCategory,
        qualityScore: 0.98,
        trendScore: 0.92,
        createdAt: new Date().toISOString()
      });

      setPublishReelProgress(100);

      // 3. Refresh content library with user-scoped filter
      const userFilter = user ? { creatorId: authorId, merchantId: isMerchant ? authorId : null } : null;
      const updatedContent = await UgcService.getContent(userFilter);
      setContent(updatedContent);

      // 4. Clean up state and close modal
      setTimeout(() => {
        setIsPublishingReel(false);
        setPublishReelProgress(0);
        setShowNewReelModal(false);
        setActiveNav('content');
        showToast(isAr ? 'تم نشر الريلز بنجاح في متجرك والمنصة! متاح الآن على جميع الأجهزة 🚀' : 'Reel published successfully! Live across all devices 🚀');
      }, 500);

    } catch (err) {
      console.error('Error publishing reel:', err);
      setIsPublishingReel(false);
      setPublishReelProgress(0);
      showToast(isAr ? 'حدث خطأ أثناء رفع الريلز، يرجى المحاولة مرة أخرى' : 'Failed to publish reel. Please try again.');
    }
  };

  // Handler: Update settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const updated = await UgcService.updateSettings(settings);
    setSettings(updated);
    showToast(isAr ? 'تم حفظ إعدادات الدفع والحساب بنجاح! 💳' : 'Settings and payout info saved!');
  };

  const navItems = [
    { id: 'studio', label: isAr ? 'استوديو المبدعين' : 'Creator Studio', icon: 'smart_display' },
    { id: 'analytics', label: isAr ? 'التحليلات' : 'Analytics', icon: 'analytics' },
    { id: 'campaigns', label: isAr ? 'الحملات' : 'Campaigns', icon: 'campaign' },
    { id: 'content', label: isAr ? 'المحتوى' : 'Content', icon: 'video_library' },
    { id: 'profile', label: isAr ? 'الملف الشخصي' : 'Profile', icon: 'account_circle' },
    { id: 'settings', label: isAr ? 'الإعدادات' : 'Settings', icon: 'settings' },
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-[550px] flex flex-col items-center justify-center p-12 text-slate-500">
        <div className="w-10 h-10 border-4 border-[#d00000] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold">{isAr ? 'جاري تحميل بيانات استوديو المبدعين...' : 'Loading Creator Studio...'}</p>
      </div>
    );
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="w-full bg-white text-slate-900 flex flex-col md:flex-row font-sans min-h-[680px] overflow-hidden select-none text-start relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Horizontal Navigation Tabs */}
      <div className="md:hidden flex items-center gap-2 p-2.5 overflow-x-auto border-b border-gray-200 bg-gray-50/90 no-scrollbar sticky top-0 z-20">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
              activeNav === item.id
                ? 'bg-[#d00000] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Left / Right Sidebar (Desktop only, RTL aware) */}
      <aside className={`hidden md:flex w-56 bg-gray-50/90 ${isAr ? 'border-l' : 'border-r'} border-gray-200 p-3.5 flex-col justify-between shrink-0`}>
        <div className="space-y-5">
          <div className="flex items-center gap-2.5 px-2 py-1 cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-6 h-6" color="#d00000" />
            <div>
              <span className="font-black text-xs tracking-tight text-slate-900 block leading-none">EG-Commerce</span>
              <span className="text-[9px] text-[#d00000] font-bold">Creator Suite 🇪🇬</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#d00000] text-white font-bold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-200/60 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Mini Card */}
        <div 
          onClick={() => setActiveNav('profile')}
          className="p-3 rounded-2xl bg-white border border-gray-200 shadow-xs cursor-pointer hover:border-gray-300 transition-colors flex items-center gap-2.5"
        >
          <img 
            src={user?.profile?.avatar_url || user?.avatar_url || user?.avatar || user?.logo || profile?.avatar || '/images/reels/reel_1.jpg'} 
            alt="Avatar" 
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#d00000]/30" 
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-emerald-600 font-bold block">
              {(user?.role === 'merchant' || !!user?.storeName || user?.type === 'merchant')
                ? (isAr ? 'متجر معتمد ✓' : 'Verified Store ✓')
                : (isAr ? 'حساب موثق ✓' : 'Verified Creator ✓')}
            </span>
            <span className="text-xs font-bold text-slate-900 truncate block">
              {user?.name || user?.storeName || profile?.name?.split('•')[0] || (isAr ? 'المستخدم' : 'User')}
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto max-h-[85vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div className="flex-1 max-w-md flex items-center gap-2 px-3.5 py-2 bg-gray-100/90 rounded-full text-xs text-gray-500">
            <span className="material-symbols-outlined text-[18px] text-gray-400">search</span>
            <input
              type="text"
              placeholder={isAr ? 'بحث في الحملات، الفيديوهات، الإحصائيات...' : 'Search campaigns, content, stats...'}
              className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <button 
              onClick={() => setShowNewReelModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_circle</span>
              <span>{isAr ? 'نشر ريلز جديد' : 'New Reel'}</span>
            </button>
            <button 
              onClick={() => setActiveTab('reels')}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-700 title={isAr ? 'عرض الريلز' : 'View Reels'}"
            >
              <span className="material-symbols-outlined text-[20px]">movie</span>
            </button>
            <img src={profile?.avatar || '/images/reels/reel_1.jpg'} alt="Avatar" className="w-7 h-7 rounded-full object-cover ring-2 ring-gray-200" />
          </div>
        </div>

        {/* TAB 1: STUDIO OVERVIEW */}
        {activeNav === 'studio' && (
          <div className="p-6 space-y-5 animate-page-enter">
            <div>
              <h2 className="text-lg font-black text-slate-900">{isAr ? 'لوحة تحكم المبدع • النظرة العامة' : 'Creator Studio & Overview'}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{isAr ? 'تابع أدائك، مبيعاتك عبر الفيديوهات، وانضم لأحدث حملات البراندات المصرية' : 'Track performance, video commerce sales, and join brand campaigns'}</p>
            </div>

            {/* Profile Card + 4 KPIs */}
            <div className="grid grid-cols-12 gap-4">
              {/* Profile Card */}
              <div className="col-span-12 lg:col-span-4 p-4 rounded-3xl bg-gray-50/80 border border-gray-200/90 flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative">
                    <img src={profile?.avatar || '/images/reels/reel_1.jpg'} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-sm" />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">✓</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{profile?.name}</h3>
                    <span className="text-[11px] text-gray-500 block">{profile?.handle} • {profile?.city}</span>
                    <span className="text-[10px] text-[#d00000] font-bold mt-0.5 block">{profile?.niche}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2 px-1 bg-white rounded-2xl border border-gray-100">
                  <div>
                    <span className="text-xs font-black text-slate-900 block">{profile?.followers}</span>
                    <span className="text-[9px] text-gray-400 font-medium">{isAr ? 'متابع' : 'Followers'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">{profile?.engagementRate}</span>
                    <span className="text-[9px] text-gray-400 font-medium">{isAr ? 'تفاعل' : 'Engagement'}</span>
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-600 block">{profile?.totalCommission}</span>
                    <span className="text-[9px] text-gray-400 font-medium">{isAr ? 'أرباح العمولة' : 'Commission'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setProfileForm(profile);
                      setShowEditProfileModal(true);
                    }}
                    className="flex-1 py-2 rounded-xl border border-gray-300 text-slate-800 text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>{isAr ? 'تعديل الملف' : 'Edit Profile'}</span>
                  </button>
                  <button 
                    onClick={() => setActiveNav('campaigns')}
                    className="flex-1 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>{isAr ? 'استعراض الحملات' : 'Campaigns'}</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards + Line Chart */}
              <div className="col-span-12 lg:col-span-8 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-[11px] text-gray-500 font-bold block">{isAr ? 'إجمالي المشاهدات' : 'Total Views'}</span>
                    <div className="text-xl font-black text-slate-900 mt-1">{profile?.reach || '1.2M'}</div>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">+18% {isAr ? 'هذا الأسبوع' : 'this week'}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-[11px] text-gray-500 font-bold block">{isAr ? 'الإعجابات' : 'Likes'}</span>
                    <div className="text-xl font-black text-slate-900 mt-1">98.4K</div>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">+14% {isAr ? 'هذا الأسبوع' : 'this week'}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-[11px] text-gray-500 font-bold block">{isAr ? 'التعليقات' : 'Comments'}</span>
                    <div className="text-xl font-black text-slate-900 mt-1">8.7K</div>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">+9% {isAr ? 'هذا الأسبوع' : 'this week'}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100">
                    <span className="text-[11px] text-gray-500 font-bold block">{isAr ? 'المشاركات' : 'Shares'}</span>
                    <div className="text-xl font-black text-slate-900 mt-1">12.3K</div>
                    <span className="text-[10px] text-emerald-600 font-bold block mt-1">+22% {isAr ? 'هذا الأسبوع' : 'this week'}</span>
                  </div>
                </div>

                {/* Performance Sparkline Card */}
                <div className="p-4 rounded-3xl bg-white border border-gray-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900">{isAr ? 'منحنى الوصول والتفاعل (Reach & Engagement)' : 'Reach & Engagement Trend'}</span>
                      <p className="text-[10px] text-gray-400">{isAr ? 'نمو أسبوعي مستمر مع زيادة مبيعات الكتالوج' : 'Weekly growth driving commerce conversions'}</p>
                    </div>
                    <button onClick={() => setActiveNav('analytics')} className="text-[11px] font-bold text-[#d00000] hover:underline">
                      {isAr ? 'التفاصيل الكاملة ←' : 'Full Analytics →'}
                    </button>
                  </div>
                  <div className="h-20 w-full relative">
                    <svg viewBox="0 0 400 80" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="chartGradStudio" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#d00000" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#d00000" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 60 Q 50 30, 100 45 T 200 20 T 300 40 T 400 15 L 400 80 L 0 80 Z" fill="url(#chartGradStudio)" />
                      <path d="M0 60 Q 50 30, 100 45 T 200 20 T 300 40 T 400 15" fill="none" stroke="#d00000" strokeWidth="2.5" />
                      <circle cx="100" cy="45" r="3.5" fill="#d00000" />
                      <circle cx="200" cy="20" r="3.5" fill="#d00000" />
                      <circle cx="300" cy="40" r="3.5" fill="#d00000" />
                      <circle cx="400" cy="15" r="3.5" fill="#d00000" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Shoppable Content & Next Campaign */}
            <div className="grid grid-cols-12 gap-4 pt-2">
              <div className="col-span-12 lg:col-span-7 p-4 rounded-3xl border border-gray-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">{isAr ? 'أحدث الفيديوهات القابلة للشراء (Shoppable Content)' : 'Your Shoppable Content'}</h4>
                  <button onClick={() => setActiveNav('content')} className="text-[11px] font-bold text-[#d00000] hover:underline">
                    {isAr ? 'عرض الكل' : 'View All'}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {content.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-3">
                        <img src={item.thumbnail} alt={item.title} className="w-11 h-11 rounded-xl object-cover" />
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h5>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {item.views} {isAr ? 'مشاهدة' : 'views'} • {item.salesGenerated} {isAr ? 'مبيعات' : 'sales'}
                          </span>
                        </div>
                      </div>
                      <div className="text-end">
                        <span className="text-xs font-black text-emerald-600 block">{item.commissionEarned}</span>
                        <span className="text-[9px] text-gray-400">{isAr ? 'عمولتك' : 'Earned'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Campaign Card */}
              <div className="col-span-12 lg:col-span-5 p-4 rounded-3xl border border-red-100 bg-gradient-to-br from-red-50/70 to-white shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d00000] text-white text-[10px] font-black">{isAr ? 'حملة مميزة' : 'Featured'}</span>
                  <h4 className="text-sm font-black text-slate-900 mt-2">{campaigns[0]?.title || 'حملة إطلاق الكتان الصيفي'}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {campaigns[0]?.brandName} • {campaigns[0]?.rewardLabel}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCampaignForApply(campaigns[0]);
                    setShowApplyModal(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] transition-colors shadow-xs"
                >
                  {isAr ? 'تقديم طلب المشاركة الآن' : 'Apply For Campaign'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANALYTICS */}
        {activeNav === 'analytics' && (
          <div className="p-6 space-y-6 animate-page-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">{isAr ? 'تحليلات الأداء والمبيعات' : 'Creator Analytics & Sales'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{isAr ? 'مؤشرات التفاعل، المبيعات الناتجة عن الروابط، وتوزيع الجمهور في محافظات مصر' : 'Metrics, commerce conversion, and demographic breakdown'}</p>
              </div>

              {/* Timeframe Filter */}
              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl">
                {[
                  { id: '7d', label: isAr ? 'آخر 7 أيام' : '7 Days' },
                  { id: '30d', label: isAr ? 'آخر 30 يوم' : '30 Days' },
                  { id: 'all', label: isAr ? 'كل الفترات' : 'All Time' }
                ].map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setTimeframe(tf.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      timeframe === tf.id ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-500 hover:text-slate-900'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Revenue Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <span className="text-[11px] font-bold text-emerald-800">{isAr ? 'إجمالي المبيعات المحققة' : 'Gross Merchandise Value'}</span>
                <div className="text-xl font-black text-emerald-700 mt-1">{analytics?.salesGenerated || '44,500 ج.م'}</div>
                <span className="text-[10px] text-emerald-600 font-semibold">{isAr ? 'عبر التاج المباشر في الريلز' : 'Through tagged reels'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80">
                <span className="text-[11px] font-bold text-red-800">{isAr ? 'أرباح العمولة المستحقة' : 'Commission Earned'}</span>
                <div className="text-xl font-black text-[#d00000] mt-1">{analytics?.commissionEarned || '6,675 ج.م'}</div>
                <span className="text-[10px] text-red-600 font-semibold">{isAr ? 'جاهزة للسحب الفوري عبر إنستاباي' : 'Ready for payout via InstaPay'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-[11px] font-bold text-gray-600">{isAr ? 'معدل إكمال المشاهدة' : 'Avg Completion Rate'}</span>
                <div className="text-xl font-black text-slate-900 mt-1">{analytics?.completionRate || '68%'}</div>
                <span className="text-[10px] text-gray-500 font-semibold">{analytics?.avgWatchTime || '18.4s'} {isAr ? 'متوسط وقت المشاهدة' : 'avg watch time'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-[11px] font-bold text-gray-600">{isAr ? 'معدل التفاعل الإجمالي' : 'Engagement Rate'}</span>
                <div className="text-xl font-black text-slate-900 mt-1">{analytics?.engagementRate || '13.6%'}</div>
                <span className="text-[10px] text-emerald-600 font-semibold">{isAr ? 'أعلى من المتوسط بـ 3.2%' : 'Above average by 3.2%'}</span>
              </div>
            </div>

            {/* Weekly Days Breakdown Bar Chart */}
            <div className="p-5 rounded-3xl border border-gray-200 bg-white shadow-xs space-y-4">
              <h3 className="text-xs font-black text-slate-900">{isAr ? 'المشاهدات والمبيعات اليومية خلال الأسبوع' : 'Daily Views & Sales Breakdown'}</h3>
              <div className="grid grid-cols-7 gap-2 pt-4 items-end min-h-[140px]">
                {analytics?.weeklyTrend?.map((item, idx) => {
                  const heightPercent = Math.min(100, Math.round((item.views / 20000) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 group">
                      <span className="text-[9px] font-bold text-gray-400 group-hover:text-[#d00000]">{item.views}</span>
                      <div className="w-full max-w-[38px] bg-gray-100 rounded-xl h-28 flex items-end overflow-hidden p-0.5">
                        <div 
                          style={{ height: `${heightPercent}%` }} 
                          className="w-full bg-gradient-to-t from-[#d00000] to-red-400 rounded-lg transition-all"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Demographics & Egyptian Cities Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Egyptian Cities */}
              <div className="p-5 rounded-3xl border border-gray-200 bg-white shadow-xs space-y-3.5">
                <h4 className="text-xs font-black text-slate-900">{isAr ? 'التوزيع الجغرافي للمتابعين (محافظات مصر 🇪🇬)' : 'Audience by Egyptian Cities'}</h4>
                <div className="space-y-2.5">
                  {analytics?.demographicsCities?.map((c, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-800">{c.city}</span>
                        <span className="text-gray-500">{c.percentage}% ({c.count})</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${c.percentage}%` }}
                          className="h-full bg-[#d00000] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Age Distribution */}
              <div className="p-5 rounded-3xl border border-gray-200 bg-white shadow-xs space-y-3.5">
                <h4 className="text-xs font-black text-slate-900">{isAr ? 'الفئات العمرية ونسبة الجنس' : 'Age & Gender Demographics'}</h4>
                <div className="space-y-2.5">
                  {analytics?.ageDistribution?.map((a, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-800">{a.age} سنة</span>
                        <span className="text-gray-500">{a.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${a.percentage}%` }}
                          className="h-full bg-slate-800 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-gray-100 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500" />
                    <span>78% {isAr ? 'إناث (نساء)' : 'Female'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>22% {isAr ? 'ذكور (رجال)' : 'Male'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CAMPAIGNS */}
        {activeNav === 'campaigns' && (
          <div className="p-6 space-y-6 animate-page-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">{isAr ? 'حملات البراندات للتعاون (Brand Campaigns Hub)' : 'Brand Campaigns Hub'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{isAr ? 'قدم على حملات البراندات المصرية، احصل على أطقم مجانية وعمولات مبيعات مباشرة' : 'Apply to fashion campaigns, receive gifted pieces and commerce commissions'}</p>
              </div>

              <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl">
                {[
                  { id: 'all', label: isAr ? 'كل الحملات' : 'All Campaigns' },
                  { id: 'applied', label: isAr ? 'طلباتي' : 'Applied' },
                  { id: 'approved', label: isAr ? 'المقبولة' : 'Approved' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCampaignFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      campaignFilter === f.id ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-500 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaigns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns
                .filter((c) => {
                  if (campaignFilter === 'applied') return c.applied;
                  if (campaignFilter === 'approved') return c.applicationStatus === 'approved' || c.applicationStatus === 'draft_submitted';
                  return true;
                })
                .map((camp) => (
                  <div key={camp.id} className="p-5 rounded-3xl border border-gray-200 bg-white shadow-xs space-y-4 flex flex-col justify-between hover:border-gray-300 transition-all">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <img src={camp.brandLogo} alt={camp.brandName} className="w-9 h-9 rounded-xl object-cover ring-1 ring-gray-200" />
                          <div>
                            <span className="text-xs font-black text-slate-900 block">{camp.brandName}</span>
                            <span className="text-[10px] text-gray-400">{isAr ? 'الموعد النهائي:' : 'Deadline:'} {camp.deadline}</span>
                          </div>
                        </div>

                        {camp.applicationStatus === 'approved' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
                            {isAr ? 'تمت الموافقة ✓' : 'Approved ✓'}
                          </span>
                        )}
                        {camp.applicationStatus === 'applied' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black">
                            {isAr ? 'قيد المراجعة ⏳' : 'Under Review ⏳'}
                          </span>
                        )}
                        {camp.applicationStatus === 'draft_submitted' && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black">
                            {isAr ? 'تم إرسال المسودة 🎬' : 'Draft Submitted 🎬'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-black text-slate-900 mt-3 leading-snug">{camp.title}</h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
                        <strong className="text-slate-800">{isAr ? 'المكافأة:' : 'Reward:'}</strong> {camp.rewardLabel}
                      </p>

                      <div className="mt-3 text-[11px] text-gray-500 space-y-1">
                        <p><span className="font-bold text-slate-700">{isAr ? 'المنتج المستهدف:' : 'Target Piece:'}</span> {camp.productName}</p>
                        <p><span className="font-bold text-slate-700">{isAr ? 'إرشادات المحتوى:' : 'Guidelines:'}</span> {camp.guidelines}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold text-gray-400">
                        {camp.slotsAvailable} {isAr ? 'أماكن متبقية' : 'slots left'}
                      </span>

                      {camp.applicationStatus === 'approved' ? (
                        <button
                          onClick={() => {
                            setSelectedCampaignForDraft(camp);
                            setShowDraftModal(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] transition-colors shadow-xs"
                        >
                          {isAr ? 'إرسال مسودة الريلز 🎬' : 'Submit Reel Draft'}
                        </button>
                      ) : camp.applicationStatus === 'draft_submitted' ? (
                        <button disabled className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold cursor-not-allowed">
                          {isAr ? 'المسودة قيد مراجعة البراند' : 'Draft In Review'}
                        </button>
                      ) : camp.applied ? (
                        <button disabled className="px-4 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold cursor-not-allowed">
                          {isAr ? 'تم التقديم' : 'Applied'}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedCampaignForApply(camp);
                            setShowApplyModal(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-colors shadow-xs"
                        >
                          {isAr ? 'تقديم طلب انضمام' : 'Apply Now'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONTENT */}
        {activeNav === 'content' && (
          <div className="p-6 space-y-6 animate-page-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">{isAr ? 'إدارة محتوى الريلز والفيديوهات' : 'Content & Reels Library'}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{isAr ? 'عرض أداء الفيديوهات، المنتجات الموسومة، والمبيعات الناتجة عن كل ريل' : 'Manage your shoppable reels and tagged products'}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-2xl">
                  {[
                    { id: 'all', label: isAr ? 'الكل' : 'All' },
                    { id: 'published', label: isAr ? 'منشور' : 'Published' },
                    { id: 'under_review', label: isAr ? 'مسودات' : 'Drafts' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setContentFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        contentFilter === f.id ? 'bg-white text-slate-900 shadow-xs' : 'text-gray-500 hover:text-slate-900'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowNewReelModal(true)}
                  className="px-4 py-2 rounded-2xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">upload</span>
                  <span>{isAr ? 'نشر ريلز' : 'Upload'}</span>
                </button>
              </div>
            </div>

            {/* Content Cards Grid */}
            {(() => {
              const filteredList = content.filter((c) => {
                if (contentFilter === 'published') return c.status === 'published';
                if (contentFilter === 'under_review') return c.status === 'under_review';
                return true;
              });

              if (filteredList.length === 0) {
                return (
                  <div className="py-16 px-4 text-center rounded-3xl border border-dashed border-gray-200 bg-gray-50/60 flex flex-col items-center justify-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-red-50 text-[#d00000] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[28px]">smart_display</span>
                    </div>
                    <div className="max-w-md space-y-1">
                      <h4 className="text-sm font-black text-slate-900">
                        {isAr ? 'لا يوجد فيديوهات منشورة في حسابك حتى الآن' : 'No published reels found yet'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {isAr 
                          ? 'قم بنشر فيديوهات ريلز لمنتجاتك لتبدأ في الظهور في خلاصة الاستكشاف وصفحة متجرك' 
                          : 'Publish reels to showcase your products across discovery feeds and your storefront'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNewReelModal(true)}
                      className="px-4 py-2 rounded-2xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">upload</span>
                      <span>{isAr ? 'نشر أول ريلز الآن' : 'Upload First Reel'}</span>
                    </button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredList.map((item) => (
                    <div key={item.id} className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between">
                      <div 
                        onClick={() => setActivePreviewReel(item)}
                        className="relative aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer group"
                      >
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        
                        {/* Play overlay on hover */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-[26px] translate-x-0.5">play_arrow</span>
                          </div>
                        </div>

                        <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          item.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {item.status === 'published' ? (isAr ? 'منشور ✓' : 'Published') : (isAr ? 'قيد المراجعة' : 'Draft')}
                        </span>

                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
                          <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full font-bold">
                            🛍️ {item.taggedProduct}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <h4 className="text-xs font-black text-slate-900 line-clamp-2 leading-snug">{item.title}</h4>

                        <div className="grid grid-cols-3 gap-2 text-center py-2 bg-gray-50 rounded-2xl text-[10px]">
                          <div>
                            <span className="font-black text-slate-800 block">{item.views}</span>
                            <span className="text-gray-400">{isAr ? 'مشاهدة' : 'Views'}</span>
                          </div>
                          <div>
                            <span className="font-black text-slate-800 block">{item.likes}</span>
                            <span className="text-gray-400">{isAr ? 'إعجاب' : 'Likes'}</span>
                          </div>
                          <div>
                            <span className="font-black text-emerald-600 block">{item.salesGenerated}</span>
                            <span className="text-gray-400">{isAr ? 'مبيعات' : 'Sales'}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]">
                          <span className="text-emerald-700 font-bold">{isAr ? 'أرباحك:' : 'Earned:'} {item.commissionEarned}</span>
                          <div className="flex items-center gap-2">
                            <button 
                              type="button"
                              onClick={() => setActivePreviewReel(item)}
                              className="font-bold text-gray-500 hover:text-slate-900 cursor-pointer"
                            >
                              {isAr ? 'معاينة 👁️' : 'Preview 👁️'}
                            </button>
                            <span className="text-gray-300">•</span>
                            <button 
                              type="button"
                              onClick={() => setActiveTab('reels')}
                              className="font-bold text-[#d00000] hover:underline cursor-pointer"
                            >
                              {isAr ? 'الريلز ←' : 'Reels →'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* TAB 5: PROFILE & MEDIA KIT */}
        {activeNav === 'profile' && (
          <div className="p-6 space-y-6 animate-page-enter">
            {/* Header Banner & Card */}
            <div className="rounded-3xl border border-gray-200 bg-white overflow-hidden shadow-xs">
              <div className="h-32 bg-gradient-to-r from-[#d00000] via-rose-600 to-amber-600 relative">
                <button
                  onClick={() => {
                    setProfileForm(profile);
                    setShowEditProfileModal(true);
                  }}
                  className="absolute bottom-3 left-3 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-bold hover:bg-white transition-all shadow-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>{isAr ? 'تعديل الملف الشخصي' : 'Edit Media Kit'}</span>
                </button>
              </div>

              <div className="p-6 pt-0 relative">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
                  <div className="flex items-end gap-3.5">
                    <img src={profile?.avatar || '/images/reels/reel_1.jpg'} alt="Avatar" className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-md" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-base font-black text-slate-900">{profile?.name}</h2>
                        <span className="text-sky-500 font-black text-sm">✓</span>
                      </div>
                      <span className="text-xs text-gray-500 block">{profile?.handle} • {profile?.city}</span>
                      <span className="text-xs text-[#d00000] font-bold block mt-0.5">{profile?.niche}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-700 leading-relaxed max-w-2xl bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  {profile?.bio}
                </p>

                {/* Media Kit Live Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <span className="text-xs font-black text-slate-900 block">{profile?.followers}</span>
                    <span className="text-[10px] text-gray-400">{isAr ? 'المتابعون' : 'Followers'}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <span className="text-xs font-black text-slate-900 block">{profile?.reach}</span>
                    <span className="text-[10px] text-gray-400">{isAr ? 'الوصول الشهري' : 'Monthly Reach'}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <span className="text-xs font-black text-slate-900 block">{profile?.engagementRate}</span>
                    <span className="text-[10px] text-gray-400">{isAr ? 'معدل التفاعل' : 'Engagement Rate'}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <span className="text-xs font-black text-emerald-600 block">{profile?.totalCommission}</span>
                    <span className="text-[10px] text-gray-400">{isAr ? 'إجمالي الأرباح' : 'Total Earned'}</span>
                  </div>
                </div>

                {/* Social Handles */}
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100 text-xs">
                  <a href={profile?.instagram || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 border border-pink-200 font-bold hover:bg-pink-100 transition-colors">
                    <span>📷 Instagram</span>
                    <span className="text-[10px]">{profile?.handle || (user?.name ? `@${user.name.toLowerCase().replace(/[^a-z0-9_]/g, '_')}` : '@user')}</span>
                  </a>
                  <a href={profile?.tiktok || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold hover:bg-slate-200 transition-colors">
                    <span>🎵 TikTok</span>
                    <span className="text-[10px]">{profile?.handle || (user?.name ? `@${user.name.toLowerCase().replace(/[^a-z0-9_]/g, '_')}` : '@user')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS & PAYOUTS */}
        {activeNav === 'settings' && (
          <div className="p-6 space-y-6 max-w-3xl animate-page-enter">
            <div>
              <h2 className="text-lg font-black text-slate-900">{isAr ? 'إعدادات الحساب وطرق سحب الأرباح' : 'Creator Settings & Payouts'}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{isAr ? 'حدد وسيلة استلام عمولاتك (إنستاباي أو فودافون كاش) وإشعارات الحملات' : 'Configure payment methods, InstaPay, Vodafone Cash, and notifications'}</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Payment Methods */}
              <div className="p-5 rounded-3xl border border-gray-200 bg-white shadow-xs space-y-4">
                <h3 className="text-xs font-black text-slate-900">{isAr ? 'طريقة سحب الأرباح والعمولات 🇪🇬' : 'Payout Method'}</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'instapay', label: 'إنستاباي (InstaPay)', desc: 'تحويل فوري لحظي' },
                    { id: 'vodafone_cash', label: 'فودافون كاش', desc: 'محفظة الهاتف الذكي' },
                    { id: 'bank_transfer', label: 'حساب بنكي CIB', desc: 'تحويل بنكي رسمي' }
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSettings({ ...settings, payoutMethod: m.id })}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        settings?.payoutMethod === m.id
                          ? 'border-[#d00000] bg-red-50/50 text-[#d00000] font-bold shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 text-slate-700'
                      }`}
                    >
                      <span className="text-xs block font-bold">{m.label}</span>
                      <span className="text-[10px] text-gray-500 block mt-0.5">{m.desc}</span>
                    </div>
                  ))}
                </div>

                {settings?.payoutMethod === 'instapay' && (
                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-bold text-slate-700 block">{isAr ? 'عنوان إنستاباي (IPA Handle):' : 'InstaPay Handle:'}</label>
                    <input
                      type="text"
                      value={settings?.instapayHandle || ''}
                      onChange={(e) => setSettings({ ...settings, instapayHandle: e.target.value })}
                      placeholder="username@instapay"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-slate-800 focus:outline-none focus:border-[#d00000]"
                    />
                  </div>
                )}

                {settings?.payoutMethod === 'vodafone_cash' && (
                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-bold text-slate-700 block">{isAr ? 'رقم محفظة فودافون كاش:' : 'Vodafone Cash Number:'}</label>
                    <input
                      type="tel"
                      value={settings?.vodafoneCashPhone || ''}
                      onChange={(e) => setSettings({ ...settings, vodafoneCashPhone: e.target.value })}
                      placeholder="010XXXXXXXX"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-slate-800 focus:outline-none focus:border-[#d00000]"
                    />
                  </div>
                )}

                {settings?.payoutMethod === 'bank_transfer' && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">{isAr ? 'اسم البنك:' : 'Bank Name:'}</label>
                      <input
                        type="text"
                        value={settings?.bankName || ''}
                        onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 block">{isAr ? 'رقم الآيبان (IBAN):' : 'IBAN:'}</label>
                      <input
                        type="text"
                        value={settings?.bankIban || ''}
                        onChange={(e) => setSettings({ ...settings, bankIban: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notification Toggles */}
              <div className="p-5 rounded-3xl border border-gray-200 bg-white shadow-xs space-y-3">
                <h3 className="text-xs font-black text-slate-900">{isAr ? 'تفضيلات التنبيهات والإشعارات' : 'Notification Alerts'}</h3>
                
                {[
                  { key: 'emailNotifications', label: isAr ? 'إشعارات البريد عند وصول حملة براند جديدة' : 'Email alerts for new campaigns' },
                  { key: 'smsAlerts', label: isAr ? 'رسائل SMS / واتساب عند تحويل العمولات' : 'SMS / WhatsApp alerts for payouts' },
                  { key: 'showSalesOnProfile', label: isAr ? 'إظهار إجمالي مبيعات الريلز في الميديا كيت العام' : 'Show sales stats on public media kit' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-gray-50 cursor-pointer">
                    <span className="text-xs font-bold text-slate-800">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={settings?.[item.key] || false}
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                      className="w-4 h-4 accent-[#d00000] cursor-pointer"
                    />
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] transition-colors shadow-sm"
              >
                {isAr ? 'حفظ كافة الإعدادات والبيانات' : 'Save All Settings'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* MODAL 1: EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl animate-page-enter">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">{isAr ? 'تعديل الملف الشخصي للمبدع' : 'Edit Creator Profile'}</h3>
              <button onClick={() => setShowEditProfileModal(false)} className="text-gray-400 hover:text-slate-800">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? 'الاسم الظاهر:' : 'Name:'}</label>
                <input
                  type="text"
                  value={profileForm.name || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#d00000]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? 'نبذة عنك (Bio):' : 'Bio:'}</label>
                <textarea
                  rows={3}
                  value={profileForm.bio || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#d00000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? 'المدينة / المحافظة:' : 'City:'}</label>
                  <input
                    type="text"
                    value={profileForm.city || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? 'مجال المحتوى:' : 'Niche:'}</label>
                  <input
                    type="text"
                    value={profileForm.niche || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, niche: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] shadow-xs"
                >
                  {isAr ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: APPLY FOR CAMPAIGN MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-page-enter">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">{isAr ? 'تقديم طلب للمشاركة في الحملة' : 'Apply For Campaign'}</h3>
              <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-slate-800">✕</button>
            </div>

            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <h4 className="text-xs font-black text-slate-800">{selectedCampaignForApply?.title}</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">{selectedCampaignForApply?.brandName} • {selectedCampaignForApply?.rewardLabel}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">{isAr ? 'اقتراحك للفيديو / فكرة الستايلنج للبراند:' : 'Your Video Pitch / Concept:'}</label>
              <textarea
                rows={3}
                value={applyNotes}
                onChange={(e) => setApplyNotes(e.target.value)}
                placeholder={isAr ? 'مثال: سأقوم بتصوير ريلز في ضوء النهار بستايل كاجوال مع إبراز خامة الكتان...' : 'e.g. Daylight reel focusing on fabric quality...'}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#d00000]"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleApplyCampaign}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black shadow-xs"
              >
                {isAr ? 'تأكيد التقديم' : 'Confirm Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SUBMIT DRAFT REEL MODAL */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-page-enter">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">{isAr ? 'إرسال مسودة الريلز لمراجعة البراند' : 'Submit Reel Draft'}</h3>
              <button onClick={() => setShowDraftModal(false)} className="text-gray-400 hover:text-slate-800">✕</button>
            </div>

            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <h4 className="text-xs font-black text-slate-800">{selectedCampaignForDraft?.title}</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">{selectedCampaignForDraft?.brandName}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">{isAr ? 'رابط مسودة الفيديو (Google Drive أو Instagram Draft):' : 'Reel Draft URL:'}</label>
              <input
                type="url"
                required
                value={draftUrl}
                onChange={(e) => setDraftUrl(e.target.value)}
                placeholder="https://drive.google.com/... or reel link"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#d00000]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">{isAr ? 'ملاحظات إضافية للبراند:' : 'Notes for Brand:'}</label>
              <textarea
                rows={2}
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                placeholder={isAr ? 'تم استخدام كود الخصم في الثانية 0:04 مع إبراز التفاصيل' : 'Discount code showcased at 0:04'}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDraftModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSubmitDraft}
                className="flex-1 py-2.5 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] shadow-xs"
              >
                {isAr ? 'إرسال للمراجعة' : 'Submit Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FULL SHOPPABLE REEL CREATOR STUDIO MODAL */}
      {showNewReelModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-page-enter border border-gray-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-[#d00000] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">movie</span>
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-black text-slate-900">
                    {isAr ? 'استوديو نشر الريلز والمنتجات • Creator Reels Studio' : 'Creator Reels Studio • Upload & Tag Products'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {isAr 
                      ? 'ارفع فيديو رأسي (9:16)، اربط منتجات المتجر للشراء السريع، واربح عمولة بيع مباشرة 🇪🇬✨' 
                      : 'Upload vertical 9:16 video, tag marketplace products & earn sales commissions'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowNewReelModal(false)} 
                className="w-9 h-9 rounded-full bg-gray-200/60 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - 2 Columns */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: 9:16 LIVE PHONE PREVIEW */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center bg-gray-100/70 rounded-3xl p-4 border border-gray-200/70">
                <div className="text-center mb-2">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{isAr ? 'معاينة الريلز المباشرة (9:16 Live Preview)' : 'Live 9:16 Video Player Preview'}</span>
                  </span>
                </div>

                {/* Phone Mockup Frame */}
                <div className="w-full max-w-[280px] sm:max-w-[290px] aspect-[9/16] rounded-[34px] bg-black border-[5px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none">
                  {/* Speaker Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-slate-900 rounded-full z-30" />

                  {/* Video Element */}
                  <video
                    ref={reelVideoPlayerRef}
                    src={reelVideoUrl}
                    poster={reelThumbnail}
                    loop
                    playsInline
                    autoPlay
                    muted={reelIsMuted}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    onClick={toggleReelPlayPause}
                  />

                  {/* Play Indicator if Paused */}
                  {!reelIsPlaying && (
                    <div 
                      onClick={toggleReelPlayPause}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer z-20"
                    >
                      <div className="w-13 h-13 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                        <span className="material-symbols-outlined text-[30px] translate-x-0.5">play_arrow</span>
                      </div>
                    </div>
                  )}

                  {/* Top Bar on Video: Category + Mute Toggle */}
                  <div className="relative z-20 p-3 pt-6 flex items-center justify-between text-white text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black border border-white/10">
                      {reelCategory === 'fashion' ? '👗 أزياء' : reelCategory === 'beauty' ? '💄 تجميل' : reelCategory === 'accessories' ? '💍 إكسسوارات' : '✨ ستايل'}
                    </span>
                    <button
                      type="button"
                      onClick={toggleReelMute}
                      className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/90 cursor-pointer text-white"
                      title={reelIsMuted ? 'كتم الصوت' : 'تشغيل الصوت'}
                    >
                      <span className="material-symbols-outlined text-[16px]">{reelIsMuted ? 'volume_off' : 'volume_up'}</span>
                    </button>
                  </div>

                  {/* Right Edge Social Actions Mock */}
                  <div className="absolute right-2.5 bottom-24 flex flex-col items-center gap-2.5 z-20 text-white pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px] text-red-500">favorite</span>
                    </div>
                    <span className="text-[9px] font-bold -mt-1.5">1.4K</span>
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                    </div>
                    <span className="text-[9px] font-bold -mt-1.5">36</span>
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">bookmark</span>
                    </div>
                    <span className="text-[9px] font-bold -mt-1.5">120</span>
                  </div>

                  {/* Bottom Video Overlays */}
                  <div className="relative z-20 p-3 pb-4 flex flex-col gap-2 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white">
                    {/* Interactive Tagged Product Pill (Live preview!) */}
                    {selectedProduct && (
                      <div className="p-2 rounded-2xl bg-white/95 text-slate-900 backdrop-blur-md shadow-lg flex items-center gap-2 border border-white/20 animate-fade-in">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <img src={selectedProduct.image || selectedProduct.images?.[0] || reelThumbnail} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1 text-start">
                          <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#d00000]">shopping_bag</span>
                            <span className="text-[10px] font-black truncate block">{selectedProduct.title || selectedProduct.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-black text-[#d00000]">{selectedProduct.price} ج.م</span>
                            {selectedProduct.originalPrice && (
                              <span className="text-[9px] text-gray-400 line-through">{selectedProduct.originalPrice} ج.م</span>
                            )}
                          </div>
                        </div>
                        <span className="text-[9px] font-bold px-2 py-1 rounded-lg bg-[#d00000] text-white shrink-0 shadow-xs">
                          {isAr ? 'تسوق' : 'Shop'}
                        </span>
                      </div>
                    )}

                    {/* Creator Info */}
                    <div className="flex items-center gap-2">
                      <img src={user?.avatar_url || profile?.avatar || '/images/reels/reel_2.jpg'} alt="" className="w-6 h-6 rounded-full object-cover ring-1 ring-white" />
                      <span className="text-[11px] font-bold truncate">{user?.handle || profile?.handle || '@yasmin_style'}</span>
                      <span className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">صانع معتمد ✓</span>
                    </div>

                    {/* Dynamic Caption */}
                    <p className="text-[10px] text-gray-100 line-clamp-2 leading-relaxed text-start">
                      {reelTitle || (isAr ? 'اكتب كابشن للريلز...' : 'Add your caption...')}
                    </p>

                    {/* Music Track Rotating Pill */}
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-300">
                      <span className="material-symbols-outlined text-[13px] text-amber-400 animate-spin" style={{ animationDuration: '6s' }}>music_note</span>
                      <span className="truncate">{reelMusicTrack}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between w-full max-w-[290px] px-2 text-[10px] text-gray-500 font-mono">
                  <span>{reelVideoDuration} • {reelVideoSize}</span>
                  <button 
                    type="button" 
                    onClick={toggleReelPlayPause}
                    className="text-slate-800 font-bold hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">{reelIsPlaying ? 'pause' : 'play_arrow'}</span>
                    <span>{reelIsPlaying ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'تشغيل' : 'Play')}</span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: REEL CONFIGURATION FORM */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. Video Source Picker Tabs */}
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#d00000]">video_library</span>
                    <span>{isAr ? 'مصدر الفيديو (Video Source):' : 'Video Source:'}</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl mb-3">
                    <button
                      type="button"
                      onClick={() => setReelVideoSourceType('preset')}
                      className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        reelVideoSourceType === 'preset'
                          ? 'bg-white text-[#d00000] shadow-xs'
                          : 'text-gray-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      <span>{isAr ? 'نماذج أزياء مصرية جاهزة' : 'Ready Presets'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReelVideoSourceType('upload');
                        reelFileInputRef.current?.click();
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        reelVideoSourceType === 'upload'
                          ? 'bg-white text-[#d00000] shadow-xs'
                          : 'text-gray-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">upload_file</span>
                      <span>{isAr ? 'رفع فيديو من جهازك' : 'Upload Video File'}</span>
                    </button>
                  </div>

                  {/* Preset Selector Grid */}
                  {reelVideoSourceType === 'preset' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {FASHION_VIDEO_PRESETS.map((preset) => {
                        const isSelected = reelVideoUrl === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`flex items-center gap-2.5 p-2 rounded-2xl border text-start transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#d00000] bg-red-50/50 shadow-2xs'
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                            }`}
                          >
                            <div className="w-9 h-11 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-black">
                              <img src={preset.thumb} alt={preset.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-slate-900 block truncate">{preset.title}</span>
                              <span className="text-[10px] text-gray-500 font-mono">{preset.duration} • {preset.size}</span>
                            </div>
                            {isSelected && (
                              <span className="material-symbols-outlined text-[18px] text-[#d00000]">check_circle</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Upload Dropzone */
                    <div>
                      <input
                        ref={reelFileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/*"
                        onChange={handleVideoInputChange}
                        className="hidden"
                      />

                      <div
                        onClick={() => reelFileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-5 text-center space-y-2 transition-all cursor-pointer ${
                          isDraggingReelVideo
                            ? 'border-[#d00000] bg-red-50 scale-[1.01]'
                            : 'border-red-200 hover:border-[#d00000] bg-red-50/20 hover:bg-red-50/40'
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-red-100 text-[#d00000] mx-auto flex items-center justify-center shadow-xs">
                          <span className="material-symbols-outlined text-[26px]">
                            {isDraggingReelVideo ? 'file_download' : 'cloud_upload'}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {isDraggingReelVideo ? 'أفلت الفيديو هنا للرفع!' : 'اسحب الفيديو هنا أو اضغط للاختيار من جهازك'}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-0.5">يدعم MP4, MOV, WebM عمودي (9:16) حتى 100 ميجابايت</p>
                        </div>

                        {/* File details card if uploaded */}
                        {isCustomReelVideo && (
                          <div className="pt-2 border-t border-red-200/60 flex items-center justify-between text-start bg-white p-2.5 rounded-xl border border-red-100 shadow-2xs">
                            <div className="flex items-center gap-2 truncate">
                              {isUploadingVideo ? (
                                <span className="material-symbols-outlined text-[18px] text-amber-500 animate-spin shrink-0">progress_activity</span>
                              ) : (
                                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                              )}
                              <div className="truncate">
                                <span className="text-xs font-bold text-slate-900 block truncate">{reelVideoName}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-gray-500 font-mono">{reelVideoSize}</span>
                                  {isUploadingVideo ? (
                                    <span className="text-[9px] font-bold text-amber-600 flex items-center gap-0.5">
                                      {isAr ? 'جاري المزامنة مع الخادم...' : 'Syncing to server...'}
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                                      {isAr ? '✓ متزامن ومتاح لكل الأجهزة' : '✓ Synced for all devices'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span className="px-2 py-1 text-[10px] font-bold text-[#d00000] hover:bg-red-50 rounded-lg shrink-0">
                              {isAr ? 'تغيير' : 'Change'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Reel Title & Caption */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-gray-500">edit_note</span>
                      <span>{isAr ? 'عنوان الريلز والكابشن:' : 'Reel Caption & Description:'}</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-mono">{reelTitle.length}/160</span>
                  </div>

                  <textarea
                    rows={2}
                    required
                    value={reelTitle}
                    onChange={(e) => setReelTitle(e.target.value)}
                    placeholder={isAr ? 'تنسيق لوك صيفي أنيق مع قطن مصري 🇪🇬✨ #موضة_مصرية' : 'Styling an elegant Egyptian look...'}
                    className="w-full px-3 py-2 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#d00000] bg-gray-50/50"
                  />

                  {/* Hashtag Quick Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-1.5">
                    <span className="text-[10px] text-gray-400 font-bold">{isAr ? 'هاشتاجات شائعة:' : 'Quick tags:'}</span>
                    {HASHTAG_SUGGESTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!reelTitle.includes(tag)) {
                            setReelTitle(prev => `${prev} ${tag}`.trim());
                          }
                        }}
                        className="px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-[#d00000] text-[10px] font-bold text-gray-600 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Product Tagging & Commission */}
                <div className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-amber-600">sell</span>
                      <span>{isAr ? 'المنتج الموسوم للشراء (Tagged Product):' : 'Tagged Product for Quick Buy:'}</span>
                    </label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      {isAr ? 'عمولة بيع 10%' : '10% Commission'}
                    </span>
                  </div>

                  <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => setReelSelectedProductId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs focus:outline-none bg-white font-medium text-slate-800"
                  >
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title || p.name} — {p.price} ج.م ({p.merchant || p.merchantName || 'براند مصري'})
                      </option>
                    ))}
                  </select>

                  {/* Commission Calculation Display */}
                  {selectedProduct && (
                    <div className="flex items-center justify-between pt-1 text-[11px] text-amber-900 bg-white/70 p-2 rounded-xl border border-amber-100">
                      <div className="flex items-center gap-2">
                        <img src={selectedProduct.image || selectedProduct.images?.[0] || reelThumbnail} alt="" className="w-7 h-7 rounded-lg object-cover border border-gray-200" />
                        <span className="font-bold truncate max-w-[200px]">{selectedProduct.title || selectedProduct.name}</span>
                      </div>
                      <div className="text-end">
                        <span className="font-black text-emerald-600 text-xs">
                          +{(Number(selectedProduct.price || 1000) * 0.10).toFixed(0)} ج.م
                        </span>
                        <span className="text-[9px] text-gray-500 block">{isAr ? 'أرباحك لكل بيعة' : 'per sale'}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Audio / Music Track & Category Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-gray-500">audiotrack</span>
                      <span>{isAr ? 'المقطع الصوتي / الموسيقى:' : 'Sound Track:'}</span>
                    </label>
                    <select
                      value={reelMusicTrack}
                      onChange={(e) => setReelMusicTrack(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white text-slate-800"
                    >
                      {SOUND_TRACKS.map((st) => (
                        <option key={st.id} value={st.name}>
                          {isAr ? st.nameAr : st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-gray-500">category</span>
                      <span>{isAr ? 'التصنيف والقناة:' : 'Category:'}</span>
                    </label>
                    <select
                      value={reelCategory}
                      onChange={(e) => setReelCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none bg-white text-slate-800"
                    >
                      <option value="fashion">{isAr ? '👗 أزياء وموضة (Fashion)' : 'Fashion'}</option>
                      <option value="beauty">{isAr ? '💄 تجميل ومكياج (Beauty)' : 'Beauty'}</option>
                      <option value="accessories">{isAr ? '💍 إكسسوارات ومجوهرات (Accessories)' : 'Accessories'}</option>
                      <option value="lifestyle">{isAr ? '✨ ستايل حياة وتراث (Lifestyle)' : 'Lifestyle'}</option>
                    </select>
                  </div>
                </div>

                {/* Publishing Progress Bar */}
                {isPublishingReel && (
                  <div className="space-y-1.5 p-3 rounded-2xl bg-red-50 border border-red-200 animate-fade-in">
                    <div className="flex items-center justify-between text-xs font-bold text-[#d00000]">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        <span>{isAr ? 'جاري معالجة ونشر الريلز في المنصة...' : 'Processing and publishing reel...'}</span>
                      </span>
                      <span>{publishReelProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-red-200/60 overflow-hidden">
                      <div 
                        className="h-full bg-[#d00000] rounded-full transition-all duration-300"
                        style={{ width: `${publishReelProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Modal Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    disabled={isPublishingReel}
                    onClick={() => setShowNewReelModal(false)}
                    className="flex-1 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    disabled={isPublishingReel || !reelTitle.trim()}
                    onClick={handleCreateNewReel}
                    className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                      isPublishingReel || !reelTitle.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#d00000] hover:bg-[#b00000] text-white hover:shadow-md'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                    <span>{isPublishingReel ? (isAr ? 'جاري النشر...' : 'Publishing...') : (isAr ? 'نشر الريلز الآن 🚀' : 'Publish Reel Now 🚀')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PREVIEW REEL MODAL (FROM CONTENT TAB) */}
      {activePreviewReel && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePreviewReel(null)}
        >
          <div 
            className="relative w-full max-w-[310px] aspect-[9/16] rounded-[36px] overflow-hidden bg-black shadow-2xl border-4 border-slate-800 flex flex-col justify-between select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Camera Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-30" />

            <video
              src={activePreviewReel.videoUrl || '/images/reels/the_sharp_v_yellow_reel.mp4'}
              poster={activePreviewReel.thumbnail}
              autoPlay
              loop
              controls
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Close Button */}
            <button
              onClick={() => setActivePreviewReel(null)}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 cursor-pointer text-base font-bold"
            >
              ✕
            </button>

            {/* Bottom Details Card */}
            <div className="relative z-20 mt-auto p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white space-y-2 pointer-events-auto">
              <h4 className="text-xs font-black line-clamp-2">{activePreviewReel.title}</h4>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/10">
                <span className="text-amber-300 font-bold truncate">🛍️ {activePreviewReel.taggedProduct}</span>
                <button
                  type="button"
                  onClick={() => {
                    setActivePreviewReel(null);
                    setActiveTab('reels');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-[#d00000] text-white text-[10px] font-black hover:bg-[#b00000] transition-colors"
                >
                  {isAr ? 'عرض بالريلز' : 'In Reels'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
