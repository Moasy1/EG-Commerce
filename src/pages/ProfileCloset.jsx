import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';

export default function ProfileCloset() {
  const { setActiveTab } = useApp();
  const [isFollowing, setIsFollowing] = useState(false);
  const [profileTab, setProfileTab] = useState('videos');

  // Exact 6 videos matching Screen 5's 3-column video grid
  const videos = [
    { id: 'v1', views: '132K', image: '/images/reels/reel_1.jpg' },
    { id: 'v2', views: '98K', image: '/images/products/silk_dress.jpg' },
    { id: 'v3', views: '76K', image: '/images/products/wool_blazer.jpg' },
    { id: 'v4', views: '55K', image: '/images/products/linen_abaya.jpg' },
    { id: 'v5', views: '87K', image: '/images/products/linen_shirt.jpg' },
    { id: 'v6', views: '41K', image: '/images/reels/reel_2.jpg' },
  ];

  return (
    <div className="w-full min-h-[844px] bg-white text-slate-900 flex flex-col font-sans select-none pb-20">
      {/* 1. iOS Status Bar */}
      <div className="w-full flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold text-slate-800">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[15px]">signal_cellular_alt</span>
          <span className="material-symbols-outlined text-[15px]">wifi</span>
          <span className="material-symbols-outlined text-[18px]">battery_full</span>
        </div>
      </div>

      {/* 2. Top Bar: Center Red Arch Logo & Right "..." Menu */}
      <div className="w-full px-5 py-2 flex items-center justify-between">
        <div className="w-6" /> {/* Spacer */}
        <div className="cursor-pointer" onClick={() => setActiveTab('reels')}>
          <EgLogo className="w-7 h-7" color="#d00000" />
        </div>
        <button className="p-1 text-slate-700 hover:text-slate-900">
          <span className="material-symbols-outlined text-[24px]">more_horiz</span>
        </button>
      </div>

      {/* 3. Profile Header Info */}
      <div className="px-5 pt-3 pb-4 flex flex-col items-center text-center space-y-3">
        {/* Large Circular Avatar with Verified Badge */}
        <div className="relative">
          <img 
            src="/images/reels/reel_2.jpg" 
            alt="Nada Fashion"
            className="w-20 h-20 rounded-full object-cover shadow-sm border border-gray-100"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[18px] text-sky-500 fill-current">
              verified
            </span>
          </div>
        </div>

        {/* Name & Title */}
        <div>
          <div className="flex items-center justify-center gap-1">
            <h1 className="text-base font-bold text-slate-900">Nada Fashion</h1>
            <span className="material-symbols-outlined text-[16px] text-sky-500 fill-current">verified</span>
          </div>
          <span className="text-xs text-gray-400 font-medium mt-0.5 block">
            Fashion Creator & Seller
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 pt-1">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-900">24.8K</span>
            <span className="text-[11px] text-gray-400">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-900">312</span>
            <span className="text-[11px] text-gray-400">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-900">1.2K</span>
            <span className="text-[11px] text-gray-400">Products</span>
          </div>
        </div>

        {/* Action Buttons: [ Follow ] & [ 🛍️ Shop ] */}
        <div className="flex items-center justify-center gap-2.5 w-full max-w-[280px] pt-1">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isFollowing 
                ? 'bg-gray-100 text-slate-800' 
                : 'bg-[#d00000] text-white hover:bg-[#b00000]'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className="flex-1 py-2 rounded-xl text-xs font-bold bg-white text-[#d00000] border border-[#d00000] hover:bg-[#d00000]/5 transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
            <span>Shop</span>
          </button>
        </div>

        {/* Bio */}
        <div className="text-xs text-slate-700 space-y-0.5 pt-1">
          <p>Cairo based · Modern Egyptian style</p>
          <p className="text-gray-500">Outfits | Vibes | Local Brands</p>
          <p className="text-gray-400 flex items-center justify-center gap-1 pt-0.5">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span>Cairo, Egypt</span>
          </p>
        </div>
      </div>

      {/* 4. Profile Tabs: Videos | Products */}
      <div className="w-full border-b border-gray-200 flex items-center">
        <button
          onClick={() => setProfileTab('videos')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
            profileTab === 'videos' ? 'text-slate-900' : 'text-gray-400'
          }`}
        >
          <span>Videos</span>
          {profileTab === 'videos' && (
            <span className="absolute bottom-0 inset-x-8 h-0.5 bg-[#d00000] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setProfileTab('products')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
            profileTab === 'products' ? 'text-slate-900' : 'text-gray-400'
          }`}
        >
          <span>Products</span>
          {profileTab === 'products' && (
            <span className="absolute bottom-0 inset-x-8 h-0.5 bg-[#d00000] rounded-full" />
          )}
        </button>
      </div>

      {/* 5. 3-Column Video Grid */}
      <div className="p-1">
        <div className="grid grid-cols-3 gap-1">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActiveTab('reels')}
              className="aspect-[3/4] relative overflow-hidden bg-gray-100 cursor-pointer group"
            >
              <img 
                src={vid.image} 
                alt="Video thumbnail"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-1.5 left-2 flex items-center gap-1 text-[11px] font-semibold text-white drop-shadow">
                <span className="material-symbols-outlined text-[13px] fill-current">play_arrow</span>
                <span>{vid.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
