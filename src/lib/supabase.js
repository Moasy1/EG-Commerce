import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
                    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
                    'https://dbufgbonhnoridenwjry.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
                       (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 
                       'sb_publishable_Wa3PBB1IaxacwZLo0pzuzQ_hr1trRPR';

// Safe fetch with 8s timeout so database queries and cold starts never freeze or abort prematurely
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(new Error('Supabase request timeout')), 8000);

  let signal = controller.signal;
  if (options.signal) {
    if (typeof AbortSignal.any === 'function') {
      signal = AbortSignal.any([options.signal, controller.signal]);
    } else {
      options.signal.addEventListener('abort', () => controller.abort(options.signal.reason), { once: true });
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: fetchWithTimeout
  }
});
