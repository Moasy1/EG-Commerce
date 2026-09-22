import json
import re
import os

from sync_first_bulk_patch import stores_data

stores_data_file = r'c:\Users\hmanm\Downloads\EG-Commerce\src\data\storesData.js'
app_context_file = r'c:\Users\hmanm\Downloads\EG-Commerce\src\context\AppContext.jsx'
product_service_file = r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\ProductService.js'
admin_service_file = r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\AdminService.js'

# 1. Build storesData.js
content = """/**
 * Canonical Data for Real Client Stores, Profiles & Catalog Products
 * Egyptian Commerce Multi-Tenant Ecosystem
 */

export const MERCHANTS_DATA = [
"""

for s in stores_data:
    content += f"""  {{
    id: '{s["id"]}',
    name: '{s["name"]}',
    shortName: '{s["shortName"]}',
    slug: '{s["slug"]}',
    subdomain: '{s["subdomain"]}',
    customDomain: null,
    customDomainStatus: 'Active (SSL)',
    category: '{s["category"]}',
    categoryAr: '{s["categoryAr"]}',
    bio: '{s["bio"]}',
    established: '2026',
    rating: 5.0,
    reviewsCount: 24,
    verified: true,
    logo: '{s["logo"]}',
    banner: '{s["banner"]}',
    announcement: '🔥 تشكيلة جديدة حصرية متاحة الآن مع شحن سريع لجميع المحافظات',
    promoCode: '{s["slug"].upper()[:4]}10',
    discountPct: 10,
    themeColor: '{s["themeColor"]}',
    whatsapp: '+201012345678',
    instagram: '@{s["slug"]}',
    bostaAccount: 'BST-EG-{s["slug"][:4].upper()}',
    instapayHandle: '{s["slug"]}@instapay',
    themeConfig: {{
      themeMode: 'dark',
      accentColor: '{s["themeColor"]}',
      fontFamily: 'sans',
      borderRadius: 'rounded-2xl',
      heroStyle: 'wide_cinema',
      heroHeadline: '{s["name"]} • تشكيلة حصرية فاخرة',
      heroSubheadline: '{s["bio"]}',
      heroCtaText: 'تسوق التشكيلة الآن',
      productsGridCols: 3,
      showRatings: true,
      showStockBadges: true,
    }},
    layoutConfig: {{
      showAnnouncementBar: true,
      showHeroBanner: true,
      showTrustBadges: true,
      showProductsCatalog: true,
      showCommunityReels: true,
      showSocialMediaFeed: true,
      showTestimonials: true,
      showContactSection: true,
      showWhatsAppFloat: true,
      showAboutUsTab: true,
      trustBadges: [
        {{ id: 'b1', icon: 'local_shipping', title: 'شحن سريع لجميع المحافظات', desc: 'توصيل لباب بيتك خلال 24-48 ساعة عبر بوسطة' }},
        {{ id: 'b2', icon: 'verified', title: 'منتجات أصلية 100%', desc: 'ضمان الجودة العالية والخامات الفاخرة' }},
        {{ id: 'b3', icon: 'assignment_return', title: 'معاينة عند الاستلام', desc: 'حق الاستبدال والمعاينة قبل الدفع' }},
        {{ id: 'b4', icon: 'support_agent', title: 'خدمة عملاء فورية', desc: 'دعم سريع ومباشر' }}
      ]
    }},
    stats: {{
      grossSales: 38000,
      growthPct: 24.5,
      totalOrders: 48,
      ordersPending: 2,
      ordersShipping: 5,
      reelsAttributedSales: 21500,
      reelsAttributedPct: 56,
      aov: 790,
      visitors: 1950,
      conversionRate: 3.5,
    }}
  }},\n"""

content += """];

export const SOCIAL_PROFILES = {
"""

