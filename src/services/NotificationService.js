// NotificationService.js
// Multi-role Notification Center engine for EG-Commerce

const NOTIFICATION_STORAGE_PREFIX = 'eg_notifications_';

export const ROLE_NOTIFICATIONS = {
  buyer: [
    {
      id: 'notif-b1',
      role: 'buyer',
      category: 'orders',
      title: 'طلبك خرج للتوصيل مع بوسطة 🚚',
      titleEn: 'Your order is out for delivery with Bosta',
      message: 'شحنتك رقم #EG-7429 مع المندوب وفي طريقها إلى عنوانك اليوم.',
      messageEn: 'Shipment #EG-7429 is with the courier and on its way to you today.',
      timestamp: 'منذ 15 دقيقة',
      timestampEn: '15 mins ago',
      read: false,
      icon: 'local_shipping',
      iconColor: 'text-emerald-500 bg-emerald-50',
      actionTab: 'tracking',
      badge: 'طلب جاري'
    },
    {
      id: 'notif-b2',
      role: 'buyer',
      category: 'promos',
      title: 'خصم حصري 20% على كولكشن الكتان 💛',
      titleEn: 'Exclusive 20% off Linen Collection',
      message: 'استمتع بخصم خاص من تاليسكا ستوديو على كافة منتجات الكتان الطبيعي.',
      messageEn: 'Enjoy a special discount from Drip Fit on all natural linen pieces.',
      timestamp: 'منذ ساعتين',
      timestampEn: '2 hours ago',
      read: false,
      icon: 'local_offer',
      iconColor: 'text-amber-500 bg-amber-50',
      actionTab: 'shop',
      badge: 'عرض خاص'
    },
    {
      id: 'notif-b3',
      role: 'buyer',
      category: 'rewards',
      title: 'أضيفت 150 نقطة مكافآت لحسابك 🎁',
      titleEn: '150 Reward Points Added',
      message: 'شكراً لتقييمك للمنتجات! رصيدك الحالي أصبح مؤهلاً لخصم 75 ج.م عند الدفع.',
      messageEn: 'Thanks for reviewing your items! Your balance can now be redeemed for 75 EGP.',
      timestamp: 'أمس',
      timestampEn: 'Yesterday',
      read: true,
      icon: 'stars',
      iconColor: 'text-purple-500 bg-purple-50',
      actionTab: 'rewards',
      badge: 'نقاط'
    },
    {
      id: 'notif-b4',
      role: 'buyer',
      category: 'social',
      title: 'ردت ياسمين السيد على تعليقك 💬',
      titleEn: 'Yasmin Sayed replied to your comment',
      message: 'في فيديو تنسيق قميص الكتان السماوي: "المقاس أوفرسايز خفيف ومريح جداً!"',
      messageEn: 'On blue linen shirt reel: "The sizing is a relaxed oversized fit!"',
      timestamp: 'منذ يومين',
      timestampEn: '2 days ago',
      read: true,
      icon: 'chat_bubble',
      iconColor: 'text-sky-500 bg-sky-50',
      actionTab: 'reels',
      badge: 'تفاعل'
    }
  ],

  merchant: [
    {
      id: 'notif-m1',
      role: 'merchant',
      category: 'orders',
      title: 'طلب جديد بانتظار التجهيز (#ORD-8821) 📦',
      titleEn: 'New Order Awaiting Fulfillment (#ORD-8821)',
      message: 'طلب بقيمة 2,850 ج.م يتضمن بليزر سيترين وقميص كتان. موعد بوسطة 3:00 م.',
      messageEn: 'Order worth 2,850 EGP (Citrine Blazer + Shirt). Bosta pickup scheduled for 3 PM.',
      timestamp: 'منذ 8 دقائق',
      timestampEn: '8 mins ago',
      read: false,
      icon: 'inventory_2',
      iconColor: 'text-emerald-500 bg-emerald-50',
      actionTab: 'dashboard',
      badge: 'طلب جديد'
    },
    {
      id: 'notif-m2',
      role: 'merchant',
      category: 'ugc',
      title: 'مسودة ريلز جديدة بانتظار موافقتك 🎬',
      titleEn: 'New Reel Draft Submitted for Review',
      message: 'قدمت صانعة المحتوى سارة المهدي (كايرو شيك) مسودة حملة أزياء الصيف للمراجعة.',
      messageEn: 'Creator Sarah El-Mahdi submitted a summer campaign video draft for approval.',
      timestamp: 'منذ 45 دقيقة',
      timestampEn: '45 mins ago',
      read: false,
      icon: 'smart_display',
      iconColor: 'text-purple-500 bg-purple-50',
      actionTab: 'merchant_campaign',
      badge: 'حملات UGC'
    },
    {
      id: 'notif-m3',
      role: 'merchant',
      category: 'inventory',
      title: 'تنبيه: مخزون قارب على النفاد ⚠️',
      titleEn: 'Low Stock Alert',
      message: 'متبقي قطعتان فقط من "بليزر سيترين أوفرسايز - مقاس M". قم بتحديث المخزون.',
      messageEn: 'Only 2 units left of "Citrine Blazer - Size M". Update inventory to prevent stockout.',
      timestamp: 'منذ 3 ساعات',
      timestampEn: '3 hours ago',
      read: false,
      icon: 'warning',
      iconColor: 'text-amber-500 bg-amber-50',
      actionTab: 'add_product',
      badge: 'مخزون'
    },
    {
      id: 'notif-m4',
      role: 'merchant',
      category: 'finance',
      title: 'تم تحويل تسوية المبيعات عبر إنستاباي 💳',
      titleEn: 'Sales Settlement Transferred via InstaPay',
      message: 'تم إيداع مبلغ 18,450 ج.م في حسابك البنكي لتسوية مبيعات الأسبوع المنصرم.',
      messageEn: '18,450 EGP deposited into your bank account for last week settlement.',
      timestamp: 'أمس',
      timestampEn: 'Yesterday',
      read: true,
      icon: 'payments',
      iconColor: 'text-sky-500 bg-sky-50',
      actionTab: 'dashboard',
      badge: 'مالية'
    }
  ],

  creator: [
    {
      id: 'notif-c1',
      role: 'creator',
      category: 'campaigns',
      title: 'دعوة حملة جديدة من مجوهرات طيبة 🌟',
      titleEn: 'New Campaign Invitation from Tiba Jewelry',
      message: 'تمت دعوتك لإنشاء ريلز استعراض لأساور الفضة بعمولة 15% ومكافأة 2,500 ج.م.',
      messageEn: 'Invited to create a showcase reel for silver bracelets with 15% commission + 2,500 EGP reward.',
      timestamp: 'منذ 20 دقيقة',
      timestampEn: '20 mins ago',
      read: false,
      icon: 'campaign',
      iconColor: 'text-purple-500 bg-purple-50',
      actionTab: 'studio',
      badge: 'فرصة حملة'
    },
    {
      id: 'notif-c2',
      role: 'creator',
      category: 'earnings',
      title: 'عمولة مبيعات جديدة (+180 ج.م) 💰',
      titleEn: 'New Sales Commission (+180 EGP)',
      message: 'تمت عملية شراء لبليزر السيترين من خلال رابط الريلز الخاص بك!',
      messageEn: 'A customer purchased a Citrine Blazer through your attributed reel link!',
      timestamp: 'منذ ساعتين',
      timestampEn: '2 hours ago',
      read: false,
      icon: 'monetization_on',
      iconColor: 'text-emerald-500 bg-emerald-50',
      actionTab: 'studio',
      badge: 'أرباح'
    },
    {
      id: 'notif-c3',
      role: 'creator',
      category: 'growth',
      title: 'الريلز الخاص بك أصبح تريند! 🚀',
      titleEn: 'Your Reel is Trending!',
      message: 'تجاوز ريلز "تنسيق الكتان الصيفي" 45,000 مشاهدة وتصدر صفحة اكتشف للأزياء.',
      messageEn: 'Your "Summer Linen Styling" reel crossed 45,000 views on the Discover feed.',
      timestamp: 'أمس',
      timestampEn: 'Yesterday',
      read: false,
      icon: 'trending_up',
      iconColor: 'text-rose-500 bg-rose-50',
      actionTab: 'studio',
      badge: 'إحصائيات'
    },
    {
      id: 'notif-c4',
      role: 'creator',
      category: 'campaigns',
      title: 'تمت الموافقة على مسودة الفيديو ✅',
      titleEn: 'Reel Draft Approved',
      message: 'وافق متجر تاليسكا على مسودة الريلز الخاصة بك، وتم تفعيل الرابط التسويقي.',
      messageEn: 'Drip Fit approved your reel draft and activated your affiliate commission link.',
      timestamp: 'منذ يومين',
      timestampEn: '2 days ago',
      read: true,
      icon: 'task_alt',
      iconColor: 'text-emerald-500 bg-emerald-50',
      actionTab: 'studio',
      badge: 'معتمد'
    }
  ],

  admin: [
    {
      id: 'notif-a1',
      role: 'admin',
      category: 'merchants',
      title: 'طلب اعتماد تاجر جديد (ورشة خان الخليلي) 🛡️',
      titleEn: 'New Merchant Verification Request',
      message: 'تم رفع السجل التجاري والبطاقة الضريبية بانتظار مراجعة الإدارة وتفعيل الحساب.',
      messageEn: 'Tax card & commercial register uploaded for Khan El Khalili artisan workshop.',
      timestamp: 'منذ 10 دقائق',
      timestampEn: '10 mins ago',
      read: false,
      icon: 'verified_user',
      iconColor: 'text-purple-500 bg-purple-50',
      actionTab: 'admin',
      badge: 'تحقق'
    },
    {
      id: 'notif-a2',
      role: 'admin',
      category: 'finance',
      title: 'دفعة تسويات نهاية الأسبوع (84,000 ج.م) 📊',
      titleEn: 'Weekly Merchant Settlement Batch',
      message: 'جاهزة للاعتماد والتحويل التلقائي لحسابات 12 تاجراً معتمداً عبر إنستاباي.',
      messageEn: 'Ready for batch approval and payout to 12 verified merchants via InstaPay.',
      timestamp: 'منذ ساعة',
      timestampEn: '1 hour ago',
      read: false,
      icon: 'account_balance',
      iconColor: 'text-emerald-500 bg-emerald-50',
      actionTab: 'admin',
      badge: 'تسويات'
    },
    {
      id: 'notif-a3',
      role: 'admin',
      category: 'algorithm',
      title: 'تحديث محرك التوصيات وتوزيع الريلز ⚡',
      titleEn: 'Algorithm Engine Weights Updated',
      message: 'تمت مزامنة معايير التوزيع الجغرافي ونسبة عمولة المبيعات في خوارزمية الفيد.',
      messageEn: 'Geographic diversity weights and conversion scores updated in feed algorithm.',
      timestamp: 'منذ 4 ساعات',
      timestampEn: '4 hours ago',
      read: true,
      icon: 'tune',
      iconColor: 'text-sky-500 bg-sky-50',
      actionTab: 'admin',
      badge: 'الخوارزمية'
    },
    {
      id: 'notif-a4',
      role: 'admin',
      category: 'security',
      title: 'فحص أمان المنصة: 0 ثغرات مكتشفة 🔒',
      titleEn: 'Platform Security Audit: Zero Vulnerabilities',
      message: 'اكتمل الفحص الدوري لسياسات حماية الصلاحيات (Row-Level Security) بنجاح.',
      messageEn: 'Periodic security check on Supabase RLS and token policies passed with 100% integrity.',
      timestamp: 'أمس',
      timestampEn: 'Yesterday',
      read: true,
      icon: 'security',
      iconColor: 'text-slate-700 bg-slate-100',
      actionTab: 'admin',
      badge: 'أمان'
    }
  ],

  guest: [
    {
      id: 'notif-g1',
      role: 'guest',
      category: 'welcome',
      title: 'أهلاً بك في منصة التجارة المصرية 🇪🇬',
      titleEn: 'Welcome to Egyptian Commerce',
      message: 'سجل دخولك الآن لتتمكن من حفظ المنتجات المفضلة وتتبع طلباتك وربح نقاط المكافآت.',
      messageEn: 'Sign in to save items, track orders, and earn points on every purchase.',
      timestamp: 'الآن',
      timestampEn: 'Just now',
      read: false,
      icon: 'waving_hand',
      iconColor: 'text-amber-500 bg-amber-50',
      actionTab: 'login',
      badge: 'مرحباً'
    },
    {
      id: 'notif-g2',
      role: 'guest',
      category: 'promos',
      title: 'تخفيضات أزياء الصيف وشحن سريع لجميع المحافظات 🛍️',
      titleEn: 'Summer Sale & Fast Shipping to all Governorates',
      message: 'اكتشف أرقى براندات الكتان والحرف اليدوية المصرية مع توصيل موثوق عبر بوسطة.',
      messageEn: 'Discover Egyptian linen and artisanal fashion with reliable Bosta shipping.',
      timestamp: 'منذ ساعتين',
      timestampEn: '2 hours ago',
      read: false,
      icon: 'storefront',
      iconColor: 'text-rose-500 bg-rose-50',
      actionTab: 'shop',
      badge: 'تسوق'
    }
  ]
};

