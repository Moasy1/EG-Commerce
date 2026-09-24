import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';

const PRESET_AVATARS = [
  { id: 'drip-fit', name: 'Talieska Logo', url: '/images/brands/dripfit_logo.png' },
  { id: 'yasmin', name: 'Yasmin (Creator)', url: '/images/reels/reel_2.jpg' },
  { id: 'cairo_chic', name: 'Cairo Chic (Blazer)', url: '/images/reels/fashion_citrine_blazer_thumb.jpg' },
  { id: 'salma', name: 'Salma (Linen)', url: '/images/reels/fashion_oversized_shirt_thumb.jpg' },
  { id: 'mariam', name: 'Mariam (Buyer)', url: '/images/reels/reel_1.jpg' },
  { id: 'khan', name: 'Khan Craft (Artisan)', url: '/images/products/copper_lantern.jpg' }
];

const EGYPTIAN_CITIES = [
  'القاهرة (Cairo)',
  'الجيزة (Giza)',
  'الإسكندرية (Alexandria)',
  'المنصورة (Mansoura)',
  'طنطا والغربية (Tanta)',
  'الساحل الشمالي ومطروح (North Coast)',
  'بورسعيد (Port Said)',
  'الإسماعيلية والسويس (Canal Cities)',
  'أسيوط والصعيد (Upper Egypt)'
];

