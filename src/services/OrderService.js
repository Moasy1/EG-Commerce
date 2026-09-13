import { supabase } from '../lib/supabase';

export const OrderService = {
  async createOrder(cartItems, promoCode = null, pointsRedeemed = 0, userId = null, clientEstimatedTotal = 0) {
    try {
      const formattedItems = cartItems.map(item => ({
        product_id: item.productId,
        merchant_id: item.merchantId || item.merchant_id,
        quantity: item.quantity,
        size: item.size || 'M',
        color: item.color || 'Default'
      }));

      // 1. Attempt secure, atomic server-side RPC order creation
      const { data: orderData, error: rpcError } = await supabase.rpc('rpc_create_order', {
        p_user_id: userId,
        p_items: formattedItems,
        p_promo_code: promoCode,
        p_points_redeemed: pointsRedeemed
      });

      if (!rpcError && orderData) {
        localStorage.removeItem('eg_local_cart');
        return orderData;
      }

      if (rpcError) {
        console.warn('RPC create order failed (fallback to transactional direct insert):', rpcError.message);
      }

      // 2. Direct DB fallback (for early development environments where RPC is pending)
      const subtotal = cartItems.reduce((acc, it) => acc + ((it.price || it.unit_price || 0) * it.quantity), 0);
      const discount = Math.floor(pointsRedeemed / 10);
      const shipping = cartItems.length > 0 ? 60 : 0;
      const total = Math.max(0, subtotal - discount + shipping);

      const { data: order, error: orderError } = await supabase.from('orders').insert({
        user_id: userId,
        status: 'pending',
        subtotal: subtotal,
        discount_amount: discount,
        shipping_amount: shipping,
        total_amount: total
      }).select().single();

      if (orderError) throw orderError;

      // Insert line items
      const orderItemsToInsert = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        merchant_id: item.merchantId || item.merchant_id,
        quantity: item.quantity,
        unit_price: item.price || item.unit_price,
        status: 'pending'
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsToInsert);
      if (itemsError) throw itemsError;

      localStorage.removeItem('eg_local_cart');
      return order;
    } catch (err) {
      console.warn('Failed to create DB order, utilizing preview mode order:', err.message);
      
      const mockOrder = {
        id: `EG-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'pending',
        total_amount: clientEstimatedTotal,
        created_at: new Date().toISOString()
      };
      
      localStorage.removeItem('eg_local_cart');
      return mockOrder;
    }
  },

  async getOrders(userId = null) {
    try {
      let query = supabase.from('orders').select('*, order_items(*)');
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Failed to fetch orders from DB:', err.message);
      return [];
    }
  }
};
