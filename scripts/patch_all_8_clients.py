import json
import re
import os

# 1. Load the 8 client stores data from sync_first_bulk_patch
from sync_first_bulk_patch import stores_data

print(f"Loaded {len(stores_data)} client stores.")

# Path definitions
app_context_path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\context\AppContext.jsx'
auth_service_path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\AuthService.js'
admin_service_path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\AdminService.js'
sql_migration_path = r'c:\Users\hmanm\Downloads\EG-Commerce\supabase\migrations\0006_real_clients_and_stores.sql'

# ----------------------------------------------------
# 1. Generate JS MERCHANTS_DATA
# ----------------------------------------------------
merchants_js = "export const MERCHANTS_DATA = [\n"
for s in stores_data:
    merchants_js += f"""  {{
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
merchants_js += "];\n"

# ----------------------------------------------------
# 2. Generate JS SOCIAL_PROFILES
# ----------------------------------------------------
profiles_js = "export const SOCIAL_PROFILES = {\n"
for s in stores_data:
    profiles_js += f"""  '{s["slug"]}': {{
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
profiles_js += "};\n"

# ----------------------------------------------------
# 3. Generate JS INITIAL_PRODUCTS
# ----------------------------------------------------
products_js = "export const INITIAL_PRODUCTS = [\n"
for s in stores_data:
    for p in s["products"]:
        images_arr = json.dumps(p.get("images", [p["image"]]), ensure_ascii=False)
        products_js += f"""  {{
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
products_js += "];\n"

# ----------------------------------------------------
# 4. Patch AppContext.jsx
# ----------------------------------------------------
with open(app_context_path, 'r', encoding='utf-8') as f:
    app_ctx = f.read()

# Replace MERCHANTS_DATA
merchants_pattern = r'export const MERCHANTS_DATA = \[[\s\S]*?\n\];'
app_ctx = re.sub(merchants_pattern, merchants_js.strip(), app_ctx, count=1)

# Replace SOCIAL_PROFILES
profiles_pattern = r'export const SOCIAL_PROFILES = \{[\s\S]*?\n\};'
app_ctx = re.sub(profiles_pattern, profiles_js.strip(), app_ctx, count=1)

# Replace INITIAL_PRODUCTS
products_pattern = r'export const INITIAL_PRODUCTS = \[[\s\S]*?\n\];'
app_ctx = re.sub(products_pattern, products_js.strip(), app_ctx, count=1)

with open(app_context_path, 'w', encoding='utf-8') as f:
    f.write(app_ctx)
print("Patched AppContext.jsx with all 8 merchants, social profiles, and products!")

# ----------------------------------------------------
# 5. Patch AuthService.js (DEMO_USERS)
# ----------------------------------------------------
with open(auth_service_path, 'r', encoding='utf-8') as f:
    auth_src = f.read()

demo_merchants_entries = "  // Real Client Merchants\n"
for s in stores_data:
    key_name = s["slug"].replace("-", "_")
    demo_merchants_entries += f"""  merchant_{key_name}: {{
    id: '{s["id"]}',
    email: '{s["email"]}',
    name: '{s["name"]}',
    role: 'merchant',
    avatar_url: '{s["logo"]}',
    merchant_id: '{s["id"]}',
    slug: '{s["slug"]}',
    reward_points_balance: 1500,
    password: '{s["password"]}'
  }},\n"""

# Also alias standard 'merchant' to Drip Fit
demo_merchants_entries += f"""  merchant: {{
    id: '171842bd-daed-40ef-853f-917eab2ed437',
    email: 'dripfit@egyptian-commerce.com',
    name: 'Drip Fit • دريب فيت',
    role: 'merchant',
    avatar_url: '/images/brands/dripfit_logo.png',
    merchant_id: '171842bd-daed-40ef-853f-917eab2ed437',
    slug: 'drip-fit',
    reward_points_balance: 1500,
    password: 'adminpassword'
  }},\n"""

demo_users_pattern = r'export const DEMO_USERS = \{[\s\S]*?  // Merchants[\s\S]*?  // Creators'
new_demo_users_header = "export const DEMO_USERS = {\n" + demo_merchants_entries + "  // Creators"
auth_src = re.sub(demo_users_pattern, new_demo_users_header, auth_src, count=1)

with open(auth_service_path, 'w', encoding='utf-8') as f:
    f.write(auth_src)
print("Patched AuthService.js with all 8 client merchant accounts (password: adminpassword)!")

# ----------------------------------------------------
# 6. Patch AdminService.js (DEFAULT_STORES & DEFAULT_USERS)
# ----------------------------------------------------
with open(admin_service_path, 'r', encoding='utf-8') as f:
    admin_src = f.read()

default_stores_js = "const DEFAULT_STORES = [\n"
for s in stores_data:
    default_stores_js += f"""  {{
    id: '{s["id"]}',
    name: '{s["name"]}',
    subdomain: '{s["subdomain"]}',
    customDomain: null,
    owner: '{s["name"]}',
    ownerEmail: '{s["email"]}',
    status: 'active',
    productsCount: {len(s["products"])},
    revenue: 35000,
    themeMode: 'dark',
    category: '{s["categoryAr"]}'
  }},\n"""
default_stores_js += "];\n"

default_users_js = """const DEFAULT_USERS = [
  {
    id: 'u-superadmin',
    name: 'Super Admin • المشرف العام',
    email: 'superadmin@egyptian-commerce.com',
    role: 'superadmin',
    assignedStore: 'جميع المتاجر (Central)',
    status: 'active',
    created_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'u-admin-1',
    name: 'Compliance Officer • مسؤول المنصة',
    email: 'admin@egyptian-commerce.com',
    role: 'admin',
    assignedStore: 'جميع المتاجر (Central)',
    status: 'active',
    created_at: '2026-01-15T00:00:00.000Z'
  },\n"""

for s in stores_data:
    default_users_js += f"""  {{
    id: '{s["id"]}',
    name: '{s["name"]}',
    email: '{s["email"]}',
    role: 'merchant',
    assignedStore: '{s["name"]} ({s["slug"]})',
    status: 'active',
    created_at: '2026-02-01T00:00:00.000Z'
  }},\n"""

default_users_js += """  {
    id: 'u-creator-yasmin',
    name: 'Yasmin El Sayed • صانعة محتوى',
    email: 'creator@egyptian-commerce.com',
    role: 'creator',
    assignedStore: 'Drip Fit (Affiliate)',
    status: 'active',
    created_at: '2026-02-10T00:00:00.000Z'
  },
  {
    id: 'u-driver-karim',
    name: 'Karim Express • مندوب شحن بوسطة',
    email: 'driver@egyptian-commerce.com',
    role: 'driver',
    assignedStore: 'Bosta Hub المعادي',
    status: 'active',
    created_at: '2026-02-20T00:00:00.000Z'
  },
  {
    id: 'u-buyer-salma',
    name: 'Salma Buyer • عميل مشتري',
    email: 'buyer@egyptian-commerce.com',
    role: 'buyer',
    assignedStore: null,
    status: 'active',
    created_at: '2026-03-01T00:00:00.000Z'
  }
];\n"""

# Replace DEFAULT_STORES
stores_pattern = r'const DEFAULT_STORES = \[[\s\S]*?\n\];'
admin_src = re.sub(stores_pattern, default_stores_js.strip(), admin_src, count=1)

# Replace DEFAULT_USERS
users_pattern = r'const DEFAULT_USERS = \[[\s\S]*?\n\];'
admin_src = re.sub(users_pattern, default_users_js.strip(), admin_src, count=1)

with open(admin_service_path, 'w', encoding='utf-8') as f:
    f.write(admin_src)
print("Patched AdminService.js with all 8 client stores and merchant users!")

# ----------------------------------------------------
# 7. Generate Supabase SQL Migration
# ----------------------------------------------------
sql_content = """-- =========================================================================
-- Phase 6: Real Clients & Verified Stores Bulk Patch
-- Inserts all 8 official stores, merchant profiles, products, and reels
-- =========================================================================

-- 1. Insert Merchant Profiles into profiles
"""

for s in stores_data:
    clean_name = s['name'].replace("'", "''")
    clean_bio = s['bio'].replace("'", "''")
    sql_content += f"""INSERT INTO public.profiles (id, name, display_name, email, role, is_merchant, avatar_url, bio, reward_points_balance)
VALUES ('{s["id"]}', '{clean_name}', '{clean_name}', '{s["email"]}', 'merchant', true, '{s["logo"]}', '{clean_bio}', 1500)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  display_name = EXCLUDED.display_name,
  email = EXCLUDED.email,
  role = 'merchant',
  is_merchant = true,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio;
\n"""

sql_content += "\n-- 2. Insert Stores into merchants\n"
for s in stores_data:
    clean_name = s['name'].replace("'", "''")
    clean_bio = s['bio'].replace("'", "''")
    clean_cat = s['categoryAr'].replace("'", "''")
    sql_content += f"""INSERT INTO public.merchants (id, user_id, store_name, slug, email, logo_url, banner_url, category, bio, is_verified)
VALUES ('{s["id"]}', '{s["id"]}', '{clean_name}', '{s["slug"]}', '{s["email"]}', '{s["logo"]}', '{s["banner"]}', '{clean_cat}', '{clean_bio}', true)
ON CONFLICT (id) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  slug = EXCLUDED.slug,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  category = EXCLUDED.category,
  bio = EXCLUDED.bio,
  is_verified = true;
\n"""

sql_content += "\n-- 3. Insert Products into products\n"
for s in stores_data:
    for p in s["products"]:
        clean_title = p['title'].replace("'", "''")
        clean_desc = p['description'].replace("'", "''")
        clean_cat = p['category'].replace("'", "''")
        images_json = json.dumps(p.get("images", [p["image"]]), ensure_ascii=False).replace("'", "''")
        sql_content += f"""INSERT INTO public.products (id, merchant_id, title, description, price, original_price, stock, image_url, category, is_syndicated)
VALUES ('{p["id"]}', '{s["id"]}', '{clean_title}', '{clean_desc}', {p["price"]}, {p["originalPrice"]}, {p.get("stock", 50)}, '{p["image"]}', '{clean_cat}', true)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_syndicated = true;
\n"""

sql_content += "\n-- 4. Insert Reels into reels\n"
for s in stores_data:
    r = s["reel"]
    clean_name = s['name'].replace("'", "''")
    clean_cap = r['caption'].replace("'", "''")
    sql_content += f"""INSERT INTO public.reels (id, creator_id, video_url, thumbnail_url, caption, likes_count, comments_count, shares_count)
VALUES ('{r["id"]}', '{s["id"]}', '{r["video"]}', '{s["banner"]}', '{clean_cap}', 1850, 24, 110)
ON CONFLICT (id) DO UPDATE SET
  video_url = EXCLUDED.video_url,
  thumbnail_url = EXCLUDED.thumbnail_url,
  caption = EXCLUDED.caption;
\n"""

with open(sql_migration_path, 'w', encoding='utf-8') as f:
    f.write(sql_content)

print(f"Wrote complete SQL migration to {sql_migration_path}!")
print("\nAll 8 real client stores, accounts, products, and reels successfully synchronized!")
