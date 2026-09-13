import { supabase } from '../lib/supabase';

// Helper to get or create a guest cart ID in localStorage
function getGuestCartId() {
  let cartId = localStorage.getItem('eg_guest_cart_id');
  if (!cartId) {
    cartId = 'guest_' + Math.random().toString(36).substring(2);
    localStorage.setItem('eg_guest_cart_id', cartId);
  }
  return cartId;
}

export const CartService = {
  async getCartItems(userId = null) {
    // In production, we'd query by user_id or cart_id
    // For now, if no auth is set up, we rely on a local mock or a guest cart mechanism
    try {
      const { data, error } = await supabase.from('cart_items').select('*, products(*)');
      if (error) {
        console.warn('Cart items fetch failed (table might not exist):', error.message);
        return this.getLocalCart();
      }
      return data || [];
    } catch (err) {
      console.warn('Error fetching cart:', err.message);
      return this.getLocalCart();
    }
  },

  async addToCart(productId, merchantId, price, quantity = 1, size = 'M', color = 'Default') {
    try {
      const { data: existingCart } = await supabase.from('carts').select('id').limit(1).single();
      
      let cartId;
      if (!existingCart) {
        // Create new cart
        const { data: newCart, error: cartError } = await supabase.from('carts').insert({ status: 'active' }).select().single();
        if (cartError) throw cartError;
        cartId = newCart.id;
      } else {
        cartId = existingCart.id;
      }

      // Check if item exists
      const { data: existingItem } = await supabase.from('cart_items')
        .select('*')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity
        const { data, error } = await supabase.from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select();
        if (error) throw error;
        return data;
      } else {
        // Insert new item
        const { data, error } = await supabase.from('cart_items').insert({
          cart_id: cartId,
          product_id: productId,
          merchant_id: merchantId,
          quantity: quantity,
          unit_price: price
        }).select();
        if (error) throw error;
        return data;
      }
    } catch (err) {
      console.warn('DB Add to Cart failed, using local storage:', err.message);
      return this.addToLocalCart(productId, merchantId, price, quantity, size, color);
    }
  },

  // Fallback local storage methods
  getLocalCart() {
    const cart = localStorage.getItem('eg_local_cart');
    return cart ? JSON.parse(cart) : [];
  },

  addToLocalCart(productId, merchantId, price, quantity, size, color) {
    const cart = this.getLocalCart();
    const existingIndex = cart.findIndex(item => item.productId === productId && item.size === size);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: `local-${Date.now()}`,
        productId,
        merchantId,
        price,
        quantity,
        size,
        color
      });
    }
    localStorage.setItem('eg_local_cart', JSON.stringify(cart));
    return cart;
  },

  removeFromLocalCart(cartItemId) {
    let cart = this.getLocalCart();
    cart = cart.filter(item => item.id !== cartItemId);
    localStorage.setItem('eg_local_cart', JSON.stringify(cart));
    return cart;
  },

  updateLocalQuantity(cartItemId, delta) {
    let cart = this.getLocalCart();
    cart = cart.map(item => {
      if (item.id === cartItemId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    localStorage.setItem('eg_local_cart', JSON.stringify(cart));
    return cart;
  }
};
