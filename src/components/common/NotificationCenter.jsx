import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationService } from '../../services/NotificationService';

export default function NotificationCenter({ isOpen, onClose, anchorRef }) {
  const { user, language, setActiveTab, setIsAuthModalOpen } = useApp();
  const isAr = language === 'ar';
  
  const currentRole = user?.role || 'buyer';
  const userId = user?.id || 'guest';

  const [notifications, setNotifications] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const modalRef = useRef(null);

  // Load notifications for the current role
  useEffect(() => {
    const list = NotificationService.getNotifications(currentRole, userId);
    setNotifications(list);
  }, [currentRole, userId, isOpen]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        modalRef.current && 
        !modalRef.current.contains(e.target) &&
        (!anchorRef?.current || !anchorRef.current.contains(e.target))
      ) {
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    const updated = NotificationService.markAllAsRead(currentRole, userId);
    setNotifications(updated);
  };

  const handleNotificationClick = (item) => {
    // Mark as read
    const updated = NotificationService.markAsRead(item.id, currentRole, userId);
    setNotifications(updated);

    // Execute role action
    if (item.actionTab) {
      if (item.actionTab === 'login') {
        setIsAuthModalOpen(true);
      } else {
        setActiveTab(item.actionTab);
      }
      onClose();
    }
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation();
    const updated = NotificationService.deleteNotification(id, currentRole, userId);
    setNotifications(updated);
  };

  // Get categories filter tabs based on role
  const getCategories = () => {
    if (currentRole === 'merchant') {
      return [
        { id: 'all', label: isAr ? 'الكل' : 'All' },
        { id: 'orders', label: isAr ? 'الطلبات' : 'Orders' },
        { id: 'ugc', label: isAr ? 'حملات UGC' : 'Campaigns' },
        { id: 'inventory', label: isAr ? 'المخزون' : 'Stock' },
        { id: 'finance', label: isAr ? 'المالية' : 'Finance' }
      ];
    }
    if (currentRole === 'creator') {
      return [
        { id: 'all', label: isAr ? 'الكل' : 'All' },
        { id: 'campaigns', label: isAr ? 'الحملات' : 'Campaigns' },
        { id: 'earnings', label: isAr ? 'الأرباح' : 'Earnings' },
        { id: 'growth', label: isAr ? 'الإحصائيات' : 'Growth' }
      ];
    }
    if (currentRole === 'admin' || currentRole === 'superadmin') {
      return [
        { id: 'all', label: isAr ? 'الكل' : 'All' },
        { id: 'merchants', label: isAr ? 'التجار' : 'Merchants' },
        { id: 'finance', label: isAr ? 'التسويات' : 'Payouts' },
        { id: 'algorithm', label: isAr ? 'الخوارزمية' : 'Algorithm' },
        { id: 'security', label: isAr ? 'الأمان' : 'Security' }
      ];
    }
    // Buyer / Guest default
    return [
      { id: 'all', label: isAr ? 'الكل' : 'All' },
      { id: 'orders', label: isAr ? 'الطلبات والشحن' : 'Orders' },
      { id: 'promos', label: isAr ? 'العروض' : 'Deals' },
      { id: 'rewards', label: isAr ? 'المكافآت' : 'Points' },
      { id: 'social', label: isAr ? 'التفاعل' : 'Social' }
    ];
  };

  const categories = getCategories();
  const filteredNotifications = activeCategory === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === activeCategory);

  const getRoleTitle = () => {
    switch (currentRole) {
      case 'merchant':
        return isAr ? 'مركز تنبيهات المتجر والطلبات' : 'Merchant Store Alerts';
      case 'creator':
        return isAr ? 'مركز إشعارات المبدعين والأرباح' : 'Creator Studio & Commission Alerts';
      case 'admin':
      case 'superadmin':
        return isAr ? 'مركز تنبيهات الإدارة المركزية' : 'Platform Operations Center';
      default:
        return isAr ? 'مركز الإشعارات والتتبع' : 'Notification Center';
    }
  };

  return (
    <div 
      ref={modalRef}
      className={`fixed sm:absolute z-50 inset-x-2 sm:inset-x-auto ${
        isAr ? 'sm:left-0' : 'sm:right-0'
      } top-14 sm:top-full mt-2 w-auto sm:w-[410px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden text-slate-900 flex flex-col max-h-[85vh] sm:max-h-[580px] animate-scale-in gpu-layer`}
      dir={isAr ? 'rtl' : 'ltr'}
      role="dialog"
      aria-label="Notification Center"
    >
      {/* 1. Header with Role & Action */}
      <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm tracking-tight">{getRoleTitle()}</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-[#d00000] text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-medium capitalize">
              {isAr ? `صلاحية الحساب: ${currentRole}` : `Active Role: ${currentRole}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-bold text-gray-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
              title={isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}
            >
              {isAr ? 'قراءة الكل' : 'Mark all read'}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-gray-500 hover:text-slate-900 hover:bg-gray-200/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Notifications Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 p-1">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-3.5 rounded-2xl flex items-start gap-3 cursor-pointer transition-all ${
                !notif.read ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-gray-50'
              }`}
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${notif.iconColor || 'bg-gray-100 text-gray-700'}`}>
                <span className="material-symbols-outlined text-[20px]">{notif.icon || 'notifications'}</span>
              </div>

              {/* Text & Meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-900 font-extrabold' : 'text-slate-700'}`}>
                      {isAr ? notif.title : (notif.titleEn || notif.title)}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#d00000] shrink-0 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                    {isAr ? notif.timestamp : (notif.timestampEn || notif.timestamp)}
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                  {isAr ? notif.message : (notif.messageEn || notif.message)}
                </p>

                {/* Footer Tag & Action hint */}
                <div className="flex items-center justify-between mt-2">
                  {notif.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white border border-gray-200 text-slate-700">
                      {notif.badge}
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-[#d00000] flex items-center gap-0.5 hover:underline">
                    <span>{isAr ? 'عرض التفاصيل' : 'View'}</span>
                    <span className="material-symbols-outlined text-[12px]">
                      {isAr ? 'arrow_back' : 'arrow_forward'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Delete Icon */}
              <button
                type="button"
                onClick={(e) => handleDeleteItem(e, notif.id)}
                className="text-gray-300 hover:text-red-500 p-1 rounded-lg hover:bg-white transition-colors"
                title={isAr ? 'حذف الإشعار' : 'Delete'}
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
              </button>
            </div>
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 mb-3">
              <span className="material-symbols-outlined text-[28px]">notifications_off</span>
            </div>
            <span className="text-xs font-bold text-slate-700 block mb-1">
              {isAr ? 'لا توجد إشعارات في هذا القسم' : 'No notifications in this category'}
            </span>
            <span className="text-[11px] text-gray-400 max-w-xs">
              {isAr ? 'سيتم إشعارك فور وصول تحديثات جديدة تخص دورك في المنصة.' : 'You will be notified immediately when relevant updates arrive.'}
            </span>
          </div>
        )}
      </div>

      {/* 4. Footer with Settings Shortcut */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs shrink-0">
        <button
          onClick={() => {
            setActiveTab('settings');
            onClose();
          }}
          className="flex items-center gap-1.5 text-gray-600 hover:text-slate-900 font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          <span>{isAr ? 'تخصيص الإشعارات' : 'Notification Preferences'}</span>
        </button>

        <span className="text-[10px] text-gray-400 font-mono">
          EG-Commerce Pulse
        </span>
      </div>
    </div>
  );
}
