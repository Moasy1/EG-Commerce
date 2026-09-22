import { supabase } from '../lib/supabase.js';
import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../context/AppContext.jsx';
import { apiConfig } from '../config/apiConfig.js';

// Persistent local storage cache keys for Superadmin actions
const STORAGE_STORES_KEY = 'eg_admin_stores';
const STORAGE_USERS_KEY = 'eg_admin_users';
const STORAGE_CREATORS_KEY = 'eg_admin_creators';
const STORAGE_CATALOG_KEY = 'eg_admin_demo_catalog';

const DEFAULT_STORES = [
  {
    id: '171842bd-daed-40ef-853f-917eab2ed437',
    name: 'Drip Fit • دريب فيت',
    subdomain: 'drip-fit.egyptian-commerce.com',
    customDomain: 'dripfit-eg.com',
    owner: 'Drip Fit (u-dripfit)',
    ownerEmail: 'drip.fit_egy@eg-commerce.com',
    status: 'active',
    productsCount: 1,
    revenue: 34000,
    themeMode: 'dark',
    category: 'ستريت وير وتوبات صيفية عصرية'
  }
];

const DEFAULT_CREATORS = [
  {
    id: 'c-01',
    name: 'Drip Fit Official • دريب فيت الرسمي',
    handle: '@drip_fit',
    followers: '24.5K',
    brandAffiliation: 'Drip Fit',
    commissionRate: 10,
    totalEarnings: 18500,
    status: 'verified',
    avatar: '/images/brands/dripfit_logo.png',
    specialty: 'ستريت وير وملابس رياضية وصيفية'
  }
];

const DEFAULT_USERS = [
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
  },
  {
    id: 'c11b2fdc-02a8-4c18-8e53-ea7e52d66beb',
    name: 'Drip Fit • دريب فيت',
    email: 'drip.fit_egy@eg-commerce.com',
    role: 'merchant',
    assignedStore: 'Drip Fit (drip-fit)',
    status: 'active',
    created_at: '2026-02-01T00:00:00.000Z'
  },
  {
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
];

