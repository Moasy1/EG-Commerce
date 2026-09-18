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

export const AuthService = {
  async getCurrentUser() {
    try {
      // 1. Check local active demo session first
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.id) return parsed;
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
        
      // Default to profile role, then metadata role, fallback to 'buyer'
      const role = profile?.role || user.user_metadata?.role || 'buyer';
      const name = profile?.name || user.user_metadata?.name || user.email?.split('@')[0];
        
      return { 
        ...user, 
        name, 
        role, 
        profile: { ...profile, role, name } 
      };
    } catch (e) {
      return null;
    }
  },

  async signInWithEmail(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();

    // Try real Supabase auth first
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!error && data?.user) {
        localStorage.removeItem(DEMO_STORAGE_KEY);
        return data;
      }
    } catch (supaErr) {
      console.warn('Supabase auth attempt returned error, checking demo match:', supaErr.message);
    }

    // Match demo accounts (support both egyptian-commerce.com and legacy eg-commerce.com)
    for (const [key, demo] of Object.entries(DEMO_USERS)) {
      const demoPrefix = demo.email.split('@')[0];
      const legacyEmail = `${demoPrefix}@eg-commerce.com`;
      const inputPrefix = cleanEmail.split('@')[0];

      if (cleanEmail === demo.email || cleanEmail === legacyEmail || inputPrefix === demoPrefix) {
        const sessionUser = {
          ...demo,
          user_metadata: { name: demo.name, role: demo.role }
        };
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(sessionUser));
        return { user: sessionUser, session: { access_token: 'demo-token' } };
      }
    }

    // Fallback if password provided for any email in demo mode
    if (cleanEmail && password && password.length >= 4) {
      const customDemo = {
        id: `usr-${Date.now()}`,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'buyer',
        avatar_url: '/images/reels/reel_1.jpg',
        reward_points_balance: 100
      };
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(customDemo));
      return { user: customDemo, session: { access_token: 'demo-token' } };
    }

    throw new Error('بيانات الدخول غير صحيحة. يمكنك استخدام أزرار الدخول التجريبي السريع أدناه.');
  },

  async loginAsDemo(roleKey = 'merchant') {
    const demo = DEMO_USERS[roleKey] || DEMO_USERS.merchant;
    const sessionUser = {
      ...demo,
      user_metadata: { name: demo.name, role: demo.role }
    };
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async signUpWithEmail(email, password, requestedRole = 'buyer', name = '') {
    const cleanEmail = (email || '').trim().toLowerCase();
    const sanitizedRole = ['creator', 'merchant', 'admin'].includes(requestedRole) ? requestedRole : 'buyer';

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: name || cleanEmail.split('@')[0],
            role: sanitizedRole
          }
        }
      });
      
      if (!error && data?.user) {
        try {
          await supabase.from('profiles').insert([
            { id: data.user.id, name: name || cleanEmail.split('@')[0], role: sanitizedRole, email: cleanEmail }
          ]);
        } catch (err) {
          console.warn('Could not auto-create profile:', err);
        }
        return data;
      }
    } catch (err) {
      console.warn('Supabase signUp error, creating local session:', err.message);
    }

    // Fallback: create local account session so user is never blocked
    const newDemoUser = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      role: sanitizedRole,
      avatar_url: sanitizedRole === 'merchant' ? '/images/brands/talieska_logo.jpg' : '/images/reels/reel_1.jpg',
      reward_points_balance: 200
    };
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newDemoUser));
    return { user: newDemoUser };
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
