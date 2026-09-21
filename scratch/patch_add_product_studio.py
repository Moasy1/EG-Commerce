import re

path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\pages\AddProductStudio.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean form state initial values
old_state = """  // Form State
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
  ]);"""

new_state = """  // Form State (Cleaned of all mockups - real user entered data only)
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('الملابس الرجالية والنسائية');
  const [quantity, setQuantity] = useState(15);

  // Sizing & Size Guide State
  const [availableSizes, setAvailableSizes] = useState(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
  const [selectedSizes, setSelectedSizes] = useState([]);
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
  const [selectedColorIds, setSelectedColorIds] = useState([]);
  const [primaryColorId, setPrimaryColorId] = useState('');

  // Custom Color Creator State
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [newColorHex, setNewColorHex] = useState('#7c3aed');
  const [newColorName, setNewColorName] = useState('');
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [governorate, setGovernorate] = useState('جميع المحافظات');
  const [area, setArea] = useState('جميع المناطق');
  const [codEnabled, setCodEnabled] = useState(true);
  const [specs, setSpecs] = useState('');

  // Media State: Video & Photos
  const [videoUrl, setVideoUrl] = useState('');
  const [videoName, setVideoName] = useState('');
  const [videoSize, setVideoSize] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [isCustomUploadedVideo, setIsCustomUploadedVideo] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [photos, setPhotos] = useState([]);"""

if old_state in content:
    content = content.replace(old_state, new_state)
    print("Replaced initial state successfully")
else:
    print("WARNING: old_state not matched directly")

# 2. Fix payload creation - no fake sizes, colors, or image fallbacks
old_payload = """      category: category,
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
      colorSwatches: selectedColorObjects,"""

new_payload = """      category: category,
      image: photos[0] || (videoUrl ? videoUrl : null),
      images: photos,
      video: videoUrl || null,
      rating: 5.0,
      reviewsCount: 0,
      stock: Number(quantity) || 10,
      sizes: selectedSizes,
      sizeGuide: {
        type: sizeGuideType,
        image: sizeGuideImage,
        chart: sizeChart,
        hasGuide: Boolean(sizeGuideImage || (sizeChart && sizeChart.length > 0))
      },
      colors: selectedColorNames,
      colorSwatches: selectedColorObjects,"""

if old_payload in content:
    content = content.replace(old_payload, new_payload)
    print("Replaced payload successfully")
else:
    print("WARNING: old_payload not matched directly")

# 3. Clean reset form
old_reset = """  const handleResetForm = () => {
    setShowSuccessModal(false);
    setProductName('طقم كتان مصري جديد');
    setDescription('تصميم عصري مصنوع من خامات مصرية طبيعية راقية.');"""

new_reset = """  const handleResetForm = () => {
    setShowSuccessModal(false);
    setProductName('');
    setDescription('');"""

if old_reset in content:
    content = content.replace(old_reset, new_reset)
    print("Replaced reset form successfully")

# 4. Clean video preview fallback container
old_preview = """                {/* 9:16 REAL HTML5 Video Player Container */}
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
                  />"""

new_preview = """                {/* 9:16 REAL HTML5 Video Player Container */}
                <div className="relative aspect-[9/16] w-full max-w-[320px] mx-auto rounded-2xl overflow-hidden bg-slate-900 shadow-md group">
                  {videoUrl ? (
                    <video
                      ref={videoPlayerRef}
                      src={videoUrl}
                      poster={photos[0]}
                      className="w-full h-full object-cover cursor-pointer"
                      loop
                      playsInline
                      muted={isMuted}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onClick={togglePlayPause}
                    />
                  ) : photos.length > 0 ? (
                    <img
                      src={photos[0]}
                      alt="Product Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white/80">
                        <span className="material-symbols-outlined text-3xl">video_camera_front</span>
                      </div>
                      <p className="text-xs font-bold text-gray-300 leading-relaxed">
                        قم برفع فيديو أو صور للمنتج لمعاينته رأسياً (9:16)
                      </p>
                      <span className="text-[10px] text-gray-500">يدعم MP4, WebM, WEBP, JPG</span>
                    </div>
                  )}"""

if old_preview in content:
    content = content.replace(old_preview, new_preview)
    print("Replaced preview container successfully")
else:
    print("WARNING: old_preview not matched directly")

# 5. Clean mock images in thumbnail overlay
content = content.replace("src={photos[0] || '/images/products/linen_abaya.jpg'}", "src={photos[0] || '/images/brands/dripfit_logo.png'}")
content = content.replace("poster={photos[0] || '/images/products/linen_abaya.jpg'}", "poster={photos[0] || ''}")
content = content.replace('"/images/products/linen_abaya.jpg"', '"/images/products/the_sharp_v_yellow_1.webp"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Saved AddProductStudio.jsx")
