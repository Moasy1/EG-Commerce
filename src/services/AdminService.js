import { supabase } from '../lib/supabase';
import { INITIAL_PRODUCTS } from '../context/AppContext';

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
    try {
      const cached = localStorage.getItem(STORAGE_STORES_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_STORES;
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
    try {
      const cached = localStorage.getItem(STORAGE_USERS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_USERS;
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
