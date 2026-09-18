import { supabase } from './src/lib/supabase.js';

async function testSignUpAndInsert() {
  const testEmail = `creator_${Date.now()}@eg-commerce.com`;
  const testPass = 'CreatorPass123!';

  console.log('Testing sign up with:', testEmail);
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPass,
    options: {
      data: {
        role: 'creator',
        name: 'Yasmin Creator'
      }
    }
  });

  console.log('SignUp result:', { userId: signUpData?.user?.id, error: signUpError?.message });

  if (signUpData?.user) {
    const { data: insertData, error: insertError } = await supabase
      .from('reels')
      .insert({
        creator_id: signUpData.user.id,
        video_url: '/images/reels/linen_abaya.mp4',
        caption: 'Authenticated Test Reel',
        status: 'active'
      })
      .select();
    console.log('Insert with signed up user:', { insertData, error: insertError?.message });
  }
}

testSignUpAndInsert();