export const NotificationService = {
  getStorageKey(role = 'buyer', userId = 'default') {
    const sanitizedRole = ['merchant', 'creator', 'admin', 'superadmin', 'buyer'].includes(role) 
      ? (role === 'superadmin' ? 'admin' : role) 
      : 'buyer';
    return `${NOTIFICATION_STORAGE_PREFIX}${sanitizedRole}_${userId}`;
  },

  getNotifications(role = 'buyer', userId = 'default') {
    const sanitizedRole = ['merchant', 'creator', 'admin', 'superadmin', 'buyer'].includes(role) 
      ? (role === 'superadmin' ? 'admin' : role) 
      : (role === 'guest' ? 'guest' : 'buyer');

    const key = this.getStorageKey(sanitizedRole, userId);
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading notifications from localStorage:', e);
    }

    // Default seed per role
    const defaultList = ROLE_NOTIFICATIONS[sanitizedRole] || ROLE_NOTIFICATIONS.buyer;
    try {
      localStorage.setItem(key, JSON.stringify(defaultList));
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
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  markAllAsRead(role = 'buyer', userId = 'default') {
    const list = this.getNotifications(role, userId);
    const updated = list.map(item => ({ ...item, read: true }));
    const key = this.getStorageKey(role, userId);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  deleteNotification(notificationId, role = 'buyer', userId = 'default') {
    const list = this.getNotifications(role, userId);
    const updated = list.filter(item => item.id !== notificationId);
    const key = this.getStorageKey(role, userId);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  },

  addNotification(newNotif, role = 'buyer', userId = 'default') {
    const list = this.getNotifications(role, userId);
    const item = {
      id: `notif-${Date.now()}`,
      timestamp: 'الآن',
      timestampEn: 'Just now',
      read: false,
      ...newNotif
    };
    const updated = [item, ...list];
    const key = this.getStorageKey(role, userId);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  }
};