export default function Settings() {
  const { user, updateUserProfile, language, setLanguage, isAr, setActiveTab } = useApp();
  const [activeTabName, setActiveSettingsTab] = useState('profile');

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('القاهرة (Cairo)');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/images/reels/reel_1.jpg');
  
  // UI states
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  // Notification Preferences State
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('eg_notification_prefs');
      return saved ? JSON.parse(saved) : { orders: true, promos: true, ugc: true, sms: false };
    } catch (e) {
      return { orders: true, promos: true, ugc: true, sms: false };
    }
  });

  // Sync user state into form fields when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || user.profile?.name || user.user_metadata?.name || '');
      setUsername(user.username || user.profile?.username || (user.email ? user.email.split('@')[0] : ''));
      setPhone(user.phone || user.profile?.phone || '');
      setBio(user.bio || user.profile?.bio || '');
      setLocation(user.location || user.profile?.location || 'القاهرة (Cairo)');
      setWebsite(user.website || user.profile?.website || '');
      setAvatarUrl(user.avatar_url || user.profile?.avatar_url || '/images/reels/reel_1.jpg');
    }
  }, [user]);

  const handleSignOut = async () => {
    await AuthService.signOut();
    window.location.reload();
  };

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStatusMessage({
          type: 'error',
          text: isAr ? 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت' : 'Image too large. Please select an image under 2MB.'
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
        setIsAvatarPickerOpen(false);
        setStatusMessage({
          type: 'success',
          text: isAr ? 'تم تحميل الصورة، اضغط "حفظ التغييرات" لتثبيتها' : 'Photo uploaded. Click "Save Changes" to apply.'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMessage({
        type: 'error',
        text: isAr ? 'يرجى إدخال اسم صحيح' : 'Please enter a valid name'
      });
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const updates = {
        name: name.trim(),
        displayName: name.trim(),
        username: username.trim().replace(/^@/, ''),
        phone: phone.trim(),
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        avatar_url: avatarUrl
      };

      if (updateUserProfile) {
        await updateUserProfile(updates);
      } else {
        await AuthService.updateCurrentUser(updates);
      }

      setStatusMessage({
        type: 'success',
        text: isAr ? 'تم حفظ بيانات الملف الشخصي بنجاح في قاعدة البيانات! ✨' : 'Profile updated and saved to database successfully! ✨'
      });

      // Clear toast after 4 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setStatusMessage({
        type: 'error',
        text: isAr ? 'حدث خطأ أثناء حفظ الملف الشخصي. يرجى المحاولة مرة أخرى.' : 'Error updating profile. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      localStorage.setItem('eg_notification_prefs', JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div className="w-full flex-1 max-w-4xl mx-auto px-4 md:px-6 py-4 pb-28 md:pb-12 text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-black">{isAr ? 'إدارة الملف الشخصي والإعدادات' : 'Profile & Account Settings'}</h1>
          <p className="text-xs text-gray-500 mt-1">{isAr ? 'تحكم في بياناتك، هويتك الرقمية، وتفضيلات المنصة' : 'Manage your real profile identity, store links, and preferences'}</p>
        </div>
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-slate-700 hover:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">{isAr ? 'arrow_forward' : 'arrow_back'}</span>
          <span>{isAr ? 'العودة للبروفايل' : 'Back to Profile'}</span>
        </button>
      </div>

      {/* Notification Toast / Alert */}
      {statusMessage && (
        <div 
          className={`mb-5 p-3.5 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-sm animate-fade-in ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {statusMessage.type === 'success' ? 'check_circle' : 'error'}
          </span>
          <span className="flex-1">{statusMessage.text}</span>
          <button 
            onClick={() => setStatusMessage(null)}
            className="hover:opacity-70"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveSettingsTab('profile')}
            className={`w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTabName === 'profile' ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">account_circle</span>
            <span>{isAr ? 'الملف الشخصي' : 'Profile Management'}</span>
          </button>
          
          <button 
            onClick={() => setActiveSettingsTab('preferences')}
            className={`w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTabName === 'preferences' ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span>{isAr ? 'التفضيلات واللغة' : 'Preferences & Language'}</span>
          </button>
          
          <button 
            onClick={() => setActiveSettingsTab('notifications')}
            className={`w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTabName === 'notifications' ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span>{isAr ? 'الإشعارات والتنبيهات' : 'Notifications'}</span>
          </button>

          <button 
            onClick={() => setActiveSettingsTab('security')}
            className={`w-full text-start flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTabName === 'security' ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">security</span>
            <span>{isAr ? 'الأمان والصلاحيات' : 'Security & Roles'}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-5 md:p-7 shadow-sm">
          
          {/* 1. REAL PROFILE MANAGEMENT TAB */}
          {activeTabName === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{isAr ? 'تعديل الملف الشخصي والمتجر' : 'Edit Profile & Storefront'}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isAr ? 'يتم حفظ التعديلات فوراً ومزامنتها مع الخادم وقاعدة البيانات' : 'Edits are synchronized directly with your account and database'}
                  </p>
                </div>
                {user?.role && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                    {user.role}
                  </span>
                )}
              </div>

              {/* Merchant Storefront Setup & Onboarding Action Bar */}
              {user?.role === 'merchant' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent border border-red-200/80 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d00000] text-white flex items-center justify-center shrink-0 shadow-md">
                        <span className="material-symbols-outlined text-[22px]">store</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                          <span>{isAr ? 'إعدادات متجر التاجر المعتمد' : 'Verified Merchant Storefront'}</span>
                          <span className="material-symbols-outlined text-[16px] text-blue-500">verified</span>
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {isAr 
                            ? 'أكمل بيانات متجرك وارفع الشعار والاسم، ثم أضف أول منتجاتك لتظهر فوراً في السوق المركزي.' 
                            : 'Set up your store logo and identity, then publish products to appear live on the marketplace.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveTab('add_product')}
                        className="px-3.5 py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_circle</span>
                        <span>{isAr ? 'إضافة منتج جديد' : 'Add Product'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('merchant')}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">dashboard</span>
                        <span>{isAr ? 'لوحة المبيعات' : 'Seller Hub'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('shop')}
                        className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-slate-700 text-xs font-bold hover:bg-gray-50 active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">storefront</span>
                        <span>{isAr ? 'السوق العام' : 'Shop'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Avatar Selector & Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {isAr ? 'صورة الملف الشخصي' : 'Profile Avatar'}
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <img 
                      src={avatarUrl} 
                      alt="Avatar Preview" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-slate-900 shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                      className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow hover:bg-black transition-colors"
                      title={isAr ? 'تغيير الصورة' : 'Change Avatar'}
                    >
                      <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                        className="px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-50 text-slate-700 transition-colors"
                      >
                        {isAr ? 'اختيار من المعرض' : 'Choose Preset'}
                      </button>

                      <label className="px-3 py-1.5 text-xs font-bold rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 cursor-pointer transition-colors flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">upload</span>
                        <span>{isAr ? 'رفع من جهازك' : 'Upload Image'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleAvatarFileUpload}
                          className="hidden" 
                        />
                      </label>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {isAr ? 'يدعم PNG أو JPG أو WebP (الحد الأقصى 2 ميجابايت)' : 'Supports PNG, JPG, or WebP (max 2MB)'}
                    </p>
                  </div>
                </div>

                {/* Preset Avatars Drawer */}
                {isAvatarPickerOpen && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-3 animate-fade-in">
                    <span className="text-[11px] font-bold text-gray-600 block">
                      {isAr ? 'اختر صورة جاهزة تناسب هويتك:' : 'Select a preset avatar:'}
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_AVATARS.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setAvatarUrl(preset.url);
                            setIsAvatarPickerOpen(false);
                          }}
                          className={`p-1 rounded-xl border-2 transition-all flex flex-col items-center ${
                            avatarUrl === preset.url ? 'border-[#d00000] bg-red-50' : 'border-transparent hover:border-gray-300'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-12 h-12 rounded-full object-cover mb-1" />
                          <span className="text-[9px] font-bold text-gray-600 truncate w-full text-center">{preset.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom URL Input */}
                    <div className="pt-2 border-t border-gray-200 flex items-center gap-2">
                      <input
                        type="url"
                        value={customAvatarInput}
                        onChange={(e) => setCustomAvatarInput(e.target.value)}
                        placeholder={isAr ? 'أو ضع رابط صورة مباشر (URL)...' : 'Or enter custom image URL...'}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-gray-200 outline-none focus:border-slate-900 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAvatarInput.trim()) {
                            setAvatarUrl(customAvatarInput.trim());
                            setCustomAvatarInput('');
                            setIsAvatarPickerOpen(false);
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black"
                      >
                        {isAr ? 'تطبيق' : 'Apply'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isAr ? 'الاسم بالكامل / اسم المتجر' : 'Full Name / Store Name'} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={isAr ? 'مثال: ياسمين السيد أو تاليسكا' : 'e.g. Yasmin Sayed'}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none text-sm bg-white" 
                  />
                </div>

                {/* Handle / Username */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isAr ? 'اسم المستخدم (Handle)' : 'Username / Handle'}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute start-3 text-gray-400 font-mono text-xs">@</span>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value.replace(/^@/, '').toLowerCase().trim())}
                      placeholder="username"
                      className="w-full ps-8 pe-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none text-sm bg-white font-mono" 
                    />
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    readOnly 
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none text-sm cursor-not-allowed font-mono" 
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isAr ? 'رقم الهاتف (مصر)' : 'Mobile Phone (Egypt)'}
                  </label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none text-sm bg-white font-mono" 
                  />
                </div>

                {/* City / Location */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isAr ? 'المحافظة / المدينة' : 'City / Governorate'}
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none text-sm bg-white"
                  >
                    {EGYPTIAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Website / Storefront */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {isAr ? 'الموقع الإلكتروني / رابط المتجر' : 'Website / Store Link'}
                  </label>
                  <input 
                    type="text" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="drip-fit.egyptian-commerce.com"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none text-sm bg-white" 
                  />
                </div>
              </div>

              {/* Bio / Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {isAr ? 'نبذة تعريفية (Bio)' : 'Bio / Description'}
                </label>
                <textarea 
                  rows="3"
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                  placeholder={isAr ? 'اكتب نبذة عن نفسك أو عن متجرك ومنتجاتك...' : 'Write a brief description about your store or profile...'}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-slate-900 outline-none text-sm bg-white resize-none" 
                />
                <div className="text-end text-[10px] text-gray-400 mt-1">
                  {bio.length} / 300
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center gap-3">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="py-3 px-6 bg-slate-900 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-black active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{isAr ? 'جارِ الحفظ...' : 'Saving Changes...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>{isAr ? 'حفظ التغييرات' : 'Save Changes'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // Reset to current user values
                    if (user) {
                      setName(user.name || '');
                      setBio(user.bio || '');
                      setPhone(user.phone || '');
                      setUsername(user.username || '');
                      setAvatarUrl(user.avatar_url || '/images/reels/reel_1.jpg');
                      setStatusMessage({
                        type: 'success',
                        text: isAr ? 'تم استعادة البيانات السابقة' : 'Reverted to current data'
                      });
                    }
                  }}
                  className="py-3 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {isAr ? 'إلغاء التعديل' : 'Cancel'}
                </button>
              </div>
            </form>
          )}

          {/* 2. PREFERENCES TAB */}
          {activeTabName === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">{isAr ? 'تفضيلات التطبيق واللغة' : 'App Preferences'}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{isAr ? 'خصص تجربة الاستخدام واللغة المفضلة' : 'Customize interface language and regional settings'}</p>
              </div>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isAr ? 'لغة العرض' : 'Display Language'}</label>
                  <select 
                    value={language} 
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      try { localStorage.setItem('eg_lang', e.target.value); } catch (err) {}
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-slate-900 outline-none text-sm bg-white"
                  >
                    <option value="ar">العربية (Arabic) - الإعداد الافتراضي</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">{isAr ? 'العملة الأساسية' : 'Default Currency'}</label>
                  <select 
                    defaultValue="EGP" 
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-slate-900 outline-none text-sm bg-white"
                  >
                    <option value="EGP">جنيه مصري (EGP - ج.م)</option>
                    <option value="USD">الدولار الأمريكي (USD - $)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. NOTIFICATIONS TAB */}
          {activeTabName === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">{isAr ? 'إعدادات الإشعارات والتنبيهات' : 'Notification Settings'}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{isAr ? 'اختر الإشعارات التي ترغب في استلامها' : 'Control your push, email, and SMS updates'}</p>
              </div>

              <div className="space-y-3.5 divide-y divide-gray-100">
                <label className="flex items-center justify-between pt-2 cursor-pointer">
                  <div>
                    <span className="text-sm font-bold block text-slate-900">{isAr ? 'إشعارات الطلبات والشحن' : 'Order & Shipping Updates'}</span>
                    <span className="text-xs text-gray-400">{isAr ? 'تحديثات مباشرة عن تسليم الطلبات وحالة بوسطة' : 'Real-time delivery milestones & Bosta tracking'}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.orders} 
                    onChange={() => handleToggleNotification('orders')}
                    className="w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer" 
                  />
                </label>

                <label className="flex items-center justify-between pt-3 cursor-pointer">
                  <div>
                    <span className="text-sm font-bold block text-slate-900">{isAr ? 'العروض الترويجية والخصومات' : 'Promotions & Flash Deals'}</span>
                    <span className="text-xs text-gray-400">{isAr ? 'تنبيهات فورية عند انطلاق عروض البراندات' : 'Exclusive discounts from verified Egyptian merchants'}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.promos} 
                    onChange={() => handleToggleNotification('promos')}
                    className="w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer" 
                  />
                </label>

                <label className="flex items-center justify-between pt-3 cursor-pointer">
                  <div>
                    <span className="text-sm font-bold block text-slate-900">{isAr ? 'إشعارات حملات المحتوى (UGC)' : 'UGC Campaign Opportunities'}</span>
                    <span className="text-xs text-gray-400">{isAr ? 'دعوات المشاركة في حملات البراندات للمبدعين' : 'Alerts when brands invite you to create sponsored reels'}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={notifications.ugc} 
                    onChange={() => handleToggleNotification('ugc')}
                    className="w-4 h-4 rounded text-slate-900 accent-slate-900 cursor-pointer" 
                  />
                </label>
              </div>
            </div>
          )}

          {/* 4. SECURITY & ROLES TAB */}
          {activeTabName === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">{isAr ? 'الأمان والصلاحيات' : 'Security & Permissions'}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{isAr ? 'معلومات حسابك ومستوى الصلاحيات في المنصة' : 'Your security level and platform privilege configuration'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{isAr ? 'معرف المستخدم (User ID):' : 'Account UUID:'}</span>
                  <span className="font-mono font-bold text-slate-800">{user?.id || 'guest'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{isAr ? 'الدور المعتمد (Role):' : 'Active Role:'}</span>
                  <span className="px-2 py-0.5 rounded-full font-black uppercase text-[10px] bg-red-100 text-red-700">
                    {user?.role || 'buyer'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">{isAr ? 'رصيد نقاط الولاء:' : 'Reward Balance:'}</span>
                  <span className="font-bold text-emerald-600">{user?.reward_points_balance || 0} {isAr ? 'نقطة' : 'pts'}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">verified_user</span>
                <div>
                  <span className="font-bold block mb-0.5">{isAr ? 'حماية تصعيد الصلاحيات (Row-Level Security)' : 'Role Escalation Protection'}</span>
                  <span>{isAr ? 'لحماية أمان التجار وصناع المحتوى، يتم مراجعة ترقية الصلاحيات من خلال الإدارة المركزية (SuperAdmin).' : 'For safety, changing merchant or creator roles requires administrator verification.'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Sign Out Action */}
          <div className="mt-10 pt-5 border-t border-gray-100 flex items-center justify-between">
            <button 
              type="button"
              onClick={handleSignOut} 
              className="px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>{isAr ? 'تسجيل الخروج من الحساب' : 'Sign out of your account'}</span>
            </button>

            <span className="text-[10px] text-gray-400 font-mono">
              EG-Commerce Engine v2.4
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
