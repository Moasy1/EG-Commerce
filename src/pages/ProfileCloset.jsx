import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/AuthService';
import EgLogo from '../components/common/EgLogo';

export default function ProfileCloset() {
  const { setActiveTab, user, setUser, setIsAuthModalOpen, isAr } = useApp();
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

  const handleSignOut = async () => {
    await AuthService.signOut();
    setUser(null);
  };

  if (!user) {
    return (
      <div className="w-full min-h-[844px] bg-gray-50 flex flex-col items-center justify-center p-6 text-center select-none pb-20">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-gray-300">
          <span className="material-symbols-outlined text-[40px]">person</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isAr ? 'حسابك الشخصي' : 'Your Profile'}
        </h2>
        <p className="text-sm text-gray-500 mb-8 max-w-[260px]">
          {isAr 
            ? 'قم بتسجيل الدخول لحفظ الفيديوهات، تتبع الطلبات، وإدارة حسابك.' 
            : 'Sign in to save videos, track orders, and manage your account.'}
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full max-w-[260px] bg-[#d00000] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all"
        >
          {isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Sign Up'}
        </button>
      </div>
    );
  }

  // If we have a logged in user, render their actual profile info
  return (
    <div className="w-full min-h-[844px] bg-white text-slate-900 flex flex-col font-sans select-none pb-20 pt-4">
      {/* 3. Profile Header Info */}
      <div className="px-5 pt-3 pb-4 flex flex-col items-center text-center space-y-3">
        
        {/* Top actions */}
        <div className="w-full flex justify-end">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-bold hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">logout</span>
            {isAr ? 'خروج' : 'Sign Out'}
          </button>
        </div>

        {/* Large Circular Avatar with Verified Badge */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-white shadow-sm overflow-hidden">
            <span className="material-symbols-outlined text-[32px]">person</span>
          </div>
          {user.role === 'merchant' && (
            <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px] text-sky-500 fill-current">
                verified
              </span>
            </div>
          )}
        </div>

        {/* Name & Title */}
        <div>
          <div className="flex items-center justify-center gap-1">
            <h1 className="text-base font-bold text-slate-900">{user.name || user.email?.split('@')[0]}</h1>
          </div>
          <span className="text-xs text-[#d00000] font-bold mt-0.5 block uppercase tracking-wider">
            {user.role}
          </span>
          <span className="text-xs text-gray-400 font-medium mt-0.5 block">
            {user.email}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 pt-1">
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-900">0</span>
            <span className="text-[11px] text-gray-400">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-900">0</span>
            <span className="text-[11px] text-gray-400">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-slate-900">0</span>
            <span className="text-[11px] text-gray-400">Saved</span>
          </div>
        </div>

      </div>

      {/* 4. Profile Tabs: Videos | Products */}
      <div className="w-full border-b border-gray-200 flex items-center mt-2">
        <button
          onClick={() => setProfileTab('videos')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
            profileTab === 'videos' ? 'text-[#d00000]' : 'text-gray-400'
          }`}
        >
          <span>{isAr ? 'محفوظات' : 'Saved'}</span>
          {profileTab === 'videos' && (
            <span className="absolute bottom-0 inset-x-8 h-0.5 bg-[#d00000] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setProfileTab('products')}
          className={`flex-1 py-2.5 text-xs font-bold transition-all relative ${
            profileTab === 'products' ? 'text-[#d00000]' : 'text-gray-400'
          }`}
        >
          <span>{isAr ? 'طلباتي' : 'Orders'}</span>
          {profileTab === 'products' && (
            <span className="absolute bottom-0 inset-x-8 h-0.5 bg-[#d00000] rounded-full" />
          )}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 text-center bg-gray-50/50">
        <p className="text-sm text-gray-400 font-medium">
          {profileTab === 'videos' 
            ? (isAr ? 'لا توجد محفوظات حتى الآن' : 'No saved items yet') 
            : (isAr ? 'لا توجد طلبات حتى الآن' : 'No recent orders')}
        </p>
      </div>
      
    </div>
  );
}
