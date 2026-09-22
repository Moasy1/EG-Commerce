// Simulate window / localStorage in Node
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

// Mock legacy items in localStorage to test sanitization
localStorage.setItem('eg_local_cart', JSON.stringify([
  { id: 'cart-init-1', title: 'Citrine Yellow Oversized Blazer', price: 1850 },
  { id: 'cart-init-2', title: 'Sky Blue Linen Oversized Shirt', price: 980 }
]));

import { CartService } from '../src/services/CartService.js';

console.log('=== TEST 1: Sanitization of legacy mockups ===');
const cleanedCart = CartService.getLocalCart();
console.log('Cleaned cart length (should be 0):', cleanedCart.length);
if (cleanedCart.length !== 0) throw new Error('Failed: legacy mockups not cleaned!');

console.log('=== TEST 2: Adding a real product ===');
CartService.addToLocalCart(
  'prod-dripfit-1',
  'drip-fit',
  1200,
  1,
  'L',
  'Yellow',
  'The Sharp V Yellow',
  '/images/products/the_sharp_v_yellow_1.webp',
  'Drip Fit'
);
const afterAdd = CartService.getLocalCart();
console.log('Cart after adding real item:', afterAdd.length, 'item:', afterAdd[0].title);
if (afterAdd.length !== 1 || afterAdd[0].brand !== 'Drip Fit') throw new Error('Failed to add real product!');

console.log('=== TEST 3: Clearing cart ===');
CartService.clearLocalCart();
const emptyCart = CartService.getLocalCart();
console.log('Cart after clearing:', emptyCart);
if (emptyCart.length !== 0) throw new Error('Failed: Cart not empty after clear!');

console.log('✅ ALL CART TESTS PASSED PERFECTLY!');
