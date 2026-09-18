import { supabase } from './src/lib/supabase.js';

async function testSupabaseReels() {
  console.log('Testing Supabase reels query and insert...');

  const { data: selectData, error: selectError } = await supabase
    .from('reels')
    .select('*')
    .limit(5);

  console.log('Select Result:', { count: selectData?.length, error: selectError?.message });

  // Test insert
  const { data: insertData, error: insertError } = await supabase
    .from('reels')
    .insert({
      video_url: '/images/reels/linen_abaya.mp4',
      caption: 'Test Reel for Device Sync',
      status: 'active'
    })
    .select();

  console.log('Insert Result:', { inserted: insertData, error: insertError?.message });
}

testSupabaseReels().catch(err => console.error(err));
