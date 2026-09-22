// NotificationService.js
// Dynamic Production Notification Center engine for EG-Commerce

const NOTIFICATION_STORAGE_PREFIX = 'eg_notifications_prod_';

export const ROLE_INITIAL_NOTIFICATIONS = {
  buyer: [
    {
      id: 'notif-sys-b1',
      role: 'buyer',
      category: 'orders',
      title: 'أهلاً بك في منصة التجارة المصرية 🇪🇬',
      titleEn: 'Welcome to Egyptian Commerce',
      message: 'تسوق بأمان مباشرة من أرقى البراندات المصرية المستقلة مع شحن موحد وسريع عبر بوسطة.',
      messageEn: 'Discover verified independent Egyptian brands with consolidated, reliable shipping.',
      timestamp: 'اليوم',
      timestampEn: 'Today',
      read: false,
      icon: 'verified',
      iconColor: 'text-red-500 bg-red-50',
      actionTab: 'shop',
      badge: 'مرحباً'
    }
  ],

  merchant: [
    {
      id: 'notif-sys-m1',
      role: 'merchant',
      category: 'orders',
      title: 'مرحباً بك في لوحة تحكم المتجر 🚀',
      titleEn: 'Welcome to your Merchant Hub',
      message: 'متجرك نشط وجاهز لإدارة المنتجات، متابعة الطلبات، وتجهيز الشحنات عبر بوسطة إكسبريس.',
      messageEn: 'Your store is live and ready for catalog management, orders, and Bosta fulfillment.',
      timestamp: 'اليوم',
      timestampEn: 'Today',
      read: false,
      icon: 'storefront',
      iconColor: 'text-emerald-500 bg-emerald-50',
      actionTab: 'dashboard',
      badge: 'نظام'
    }
  ],

  creator: [
    {
      id: 'notif-sys-c1',
      role: 'creator',
      category: 'campaigns',
      title: 'استوديو المبدعين نشط 🎬',
      titleEn: 'Creator Studio is Live',
      message: 'يمكنك الآن ربط الفيديوهات والريلز بالمنتجات ومتابعة عمولات المبيعات بشكل مباشر.',
      messageEn: 'Tag products to your video reels and earn sales commissions in real-time.',
      timestamp: 'اليوم',
      timestampEn: 'Today',
      read: false,
      icon: 'smart_display',
      iconColor: 'text-purple-500 bg-purple-50',
      actionTab: 'studio',
      badge: 'استوديو'
    }
  ],

  admin: [
    {
      id: 'notif-sys-a1',
      role: 'admin',
      category: 'security',
      title: 'مركز العمليات والأمان المركزي 🔒',
      titleEn: 'Operations Center Live',
      message: 'نظام إدارة المتاجر المعتمدة ومراقبة الطلبات والتسويات يعمل بكامل طاقته بنجاح.',
      messageEn: 'Merchant operations, live orders, and settlement monitoring active with 100% integrity.',
      timestamp: 'اليوم',
      timestampEn: 'Today',
      read: false,
      icon: 'security',
      iconColor: 'text-slate-800 bg-slate-100',
      actionTab: 'admin',
      badge: 'أمان'
    }
  ],

  guest: [
    {
      id: 'notif-sys-g1',
      role: 'guest',
      category: 'all',
      title: 'أهلاً بك في منصة التجارة المصرية 🇪🇬',
      titleEn: 'Welcome to Egyptian Commerce',
      message: 'سجل دخولك لحفظ المنتجات المفضلة وتتبع طلباتك وربح نقاط المكافآت.',
      messageEn: 'Sign in to save items, track orders, and earn points on every purchase.',
      timestamp: 'الآن',
      timestampEn: 'Just now',
      read: false,
      icon: 'waving_hand',
      iconColor: 'text-amber-500 bg-amber-50',
      actionTab: 'login',
      badge: 'مرحباً'
    }
  ]
};

function notifyUiUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('eg_notifications_updated'));
  }
}

const memoryStorage = new Map();

function safeGetItem(key) {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch (e) {}
  }
  return memoryStorage.get(key) || null;
}

function safeSetItem(key, val) {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, val);
      return;
    } catch (e) {}
  }
  memoryStorage.set(key, val);
}

