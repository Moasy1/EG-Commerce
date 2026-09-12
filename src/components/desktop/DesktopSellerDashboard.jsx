import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function DesktopSellerDashboard() {
  const { setActiveTab } = useApp();
  const [activeNav, setActiveNav] = useState('dashboard');

  const productsData = [
    { id: 1, name: 'Embroidered Galabeya', price: 'EGP 850', stock: 24, views: '48.2K', status: true, img: '/images/products/linen_abaya.jpg' },
    { id: 2, name: 'Linen Dress', price: 'EGP 650', stock: 18, views: '32.1K', status: true, img: '/images/products/silk_dress.jpg' },
    { id: 3, name: "Men's Linen Shirt", price: 'EGP 490', stock: 42, views: '19.8K', status: true, img: '/images/products/linen_shirt.jpg' },
    { id: 4, name: 'Classic Abaya', price: 'EGP 1,200', stock: 12, views: '28.1K', status: true, img: '/images/products/wool_blazer.jpg' },
  ];

  return (
    <div className="w-full bg-white text-slate-900 flex font-sans min-h-[580px] overflow-hidden select-none text-left">
      {/* 1. Left Sidebar */}
      <aside className="w-48 bg-gray-50/80 border-r border-gray-200/80 p-3 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-6 h-6" color="#d00000" />
            <span className="font-black text-xs tracking-tight text-slate-900">EG-Commerce</span>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
              { id: 'products', label: 'Products', icon: 'inventory_2' },
              { id: 'orders', label: 'Orders', icon: 'receipt_long' },
              { id: 'customers', label: 'Customers', icon: 'group' },
              { id: 'analytics', label: 'Analytics', icon: 'trending_up' },
              { id: 'marketing', label: 'Marketing', icon: 'campaign' },
              { id: 'settings', label: 'Settings', icon: 'settings' },
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

        <div className="p-2.5 rounded-xl bg-gray-100/70 border border-gray-200 text-left">
          <span className="text-[10px] text-gray-500 block">Logged in as:</span>
          <span className="text-xs font-bold text-slate-800">Nile Threads Store</span>
        </div>
      </aside>

      {/* 2. Main Dashboard Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Search & Actions Bar */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 bg-gray-100/90 rounded-full text-xs text-gray-500">
            <span className="material-symbols-outlined text-[17px] text-gray-400">search</span>
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-2.5 text-gray-600">
            <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">notifications</span></button>
            <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">chat</span></button>
            <img src="/images/brands/talieska_logo.jpg" alt="Store Avatar" className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-300" />
          </div>
        </div>

        {/* Dashboard Title & CTA */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Seller Dashboard</h2>
            <p className="text-[11px] text-gray-500">Grow your business with EG-Commerce</p>
          </div>

          <button 
            onClick={() => setActiveTab('dashboard')}
            className="px-3.5 py-1.5 rounded-xl bg-[#d00000] text-white text-xs font-bold shadow-xs hover:bg-[#b00000] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
            <span>Upload Product / Video</span>
          </button>
        </div>

        {/* 4 KPI Metric Cards */}
        <div className="px-5 py-2 grid grid-cols-4 gap-3">
          {/* Card 1: Total Sales */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-[10px] text-gray-500 font-semibold">Total Sales</span>
            <div className="text-base font-black text-slate-900">EGP 48,230</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
              <span>+12%</span>
              <span className="text-gray-400 font-normal">vs last 7 days</span>
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-[10px] text-gray-500 font-semibold">Total Orders</span>
            <div className="text-base font-black text-slate-900">317</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
              <span>+18%</span>
              <span className="text-gray-400 font-normal">vs last 7 days</span>
            </div>
          </div>

          {/* Card 3: Total Views */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-[10px] text-gray-500 font-semibold">Total Views</span>
            <div className="text-base font-black text-slate-900">128.4K</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
              <span>+26%</span>
              <span className="text-gray-400 font-normal">vs last 7 days</span>
            </div>
          </div>

          {/* Card 4: Conversion Rate */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-[10px] text-gray-500 font-semibold">Conversion Rate</span>
            <div className="text-base font-black text-slate-900">2.4%</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
              <span>+0.6%</span>
              <span className="text-gray-400 font-normal">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Lower Content Split: Product Management Table + Content Performance */}
        <div className="p-5 grid grid-cols-12 gap-4 flex-1 items-start">
          {/* Product Management Table (Col 8) */}
          <div className="col-span-8 p-3.5 rounded-2xl border border-gray-100 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900">Product Management</h3>
              <button className="text-[11px] font-bold text-[#d00000] hover:underline">View All</button>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-gray-400 border-b border-gray-100 pb-2">
                  <th className="font-semibold py-1">Product</th>
                  <th className="font-semibold py-1">Price</th>
                  <th className="font-semibold py-1">Stock</th>
                  <th className="font-semibold py-1">Views</th>
                  <th className="font-semibold py-1">Status</th>
                  <th className="font-semibold py-1">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {productsData.map((p) => (
                  <tr key={p.id} className="text-[11px] hover:bg-gray-50/50">
                    <td className="py-2 flex items-center gap-2">
                      <img src={p.img} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
                      <span className="font-semibold text-slate-800 truncate max-w-[140px]">{p.name}</span>
                    </td>
                    <td className="py-2 font-bold text-slate-900">{p.price}</td>
                    <td className="py-2 text-slate-700">{p.stock}</td>
                    <td className="py-2 text-gray-500">{p.views}</td>
                    <td className="py-2">
                      <span className="w-7 h-4 bg-emerald-500 rounded-full inline-flex items-center px-0.5 justify-end">
                        <span className="w-3 h-3 rounded-full bg-white shadow-xs" />
                      </span>
                    </td>
                    <td className="py-2 text-gray-400 hover:text-slate-900 cursor-pointer">
                      <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Content Performance (Col 4) */}
          <div className="col-span-4 space-y-3">
            <div className="p-3.5 rounded-2xl border border-gray-100 bg-white shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-900">Content Performance</h3>
              <div className="rounded-xl overflow-hidden relative aspect-[16/9] bg-slate-900">
                <img src="/images/products/linen_abaya.jpg" alt="Video" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2 text-white">
                  <span className="text-[10px] font-bold">Traditional Galabeya Look</span>
                  <div className="flex items-center justify-between text-[9px] text-gray-200">
                    <span>68.2K views</span>
                    <span className="text-emerald-400 font-bold">+48% vs last week</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl border border-gray-100 bg-gray-50 space-y-1.5 text-xs">
              <span className="text-[10px] text-gray-400 font-bold block">Recent Uploads</span>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-800">Linen Dress Styling</span>
                <span className="text-gray-400 text-[10px]">3d</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-800">Men's Summer Look</span>
                <span className="text-gray-400 text-[10px]">4d</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
