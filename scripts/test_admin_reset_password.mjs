// Test Admin Reset Password
// Run with: node scripts/test_admin_reset_password.mjs

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

console.log('--- TEST 1: Register User & Verify Initial Login ---');
const userEmail = `storeowner_${Date.now()}@test.com`;
const initialPass = 'OldPass_123456';
const newAdminPass = 'NewAdminPass_789!';

await AuthService.signUpWithEmail(userEmail, initialPass, 'merchant', 'Test Boutique Store');
console.log('User registered with email:', userEmail);

// Test login with initial password
const login1 = await AuthService.signInWithEmail(userEmail, initialPass);
console.log('Initial login succeeded with original password for:', login1.user.email);

// Sign out
await AuthService.signOut();

console.log('\n--- TEST 2: Admin Resets Password to New Value ---');
// Call AuthService.updateUserPassword (used by AdminService.setUserPassword)
const updateResult = AuthService.updateUserPassword(userEmail, newAdminPass);
console.log('updateUserPassword returned:', updateResult);

if (!updateResult) {
  throw new Error('Failed to update user password in registry!');
}

console.log('\n--- TEST 3: Attempt Sign In with OLD Password (Must Fail) ---');
let oldLoginRejected = false;
try {
  await AuthService.signInWithEmail(userEmail, initialPass);
} catch (err) {
  oldLoginRejected = true;
  console.log('Correctly rejected old password with message:', err.message);
}

if (!oldLoginRejected) {
  throw new Error('FAILED: Old password was accepted after reset!');
}

console.log('\n--- TEST 4: Attempt Sign In with NEW Admin-Set Password (Must Succeed) ---');
const login2 = await AuthService.signInWithEmail(userEmail, newAdminPass);
console.log('Login succeeded with NEW password!');
console.log('Logged in user:', login2.user.email, 'Role:', login2.user.role);

if (!login2.user || login2.user.email !== userEmail) {
  throw new Error('FAILED: Could not sign in with new password!');
}

console.log('\n✅ ALL ADMIN PASSWORD RESET TESTS PASSED WITH 100% SUCCESS!');
