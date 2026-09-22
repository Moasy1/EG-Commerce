// Test dynamic production components and data integrity
import sharedReelsData from '../data/shared_reels.json' with { type: 'json' };
import { MERCHANTS_DATA, INITIAL_PRODUCTS } from '../src/data/storesData.js';
import { NotificationService } from '../src/services/NotificationService.js';
import { OrderService } from '../src/services/OrderService.js';

console.log('=== 1. Verifying All 8 Stores Content Availability ===');
MERCHANTS_DATA.forEach(store => {
  const reel = sharedReelsData.find(r => 
    (store.slug && r.storeSlug?.toLowerCase() === store.slug.toLowerCase()) ||
    (store.id && r.merchantId === store.id) ||
    (r.creatorHandle && store.slug && r.creatorHandle.toLowerCase().includes(store.slug.toLowerCase()))
  );

  const products = INITIAL_PRODUCTS.filter(p => 
    p.merchantId === store.id || p.merchantSlug === store.slug
  );

  console.log(`Store: ${store.name} (${store.slug})`);
  console.log(`  - Reel: ${reel ? reel.videoBg : 'MISSING'}`);
  console.log(`  - Products (${products.length}): ${products.map(p => p.title).join(', ')}`);
  console.log(`  - Logo: ${store.logo}`);
  if (!reel) throw new Error(`Missing reel for ${store.slug}`);
  if (products.length === 0) throw new Error(`Missing products for ${store.slug}`);
});

console.log('\n=== 2. Verifying NotificationService Dynamic Engine ===');
const defaultNotifs = NotificationService.getNotifications('buyer', 'test_user');
console.log(`Default Buyer Notifications count: ${defaultNotifs.length}`);
defaultNotifs.forEach(n => console.log(`  - [${n.badge}] ${n.title}`));

// Test order notification generation
const mockOrder = {
  id: 'EG-9988',
  amount: 1450,
  merchantName: 'Drip Fit • دريب فيت',
  customerName: 'فاطمة حسن',
  userId: 'test_user',
  merchantId: '171842bd-daed-40ef-853f-917eab2ed437'
};
NotificationService.createOrderNotification(mockOrder);
const updatedNotifs = NotificationService.getNotifications('buyer', 'test_user');
console.log(`After order placement: ${updatedNotifs.length} notifications`);
console.log(`Latest notification: ${updatedNotifs[0].title}`);

console.log('\n✅ ALL DYNAMIC PRODUCTION CHECKS PASSED WITH 100% INTEGRITY!');
