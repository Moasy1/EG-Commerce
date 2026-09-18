import { supabase } from '../lib/supabase.js';

export const DEMO_USERS = {
  // Merchants
  merchant: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'talieska@eg-commerce.com',
    name: 'Talieska Studio • تاليسكا ستوديو',
    role: 'merchant',
    avatar_url: '/images/brands/talieska_logo.jpg',
    merchant_id: 'd0000000-0000-0000-0000-000000000001',
    slug: 'talieska',
    reward_points_balance: 1450
  },
  merchant_talieska: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'talieska@eg-commerce.com',
    name: 'Talieska Studio • تاليسكا ستوديو',
    role: 'merchant',
    avatar_url: '/images/brands/talieska_logo.jpg',
    merchant_id: 'd0000000-0000-0000-0000-000000000001',
    slug: 'talieska',
    reward_points_balance: 1450
  },
  merchant_khan: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'khan@eg-commerce.com',
    name: 'Khan El Khalili Craft • ورشة خان الخليلي',
    role: 'merchant',
    avatar_url: '/images/products/copper_lantern.jpg',
    merchant_id: 'd0000000-0000-0000-0000-000000000002',
    slug: 'khan-craft',
    reward_points_balance: 920
  },
  merchant_tiba: {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'tiba@eg-commerce.com',
    name: 'Tiba Jewelry • مجوهرات طيبة',
    role: 'merchant',
    avatar_url: '/images/brands/talieska_logo.jpg',
    merchant_id: 'd0000000-0000-0000-0000-000000000003',
    slug: 'tiba-jewelry',
    reward_points_balance: 1100
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
    avatar_url: '/images/brands/talieska_logo.jpg',
    reward_points_balance: 10000
  }
};

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
      const merchant_id = profile?.merchant_id || user.user_metadata?.merchant_id || cachedReg?.merchant_id || (role === 'merchant' ? 'm-01' : null);
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

    // 1. Try real Supabase auth first
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
        const merchant_id = profile?.merchant_id || data.user.user_metadata?.merchant_id || cachedReg?.merchant_id || (role === 'merchant' ? 'm-01' : null);
        const creator_id = profile?.creator_id || data.user.user_metadata?.creator_id || cachedReg?.creator_id || (role === 'creator' ? 'cr-01' : null);

        const authenticatedUser = {
          ...data.user,
          name,
          role,
          merchant_id,
          creator_id,
          is_merchant: role === 'merchant',
          is_creator: role === 'creator',
          profile: { ...(profile || {}), role, name, merchant_id, creator_id }
        };

        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(authenticatedUser));
        return { user: authenticatedUser, session: data.session };
      }
    } catch (supaErr) {
      console.warn('Supabase auth attempt returned error, checking registered accounts:', supaErr.message);
    }

    // 2. Check persistent registered accounts registry
    const registeredAccount = getRegisteredAccounts()[cleanEmail];
    if (registeredAccount) {
      if (registeredAccount.password && password && registeredAccount.password !== password) {
        throw new Error('كلمة المرور غير صحيحة. يرجى التأكد من كلمة المرور المدخلة.');
      }
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(registeredAccount));
      return { user: registeredAccount, session: { access_token: 'reg-token' } };
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

    // 4. Fallback for new ad-hoc email sign-ins
    if (cleanEmail && password && password.length >= 4) {
      const customDemo = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'buyer',
        avatar_url: '/images/reels/reel_1.jpg',
        reward_points_balance: 100
      };
      saveRegisteredAccount(cleanEmail, customDemo);
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(customDemo));
      return { user: customDemo, session: { access_token: 'demo-token' } };
    }

    throw new Error('بيانات الدخول غير صحيحة. يمكنك إنشاء حساب جديد أو استخدام أزرار الدخول التجريبي.');
  },

  async loginAsDemo(roleKey = 'merchant') {
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
      ? '/images/brands/talieska_logo.jpg' 
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

    // Persistent registered account object with real privileges
    const newRegisteredUser = {
      id: supaUser?.id || generatedUserId,
      email: cleanEmail,
      password, // retained locally so re-login works with 100% privilege preservation
      name: defaultName,
      role: sanitizedRole,
      merchant_id: generatedMerchantId,
      creator_id: generatedCreatorId,
      handle,
      avatar_url: avatarUrl,
      is_merchant: sanitizedRole === 'merchant',
      is_creator: sanitizedRole === 'creator',
      reward_points_balance: sanitizedRole === 'merchant' ? 500 : 200,
      user_metadata: {
        name: defaultName,
        role: sanitizedRole,
        merchant_id: generatedMerchantId,
        creator_id: generatedCreatorId
      },
      profile: {
        id: supaUser?.id || generatedUserId,
        email: cleanEmail,
        name: defaultName,
        role: sanitizedRole,
        merchant_id: generatedMerchantId,
        creator_id: generatedCreatorId,
        avatar_url: avatarUrl
      }
    };

    // Save to persistent registry
    saveRegisteredAccount(cleanEmail, newRegisteredUser);

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
          slug: defaultName.toLowerCase().replace(/\s+/g, '-'),
          subdomain: `${defaultName.toLowerCase().replace(/\s+/g, '-')}.egyptian-commerce.com`,
          customDomain: null,
          category: 'Egyptian Fashion & Retail',
          categoryAr: 'أزياء وتجارة مصرية معتمدة',
          bio: `متجر مصري موثق لـ ${defaultName}`,
          established: '2026',
          rating: 5.0,
          reviewsCount: 1,
          verified: true,
          logo: avatarUrl,
          banner: '/images/banners/talieska_hero.jpg'
        };
        customMerchants = [newMerchantRecord, ...customMerchants.filter(m => m.id !== generatedMerchantId)];
        localStorage.setItem('eg_custom_merchants', JSON.stringify(customMerchants));
      } catch (e) {}
    }

    // Save active session
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newRegisteredUser));

    return { user: newRegisteredUser };
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
