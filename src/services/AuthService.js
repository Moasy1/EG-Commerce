import { supabase } from '../lib/supabase.js';

export const DEMO_USERS = {
  merchant: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'talieska@egyptian-commerce.com',
    name: 'Talieska Studio • تاليسكا ستوديو',
    role: 'merchant',
    avatar_url: '/images/brands/talieska_logo.jpg',
    merchant_id: 'm0000000-0000-0000-0000-000000000001',
    slug: 'talieska',
    reward_points_balance: 1450
  },
  creator: {
    id: 'c0000000-0000-0000-0000-000000000001',
    email: 'yasmin@egyptian-commerce.com',
    name: 'ياسمين السيد • Yasmin Sayed',
    role: 'creator',
    avatar_url: '/images/reels/reel_2.jpg',
    handle: '@yasmin_style',
    reward_points_balance: 890
  },
  buyer: {
    id: 'b0000000-0000-0000-0000-000000000001',
    email: 'mariam@egyptian-commerce.com',
    name: 'مريم الشافعي • Mariam El-Shafei',
    role: 'buyer',
    avatar_url: '/images/reels/reel_1.jpg',
    reward_points_balance: 350
  },
  admin: {
    id: 'a0000000-0000-0000-0000-000000000001',
    email: 'admin@egyptian-commerce.com',
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

  async signOut() {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Supabase signOut error:', error);
    }
  }
};
