import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';

// Egyptian Fashion Sample Video Presets for 1-click testing
const FASHION_VIDEO_PRESETS = [
  {
    id: 'linen-abaya',
    title: 'عباية كتان بوهيمي',
    url: '/images/reels/linen_abaya.mp4',
    thumb: '/images/products/linen_abaya.jpg',
    duration: '0:15',
    size: '14.2 MB'
  },
  {
    id: 'citrine-blazer',
    title: 'بليزر سيترين أصفر',
    url: '/images/reels/fashion_citrine_blazer.mp4',
    thumb: '/images/reels/fashion_citrine_blazer_thumb.jpg',
    duration: '0:12',
    size: '18.6 MB'
  },
  {
    id: 'oversized-shirt',
    title: 'قميص كتان أوفرسايز',
    url: '/images/reels/fashion_oversized_shirt.mp4',
    thumb: '/images/reels/fashion_oversized_shirt_thumb.jpg',
    duration: '0:10',
    size: '11.4 MB'
  },
  {
    id: 'suede-jacket',
    title: 'جاكت جلد وسويد',
    url: '/images/reels/fashion_suede_jacket.mp4',
    thumb: '/images/reels/fashion_suede_jacket_thumb.jpg',
    duration: '0:14',
    size: '16.1 MB'
  },
  {
    id: 'vintage-watch',
    title: 'ساعة كلاسيكية فاخرة',
    url: '/images/reels/fashion_vintage_watch.mp4',
    thumb: '/images/reels/fashion_vintage_watch_thumb.jpg',
    duration: '0:11',
    size: '9.8 MB'
  }
];

