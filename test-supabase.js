import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbufgbonhnoridenwjry.supabase.co';
const supabaseAnonKey = 'sb_publishable_Wa3PBB1IaxacwZLo0pzuzQ_hr1trRPR';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    const { data, error } = await supabase.from('products').select('*').limit(1);
    console.log('Data:', data);
    console.log('Error:', error);
  } catch (err) {
    console.error('Catch Error:', err.message);
  }
}
test();
