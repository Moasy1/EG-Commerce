import { supabase } from '../lib/supabase';
import { INITIAL_PRODUCTS, MERCHANTS_DATA } from '../context/AppContext';

export const ProductService = {
  async getProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.warn('Supabase fetch failed (table might not exist yet):', error.message);
        return INITIAL_PRODUCTS;
      }
      if (!data || data.length === 0) {
        // Fallback to mock data if empty
        return INITIAL_PRODUCTS;
      }
      
      // Map DB products to frontend format
      return data.map(dbProduct => ({
        id: dbProduct.id,
        sku: dbProduct.slug, // Temporarily use slug for sku
        title: dbProduct.title,
        merchant: dbProduct.merchant_id, // We'll need to join or map this properly later
        merchantId: dbProduct.merchant_id,
        merchantVerified: true,
        price: Number(dbProduct.base_price),
        originalPrice: dbProduct.sale_price ? Number(dbProduct.base_price) : undefined, // Quick hack for mapping
        rating: 5.0, // Mock for now
        reviewsCount: 0,
        stock: dbProduct.stock_quantity,
        isSyndicated: true,
        image: dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0] : '/images/reels/reel_2.jpg',
        video: null,
        pointsEarned: Math.floor(Number(dbProduct.base_price) * 0.1),
        category: dbProduct.category_id || 'General',
        description: dbProduct.description,
        sizes: ['One Size'], // Mock for now
        colors: ['Default'] // Mock for now
      }));
    } catch (err) {
      console.warn('Error fetching products:', err.message);
      return INITIAL_PRODUCTS;
    }
  },

  async getMerchants() {
    try {
      const { data, error } = await supabase.from('merchants').select('*');
      if (error) {
        console.warn('Supabase fetch failed (table might not exist yet):', error.message);
        return MERCHANTS_DATA;
      }
      if (!data || data.length === 0) {
        return MERCHANTS_DATA;
      }
      
      // For now, if we have DB merchants, we can use them, but we need the rich structure for UI
      // To prevent breaking UI, we will merge or fallback to mock data until seeded properly
      return MERCHANTS_DATA; 
    } catch (err) {
      console.warn('Error fetching merchants:', err.message);
      return MERCHANTS_DATA;
    }
  }
};
