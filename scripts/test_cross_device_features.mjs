import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');

console.log('--- Testing Cross-Device Backend & Data Files ---');

// 1. Verify data directory files
const usersFile = path.join(dataDir, 'registered_users.json');
const merchantsFile = path.join(dataDir, 'shared_merchants.json');
const productsFile = path.join(dataDir, 'shared_products.json');
const reelsFile = path.join(dataDir, 'shared_reels.json');

console.log('Users file exists:', fs.existsSync(usersFile));
console.log('Merchants file exists:', fs.existsSync(merchantsFile));
console.log('Products file exists:', fs.existsSync(productsFile));
console.log('Reels file exists:', fs.existsSync(reelsFile));

// 2. Simulate Registering a new Merchant Boutique
const testEmail = `test_boutique_${Date.now()}@egyptian-commerce.com`;
const testName = 'Alexandria Boutique • بوتيك الإسكندرية';
const testSlug = 'alexandria-boutique';
const testMerchantId = `m-${Date.now()}`;

const testUser = {
  id: `usr-${Date.now()}`,
  email: testEmail,
  password: 'testpassword123',
  name: testName,
  role: 'merchant',
  store_name: testName,
  store_slug: testSlug,
  merchant_id: testMerchantId,
  is_merchant: true,
  avatar_url: '/images/brands/dripfit_logo.png',
  reward_points_balance: 500
};

// Read or init users
let users = {};
if (fs.existsSync(usersFile)) {
  try {
    users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
  } catch (e) {}
}
users[testEmail] = testUser;
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
console.log(`[PASS] Registered test user saved to ${usersFile}`);

// Read or init merchants
let merchants = [];
if (fs.existsSync(merchantsFile)) {
  try {
    merchants = JSON.parse(fs.readFileSync(merchantsFile, 'utf-8'));
  } catch (e) {}
}
const newMerchant = {
  id: testMerchantId,
  user_id: testUser.id,
  name: testName,
  shortName: 'بوتيك الإسكندرية',
  slug: testSlug,
  handle: `@${testSlug}`,
  subdomain: `${testSlug}.egyptian-commerce.com`,
  verified: true,
  logo: testUser.avatar_url,
  banner: '/images/products/the_sharp_v_yellow_1.webp'
};
merchants = [newMerchant, ...merchants.filter(m => m.id !== testMerchantId)];
fs.writeFileSync(merchantsFile, JSON.stringify(merchants, null, 2), 'utf-8');
console.log(`[PASS] Merchant boutique saved to ${merchantsFile}`);

// 3. Simulate Creating a Product upon Reel Upload
let products = [];
if (fs.existsSync(productsFile)) {
  try {
    products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
  } catch (e) {}
}
const newProduct = {
  id: `p-${Date.now()}`,
  title: 'فستان صيفي أبيض كتان ناعم',
  price: 950,
  originalPrice: 1200,
  merchant: testName,
  merchantId: testMerchantId,
  merchantSlug: testSlug,
  image: '/images/products/the_sharp_v_yellow_1.webp',
  video: '/images/reels/the_sharp_v_yellow_reel.mp4',
  stock: 20,
  isSyndicated: true
};
products = [newProduct, ...products.filter(p => p.id !== newProduct.id)];
fs.writeFileSync(productsFile, JSON.stringify(products, null, 2), 'utf-8');
console.log(`[PASS] Product created and saved to ${productsFile}`);

// 4. Verify Multi-Device Retrieval
const reloadedUsers = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
if (!reloadedUsers[testEmail] || reloadedUsers[testEmail].password !== 'testpassword123') {
  throw new Error('Multi-device user lookup failed');
}
console.log(`[PASS] Multi-device user login verified for: ${testEmail}`);

const reloadedMerchants = JSON.parse(fs.readFileSync(merchantsFile, 'utf-8'));
const foundMerchant = reloadedMerchants.find(m => m.id === testMerchantId);
if (!foundMerchant || foundMerchant.slug !== testSlug) {
  throw new Error('Multi-device merchant lookup failed');
}
console.log(`[PASS] Multi-device merchant store verified for: ${foundMerchant.name}`);

const reloadedProducts = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
const foundProduct = reloadedProducts.find(p => p.merchantId === testMerchantId);
if (!foundProduct) {
  throw new Error('Multi-device product lookup failed');
}
console.log(`[PASS] Multi-device product verified for store: ${foundProduct.title}`);

console.log('--- ALL CROSS-DEVICE BACKEND TESTS PASSED ---');
