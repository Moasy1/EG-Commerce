import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dbufgbonhnoridenwjry.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Wa3PBB1IaxacwZLo0pzuzQ_hr1trRPR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
