import { supabase } from '../lib/supabase';

const SUPER_ADMIN_MOCK = {
  id: 'sa-01',
  email: 'admin',
  role: 'superadmin',
  name: 'Super Admin',
  profile: { role: 'superadmin' }
};

export const AuthService = {
  async getCurrentUser() {
    // Check if we have the mock super admin stored locally to maintain session
    if (localStorage.getItem('eg_super_admin')) {
      return SUPER_ADMIN_MOCK;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      
      // Fetch profile safely
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
        
      // Default to metadata role if profile doesn't have it yet
      const role = profile?.role || user.user_metadata?.role || 'user';
        
      return { ...user, role, profile: { ...profile, role } };
    } catch (e) {
      return null;
    }
  },

  async signInWithEmail(email, password) {
    // Hardcoded super admin
    if (email.toLowerCase() === 'admin' && password === 'admin') {
      localStorage.setItem('eg_super_admin', 'true');
      return { user: SUPER_ADMIN_MOCK };
    }
    
    // Clear super admin mock just in case
    localStorage.removeItem('eg_super_admin');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signUpWithEmail(email, password, role = 'user', name = '') {
    if (email.toLowerCase() === 'admin') {
      throw new Error('Admin username is reserved');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    });
    
    if (error) throw error;
    
    // Auto-create profile entry since Supabase triggers might not be set up in the preview
    if (data?.user) {
      try {
        await supabase.from('profiles').insert([
          { id: data.user.id, name, role, email }
        ]);
      } catch (err) {
        console.warn('Could not auto-create profile, might be handled by DB trigger:', err);
      }
    }
    
    return data;
  },

  async signOut() {
    localStorage.removeItem('eg_super_admin');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
