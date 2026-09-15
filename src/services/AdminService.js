import { supabase } from '../lib/supabase';

// Persistent local storage cache keys for Superadmin actions
const STORAGE_STORES_KEY = 'eg_admin_stores';
const STORAGE_USERS_KEY = 'eg_admin_users';
const STORAGE_CREATORS_KEY = 'eg_admin_creators';

const DEFAULT_STORES = [
  {
    id: 'm-01',
    name: 'Talieska Studio • تاليسكا ستوديو',
    subdomain: 'talieska.egyptian-commerce.com',
    customDomain: 'shop.talieskastudio.com',
    owner: 'Talieska Atelier (u-talieska)',
    ownerEmail: 'merchant@egyptian-commerce.com',
    status: 'active',
    productsCount: 14,
    revenue: 94800,
    themeMode: 'dark',
    category: 'أزياء وكتان فاخر'
  },
  {
    id: 'm-02',
    name: 'Sheglam Egypt • شيجلام مصر',
    subdomain: 'sheglam.egyptian-commerce.com',
    customDomain: null,
    owner: 'Sheglam Middle East Hub',
    ownerEmail: 'sheglam@egyptian-commerce.com',
    status: 'active',
    productsCount: 8,
    revenue: 42300,
    themeMode: 'light',
    category: 'مستحضرات تجميل وعناية'
  },
  {
    id: 'm-03',
    name: 'Cairo Leather Craft • جلود القاهرة',
    subdomain: 'cairo-leather.egyptian-commerce.com',
    customDomain: 'cairoleather.eg',
    owner: 'Ahmed El-Gazzar',
    ownerEmail: 'leather@egyptian-commerce.com',
    status: 'active',
    productsCount: 6,
    revenue: 16900,
    themeMode: 'dark',
    category: 'صناعات جلدية يدوية'
  },
  {
    id: 'm-04',
    name: 'Demo Atelier • متجر تجريبي',
    subdomain: 'demo.egyptian-commerce.com',
    customDomain: null,
    owner: 'Demo Merchant',
    ownerEmail: 'demo@egyptian-commerce.com',
    status: 'active',
    productsCount: 4,
    revenue: 0,
    themeMode: 'dark',
    category: 'متجر اختباري'
  }
];

const DEFAULT_CREATORS = [
  {
    id: 'c-01',
    name: 'Yasmin El Sayed • ياسمين السيد',
    handle: '@yasmin_fashion',
    followers: '128K',
    brandAffiliation: 'Talieska Studio',
    commissionRate: 12,
    totalEarnings: 48200,
    status: 'verified',
    avatar: '/images/reels/reel_1.jpg',
    specialty: 'تنسيق الأزياء الصيفية والكتان'
  },
  {
    id: 'c-02',
    name: 'Salma El-Ahmady • سلمى الأحمدي',
    handle: '@salma_style_eg',
    followers: '94K',
    brandAffiliation: 'Sheglam Egypt',
    commissionRate: 10,
    totalEarnings: 31400,
    status: 'verified',
    avatar: '/images/reels/reel_2.jpg',
    specialty: 'ريفيوهات الميك اب والجمال'
  },
  {
    id: 'c-03',
    name: 'Layla Chic • ليلى شيك',
    handle: '@layla_cairo',
    followers: '62K',
    brandAffiliation: 'Talieska Studio',
    commissionRate: 15,
    totalEarnings: 21900,
    status: 'active',
    avatar: '/images/reels/reel_3.jpg',
    specialty: 'عبايات وملابس سهرة راقية'
  },
  {
    id: 'c-04',
    name: 'Nour Modern • نور مودرن',
    handle: '@nour_trends',
    followers: '45K',
    brandAffiliation: 'Cairo Leather Craft',
    commissionRate: 10,
    totalEarnings: 14200,
    status: 'active',
    avatar: '/images/reels/reel_4.jpg',
    specialty: 'إكسسوارات وحقائب يدوية'
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
    id: 'u-merchant-talieska',
    name: 'Talieska Atelier • إدارة تاليسكا',
    email: 'merchant@egyptian-commerce.com',
    role: 'merchant',
    assignedStore: 'Talieska Studio (talieska)',
    status: 'active',
    created_at: '2026-02-01T00:00:00.000Z'
  },
  {
    id: 'u-creator-yasmin',
    name: 'Yasmin El Sayed • صانعة محتوى',
    email: 'creator@egyptian-commerce.com',
    role: 'creator',
    assignedStore: 'Talieska Studio (Affiliate)',
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

  // 1. STORES MANAGEMENT
  async getStores() {
    try {
      const cached = localStorage.getItem(STORAGE_STORES_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_STORES;
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

  // 2. CREATORS & AFFILIATES MANAGEMENT
  async getCreators() {
    try {
      const cached = localStorage.getItem(STORAGE_CREATORS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_CREATORS;
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

  // 3. USERS & ROLE ASSIGNMENT CONTROL (Super Admin Capability)
  async getUsers() {
    try {
      const cached = localStorage.getItem(STORAGE_USERS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {
      // LocalStorage fallback
    }
    return DEFAULT_USERS;
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

      // Attempt Supabase role update if available
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
  }
};
