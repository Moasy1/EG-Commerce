import { supabase } from './src/lib/supabase.js';

async function checkTables() {
  const tables = [
    'profiles', 'merchants', 'products', 'reels', 
    'ugc_campaigns', 'ugc_applications', 'sessions', 
    'user_events', 'saved_reels', 'comments'
  ];

  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    console.log(`Table ${t}:`, {
      canSelect: !error,
      count: data?.length,
      error: error?.message
    });
  }
}

checkTables();
