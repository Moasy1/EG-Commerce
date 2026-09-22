import { MERCHANTS_DATA } from '../src/data/storesData.js';

console.log('--- Testing Store Routing and Merchant Resolution ---');

function parseRouteFromLocation(pathname, search, isSubdomain) {
  const cleanPath = (pathname || '/').replace(/\/+$/, '') || '/';
  if (cleanPath === '/storefront' || cleanPath.startsWith('/store')) {
    const rawSlug = cleanPath.startsWith('/store/') ? cleanPath.replace('/store/', '').split('/')[0].split('?')[0].trim() : 'drip-fit';
    const slug = rawSlug || 'drip-fit';
    return { tab: 'storefront', storeSlug: slug };
  }
  return { tab: isSubdomain ? 'storefront' : 'reels' };
}

// 1. Test URL parsing for all real brand stores
const testPaths = [
  '/store/onefourone',
  '/store/4u-store',
  '/store/drip-fit',
  '/store/snugs',
  '/store/rakan-fragrances',
  '/store/vermelle',
  '/store/liminal',
  '/store/jk-perfumes',
  '/store/onefourone/'
];

for (const p of testPaths) {
  const route = parseRouteFromLocation(p, '', false);
  if (route.tab !== 'storefront') {
    throw new Error(`Expected tab storefront for ${p}, got ${route.tab}`);
  }
  const cleanSlug = route.storeSlug.toLowerCase().trim();
  const matched = MERCHANTS_DATA.find(m => 
    (m.slug && m.slug.toLowerCase() === cleanSlug) ||
    (m.id && m.id.toLowerCase() === cleanSlug) ||
    (m.shortName && m.shortName.toLowerCase() === cleanSlug)
  );
  if (!matched) {
    throw new Error(`Failed to match merchant for path ${p}, parsed slug: ${route.storeSlug}`);
  }
  console.log(`[PASS] ${p} -> matched store: "${matched.name}" (ID: ${matched.id}, slug: ${matched.slug})`);
}

// 2. Test OneFourOne specifically
const ofoRoute = parseRouteFromLocation('/store/onefourone', '', false);
const ofoMerchant = MERCHANTS_DATA.find(m => m.slug.toLowerCase() === ofoRoute.storeSlug.toLowerCase());
if (ofoMerchant.slug !== 'onefourone' || !ofoMerchant.name.includes('One Four One')) {
  throw new Error('OneFourOne resolution check failed');
}
console.log(`[PASS] Verified One Four One branding: Name="${ofoMerchant.name}", Promo="${ofoMerchant.promoCode}", Banner="${ofoMerchant.banner}"`);

console.log('--- ALL STORE ROUTING TESTS PASSED ---');
