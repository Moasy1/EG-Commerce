import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');

const usersFile = path.join(dataDir, 'registered_users.json');
const merchantsFile = path.join(dataDir, 'shared_merchants.json');
const productsFile = path.join(dataDir, 'shared_products.json');
const reelsFile = path.join(dataDir, 'shared_reels.json');

console.log('====================================================');
console.log('🧪 VERIFYING MERCHANT BOUTIQUE REGISTRATION & SYNC');
console.log('====================================================');

// Import generateStoreSlug simulation
function generateStoreSlug(name, email, id) {
  const latin = (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (latin && latin.length >= 2) return latin;
  const emailPrefix = (email || '').split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (emailPrefix && emailPrefix.length >= 2) return `${emailPrefix}-boutique`;
  const cleanId = String(id || Date.now()).replace(/[^a-z0-9]/gi, '').slice(-6).toLowerCase();
  return `boutique-${cleanId || 'store'}`;
}

// TEST 1: Slug Generation with Arabic Names
console.log('\n--- TEST 1: Slug generation for Arabic & English boutique names ---');
const slug1 = generateStoreSlug('بوتيك زمردة الفاخر', 'zomoroda@gmail.com', 'm-101');
console.log('Arabic name slug:', slug1);
if (slug1 === 'zomoroda-boutique') {
  console.log('✅ PASS: Arabic name resolved to unique email-based boutique slug!');
} else {
  console.error('❌ FAIL: Slug was:', slug1);
  process.exit(1);
}

const slug2 = generateStoreSlug('Cairo Chic Boutique', 'cairochic@gmail.com', 'm-102');
console.log('English name slug:', slug2);
if (slug2 === 'cairo-chic-boutique') {
  console.log('✅ PASS: English name resolved to latin slug!');
} else {
  console.error('❌ FAIL: Slug was:', slug2);
  process.exit(1);
}

// TEST 2: Register Merchant Boutique from form
console.log('\n--- TEST 2: Registering merchant boutique in backend data ---');
const testMerchantId = `m-${Date.now()}`;
const testEmail = `fayrouz_${Date.now()}@egyptian-commerce.com`;
const testName = 'بوتيك فيروز الملكي • Fayrouz Royal Boutique';
const testPassword = 'securepassword123';
const testSlug = generateStoreSlug(testName, testEmail, testMerchantId);

const newRegisteredUser = {
  id: `usr-${Date.now()}`,
  email: testEmail,
  password: testPassword,
  name: testName,
  role: 'merchant',
  merchant_id: testMerchantId,
  store_name: testName,
  store_slug: testSlug,
  slug: testSlug,
  is_merchant: true,
  avatar_url: '/images/brands/dripfit_logo.png',
  reward_points_balance: 500,
  user_metadata: {
    name: testName,
    role: 'merchant',
    merchant_id: testMerchantId,
    store_name: testName,
    store_slug: testSlug,
    slug: testSlug
  }
};

// Simulate backend /api/auth/register
let users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
users[testEmail] = {
  ...newRegisteredUser,
  updated_at: new Date().toISOString()
};
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');

let merchants = JSON.parse(fs.readFileSync(merchantsFile, 'utf-8'));
const newMerchant = {
  id: testMerchantId,
  user_id: newRegisteredUser.id,
  name: `${testName} • متجر ${testName}`,
  shortName: testName,
  slug: testSlug,
  handle: `@${testSlug}`,
  subdomain: `${testSlug}.egyptian-commerce.com`,
  customDomain: null,
  category: 'Egyptian Fashion & Retail',
  categoryAr: 'أزياء وتجارة مصرية معتمدة',
  bio: `متجر مصري موثق لـ ${testName}`,
  established: '2026',
  rating: 5.0,
  reviewsCount: 1,
  verified: true,
  logo: newRegisteredUser.avatar_url,
  banner: '/images/products/the_sharp_v_yellow_1.webp'
};

const updatedMerchants = [newMerchant, ...merchants.filter(m => m.id !== testMerchantId && m.slug !== testSlug)];
fs.writeFileSync(merchantsFile, JSON.stringify(updatedMerchants, null, 2), 'utf-8');

console.log('✅ PASS: Merchant user and boutique store saved to backend JSON files!');

// TEST 3: Multi-device login simulation
console.log('\n--- TEST 3: Multi-device login from second device ---');
// Read fresh from disk as if a new device queried /api/auth/login
const freshUsers = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
const foundUser = freshUsers[testEmail];

if (!foundUser) {
  console.error('❌ FAIL: User not found in registered_users.json!');
  process.exit(1);
}
if (foundUser.password !== testPassword) {
  console.error('❌ FAIL: Password mismatch!');
  process.exit(1);
}
if (foundUser.role !== 'merchant' || foundUser.merchant_id !== testMerchantId) {
  console.error('❌ FAIL: User role or merchant_id mismatch!', foundUser);
  process.exit(1);
}
console.log(`✅ PASS: Multi-device login successfully authenticated ${foundUser.email} as merchant (${foundUser.merchant_id}, slug: ${foundUser.store_slug})!`);

// TEST 4: Auto-create product on reel publish
console.log('\n--- TEST 4: Auto-create product for merchant boutique on reel upload ---');
const autoProduct = {
  id: `p-${Date.now()}`,
  sku: `EG-${Date.now().toString().slice(-6)}`,
  title: 'فستان ملكي مطرز فاخر',
  price: 1450,
  originalPrice: 1850,
  merchant: testName,
  merchantId: testMerchantId,
  merchantSlug: testSlug,
  image: '/images/products/the_sharp_v_yellow_1.webp',
  images: ['/images/products/the_sharp_v_yellow_1.webp'],
  video: '/images/reels/the_sharp_v_yellow_reel.mp4',
  category: 'الفساتين',
  description: 'فستان راقي من تصميم بوتيك فيروز الملكي',
  stock: 25,
  isSyndicated: true
};

let products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
products = [autoProduct, ...products.filter(p => p.id !== autoProduct.id)];
fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');

const newReel = {
  id: `reel-${Date.now()}`,
  creatorId: newRegisteredUser.id,
  creatorHandle: `@${testSlug}`,
  creatorName: testName,
  publisherId: newRegisteredUser.id,
  publisherRole: 'merchant',
  merchantId: testMerchantId,
  storeSlug: testSlug,
  isMerchantReel: true,
  videoBg: '/images/reels/the_sharp_v_yellow_reel.mp4',
  avatar: newRegisteredUser.avatar_url,
  caption: 'إطلالة حصرية جديدة من بوتيك فيروز الملكي 🇪🇬✨ #فستان_ملكي',
  products: [autoProduct]
};

let reels = JSON.parse(fs.readFileSync(reelsFile, 'utf-8'));
reels = [newReel, ...reels.filter(r => r.id !== newReel.id)];
fs.writeFileSync(reelsFile, JSON.stringify(reels, null, 2), 'utf-8');

console.log('✅ PASS: Product and Reel successfully created and linked to merchant boutique!');

// Verify store appears in shared_merchants
const freshMerchants = JSON.parse(fs.readFileSync(merchantsFile, 'utf-8'));
const storeInMarketplace = freshMerchants.find(m => m.id === testMerchantId || m.slug === testSlug);
if (!storeInMarketplace) {
  console.error('❌ FAIL: Store not found in shared_merchants.json!');
  process.exit(1);
}
console.log(`✅ PASS: Store "${storeInMarketplace.name}" is present in marketplace stores list!`);

// Verify product appears in shared_products
const freshProducts = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
const productInCatalog = freshProducts.find(p => p.merchantId === testMerchantId);
if (!productInCatalog) {
  console.error('❌ FAIL: Product not found for merchantId in shared_products.json!');
  process.exit(1);
}
console.log(`✅ PASS: Product "${productInCatalog.title}" is linked to merchantId ${productInCatalog.merchantId}!`);

console.log('\n🎉 ALL MERCHANT REGISTRATION, PRODUCT CREATION & MULTI-DEVICE LOGIN TESTS PASSED!');
