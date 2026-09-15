import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AuthService, DEMO_USERS } from '../services/AuthService';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser, setRole, isAr, setSelectedMerchantId } = useApp();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('buyer');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
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

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await AuthService.signInWithEmail(email, password);
      } else {
        await AuthService.signUpWithEmail(email, password, selectedRole, name);
      }
      
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.role) setRole(currentUser.role);
        if (currentUser.role === 'merchant') {
          setSelectedMerchantId('m-01');
        }
      }
      
      setIsAuthModalOpen(false);
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. يمكنك تجربة الدخول السريع بنقرة واحدة أدناه.');
    } finally {
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
        setSelectedMerchantId('m-01');
      }
      setIsAuthModalOpen(false);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء الدخول التجريبي');
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
        className="bg-white rounded-3xl w-full max-w-md p-5 sm:p-7 shadow-2xl relative animate-scale-up my-auto" 
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

        <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
          {mode === 'login' ? (isAr ? 'تسجيل الدخول' : 'Sign In') : (isAr ? 'إنشاء حساب جديد' : 'Create Account')}
        </h2>
        
        <p id="auth-modal-description" className="text-slate-500 text-xs sm:text-sm mb-4">
          {mode === 'login' 
            ? (isAr ? 'مرحباً بك في منصة egyptian-commerce.com' : 'Welcome to egyptian-commerce.com') 
            : (isAr ? 'انضم إلى مجتمع التجارة المصرية الآن' : 'Join the Egyptian Commerce network today')}
        </p>

        {/* 1-Click Quick Demo Logins Bar */}
        <div className="mb-5 p-3.5 bg-gradient-to-r from-red-50/70 via-amber-50/50 to-slate-50 border border-red-100/80 rounded-2xl">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-black text-[#d00000] flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              {isAr ? 'دخول تجريبي فوري بنقرة واحدة (بدون كلمة سر)' : '1-Click Quick Demo Login'}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">جاهز</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('merchant')}
              className="flex items-center gap-2 p-2 bg-white hover:bg-red-50/50 border border-gray-200 hover:border-red-200 rounded-xl transition-all text-start group shadow-2xs active:scale-98"
            >
              <img src="/images/brands/talieska_logo.jpg" alt="Merchant" className="w-7 h-7 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold text-slate-900 truncate group-hover:text-[#d00000]">
                  {isAr ? 'تاجر: تاليسكا' : 'Merchant'}
                </span>
                <span className="block text-[9px] text-gray-500 truncate">Talieska Studio</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('creator')}
              className="flex items-center gap-2 p-2 bg-white hover:bg-purple-50/50 border border-gray-200 hover:border-purple-200 rounded-xl transition-all text-start group shadow-2xs active:scale-98"
            >
              <img src="/images/reels/reel_2.jpg" alt="Creator" className="w-7 h-7 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold text-slate-900 truncate group-hover:text-purple-600">
                  {isAr ? 'صانع محتوى' : 'Creator'}
                </span>
                <span className="block text-[9px] text-gray-500 truncate">ياسمين السيد</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('buyer')}
              className="flex items-center gap-2 p-2 bg-white hover:bg-emerald-50/50 border border-gray-200 hover:border-emerald-200 rounded-xl transition-all text-start group shadow-2xs active:scale-98"
            >
              <img src="/images/reels/reel_1.jpg" alt="Buyer" className="w-7 h-7 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold text-slate-900 truncate group-hover:text-emerald-600">
                  {isAr ? 'مشتري / متسوق' : 'Buyer'}
                </span>
                <span className="block text-[9px] text-gray-500 truncate">مريم الشافعي</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="flex items-center gap-2 p-2 bg-white hover:bg-slate-100 border border-gray-200 rounded-xl transition-all text-start group shadow-2xs active:scale-98"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                EG
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-[11px] font-bold text-slate-900 truncate">
                  {isAr ? 'مدير المنصة' : 'Superadmin'}
                </span>
                <span className="block text-[9px] text-gray-500 truncate">لوحة التحكم العليا</span>
              </div>
            </button>
          </div>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-3 text-[11px] text-gray-400 font-bold">
            {isAr ? 'أو تسجيل الدخول اليدوي' : 'Or Manual Sign In'}
          </span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

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
