// Simulate window / localStorage in Node
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};
global.sessionStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

import { OrderService, INITIAL_ORDERS } from '../src/services/OrderService.js';

console.log('=== TEST 1: Check initial orders are empty (no mockups) ===');
console.log('OrderService INITIAL_ORDERS length:', INITIAL_ORDERS.length);
if (INITIAL_ORDERS.length !== 0) {
  throw new Error('Initial orders still contain mock data!');
}

console.log('=== TEST 2: Create a real production order ===');
const created = await OrderService.createOrder({
  cartItems: [
    {
      id: 'item-1',
      productId: 'prod-onefourone-1',
      merchantId: 'onefourone',
      title: 'One Four One Graphic Tee',
      price: 850,
      quantity: 2,
      size: 'L',
      color: 'White',
      image: '/images/products/onefourone_summer_tee.webp'
    }
  ],
  subtotal: 1700,
  shipping: 60,
  discount: 0,
  total: 1760,
  customerName: 'محمود عبد الرحمن',
  phone: '+20 100 123 4567',
  address: 'الدقي، الجيزة، شارع مصدق عمارة 8',
  paymentMethod: 'instapay'
});

const order = Array.isArray(created) ? created[0] : created;
console.log('Created order ID:', order.id);
console.log('Merchant:', order.merchantName);
console.log('Tracking Number:', order.trackingNumber);
console.log('Delivery OTP:', order.deliveryOtp);
console.log('Customer Phone:', order.phone);
console.log('Address:', order.address);

if (!order.trackingNumber || !order.trackingNumber.startsWith('BST-')) {
  throw new Error('Invalid Bosta tracking number!');
}
if (!order.deliveryOtp || order.deliveryOtp.length !== 4) {
  throw new Error('Invalid delivery OTP!');
}

console.log('=== TEST 3: Track order by ID and by Tracking Number ===');
const trackedById = await OrderService.trackOrder(order.id);
console.log('Track by ID matched:', trackedById?.id === order.id);

const trackedByBsta = await OrderService.trackOrder(order.trackingNumber);
console.log('Track by Bosta waybill matched:', trackedByBsta?.id === order.id);

const trackedByPhone = await OrderService.trackOrder('01001234567');
console.log('Track by phone matched:', trackedByPhone?.id === order.id);

if (!trackedById || !trackedByBsta) {
  throw new Error('Order tracking lookup failed!');
}

console.log('✅ ALL ORDER TRACKING TESTS PASSED PERFECTLY!');