export const NotificationService = {
  getStorageKey(role = 'buyer', userId = 'default') {
    const sanitizedRole = ['merchant', 'creator', 'admin', 'superadmin', 'buyer'].includes(role) 
      ? (role === 'superadmin' ? 'admin' : role) 
      : (role === 'guest' ? 'guest' : 'buyer');
    return `${NOTIFICATION_STORAGE_PREFIX}${sanitizedRole}_${userId}`;
  },

  getNotifications(role = 'buyer', userId = 'default') {
    const sanitizedRole = ['merchant', 'creator', 'admin', 'superadmin', 'buyer'].includes(role) 
      ? (role === 'superadmin' ? 'admin' : role) 
      : (role === 'guest' ? 'guest' : 'buyer');

    const key = this.getStorageKey(sanitizedRole, userId);
    try {
      const stored = safeGetItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {}

    // Default clean initial notification for this role
    const defaultList = ROLE_INITIAL_NOTIFICATIONS[sanitizedRole] || ROLE_INITIAL_NOTIFICATIONS.buyer;
    try {
      safeSetItem(key, JSON.stringify(defaultList));
    } catch (e) {}

    return defaultList;
  },

  getUnreadCount(role = 'buyer', userId = 'default') {
    const list = this.getNotifications(role, userId);
    return list.filter(n => !n.read).length;
  },

  markAsRead(notificationId, role = 'buyer', userId = 'default') {
    const list = this.getNotifications(role, userId);
    const updated = list.map(item => item.id === notificationId ? { ...item, read: true } : item);
    const key = this.getStorageKey(role, userId);
    safeSetItem(key, JSON.stringify(updated));
    notifyUiUpdate();
    return updated;
  },

  markAllAsRead(role = 'buyer', userId = 'default') {
    const list = this.getNotifications(role, userId);
    const updated = list.map(item => ({ ...item, read: true }));
    const key = this.getStorageKey(role, userId);
    safeSetItem(key, JSON.stringify(updated));
    notifyUiUpdate();
    return updated;
  },

  deleteNotification(notificationId, role = 'buyer', userId = 'default') {
    const list = this.getNotifications(role, userId);
    const updated = list.filter(item => item.id !== notificationId);
    const key = this.getStorageKey(role, userId);
    safeSetItem(key, JSON.stringify(updated));
    notifyUiUpdate();
    return updated;
  },

  addNotification(newNotif, role = 'buyer', userId = 'default') {
    const list = this.getNotifications(role, userId);
    const item = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'الآن',
      timestampEn: 'Just now',
      read: false,
      ...newNotif
    };
    const updated = [item, ...list];
    const key = this.getStorageKey(role, userId);
    safeSetItem(key, JSON.stringify(updated));
    notifyUiUpdate();
    return updated;
  },

  /**
   * Automatically generate dynamic notifications when an order is placed
   */
  createOrderNotification(order) {
    if (!order) return;
    const orderId = order.id || 'EG-ORDER';
    const amountStr = typeof order.amount === 'number' ? order.amount.toLocaleString() : (order.amount || 0);
    const merchantName = order.merchantName || 'المتجر المعتمد';

    // 1. Notification for the Buyer
    this.addNotification({
      role: 'buyer',
      category: 'orders',
      title: `تم تأكيد طلبك بنجاح (${orderId}) 🛍️`,
      titleEn: `Order Confirmed (${orderId})`,
      message: `طلبك بقيمة ${amountStr} ج.م قيد التجهيز مع ${merchantName}. يمكنك متابعة مسار الشحنة عبر بوسطة.`,
      messageEn: `Order worth ${amountStr} EGP is being fulfilled by ${merchantName}. Track with Bosta.`,
      icon: 'local_shipping',
      iconColor: 'text-emerald-500 bg-emerald-50',
      actionTab: 'tracking',
      badge: 'طلب جديد'
    }, 'buyer', order.userId || 'default');

    // 2. Notification for the Merchant
    const merchantUserId = order.merchantId || order.merchant_id || 'default';
    this.addNotification({
      role: 'merchant',
      category: 'orders',
      title: `طلب جديد بانتظار التجهيز (${orderId}) 📦`,
      titleEn: `New Order Awaiting Fulfillment (${orderId})`,
      message: `طلب جديد بقيمة ${amountStr} ج.م من العميل "${order.customerName || 'عميل'}". التوصيل عبر بوسطة.`,
      messageEn: `New order worth ${amountStr} EGP from ${order.customerName || 'Customer'}. Bosta delivery.`,
      icon: 'inventory_2',
      iconColor: 'text-emerald-500 bg-emerald-50',
      actionTab: 'orders',
      badge: 'طلب جاري'
    }, 'merchant', merchantUserId);
  },

  /**
   * Dynamic notification when shipping status updates
   */
  createOrderStatusNotification(order, newStatus) {
    if (!order) return;
    const orderId = order.id || 'EG-ORDER';
    const merchantName = order.merchantName || 'المتجر المعتمد';
    
    let title = `تحديث بخصوص طلبك (${orderId})`;
    let titleEn = `Update for Order (${orderId})`;
    let message = `تم تحديث حالة الطلب إلى: ${newStatus}`;
    let messageEn = `Order status updated to: ${newStatus}`;
    let icon = 'local_shipping';

    if (newStatus === 'in_transit') {
      title = `طلبك خرج للتوصيل مع بوسطة (${orderId}) 🚚`;
      titleEn = `Order Out for Delivery (${orderId})`;
      message = `شحنتك مع مندوب بوسطة وفي طريقها إليك. رقم البوليصة: ${order.trackingNumber || '-'}`;
      messageEn = `Shipment is on the way with Bosta courier. Waybill: ${order.trackingNumber || '-'}`;
      icon = 'local_shipping';
    } else if (newStatus === 'delivered') {
      title = `تم تسليم طلبك بنجاح (${orderId}) ✅`;
      titleEn = `Order Delivered Successfully (${orderId})`;
      message = `شكراً لتسوقك من ${merchantName}! نتمنى لك تجربة تسوق ممتعة.`;
      messageEn = `Thank you for shopping from ${merchantName}! Enjoy your items.`;
      icon = 'check_circle';
    }

    this.addNotification({
      role: 'buyer',
      category: 'orders',
      title,
      titleEn,
      message,
      messageEn,
      icon,
      iconColor: 'text-sky-500 bg-sky-50',
      actionTab: 'tracking',
      badge: 'تحديث الشحنة'
    }, 'buyer', order.userId || 'default');
  }
};
