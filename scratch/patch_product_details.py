import re

# 1. Patch ProductDetail.jsx
pd_path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\pages\ProductDetail.jsx'
with open(pd_path, 'r', encoding='utf-8') as f:
    pd_content = f.read()

old_pd_data = """  const availableSizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ['XS', 'S', 'M', 'L', 'XL'];

  const availableSwatches = product.colorSwatches && product.colorSwatches.length > 0
    ? product.colorSwatches
    : (product.colors && product.colors.length > 0 
        ? product.colors.map(c => ({ name: c, hex: '#8b5a2b' })) 
        : [
            { name: 'أصفر ليموني • Lemon', hex: '#d4af37' },
            { name: 'بيج كتاني • Linen Beige', hex: '#d2b48c' },
            { name: 'أسود كلاسيك • Onyx Black', hex: '#111827' }
          ]);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(availableSwatches[0]?.name || 'Default');
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const productImages = (product.images && product.images.length > 0) ? product.images : [
    product.image || '/images/products/linen_abaya.jpg',
    typeof product.image === 'string' ? product.image.replace('.jpg', '_2.jpg').replace('.webp', '_2.webp').replace('.png', '_2.png') : '/images/products/linen_abaya.jpg',
    typeof product.image === 'string' ? product.image.replace('.jpg', '_3.jpg').replace('.webp', '_3.webp').replace('.png', '_3.png') : '/images/products/linen_abaya.jpg',
    typeof product.image === 'string' ? product.image.replace('.jpg', '_4.jpg').replace('.webp', '_4.webp').replace('.png', '_4.png') : '/images/products/linen_abaya.jpg',
  ];"""

new_pd_data = """  const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];

  const availableSwatches = product.colorSwatches && product.colorSwatches.length > 0
    ? product.colorSwatches
    : (product.colors && product.colors.length > 0 
        ? product.colors.map(c => ({ name: c, hex: '#8b5a2b' })) 
        : []);

  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || null);
  const [selectedColor, setSelectedColor] = useState(availableSwatches[0]?.name || null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const productImages = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : ['/images/products/the_sharp_v_yellow_1.webp']);"""

if old_pd_data in pd_content:
    pd_content = pd_content.replace(old_pd_data, new_pd_data)
    print("ProductDetail.jsx data patched")
else:
    print("WARNING: ProductDetail.jsx old_pd_data not matched")

# Wrap color swatches in ProductDetail.jsx
old_pd_colors = """          {/* Color Swatches */}
          <div className="space-y-2">"""
new_pd_colors = """          {/* Color Swatches */}
          {availableSwatches && availableSwatches.length > 0 && (
          <div className="space-y-2">"""

old_pd_colors_end = """            </div>
          </div>

          {/* Size Selector */}"""
new_pd_colors_end = """            </div>
          </div>
          )}

          {/* Size Selector */}
          {availableSizes && availableSizes.length > 0 && ("""

old_pd_sizes_end = """            </div>
          </div>

          {/* Dedicated Shoppable Reel Card */}"""
new_pd_sizes_end = """            </div>
          </div>
          )}

          {/* Dedicated Shoppable Reel Card */}"""

if old_pd_colors in pd_content and old_pd_colors_end in pd_content and old_pd_sizes_end in pd_content:
    pd_content = pd_content.replace(old_pd_colors, new_pd_colors)
    pd_content = pd_content.replace(old_pd_colors_end, new_pd_colors_end)
    pd_content = pd_content.replace(old_pd_sizes_end, new_pd_sizes_end)
    print("ProductDetail.jsx conditionals wrapped")

with open(pd_path, 'w', encoding='utf-8') as f:
    f.write(pd_content)

# 2. Patch DesktopProductDetail.jsx
dpd_path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\components\desktop\DesktopProductDetail.jsx'
with open(dpd_path, 'r', encoding='utf-8') as f:
    dpd_content = f.read()

old_dpd_data = """  const availableSizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ['S', 'M', 'L', 'XL'];

  const availableSwatches = product.colorSwatches && product.colorSwatches.length > 0
    ? product.colorSwatches
    : (product.colors && product.colors.length > 0 
        ? product.colors.map(c => ({ name: c, hex: '#8b5a2b' })) 
        : [
            { name: 'أصفر ليموني • Lemon', hex: '#d4af37' },
            { name: 'بيج كتاني • Linen Beige', hex: '#d2b48c' },
            { name: 'أسود كلاسيك • Onyx Black', hex: '#111827' }
          ]);

  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(availableSwatches[0]?.name || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [activeTabSub, setActiveTabSub] = useState('reviews');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const galleryThumbs = (product.images && product.images.length > 0)
    ? product.images
    : [
        product.image || '/images/products/linen_abaya.jpg',
        typeof product.image === 'string' ? product.image.replace('.jpg', '_2.jpg').replace('.webp', '_2.webp').replace('.png', '_2.png') : '/images/products/linen_abaya.jpg',
        typeof product.image === 'string' ? product.image.replace('.jpg', '_3.jpg').replace('.webp', '_3.webp').replace('.png', '_3.png') : '/images/products/linen_abaya.jpg',
        typeof product.image === 'string' ? product.image.replace('.jpg', '_4.jpg').replace('.webp', '_4.webp').replace('.png', '_4.png') : '/images/products/linen_abaya.jpg',
      ];

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 15;

  const productVideo = product.video || '/images/reels/fashion_citrine_blazer.mp4';"""

