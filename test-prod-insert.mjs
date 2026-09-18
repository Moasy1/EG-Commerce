import { supabase } from './src/lib/supabase.js';

async function testProductInsert() {
  const { data, error } = await supabase.from('products').insert({
    title: 'Test Linen Shirt',
    slug: `test-shirt-${Date.now()}`,
    base_price: 900,
    merchant_id: 'd0000000-0000-0000-0000-000000000001',
    status: 'active'
  }).select();

  console.log('Product Insert Result:', { data, error: error?.message });
}

testProductInsert();
