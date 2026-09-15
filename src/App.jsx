import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import QuickBuyDrawer from './components/common/QuickBuyDrawer';
import ErrorBoundary from './components/common/ErrorBoundary';

import DiscoverReels from './pages/DiscoverReels';
import Marketplace from './pages/Marketplace';
import CategoryPage from './pages/CategoryPage';
import ProductDetail from './pages/ProductDetail';
import UnifiedCart from './pages/UnifiedCart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import RewardsHub from './pages/RewardsHub';
import CreatorStudio from './pages/CreatorStudio';
import MerchantCampaign from './pages/MerchantCampaign';
import ProfileCloset from './pages/ProfileCloset';
import MerchantStorefront from './pages/MerchantStorefront';
import MerchantDashboard from './pages/MerchantDashboard';
import ScreenShowcase from './pages/ScreenShowcase';
import AddProductStudio from './pages/AddProductStudio';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Settings from './pages/Settings';
import AuthModal from './components/AuthModal';
import { AuthService } from './services/AuthService';

function ProtectedRoute({ requiredRole, title, description, children }) {
  const { user, setUser, setRole, setSelectedMerchantId, setIsAuthModalOpen, language, setActiveTab } = useApp();
  const isAr = language === 'ar';

  const isSuperadmin = user?.role === 'superadmin' || user?.role === 'admin';
  const hasAccess = isSuperadmin || (
    Array.isArray(requiredRole) 
      ? requiredRole.includes(user?.role) 
      : user?.role === requiredRole
  );

  const handleQuickDemoLogin = async () => {
    const targetRole = Array.isArray(requiredRole) ? requiredRole[0] : (requiredRole || 'admin');
    const roleKey = (targetRole === 'superadmin' || targetRole === 'admin') ? 'admin' : targetRole;
    const demoUser = await AuthService.loginAsDemo(roleKey);
    setUser(demoUser);
    setRole(demoUser.role);
    if (demoUser.role === 'merchant') setSelectedMerchantId('m-01');
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-red-100 text-[#d00000] flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[36px]">lock</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {title || (isAr ? 'تسجيل الدخول مطلوب' : 'Authentication Required')}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          {description || (isAr 
            ? 'هذا القسم مخصص فقط للمستخدمين المصرح لهم. يرجى تسجيل الدخول بحساب مصرح للوصول إلى لوحة التحكم.' 
            : 'This section requires authorized credentials. Please sign in to proceed.')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleQuickDemoLogin}
            className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">bolt</span>
            <span>{isAr ? 'دخول فوري كمسؤول تجريبي (1-Click)' : '1-Click Demo Login'}</span>
          </button>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            {isAr ? 'تسجيل الدخول الآن' : 'Sign In Now'}
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className="px-4 py-2.5 rounded-full border border-gray-300 hover:bg-gray-100 text-slate-700 text-xs font-bold transition-all"
          >
            {isAr ? 'العودة للرئيسية' : 'Return Home'}
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm">
          <span className="material-symbols-outlined text-[36px]">shield_person</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {isAr ? 'غير مصرح بالوصول لهذا الحساب' : 'Access Restricted for Current Account'}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          {isAr 
            ? `أنت مسجل حالياً كـ (${user.role}). هذا القسم متاح فقط للمشرفين أو الحسابات المصرح لها.` 
            : `You are signed in as (${user.role}). This section requires elevated permissions.`}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleQuickDemoLogin}
            className="px-5 py-2.5 rounded-full bg-[#d00000] hover:bg-red-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px]">bolt</span>
            <span>{isAr ? 'ترقية الصلاحية فوراً (1-Click)' : '1-Click Elevate Role'}</span>
          </button>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 rounded-full border border-gray-300 hover:bg-gray-100 text-slate-700 text-xs font-bold transition-all"
          >
            {isAr ? 'تبديل الحساب' : 'Switch Account'}
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className="px-4 py-2.5 rounded-full border border-gray-300 hover:bg-gray-100 text-slate-700 text-xs font-bold transition-all"
          >
            {isAr ? 'العودة للرئيسية' : 'Return Home'}
          </button>
        </div>
      </div>
    );
  }

  return children;
}

