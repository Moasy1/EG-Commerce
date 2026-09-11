import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import DeviceFrame from './components/layout/DeviceFrame';
import QuickBuyDrawer from './components/common/QuickBuyDrawer';

import DiscoverReels from './pages/DiscoverReels';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import UnifiedCart from './pages/UnifiedCart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import RewardsHub from './pages/RewardsHub';
import CreatorStudio from './pages/CreatorStudio';
import MerchantCampaign from './pages/MerchantCampaign';
import ProfileCloset from './pages/ProfileCloset';

function MainContent() {
  const { activeTab } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'reels':
        return <DiscoverReels />;
      case 'shop':
        return <Marketplace />;
      case 'product':
        return <ProductDetail />;
      case 'cart':
        return <UnifiedCart />;
      case 'checkout':
        return <Checkout />;
      case 'tracking':
        return <OrderTracking />;
      case 'rewards':
        return <RewardsHub />;
      case 'studio':
        return <CreatorStudio />;
      case 'merchant':
        return <MerchantCampaign />;
      case 'profile':
        return <ProfileCloset />;
      default:
        return <DiscoverReels />;
    }
  };

  return (
    <DeviceFrame>
      <div className="min-h-screen bg-surface flex flex-col relative text-on-surface">
        <Header />
        
        <main className="flex-1 flex flex-col">
          {renderActiveScreen()}
        </main>

        <QuickBuyDrawer />
        <BottomNav />
      </div>
    </DeviceFrame>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
