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

// Curated Egyptian Fashion Color Themes
const CURATED_COLOR_PALETTES = [
  {
    themeName: '🇪🇬 التراث والكتان المصري',
    swatches: [
      { name: 'أحمر نوبي', hex: '#b91c1c' },
      { name: 'رملي صيفي', hex: '#e2d9cc' },
      { name: 'أخضر واحات', hex: '#15803d' },
      { name: 'طيني أسمر', hex: '#78350f' },
      { name: 'خردلي ذهبي', hex: '#d97706' }
    ]
  },
  {
    themeName: '🌊 ألوان الساحل والبحر',
    swatches: [
      { name: 'سماوي ناصع', hex: '#38bdf8' },
      { name: 'أزرق متوسطي', hex: '#0284c7' },
      { name: 'فيروزي مرجاني', hex: '#0d9488' },
      { name: 'أبيض لؤلؤي', hex: '#f8fafc' },
      { name: 'كحلي ملكي', hex: '#1e40af' }
    ]
  },
  {
    themeName: '🌸 تريند الباستيل 2026',
    swatches: [
      { name: 'وردي هادئ', hex: '#f472b6' },
      { name: 'لافندر ناعم', hex: '#c084fc' },
      { name: 'مشمشي باستيل', hex: '#fdba74' },
      { name: 'مينت نعناعي', hex: '#86efac' },
      { name: 'ليموني بارد', hex: '#fef08a' }
    ]
  }
];

// Curated Sizing Presets by Category
const SIZING_PRESETS = [
  {
    category: '👗 ملابس وفساتين حريمي',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    category: '🧕 عبايات وجلابيات مصرية',
    sizes: ['52 (طول 133)', '54 (طول 138)', '56 (طول 143)', '58 (طول 148)', '60 (طول 153)', 'مقاس موحد']
  },
  {
    category: '👕 قمصان وكاجوال رجالي',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL']
  },
  {
    category: '✨ مقاس حر (Free Size)',
    sizes: ['Free Size (مقاس موحد مريح)']
  }
];

const DEFAULT_SIZE_CHART = [
  { size: 'S', chest: '88 - 92', waist: '68 - 72', hips: '94 - 98', length: '140' },
  { size: 'M', chest: '92 - 96', waist: '72 - 76', hips: '98 - 102', length: '142' },
  { size: 'L', chest: '96 - 102', waist: '76 - 82', hips: '102 - 108', length: '145' },
  { size: 'XL', chest: '102 - 108', waist: '82 - 88', hips: '108 - 114', length: '145' },
  { size: 'XXL', chest: '108 - 116', waist: '88 - 96', hips: '114 - 122', length: '148' },
];

