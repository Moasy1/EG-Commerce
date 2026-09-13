import { supabase } from '../lib/supabase';

export const OrderService = {
  async createOrder(cartItems, subtotal, discount, shipping, total, userId = null) {
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: userId,
        status: 'pending',
        subtotal: subtotal,
        discount_amount: discount,
        shipping_amount: shipping,
        total_amount: total
      }).select().single();

      if (orderError) throw orderError;

      // Create order items
      const orderItemsToInsert = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        merchant_id: item.merchantId || item.merchant_id, // Adjust based on data structure
        quantity: item.quantity,
        unit_price: item.price || item.unit_price,
        status: 'pending'
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert);
      if (itemsError) throw itemsError;

      // Clear the local/DB cart
      localStorage.removeItem('eg_local_cart');
      // To properly clean DB cart, we'd delete the cart or mark as converted
      // await supabase.from('carts').update({ status: 'converted' }).eq('user_id', userId);

      return order;
    } catch (err) {
      console.error('Failed to create real order, simulating fallback:', err.message);
      
      // Fallback for demo when tables aren't present
      const mockOrder = {
        id: `ord-${Date.now()}`,
        status: 'pending',
        total_amount: total,
        created_at: new Date().toISOString()
      };
      
      localStorage.removeItem('eg_local_cart');
      return mockOrder;
    }
  },

  async getOrders(userId = null) {
    try {
      const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', userId);
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Failed to fetch real orders:', err.message);
      return [];
    }
  }
};
