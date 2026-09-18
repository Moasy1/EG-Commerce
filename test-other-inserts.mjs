import { supabase } from './src/lib/supabase.js';

async function testOtherInserts() {
  // Test products
  const { data: pData, error: pError } = await supabase.from('products').insert({
    title: 'Test Product',
    slug: `test-${Date.now()}`,
    base_price: 100,
    merchant_id: 'm0000000-0000-0000-0000-000000000001'
  }).select();
  console.log('Product insert:', { pData: pData?.length, error: pError?.message });

  // Test ugc_campaigns
  const { data: cData, error: cError } = await supabase.from('ugc_campaigns').insert({
    title: 'Test Campaign',
    merchant_id: 'm0000000-0000-0000-0000-000000000001',
    status: 'active'
  }).select();
  console.log('Campaign insert:', { cData: cData?.length, error: cError?.message });

  // Test ugc_applications
  const { data: aData, error: aError } = await supabase.from('ugc_applications').insert({
    campaign_id: 'c0000000-0000-0000-0000-000000000001',
    creator_id: 'c0000000-0000-0000-0000-000000000001',
    status: 'applied'
  }).select();
  console.log('Application insert:', { aData: aData?.length, error: aError?.message });
}

testOtherInserts();
