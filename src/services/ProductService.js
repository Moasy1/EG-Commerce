import { supabase } from '../lib/supabase.js';
import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../context/AppContext.jsx';

export const CATEGORIES_DATA = [
  {
    id: 'women',
    slug: 'women',
    label: 'Women',
    labelAr: 'أزياء نسائية',
    description: 'Contemporary Egyptian linen, elegant dresses, tailored blazers and seasonal collections.',
    descriptionAr: 'أحدث صيحات الموضة النسائية، فساتين أنيقة، وتصاميم كتان مصري راقية.',
    image: '/images/reels/fashion_citrine_blazer_thumb.jpg',
    banner: '/images/banners/talieska_hero.jpg',
    icon: 'woman',
    subcategories: ['All', 'Dresses', 'Tops & Blouses', 'Blazers & Jackets', 'Linen', 'Knitwear'],
    subcategoriesAr: ['الكل', 'فساتين', 'توبات وبلوزات', 'بليزرات وجواكت', 'كتان', 'تريكو وصوف'],
    keywords: ['women', 'dresses', 'dress', 'linen', 'knitwear', 'blazer', 'blouses', 'فستان', 'كتان', 'تريكو', 'بليزر', 'بلوزة', 'توب', 'أزياء', 'حريمي']
  },
  {
    id: 'men',
    slug: 'men',
    label: 'Men',
    labelAr: 'أزياء رجالية',
    description: 'Premium linen shirts, outerwear, tailored jackets and modern casualwear for men.',
    descriptionAr: 'قمصان كتان طبيعي، جواكت صوف وجلد، وإطلالات كاجوال ورسمية للرجال.',
    image: '/images/reels/fashion_suede_jacket_thumb.jpg',
    banner: '/images/reels/fashion_suede_jacket_thumb.jpg',
    icon: 'man',
    subcategories: ['All', 'Linen Shirts', 'Jackets', 'Casual Tops', 'Pants'],
    subcategoriesAr: ['الكل', 'قمصان كتان', 'جواكت ومعاطف', 'توبات كاجوال', 'بناطيل'],
    keywords: ['men', 'man', 'shirt', 'suede', 'jacket', 'wool', 'قميص', 'جاكت', 'رجالي', 'سuede', 'أوفرسايز']
  },
  {
    id: 'modest',
    slug: 'modest',
    label: 'Modest Fashion',
    labelAr: 'أزياء محتشمة وعبايات',
    description: 'Chic abayas, modest dresses, galabeyas and refined Egyptian linen silhouettes.',
    descriptionAr: 'عبايات كتان راقية، فساتين محتشمة، وجلابيات مصرية بتطريز يدوي فاخر.',
    image: '/images/products/linen_abaya.jpg',
    banner: '/images/products/linen_abaya.jpg',
    icon: 'dry_cleaning',
    subcategories: ['All', 'Abayas', 'Galabeyas', 'Maxi Dresses', 'Modest Linen'],
    subcategoriesAr: ['الكل', 'عبايات', 'جلابيات', 'فساتين طويلة', 'كتان محتشم'],
    keywords: ['modest', 'abaya', 'galabeya', 'linen', 'maxi', 'عباية', 'جلابية', 'محتشمة', 'كتان']
  },
  {
    id: 'streetwear',
    slug: 'streetwear',
    label: 'Streetwear',
    labelAr: 'ستريت وير وكاجوال',
    description: 'Bold oversized fits, urban streetwear, creative graphics and trendsetting aesthetics.',
    descriptionAr: 'إطلالات كاجوال جريئة، قمصان وتيشرتات أوفرسايز، وتصاميم شبابية عصرية.',
    image: '/images/reels/fashion_oversized_shirt_thumb.jpg',
    banner: '/images/reels/fashion_oversized_shirt_thumb.jpg',
    icon: 'checkroom',
    subcategories: ['All', 'Oversized Shirts', 'Jackets', 'Casual Tees', 'Urban Sets'],
    subcategoriesAr: ['الكل', 'قمصان أوفرسايز', 'جواكت خفيفة', 'تيشرتات', 'أطقم كاجوال'],
    keywords: ['streetwear', 'oversized', 'casual', 'shirt', 'urban', 'أوفرسايز', 'ستريت', 'كاجوال', 'قميص']
  },
  {
    id: 'accessories',
    slug: 'accessories',
    label: 'Accessories & Watches',
    labelAr: 'إكسسوارات وساعات',
    description: 'Handmade genuine leather bags, heritage jewelry and luxury timepieces.',
    descriptionAr: 'حقائب كتف جلد طبيعي، ساعات كلاسيكية فاخرة، ومجوهرات فضية مطلية بالذهب.',
    image: '/images/reels/fashion_shoulder_bags_thumb.jpg',
    banner: '/images/reels/fashion_vintage_watch_thumb.jpg',
    icon: 'handbag',
    subcategories: ['All', 'Leather Bags', 'Watches', 'Jewelry', 'Belts'],
    subcategoriesAr: ['الكل', 'شنط جلد طبيعي', 'ساعات يد', 'حلي ومجوهرات', 'أحزمة'],
    keywords: ['accessories', 'bag', 'bags', 'watch', 'watches', 'leather', 'jewelry', 'حقيبة', 'شنطة', 'ساعة', 'جلد', 'حلي', 'مجوهرات']
  },
  {
    id: 'makeup',
    slug: 'makeup',
    label: 'Beauty & Makeup',
    labelAr: 'مكياج وتجميل',
    description: 'Trending cosmetics, viral beauty essentials, lip tints and mascaras.',
    descriptionAr: 'مستحضرات تجميل أصلية، موردات شفاه جيلي، وماسكارا شيجلام الاحترافية.',
    image: '/images/reels/sheglam_mascara_thumb.jpg',
    banner: '/images/reels/sheglam_liptint_thumb.jpg',
    icon: 'brush',
    subcategories: ['All', 'Lips', 'Eyes', 'Face', 'Skincare'],
    subcategoriesAr: ['الكل', 'شفاه', 'عيون', 'بشرة ووجه', 'عناية'],
    keywords: ['makeup', 'beauty', 'sheglam', 'mascara', 'lip', 'tint', 'مكياج', 'شيجلام', 'شفاه', 'ماسكارا', 'تجميل']
  },
  {
    id: 'heritage',
    slug: 'heritage',
    label: 'Heritage Crafts',
    labelAr: 'تحف وتراث خان الخليلي',
    description: 'Handmade brass lanterns, authentic kilim rugs and Egyptian cultural crafts.',
    descriptionAr: 'فوانيس وتحف نحاسية منقوشة يدوياً، وسجاد كليم تراثي من خان الخليلي.',
    image: '/images/products/copper_lantern.jpg',
    banner: '/images/banners/khan_hero.jpg',
    icon: 'sparkles',
    subcategories: ['All', 'Brass Lanterns', 'Kilim Rugs', 'Copper Art', 'Decor'],
    subcategoriesAr: ['الكل', 'فوانيس نحاس', 'سجاد كليم', 'تحف نحاسية', 'ديكور تراثي'],
    keywords: ['heritage', 'crafts', 'lantern', 'copper', 'brass', 'kilim', 'carpet', 'نحاس', 'فانوس', 'كليم', 'سجاد', 'تراث']
  },
  {
    id: 'new',
    slug: 'new',
    label: 'New Arrivals',
    labelAr: 'وصل حديثاً',
    description: 'Fresh drops, trending reels picks and the latest 2026 fashion releases.',
    descriptionAr: 'أحدث القطع المضافة وإصدارات كولكشن 2026 الحصرية من أفضل المصممين المصريين.',
    image: '/images/reels/fashion_citrine_blazer_thumb.jpg',
    banner: '/images/banners/talieska_hero.jpg',
    icon: 'local_fire_department',
    isRedCard: true,
    subcategories: ['All', 'This Week', 'Trending Reels', 'Limited Edition'],
    subcategoriesAr: ['الكل', 'هذا الأسبوع', 'تريند الريلز', 'إصدارات محدودة'],
    keywords: ['new', 'arrivals', 'trending', 'وصل حديثا', 'جديد', 'تريند']
  }
];

