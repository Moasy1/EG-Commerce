import React from 'react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'reels', label: 'اكتشاف', icon: 'play_circle' },
    { id: 'shop', label: 'السوق', icon: 'storefront' },
    { id: 'rewards', label: 'المكافآت', icon: 'stars' },
    { id: 'studio', label: 'ستوديو', icon: 'video_camera_front' },
    { id: 'profile', label: 'خزانتي', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-surface-container-high md:hidden shadow-lg">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id || 
            (item.id === 'shop' && activeTab === 'product') ||
            (item.id === 'profile' && (activeTab === 'cart' || activeTab === 'checkout' || activeTab === 'tracking'));
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-primary scale-105'
                  : 'text-on-surface-variant/80 hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]" style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
                }}>
                  {item.icon}
                </span>
                {item.id === 'rewards' && (
                  <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-secondary" />
                )}
              </div>
              <span className={`text-[11px] mt-0.5 font-medium tracking-tight ${
                isActive ? 'font-bold text-primary' : ''
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
