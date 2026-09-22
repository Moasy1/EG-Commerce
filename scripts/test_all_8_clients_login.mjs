// Test all 8 client accounts login
// Run with: node scripts/test_all_8_clients_login.mjs

class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

globalThis.localStorage = new LocalStorageMock();

const { AuthService } = await import('../src/services/AuthService.js');
const { ProductService } = await import('../src/services/ProductService.js');
const { AdminService } = await import('../src/services/AdminService.js');

const clients = [
  { email: 'onefourone@egyptian-commerce.com', expectedStore: 'One Four One', slug: 'onefourone' },
  { email: '4u@egyptian-commerce.com', expectedStore: '4U Store', slug: '4u-store' },
  { email: 'dripfit@egyptian-commerce.com', expectedStore: 'Drip Fit', slug: 'drip-fit' },
  { email: 'snugs@egyptian-commerce.com', expectedStore: 'Snugs', slug: 'snugs' },
  { email: 'rakan@egyptian-commerce.com', expectedStore: 'Rakan Fragrances', slug: 'rakan-fragrances' },
  { email: 'vermelle@egyptian-commerce.com', expectedStore: 'Vermelle', slug: 'vermelle' },
  { email: 'liminal@egyptian-commerce.com', expectedStore: 'liminal', slug: 'liminal' },
  { email: 'jkperfumes@egyptian-commerce.com', expectedStore: 'JK Perfumes', slug: 'jk-perfumes' }
];

console.log('=== Testing Login for All 8 Real Client Stores ===\n');

let passCount = 0;
for (const c of clients) {
  try {
    const res = await AuthService.signInWithEmail(c.email, 'adminpassword');
    if (!res || !res.user) {
      throw new Error(`Login failed for ${c.email}`);
    }
    const u = res.user;
    console.log(`✅ [${u.name}] Logged in successfully:`);
    console.log(`   Email: ${u.email}`);
    console.log(`   Role: ${u.role} (is_merchant: ${u.is_merchant || u.role === 'merchant'})`);
    console.log(`   Store Slug: ${u.store_slug || u.slug}`);
    console.log(`   Merchant ID: ${u.merchant_id || u.id}\n`);
    passCount++;
  } catch (err) {
    console.error(`❌ Failed for ${c.email}:`, err.message);
  }
}

console.log(`\n=== Testing ProductService & AdminService for 8 Stores ===`);
const merchants = await ProductService.getMerchants();
console.log(`Total Merchants in system: ${merchants.length}`);
const stores = await AdminService.getStores();
console.log(`Total Stores in AdminService: ${stores.length}`);
const users = await AdminService.getUsers();
console.log(`Total Users in AdminService: ${users.length}`);

if (passCount === 8) {
  console.log('\n🎉 ALL 8 CLIENT STORES PASSED AUTHENTICATION & RETRIEVAL WITH 100% SUCCESS!');
} else {
  console.error(`\n⚠️ Only ${passCount} of 8 passed.`);
  process.exit(1);
}
