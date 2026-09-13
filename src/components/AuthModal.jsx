import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser, isAr } = useApp();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await AuthService.signInWithEmail(email, password);
      } else {
        await AuthService.signUpWithEmail(email, password, role, name);
      }
      
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      setIsAuthModalOpen(false);
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative" dir={isAr ? 'rtl' : 'ltr'}>
        <button 
          onClick={() => setIsAuthModalOpen(false)}
          className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500`}
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {mode === 'login' ? (isAr ? 'تسجيل الدخول' : 'Sign In') : (isAr ? 'إنشاء حساب' : 'Create Account')}
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {mode === 'login' 
            ? (isAr ? 'مرحباً بعودتك إلى EG Commerce' : 'Welcome back to EG Commerce') 
            : (isAr ? 'انضم إلى مجتمع التسوق المصري' : 'Join the Egyptian commerce community')}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
                  placeholder={isAr ? 'أحمد محمد' : 'Ahmed Mohamed'}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isAr ? 'نوع الحساب' : 'Account Type'}
                </label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
                >
                  <option value="buyer">{isAr ? 'مشتري' : 'Buyer'}</option>
                  <option value="creator">{isAr ? 'صانع محتوى' : 'Creator'}</option>
                  <option value="merchant">{isAr ? 'تاجر' : 'Merchant'}</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'البريد الإلكتروني' : 'Email Address'}
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d00000] focus:bg-white transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#d00000] text-white font-bold py-3.5 rounded-xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:scale-100 mt-2"
          >
            {loading ? '...' : (mode === 'login' ? (isAr ? 'دخول' : 'Sign In') : (isAr ? 'إنشاء حساب' : 'Create Account'))}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm font-bold text-slate-600 hover:text-[#d00000]"
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