export default function AddProductStudio() {
  const { setActiveTab, addProduct, user, role, merchants, selectedMerchantId } = useApp();

  // Form State
  const [productName, setProductName] = useState('فستان مطرز مصري فاخر');
  const [description, setDescription] = useState(
    'فستان أنيق بتطريز يدوي مستوحى من التراث المصري، مصنوع من قماش عالي الجودة مناسب للمناسبات والإطلالات الخاصة، يجمع بين الأصالة والموضة العصرية.'
  );
  const [price, setPrice] = useState(1250);
  const [originalPrice, setOriginalPrice] = useState(1650);
  const [category, setCategory] = useState('الفساتين');
  const [quantity, setQuantity] = useState(20);

  // Sizing & Size Guide State
  const [availableSizes, setAvailableSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [selectedSizes, setSelectedSizes] = useState(['L']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [isAddingCustomSize, setIsAddingCustomSize] = useState(false);

  // Size Guide Upload / Interactive Chart State
  const [sizeGuideType, setSizeGuideType] = useState('chart'); // 'chart' | 'image'
  const [sizeGuideImage, setSizeGuideImage] = useState(null);
  const [sizeGuideImageName, setSizeGuideImageName] = useState('');
  const [isSizeChartEditorOpen, setIsSizeChartEditorOpen] = useState(false);
  const [sizeChart, setSizeChart] = useState(DEFAULT_SIZE_CHART);
  const [showSizeGuidePreviewModal, setShowSizeGuidePreviewModal] = useState(false);
  const sizeGuideInputRef = useRef(null);

  // Dynamic Color Palette & Swatches State
  const [colorPalette, setColorPalette] = useState([
    { id: 'c-red', name: 'أحمر تراثي', hex: '#d00000', isPreset: true },
    { id: 'c-black', name: 'أسود كلاسيك', hex: '#111827', isPreset: true },
    { id: 'c-emerald', name: 'زمردي مصري', hex: '#047857', isPreset: true },
    { id: 'c-beige', name: 'كتان رملي', hex: '#fef3c7', isPreset: true },
    { id: 'c-navy', name: 'كحلي داكن', hex: '#1e3a8a', isPreset: true },
    { id: 'c-terracotta', name: 'تيراكوتا نوبي', hex: '#c2410c', isPreset: true }
  ]);
  const [selectedColorIds, setSelectedColorIds] = useState(['c-red']);
  const [primaryColorId, setPrimaryColorId] = useState('c-red');

  // Custom Color Creator State
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [newColorHex, setNewColorHex] = useState('#7c3aed');
  const [newColorName, setNewColorName] = useState('');
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

  // Sizing Handlers
  const toggleSize = (size) => {
    setSelectedSizes(prev => {
      if (prev.includes(size)) {
        if (prev.length === 1) return prev; // Keep at least one size
        return prev.filter(s => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const handleAddCustomSize = (e) => {
    e?.preventDefault();
    const clean = customSizeInput.trim();
    if (!clean) return;
    if (!availableSizes.includes(clean)) {
      setAvailableSizes(prev => [...prev, clean]);
    }
    if (!selectedSizes.includes(clean)) {
      setSelectedSizes(prev => [...prev, clean]);
    }
    setCustomSizeInput('');
    setIsAddingCustomSize(false);
  };

  const removeAvailableSize = (size, e) => {
    e?.stopPropagation();
    setAvailableSizes(prev => prev.filter(s => s !== size));
    setSelectedSizes(prev => prev.filter(s => s !== size));
  };

  const applySizingPreset = (preset) => {
    setAvailableSizes(preset.sizes);
    setSelectedSizes([preset.sizes[0], preset.sizes[1] || preset.sizes[0]]);
  };

  const handleSizeGuideUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSizeGuideImage(url);
    setSizeGuideImageName(file.name);
    setSizeGuideType('image');
  };

  const removeSizeGuideImage = (e) => {
    e?.stopPropagation();
    setSizeGuideImage(null);
    setSizeGuideImageName('');
    setSizeGuideType('chart');
    if (sizeGuideInputRef.current) sizeGuideInputRef.current.value = '';
  };

  const handleSizeChartChange = (index, field, value) => {
    setSizeChart(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addSizeChartRow = () => {
    setSizeChart(prev => [
      ...prev,
      { size: `مقاس ${prev.length + 1}`, chest: '100', waist: '80', hips: '105', length: '145' }
    ]);
  };

  // Color Swatches Handlers
  const toggleColorSelection = (colorId) => {
    setSelectedColorIds(prev => {
      if (prev.includes(colorId)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        const updated = prev.filter(id => id !== colorId);
        if (primaryColorId === colorId && updated.length > 0) {
          setPrimaryColorId(updated[0]);
        }
        return updated;
      } else {
        return [...prev, colorId];
      }
    });
  };

  const handleAddCustomColor = (e) => {
    e?.preventDefault();
    const name = newColorName.trim() || `لون مخصص (${newColorHex.toUpperCase()})`;
    const newId = `c-custom-${Date.now()}`;
    const newColor = { id: newId, name, hex: newColorHex, isPreset: false };
    
    setColorPalette(prev => [...prev, newColor]);
    setSelectedColorIds(prev => [...prev, newId]);
    setPrimaryColorId(newId);
    setNewColorName('');
    setIsColorPickerOpen(false);
  };

  const handleApplyThemeSwatch = (swatch) => {
    const existing = colorPalette.find(c => c.hex.toLowerCase() === swatch.hex.toLowerCase());
    if (existing) {
      if (!selectedColorIds.includes(existing.id)) {
        setSelectedColorIds(prev => [...prev, existing.id]);
      }
      setPrimaryColorId(existing.id);
    } else {
      const newId = `c-theme-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
      const newColor = { id: newId, name: swatch.name, hex: swatch.hex, isPreset: false };
      setColorPalette(prev => [...prev, newColor]);
      setSelectedColorIds(prev => [...prev, newId]);
      setPrimaryColorId(newId);
    }
  };

  const removeCustomColor = (colorId, e) => {
    e?.stopPropagation();
    setColorPalette(prev => prev.filter(c => c.id !== colorId));
    setSelectedColorIds(prev => prev.filter(id => id !== colorId));
    if (primaryColorId === colorId) {
      const remaining = colorPalette.filter(c => c.id !== colorId);
      if (remaining[0]) setPrimaryColorId(remaining[0].id);
    }
  };

  const primaryColor = colorPalette.find(c => c.id === primaryColorId) || colorPalette[0];

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

    const selectedColorObjects = selectedColorIds
      .map(id => colorPalette.find(c => c.id === id))
      .filter(Boolean);
    const selectedColorNames = selectedColorObjects.map(c => c.name);

    const activeMerchant = (merchants && merchants.find(m => m.id === selectedMerchantId)) || merchants?.[0];
    const newProdPayload = {
      id: `p-${Date.now()}`,
      sku: `EG-${Date.now().toString().slice(-6)}`,
      title: productName,
      price: Number(price),
      originalPrice: Number(originalPrice) || Math.round(Number(price) * 1.3),
      merchant: activeMerchant?.name || user?.name || 'Talieska Studio • تاليسكا ستوديو',
      merchantId: activeMerchant?.id || 'm0000000-0000-0000-0000-000000000001',
      merchantSlug: activeMerchant?.slug || 'talieska',
      createdBy: user?.id || null,
      creatorName: user?.name || activeMerchant?.name || 'مبدع مصري',
      creatorHandle: user?.role === 'creator' ? `@${(user.name || 'creator').replace(/\s+/g, '_')}` : `@${activeMerchant?.slug || 'talieska'}_official`,
      creatorAvatar: user?.avatar_url || activeMerchant?.logo || photos[0],
      category: category,
      image: photos[0] || '/images/products/linen_abaya.jpg',
      images: photos,
      video: videoUrl,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(quantity) || 20,
      sizes: selectedSizes.length > 0 ? selectedSizes : ['M', 'L'],
      sizeGuide: {
        type: sizeGuideType,
        image: sizeGuideImage,
        chart: sizeChart,
        hasGuide: Boolean(sizeGuideImage || (sizeChart && sizeChart.length > 0))
      },
      colors: selectedColorNames.length > 0 ? selectedColorNames : ['أحمر تراثي'],
      colorSwatches: selectedColorObjects,
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
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-black text-[#d00000] font-mono">
                          EGP {Number(price || 0).toLocaleString()}
                        </span>
                        {primaryColor && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-700 bg-gray-100/90 px-1.5 py-0.5 rounded-full border border-gray-200">
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0" 
                              style={{ backgroundColor: primaryColor.hex }} 
                            />
                            <span className="max-w-[70px] truncate">{primaryColor.name}</span>
                          </span>
                        )}
                        {selectedSizes.length > 0 && (
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowSizeGuidePreviewModal(true);
                            }}
                            className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-slate-800 bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded-full border border-gray-200 cursor-pointer"
                            title="عرض دليل المقاسات"
                          >
                            <span className="material-symbols-outlined text-[10px] text-gray-500">straighten</span>
                            <span>{selectedSizes[0]}</span>
                            {selectedSizes.length > 1 && <span className="text-[8px] text-gray-400">+{selectedSizes.length - 1}</span>}
                          </span>
                        )}
                      </div>
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

                  {/* Interactive Sizes & Size Guide Studio */}
                  <div className="space-y-2.5 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-gray-500">straighten</span>
                        <label className="text-xs font-bold text-slate-800">
                          <span className="text-[#d00000]">*</span> المقاسات ودليل القياسات (Sizes & Guide)
                        </label>
                      </div>
                      <span className="text-[10px] font-bold text-gray-500">
                        محدد {selectedSizes.length} من {availableSizes.length}
                      </span>
                    </div>

                    {/* Active Size Chips + Add Custom Size */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {availableSizes.map((s) => {
                        const isSelected = selectedSizes.includes(s);
                        const isCustom = !['XS', 'S', 'M', 'L', 'XL', 'XXL'].includes(s);

                        return (
                          <div key={s} className="relative group">
                            <button
                              type="button"
                              onClick={() => toggleSize(s)}
                              className={`h-8 min-w-[34px] px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1 ${
                                isSelected
                                  ? 'bg-[#d00000] text-white border-[#d00000] shadow-xs'
                                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span>{s}</span>
                              {isSelected && <span className="text-[10px]">✓</span>}
                            </button>

                            {/* Delete custom size button */}
                            {isCustom && (
                              <button
                                type="button"
                                onClick={(e) => removeAvailableSize(s, e)}
                                className="absolute -top-1.5 -start-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                                title="حذف المقاس"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Add Custom Size Button */}
                      {!isAddingCustomSize ? (
                        <button
                          type="button"
                          onClick={() => setIsAddingCustomSize(true)}
                          className="h-8 px-2.5 rounded-xl border border-dashed border-gray-300 text-xs font-bold text-gray-600 hover:border-gray-500 hover:bg-gray-50 flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                          <span>مقاس مخصص</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            autoFocus
                            value={customSizeInput}
                            onChange={(e) => setCustomSizeInput(e.target.value)}
                            placeholder="مثال: 56، 44 EU، One Size"
                            className="h-8 w-32 px-2 rounded-xl border border-[#d00000] bg-white text-xs font-bold focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomSize();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomSize}
                            className="h-8 px-2.5 bg-[#d00000] text-white rounded-xl text-xs font-bold cursor-pointer"
                          >
                            حفظ
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingCustomSize(false)}
                            className="h-8 px-1.5 text-gray-400 hover:text-slate-900 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Sizing Presets Quick Selector */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      <span className="text-[10px] text-gray-400 font-bold">نماذج سريعة:</span>
                      {SIZING_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applySizingPreset(preset)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                        >
                          {preset.category}
                        </button>
                      ))}
                    </div>

                    {/* Size Guide Management Card (Upload Image or View/Edit Chart) */}
                    <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 p-3 space-y-2 text-start">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-blue-600">rule</span>
                          <span className="text-xs font-bold text-slate-900">دليل المقاسات للمشترين (Size Guide)</span>
                        </div>

                        {/* Status tag */}
                        {sizeGuideImage ? (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">image</span>
                            <span>تم إرفاق صورة</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700">
                            جدول القياسات مفعل
                          </span>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-500">
                        {sizeGuideImage 
                          ? `ملف الصورة: ${sizeGuideImageName || 'size_chart.png'}`
                          : 'يمكنك رفع صورة لدليل مقاسات علامتك التجارية أو استخدام جدول القياسات التفاعلي أدناه.'
                        }
                      </p>

                      {/* Hidden Size Guide Input */}
                      <input 
                        ref={sizeGuideInputRef}
                        type="file" 
                        accept="image/*,application/pdf"
                        onChange={handleSizeGuideUpload}
                        className="hidden" 
                      />

                      {/* Size Guide Action Buttons */}
                      <div className="flex items-center gap-2 flex-wrap pt-0.5">
                        <button
                          type="button"
                          onClick={() => sizeGuideInputRef.current?.click()}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-blue-200 text-[11px] font-bold text-blue-700 hover:bg-blue-50 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px]">cloud_upload</span>
                          <span>{sizeGuideImage ? 'استبدال صورة الدليل' : 'رفع صورة دليل المقاسات'}</span>
                        </button>

                        {sizeGuideImage && (
                          <button
                            type="button"
                            onClick={removeSizeGuideImage}
                            className="px-2 py-1.5 rounded-xl bg-white border border-red-200 text-[11px] font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="إزالة صورة الدليل"
                          >
                            إزالة الصورة
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setIsSizeChartEditorOpen(!isSizeChartEditorOpen)}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                            isSizeChartEditorOpen 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-2xs'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">table_chart</span>
                          <span>{isSizeChartEditorOpen ? 'إخفاء جدول القياسات' : 'تعديل جدول القياسات'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowSizeGuidePreviewModal(true)}
                          className="px-2.5 py-1.5 rounded-xl bg-white border border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs ms-auto"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          <span>معاينة كما يراها المشتري</span>
                        </button>
                      </div>

                      {/* Interactive Size Chart Table Editor */}
                      {isSizeChartEditorOpen && (
                        <div className="pt-2 border-t border-blue-200/60 space-y-2 animate-fade-in">
                          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                            <span>جدول مقاسات القطعة (بالسنتيمتر cm):</span>
                            <button
                              type="button"
                              onClick={addSizeChartRow}
                              className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <span>+ إضافة مقاس</span>
                            </button>
                          </div>

                          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-2xs">
                            <table className="w-full text-[10px] text-center">
                              <thead className="bg-gray-100 text-slate-700 font-bold border-b border-gray-200">
                                <tr>
                                  <th className="py-1.5 px-2">المقاس</th>
                                  <th className="py-1.5 px-2">الصدر (سم)</th>
                                  <th className="py-1.5 px-2">الوسط (سم)</th>
                                  <th className="py-1.5 px-2">الأرداف (سم)</th>
                                  <th className="py-1.5 px-2">الطول (سم)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {sizeChart.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-gray-50/50">
                                    <td className="py-1 px-1.5 font-bold">
                                      <input
                                        type="text"
                                        value={row.size}
                                        onChange={(e) => handleSizeChartChange(rIdx, 'size', e.target.value)}
                                        className="w-14 text-center font-bold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                                      />
                                    </td>
                                    <td className="py-1 px-1.5">
                                      <input
                                        type="text"
                                        value={row.chest}
                                        onChange={(e) => handleSizeChartChange(rIdx, 'chest', e.target.value)}
                                        className="w-16 text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                                      />
                                    </td>
                                    <td className="py-1 px-1.5">
                                      <input
                                        type="text"
                                        value={row.waist}
                                        onChange={(e) => handleSizeChartChange(rIdx, 'waist', e.target.value)}
                                        className="w-16 text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                                      />
                                    </td>
                                    <td className="py-1 px-1.5">
                                      <input
                                        type="text"
                                        value={row.hips}
                                        onChange={(e) => handleSizeChartChange(rIdx, 'hips', e.target.value)}
                                        className="w-16 text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                                      />
                                    </td>
                                    <td className="py-1 px-1.5">
                                      <input
                                        type="text"
                                        value={row.length}
                                        onChange={(e) => handleSizeChartChange(rIdx, 'length', e.target.value)}
                                        className="w-16 text-center bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interactive Color Swatches & Custom Palette Studio */}
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-gray-500">palette</span>
                      <label className="text-xs font-bold text-slate-800">
                        <span className="text-[#d00000]">*</span> ألوان وباليت المنتج (Color Swatches)
                      </label>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">
                      محدد {selectedColorIds.length} من {colorPalette.length}
                    </span>
                  </div>

                  {/* Horizontal Swatches Carousel / List */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {colorPalette.map((c) => {
                      const isSelected = selectedColorIds.includes(c.id);
                      const isPrimary = primaryColorId === c.id;
                      const isLightColor = ['#fef3c7', '#ffffff', '#f8fafc', '#fef08a', '#e2d9cc'].includes(c.hex.toLowerCase());

                      return (
                        <div
                          key={c.id}
                          className="relative group"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (!isSelected) {
                                toggleColorSelection(c.id);
                              }
                              setPrimaryColorId(c.id);
                            }}
                            className={`w-8 h-8 rounded-full cursor-pointer transition-all flex items-center justify-center relative ${
                              isPrimary
                                ? 'ring-3 ring-[#d00000] ring-offset-2 scale-110 shadow-sm'
                                : isSelected
                                ? 'ring-2 ring-slate-800 ring-offset-1 scale-105'
                                : 'opacity-60 hover:opacity-100 ring-1 ring-gray-300'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={`${c.name} (${c.hex})${isPrimary ? ' - اللون الأساسي' : ''}`}
                          >
                            {/* Checkmark or Star */}
                            {isPrimary ? (
                              <span className={`text-[12px] font-black ${isLightColor ? 'text-slate-900' : 'text-white'}`}>
                                ★
                              </span>
                            ) : isSelected ? (
                              <span className={`text-[11px] font-bold ${isLightColor ? 'text-slate-900' : 'text-white'}`}>
                                ✓
                              </span>
                            ) : null}
                          </button>

                          {/* Delete custom swatch button */}
                          {!c.isPreset && (
                            <button
                              type="button"
                              onClick={(e) => removeCustomColor(c.id, e)}
                              className="absolute -top-1 -start-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs"
                              title="حذف اللون"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}

                    {/* Toggle Add Custom Color Popover Button */}
                    <button
                      type="button"
                      onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                      className={`h-8 px-2.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isColorPickerOpen
                          ? 'border-[#d00000] bg-red-50 text-[#d00000]'
                          : 'border-dashed border-gray-300 text-gray-600 hover:border-gray-500 hover:bg-gray-50'
                      }`}
                      title="إضافة لون مخصص أو اختيار باليت"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isColorPickerOpen ? 'close' : 'add'}
                      </span>
                      <span>{isColorPickerOpen ? 'إغلاق' : 'إضافة لون / باليت'}</span>
                    </button>
                  </div>

                  {/* Primary Color Indicator */}
                  {primaryColor && (
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-xl border border-gray-200/80">
                      <span className="font-bold text-slate-800">اللون الأساسي للغلاف:</span>
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs" 
                        style={{ backgroundColor: primaryColor.hex }} 
                      />
                      <span className="font-bold text-slate-900">{primaryColor.name}</span>
                      <span className="text-[10px] font-mono text-gray-400">({primaryColor.hex.toUpperCase()})</span>
                      <span className="text-[10px] text-gray-400 ms-auto">انقر على أي لون لتعيينه كأساسي</span>
                    </div>
                  )}

                  {/* Expanded Custom Color Creator & Palette Browser */}
                  {isColorPickerOpen && (
                    <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3 animate-fade-in text-start">
                      <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                        <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#d00000]">colorize</span>
                          <span>مُنشئ ألوان مخصصة (Custom Swatch Creator)</span>
                        </span>
                      </div>

                      {/* Custom Color Input Row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Native Color Picker Circle */}
                        <label className="relative cursor-pointer shrink-0" title="اختر اللون">
                          <div 
                            className="w-10 h-10 rounded-xl border-2 border-white shadow-md flex items-center justify-center transition-transform hover:scale-105"
                            style={{ backgroundColor: newColorHex }}
                          >
                            <span className="material-symbols-outlined text-[18px] text-white drop-shadow-md">colorize</span>
                          </div>
                          <input 
                            type="color" 
                            value={newColorHex} 
                            onChange={(e) => setNewColorHex(e.target.value)} 
                            className="sr-only" 
                          />
                        </label>

                        {/* Hex Display */}
                        <div className="w-24">
                          <input 
                            type="text" 
                            value={newColorHex} 
                            onChange={(e) => setNewColorHex(e.target.value)} 
                            className="w-full px-2 py-2 rounded-xl border border-gray-200 bg-white text-xs font-mono font-bold text-center focus:outline-none focus:border-[#d00000]" 
                            placeholder="#000000"
                          />
                        </div>

                        {/* Name Input */}
                        <div className="flex-1 min-w-[140px]">
                          <input 
                            type="text" 
                            value={newColorName} 
                            onChange={(e) => setNewColorName(e.target.value)} 
                            placeholder="اسم اللون (مثال: كشمير دافئ، زيتوني)" 
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium focus:outline-none focus:border-[#d00000]"
                          />
                        </div>

                        {/* Add Button */}
                        <button
                          type="button"
                          onClick={handleAddCustomColor}
                          className="px-4 py-2 bg-[#d00000] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#b00000] transition-all cursor-pointer shrink-0"
                        >
                          إضافة اللون
                        </button>
                      </div>

                      {/* Curated Pre-made Palettes (1-click additions) */}
                      <div className="pt-2 border-t border-gray-200/60 space-y-2">
                        <span className="text-[11px] font-bold text-slate-700 block">
                          🎨 باليتات مقترحة جاهزة (انقر لإضافة اللون مباشرة):
                        </span>
                        
                        <div className="space-y-1.5">
                          {CURATED_COLOR_PALETTES.map((group, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200/70">
                              <span className="text-[10px] font-bold text-gray-600 min-w-[130px] shrink-0">
                                {group.themeName}:
                              </span>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {group.swatches.map((swatch, sIdx) => (
                                  <button
                                    key={sIdx}
                                    type="button"
                                    onClick={() => handleApplyThemeSwatch(swatch)}
                                    className="w-5 h-5 rounded-full border border-gray-300 hover:scale-125 transition-transform cursor-pointer shadow-2xs"
                                    style={{ backgroundColor: swatch.hex }}
                                    title={`${swatch.name} (${swatch.hex}) - انقر للإضافة للباليت`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
      {/* ========================================================================= */}
      {/* 5. SIZE GUIDE PREVIEW MODAL                                                */}
      {/* ========================================================================= */}
      {showSizeGuidePreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full text-start space-y-4 shadow-2xl border border-gray-200 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">straighten</span>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">دليل مقاسات {productName}</h3>
                  <p className="text-[11px] text-gray-500">معاينة جدول المقاسات كما يظهر للمشتري في صفحة المنتج والريلز</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeGuidePreviewModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content: Uploaded Image or Table Chart */}
            {sizeGuideImage ? (
              <div className="space-y-2">
                <div className="rounded-2xl overflow-hidden border border-gray-200 max-h-[380px] bg-gray-50 flex items-center justify-center">
                  <img src={sizeGuideImage} alt="Size Guide Chart" className="w-full h-auto object-contain max-h-[380px]" />
                </div>
                <p className="text-[10px] text-gray-400 text-center font-mono">
                  {sizeGuideImageName} • صورة معتمدة من التاجر
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
                  <table className="w-full text-xs text-center">
                    <thead className="bg-gray-100 text-slate-800 font-bold border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-3">المقاس</th>
                        <th className="py-2.5 px-3">الصدر (سم)</th>
                        <th className="py-2.5 px-3">الوسط (سم)</th>
                        <th className="py-2.5 px-3">الأرداف (سم)</th>
                        <th className="py-2.5 px-3">الطول (سم)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-slate-700">
                      {sizeChart.map((row, idx) => (
                        <tr key={idx} className={selectedSizes.includes(row.size) ? 'bg-red-50/40 font-bold' : 'hover:bg-gray-50'}>
                          <td className="py-2.5 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded-lg ${
                              selectedSizes.includes(row.size) ? 'bg-[#d00000] text-white' : 'bg-gray-100'
                            }`}>
                              {row.size}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono">{row.chest}</td>
                          <td className="py-2.5 px-3 font-mono">{row.waist}</td>
                          <td className="py-2.5 px-3 font-mono">{row.hips}</td>
                          <td className="py-2.5 px-3 font-mono">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Measuring Tips */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1 text-[11px] text-gray-600">
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-amber-500">info</span>
                    <span>نصائح أخذ القياس بدقة:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-gray-500">
                    <li>قم بالقياس باستخدام شريط قياس مرن فوق الملابس الخفيفة.</li>
                    <li>إذا كان قياسك بين مقاسين، يفضل اختيار المقاس الأكبر لراحة أكبر في الكتان.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSizeGuidePreviewModal(false)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
