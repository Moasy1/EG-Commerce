import { getSupabaseServerClient } from './supabaseServer.js';

const SHIPPING_PER_MERCHANT = 60;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

function normalizeLegacyOrderPayload(payloadOrCartItems, rest = []) {
  if (!Array.isArray(payloadOrCartItems)) {
    return payloadOrCartItems || {};
  }

  const [subtotal, discount, shipping, total, user, paymentMethod, customerName, phone, address] = rest;
  return {
    cartItems: payloadOrCartItems,
    subtotal: typeof subtotal === 'number' ? subtotal : 0,
    discount: typeof discount === 'number' ? discount : 0,
    shipping: typeof shipping === 'number' ? shipping : SHIPPING_PER_MERCHANT,
    total: typeof total === 'number' ? total : 0,
    user: typeof user === 'object' ? user : null,
    userId: typeof user === 'string' ? user : (user?.id || null),
    paymentMethod: typeof paymentMethod === 'string' ? paymentMethod : 'instapay',
    customerName: typeof customerName === 'string' ? customerName : (user?.name || 'عميل تجارة مصرية'),
    phone: typeof phone === 'string' ? phone : (user?.phone || '+20 102 345 6789'),
    address: typeof address === 'string' ? address : 'القاهرة، مصر الجديدة، شارع الثورة عمارة 14'
  };
}

function getPaymentDetails(paymentMethodRaw) {
  if (paymentMethodRaw === 'instapay') {
    return {
      paymentMethod: `InstaPay (تم التحقق • Ref: ${Math.floor(10000 + Math.random() * 90000)})`,
      paymentStatus: 'paid'
    };
  }

  if (paymentMethodRaw === 'card') {
    return {
      paymentMethod: 'بطاقة بنكية • فيزا / ميزة (Visa/Meeza)',
      paymentStatus: 'paid'
    };
  }

  if (paymentMethodRaw === 'vodafone') {
    return {
      paymentMethod: 'E-Wallets • Vodafone Cash / Orange / Etisalat',
      paymentStatus: 'paid'
    };
  }

  return {
    paymentMethod: 'الدفع عند الاستلام (COD)',
    paymentStatus: 'pending_cod'
  };
}

function groupItemsByMerchant(cartItems) {
  return cartItems.reduce((groups, item) => {
    const merchantId = item.merchantId || item.merchant_id || 'm-01';
    if (!groups[merchantId]) groups[merchantId] = [];
    groups[merchantId].push(item);
    return groups;
  }, {});
}

function getMerchantName(merchantId, items) {
  return items[0]?.merchant || items[0]?.brand ||
    (merchantId === 'm-01'
      ? 'Talieska Studio • تاليسكا ستوديو'
      : merchantId === 'm-02'
        ? 'Khan El Khalili Craft'
        : 'Tiba Jewelry');
}

export function buildMerchantOrders(payloadOrCartItems, rest = []) {
  const payload = normalizeLegacyOrderPayload(payloadOrCartItems, rest);
  const cartItems = Array.isArray(payload.cartItems) ? payload.cartItems : [];

  if (cartItems.length === 0) {
    const error = new Error('Cannot create an order with an empty cart');
    error.statusCode = 400;
    throw error;
  }

  const customerName = payload.customerName || payload.user?.name || 'عميل تجارة مصرية';
  const phone = payload.phone || payload.user?.phone || '+20 102 345 6789';
  const address = payload.address || 'القاهرة، مصر الجديدة، شارع الثورة عمارة 14';
  const paymentMethodRaw = payload.paymentMethod || 'instapay';
  const { paymentMethod, paymentStatus } = getPaymentDetails(paymentMethodRaw);
  const itemsByMerchant = groupItemsByMerchant(cartItems);
  const merchantCount = Object.keys(itemsByMerchant).length || 1;
  const nowIso = new Date().toISOString();

  return Object.entries(itemsByMerchant).map(([merchantId, merchantItems]) => {
    const subtotal = merchantItems.reduce(
      (acc, item) => acc + ((Number(item.price || item.unit_price) || 0) * (Number(item.quantity) || 1)),
      0
    );
    const discount = Math.floor((Number(payload.discount) || 0) / merchantCount);
    const shipping = SHIPPING_PER_MERCHANT;
    const total = Math.max(0, subtotal - discount + shipping);
    const productTitle = merchantItems
      .map(item => `${item.title || item.name || 'منتج'} (${item.quantity || 1} قطعة)`)
      .join(' + ');

    return {
      id: `EG-${Math.floor(1000 + Math.random() * 9000)}`,
      merchantId,
      merchantName: getMerchantName(merchantId, merchantItems),
      customerName,
      phone,
      address,
      productTitle,
      items: merchantItems.map(item => ({
        productId: item.productId || item.product_id || item.id,
        title: item.title || item.name,
        price: Number(item.price || item.unit_price) || 0,
        quantity: Number(item.quantity) || 1,
        size: item.size || 'M',
        color: item.color || 'Default',
        image: item.image
      })),
      quantity: merchantItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0),
      amount: total,
      subtotal,
      discount,
      shipping,
      paymentMethod,
      paymentStatus,
      shippingStatus: 'ready_for_pickup',
      courier: 'Bosta Express',
      trackingNumber: `BST-${Math.floor(10000000 + Math.random() * 90000000)}`,
      date: 'الآن',
      createdAt: nowIso,
      userId: payload.userId || payload.user?.id || null,
      attributedCreator: merchantItems[0]?.attributedCreator || null
    };
  });
}

export async function persistOrdersBestEffort(orders) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return { persisted: false, reason: 'Supabase server env is not configured' };

  const results = [];

  const platformRows = orders.map(order => ({
    display_id: order.id,
    merchant_id: order.merchantId || 'm-01',
    customer_name: order.customerName || null,
    phone: order.phone || null,
    order_data: order,
    shipping_status: order.shippingStatus || 'ready_for_pickup',
    payment_status: order.paymentStatus || 'pending',
    total_amount: order.amount || 0,
    updated_at: new Date().toISOString()
  }));

  const { error: platformError } = await supabase
    .from('platform_orders')
    .upsert(platformRows, { onConflict: 'display_id' });

  for (const order of orders) {
    const orderRecord = {
      user_id: isUuid(order.userId) ? order.userId : null,
      status: order.paymentStatus === 'paid' ? 'paid' : 'pending',
      subtotal: order.subtotal,
      discount_amount: order.discount,
      shipping_amount: order.shipping,
      total_amount: order.amount
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(orderRecord)
      .select('id')
      .single();

    if (error) {
      results.push({ displayId: order.id, persisted: false, error: error.message });
      continue;
    }

    const dbOrderId = data?.id;
    order.databaseId = dbOrderId;

    const uuidItems = order.items.filter(item => isUuid(item.productId) && isUuid(order.merchantId));
    if (dbOrderId && uuidItems.length > 0) {
      await supabase.from('order_items').insert(uuidItems.map(item => ({
        order_id: dbOrderId,
        product_id: item.productId,
        merchant_id: order.merchantId,
        quantity: item.quantity,
        unit_price: item.price,
        status: 'pending'
      })));
    }

    results.push({ displayId: order.id, databaseId: dbOrderId, persisted: true });
  }

  return {
    persisted: !platformError || results.some(result => result.persisted),
    platformOrders: platformError
      ? { persisted: false, error: platformError.message }
      : { persisted: true, count: platformRows.length },
    results
  };
}
