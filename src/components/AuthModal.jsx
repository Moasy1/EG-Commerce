import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser, setRole, isAr } = useApp();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('user');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const modalRef = useRef(null);
  
  // Basic focus management for accessibility
  useEffect(() => {
    if (isAuthModalOpen && modalRef.current) {
      // Small timeout to ensure rendering is complete before focusing
      setTimeout(() => {
        const firstInput = modalRef.current.querySelector('input');
        if (firstInput) firstInput.focus();
      }, 50);
    }
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
      setUser(currentUser);
      if (currentUser?.role) setRole(currentUser.role);
      
      setIsAuthModalOpen(false);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative" 
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

        <h2 id="auth-modal-title" className="text-2xl font-bold text-slate-900 mb-2">
          {mode === 'login' ? (isAr ? 'تسجيل الدخول' : 'Sign In') : (isAr ? 'إنشاء حساب' : 'Create Account')}
        </h2>
        
        <p id="auth-modal-description" className="text-slate-500 text-sm mb-6">
          {mode === 'login' 
            ? (isAr ? 'مرحباً بعودتك إلى منصتنا' : 'Welcome back to our platform') 
            : (isAr ? 'انضم إلى مجتمعنا الآن' : 'Join our community today')}
        </p>

        {error && (
          <div 
            className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100 flex items-start gap-2"
            role="alert"
            aria-live="assertive"
          >
            <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {mode === 'register' && (
            <>
              <div>
                <label htmlFor="auth-name" className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input 
                  id="auth-name"
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
                  placeholder={isAr ? 'أحمد محمد' : 'Ahmed Mohamed'}
                  autoComplete="name"
                  aria-invalid={!!error}
                />
              </div>

              <div>
                <label htmlFor="auth-role" className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'نوع الحساب' : 'Account Type'}
                </label>
                <select 
                  id="auth-role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
                >
                  <option value="user">{isAr ? 'مستخدم' : 'User'}</option>
                  <option value="merchant">{isAr ? 'تاجر' : 'Merchant'}</option>
                  <option value="driver">{isAr ? 'سائق' : 'Driver'}</option>
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
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
              placeholder={isAr ? 'البريد الإلكتروني' : 'name@example.com'}
              autoComplete={mode === 'login' ? 'email' : 'username'}
              aria-invalid={!!error}
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <input 
              id="auth-password"
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              aria-invalid={!!error}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#d00000] text-white font-bold py-3.5 rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100 mt-2 focus:outline-none focus:ring-4 focus:ring-red-500/30"
          >
            {loading ? (isAr ? 'جاري التحميل...' : 'Loading...') : (mode === 'login' ? (isAr ? 'تسجيل الدخول' : 'Sign In') : (isAr ? 'إنشاء حساب' : 'Create Account'))}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="text-sm font-bold text-slate-600 hover:text-[#d00000] focus:outline-none focus:underline"
          >
            {mode === 'login' 
              ? (isAr ? 'ليس لديك حساب؟ سجل الآن' : 'Need an account? Register') 
              : (isAr ? 'لديك حساب بالفعل؟ سجل دخول' : 'Already have an account? Sign In')}
          </button>
        </div>

      </div>
    </div>
  );
}
