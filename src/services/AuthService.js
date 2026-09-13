import { supabase } from '../lib/supabase';

export const AuthService = {
  async getCurrentUser() {
    try {
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
        
      // Default to profile role, then metadata role, fallback to 'user'
      const role = profile?.role || user.user_metadata?.role || 'user';
        
      return { ...user, role, profile: { ...profile, role } };
    } catch (e) {
      return null;
    }
  },

  async signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

  async signUpWithEmail(email, password, requestedRole = 'user', name = '') {
    // Prevent privilege escalation: only allow standard buyer/creator/merchant requests
    // superadmin and admin roles must be explicitly provisioned in the database
    const sanitizedRole = ['creator', 'merchant'].includes(requestedRole) ? requestedRole : 'user';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: sanitizedRole
        }
      }
    });
    
    if (error) throw error;
    
    // Auto-create profile entry with sanitized role if DB trigger is not active
    if (data?.user) {
      try {
        await supabase.from('profiles').insert([
          { id: data.user.id, name, role: sanitizedRole, email }
        ]);
      } catch (err) {
        console.warn('Could not auto-create profile (handled by trigger or exists):', err);
      }
    }
    
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
