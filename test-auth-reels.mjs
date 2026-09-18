import { supabase } from './src/lib/supabase.js';

async function testAuthAndReelInsert() {
  // Test signing in with demo credentials or creating a session
  console.log('Attempting sign in with demo user...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'talieska@eg-commerce.com',
    password: 'password123'
  });

  console.log('Auth result:', { user: authData?.user?.id, error: authError?.message });

  if (authData?.user) {
    const { data: insertData, error: insertError } = await supabase
      .from('reels')
      .insert({
        video_url: '/images/reels/linen_abaya.mp4',
        caption: 'Authenticated Test Reel',
        status: 'active',
        visibility: 'public'
      })
      .select();
    console.log('Insert with auth:', { insertData, error: insertError?.message });
  }
}

testAuthAndReelInsert();