new_dpd_data = """  const availableSizes = Array.isArray(product.sizes) ? product.sizes : [];

  const availableSwatches = product.colorSwatches && product.colorSwatches.length > 0
    ? product.colorSwatches
    : (product.colors && product.colors.length > 0 
        ? product.colors.map(c => ({ name: c, hex: '#8b5a2b' })) 
        : []);

  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || null);
  const [selectedColor, setSelectedColor] = useState(availableSwatches[0]?.name || null);
  const [quantity, setQuantity] = useState(1);
  const [activeTabSub, setActiveTabSub] = useState('reviews');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const galleryThumbs = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : ['/images/products/the_sharp_v_yellow_1.webp']);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productVideo = product.video || null;"""

if old_dpd_data in dpd_content:
    dpd_content = dpd_content.replace(old_dpd_data, new_dpd_data)
    print("DesktopProductDetail.jsx data patched")
else:
    print("WARNING: DesktopProductDetail.jsx old_dpd_data not matched")

old_dpd_colors = """            {/* Color Swatches */}
            <div className="space-y-1.5">"""
new_dpd_colors = """            {/* Color Swatches */}
            {availableSwatches && availableSwatches.length > 0 && (
            <div className="space-y-1.5">"""

old_dpd_colors_end = """              </div>
            </div>

            {/* Size Selector */}"""
new_dpd_colors_end = """              </div>
            </div>
            )}

            {/* Size Selector */}
            {availableSizes && availableSizes.length > 0 && ("""

old_dpd_sizes_end = """              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}"""
new_dpd_sizes_end = """              </div>
            </div>
            )}

            {/* Quantity Stepper & Add to Cart */}"""

if old_dpd_colors in dpd_content and old_dpd_colors_end in dpd_content and old_dpd_sizes_end in dpd_content:
    dpd_content = dpd_content.replace(old_dpd_colors, new_dpd_colors)
    dpd_content = dpd_content.replace(old_dpd_colors_end, new_dpd_colors_end)
    dpd_content = dpd_content.replace(old_dpd_sizes_end, new_dpd_sizes_end)
    print("DesktopProductDetail.jsx conditionals wrapped")

with open(dpd_path, 'w', encoding='utf-8') as f:
    f.write(dpd_content)

# 3. Patch QuickBuyDrawer.jsx
qbd_path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\components\common\QuickBuyDrawer.jsx'
with open(qbd_path, 'r', encoding='utf-8') as f:
    qbd_content = f.read()

old_qbd_data = """  const availableSizes = quickBuyProduct?.sizes && quickBuyProduct.sizes.length > 0
    ? quickBuyProduct.sizes
    : ['S', 'M', 'L', 'XL'];

  const availableSwatches = quickBuyProduct?.colorSwatches && quickBuyProduct.colorSwatches.length > 0
    ? quickBuyProduct.colorSwatches
    : (quickBuyProduct?.colors && quickBuyProduct.colors.length > 0
        ? quickBuyProduct.colors.map(c => ({ name: c, hex: '#8b5a2b' }))
        : [
            { name: 'أصفر ليموني • Lemon', hex: '#d4af37' },
            { name: 'بيج كتاني • Linen Beige', hex: '#d2b48c' }
          ]);"""

new_qbd_data = """  const availableSizes = Array.isArray(quickBuyProduct?.sizes) ? quickBuyProduct.sizes : [];

  const availableSwatches = quickBuyProduct?.colorSwatches && quickBuyProduct.colorSwatches.length > 0
    ? quickBuyProduct.colorSwatches
    : (quickBuyProduct?.colors && quickBuyProduct.colors.length > 0
        ? quickBuyProduct.colors.map(c => ({ name: c, hex: '#8b5a2b' }))
        : []);"""

if old_qbd_data in qbd_content:
    qbd_content = qbd_content.replace(old_qbd_data, new_qbd_data)
    print("QuickBuyDrawer.jsx data patched")
else:
    print("WARNING: QuickBuyDrawer.jsx old_qbd_data not matched")

old_qbd_sizes = """        {/* Size Selection with Size Guide Link */}
        <div className="mb-3">"""
new_qbd_sizes = """        {/* Size Selection with Size Guide Link */}
        {availableSizes && availableSizes.length > 0 && (
        <div className="mb-3">"""

old_qbd_sizes_end = """          </div>
        </div>

        {/* Color Selection with Swatches */}
        <div className="mb-5">"""
new_qbd_sizes_end = """          </div>
        </div>
        )}

        {/* Color Selection with Swatches */}
        {availableSwatches && availableSwatches.length > 0 && (
        <div className="mb-5">"""

old_qbd_colors_end = """          </div>
        </div>

        {/* Delivery Timeline Notice */}"""
new_qbd_colors_end = """          </div>
        </div>
        )}

        {/* Delivery Timeline Notice */}"""

if old_qbd_sizes in qbd_content and old_qbd_sizes_end in qbd_content and old_qbd_colors_end in qbd_content:
    qbd_content = qbd_content.replace(old_qbd_sizes, new_qbd_sizes)
    qbd_content = qbd_content.replace(old_qbd_sizes_end, new_qbd_sizes_end)
    qbd_content = qbd_content.replace(old_qbd_colors_end, new_qbd_colors_end)
    print("QuickBuyDrawer.jsx conditionals wrapped")

with open(qbd_path, 'w', encoding='utf-8') as f:
    f.write(qbd_content)

print("All product details patched cleanly!")
