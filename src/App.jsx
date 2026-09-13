import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import QuickBuyDrawer from './components/common/QuickBuyDrawer';

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
  const { activeTab, language } = useApp();

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
        return <AddProductStudio />;
      case 'studio':
      case 'creator':
        return <CreatorStudio />;

      case 'admin':
        return <AdminDashboard />;
      case 'delivery':
        return <DeliveryDashboard />;
      case 'settings':
        return <Settings />;
      case 'storefront':
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
          {renderActiveScreen()}
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
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
