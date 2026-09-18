// Test script: Registration privilege preservation and role mapping
// Run with: node scripts/test_auth_registration_privileges.mjs

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

// Dynamically import AuthService
const { AuthService } = await import('../src/services/AuthService.js');

console.log('--- TEST 1: Register New Merchant Account ---');
const merchantEmail = `boutique_${Date.now()}@test.com`;
const merchantPass = 'MerchantSecret123!';
const merchantName = 'Nile Linen Boutique';

const regResult = await AuthService.signUpWithEmail(merchantEmail, merchantPass, 'merchant', merchantName);
console.log('Registration result user:', {
  email: regResult.user.email,
  role: regResult.user.role,
  merchant_id: regResult.user.merchant_id,
  is_merchant: regResult.user.is_merchant
});

if (regResult.user.role !== 'merchant') {
  throw new Error(`Expected role 'merchant', got '${regResult.user.role}'`);
}
if (!regResult.user.merchant_id) {
  throw new Error('Expected merchant_id to be generated');
}

console.log('\n--- TEST 2: Logout and Re-Login ---');
// Clear active session (simulate logout)
localStorage.removeItem('eg_active_session');
const noUser = await AuthService.getCurrentUser();
console.log('After logout, current user is:', noUser);

// Re-login with registered merchant credentials
const loginResult = await AuthService.signInWithEmail(merchantEmail, merchantPass);
console.log('Re-login result user:', {
  email: loginResult.user.email,
  role: loginResult.user.role,
  merchant_id: loginResult.user.merchant_id,
  is_merchant: loginResult.user.is_merchant
});

if (loginResult.user.role !== 'merchant') {
  throw new Error(`CRITICAL FAIL: Role reset to '${loginResult.user.role}' instead of 'merchant' upon re-login!`);
}
if (loginResult.user.merchant_id !== regResult.user.merchant_id) {
  throw new Error(`Merchant ID mismatch upon re-login: ${loginResult.user.merchant_id} vs ${regResult.user.merchant_id}`);
}

console.log('\n--- TEST 3: Register Creator Account & Re-Login ---');
const creatorEmail = `influencer_${Date.now()}@test.com`;
const creatorPass = 'CreatorSecret123!';
const creatorName = 'Laila Fashion';

const creatorReg = await AuthService.signUpWithEmail(creatorEmail, creatorPass, 'creator', creatorName);
console.log('Creator registered:', {
  email: creatorReg.user.email,
  role: creatorReg.user.role,
  creator_id: creatorReg.user.creator_id,
  is_creator: creatorReg.user.is_creator
});

if (creatorReg.user.role !== 'creator') {
  throw new Error(`Expected role 'creator', got '${creatorReg.user.role}'`);
}

// Re-login as creator
localStorage.removeItem('eg_active_session');
const creatorLogin = await AuthService.signInWithEmail(creatorEmail, creatorPass);
console.log('Creator re-login:', {
  email: creatorLogin.user.email,
  role: creatorLogin.user.role,
  creator_id: creatorLogin.user.creator_id
});

if (creatorLogin.user.role !== 'creator') {
  throw new Error(`CRITICAL FAIL: Creator role lost on login: '${creatorLogin.user.role}'`);
}

console.log('\n✅ ALL AUTHENTICATION AND ROLE PRIVILEGE TESTS PASSED SUCCESSFULLY!');
