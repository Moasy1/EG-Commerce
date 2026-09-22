import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
                    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
                    'https://dbufgbonhnoridenwjry.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
                       (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) || 
                       'sb_publishable_Wa3PBB1IaxacwZLo0pzuzQ_hr1trRPR';

// Safe fetch with 3.5s timeout so asleep databases or network 522s don't freeze the client
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 3500);
  try {
    const response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: fetchWithTimeout
  }
});
