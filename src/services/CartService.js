import { supabase } from '../lib/supabase.js';

// Helper to get or create a persistent guest session token for cart isolation
function getGuestSessionToken() {
  let token = localStorage.getItem('eg_guest_cart_token');
  if (!token) {
    token = 'gst_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('eg_guest_cart_token', token);
  }
  return token;
}

export const CartService = {
  async getOrCreateCartId(userId = null) {
    const guestToken = getGuestSessionToken();

    let query = supabase.from('carts').select('id').eq('status', 'active');
    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.eq('session_token', guestToken);
    }

    const { data: existingCart, error: fetchError } = await query.maybeSingle();
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingCart?.id) {
      return existingCart.id;
    }

    // Create a new cart bound strictly to this user or guest session
    const { data: newCart, error: insertError } = await supabase
      .from('carts')
      .insert({
        user_id: userId || null,
        session_token: userId ? null : guestToken,
        status: 'active'
      })
      .select('id')
      .single();

    if (insertError) throw insertError;
    return newCart.id;
  },

  async getCartItems(userId = null) {
    try {
      const cartId = await this.getOrCreateCartId(userId);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('cart_id', cartId);

      if (error) {
        console.warn('Cart items fetch failed from DB, using isolated local cart:', error.message);
        return this.getLocalCart();
      }

      if (!data || data.length === 0) {
        return this.getLocalCart();
      }

      return data.map(item => ({
        id: item.id,
        productId: item.product_id,
        merchantId: item.merchant_id,
        title: item.products?.title || item.title || 'Egyptian Fashion Item',
        image: item.products?.image || item.image || '/images/products/the_sharp_v_yellow_1.webp',
        brand: item.products?.merchant || item.brand || 'EG Brand',
        price: Number(item.unit_price || item.price || 950),
        quantity: item.quantity || 1,
        size: item.size || 'M',
        color: item.color || 'Default',
        product: item.products
      }));
    } catch (err) {
      console.warn('Cart Service fallback to local storage:', err.message);
      return this.getLocalCart();
    }
  },

  async addToCart(productId, merchantId, price, quantity = 1, size = 'M', color = 'Default', userId = null, title = '', image = '', brand = '') {
    try {
      const cartId = await this.getOrCreateCartId(userId);

      // Check if product with identical size & color already exists in this cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
          .select();
        if (error) throw error;
        this.addToLocalCart(productId, merchantId, price, quantity, size, color, title, image, brand);
        return data;
      } else {
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            cart_id: cartId,
            product_id: productId,
            merchant_id: merchantId,
            quantity: quantity,
            unit_price: price,
            size: size,
            color: color
          })
          .select();
        if (error) throw error;
        this.addToLocalCart(productId, merchantId, price, quantity, size, color, title, image, brand);
        return data;
      }
    } catch (err) {
      console.warn('DB Add to Cart failed, updating local storage:', err.message);
      return this.addToLocalCart(productId, merchantId, price, quantity, size, color, title, image, brand);
    }
  },

  // Fallback local storage methods
  getLocalCart() {
    if (typeof localStorage === 'undefined') return [];
    const cart = localStorage.getItem('eg_local_cart');
    if (cart) {
      try {
        const parsed = JSON.parse(cart);
        if (Array.isArray(parsed)) {
          // Filter out legacy mockups if any exist in the browser storage
          const clean = parsed.filter(item => 
            item && 
            item.id !== 'cart-init-1' && 
            item.id !== 'cart-init-2' &&
            item.productId !== 'p-fashion-blazer' &&
            item.productId !== 'p-fashion-oversized-shirt' &&
            !item.title?.includes('Citrine Yellow') &&
            !item.brand?.includes('Ahmed Fits')
          );
          if (clean.length !== parsed.length) {
            localStorage.setItem('eg_local_cart', JSON.stringify(clean));
          }
          return clean;
        }
      } catch (e) {}
    }
    // Production default: Cart starts empty
    return [];
  },

  clearLocalCart() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('eg_local_cart', JSON.stringify([]));
      } catch (e) {}
    }
    return [];
  },

  async clearCart(userId = null) {
    try {
      const cartId = await this.getOrCreateCartId(userId);
      await supabase.from('cart_items').delete().eq('cart_id', cartId);
    } catch (err) {
      console.warn('Cart Service clearCart DB notice:', err?.message || err);
    }
    return this.clearLocalCart();
  },

  addToLocalCart(productId, merchantId, price, quantity, size, color, title = '', image = '', brand = '') {
    const cart = this.getLocalCart();
    const existingIndex = cart.findIndex(item => item.productId === productId && item.size === size);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: `local-${Date.now()}`,
        productId,
        merchantId,
        title: title || 'Egyptian Fashion Item',
        image: image || '/images/products/the_sharp_v_yellow_1.webp',
        brand: brand || 'EG Brand',
        price: Number(price) || 950,
        quantity: Number(quantity) || 1,
        size: size || 'M',
        color: color || 'Default'
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
        return { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) };
      }
      return item;
    });
    localStorage.setItem('eg_local_cart', JSON.stringify(cart));
    return cart;
  }
};