export default function AddProductStudio() {
  const { setActiveTab, addProduct } = useApp();

  // Form State
  const [productName, setProductName] = useState('فستان مطرز مصري فاخر');
  const [description, setDescription] = useState(
    'فستان أنيق بتطريز يدوي مستوحى من التراث المصري، مصنوع من قماش عالي الجودة مناسب للمناسبات والإطلالات الخاصة، يجمع بين الأصالة والموضة العصرية.'
  );
  const [price, setPrice] = useState(1250);
  const [originalPrice, setOriginalPrice] = useState(1650);
  const [category, setCategory] = useState('الفساتين');
  const [quantity, setQuantity] = useState(20);
  const [selectedSizes, setSelectedSizes] = useState(['L']);
  const [selectedColor, setSelectedColor] = useState('red');
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [governorate, setGovernorate] = useState('جميع المحافظات');
  const [area, setArea] = useState('جميع المناطق');
  const [codEnabled, setCodEnabled] = useState(true);
  const [specs, setSpecs] = useState('خامة كتان مصري طبيعي 100% مع تطريز يدوي تراثي فاخر، تعليمات الغسيل: تنظيف جاف فقط.');

  // Media State: Video & Photos
  const [videoUrl, setVideoUrl] = useState('/images/reels/linen_abaya.mp4');
  const [videoName, setVideoName] = useState('linen_abaya.mp4');
  const [videoSize, setVideoSize] = useState('14.2 MB');
  const [videoDuration, setVideoDuration] = useState('0:15');
  const [isCustomUploadedVideo, setIsCustomUploadedVideo] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [photos, setPhotos] = useState([
    '/images/products/linen_abaya.jpg',
    '/images/products/silk_dress.jpg',
    '/images/products/linen_shirt.jpg',
    '/images/products/wool_blazer.jpg'
  ]);

  // Video Player Controls & State
  const videoPlayerRef = useRef(null);
  const videoFileInputRef = useRef(null);
  const photoFileInputRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [videoProgress, setVideoProgress] = useState(0);

  // Publishing & Progress State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishStatusText, setPublishStatusText] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedProduct, setPublishedProduct] = useState(null);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Video playback listeners
  const handleTimeUpdate = () => {
    if (!videoPlayerRef.current) return;
    const cur = videoPlayerRef.current.currentTime;
    const dur = videoPlayerRef.current.duration || 15;
    setCurrentTime(cur);
    setVideoProgress((cur / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (!videoPlayerRef.current) return;
    const dur = videoPlayerRef.current.duration;
    if (dur && !isNaN(dur)) {
      setDuration(dur);
      setVideoDuration(formatTime(dur));
    }
    // Autoplay when loaded
    videoPlayerRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  };

  const togglePlayPause = (e) => {
    e?.stopPropagation();
    if (!videoPlayerRef.current) return;
    if (videoPlayerRef.current.paused) {
      videoPlayerRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoPlayerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e?.stopPropagation();
    if (!videoPlayerRef.current) return;
    const newMuted = !isMuted;
    videoPlayerRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const handleTimelineSeek = (e) => {
    if (!videoPlayerRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    videoPlayerRef.current.currentTime = percent * duration;
    setVideoProgress(percent * 100);
  };

  const handleFullscreen = (e) => {
    e?.stopPropagation();
    if (!videoPlayerRef.current) return;
    if (videoPlayerRef.current.requestFullscreen) {
      videoPlayerRef.current.requestFullscreen();
    }
  };

  // Drag and drop / video file selection
  const processVideoFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|mkv)$/i)) {
      alert('يرجى اختيار ملف فيديو بصيغة صحيحة (MP4, WebM, MOV)');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    setVideoName(file.name);
    setVideoSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    setIsCustomUploadedVideo(true);

    if (videoPlayerRef.current) {
      videoPlayerRef.current.src = objectUrl;
      videoPlayerRef.current.load();
      videoPlayerRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleVideoInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processVideoFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingVideo(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingVideo(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processVideoFile(file);
  };

  const selectVideoPreset = (preset) => {
    setVideoUrl(preset.url);
    setVideoName(preset.title + ' (MP4)');
    setVideoSize(preset.size);
    setVideoDuration(preset.duration);
    setIsCustomUploadedVideo(false);

    if (videoPlayerRef.current) {
      videoPlayerRef.current.src = preset.url;
      videoPlayerRef.current.load();
      videoPlayerRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Photo gallery uploads
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newUrls = files.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newUrls]);
  };

  const removePhoto = (index, e) => {
    e?.stopPropagation();
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const setAsPrimaryPhoto = (index) => {
    setPhotos(prev => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Main Publish Action
  const handlePublish = async (e) => {
    if (e) e.preventDefault();

    if (!productName.trim()) {
      alert('يرجى كتابة اسم المنتج');
      return;
    }
    if (!price || Number(price) <= 0) {
      alert('يرجى تحديد سعر صالح للمنتج');
      return;
    }
    if (photos.length === 0) {
      alert('يرجى إضافة صورة واحدة على الأقل للمنتج');
      return;
    }

    setIsPublishing(true);
    setPublishProgress(10);
    setPublishStatusText('جاري فحص وتشفير ملف الفيديو وإعداد المقاسات...');

    const newProdPayload = {
      id: `p-${Date.now()}`,
      sku: `EG-${Date.now().toString().slice(-6)}`,
      title: productName,
      price: Number(price),
      originalPrice: Number(originalPrice) || Math.round(Number(price) * 1.3),
      category: category,
      image: photos[0] || '/images/products/linen_abaya.jpg',
      images: photos,
      video: videoUrl,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(quantity) || 20,
      sizes: selectedSizes.length > 0 ? selectedSizes : ['M', 'L'],
      colors: [selectedColor],
      description: description,
      specs: specs,
      isSyndicated: true,
      shippingEnabled: shippingEnabled,
      governorate: governorate,
      codEnabled: codEnabled
    };

    // Step 1: Media Encoding
    await new Promise(r => setTimeout(r, 600));
    setPublishProgress(35);
    setPublishStatusText('جاري رفع الفيديو والصور إلى خوادم التخزين السحابية...');

    // Step 2: Storage Upload Simulation
    await new Promise(r => setTimeout(r, 700));
    setPublishProgress(70);
    setPublishStatusText('جاري إنشاء سجل المنتج والريلز في قاعدة بيانات Supabase...');

    // Step 3: Database Insertion via AppContext & ProductService
    try {
      const created = await addProduct(newProdPayload);
      setPublishedProduct(created || newProdPayload);
      setPublishProgress(100);
      setPublishStatusText('تم نشر المنتج والريلز بنجاح في السوق! 🎉');
      
      await new Promise(r => setTimeout(r, 400));
      setIsPublishing(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Publish error:', err);
      setIsPublishing(false);
      alert('حدث خطأ أثناء حفظ المنتج، يرجى المحاولة مرة أخرى.');
    }
  };

  const handleResetForm = () => {
    setShowSuccessModal(false);
    setProductName('طقم كتان مصري جديد');
    setDescription('تصميم عصري مصنوع من خامات مصرية طبيعية راقية.');
    setPrice(980);
    setOriginalPrice(1300);
    setQuantity(15);
    setSelectedSizes(['M']);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col font-sans select-none text-start" dir="rtl">
      {/* Top Breadcrumb & Action Banner */}
      <div className="w-full bg-white border-b border-gray-200/80 px-4 md:px-8 py-3.5 sticky top-0 md:top-14 z-20 shadow-2xs">
        <div className="max-w-[1780px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-slate-900 transition-colors"
              title="العودة للوحة التحكم"
            >
              <span className="material-symbols-outlined text-[20px] rtl:rotate-180">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-black text-slate-900 leading-tight">استوديو إضافة منتج جديد</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  متصل بـ Supabase
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block">ارفع فيديو ريلز تفاعلي وحدد المقاسات والمخزون والشحن الموحد</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              إلغاء
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-5 py-2 text-xs font-bold bg-[#d00000] hover:bg-[#b00000] text-white rounded-xl shadow-md shadow-red-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isPublishing ? 'sync' : 'publish'}
              </span>
              <span>{isPublishing ? 'جاري النشر...' : 'نشر المنتج الآن'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE WITH RIGHT SIDEBAR (Matching Layout)                    */}
      {/* ========================================================================= */}
      <div className="max-w-[1780px] mx-auto w-full flex flex-1 p-4 md:p-6 gap-6">
        {/* RIGHT SIDEBAR (RTL) */}
        <aside className="w-56 shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-4">
            <nav className="space-y-1 text-xs font-bold">
              <button 
                onClick={() => setActiveTab('reels')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all text-start"
              >
                <span className="material-symbols-outlined text-[19px]">home</span>
                <span>الرئيسية</span>
              </button>

              <button 
                onClick={() => setActiveTab('shop')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all text-start"
              >
                <span className="material-symbols-outlined text-[19px]">inventory_2</span>
                <span>المنتجات</span>
              </button>

              {/* ACTIVE RED PILL: إضافة منتج */}
              <button 
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#d00000] text-white shadow-sm text-start"
              >
                <span className="material-symbols-outlined text-[19px]">add_circle</span>
                <span>إضافة منتج</span>
              </button>

              <button 
                onClick={() => setActiveTab('shop')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all text-start"
              >
                <span className="material-symbols-outlined text-[19px]">format_list_bulleted</span>
                <span>قائمتي</span>
              </button>

              <button 
                onClick={() => setActiveTab('dashboard')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all text-start"
              >
                <span className="material-symbols-outlined text-[19px]">shopping_bag</span>
                <span>الطلبات</span>
              </button>

              <button 
                onClick={() => setActiveTab('dashboard')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all text-start"
              >
                <span className="material-symbols-outlined text-[19px]">equalizer</span>
                <span>التحليلات</span>
              </button>

              <button 
                onClick={() => setActiveTab('storefront')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all text-start"
              >
                <span className="material-symbols-outlined text-[19px]">storefront</span>
                <span>المتجر</span>
              </button>

              <button 
                onClick={() => setActiveTab('dashboard')}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-200/60 transition-all text-start"
              >
                <span className="material-symbols-outlined text-[19px]">settings</span>
                <span>الإعدادات</span>
              </button>
            </nav>
          </div>

          {/* Bottom Card: ابدأ في بيع منتجات الموضة المصرية */}
          <div className="rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 p-4 space-y-2 text-start relative overflow-hidden shadow-xs">
            <div className="w-12 h-14 rounded-xl overflow-hidden shadow-sm">
              <img src="/images/products/linen_abaya.jpg" alt="Fashion" className="w-full h-full object-cover" />
            </div>
            <h4 className="text-xs font-black text-slate-900 leading-tight">ابدأ في بيع منتجات الموضة المصرية</h4>
            <p className="text-[10px] text-gray-600 leading-snug">ارفع منتجك ووصل لآلاف المشترين الآن</p>
            <div className="pt-1 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-[#d00000] text-white flex items-center justify-center cursor-pointer shadow-xs hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[16px] rtl:rotate-180">arrow_forward</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN MULTI-COLUMN FORM (Left Preview, Center Upload, Right Form) */}
        <main className="flex-1 flex flex-col space-y-4 min-w-0">
          {/* Breadcrumb & Title */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
                <span className="hover:text-slate-800 cursor-pointer" onClick={() => setActiveTab('shop')}>المنتجات</span>
                <span>/</span>
                <span className="text-[#d00000] font-bold">إضافة منتج</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <h1 className="text-xl font-black text-slate-900">إضافة منتج</h1>
                <span className="w-6 h-6 rounded-full bg-[#d00000] text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  +
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">قم برفع فيديو المنتج وصورته، وأضف التفاصيل لبدء البيع فوراً</p>
            </div>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1 (Left): Live 9:16 Video Preview & Product Photos (4 cols) */}
            <div className="xl:col-span-4 space-y-5">
              {/* Video Preview Card */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-gray-500">videocam</span>
                    <span>معاينة الفيديو الحي (Live Reel)</span>
                  </h3>
                  <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>تفاعلي 9:16</span>
                  </span>
                </div>

                {/* 9:16 REAL HTML5 Video Player Container */}
                <div className="relative aspect-[9/16] w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden bg-black shadow-md group">
                  <video
                    ref={videoPlayerRef}
                    src={videoUrl}
                    poster={photos[0] || '/images/products/linen_abaya.jpg'}
                    className="w-full h-full object-cover cursor-pointer"
                    loop
                    playsInline
                    muted={isMuted}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={togglePlayPause}
                  />
                  
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/35 pointer-events-none" />

                  {/* Overlay Product Badge (Live synced with form fields) */}
                  <div className="absolute top-3 start-3 bg-white/95 backdrop-blur-md rounded-xl p-2 flex items-center gap-2.5 shadow-lg max-w-[220px] border border-white/50 text-start z-10">
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-gray-100">
                      <img 
                        src={photos[0] || '/images/products/linen_abaya.jpg'} 
                        alt="Thumb" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="truncate min-w-0">
                      <span className="text-[10px] font-bold text-slate-900 block truncate">
                        {productName || 'اسم المنتج'}
                      </span>
                      <span className="text-[11px] font-black text-[#d00000] block mt-0.5 font-mono">
                        EGP {Number(price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Center Play/Pause Pulsing Icon */}
                  <button 
                    type="button"
                    onClick={togglePlayPause}
                    className={`absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-xl z-20 ${
                      isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[32px]">
                      {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                  </button>

                  {/* Video Player Timeline Controls (Bottom) */}
                  <div className="absolute bottom-0 inset-x-0 p-3 text-white space-y-1.5 z-20">
                    {/* Interactive Scrubbing Bar */}
                    <div 
                      onClick={handleTimelineSeek}
                      className="w-full h-1.5 bg-white/30 hover:bg-white/40 rounded-full overflow-hidden cursor-pointer transition-all"
                      title="تقديم / تأخير الفيديو"
                    >
                      <div 
                        className="h-full bg-[#d00000] rounded-full transition-all" 
                        style={{ width: `${videoProgress}%` }} 
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-white/95">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={togglePlayPause} className="hover:text-[#d00000]">
                          <span className="material-symbols-outlined text-[16px]">
                            {isPlaying ? 'pause' : 'play_arrow'}
                          </span>
                        </button>
                        <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={toggleMute} className="hover:text-[#d00000]">
                          <span className="material-symbols-outlined text-[16px]">
                            {isMuted ? 'volume_off' : 'volume_up'}
                          </span>
                        </button>
                        <button type="button" onClick={handleFullscreen} className="hover:text-[#d00000]">
                          <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Photos Upload Gallery */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-gray-500">photo_library</span>
                    <span>معرض صور المنتج ({photos.length})</span>
                  </h3>
                  <span className="text-[10px] text-gray-400">انقر لتعيين كصورة غلاف</span>
                </div>

                {/* Thumbnails Grid + Add Button */}
                <div className="grid grid-cols-5 gap-2">
                  {photos.map((img, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setAsPrimaryPhoto(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 group cursor-pointer transition-all ${
                        idx === 0 ? 'border-[#d00000] ring-2 ring-red-100 shadow-sm' : 'border-gray-200 hover:border-gray-400'
                      }`}
                      title={idx === 0 ? 'صورة الغلاف الرئيسية' : 'انقر لتعيينها كصورة رئيسية'}
                    >
                      <img src={img} alt="Product view" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      
                      {idx === 0 && (
                        <div className="absolute bottom-0 inset-x-0 bg-[#d00000] text-white text-[8px] font-bold text-center py-0.5">
                          الرئيسية
                        </div>
                      )}

                      {/* Remove button */}
                      <button 
                        type="button"
                        onClick={(e) => removePhoto(idx, e)}
                        className="absolute top-1 start-1 w-4 h-4 rounded-full bg-black/70 hover:bg-red-600 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="حذف الصورة"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* Add Photos Button */}
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#d00000] hover:text-[#d00000] flex flex-col items-center justify-center text-gray-400 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                    <span className="text-[9px] font-bold mt-1">إضافة صور</span>
                    <input 
                      ref={photoFileInputRef}
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handlePhotoUpload}
                      className="hidden" 
                    />
                  </label>
                </div>

                <p className="text-[10px] text-gray-400">يمكنك رفع حتى 10 صور • يدعم JPG, PNG, WEBP حتى 10 ميجابايت</p>
              </div>
            </div>

            {/* COLUMN 2 (Center): Real Video Upload Dropzone & Additional Specs (3 cols) */}
            <div className="xl:col-span-3 space-y-5">
              {/* Upload Video Dropzone */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#d00000]">video_call</span>
                    <span>رفع فيديو الريلز</span>
                  </h3>
                  {isCustomUploadedVideo && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700">
                      ملف محلي مخصص
                    </span>
                  )}
                </div>

                {/* Hidden Real File Input */}
                <input 
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/*"
                  onChange={handleVideoInputChange}
                  className="hidden"
                />

                {/* Dashed Dropzone with Live Drag & Drop */}
                <div 
                  onClick={() => videoFileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center space-y-3 transition-all cursor-pointer ${
                    isDraggingVideo 
                      ? 'border-[#d00000] bg-red-100/50 scale-[1.02]' 
                      : 'border-red-300 hover:border-[#d00000] bg-red-50/20 hover:bg-red-50/40'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-red-100 mx-auto flex items-center justify-center text-[#d00000] shadow-xs">
                    <span className="material-symbols-outlined text-[30px]">
                      {isDraggingVideo ? 'file_download' : 'cloud_upload'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {isDraggingVideo ? 'أفلت الفيديو هنا للرفع!' : 'اسحب الفيديو هنا أو اضغط للرفع'}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1">يدعم MP4, MOV, WebM عمودي (9:16)</p>
                    <p className="text-[10px] text-gray-400">الحد الأقصى للحجم 100 ميجابايت</p>
                  </div>

                  {/* Active Loaded Video Status Card */}
                  <div className="pt-2 border-t border-red-200/60 flex items-center justify-between text-start bg-white/80 p-2.5 rounded-xl">
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0">check_circle</span>
                      <div className="truncate">
                        <span className="text-[11px] font-bold text-slate-900 block truncate">{videoName}</span>
                        <span className="text-[9px] text-gray-500 font-mono">{videoSize} • مدة {videoDuration}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        videoFileInputRef.current?.click();
                      }}
                      className="px-2 py-1 text-[10px] font-bold text-[#d00000] hover:bg-red-50 rounded-lg shrink-0"
                    >
                      تغيير
                    </button>
                  </div>
                </div>

                {/* 3 Specs Badges */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="material-symbols-outlined text-[16px] text-gray-400 block mb-0.5">aspect_ratio</span>
                    <span className="text-[11px] font-bold text-slate-800 block font-mono">9:16</span>
                    <span className="text-[9px] text-gray-500">نسبة الفيديو</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="material-symbols-outlined text-[16px] text-gray-400 block mb-0.5">movie</span>
                    <span className="text-[11px] font-bold text-slate-800 block font-mono">MP4/MOV</span>
                    <span className="text-[9px] text-gray-500">صيغة مقبولة</span>
                  </div>
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="material-symbols-outlined text-[16px] text-gray-400 block mb-0.5">timer</span>
                    <span className="text-[11px] font-bold text-slate-800 block">حتى 60 ثانية</span>
                    <span className="text-[9px] text-gray-500">مدة الفيديو</span>
                  </div>
                </div>

                {/* 1-Click Fashion Video Presets Picker */}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <label className="text-[11px] font-bold text-slate-800 block flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-500">bolt</span>
                    <span>أو اختر فيديو تجريبي جاهز (Ready Presets):</span>
                  </label>
                  
                  <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {FASHION_VIDEO_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => selectVideoPreset(preset)}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border text-start transition-all cursor-pointer ${
                          videoUrl === preset.url 
                            ? 'border-[#d00000] bg-red-50/50 shadow-2xs' 
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                        }`}
                      >
                        <div className="w-8 h-10 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-black">
                          <img src={preset.thumb} alt={preset.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-bold text-slate-900 block truncate">{preset.title}</span>
                          <span className="text-[9px] text-gray-500 font-mono">{preset.duration} • {preset.size}</span>
                        </div>
                        {videoUrl === preset.url && (
                          <span className="material-symbols-outlined text-[16px] text-[#d00000]">check_circle</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Specs & Specifications */}
              <div className="bg-white rounded-3xl border border-gray-200 p-4 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-gray-500">label</span>
                  <span>المواصفات وتفاصيل القطعة</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-700 block">المواصفات وخامة القماش</label>
                  <textarea
                    rows={4}
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    placeholder="أضف مواصفات المنتج مثل الخامة، القصة، تعليمات الغسيل..."
                    className="w-full p-3 rounded-xl border border-gray-200 text-xs focus:border-[#d00000] focus:outline-none bg-gray-50"
                  />
                </div>

                {/* Cash on Delivery Toggle */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">الدفع عند الاستلام (COD)</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={codEnabled} 
                      onChange={(e) => setCodEnabled(e.target.checked)} 
                      className="sr-only peer" 
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d00000]" />
                  </label>
                </div>
              </div>
            </div>

            {/* COLUMN 3 (Right): Main Product Details & Form (5 cols) */}
            <div className="xl:col-span-5 space-y-5">
              <form onSubmit={handlePublish} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-xs space-y-4 text-start">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#d00000]">receipt_long</span>
                  <h3 className="text-sm font-bold text-slate-900">تفاصيل وبيانات المنتج</h3>
                </div>

                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    <span className="text-[#d00000]">*</span> اسم المنتج
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="فستان مطرز مصري فاخر"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#d00000] focus:outline-none bg-gray-50"
                  />
                </div>

                {/* Product Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    <span className="text-[#d00000]">*</span> وصف المنتج
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب وصفاً مفصلاً للمنتج..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#d00000] focus:outline-none bg-gray-50 leading-relaxed"
                  />
                </div>

                {/* Category, Price & Original Price (3 cols) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      <span className="text-[#d00000]">*</span> التصنيف
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#d00000] focus:outline-none bg-gray-50 cursor-pointer"
                    >
                      <option value="الفساتين">الفساتين</option>
                      <option value="الجلابيات">الجلابيات</option>
                      <option value="العبايات">العبايات</option>
                      <option value="أزياء نسائية">أزياء نسائية</option>
                      <option value="أزياء رجالية">أزياء رجالية</option>
                      <option value="إكسسوارات وساعات">إكسسوارات وساعات</option>
                      <option value="تحف وتراث">تحف وتراث</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      <span className="text-[#d00000]">*</span> سعر البيع (EGP)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="1250"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:border-[#d00000] focus:outline-none bg-gray-50"
                      />
                      <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono">ج.م</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 block">
                      السعر الأصلي (قبل الخصم)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="1650"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:border-[#d00000] focus:outline-none bg-gray-50 line-through text-gray-500"
                      />
                      <span className="absolute end-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-mono">ج.م</span>
                    </div>
                  </div>
                </div>

                {/* Quantity, Sizes & Color */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {/* Quantity Counter */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800 block">
                      <span className="text-[#d00000]">*</span> الكمية المتوفرة
                    </label>
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 px-2 py-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-mono font-bold text-xs">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="w-7 h-7 rounded-lg hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Sizes (S, M, L active red, XL, XXL) */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-800 block">
                      <span className="text-[#d00000]">*</span> المقاسات المتاحة
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSize(s)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            selectedSizes.includes(s)
                              ? 'bg-[#d00000] text-white border-[#d00000] shadow-xs'
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Swatches */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    <span className="text-[#d00000]">*</span> اللون الأساسي
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { id: 'red', color: 'bg-red-600', label: 'أحمر تراثي' },
                      { id: 'black', color: 'bg-black', label: 'أسود كلاسيك' },
                      { id: 'emerald', color: 'bg-emerald-700', label: 'زمردي مصري' },
                      { id: 'beige', color: 'bg-amber-100', label: 'كتان رملي' },
                      { id: 'navy', color: 'bg-blue-900', label: 'كحلي داكن' }
                    ].map((c) => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedColor(c.id)}
                        className={`w-7 h-7 rounded-full cursor-pointer transition-all flex items-center justify-center ${c.color} ${
                          selectedColor === c.id ? 'ring-2 ring-offset-2 ring-[#d00000] scale-110' : 'ring-1 ring-gray-300'
                        }`}
                        title={c.label}
                      >
                        {selectedColor === c.id && (
                          <span className={c.id === 'beige' ? 'text-slate-900 text-[11px] font-black' : 'text-white text-[11px] font-black'}>
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Settings */}
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-500">local_shipping</span>
                      <span className="text-xs font-bold text-slate-800">إعدادات الشحن السريع</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={shippingEnabled} 
                        onChange={(e) => setShippingEnabled(e.target.checked)} 
                        className="sr-only peer" 
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#d00000]" />
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <select
                      value={governorate}
                      onChange={(e) => setGovernorate(e.target.value)}
                      className="px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs cursor-pointer focus:outline-none"
                    >
                      <option value="جميع المحافظات">جميع المحافظات (شحن موحد)</option>
                      <option value="القاهرة والجيزة">القاهرة والجيزة</option>
                      <option value="الإسكندرية">الإسكندرية والساحل</option>
                      <option value="الدلتا والقناة">الدلتا والقناة</option>
                      <option value="الصعيد">محافظات الصعيد</option>
                    </select>

                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="px-2.5 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs cursor-pointer focus:outline-none"
                    >
                      <option value="جميع المناطق">جميع المناطق</option>
                      <option value="المعادي ومصر الجديدة">المعادي ومصر الجديدة</option>
                      <option value="الشيخ زايد وأكتوبر">الشيخ زايد وأكتوبر</option>
                      <option value="وسط البلد والتجمع">وسط البلد والتجمع الخامس</option>
                    </select>
                  </div>

                  <p className="text-[10px] text-gray-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#d00000]">schedule</span>
                    <span>متوسط مدة التوصيل: 2 - 4 أيام عمل عبر بوسطة Bosta & Aramex</span>
                  </p>
                </div>

                {/* Big Red Publish Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="w-full py-3.5 rounded-2xl bg-[#d00000] hover:bg-[#b00000] text-white font-black text-sm shadow-md shadow-red-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isPublishing ? 'sync' : 'publish'}
                    </span>
                    <span>{isPublishing ? 'جاري رفع ونشر المنتج...' : 'نشر المنتج الآن في المتجر والريلز'}</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. PUBLISHING IN-PROGRESS OVERLAY                                          */}
      {/* ========================================================================= */}
      {isPublishing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-[#d00000] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] animate-spin">sync</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">جاري نشر المنتج والريلز</h3>
              <p className="text-xs text-gray-500">{publishStatusText}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${publishProgress}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-gray-400">
              <span>Supabase Cloud Sync</span>
              <span className="font-bold text-slate-700">{publishProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SUCCESS PUBLISHED MODAL (End-to-End Functional)                         */}
      {/* ========================================================================= */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full text-center space-y-5 shadow-2xl border border-gray-200 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md shadow-emerald-500/20">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-900">تم نشر المنتج والريلز بنجاح! 🚀</h2>
              <p className="text-xs text-gray-600">
                أصبح منتجك متوفراً للبيع الفوري في المتجر وتم ربطه بريلز تفاعلي 9:16 مع إمكانية الشراء السريع!
              </p>
            </div>

            {/* Product & Reel Snapshot */}
            <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200/80 flex items-center gap-3 text-start">
              <div className="w-14 h-18 rounded-xl overflow-hidden bg-black shrink-0 border border-gray-300">
                <img 
                  src={photos[0] || '/images/products/linen_abaya.jpg'} 
                  alt="Product" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-black text-slate-900 block truncate">{productName}</span>
                <span className="text-[11px] font-black text-[#d00000] block mt-0.5">
                  EGP {Number(price).toLocaleString()}
                </span>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-500">
                  <span className="material-symbols-outlined text-[12px] text-emerald-600">cloud_done</span>
                  <span>محفوظ في Supabase & Local Catalog</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('reels');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#d00000] text-white font-bold text-xs shadow-md shadow-red-500/20 hover:bg-[#b00000] active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">play_circle</span>
                <span>مشاهدة الفيديو في الريلز 📱</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('shop');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                <span>معاينة في المتجر 🛍️</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-xs font-bold text-gray-500">
              <button
                type="button"
                onClick={handleResetForm}
                className="hover:text-[#d00000] flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add_circle</span>
                <span>إضافة منتج آخر</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('dashboard');
                }}
                className="hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                <span>العودة للوحة التحكم</span>
                <span className="material-symbols-outlined text-[15px] rtl:rotate-180">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