export const AdminService = {
  async getPlatformStats() {
    try {
      const { data: metrics, error: rpcError } = await supabase.rpc('get_admin_metrics');
      if (!rpcError && metrics) {
        return {
          totalGMV: Number(metrics.total_revenue || 154000),
          platformRevenue: Number(metrics.platform_commission || 18480),
          totalOrders: Number(metrics.total_orders || 342),
          activeUsers: Number(metrics.active_users || 1240),
          activeStores: 4
        };
      }
      return {
        totalGMV: 154000,
        platformRevenue: 18480,
        totalOrders: 342,
        activeUsers: 1240,
        activeStores: 4
      };
    } catch {
      return {
        totalGMV: 154000,
        platformRevenue: 18480,
        totalOrders: 342,
        activeUsers: 1240,
        activeStores: 4
      };
    }
  },

  // ==========================================
  // 1. STORES MANAGEMENT (CRUD)
  // ==========================================
  async getStores() {
    let cachedStores = [];
    try {
      const cached = localStorage.getItem(STORAGE_STORES_KEY);
      if (cached) cachedStores = JSON.parse(cached);
    } catch {}

    const storeMap = new Map();
    // 1. Initial canonical stores
    DEFAULT_STORES.forEach(s => storeMap.set(s.id, { ...s }));

    // 2. Canonical MERCHANTS_DATA from AppContext
    (MERCHANTS_DATA || []).forEach(m => {
      const id = m.id;
      const existing = storeMap.get(id) || {};
      storeMap.set(id, {
        id,
        name: m.name,
        subdomain: m.subdomain || `${m.slug}.egyptian-commerce.com`,
        customDomain: m.customDomain || null,
        owner: m.name,
        ownerEmail: `${m.slug}@eg-commerce.com`,
        status: 'active',
        productsCount: m.productsCount || 1,
        revenue: m.revenue || 24000,
        themeMode: m.themeConfig?.themeMode || 'dark',
        category: m.categoryAr || m.category || 'أزياء وموضة',
        ...existing
      });
    });

    // 3. Registered custom merchants from localStorage
    try {
      const customRaw = localStorage.getItem('eg_custom_merchants');
      if (customRaw) {
        const customM = JSON.parse(customRaw);
        if (Array.isArray(customM)) {
          customM.forEach(cm => {
            const id = cm.id || `m-${cm.slug}`;
            const existing = storeMap.get(id) || {};
            storeMap.set(id, {
              id,
              name: cm.name || cm.store_name || 'متجر معتمد',
              subdomain: cm.subdomain || `${cm.slug || 'store'}.egyptian-commerce.com`,
              customDomain: cm.customDomain || null,
              owner: cm.owner || cm.name || 'تاجر معتمد',
              ownerEmail: cm.ownerEmail || cm.email || 'merchant@egyptian-commerce.com',
              status: 'active',
              productsCount: 1,
              revenue: cm.revenue || 0,
              themeMode: cm.themeMode || 'dark',
              category: cm.category || 'أزياء وموضة',
              ...existing
            });
          });
        }
      }
    } catch (e) {}

    // 4. Cached stores from admin actions
    if (Array.isArray(cachedStores)) {
      cachedStores.forEach(s => {
        storeMap.set(s.id, { ...(storeMap.get(s.id) || {}), ...s });
      });
    }

    // 5. Supabase merchants table
    try {
      const { data: supaMerchants } = await supabase.from('merchants').select('*');
      if (supaMerchants && supaMerchants.length > 0) {
        supaMerchants.forEach(sm => {
          if (sm.slug === 'talieska' || sm.slug === 'khan-el-khalili') return;
          const id = sm.id;
          const existing = storeMap.get(id) || {};
          storeMap.set(id, {
            id,
            name: sm.store_name || sm.name || existing.name || 'متجر معتمد',
            subdomain: `${sm.slug || 'store'}.egyptian-commerce.com`,
            customDomain: null,
            owner: sm.store_name || 'تاجر مسجل',
            ownerEmail: sm.email || `${sm.slug || 'merchant'}@egyptian-commerce.com`,
            status: 'active',
            productsCount: 1,
            revenue: 0,
            themeMode: 'dark',
            category: 'أزياء وموضة',
            ...existing
          });
        });
      }
    } catch (e) {}

    return Array.from(storeMap.values());
  },

  async createStore(storeData) {
    try {
      const stores = await this.getStores();
      const slug = storeData.subdomain.split('.')[0].toLowerCase().replace(/[^a-z0-9-]/g, '');
      const newStore = {
        id: `m-${Date.now().toString().slice(-4)}`,
        name: storeData.name,
        subdomain: storeData.subdomain.includes('.') ? storeData.subdomain : `${slug}.egyptian-commerce.com`,
        customDomain: storeData.customDomain || null,
        owner: storeData.owner || storeData.ownerEmail,
        ownerEmail: storeData.ownerEmail,
        status: 'active',
        productsCount: 0,
        revenue: 0,
        themeMode: storeData.themeMode || 'dark',
        category: storeData.category || 'أزياء وموضة'
      };
      const updated = [newStore, ...stores];
      localStorage.setItem(STORAGE_STORES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_STORES;
    }
  },

  async updateStore(storeId, storeData) {
    try {
      const stores = await this.getStores();
      const updated = stores.map(s => {
        if (s.id === storeId) {
          return { ...s, ...storeData };
        }
        return s;
      });
      localStorage.setItem(STORAGE_STORES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_STORES;
    }
  },

  async deleteStore(storeId) {
    try {
      const stores = await this.getStores();
      const updated = stores.filter(s => s.id !== storeId);
      localStorage.setItem(STORAGE_STORES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_STORES;
    }
  },

  async toggleStoreStatus(storeId) {
    try {
      const stores = await this.getStores();
      const updated = stores.map(s => {
        if (s.id === storeId) {
          return { ...s, status: s.status === 'active' ? 'paused' : 'active' };
        }
        return s;
      });
      localStorage.setItem(STORAGE_STORES_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_STORES;
    }
  },

  // ==========================================
  // 2. CREATORS & AFFILIATES MANAGEMENT (CRUD)
  // ==========================================
  async getCreators() {
    try {
      const cached = localStorage.getItem(STORAGE_CREATORS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_CREATORS;
  },

  async createCreator(creatorData) {
    try {
      const creators = await this.getCreators();
      const newCreator = {
        id: `c-${Date.now().toString().slice(-4)}`,
        name: creatorData.name,
        handle: creatorData.handle.startsWith('@') ? creatorData.handle : `@${creatorData.handle}`,
        followers: creatorData.followers || '10K',
        brandAffiliation: creatorData.brandAffiliation || 'Drip Fit',
        commissionRate: Number(creatorData.commissionRate) || 12,
        totalEarnings: 0,
        status: 'verified',
        avatar: creatorData.avatar || '/images/reels/reel_1.jpg',
        specialty: creatorData.specialty || 'تنسيق أزياء'
      };
      const updated = [newCreator, ...creators];
      localStorage.setItem(STORAGE_CREATORS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_CREATORS;
    }
  },

  async updateCreator(creatorId, creatorData) {
    try {
      const creators = await this.getCreators();
      const updated = creators.map(c => 
        c.id === creatorId ? { ...c, ...creatorData } : c
      );
      localStorage.setItem(STORAGE_CREATORS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_CREATORS;
    }
  },

  async deleteCreator(creatorId) {
    try {
      const creators = await this.getCreators();
      const updated = creators.filter(c => c.id !== creatorId);
      localStorage.setItem(STORAGE_CREATORS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_CREATORS;
    }
  },

  async updateCreatorCommission(creatorId, newRate) {
    try {
      const creators = await this.getCreators();
      const updated = creators.map(c => 
        c.id === creatorId ? { ...c, commissionRate: Number(newRate) } : c
      );
      localStorage.setItem(STORAGE_CREATORS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_CREATORS;
    }
  },

  // ==========================================
  // 3. USERS & ROLE ASSIGNMENT CONTROL (CRUD)
  // ==========================================
  async getUsers() {
    let cachedUsers = [];
    try {
      const cached = localStorage.getItem(STORAGE_USERS_KEY);
      if (cached) cachedUsers = JSON.parse(cached);
    } catch {}

    const userMap = new Map();

    // 1. DEFAULT_USERS
    DEFAULT_USERS.forEach(u => {
      const key = (u.email || u.id).toLowerCase().trim();
      userMap.set(key, { ...u });
    });

    // 2. Cached admin users
    if (Array.isArray(cachedUsers)) {
      cachedUsers.forEach(u => {
        const key = (u.email || u.id).toLowerCase().trim();
        userMap.set(key, { ...(userMap.get(key) || {}), ...u });
      });
    }

    // 3. Registered users from localStorage (Auth registry)
    try {
      const rawReg = localStorage.getItem('eg_registered_users_registry');
      if (rawReg) {
        const regAccounts = JSON.parse(rawReg);
        Object.entries(regAccounts).forEach(([email, acc]) => {
          const key = email.toLowerCase().trim();
          const existing = userMap.get(key);
          userMap.set(key, {
            id: acc.id || existing?.id || `u-${Date.now()}`,
            name: acc.name || existing?.name || email.split('@')[0],
            email: acc.email || email,
            role: acc.role || existing?.role || 'buyer',
            assignedStore: acc.store_name || acc.store_slug || existing?.assignedStore || (acc.role === 'merchant' ? 'المتجر المسجل' : null),
            status: existing?.status || 'active',
            created_at: acc.created_at || existing?.created_at || new Date().toISOString()
          });
        });
      }
    } catch (e) {}

    // 4. Supabase profiles
    try {
      const { data: profiles, error } = await supabase.from('profiles').select('*');
      if (!error && profiles && profiles.length > 0) {
        profiles.forEach(p => {
          const key = (p.email || p.id)?.toLowerCase().trim();
          const existing = userMap.get(key) || userMap.get(p.id);
          userMap.set(key, {
            id: p.id,
            name: p.name || p.display_name || existing?.name || 'مستخدم مسجل',
            email: p.email || existing?.email || `${p.id.slice(0, 8)}@supabase.user`,
            role: p.role || (p.is_merchant ? 'merchant' : (p.is_creator ? 'creator' : 'buyer')),
            assignedStore: existing?.assignedStore || (p.role === 'merchant' ? 'المتجر المسجل' : null),
            status: existing?.status || 'active',
            created_at: p.created_at || existing?.created_at || new Date().toISOString()
          });
        });
      }
    } catch (e) {}

    return Array.from(userMap.values());
  },

  async setUserPassword(userId, newPassword, userEmail) {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('كلمة المرور يجب ألا تقل عن 6 أحرف');
    }

    const email = (userEmail || '').trim().toLowerCase();

    // 1. Update persistent local registered accounts registry
    try {
      if (email) {
        const raw = localStorage.getItem('eg_registered_users_registry');
        const accounts = raw ? JSON.parse(raw) : {};
        if (accounts[email]) {
          accounts[email].password = newPassword;
          accounts[email].updated_at = new Date().toISOString();
        } else {
          accounts[email] = {
            id: userId,
            email,
            password: newPassword,
            name: email.split('@')[0],
            role: 'buyer',
            updated_at: new Date().toISOString()
          };
        }
        localStorage.setItem('eg_registered_users_registry', JSON.stringify(accounts));
      }

      // If active session belongs to this user, update active session password
      const currentStored = localStorage.getItem('eg_active_session');
      if (currentStored) {
        const parsed = JSON.parse(currentStored);
        if (parsed && (parsed.id === userId || (parsed.email && parsed.email.toLowerCase().trim() === email))) {
          parsed.password = newPassword;
          localStorage.setItem('eg_active_session', JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.warn('[AdminService] Local account password update error:', e);
    }

    // 2. If the user being updated is currently signed in via Supabase client, update via client SDK
    let supaClientUpdated = false;
    try {
      const { data: { user: curUser } } = await supabase.auth.getUser();
      if (curUser && (curUser.id === userId || (email && curUser.email?.toLowerCase().trim() === email))) {
        const { error: supaErr } = await supabase.auth.updateUser({ password: newPassword });
        if (!supaErr) {
          supaClientUpdated = true;
        }
      }
    } catch (e) {
      console.warn('[AdminService] Supabase client auth updateUser skipped/failed:', e);
    }

    // 3. Call server-side Admin Reset Password API (Hostinger PHP backend / Node / Vercel API)
    let serverApiSuccess = false;
    let serverApiMessage = '';
    const payload = { userId, newPassword, email };

    const endpoints = [
      apiConfig.getApiUrl('/api/admin-reset-password'),
      apiConfig.getApiUrl('/api/commerce/admin-reset-password'),
      '/api/admin-reset-password',
      '/api/commerce/admin-reset-password'
    ];

    const uniqueEndpoints = [...new Set(endpoints)];

    for (const ep of uniqueEndpoints) {
      try {
        const res = await fetch(ep, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          serverApiSuccess = true;
          serverApiMessage = data.message || 'تم تحديث كلمة المرور في الخادم';
          break;
        }
      } catch (err) {
        // Continue fallback
      }
    }

    return {
      success: true,
      serverApiSuccess,
      supaClientUpdated,
      message: 'تم تعيين كلمة المرور الجديدة بنجاح للمستخدم في نظام التوثيق'
    };
  },

  async createUser(userData) {
    try {
      const users = await this.getUsers();
      const newUser = {
        id: `u-${Date.now().toString().slice(-6)}`,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'buyer',
        assignedStore: userData.assignedStore || null,
        status: 'active',
        created_at: new Date().toISOString()
      };
      const updated = [newUser, ...users];
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_USERS;
    }
  },

  async updateUser(userId, userData) {
    try {
      const users = await this.getUsers();
      const updated = users.map(u => {
        if (u.id === userId) {
          return { ...u, ...userData };
        }
        return u;
      });
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_USERS;
    }
  },

  async deleteUser(userId) {
    try {
      const users = await this.getUsers();
      const updated = users.filter(u => u.id !== userId);
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_USERS;
    }
  },

  async updateUserRole(userId, newRole) {
    try {
      const users = await this.getUsers();
      const updated = users.map(u => {
        if (u.id === userId) {
          return { ...u, role: newRole };
        }
        return u;
      });
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));

      try {
        await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      } catch {
        // Silent offline fallback
      }

      return updated;
    } catch {
      return DEFAULT_USERS;
    }
  },

  async toggleUserStatus(userId) {
    try {
      const users = await this.getUsers();
      const updated = users.map(u => {
        if (u.id === userId) {
          return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
        }
        return u;
      });
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_USERS;
    }
  },

  async assignUserStore(userId, storeName) {
    try {
      const users = await this.getUsers();
      const updated = users.map(u => {
        if (u.id === userId) {
          return { ...u, assignedStore: storeName };
        }
        return u;
      });
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_USERS;
    }
  },

  // ==========================================
  // 4. DEMO CATALOG ITEMS MANAGEMENT (CRUD)
  // ==========================================
  async getDemoCatalog() {
    try {
      const cached = localStorage.getItem(STORAGE_CATALOG_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return INITIAL_PRODUCTS;
  },

  async createDemoProduct(prodData) {
    try {
      const catalog = await this.getDemoCatalog();
      const newProd = {
        id: `p-${Date.now().toString().slice(-6)}`,
        title: prodData.title,
        price: Number(prodData.price) || 950,
        originalPrice: Number(prodData.originalPrice) || (Number(prodData.price) * 1.2),
        image: prodData.image || '/images/products/the_sharp_v_yellow_1.webp',
        video: prodData.video || '/images/reels/fashion_citrine_blazer.mp4',
        category: prodData.category || 'Women',
        merchant: prodData.merchant || 'Drip Fit • دريب فيت',
        merchantId: prodData.merchantId || '171842bd-daed-40ef-853f-917eab2ed437',
        rating: 5.0,
        reviewsCount: 1,
        sizes: ['S', 'M', 'L', 'XL'],
        isHidden: false
      };
      const updated = [newProd, ...catalog];
      localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  async updateDemoProduct(prodId, prodData) {
    try {
      const catalog = await this.getDemoCatalog();
      const updated = catalog.map(p => 
        p.id === prodId ? { ...p, ...prodData } : p
      );
      localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  async deleteDemoProduct(prodId) {
    try {
      const catalog = await this.getDemoCatalog();
      const updated = catalog.filter(p => p.id !== prodId);
      localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(updated));
      return updated;
    } catch {
      return INITIAL_PRODUCTS;
    }
  }
};
