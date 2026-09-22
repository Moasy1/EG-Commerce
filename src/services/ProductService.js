import { supabase } from '../lib/supabase.js';
import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../data/storesData.js';
import { apiConfig } from '../config/apiConfig.js';

export const CATEGORIES_DATA = [
  {
    id: 'women',
    slug: 'women',
    label: 'Women',
    labelAr: 'أزياء نسائية',
    description: 'Contemporary Egyptian linen, elegant dresses, tailored blazers and seasonal collections.',
    descriptionAr: 'أحدث صيحات الموضة النسائية، فساتين أنيقة، وتصاميم كتان مصري راقية.',
    image: '/images/reels/fashion_citrine_blazer_thumb.jpg',
    banner: '/images/products/the_sharp_v_yellow_1.webp',
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
    image: '/images/products/the_sharp_v_yellow_1.webp',
    banner: '/images/products/the_sharp_v_yellow_1.webp',
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
    banner: '/images/products/the_sharp_v_yellow_1.webp',
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

  async getProducts(categorySlug = null, merchantId = null) {
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

    // Filter custom products by merchant when scoped
    if (merchantId) {
      customProducts = customProducts.filter(
        p => p.merchantId === merchantId || p.merchant_id === merchantId
      );
    }

    // Fetch custom products from shared server backend (cross-device sync)
    try {
      const serverUrl = apiConfig.getApiUrl(merchantId ? `/api/products?merchantId=${encodeURIComponent(merchantId)}` : '/api/products');
      const sRes = await fetch(serverUrl);
      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData)) {
          const sFiltered = merchantId 
            ? sData.filter(p => p.merchantId === merchantId || p.merchant_id === merchantId)
            : sData;
          // Merge server products with local storage products
          const existingIds = new Set(customProducts.map(p => p.id));
          sFiltered.forEach(sp => {
            if (!existingIds.has(sp.id)) {
              customProducts.push(sp);
              existingIds.add(sp.id);
            }
          });
        }
      }
    } catch (sErr) {
      console.warn('[ProductService] Server products sync notice:', sErr.message);
    }

    try {
      let query = supabase.from('products').select('*');
      // Scope Supabase query to merchant when requested
      if (merchantId) {
        query = query.eq('merchant_id', merchantId);
      }

      const { data, error } = await query;
      if (error || !data) {
        if (merchantId) {
          // Strict merchant scoping: Return ONLY this merchant's custom products, NO fake fallback
          allProducts = customProducts;
        } else {
          allProducts = [...customProducts, ...INITIAL_PRODUCTS];
        }
      } else {
        // Fetch all merchants once to resolve names for products
        let merchantsMap = {};
        try {
          const { data: merchantsData } = await supabase.from('merchants').select('id, store_name, slug, is_verified');
          if (merchantsData) {
            merchantsData.forEach(m => { merchantsMap[m.id] = m; });
          }
        } catch (e) {}
        // Also add MERCHANTS_DATA entries to the map
        MERCHANTS_DATA.forEach(m => {
          if (!merchantsMap[m.id]) {
            merchantsMap[m.id] = { id: m.id, store_name: m.shortName || m.name, slug: m.slug, is_verified: true };
          }
        });

        // Map DB products to frontend format using real merchant info
        const legacyDemoMerchants = ['d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002'];
        const dbMapped = data
          .filter(dbProduct => !legacyDemoMerchants.includes(dbProduct.merchant_id))
          .map(dbProduct => {
          const resolvedMerchant = merchantsMap[dbProduct.merchant_id] || null;
          const merchantName = resolvedMerchant?.store_name || 'متجر معتمد';
          const merchantSlug = resolvedMerchant?.slug || 'store';
          const isVerified = resolvedMerchant?.is_verified ?? true;

          return {
            id: dbProduct.id,
            sku: dbProduct.slug || `EG-${dbProduct.id.slice(0, 8)}`,
            title: dbProduct.title,
            merchant: merchantName,
            merchantId: dbProduct.merchant_id,
            merchantSlug: merchantSlug,
            merchantVerified: isVerified,
            price: Number(dbProduct.base_price) || 0,
            originalPrice: dbProduct.sale_price ? Number(dbProduct.base_price) : undefined,
            rating: 5.0,
            reviewsCount: 1,
            stock: dbProduct.stock_quantity ?? 10,
            isSyndicated: true,
            image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : null,
            images: dbProduct.images || [],
            video: null,
            pointsEarned: Math.floor((Number(dbProduct.base_price) || 0) * 0.1),
            category: dbProduct.category_id || 'Streetwear & Casual',
            description: dbProduct.description || '',
            sizes: Array.isArray(dbProduct.sizes) ? dbProduct.sizes : [],
            colors: Array.isArray(dbProduct.colors) ? dbProduct.colors : []
          };
        });

        if (merchantId) {
          // Scoped strictly to merchant: combine custom for this merchant + dbMapped
          const existingIds = new Set(customProducts.map(p => p.id));
          allProducts = [...customProducts, ...dbMapped.filter(p => !existingIds.has(p.id))];
        } else {
          const existingIds = new Set([...customProducts.map(p => p.id), ...dbMapped.map(p => p.id)]);
          const seedRemaining = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
          allProducts = [...customProducts, ...dbMapped, ...seedRemaining];
        }
      }
    } catch (err) {
      console.warn('Error fetching products from backend:', err.message);
      allProducts = merchantId ? customProducts : [...customProducts, ...INITIAL_PRODUCTS];
    }

    // Filter out any legacy stores across all products
    const legacyDemoMerchants = ['d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002'];
    allProducts = allProducts.filter(p => {
      const mid = p.merchantId || p.merchant_id;
      return !legacyDemoMerchants.includes(mid);
    });

    // Normalize products so any Drip Fit product is attributed to Drip Fit
    allProducts = allProducts.map(p => {
      const isDripFit = p.title?.toLowerCase().includes('drip fit') || 
                        p.description?.toLowerCase().includes('drip fit') ||
                        p.merchant?.toLowerCase().includes('drip fit') ||
                        p.merchantSlug?.toLowerCase() === 'drip-fit' ||
                        p.merchantId === '171842bd-daed-40ef-853f-917eab2ed437';
      if (isDripFit) {
        return {
          ...p,
          merchant: 'Drip Fit • دريب فيت',
          merchantId: '171842bd-daed-40ef-853f-917eab2ed437',
          merchantSlug: 'drip-fit'
        };
      }
      return p;
    });

    if (categorySlug && categorySlug !== 'all') {
      return this.filterProductsByCategory(allProducts, categorySlug);
    }

    return allProducts;
  },

  async createProduct(productData) {
    const fallbackSlug = productData.merchant ? productData.merchant.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : 'store';
    const finalProduct = {
      id: productData.id || `p-${Date.now()}`,
      sku: productData.sku || `SKU-${Date.now().toString().slice(-6)}`,
      title: productData.title,
      price: Number(productData.price) || 0,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Math.round((Number(productData.price) || 0) * 1.25),
      merchant: productData.merchant || 'متجر مصري معتمد',
      merchantId: productData.merchantId || `m-${fallbackSlug}`,
      merchantSlug: productData.merchantSlug || fallbackSlug,
      merchantVerified: true,
      category: productData.category || 'الفساتين',
      description: productData.description || '',
      image: productData.image || (productData.images && productData.images[0]) || null,
      images: productData.images || (productData.image ? [productData.image] : []),
      video: productData.video || null,
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(productData.stock || productData.quantity || 20),
      sizes: Array.isArray(productData.sizes) ? productData.sizes : [],
      colors: Array.isArray(productData.colors) ? productData.colors : [],
      colorSwatches: productData.colorSwatches || null,
      sizeGuide: productData.sizeGuide || null,
      isSyndicated: true,
      pointsEarned: Math.floor((Number(productData.price) || 0) * 0.1),
      createdAt: new Date().toISOString()
    };

    // 1. Attempt Supabase backend insertion
    try {
      const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
      const dbPayload = {
        title: finalProduct.title,
        slug: finalProduct.sku,
        description: finalProduct.description,
        base_price: finalProduct.price,
        sale_price: finalProduct.originalPrice,
        stock_quantity: finalProduct.stock,
        status: 'active',
        images: finalProduct.images,
        category_id: finalProduct.category
      };
      if (isUuid(finalProduct.merchantId)) {
        dbPayload.merchant_id = finalProduct.merchantId;
      }

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

    // 3. Persist product to shared server backend for cross-device sync
    try {
      await fetch(apiConfig.getApiUrl('/api/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProduct)
      });
      console.log('[ProductService] Product synced to shared server backend:', finalProduct.title);
    } catch (serverErr) {
      console.warn('[ProductService] Server product sync notice:', serverErr.message);
    }

    return finalProduct;
  },

  async updateProduct(productId, updates) {
    if (!productId) return null;
    const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    if (isUuid(productId)) {
      try {
        const supaPayload = {};
        if (updates.title) supaPayload.title = updates.title;
        if (updates.price) supaPayload.base_price = updates.price;
        if (updates.description) supaPayload.description = updates.description;
        if (updates.stock !== undefined) supaPayload.stock_quantity = updates.stock;
        if (updates.images) supaPayload.images = updates.images;
        if (Object.keys(supaPayload).length > 0) {
          supaPayload.updated_at = new Date().toISOString();
          await supabase.from('products').update(supaPayload).eq('id', productId);
        }
      } catch (err) {
        console.warn('Supabase updateProduct error:', err.message);
      }
    }

    try {
      const stored = localStorage.getItem('eg_custom_products');
      if (stored) {
        let customProducts = JSON.parse(stored);
        customProducts = customProducts.map(p => p.id === productId ? { ...p, ...updates } : p);
        localStorage.setItem('eg_custom_products', JSON.stringify(customProducts));
      }
    } catch (e) {}

    return updates;
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

  async updateMerchant(merchantId, updates) {
    if (!merchantId) return null;
    const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    // 1. If merchantId is a UUID in Supabase, update the merchants record
    if (isUuid(merchantId)) {
      try {
        const supaUpdates = {};
        if (updates.name) supaUpdates.store_name = updates.name.split('•')[0].trim();
        if (updates.slug) supaUpdates.slug = updates.slug;
        if (Object.keys(supaUpdates).length > 0) {
          supaUpdates.updated_at = new Date().toISOString();
          await supabase.from('merchants').update(supaUpdates).eq('id', merchantId);
        }
      } catch (err) {
        console.warn('Supabase merchant update error:', err.message);
      }
    }

    // 2. Persist to merchant customization in localStorage
    try {
      localStorage.setItem(`eg_merchant_settings_${merchantId}`, JSON.stringify(updates));
      if (updates.slug) {
        localStorage.setItem(`eg_merchant_settings_${updates.slug}`, JSON.stringify(updates));
      }
      const raw = localStorage.getItem('eg_custom_merchants');
      let custom = raw ? JSON.parse(raw) : [];
      const idx = custom.findIndex(m => m.id === merchantId || m.slug === updates.slug);
      if (idx >= 0) {
        custom[idx] = { ...custom[idx], ...updates, updatedAt: new Date().toISOString() };
      } else {
        custom.push({ id: merchantId, ...updates, updatedAt: new Date().toISOString() });
      }
      localStorage.setItem('eg_custom_merchants', JSON.stringify(custom));
    } catch (e) {
      console.warn('Could not save to eg_custom_merchants:', e);
    }

    // 3. Also update profile in Supabase if user_id is known
    if (updates.user_id && isUuid(updates.user_id)) {
      try {
        const profUpdates = {};
        if (updates.name) profUpdates.name = updates.name.split('•')[0].trim();
        if (updates.logo) profUpdates.avatar_url = updates.logo;
        if (updates.bio) profUpdates.bio = updates.bio;
        if (Object.keys(profUpdates).length > 0) {
          await supabase.from('profiles').update(profUpdates).eq('id', updates.user_id);
        }
      } catch (e) {}
    }

    // 4. Notify all listening components
    try {
      window.dispatchEvent(new CustomEvent('eg_merchant_updated', { detail: { merchantId, updates } }));
    } catch (e) {}

    return updates;
  },

  async getMerchants() {
    let custom = [];
    try {
      const stored = localStorage.getItem('eg_custom_merchants');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) custom = parsed;
      }
    } catch (e) {}

    // Fetch shared merchants from server backend (cross-device sync)
    try {
      const mRes = await fetch(apiConfig.getApiUrl('/api/merchants'));
      if (mRes.ok) {
        const serverMerchants = await mRes.json();
        if (Array.isArray(serverMerchants)) {
          serverMerchants.forEach(sm => {
            if (!custom.some(c => c.id === sm.id || c.slug === sm.slug)) {
              custom.push(sm);
            }
          });
        }
      }
    } catch (mErr) {
      console.warn('[ProductService] Server merchants fetch notice:', mErr.message);
    }

    // Also fetch registered users from server backend to check for merchant accounts
    try {
      const uRes = await fetch(apiConfig.getApiUrl('/api/users'));
      if (uRes.ok) {
        const serverUsers = await uRes.json();
        if (serverUsers && typeof serverUsers === 'object') {
          Object.values(serverUsers).forEach(acc => {
            if (acc.role === 'merchant') {
              const id = acc.merchant_id || acc.id;
              const slug = acc.store_slug || acc.slug || acc.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'store';
              if (!custom.some(c => c.id === id || c.slug === slug)) {
                custom.push({
                  id,
                  user_id: acc.id,
                  name: acc.store_name || `${acc.name} Store • متجر ${acc.name}`,
                  shortName: acc.store_name || acc.name,
                  slug,
                  handle: `@${slug}`,
                  subdomain: `${slug}.egyptian-commerce.com`,
                  logo: acc.avatar_url || '/images/brands/dripfit_logo.png',
                  banner: '/images/products/the_sharp_v_yellow_1.webp',
                  verified: true
                });
              }
            }
          });
        }
      }
    } catch (uErr) {
      console.warn('[ProductService] Server users fetch notice:', uErr.message);
    }

    // Build map starting from full canonical MERCHANTS_DATA
    const merchantMap = new Map();
    MERCHANTS_DATA.forEach(m => merchantMap.set(m.id, { ...m }));

    // Overlay any custom registered merchants
    custom.forEach(cm => {
      const id = cm.id;
      const existing = merchantMap.get(id) || {};
      merchantMap.set(id, {
        ...MERCHANTS_DATA[0],
        ...existing,
        ...cm,
        id,
        name: cm.name || cm.store_name || existing.name || 'متجر معتمد',
        shortName: cm.shortName || cm.name || 'متجر',
        slug: cm.slug || 'store',
        subdomain: cm.subdomain || `${cm.slug || 'store'}.egyptian-commerce.com`,
        logo: cm.logo || existing.logo || '/images/brands/dripfit_logo.png',
        banner: cm.banner || existing.banner || '/images/products/the_sharp_v_yellow_1.webp'
      });
    });

    // Merge Supabase records if online
    try {
      const { data, error } = await supabase.from('merchants').select('*');
      if (!error && data && data.length > 0) {
        data.forEach(dbm => {
          const id = dbm.id;
          // Filter out deleted mock merchants
          if (id === 'd0000000-0000-0000-0000-000000000001' || id === 'd0000000-0000-0000-0000-000000000002') return;
          if (dbm.slug === 'talieska' || dbm.slug === 'khan-el-khalili') return;

          const existing = merchantMap.get(id) || {};
          merchantMap.set(id, {
            ...MERCHANTS_DATA[0],
            ...existing,
            id,
            user_id: dbm.user_id,
            name: dbm.store_name || dbm.name || existing.name || 'متجر معتمد',
            shortName: dbm.store_name || dbm.name || existing.shortName || 'متجر',
            slug: dbm.slug || existing.slug || 'store',
            subdomain: `${dbm.slug || 'store'}.egyptian-commerce.com`,
            is_verified: dbm.is_verified ?? true
          });
        });
      }
    } catch (err) {
      console.warn('Error fetching merchants from Supabase:', err.message);
    }

    // Also check eg_registered_users_registry for merchant accounts
    try {
      const rawReg = localStorage.getItem('eg_registered_users_registry');
      if (rawReg) {
        const regObj = JSON.parse(rawReg);
        Object.values(regObj).forEach(acc => {
          if (acc.role === 'merchant') {
            const id = acc.merchant_id || acc.id;
            if (!merchantMap.has(id)) {
              const slug = acc.name?.toLowerCase().replace(/\s+/g, '-') || 'store';
              merchantMap.set(id, {
                ...MERCHANTS_DATA[0],
                id,
                user_id: acc.id,
                name: `${acc.name} Store • متجر ${acc.name}`,
                shortName: acc.name,
                slug,
                handle: `@${slug}`,
                subdomain: `${slug}.egyptian-commerce.com`,
                logo: acc.avatar_url || '/images/brands/dripfit_logo.png',
                banner: '/images/products/the_sharp_v_yellow_1.webp',
                is_verified: true
              });
            }
          }
        });
      }
    } catch (e) {}

    return Array.from(merchantMap.values());
  }
};

