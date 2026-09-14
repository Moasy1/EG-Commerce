import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function DesktopCreatorAnalytics() {
  const { setActiveTab, language } = useApp();
  const [activeNav, setActiveNav] = useState('analytics');

  const shoppableItems = [
    { title: 'Summer Dress Look', views: '48.2K', likes: '3.4K', sales: 'EGP 18.2K', img: '/images/products/silk_dress.jpg' },
    { title: 'Abaya Styling Tips', views: '32.1K', likes: '2.1K', sales: 'EGP 12.5K', img: '/images/products/linen_abaya.jpg' },
    { title: "Men's Linen Outfit", views: '19.8K', likes: '1.4K', sales: 'EGP 9.1K', img: '/images/products/linen_shirt.jpg' },
    { title: 'Ethnic Accessories', views: '14.2K', likes: '980', sales: 'EGP 4.7K', img: '/images/products/copper_lantern.jpg' },
  ];

  const isAr = language === 'ar';

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="w-full bg-white text-slate-900 flex font-sans min-h-[580px] overflow-hidden select-none text-start">
      {/* 1. Left Sidebar */}
      <aside className={`w-48 bg-gray-50/80 ${isAr ? 'border-l' : 'border-r'} border-gray-200/80 p-3 flex flex-col justify-between shrink-0`}>
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-6 h-6" color="#d00000" />
            <span className="font-black text-xs tracking-tight text-slate-900">EG-Commerce</span>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'studio', label: isAr ? 'استوديو المبدعين' : 'Creator Studio', icon: 'smart_display' },
              { id: 'analytics', label: isAr ? 'التحليلات' : 'Analytics', icon: 'analytics' },
              { id: 'campaigns', label: isAr ? 'الحملات' : 'Campaigns', icon: 'campaign' },
              { id: 'content', label: isAr ? 'المحتوى' : 'Content', icon: 'video_library' },
              { id: 'profile', label: isAr ? 'الملف الشخصي' : 'Profile', icon: 'account_circle' },
              { id: 'settings', label: isAr ? 'الإعدادات' : 'Settings', icon: 'settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all ${
                  activeNav === item.id
                    ? 'bg-[#d00000] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:bg-gray-200/60 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-2.5 rounded-xl bg-gray-100/70 border border-gray-200 text-start">
          <span className="text-[10px] text-gray-500 block">{isAr ? 'مسجل الدخول باسم:' : 'Logged in as:'}</span>
          <span className="text-xs font-bold text-slate-800">Yasmin El Sayed</span>
        </div>
      </aside>

      {/* 2. Main Creator Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
        {/* Top Search Bar */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 bg-gray-100/90 rounded-full text-xs text-gray-500">
            <span className="material-symbols-outlined text-[17px] text-gray-400">search</span>
            <input
              type="text"
              placeholder="Search creators, campaigns, insights..."
              className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2.5 text-gray-600">
            <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">notifications</span></button>
            <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">chat</span></button>
            <img src="/images/reels/reel_1.jpg" alt="Yasmin" className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-300" />
          </div>
        </div>

        {/* Title */}
        <div className="px-5 pt-3 pb-2">
          <h2 className="text-base font-bold text-slate-900">Creator Analytics & Campaigns</h2>
          <p className="text-[11px] text-gray-500">Track your performance and join brand campaigns</p>
        </div>

        {/* Top Section: Creator Profile Header + 4 KPI Cards */}
        <div className="px-5 py-2 grid grid-cols-12 gap-3">
          {/* Creator Profile Card (Col 4) */}
          <div className="col-span-4 p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/images/reels/reel_1.jpg" alt="Yasmin" className="w-12 h-12 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px]">✓</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h3 className="text-xs font-bold text-slate-900">Yasmin El Sayed</h3>
                  <span className="text-sky-500 text-[11px]">✓</span>
                </div>
                <span className="text-[10px] text-gray-500 block">Cairo, Egypt</span>
                <span className="text-[10px] text-gray-400">Fashion & Lifestyle Creator</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-center pt-1 border-t border-gray-200/60">
              <div>
                <span className="text-xs font-bold text-slate-900 block">245K</span>
                <span className="text-[9px] text-gray-400">Followers</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">13.6%</span>
                <span className="text-[9px] text-gray-400">Engagement</span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">12.8K</span>
                <span className="text-[9px] text-gray-400">Reach</span>
              </div>
            </div>

            <button className="w-full py-1.5 rounded-xl border border-gray-300 text-slate-700 text-[11px] font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[13px]">edit</span>
              <span>Edit Profile</span>
            </button>
          </div>

          {/* 4 KPI Cards (Col 8) */}
          <div className="col-span-8 grid grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
              <span className="text-[10px] text-gray-500 font-semibold">Total Views</span>
              <div className="text-lg font-black text-slate-900">1.2M</div>
              <span className="text-[9px] text-emerald-600 font-bold">+18% this week</span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
              <span className="text-[10px] text-gray-500 font-semibold">Likes</span>
              <div className="text-lg font-black text-slate-900">98.4K</div>
              <span className="text-[9px] text-emerald-600 font-bold">+14% this week</span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
              <span className="text-[10px] text-gray-500 font-semibold">Comments</span>
              <div className="text-lg font-black text-slate-900">8.7K</div>
              <span className="text-[9px] text-emerald-600 font-bold">+9% this week</span>
            </div>
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
              <span className="text-[10px] text-gray-500 font-semibold">Shares</span>
              <div className="text-lg font-black text-slate-900">12.3K</div>
              <span className="text-[9px] text-emerald-600 font-bold">+22% this week</span>
            </div>

            {/* Performance Area Line Chart Card */}
            <div className="col-span-4 p-3 rounded-2xl bg-white border border-gray-100 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Reach & Engagement Over Time</span>
                <span className="text-[10px] text-gray-400 font-medium">Apr 21 - Apr 27</span>
              </div>
              
              {/* SVG Area Sparkline Chart */}
              <div className="h-20 w-full relative">
                <svg viewBox="0 0 400 80" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d00000" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#d00000" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path d="M0 60 Q 50 30, 100 45 T 200 20 T 300 40 T 400 15 L 400 80 L 0 80 Z" fill="url(#chartGrad)" />
                  {/* Stroke line */}
                  <path d="M0 60 Q 50 30, 100 45 T 200 20 T 300 40 T 400 15" fill="none" stroke="#d00000" strokeWidth="2.5" />
                  {/* Data Points */}
                  <circle cx="100" cy="45" r="3" fill="#d00000" />
                  <circle cx="200" cy="20" r="3" fill="#d00000" />
                  <circle cx="300" cy="40" r="3" fill="#d00000" />
                  <circle cx="400" cy="15" r="3" fill="#d00000" />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono pt-1 border-t border-gray-100">
                <span>Apr 21</span>
                <span>Apr 23</span>
                <span>Apr 24</span>
                <span>Apr 25</span>
                <span>Apr 27</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Section: Shoppable Content + Join Next Campaign Card */}
        <div className="px-5 py-3 grid grid-cols-12 gap-3 items-start">
          {/* Your Shoppable Content (Col 7) */}
          <div className="col-span-7 p-3.5 rounded-2xl border border-gray-100 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900">Your Shoppable Content</h4>
              <button className="text-[10px] font-bold text-[#d00000] hover:underline">View All</button>
            </div>

            <div className="space-y-2">
              {shoppableItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-gray-50/70 border border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <img src={item.img} alt={item.title} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-800">{item.title}</h5>
                      <span className="text-[9px] text-gray-400">{item.views} views • {item.likes} likes • {item.sales} generated</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('reels')}
                    className="px-3 py-1 rounded-lg bg-[#d00000] text-white text-[10px] font-bold hover:bg-[#b00000]"
                  >
                    Shop Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Join Our Next Campaign Banner (Col 5) */}
          <div className="col-span-5 p-3.5 rounded-2xl border border-gray-100 bg-gradient-to-br from-red-50/60 to-white shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="px-2 py-0.5 rounded bg-[#d00000] text-white text-[9px] font-bold">Featured</span>
                <h4 className="text-xs font-bold text-slate-900 mt-1">Join Our Next Campaign</h4>
                <p className="text-[10px] text-gray-600 leading-relaxed mt-0.5">
                  Get featured, earn commission, grow your audience with top Egyptian brands.
                </p>
              </div>
              <img src="/images/products/linen_abaya.jpg" alt="Campaign" className="w-16 h-20 rounded-xl object-cover shadow-sm shrink-0" />
            </div>

            <button 
              onClick={() => setActiveTab('studio')}
              className="w-full py-2 rounded-xl bg-[#d00000] text-white text-xs font-bold hover:bg-[#b00000] transition-colors shadow-xs"
            >
              View Campaigns
            </button>

            {/* Value Props Row */}
            <div className="grid grid-cols-3 gap-1 text-center text-[9px] text-gray-500 font-medium pt-1 border-t border-gray-200/60">
              <div>Higher Reach</div>
              <div>More Sales</div>
              <div>Creator Support</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
