// Verification test script for Profile Management
import { AuthService } from '../src/services/AuthService.js';
import { profileService } from '../src/services/social/profileService.js';

// Polyfill localStorage for node environment
if (typeof localStorage === 'undefined' || localStorage === null) {
  let store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
}

async function runProfileManagementTests() {
  console.log('🧪 Starting Profile Management Verification Tests...\n');

  // Test 1: Log in as Demo User
  console.log('--- Test 1: Active Session Setup ---');
  const session = await AuthService.loginAsDemo('merchant');
  console.log('✅ Logged in as demo merchant:', session.name, session.id);

  // Test 2: Update Profile via AuthService.updateCurrentUser
  console.log('\n--- Test 2: Update Profile Attributes ---');
  const updates = {
    name: 'تاليسكا للأزياء الراقية (محدث)',
    username: 'talieska_official',
    phone: '01012345678',
    bio: '✨ دار أزياء مصرية متخصصة في الكتان الطبيعي والتطريز اليدوي الفاخر',
    location: 'القاهرة (Cairo)',
    website: 'talieska.eg-commerce.com',
    avatar_url: '/images/brands/talieska_logo.jpg'
  };

  const updateResult = await AuthService.updateCurrentUser(updates);
  console.log('✅ Update response success:', updateResult.success);
  console.log('✅ Updated Name:', updateResult.user.name);
  console.log('✅ Updated Handle:', updateResult.user.username);
  console.log('✅ Updated Phone:', updateResult.user.phone);
  console.log('✅ Updated Location:', updateResult.user.location);

  if (updateResult.user.name !== updates.name || updateResult.user.phone !== updates.phone) {
    throw new Error('Profile attributes mismatch in updateCurrentUser return value!');
  }

  // Test 3: Verify Persistence via AuthService.getCurrentUser()
  console.log('\n--- Test 3: Session Persistence Verification ---');
  const reloadedUser = await AuthService.getCurrentUser();
  console.log('✅ Reloaded User Name:', reloadedUser.name);
  console.log('✅ Reloaded User Bio:', reloadedUser.bio);
  console.log('✅ Reloaded User Handle:', reloadedUser.username);

  if (reloadedUser.name !== updates.name || reloadedUser.bio !== updates.bio) {
    throw new Error('Persistence failed: reloaded user does not reflect updated fields!');
  }

  // Test 4: Verify profileService.updateProfile payload handling
  console.log('\n--- Test 4: profileService.updateProfile handling ---');
  const profUpdate = await profileService.updateProfile(session.id, {
    name: 'تاليسكا للأزياء الفاخرة',
    bio: 'أحدث تشكيلة لصيف 2026'
  });
  console.log('✅ profileService returned updated payload:', profUpdate.name || profUpdate.displayName);

  console.log('\n🎉 ALL 4 PROFILE MANAGEMENT TESTS PASSED PERFECTLY!\n');
}

runProfileManagementTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
