import { supabase } from '../lib/supabase.js';
import { apiConfig } from '../config/apiConfig.js';

export function generateStoreSlug(name, email, id) {
  const latin = (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (latin && latin.length >= 2) return latin;
  const emailPrefix = (email || '')
    .split('@')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (emailPrefix && emailPrefix.length >= 2) return `${emailPrefix}-boutique`;
  const cleanId = String(id || Date.now()).replace(/[^a-z0-9]/gi, '').slice(-6).toLowerCase();
  return `boutique-${cleanId || 'store'}`;
}

export const DEMO_USERS = {
  // Real Client Merchants
  merchant_onefourone: {
    id: '14100000-0000-4000-8000-000000000001',
    email: 'onefourone@egyptian-commerce.com',
    name: 'One Four One • ون فور ون',
    role: 'merchant',
    avatar_url: '/images/brands/onefourone_logo.jpg',
    merchant_id: '14100000-0000-4000-8000-000000000001',
    slug: 'onefourone',
    reward_points_balance: 1500,
    password: 'adminpassword'
  },
  merchant_4u_store: {
    id: '40000000-0000-4000-8000-000000000002',
    email: '4u@egyptian-commerce.com',
    name: '4U Store • فور يو',
    role: 'merchant',
    avatar_url: '/images/brands/4u_store_logo.webp',
    merchant_id: '40000000-0000-4000-8000-000000000002',
    slug: '4u-store',
    reward_points_balance: 1500,
    password: 'adminpassword'
  },
  merchant_drip_fit: {
    id: '171842bd-daed-40ef-853f-917eab2ed437',
    email: 'dripfit@egyptian-commerce.com',
    name: 'Drip Fit • دريب فيت',
    role: 'merchant',
    avatar_url: '/images/brands/dripfit_logo.png',
    merchant_id: '171842bd-daed-40ef-853f-917eab2ed437',
    slug: 'drip-fit',
    reward_points_balance: 1500,
    password: 'adminpassword'
  },
  merchant_snugs: {
    id: '50000000-0000-4000-8000-000000000004',
    email: 'snugs@egyptian-commerce.com',
    name: 'Snugs • سناجز',
    role: 'merchant',
    avatar_url: '/images/brands/snugs_logo.jpg',
    merchant_id: '50000000-0000-4000-8000-000000000004',
    slug: 'snugs',
    reward_points_balance: 1500,
    password: 'adminpassword'
  },
  merchant_rakan_fragrances: {
    id: '60000000-0000-4000-8000-000000000005',
    email: 'rakan@egyptian-commerce.com',
    name: 'Rakan Fragrances • رَكان للعطور',
    role: 'merchant',
    avatar_url: '/images/brands/rakan_fragrances_logo.jpg',
    merchant_id: '60000000-0000-4000-8000-000000000005',
    slug: 'rakan-fragrances',
    reward_points_balance: 1500,
    password: 'adminpassword'
  },
  merchant_vermelle: {
    id: '70000000-0000-4000-8000-000000000006',
    email: 'vermelle@egyptian-commerce.com',
    name: 'Vermelle • فيرميل',
    role: 'merchant',
    avatar_url: '/images/brands/vermelle_logo.jpg',
    merchant_id: '70000000-0000-4000-8000-000000000006',
    slug: 'vermelle',
    reward_points_balance: 1500,
    password: 'adminpassword'
  },
  merchant_liminal: {
    id: '80000000-0000-4000-8000-000000000007',
    email: 'liminal@egyptian-commerce.com',
    name: 'liminal • ليمينال',
    role: 'merchant',
    avatar_url: '/images/brands/liminal_logo.jpg',
    merchant_id: '80000000-0000-4000-8000-000000000007',
    slug: 'liminal',
    reward_points_balance: 1500,
    password: 'adminpassword'
  },
  merchant_jk_perfumes: {
    id: '90000000-0000-4000-8000-000000000008',
    email: 'jkperfumes@egyptian-commerce.com',
    name: 'JK Perfumes • جي كي للعطور',
    role: 'merchant',
    avatar_url: '/images/brands/jk_perfumes_logo.jpg',
    merchant_id: '90000000-0000-4000-8000-000000000008',
    slug: 'jk-perfumes',
    reward_points_balance: 1500,
    password: 'adminpassword'
  },
  merchant: {
    id: '171842bd-daed-40ef-853f-917eab2ed437',
    email: 'dripfit@egyptian-commerce.com',
    name: 'Drip Fit • دريب فيت',
    role: 'merchant',
    avatar_url: '/images/brands/dripfit_logo.png',
    merchant_id: '171842bd-daed-40ef-853f-917eab2ed437',
    slug: 'drip-fit',
    reward_points_balance: 1500,
    password: 'adminpassword'
  },
  // Creators
  creator: {
    id: 'c0000000-0000-0000-0000-000000000001',
    email: 'yasmin@eg-commerce.com',
    name: 'ياسمين السيد • Yasmin Sayed',
    role: 'creator',
    avatar_url: '/images/reels/reel_2.jpg',
    creator_id: 'ce000000-0000-0000-0000-000000000001',
    handle: '@yasmin_style',
    total_earnings: 8450,
    reward_points_balance: 890
  },
  creator_yasmin: {
    id: 'c0000000-0000-0000-0000-000000000001',
    email: 'yasmin@eg-commerce.com',
    name: 'ياسمين السيد • Yasmin Sayed',
    role: 'creator',
    avatar_url: '/images/reels/reel_2.jpg',
    creator_id: 'ce000000-0000-0000-0000-000000000001',
    handle: '@yasmin_style',
    total_earnings: 8450,
    reward_points_balance: 890
  },
  creator_cairochic: {
    id: 'c0000000-0000-0000-0000-000000000002',
    email: 'cairochic@eg-commerce.com',
    name: 'سارة المهدي (كايرو شيك) • Cairo Chic',
    role: 'creator',
    avatar_url: '/images/reels/fashion_citrine_blazer_thumb.jpg',
    creator_id: 'ce000000-0000-0000-0000-000000000002',
    handle: '@cairo_chic',
    total_earnings: 12300,
    reward_points_balance: 1250
  },
  creator_salma: {
    id: 'c0000000-0000-0000-0000-000000000003',
    email: 'salma@eg-commerce.com',
    name: 'سلمى ستايلز • Salma Styles',
    role: 'creator',
    avatar_url: '/images/reels/fashion_oversized_shirt_thumb.jpg',
    creator_id: 'ce000000-0000-0000-0000-000000000003',
    handle: '@salma.styles',
    total_earnings: 5120,
    reward_points_balance: 670
  },

  // Buyers
  buyer: {
    id: 'b0000000-0000-0000-0000-000000000001',
    email: 'mariam@eg-commerce.com',
    name: 'مريم الشافعي • Mariam El-Shafei',
    role: 'buyer',
    avatar_url: '/images/reels/reel_1.jpg',
    reward_points_balance: 450
  },
  buyer_mariam: {
    id: 'b0000000-0000-0000-0000-000000000001',
    email: 'mariam@eg-commerce.com',
    name: 'مريم الشافعي • Mariam El-Shafei',
    role: 'buyer',
    avatar_url: '/images/reels/reel_1.jpg',
    reward_points_balance: 450
  },
  buyer_nourhan: {
    id: 'b0000000-0000-0000-0000-000000000002',
    email: 'nourhan@eg-commerce.com',
    name: 'نورهان كريم • Nourhan Karim',
    role: 'buyer',
    avatar_url: '/images/reels/reel_2.jpg',
    reward_points_balance: 310
  },

  // Admin
  admin: {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@eg-commerce.com',
    name: 'Egyptian Commerce SuperAdmin',
    role: 'admin',
    avatar_url: '/images/brands/dripfit_logo.png',
    reward_points_balance: 10000
  }
};

export const DEFAULT_CREATORS = [
  { id: 'c-1', handle: '@cairo_chic', name: 'Cairo Chic (Sara)', avatar: '/images/reels/fashion_citrine_blazer_thumb.jpg', role: 'creator', verified: true, slug: 'cairo_chic', bio: 'Stylist & Blazer UGC Lookbooks | Cairo, Egypt', followersCount: '48.2K', followingCount: '142' },
  { id: 'c-2', handle: '@salma.styles', name: 'Salma Styles', avatar: '/images/reels/fashion_oversized_shirt_thumb.jpg', role: 'creator', verified: true, slug: 'salma.styles', bio: 'Streetwear, linen & oversized styling | Alexandria, Egypt', followersCount: '32.1K', followingCount: '98' },
  { id: 'c-3', handle: '@yasmin_style', name: 'Yasmin Sayed', avatar: '/images/reels/reel_2.jpg', role: 'creator', verified: true, slug: 'yasmin_style', bio: 'Drip Fit brand ambassador & modest fashion | Cairo, Egypt', followersCount: '64.5K', followingCount: '210' },
  { id: 'c-4', handle: '@zeina_ootd', name: 'Zeina OOTD', avatar: '/images/reels/fashion_oneshoulder_top_thumb.jpg', role: 'creator', verified: true, slug: 'zeina_ootd', bio: 'Daily OOTD, luxury accessories & summer looks', followersCount: '27.8K', followingCount: '85' },
  { id: 'c-5', handle: '@karim.editorial', name: 'Karim Editorial', avatar: '/images/reels/fashion_vintage_watch_thumb.jpg', role: 'creator', verified: true, slug: 'karim.editorial', bio: 'Menswear, horology & bespoke artisan crafts', followersCount: '19.4K', followingCount: '62' },
  { id: 'c-6', handle: '@maya_accessories', name: 'Maya Accessories', avatar: '/images/reels/fashion_shoulder_bags_thumb.jpg', role: 'creator', verified: true, slug: 'maya_accessories', bio: 'Handcrafted Egyptian leather bags & jewelry', followersCount: '22.0K', followingCount: '115' },
];

const DEMO_STORAGE_KEY = 'eg_active_session';
const REGISTERED_ACCOUNTS_KEY = 'eg_registered_users_registry';

function getRegisteredAccounts() {
  try {
    const raw = localStorage.getItem(REGISTERED_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveRegisteredAccount(email, userRecord) {
  try {
    const accounts = getRegisteredAccounts();
    accounts[email.toLowerCase().trim()] = userRecord;
    localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {}
}

export const AuthService = {
  getRegisteredAccounts,

  updateUserPassword(email, newPassword) {
    try {
      const cleanEmail = (email || '').toLowerCase().trim();
      if (!cleanEmail) return false;
      const accounts = getRegisteredAccounts();
      if (accounts[cleanEmail]) {
        accounts[cleanEmail].password = newPassword;
        accounts[cleanEmail].updated_at = new Date().toISOString();
        localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
      } else {
        accounts[cleanEmail] = {
          email: cleanEmail,
          password: newPassword,
          name: cleanEmail.split('@')[0],
          role: 'buyer',
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(REGISTERED_ACCOUNTS_KEY, JSON.stringify(accounts));
      }

      // If active session belongs to this user, update active session password as well
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.email && parsed.email.toLowerCase().trim() === cleanEmail) {
            parsed.password = newPassword;
            localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(parsed));
          }
        } catch (e) {}
      }
      return true;
    } catch (e) {
      console.warn('AuthService.updateUserPassword error:', e);
      return false;
    }
  },

  async getCurrentUser() {
    try {
      // 1. Check local active demo session first
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.id) {
            // Verify if registered accounts registry has proper role
            if (parsed.email) {
              const registered = getRegisteredAccounts()[parsed.email.toLowerCase().trim()];
              if (registered && registered.role && parsed.role !== registered.role) {
                const synchronized = { ...parsed, ...registered };
                localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(synchronized));
                return synchronized;
              }
            }
            return parsed;
          }
        } catch (e) {
          localStorage.removeItem(DEMO_STORAGE_KEY);
        }
      }

      // 2. Otherwise check Supabase live auth
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      
      // Fetch user profile securely
      let profile = null;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        profile = data;
      } catch (err) {
        console.warn('Could not fetch profile:', err);
      }
        
      // Default to profile role, then metadata role, then registered accounts registry, fallback to 'buyer'
      const cachedReg = getRegisteredAccounts()[user.email?.toLowerCase().trim()];
      const role = profile?.role || user.user_metadata?.role || cachedReg?.role || 'buyer';
      const name = profile?.name || user.user_metadata?.name || cachedReg?.name || user.email?.split('@')[0];
      const merchant_id = profile?.merchant_id || user.user_metadata?.merchant_id || cachedReg?.merchant_id || (role === 'merchant' ? '171842bd-daed-40ef-853f-917eab2ed437' : null);
      const creator_id = profile?.creator_id || user.user_metadata?.creator_id || cachedReg?.creator_id || (role === 'creator' ? 'cr-01' : null);
        
      const authenticatedUser = { 
        ...user, 
        name, 
        role, 
        merchant_id,
        creator_id,
        is_merchant: role === 'merchant',
        is_creator: role === 'creator',
        profile: { ...profile, role, name, merchant_id, creator_id } 
      };

      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(authenticatedUser));
      return authenticatedUser;
    } catch (e) {
      return null;
    }
  },

  async signInWithEmail(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();

    // 0. Verify password match against registered accounts registry if present
    const registeredAccount = getRegisteredAccounts()[cleanEmail];
    if (registeredAccount && registeredAccount.password) {
      if (password !== registeredAccount.password) {
        throw new Error('كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور المدخلة.');
      }
    }

    // 1. Try real Supabase auth
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!error && data?.user) {
        let profile = null;
        try {
          const { data: pData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          profile = pData;
        } catch (pErr) {}

        const cachedReg = getRegisteredAccounts()[cleanEmail];
        const role = profile?.role || data.user.user_metadata?.role || cachedReg?.role || 'buyer';
        const name = profile?.name || data.user.user_metadata?.name || cachedReg?.name || cleanEmail.split('@')[0];
        
        let merchantRecord = null;
        if (role === 'merchant') {
          try {
            const { data: mData } = await supabase
              .from('merchants')
              .select('*')
              .eq('user_id', data.user.id)
              .maybeSingle();
            if (mData) merchantRecord = mData;
          } catch (e) {}

          if (!merchantRecord) {
            try {
              const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
              const { data: mData2 } = await supabase
                .from('merchants')
                .select('*')
                .eq('slug', slug)
                .maybeSingle();
              if (mData2) merchantRecord = mData2;
            } catch (e) {}
          }

          if (!merchantRecord) {
            try {
              const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'store';
              const { data: newM } = await supabase
                .from('merchants')
                .insert({
                  user_id: data.user.id,
                  store_name: name,
                  slug: slug,
                  is_verified: true
                })
                .select()
                .single();
              if (newM) merchantRecord = newM;
            } catch (e) {}
          }
        }

        const merchant_id = merchantRecord?.id || 
          profile?.merchant_id || 
          data.user.user_metadata?.merchant_id || 
          cachedReg?.merchant_id || 
          (role === 'merchant' ? `m-${data.user.id}` : null);
        const creator_id = profile?.creator_id || data.user.user_metadata?.creator_id || cachedReg?.creator_id || (role === 'creator' ? `cr-${data.user.id}` : null);
        const store_slug = merchantRecord?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const authenticatedUser = {
          ...data.user,
          name,
          role,
          merchant_id,
          creator_id,
          store_slug: store_slug || merchantRecord?.slug || (role === 'merchant' ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : null),
          store_name: merchantRecord?.store_name || name,
          is_merchant: role === 'merchant',
          is_creator: role === 'creator',
          profile: { ...(profile || {}), role, name, merchant_id, creator_id, store_slug }
        };

        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(authenticatedUser));
        return { user: authenticatedUser, session: data.session };
      }
    } catch (supaErr) {
      console.warn('Supabase auth attempt returned error, checking registered accounts:', supaErr.message);
    }

    // 2. Check persistent registered accounts registry
    if (registeredAccount) {
      if (registeredAccount.password && password && registeredAccount.password !== password) {
        throw new Error('كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور المدخلة.');
      }
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(registeredAccount));
      return { user: registeredAccount, session: { access_token: 'reg-token' } };
    }

    // 2.5 Check shared server backend for multi-device login
    try {
      const serverLoginRes = await fetch(apiConfig.getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      if (serverLoginRes.ok) {
        const loginData = await serverLoginRes.json();
        if (loginData?.user) {
          saveRegisteredAccount(cleanEmail, loginData.user);
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(loginData.user));
          console.log('[AuthService] Successfully logged in from shared server registry:', cleanEmail);
          return { user: loginData.user, session: { access_token: loginData.token || 'server-session' } };
        }
      } else if (serverLoginRes.status === 401) {
        throw new Error('كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور المدخلة.');
      }
    } catch (netErr) {
      if (netErr.message && netErr.message.includes('كلمة المرور غير صحيحة')) {
        throw netErr;
      }
      console.warn('[AuthService] Server login lookup notice:', netErr.message);
    }

    // 3. Match demo accounts (support both egyptian-commerce.com and legacy eg-commerce.com)
    for (const [key, demo] of Object.entries(DEMO_USERS)) {
      const demoPrefix = demo.email.split('@')[0];
      const legacyEmail = `${demoPrefix}@eg-commerce.com`;
      const inputPrefix = cleanEmail.split('@')[0];

      if (cleanEmail === demo.email || cleanEmail === legacyEmail || inputPrefix === demoPrefix) {
        const sessionUser = {
          ...demo,
          user_metadata: { name: demo.name, role: demo.role, merchant_id: demo.merchant_id }
        };
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(sessionUser));
        return { user: sessionUser, session: { access_token: 'demo-token' } };
      }
    }

    // 4. If account not found in DB or server registry
    throw new Error('الحساب غير موجود أو بيانات الدخول غير صحيحة. يرجى التأكد من البريد الإلكتروني وكلمة المرور أو إنشاء حساب جديد.');
  },

  async loginAsDemo(roleKey = 'merchant', callerUser = null) {
    // Strict Admin-only gating: Check if there's an active non-admin session trying to switch
    const current = callerUser || await this.getCurrentUser();
    if (current && current.role !== 'admin' && current.role !== 'superadmin') {
      throw new Error('غير مصرح لك بتبديل الحساب. خاصية تبديل الحسابات محصورة بمشرفي النظام فقط (Admins Only).');
    }

    const demo = DEMO_USERS[roleKey] || DEMO_USERS.merchant;
    const sessionUser = {
      ...demo,
      user_metadata: { name: demo.name, role: demo.role, merchant_id: demo.merchant_id }
    };
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async signUpWithEmail(email, password, requestedRole = 'buyer', name = '') {
    const cleanEmail = (email || '').trim().toLowerCase();
    const sanitizedRole = ['creator', 'merchant', 'admin'].includes(requestedRole) ? requestedRole : 'buyer';
    const defaultName = name || cleanEmail.split('@')[0];
    const generatedUserId = `usr-${Date.now()}`;
    const generatedMerchantId = sanitizedRole === 'merchant' ? `m-${Date.now().toString(36)}` : null;
    const generatedCreatorId = sanitizedRole === 'creator' ? `cr-${Date.now().toString(36)}` : null;
    const handle = sanitizedRole === 'creator' ? `@${defaultName.replace(/\s+/g, '_').toLowerCase()}` : undefined;
    const avatarUrl = sanitizedRole === 'merchant' 
      ? '/images/brands/dripfit_logo.png' 
      : sanitizedRole === 'creator' 
        ? '/images/reels/reel_2.jpg' 
        : '/images/reels/reel_1.jpg';

    let supaUser = null;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: defaultName,
            role: sanitizedRole,
            merchant_id: generatedMerchantId,
            creator_id: generatedCreatorId,
            is_merchant: sanitizedRole === 'merchant',
            is_creator: sanitizedRole === 'creator'
          }
        }
      });
      
      if (!error && data?.user) {
        supaUser = data.user;
        try {
          await supabase.from('profiles').upsert([
            { 
              id: data.user.id, 
              name: defaultName, 
              display_name: defaultName,
              role: sanitizedRole, 
              email: cleanEmail,
              avatar_url: avatarUrl,
              is_merchant: sanitizedRole === 'merchant',
              is_creator: sanitizedRole === 'creator'
            }
          ]);
        } catch (err) {
          console.warn('Could not auto-create profile in Supabase:', err);
        }

        // If merchant, insert merchant entry
        if (sanitizedRole === 'merchant') {
          try {
            await supabase.from('merchants').upsert([
              {
                user_id: data.user.id,
                store_name: defaultName,
                slug: defaultName.toLowerCase().replace(/\s+/g, '-'),
                is_verified: true
              }
            ]);
          } catch (merchErr) {
            console.warn('Could not auto-create merchant record in Supabase:', merchErr);
          }
        }
      }
    } catch (err) {
      console.warn('Supabase signUp error, proceeding with local persistent registration:', err.message);
    }

    const storeSlug = generateStoreSlug(defaultName, cleanEmail, generatedMerchantId);

    // Persistent registered account object with real privileges
    const newRegisteredUser = {
      id: supaUser?.id || generatedUserId,
      email: cleanEmail,
      password, // retained locally so re-login works with 100% privilege preservation
      name: defaultName,
      role: sanitizedRole,
      merchant_id: generatedMerchantId,
      creator_id: generatedCreatorId,
      store_name: defaultName,
      store_slug: storeSlug,
      slug: storeSlug,
      handle,
      avatar_url: avatarUrl,
      is_merchant: sanitizedRole === 'merchant',
      is_creator: sanitizedRole === 'creator',
      reward_points_balance: sanitizedRole === 'merchant' ? 500 : 200,
      user_metadata: {
        name: defaultName,
        role: sanitizedRole,
        merchant_id: generatedMerchantId,
        creator_id: generatedCreatorId,
        store_name: defaultName,
        store_slug: storeSlug,
        slug: storeSlug
      },
      profile: {
        id: supaUser?.id || generatedUserId,
        email: cleanEmail,
        name: defaultName,
        role: sanitizedRole,
        merchant_id: generatedMerchantId,
        creator_id: generatedCreatorId,
        store_name: defaultName,
        store_slug: storeSlug,
        slug: storeSlug,
        avatar_url: avatarUrl
      }
    };

    // Save to persistent registry
    saveRegisteredAccount(cleanEmail, newRegisteredUser);

    // Persist to shared server backend for multi-device login
    try {
      await fetch(apiConfig.getApiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRegisteredUser)
      });
      console.log('[AuthService] Account synced to shared server backend for multi-device access:', cleanEmail);
    } catch (apiErr) {
      console.warn('[AuthService] Shared server registration sync notice:', apiErr.message);
    }

    // If merchant, persist to custom merchants registry
    if (sanitizedRole === 'merchant') {
      try {
        const rawMerchants = localStorage.getItem('eg_custom_merchants');
        let customMerchants = rawMerchants ? JSON.parse(rawMerchants) : [];
        const newMerchantRecord = {
          id: generatedMerchantId,
          user_id: supaUser?.id || generatedUserId,
          name: `${defaultName} Store • متجر ${defaultName}`,
          shortName: defaultName,
          slug: storeSlug,
          handle: `@${storeSlug}`,
          subdomain: `${storeSlug}.egyptian-commerce.com`,
          customDomain: null,
          category: 'Egyptian Fashion & Retail',
          categoryAr: 'أزياء وتجارة مصرية معتمدة',
          bio: `متجر مصري موثق لـ ${defaultName}`,
          established: '2026',
          rating: 5.0,
          reviewsCount: 1,
          verified: true,
          logo: avatarUrl,
          banner: '/images/products/the_sharp_v_yellow_1.webp'
        };
        customMerchants = [newMerchantRecord, ...customMerchants.filter(m => m.id !== generatedMerchantId)];
        localStorage.setItem('eg_custom_merchants', JSON.stringify(customMerchants));

        // Persist merchant boutique to shared backend so all devices see it in Marketplace
        try {
          await fetch(apiConfig.getApiUrl('/api/merchants'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMerchantRecord)
          });
          console.log('[AuthService] Merchant boutique synced to shared server:', newMerchantRecord.name);
        } catch (mServerErr) {
          console.warn('[AuthService] Server merchant sync notice:', mServerErr.message);
        }
      } catch (e) {}
    }

    // If creator, persist to custom creators registry
    if (sanitizedRole === 'creator') {
      try {
        const rawCreators = localStorage.getItem('eg_custom_creators');
        let customCreators = rawCreators ? JSON.parse(rawCreators) : [];
        const newCreatorRecord = {
          id: generatedCreatorId,
          user_id: supaUser?.id || generatedUserId,
          name: defaultName,
          handle: handle || `@${defaultName.replace(/\s+/g, '_').toLowerCase()}`,
          slug: defaultName.toLowerCase().replace(/\s+/g, '-'),
          avatar: avatarUrl,
          role: 'creator',
          verified: true,
          bio: `صانع محتوى أزياء مصري معتمد لـ ${defaultName}`,
          followersCount: '1.2K',
          followingCount: '45',
          reelsCount: 0
        };
        customCreators = [newCreatorRecord, ...customCreators.filter(c => c.id !== generatedCreatorId)];
        localStorage.setItem('eg_custom_creators', JSON.stringify(customCreators));
      } catch (e) {}
    }

    // Save active session
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newRegisteredUser));

    return { user: newRegisteredUser };
  },

  async getCreators() {
    let custom = [];
    try {
      const stored = localStorage.getItem('eg_custom_creators');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) custom = parsed;
      }
    } catch (e) {}

    // Also include any accounts from registered accounts registry with role === 'creator'
    const regAccounts = getRegisteredAccounts();
    Object.values(regAccounts).forEach(acc => {
      if (acc.role === 'creator' && !custom.some(c => c.id === acc.creator_id || c.handle === acc.handle)) {
        custom.push({
          id: acc.creator_id || acc.id,
          user_id: acc.id,
          name: acc.name,
          handle: acc.handle || `@${acc.name.replace(/\s+/g, '_').toLowerCase()}`,
          slug: acc.name.toLowerCase().replace(/\s+/g, '-'),
          avatar: acc.avatar_url || '/images/reels/reel_2.jpg',
          role: 'creator',
          verified: true,
          bio: `صانع محتوى أزياء مصري معتمد لـ ${acc.name}`,
          followersCount: '1.5K',
          followingCount: '50',
          reelsCount: 0
        });
      }
    });

    const creatorMap = new Map();
    DEFAULT_CREATORS.forEach(c => creatorMap.set(c.id, { ...c }));

    custom.forEach(cc => {
      const id = cc.id || cc.creator_id || `cr-${cc.name}`;
      creatorMap.set(id, {
        ...cc,
        id,
        handle: cc.handle?.startsWith('@') ? cc.handle : `@${cc.handle || cc.name}`,
        avatar: cc.avatar || cc.avatar_url || '/images/reels/reel_2.jpg',
        role: 'creator',
        verified: true
      });
    });

    // Supabase profiles where is_creator = true or role = 'creator'
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or('is_creator.eq.true,role.eq.creator');
      if (!error && data && data.length > 0) {
        data.forEach(dbp => {
          const id = dbp.creator_id || dbp.id;
          const handle = dbp.username ? `@${dbp.username.replace(/^@/, '')}` : `@${dbp.name?.replace(/\s+/g, '_').toLowerCase()}`;
          creatorMap.set(id, {
            id,
            user_id: dbp.id,
            name: dbp.display_name || dbp.name,
            handle,
            slug: dbp.username || dbp.name?.toLowerCase().replace(/\s+/g, '-'),
            avatar: dbp.avatar_url || '/images/reels/reel_2.jpg',
            role: 'creator',
            verified: dbp.is_verified ?? true,
            bio: dbp.bio || 'صانع محتوى معتمد في EG-Commerce'
          });
        });
      }
    } catch (err) {}

    return Array.from(creatorMap.values());
  },

  async updateCurrentUser(updates = {}) {
    try {
      const currentUser = await this.getCurrentUser();
      if (!currentUser) throw new Error('No authenticated user to update');

      const userId = currentUser.id;
      const sanitizedUsername = updates.username ? updates.username.replace(/^@/, '').trim() : currentUser.username;
      
      const updatedFields = {
        name: updates.name !== undefined ? updates.name : currentUser.name,
        display_name: updates.name !== undefined ? updates.name : (currentUser.display_name || currentUser.name),
        phone: updates.phone !== undefined ? updates.phone : currentUser.phone,
        bio: updates.bio !== undefined ? updates.bio : currentUser.bio,
        avatar_url: updates.avatar_url !== undefined ? updates.avatar_url : currentUser.avatar_url,
        username: sanitizedUsername,
        location: updates.location !== undefined ? updates.location : currentUser.location,
        website: updates.website !== undefined ? updates.website : currentUser.website,
        updated_at: new Date().toISOString()
      };

      // 1. If real Supabase auth session, sync with Supabase
      try {
        const { data: { user: supaUser } } = await supabase.auth.getUser();
        if (supaUser && supaUser.id === userId) {
          // Update auth user metadata
          await supabase.auth.updateUser({
            data: {
              name: updatedFields.name,
              avatar_url: updatedFields.avatar_url,
              phone: updatedFields.phone,
              username: updatedFields.username
            }
          });

          // Update profiles database table
          const { error: supaErr } = await supabase
            .from('profiles')
            .update({
              name: updatedFields.name,
              display_name: updatedFields.display_name,
              phone: updatedFields.phone,
              bio: updatedFields.bio,
              avatar_url: updatedFields.avatar_url,
              username: updatedFields.username,
              location: updatedFields.location,
              website: updatedFields.website,
              updated_at: updatedFields.updated_at
            })
            .eq('id', userId);

          if (supaErr) {
            console.warn('Supabase profile update warning:', supaErr.message);
          }

          // If user is a merchant, also synchronize with merchants table
          if (currentUser.role === 'merchant' || currentUser.merchant_id) {
            try {
              const merchUpdates = {
                name: updatedFields.name,
                store_name: updatedFields.name,
                bio: updatedFields.bio,
                logo: updatedFields.avatar_url,
                updated_at: updatedFields.updated_at
              };
              if (currentUser.merchant_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUser.merchant_id)) {
                await supabase.from('merchants').update(merchUpdates).eq('id', currentUser.merchant_id);
              } else {
                await supabase.from('merchants').update(merchUpdates).eq('user_id', userId);
              }
            } catch (mErr) {
              console.warn('Supabase merchant profile sync notice:', mErr);
            }
          }
        }
      } catch (authErr) {
        console.warn('Supabase auth sync warning:', authErr.message);
      }

      // 2. Update local storage session cache
      const mergedUser = {
        ...currentUser,
        ...updatedFields,
        user_metadata: {
          ...(currentUser.user_metadata || {}),
          ...updatedFields
        },
        profile: {
          ...(currentUser.profile || {}),
          ...updatedFields
        }
      };

      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(mergedUser));

      if (currentUser.merchant_id) {
        try {
          const settingsKey = `eg_merchant_settings_${currentUser.merchant_id}`;
          const existing = localStorage.getItem(settingsKey);
          const parsed = existing ? JSON.parse(existing) : {};
          localStorage.setItem(settingsKey, JSON.stringify({
            ...parsed,
            name: updatedFields.name,
            bio: updatedFields.bio,
            logo: updatedFields.avatar_url
          }));
        } catch (e) {}
      }

      try {
        window.dispatchEvent(new CustomEvent('eg_profiles_updated', { detail: { user: mergedUser } }));
        window.dispatchEvent(new CustomEvent('eg_merchant_updated', { detail: { user: mergedUser } }));
      } catch (e) {}

      return { success: true, user: mergedUser };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async signOut() {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Supabase signOut error:', error);
    }
  }
};
