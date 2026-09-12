import React from 'react';
import { useApp } from '../../context/AppContext';

export default function BottomNav() {
  const { activeTab, setActiveTab } = useApp();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-sm max-w-[390px] mx-auto md:relative md:max-w-none">
      <div className="flex items-center justify-between h-14 px-6">
        {/* 1. Home */}
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'reels' ? 'text-[#d00000]' : 'text-gray-400 hover:text-gray-600'
          }`}
          title="Home (Reels)"
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'reels' ? "'FILL' 1" : "'FILL' 0" }}
          >
            home
          </span>
          <span className="text-[10px] font-medium tracking-tight">Home</span>
        </button>

        {/* 2. Explore */}
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'shop' || activeTab === 'product' ? 'text-[#d00000]' : 'text-gray-400 hover:text-gray-600'
          }`}
          title="Explore (Shop)"
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'shop' ? "'FILL' 1" : "'FILL' 0" }}
          >
            search
          </span>
          <span className="text-[10px] font-medium tracking-tight">Explore</span>
        </button>

        {/* 3. Center Red (+) Button */}
        <button
          onClick={() => setActiveTab('studio')}
          className="w-10 h-10 -mt-1 rounded-full bg-[#d00000] text-white flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-all"
          title="Create"
        >
          <span className="material-symbols-outlined text-[24px] font-bold">add</span>
        </button>

        {/* 4. Inbox */}
        <button
          onClick={() => setActiveTab('cart')}
          className={`flex flex-col items-center justify-center relative transition-all ${
            activeTab === 'cart' || activeTab === 'checkout' ? 'text-[#d00000]' : 'text-gray-400 hover:text-gray-600'
          }`}
          title="Inbox / Cart"
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'cart' ? "'FILL' 1" : "'FILL' 0" }}
          >
            chat_bubble
          </span>
          <span className="text-[10px] font-medium tracking-tight">Inbox</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center transition-all ${
            activeTab === 'profile' ? 'text-[#d00000]' : 'text-gray-400 hover:text-gray-600'
          }`}
          title="Profile"
        >
          <span 
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
          >
            person
          </span>
          <span className="text-[10px] font-medium tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
}
