import { supabase } from './src/lib/supabase.js';

async function getRealMerchants() {
  const { data: mData, error: mError } = await supabase.from('merchants').select('*');
  console.log('Merchants in DB:', mData, mError);

  const { data: pData, error: pError } = await supabase.from('products').select('*');
  console.log('Products in DB:', pData, pError);

  const { data: profData, error: profError } = await supabase.from('profiles').select('*');
  console.log('Profiles in DB:', profData, profError);
}

getRealMerchants();
