import { supabase } from '../lib/supabase';

export const MerchantService = {
  async getDashboardStats(merchantId) {
    // In a real app this would query orders, products, and analytics tables
    // For this prototype, we'll try to count real DB records where possible, fallback to mocks
    try {
      if (!merchantId) throw new Error('No merchant ID provided');
      
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('merchant_id', merchantId);

      const { count: orderCount } = await supabase
        .from('order_items')
        .select('*', { count: 'exact', head: true })
        .eq('merchant_id', merchantId);

      // We'll mock the revenue calculation since we don't have a reliable history in this seed
      return {
        revenue: (orderCount || 5) * 1450,
        orders: orderCount || 12,
        productCount: productCount || 3,
        reach: 24800,
        engagement: 4.8
      };
    } catch (err) {
      console.warn('DB Merchant stats fetch failed, using mock:', err.message);
      return {
        revenue: 45600,
        orders: 32,
        productCount: 15,
        reach: 24800,
        engagement: 4.8
      };
    }
  }
};