for s in stores_data:
    content += f"""  '{s["slug"]}': {{
    id: '{s["id"]}',
    handle: '@{s["slug"]}',
    slug: '{s["slug"]}',
    name: '{s["name"]}',
    verified: true,
    role: 'merchant',
    merchantId: '{s["id"]}',
    avatar: '{s["logo"]}',
    banner: '{s["banner"]}',
    category: '{s["category"]}',
    categoryAr: '{s["categoryAr"]}',
    bio: '{s["bio"]}',
    location: 'القاهرة، مصر • Cairo, Egypt',
    website: '{s["subdomain"]}',
    followersCount: '28.4K',
    followingCount: '34',
    productsCount: {len(s["products"])},
    reelsCount: 1
  }},\n"""

content += """};

export const INITIAL_PRODUCTS = [
"""

for s in stores_data:
    for p in s["products"]:
        images_arr = json.dumps(p.get("images", [p["image"]]), ensure_ascii=False)
        content += f"""  {{
    id: '{p["id"]}',
    sku: '{p["sku"]}',
    title: '{p["title"]}',
    merchant: '{s["name"]}',
    merchantId: '{s["id"]}',
    merchantSlug: '{s["slug"]}',
    merchantVerified: true,
    price: {p["price"]},
    originalPrice: {p["originalPrice"]},
    rating: 5.0,
    reviewsCount: 22,
    stock: {p.get("stock", 50)},
    isSyndicated: true,
    image: '{p["image"]}',
    images: {images_arr},
    video: '{p.get("video", s["reel"]["video"])}',
    sizeGuide: '{p["image"]}',
    pointsEarned: {int(p["price"] * 0.1)},
    category: '{p["category"]}',
    description: '{p["description"]}',
    sizes: ['Free Size • مقاس موحد', 'M', 'L', 'XL'],
    colors: ['Original • كما بالصورة']
  }},\n"""

content += "];\n"

with open(stores_data_file, 'w', encoding='utf-8') as f:
    f.write(content)
print("Created src/data/storesData.js!")

# 2. Update AppContext.jsx to import and re-export them
with open(app_context_file, 'r', encoding='utf-8') as f:
    ctx = f.read()

# Replace export const MERCHANTS_DATA = [...] with re-export
ctx = re.sub(
    r'export const MERCHANTS_DATA = \[[\s\S]*?\n\];\s*export const SOCIAL_PROFILES = \{[\s\S]*?\n\};',
    "export { MERCHANTS_DATA, SOCIAL_PROFILES } from '../data/storesData.js';",
    ctx,
    count=1
)

ctx = re.sub(
    r'export const INITIAL_PRODUCTS = \[[\s\S]*?\n\];',
    "export { INITIAL_PRODUCTS } from '../data/storesData.js';",
    ctx,
    count=1
)

# Also ensure AppContext has the imports if needed locally
if "import { MERCHANTS_DATA, SOCIAL_PROFILES, INITIAL_PRODUCTS } from '../data/storesData.js';" not in ctx:
    ctx = ctx.replace(
        "const AppContext = createContext();",
        "import { MERCHANTS_DATA, SOCIAL_PROFILES, INITIAL_PRODUCTS } from '../data/storesData.js';\n\nconst AppContext = createContext();"
    )

with open(app_context_file, 'w', encoding='utf-8') as f:
    f.write(ctx)
print("Updated AppContext.jsx to re-export from storesData.js!")

# 3. Update ProductService.js
with open(product_service_file, 'r', encoding='utf-8') as f:
    ps = f.read()

ps = ps.replace(
    "import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../context/AppContext.jsx';",
    "import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../data/storesData.js';"
)
ps = ps.replace(
    "import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../context/AppContext';",
    "import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../data/storesData.js';"
)

with open(product_service_file, 'w', encoding='utf-8') as f:
    f.write(ps)
print("Updated ProductService.js imports!")

# 4. Update AdminService.js
with open(admin_service_file, 'r', encoding='utf-8') as f:
    ads = f.read()

ads = ads.replace(
    "import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../context/AppContext.jsx';",
    "import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../data/storesData.js';"
)
ads = ads.replace(
    "import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../context/AppContext';",
    "import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../data/storesData.js';"
)

with open(admin_service_file, 'w', encoding='utf-8') as f:
    f.write(ads)
print("Updated AdminService.js imports!")
