import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AuthService, DEMO_USERS } from '../services/AuthService';
import EgLogo from './common/EgLogo';

export default function AuthModal() {
  const { 
    user,
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    setUser, 
    setRole, 
    isAr, 
    setSelectedMerchantId,
    refreshData,
    navigateToMyProfile,
    navigateToProfile
  } = useApp();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('buyer');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [demoCategory, setDemoCategory] = useState('merchant');

  const DEMO_LIST = [
    // Merchants
    {
      key: 'merchant_dripfit',
      type: 'merchant',
      name: isAr ? 'دريب فيت ستريت وير' : 'Drip Fit Official',
      sub: isAr ? 'أزياء ستريت وير وتوبات صيفية' : 'Urban Streetwear & Summer Tops',
      handle: '@drip_fit',
      img: '/images/brands/dripfit_logo.png',
      badge: isAr ? 'تاجر رئيسي موثق' : 'Verified Merchant',
      color: 'border-red-200 bg-red-50/40 text-red-700 hover:border-red-400'
    },
    // Creators
    {
      key: 'creator_yasmin',
      type: 'creator',
      name: isAr ? 'ياسمين السيد' : 'Yasmin Sayed',
      sub: isAr ? 'سفيرة براند تاليسكا' : 'Brand Ambassador',
      handle: '@yasmin_style',
      img: '/images/reels/reel_2.jpg',
      badge: '4.95 ⭐',
      color: 'border-purple-200 bg-purple-50/40 text-purple-700 hover:border-purple-400'
    },
    {
      key: 'creator_cairochic',
      type: 'creator',
      name: isAr ? 'كايرو شيك (سارة)' : 'Cairo Chic (Sara)',
      sub: isAr ? 'تنسيق أزياء وبليزرات' : 'Stylist & Blazer UGC',
      handle: '@cairo_chic',
      img: '/images/reels/fashion_citrine_blazer_thumb.jpg',
      badge: '4.98 ⭐',
      color: 'border-pink-200 bg-pink-50/40 text-pink-700 hover:border-pink-400'
    },
    {
      key: 'creator_salma',
      type: 'creator',
      name: isAr ? 'سلمى ستايلز' : 'Salma Styles',
      sub: isAr ? 'قمصان وأوفرسايز' : 'Casual & Streetwear',
      handle: '@salma.styles',
      img: '/images/reels/fashion_oversized_shirt_thumb.jpg',
      badge: '4.88 ⭐',
      color: 'border-indigo-200 bg-indigo-50/40 text-indigo-700 hover:border-indigo-400'
    },
    // Buyers
    {
      key: 'buyer_mariam',
      type: 'buyer',
      name: isAr ? 'مريم الشافعي' : 'Mariam El-Shafei',
      sub: isAr ? 'متسوقة نشطة • 450 نقطة' : 'Active Shopper • 450 pts',
      handle: '@mariam_sh',
      img: '/images/reels/reel_1.jpg',
      badge: isAr ? 'متسوق' : 'Shopper',
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-700 hover:border-emerald-400'
    },
    {
      key: 'buyer_nourhan',
      type: 'buyer',
      name: isAr ? 'نورهان كريم' : 'Nourhan Karim',
      sub: isAr ? 'متسوقة بالإسكندرية' : 'Alexandria Shopper',
      handle: '@nourhan_k',
      img: '/images/reels/reel_2.jpg',
      badge: isAr ? 'متسوق' : 'Shopper',
      color: 'border-teal-200 bg-teal-50/40 text-teal-700 hover:border-teal-400'
    },
    // Admin
    {
      key: 'admin',
      type: 'admin',
      name: isAr ? 'مدير المنصة العام' : 'Platform SuperAdmin',
      sub: isAr ? 'صلاحيات الإدارة والتحكم' : 'Full Platform Access',
      handle: '@superadmin',
      img: null,
      badge: 'SuperAdmin',
      color: 'border-slate-300 bg-slate-100 text-slate-800 hover:border-slate-500'
    }
  ];

  const filteredDemoList = demoCategory === 'all' 
    ? DEMO_LIST 
    : DEMO_LIST.filter(d => d.type === demoCategory);
  
  const modalRef = useRef(null);
  
  // Escape key & focus management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        setIsAuthModalOpen(false);
      }
    };

    if (isAuthModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      if (modalRef.current) {
        setTimeout(() => {
          const firstInput = modalRef.current.querySelector('input');
          if (firstInput) firstInput.focus();
        }, 50);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAuthModalOpen, mode]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setError('');
      setLoading(false);
    }
  }, [isAuthModalOpen, mode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail) {
      setError(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email address');
      return;
    }
    if (!password) {
      setError(isAr ? 'يرجى إدخال كلمة المرور' : 'Please enter your password');
      return;
    }

    setLoading(true);

    // Safety watchdog: ensure loading never hangs under any circumstance
    const timeoutWatchdog = setTimeout(() => {
      setLoading(false);
      setError(isAr ? 'استغرقت العملية وقتاً أطول من المتوقع. يرجى المحاولة مرة أخرى.' : 'Operation took longer than expected. Please try again.');
    }, 6000);

    try {
      let authRes;
      if (mode === 'login') {
        authRes = await AuthService.signInWithEmail(trimmedEmail, password);
      } else {
        authRes = await AuthService.signUpWithEmail(trimmedEmail, password, selectedRole, name);
      }
      
      const userToSet = authRes?.user || (await AuthService.getCurrentUser());
      clearTimeout(timeoutWatchdog);

      if (userToSet) {
        setUser(userToSet);
        if (userToSet.role) {
          setRole(userToSet.role);
        }
        if (userToSet.role === 'merchant') {
          setSelectedMerchantId(userToSet.merchant_id || `m-${userToSet.id}`);
        }
        
        // Immediately close modal and unblock UI
        setIsAuthModalOpen(false);
        setLoading(false);

        // Run data refresh asynchronously without blocking user
        try {
          refreshData(userToSet).catch(err => console.warn('Background refreshData notice:', err));
        } catch (e) {}
        window.dispatchEvent(new Event('eg_profiles_updated'));
        return;
      }
      
      setIsAuthModalOpen(false);
    } catch (err) {
      clearTimeout(timeoutWatchdog);
      console.error('Auth submit error:', err);
      setError(err.message || (isAr ? 'فشل تسجيل الدخول. يمكنك تجربة الدخول السريع بنقرة واحدة أدناه.' : 'Login failed. You can use 1-Click Quick Demo Login below.'));
    } finally {
      clearTimeout(timeoutWatchdog);
      setLoading(false);
    }
  };

  const handleDemoLogin = async (roleKey) => {
    setError('');
    setLoading(true);
    try {
      const demoUser = await AuthService.loginAsDemo(roleKey);
      setUser(demoUser);
      setRole(demoUser.role);
      if (demoUser.role === 'merchant') {
        setSelectedMerchantId(demoUser.merchant_id || '171842bd-daed-40ef-853f-917eab2ed437');
      }
      setIsAuthModalOpen(false);
      setLoading(false);
      try {
        refreshData(demoUser).catch(err => console.warn('Background refreshData notice:', err));
      } catch (e) {}
      window.dispatchEvent(new Event('eg_profiles_updated'));
    } catch (err) {
      setError(err.message || (isAr ? 'حدث خطأ أثناء الدخول التجريبي' : 'Error during demo sign-in'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAuthModalOpen(false);
      }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative animate-scale-up my-auto max-h-[90vh] overflow-y-auto" 
        dir={isAr ? 'rtl' : 'ltr'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
      >
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d00000]`}
          aria-label={isAr ? "إغلاق النافذة" : "Close modal"}
        >
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </button>

        <div className="flex items-center gap-2 mb-2">
          <EgLogo className="w-9 h-9" />
          <span className="text-xs font-black tracking-wider text-slate-800 uppercase">EG-Commerce</span>
        </div>

        <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
          {mode === 'login' ? (isAr ? 'تسجيل الدخول' : 'Sign In') : (isAr ? 'إنشاء حساب جديد' : 'Create Account')}
        </h2>
        
        <p id="auth-modal-description" className="text-slate-500 text-xs sm:text-sm mb-3.5">
          {mode === 'login' 
            ? (isAr ? 'مرحباً بك في منصة egyptian-commerce.com' : 'Welcome to egyptian-commerce.com') 
            : (isAr ? 'انضم إلى مجتمع التجارة المصرية الآن' : 'Join the Egyptian Commerce network today')}
        </p>

        {/* 1-Click Quick Demo Switcher - Admin Only */}
        {user && (user.role === 'admin' || user.role === 'superadmin') && (
          <>
            <div className="mb-4 p-3.5 bg-gradient-to-r from-red-50/60 via-amber-50/40 to-slate-50 border border-red-100/80 rounded-2xl">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-black text-[#d00000] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
                  {isAr ? 'تبديل الحسابات (مخصص لمشرفي النظام فقط)' : 'Admin Account Switcher'}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">Admin Mode</span>
              </div>

              {/* Persona Filter Tabs */}
              <div className="flex items-center gap-1 mb-2.5 overflow-x-auto pb-1 no-scrollbar text-[10px] font-bold">
                {[
                  { id: 'merchant', label: isAr ? 'المتاجر (3)' : 'Merchants (3)' },
                  { id: 'creator', label: isAr ? 'صناع المحتوى (3)' : 'Creators (3)' },
                  { id: 'buyer', label: isAr ? 'المشترين (2)' : 'Buyers (2)' },
                  { id: 'admin', label: isAr ? 'الإدارة' : 'Admin' },
                  { id: 'all', label: isAr ? 'الكل' : 'All' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDemoCategory(tab.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all shrink-0 ${
                      demoCategory === tab.id
                        ? 'bg-[#d00000] text-white shadow-xs'
                        : 'bg-white/80 text-slate-600 hover:bg-white border border-slate-200/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Persona Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
                {filteredDemoList.map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleDemoLogin(item.key)}
                    className={`flex items-center gap-2 p-2 bg-white rounded-xl border transition-all text-start group shadow-2xs active:scale-[0.98] ${item.color}`}
                  >
                    {item.img ? (
                      <img src={item.img} alt={item.name} className="w-8 h-8 rounded-lg object-cover shrink-0 border border-black/5" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        EG
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="block text-[11px] font-bold text-slate-900 truncate group-hover:text-[#d00000]">
                          {item.name}
                        </span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-white/80 border border-black/5 font-semibold shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      <span className="block text-[9px] text-gray-500 truncate">
                        {item.sub}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-bold">
                {isAr ? 'أو تسجيل الدخول اليدوي' : 'Or Manual Sign In'}
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </>
        )}

        {error && (
          <div 
            className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 border border-red-100 flex items-start gap-2"
            role="alert"
            aria-live="assertive"
          >
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="auth-name" className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input 
                  id="auth-name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
                  placeholder={isAr ? "مثال: مريم الشافعي" : "e.g. Mariam El-Shafei"}
                  required
                />
              </div>

              <div>
                <label htmlFor="auth-role" className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'نوع الحساب المطلوب' : 'Account Role'}
                </label>
                <select
                  id="auth-role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all font-medium text-slate-700"
                >
                  <option value="buyer">{isAr ? 'مشتري / متسوق (Buyer)' : 'Buyer / Shopper'}</option>
                  <option value="merchant">{isAr ? 'تاجر / متجر مستقل (Merchant Boutique)' : 'Merchant Boutique'}</option>
                  <option value="creator">{isAr ? 'صانع محتوى وفيديوهات (Creator / UGC)' : 'Content Creator / UGC'}</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input 
              id="auth-email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all text-left"
              placeholder="user@egyptian-commerce.com"
              autoComplete="email"
              required
              aria-invalid={!!error}
              dir="ltr"
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <input 
                id="auth-password"
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all pe-10 text-left"
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                aria-invalid={!!error}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'left-3' : 'right-3'} text-gray-400 hover:text-gray-600 focus:outline-none`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#d00000] text-white font-bold py-3 rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100 mt-2 focus:outline-none focus:ring-4 focus:ring-red-500/30 shadow-md shadow-red-500/20 text-xs sm:text-sm"
          >
            {loading ? (isAr ? 'جاري التحقق...' : 'Checking...') : (mode === 'login' ? (isAr ? 'دخول' : 'Sign In') : (isAr ? 'إنشاء الحساب' : 'Create Account'))}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-xs font-bold text-slate-600 hover:text-[#d00000] focus:outline-none focus:underline"
          >
            {mode === 'login' 
              ? (isAr ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'Need an account? Register') 
              : (isAr ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Sign In')}
          </button>
        </div>

      </div>
    </div>
  );
}
