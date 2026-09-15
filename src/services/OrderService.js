import { supabase } from '../lib/supabase';

const ORDERS_STORAGE_KEY = 'eg_platform_orders';

export const INITIAL_ORDERS = [
  {
    id: 'EG-8841',
    merchantId: 'm-01',
    merchantName: 'Talieska Studio • تاليسكا ستوديو',
    customerName: 'سلمى الأحمدي (Salma El-Ahmady)',
    phone: '+20 102 345 6789',
    address: 'المعادي، القاهرة - شارع 9، عمارة 14',
    productTitle: 'عباية كتان مغسول فاخرة • M',
    items: [
      {
        productId: 'p-linen-abaya-01',
        title: 'عباية كتان مغسول فاخرة',
        price: 1450,
        quantity: 1,
        size: 'M',
        color: 'Off-White أوف وايت'
      }
    ],
    quantity: 1,
    amount: 1450,
    subtotal: 1450,
    discount: 0,
    shipping: 60,
    paymentMethod: 'InstaPay (تم التحقق • Ref: 98124)',
    paymentStatus: 'paid',
    shippingStatus: 'ready_for_pickup',
    courier: 'Bosta Express',
    trackingNumber: 'BST-77391024',
    date: 'منذ ساعتين',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    attributedCreator: '@nour_style'
  },
  {
    id: 'EG-8840',
    merchantId: 'm-01',
    merchantName: 'Talieska Studio • تاليسكا ستوديو',
    customerName: 'نورهان كريم (Nourhan Karim)',
    phone: '+20 111 876 5432',
    address: 'سموحة، الإسكندرية - شارع فيكتور عمانويل',
    productTitle: 'فستان سهرة حرير ملكي • 54',
    items: [
      {
        productId: 'p-silk-dress-01',
        title: 'فستان سهرة حرير ملكي',
        price: 1980,
        quantity: 1,
        size: '54',
        color: 'Burgundy نبيذي'
      }
    ],
    quantity: 1,
    amount: 1980,
    subtotal: 1980,
    discount: 0,
    shipping: 60,
    paymentMethod: 'الدفع عند الاستلام (COD)',
    paymentStatus: 'pending_cod',
    shippingStatus: 'in_transit',
    courier: 'Bosta Express',
    trackingNumber: 'BST-77390918',
    date: 'منذ 5 ساعات',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    attributedCreator: '@farida_fashion'
  },
  {
    id: 'EG-8839',
    merchantId: 'm-02',
    merchantName: 'Khan El Khalili Craft • ورشة خان الخليلي',
    customerName: 'طارق مصطفى',
    phone: '+20 122 998 1122',
    address: 'الشيخ زايد، الجيزة - بيفرلي هيلز',
    productTitle: 'فانوس نحاس أرابيسك يدوي',
    items: [
      {
        productId: 'p-copper-lantern',
        title: 'فانوس نحاس أرابيسك يدوي',
        price: 920,
        quantity: 1,
        size: 'Large',
        color: 'Antique Brass'
      }
    ],
    quantity: 1,
    amount: 920,
    subtotal: 920,
    discount: 0,
    shipping: 60,
    paymentMethod: 'InstaPay',
    paymentStatus: 'paid',
    shippingStatus: 'delivered',
    courier: 'Bosta Express',
    trackingNumber: 'BST-77389100',
    date: 'أمس',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    attributedCreator: '@cairo_looks'
  },
  {
    id: 'EG-8838',
    merchantId: 'm-03',
    merchantName: 'Tiba Jewelry • مجوهرات طيبة',
    customerName: 'ياسمين الشريف',
    phone: '+20 100 456 7890',
    address: 'التجمع الخامس، القاهرة الجديدة',
    productTitle: 'ساعة يد كلاسيكية برميليّة بعقارب رومانية',
    items: [
      {
        productId: 'p-fashion-vintage-watch',
        title: 'ساعة يد كلاسيكية برميليّة بعقارب رومانية',
        price: 3400,
        quantity: 1,
        size: 'Case 38mm',
        color: 'Rose Gold & Brown'
      }
    ],
    quantity: 1,
    amount: 3400,
    subtotal: 3400,
    discount: 200,
    shipping: 60,
    paymentMethod: 'بطاقة ائتمان (Visa)',
    paymentStatus: 'paid',
    shippingStatus: 'in_transit',
    courier: 'Bosta Express',
    trackingNumber: 'BST-77388412',
    date: 'أمس',
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    attributedCreator: '@sarah_jewelry'
  }
];

function getStoredOrders() {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORDERS;
  } catch (e) {
    console.warn('Failed to parse stored orders:', e);
    return INITIAL_ORDERS;
  }
}

function setStoredOrders(orders) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Failed to save orders to localStorage:', e);
  }
}

