// Verification test for Multi-role Notification Center
import { NotificationService, ROLE_NOTIFICATIONS } from '../src/services/NotificationService.js';

// Polyfill localStorage
if (typeof localStorage === 'undefined' || localStorage === null) {
  let store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
}

async function runNotificationCenterTests() {
  console.log('🔔 Starting Multi-Role Notification Center Verification...\n');

  const roles = ['buyer', 'merchant', 'creator', 'admin', 'guest'];

  for (const role of roles) {
    console.log(`--- Testing Role: [${role.toUpperCase()}] ---`);
    const notifications = NotificationService.getNotifications(role, `test-${role}`);
    console.log(`✅ Loaded ${notifications.length} notifications for ${role}`);

    const unread = NotificationService.getUnreadCount(role, `test-${role}`);
    console.log(`✅ Unread count: ${unread}`);

    if (notifications.length === 0) {
      throw new Error(`Expected notifications for role ${role} but got 0!`);
    }

    // Check that notifications have role-specific content
    const sample = notifications[0];
    console.log(`   Sample: [${sample.category}] ${sample.title} -> Action: ${sample.actionTab}`);

    if (role === 'buyer' && !notifications.some(n => n.category === 'orders' || n.category === 'promos')) {
      throw new Error('Buyer notifications missing orders or promos!');
    }
    if (role === 'merchant' && !notifications.some(n => n.category === 'orders' || n.category === 'ugc')) {
      throw new Error('Merchant notifications missing orders or UGC campaigns!');
    }
    if (role === 'creator' && !notifications.some(n => n.category === 'campaigns' || n.category === 'earnings')) {
      throw new Error('Creator notifications missing campaigns or earnings!');
    }
    if (role === 'admin' && !notifications.some(n => n.category === 'merchants' || n.category === 'finance')) {
      throw new Error('Admin notifications missing merchants or finance!');
    }

    // Test mark as read
    const firstUnread = notifications.find(n => !n.read);
    if (firstUnread) {
      const updated = NotificationService.markAsRead(firstUnread.id, role, `test-${role}`);
      const marked = updated.find(n => n.id === firstUnread.id);
      if (!marked.read) throw new Error(`Failed to mark notification ${firstUnread.id} as read!`);
      console.log(`✅ Successfully marked notification ${firstUnread.id} as read`);
    }

    // Test mark all as read
    const allRead = NotificationService.markAllAsRead(role, `test-${role}`);
    if (allRead.some(n => !n.read)) throw new Error(`markAllAsRead failed for ${role}!`);
    console.log(`✅ All notifications marked as read. New unread count: ${NotificationService.getUnreadCount(role, `test-${role}`)}`);
  }

  console.log('\n🎉 ALL MULTI-ROLE NOTIFICATION TESTS PASSED PERFECTLY!\n');
}

runNotificationCenterTests().catch(err => {
  console.error('❌ Notification test failed:', err);
  process.exit(1);
});