export const ProductService = {
  getCategories() {
    return CATEGORIES_DATA;
  },

  getCategoryBySlug(slugOrId) {
    if (!slugOrId) return null;
    const normalized = slugOrId.toLowerCase();
    return CATEGORIES_DATA.find(c => c.id.toLowerCase() === normalized || c.slug.toLowerCase() === normalized) || null;
  },

  filterProductsByCategory(productList, categorySlugOrId) {
    if (!categorySlugOrId || categorySlugOrId === 'all' || categorySlugOrId === 'All') {
      return productList;
    }

    const catObj = this.getCategoryBySlug(categorySlugOrId);
    const filterTerm = catObj ? catObj.id.toLowerCase() : categorySlugOrId.toLowerCase();
    const keywords = catObj?.keywords || [filterTerm];

    return productList.filter(prod => {
      const prodCategory = (prod.category || '').toLowerCase();
      const prodTitle = (prod.title || '').toLowerCase();
      const prodDesc = (prod.description || '').toLowerCase();

      // Direct match
      if (prodCategory.includes(filterTerm)) return true;

      // Check keywords
      return keywords.some(kw => 
        prodCategory.includes(kw.toLowerCase()) || 
        prodTitle.includes(kw.toLowerCase()) ||
        prodDesc.includes(kw.toLowerCase())
      );
    });
  },

  async getProducts(categorySlug = null) {
    let allProducts = [];

    // 1. Fetch custom uploaded products from persistent local storage
    let customProducts = [];
    try {
      const stored = localStorage.getItem('eg_custom_products');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          customProducts = parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse eg_custom_products from storage:', e);
    }

    try {
      let query = supabase.from('products').select('*');
      
      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        allProducts = [...customProducts, ...INITIAL_PRODUCTS];
      } else {
        // Map DB products to frontend format
        const dbMapped = data.map(dbProduct => ({
          id: dbProduct.id,
          sku: dbProduct.slug,
          title: dbProduct.title,
          merchant: dbProduct.merchant_id,
          merchantId: dbProduct.merchant_id,
          merchantVerified: true,
          price: Number(dbProduct.base_price),
          originalPrice: dbProduct.sale_price ? Number(dbProduct.base_price) : undefined,
          rating: 4.9,
          reviewsCount: 38,
          stock: dbProduct.stock_quantity || 20,
          isSyndicated: true,
          image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : '/images/reels/reel_2.jpg',
          images: dbProduct.images || [],
          video: null,
          pointsEarned: Math.floor(Number(dbProduct.base_price) * 0.1),
          category: dbProduct.category_id || 'General',
          description: dbProduct.description,
          sizes: ['S', 'M', 'L'],
          colors: ['Default']
        }));

        // Merge Custom + DB products with INITIAL_PRODUCTS
        const existingIds = new Set([...customProducts.map(p => p.id), ...dbMapped.map(p => p.id)]);
        allProducts = [...customProducts, ...dbMapped, ...INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id))];
      }
    } catch (err) {
      console.warn('Error fetching products from backend:', err.message);
      const existingIds = new Set(customProducts.map(p => p.id));
      allProducts = [...customProducts, ...INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id))];
    }

    if (categorySlug && categorySlug !== 'all') {
      return this.filterProductsByCategory(allProducts, categorySlug);
    }

    return allProducts;
  },

  async createProduct(productData) {
    const finalProduct = {
      id: productData.id || `p-${Date.now()}`,
      sku: productData.sku || `SKU-${Date.now().toString().slice(-6)}`,
      title: productData.title,
      price: Number(productData.price) || 0,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Math.round((Number(productData.price) || 0) * 1.25),
      merchant: productData.merchant || 'Talieska Studio • تاليسكا ستوديو',
      merchantId: productData.merchantId || 'd0000000-0000-0000-0000-000000000001',
      merchantVerified: true,
      category: productData.category || 'الفساتين',
      description: productData.description || '',
      image: productData.image || (productData.images && productData.images[0]) || '/images/products/linen_abaya.jpg',
      images: productData.images || [productData.image || '/images/products/linen_abaya.jpg'],
      video: productData.video || null,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(productData.stock || productData.quantity || 20),
      sizes: productData.sizes || ['M', 'L'],
      colors: productData.colors || ['Default'],
      colorSwatches: productData.colorSwatches || null,
      sizeGuide: productData.sizeGuide || null,
      isSyndicated: true,
      pointsEarned: Math.floor((Number(productData.price) || 0) * 0.1),
      createdAt: new Date().toISOString()
    };

    // 1. Attempt Supabase backend insertion
    try {
      const dbPayload = {
        title: finalProduct.title,
        slug: finalProduct.sku,
        description: finalProduct.description,
        base_price: finalProduct.price,
        sale_price: finalProduct.originalPrice,
        stock_quantity: finalProduct.stock,
        status: 'active',
        images: finalProduct.images,
        category_id: finalProduct.category,
        merchant_id: 'd0000000-0000-0000-0000-000000000001'
      };

      const { data, error } = await supabase.from('products').insert(dbPayload).select();
      if (!error && data && data.length > 0) {
        finalProduct.id = data[0].id;
      }
    } catch (err) {
      console.warn('Backend DB insert skipped (using synchronized local storage):', err.message);
    }

    // 2. Always persist into localStorage so it is immediately active across all pages
    try {
      const stored = localStorage.getItem('eg_custom_products');
      let customProducts = stored ? JSON.parse(stored) : [];
      customProducts = [finalProduct, ...customProducts.filter(p => p.id !== finalProduct.id)];
      localStorage.setItem('eg_custom_products', JSON.stringify(customProducts));
    } catch (e) {
      console.warn('Could not persist product to local storage:', e);
    }

    return finalProduct;
  },

  async deleteProduct(productId) {
    try {
      await supabase.from('products').delete().eq('id', productId);
    } catch (e) {}

    try {
      const stored = localStorage.getItem('eg_custom_products');
      if (stored) {
        const customProducts = JSON.parse(stored).filter(p => p.id !== productId);
        localStorage.setItem('eg_custom_products', JSON.stringify(customProducts));
      }
    } catch (e) {}
  },

  async getMerchants() {
    try {
      const { data, error } = await supabase.from('merchants').select('*');
      if (error || !data || data.length === 0) {
        return MERCHANTS_DATA;
      }
      return MERCHANTS_DATA; 
    } catch (err) {
      console.warn('Error fetching merchants:', err.message);
      return MERCHANTS_DATA;
    }
  }
};