export const OrderService = {
  getInitialOrders() {
    return getStoredOrders();
  },

  async createOrder(payloadOrCartItems, ...rest) {
    let payload = {};
    if (Array.isArray(payloadOrCartItems)) {
      const [subtotal, discount, shipping, total, user, paymentMethod, customerName, phone, address] = rest;
      payload = {
        cartItems: payloadOrCartItems,
        subtotal: typeof subtotal === 'number' ? subtotal : 0,
        discount: typeof discount === 'number' ? discount : 0,
        shipping: typeof shipping === 'number' ? shipping : 60,
        total: typeof total === 'number' ? total : 0,
        user: typeof user === 'object' ? user : null,
        userId: typeof user === 'string' ? user : (user?.id || null),
        paymentMethod: typeof paymentMethod === 'string' ? paymentMethod : 'instapay',
        customerName: typeof customerName === 'string' ? customerName : (user?.name || 'عميل تجارة مصرية'),
        phone: typeof phone === 'string' ? phone : (user?.phone || '+20 102 345 6789'),
        address: typeof address === 'string' ? address : 'القاهرة، مصر الجديدة، شارع الثورة عمارة 14'
      };
    } else {
      payload = payloadOrCartItems || {};
    }

    const cartItems = payload.cartItems || [];
    const customerName = payload.customerName || payload.user?.name || 'عميل تجارة مصرية';
    const phone = payload.phone || payload.user?.phone || '+20 102 345 6789';
    const address = payload.address || 'القاهرة، مصر الجديدة، شارع الثورة عمارة 14';
    const paymentMethodRaw = payload.paymentMethod || 'instapay';
    const paymentMethod = paymentMethodRaw === 'instapay'
      ? `InstaPay (تم التحقق • Ref: ${Math.floor(10000 + Math.random() * 90000)})`
      : paymentMethodRaw === 'card'
        ? 'بطاقة بنكية • فيزا / ميزة (Visa/Mezza)'
        : 'الدفع عند الاستلام (COD)';
    const paymentStatus = paymentMethodRaw === 'cod' ? 'pending_cod' : 'paid';

    // Group cart items by merchantId so each merchant receives their exact orders
    const itemsByMerchant = {};
    cartItems.forEach(item => {
      const mId = item.merchantId || item.merchant_id || 'm-01';
      if (!itemsByMerchant[mId]) {
        itemsByMerchant[mId] = [];
      }
      itemsByMerchant[mId].push(item);
    });

    const createdOrders = [];
    const nowIso = new Date().toISOString();

    for (const [merchantId, mItems] of Object.entries(itemsByMerchant)) {
      const mSubtotal = mItems.reduce((acc, it) => acc + ((it.price || it.unit_price || 0) * (it.quantity || 1)), 0);
      const mDiscount = Math.floor((payload.discount || 0) / (Object.keys(itemsByMerchant).length || 1));
      const mShipping = 60;
      const mTotal = Math.max(0, mSubtotal - mDiscount + mShipping);

      const productTitleSummary = mItems
        .map(i => `${i.title || i.name || 'منتج'} (${i.quantity || 1} قطعة)`)
        .join(' + ');

      const merchantOrder = {
        id: `EG-${Math.floor(1000 + Math.random() * 9000)}`,
        merchantId: merchantId,
        merchantName: mItems[0]?.merchant || (merchantId === 'm-01' ? 'Talieska Studio • تاليسكا ستوديو' : merchantId === 'm-02' ? 'Khan El Khalili Craft' : 'Tiba Jewelry'),
        customerName: customerName,
        phone: phone,
        address: address,
        productTitle: productTitleSummary,
        items: mItems.map(it => ({
          productId: it.productId || it.id,
          title: it.title || it.name,
          price: it.price || it.unit_price,
          quantity: it.quantity || 1,
          size: it.size || 'M',
          color: it.color || 'Default',
          image: it.image
        })),
        quantity: mItems.reduce((acc, it) => acc + (it.quantity || 1), 0),
        amount: mTotal,
        subtotal: mSubtotal,
        discount: mDiscount,
        shipping: mShipping,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus,
        shippingStatus: 'ready_for_pickup',
        courier: 'Bosta Express',
        trackingNumber: `BST-${Math.floor(10000000 + Math.random() * 90000000)}`,
        date: 'الآن',
        createdAt: nowIso,
        userId: payload.userId || payload.user?.id || null,
        attributedCreator: mItems[0]?.attributedCreator || null
      };

      createdOrders.push(merchantOrder);

      // Attempt DB insert in background (best effort)
      try {
        supabase.from('orders').insert({
          user_id: payload.userId || null,
          status: 'pending',
          subtotal: mSubtotal,
          discount_amount: mDiscount,
          shipping_amount: mShipping,
          total_amount: mTotal
        }).then();
      } catch (err) {
        // silent fallback
      }
    }

    // Save to persistent localStorage
    const currentOrders = getStoredOrders();
    const updatedOrders = [...createdOrders, ...currentOrders];
    setStoredOrders(updatedOrders);

    if (typeof window !== 'undefined') {
      localStorage.removeItem('eg_local_cart');
      if (createdOrders.length > 0) {
        sessionStorage.setItem('eg_last_order_id', createdOrders[0].id);
      }
    }

    return createdOrders.length === 1 ? createdOrders[0] : createdOrders;
  },

  async getOrders(userId = null) {
    const localOrders = getStoredOrders();
    try {
      let query = supabase.from('orders').select('*, order_items(*)');
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (err) {
      // Use synchronized local orders
    }

    if (userId) {
      return localOrders.filter(o => o.userId === userId);
    }
    return localOrders;
  },

  async getMerchantOrders(merchantId) {
    const all = await this.getOrders();
    return all.filter(o => o.merchantId === merchantId);
  },

  async updateOrderStatus(orderId, newStatus) {
    const orders = getStoredOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, shippingStatus: newStatus } : o);
    setStoredOrders(updated);

    try {
      supabase.from('orders').update({ status: newStatus }).eq('id', orderId).then();
    } catch (e) {}

    return updated;
  }
};