function MainContent() {
  const { activeTab, setActiveTab, language, isSubdomainMode } = useApp();

  useEffect(() => {
    window.__resetToReels = () => {
      if (isSubdomainMode) {
        setActiveTab('storefront');
      } else {
        setActiveTab('reels');
      }
    };
    return () => {
      delete window.__resetToReels;
    };
  }, [setActiveTab, isSubdomainMode]);

  // 1. PURE SHOPIFY-STYLE SUBDOMAIN BOUTIQUE MODE
  // When accessed via subdomain (e.g. talieska.egyptian-commerce.com or ?subdomain=talieska)
  // We ONLY render the merchant's isolated boutique, its cart, checkout, and product details.
  // NO platform Header, NO bottom discovery navigation!
  if (isSubdomainMode) {
    const renderSubdomainScreen = () => {
      switch (activeTab) {
        case 'product':
          return <ProductDetail />;
        case 'cart':
          return <UnifiedCart />;
        case 'checkout':
          return <Checkout />;
        case 'tracking':
          return <OrderTracking />;
        case 'admin':
        case 'superadmin':
          return (
            <ProtectedRoute 
              requiredRole={['superadmin', 'admin']}
              title="لوحة الإدارة المركزية • Superadmin Platform Portal"
              description="لوحة الإدارة والتحكم في المستخدمين والمتاجر ومراقبة المعاملات مخصصة فقط للمشرف العام."
            >
              <AdminDashboard />
            </ProtectedRoute>
          );
        case 'dashboard':
        case 'merchant':
          return (
            <ProtectedRoute 
              requiredRole={['merchant', 'superadmin', 'admin']}
              title="لوحة التاجر • Merchant Seller Hub"
              description="لوحة التحكم والطلبات والمبيعات خاصة بالتجار المعتمدين والمشرف العام فقط."
            >
              <MerchantDashboard />
            </ProtectedRoute>
          );
        case 'storefront':
        default:
          return <MerchantStorefront />;
      }
    };

    return (
      <div 
        dir={language === 'ar' ? 'rtl' : 'ltr'} 
        className="min-h-screen bg-[#080808] text-white flex flex-col relative font-sans"
      >
        <main className="flex-1 flex flex-col w-full min-h-0">
          <div key={activeTab} className="w-full flex-1 flex flex-col animate-page-enter">
            <ErrorBoundary key={activeTab} onReset={() => setActiveTab('storefront')}>
              {renderSubdomainScreen()}
            </ErrorBoundary>
          </div>
        </main>

        <AuthModal />
        <QuickBuyDrawer />
      </div>
    );
  }

  // 2. MAIN PLATFORM MODE (egyptian-commerce.com - Reels, Hub, Discovery, Studio)
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'reels':
        return <DiscoverReels />;
      case 'shop':
        return <Marketplace />;
      case 'category':
        return <CategoryPage />;
      case 'product':
        return <ProductDetail />;
      case 'cart':
        return <UnifiedCart />;
      case 'checkout':
        return <Checkout />;
      case 'dashboard':
      case 'merchant':
        return (
          <ProtectedRoute 
            requiredRole={['merchant', 'superadmin', 'admin']}
            title="لوحة التاجر • Merchant Seller Hub"
            description="لوحة التحكم والطلبات والمبيعات خاصة بالتجار المعتمدين والمشرف العام فقط."
          >
            <MerchantDashboard />
          </ProtectedRoute>
        );
      case 'add_product':
      case 'add-product':
        return (
          <ProtectedRoute 
            requiredRole={['merchant', 'superadmin', 'admin']}
            title="إضافة منتج • Add Product Studio"
            description="إضافة منتجات جديدة إلى السوق متاح للتجار المعتمدين."
          >
            <AddProductStudio />
          </ProtectedRoute>
        );
      case 'merchant_campaign':
        return (
          <ProtectedRoute 
            requiredRole={['merchant', 'superadmin', 'admin']}
            title="حملات التاجر • Merchant Campaigns"
          >
            <MerchantCampaign />
          </ProtectedRoute>
        );
      case 'studio':
      case 'creator':
        return (
          <ProtectedRoute 
            requiredRole={['creator', 'merchant', 'superadmin', 'admin']}
            title="استوديو المبدعين • Creator Studio"
            description="لوحة صناع المحتوى وتحليلات الأرباح والشراكات مع البراندات."
          >
            <CreatorStudio />
          </ProtectedRoute>
        );
      case 'admin':
      case 'superadmin':
        return (
          <ProtectedRoute 
            requiredRole={['superadmin', 'admin']}
            title="لوحة الإدارة المركزية • Superadmin Platform Portal"
            description="لوحة الإدارة والتحكم في المستخدمين والمتاجر ومراقبة المعاملات مخصصة فقط للمشرف العام."
          >
            <AdminDashboard />
          </ProtectedRoute>
        );
      case 'delivery':
        return (
          <ProtectedRoute 
            requiredRole={['driver', 'superadmin', 'admin']}
            title="بوابة المناديب • Rider Portal"
            description="بوابة مناديب التوصيل والشحنات المتاحة."
          >
            <DeliveryDashboard />
          </ProtectedRoute>
        );
      case 'settings':
        return <Settings />;
      case 'storefront':
      case 'merchant-storefront':
        return <MerchantStorefront />;
      case 'tracking':
        return <OrderTracking />;
      case 'rewards':
        return <RewardsHub />;
      case 'profile':
        return <ProfileCloset />;
      case 'showcase':
        return <ScreenShowcase />;
      default:
        return <DiscoverReels />;
    }
  };

  return (
    <div 
      dir={language === 'ar' ? 'rtl' : 'ltr'} 
      className={`${activeTab === 'reels' ? 'h-dvh overflow-hidden' : 'min-h-screen'} bg-[#fcfbfa] flex flex-col relative text-slate-900 ${
        language === 'ar' ? 'font-sans' : 'font-sans'
      }`}
    >
      <div className={activeTab === 'reels' ? 'hidden md:block' : 'block'}>
        <Header />
      </div>
      
      <main className={`flex-1 flex flex-col w-full min-h-0 ${activeTab === 'reels' ? 'overflow-hidden' : ''}`}>
        <div 
          key={activeTab} 
          className={`w-full flex-1 flex flex-col ${activeTab === 'reels' ? 'h-full' : 'animate-page-enter'}`}
        >
          <ErrorBoundary key={activeTab} onReset={() => setActiveTab('reels')}>
            {renderActiveScreen()}
          </ErrorBoundary>
        </div>
      </main>

      <AuthModal />
      <QuickBuyDrawer />
      
      {/* Mobile-only bottom navigation bar */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
