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
        return <MerchantDashboard />;
      case 'add_product':
      case 'add-product':
        return <AddProductStudio />;
      case 'studio':
      case 'creator':
        return <CreatorStudio />;

      case 'admin':
      case 'superadmin':
        return <AdminDashboard />;
      case 'delivery':
        return <DeliveryDashboard />;
      case 'settings':
        return <Settings />;
      case 'storefront':
      case 'merchant-storefront':
        return <MerchantStorefront />;
      case 'merchant_campaign':
        return <MerchantCampaign />;
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
