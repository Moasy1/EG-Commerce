import re

# 1. Patch ProductService.js
ps_path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\ProductService.js'
with open(ps_path, 'r', encoding='utf-8') as f:
    ps_content = f.read()

# Fix legacy demo merchants list
old_legacy = "const legacyDemoMerchants = ['d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', '171842bd-daed-40ef-853f-917eab2ed437', '171842bd-daed-40ef-853f-917eab2ed437', '171842bd-daed-40ef-853f-917eab2ed437'];"
new_legacy = "const legacyDemoMerchants = ['d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002'];"

if old_legacy in ps_content:
    ps_content = ps_content.replace(old_legacy, new_legacy)
    print("Fixed legacyDemoMerchants in ProductService.js")

# Fix linen abaya in createProduct
old_create_imgs = """      image: productData.image || (productData.images && productData.images[0]) || '/images/products/linen_abaya.jpg',
      images: productData.images || (productData.image ? [productData.image] : ['/images/products/linen_abaya.jpg']),"""
new_create_imgs = """      image: productData.image || (productData.images && productData.images[0]) || null,
      images: productData.images || (productData.image ? [productData.image] : []),"""

if old_create_imgs in ps_content:
    ps_content = ps_content.replace(old_create_imgs, new_create_imgs)
    print("Fixed createProduct images in ProductService.js")

# Fix getMerchants to filter out talieska & khan-el-khalili
old_dbm_loop = """        data.forEach(dbm => {
          const id = dbm.id;
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
        });"""

new_dbm_loop = """        data.forEach(dbm => {
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
        });"""

if old_dbm_loop in ps_content:
    ps_content = ps_content.replace(old_dbm_loop, new_dbm_loop)
    print("Fixed getMerchants filtering in ProductService.js")

# Enhance updateMerchant to sync customization
old_upd_merchant = """  async updateMerchant(merchantId, updates) {
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

    // 2. Persist to custom merchants registry in localStorage
    try {
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
        if (Object.keys(profUpdates).length > 0) {
          await supabase.from('profiles').update(profUpdates).eq('id', updates.user_id);
        }
      } catch (e) {}
    }

    return updates;
  },"""

new_upd_merchant = """  async updateMerchant(merchantId, updates) {
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
  },"""

if old_upd_merchant in ps_content:
    ps_content = ps_content.replace(old_upd_merchant, new_upd_merchant)
    print("Enhanced updateMerchant in ProductService.js")

with open(ps_path, 'w', encoding='utf-8') as f:
    f.write(ps_content)

# 2. Patch ReelsService.js
rs_path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\ReelsService.js'
with open(rs_path, 'r', encoding='utf-8') as f:
    rs_content = f.read()

rs_content = rs_content.replace("videoBg: reelData.videoBg || reelData.video || '/images/reels/linen_abaya.mp4',",
                                "videoBg: reelData.videoBg || reelData.video || reelData.image || (formattedProducts[0]?.image) || '',")

with open(rs_path, 'w', encoding='utf-8') as f:
    f.write(rs_content)
print("ReelsService.js patched")
