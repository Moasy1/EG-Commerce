import { supabase } from './src/lib/supabase.js';

async function inspectReelsTable() {
  const { data, error } = await supabase.from('reels').select('*').limit(1);
  console.log('Error:', error);
  console.log('Sample row / keys:', data);

  // Try insert with minimal columns: id, video_url, caption, status
  const testId = 'ee000000-0000-0000-0000-000000000099';
  const { data: insData, error: insError } = await supabase.from('reels').insert({
    id: testId,
    video_url: '/images/reels/linen_abaya.mp4',
    caption: 'Testing minimal reel insert',
    status: 'active'
  }).select();

  console.log('Minimal insert:', { insData, error: insError?.message });
}

inspectReelsTable();
