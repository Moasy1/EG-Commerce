import React from 'react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'reels', label: 'Reels', icon: 'play_circle' },
    { id: 'shop', label: 'Shop', icon: 'storefront' },
    { id: 'rewards', label: 'Rewards', icon: 'stars' },
    { id: 'studio', label: 'Studio', icon: 'video_camera_front' },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl border-t border-surface-container-high md:hidden shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
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
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[23px]" style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
                }}>
                  {item.icon}
                </span>
                {item.id === 'rewards' && (
                  <span className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-secondary" />
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${
                isActive ? 'font-bold text-primary' : 'font-medium'
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
