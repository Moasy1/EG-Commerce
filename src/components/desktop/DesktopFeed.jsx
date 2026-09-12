import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EgLogo from '../common/EgLogo';

export default function DesktopFeed() {
  const { setActiveTab, openProductDetail, openQuickBuy } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  const videoCards = [
    {
      id: 'df-1',
      creator: 'Sara El Mahdy',
      location: 'Cairo · Fashion Creator',
      avatar: '/images/reels/reel_2.jpg',
      image: '/images/products/linen_abaya.jpg',
      views: '12.4K',
      badge: 'Trending',
      price: 850,
      tags: ['#Egyptian', '#Embroidery', '#Modest']
    },
    {
      id: 'df-2',
      creator: 'Nour Adel',
      location: 'Alexandria · Creator',
      avatar: '/images/reels/reel_1.jpg',
      image: '/images/products/linen_shirt.jpg',
      views: '21.1K',
      badge: 'New',
      price: 650,
      tags: ['#Blouse', '#Summer', '#Cairo']
    },
    {
      id: 'df-3',
      creator: 'Maya Hassan',
      location: 'Cairo · Creator',
      avatar: '/images/products/silk_dress.jpg',
      image: '/images/products/silk_dress.jpg',
      views: '15.1K',
      badge: 'Top Seller',
      price: 850,
      tags: ['#Dress', '#Linen', '#Authentic']
    },
    {
      id: 'df-4',
      creator: 'Omar Fathy',
      location: 'Giza · Creator',
      avatar: '/images/products/wool_blazer.jpg',
      image: '/images/banners/khan_hero.jpg',
      views: '18.2K',
      badge: 'For Men',
      price: 490,
      tags: ['#MenFashion', '#Linen', '#Summer']
    }
  ];

  return (
    <div className="w-full bg-white text-slate-900 flex font-sans min-h-[580px] overflow-hidden select-none text-left">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-48 bg-gray-50/80 border-r border-gray-200/80 p-3 flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer" onClick={() => setActiveTab('reels')}>
            <EgLogo className="w-6 h-6" color="#d00000" />
            <span className="font-black text-xs tracking-tight text-slate-900">EG-Commerce</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('reels')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#d00000] text-white font-bold shadow-xs"
            >
              <span className="material-symbols-outlined text-[17px]">home</span>
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">explore</span>
              <span>Explore</span>
            </button>

            <button
              onClick={() => setActiveTab('shop')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">category</span>
              <span>Categories</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">people</span>
              <span>Following</span>
            </button>

            <button
              onClick={() => setActiveTab('cart')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">shopping_cart</span>
              <span>Cart</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-200/60 hover:text-slate-900 transition-colors"
            >
              <span className="material-symbols-outlined text-[17px]">person</span>
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* Bottom Pyramid Graphic Card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#d00000]/10 via-amber-500/10 to-orange-500/10 border border-[#d00000]/20 p-3 text-center space-y-1">
          <div className="text-lg">🏛️</div>
          <h5 className="text-[11px] font-bold text-slate-900 leading-tight">Egyptian Fashion</h5>
          <p className="text-[9px] text-gray-500 leading-tight">Egyptian Creators • Real Stories</p>
        </div>
      </aside>

      {/* 2. Main Feed Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Desktop Search Bar */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 bg-gray-100/90 rounded-full text-xs text-gray-500">
            <span className="material-symbols-outlined text-[17px] text-gray-400">search</span>
            <input
              type="text"
              placeholder="Search for outfits, creators, brands..."
              className="w-full bg-transparent focus:outline-none text-xs text-slate-800 placeholder:text-gray-400"
            />
          </div>

          {/* Quick Header Icons */}
          <div className="flex items-center gap-2.5 text-gray-600">
            <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">favorite</span></button>
            <button className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">chat</span></button>
            <button onClick={() => setActiveTab('cart')} className="p-1 hover:text-[#d00000]"><span className="material-symbols-outlined text-[19px]">shopping_cart</span></button>
            <img src="/images/reels/reel_2.jpg" alt="User" className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-300" />
          </div>
        </div>

        {/* Feed Header Section */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Discover Fashion You'll Love</h2>
            <p className="text-[11px] text-gray-500">Short videos. Real people. Authentic Egyptian style.</p>
          </div>
          <button onClick={() => setActiveTab('shop')} className="text-xs font-bold text-[#d00000] hover:underline">
            See All
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 py-1.5 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          {['All', 'Dresses', 'Abayas', 'Men', 'Casual', 'Accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#d00000] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4-Card Video Grid */}
        <div className="p-5 grid grid-cols-4 gap-3.5 flex-1 items-stretch">
          {videoCards.map((card) => (
            <div
              key={card.id}
              onClick={() => setActiveTab('product')}
              className="group rounded-2xl overflow-hidden relative border border-gray-200 shadow-sm bg-slate-900 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all duration-300"
            >
              {/* Video Backdrop Image */}
              <div className="absolute inset-0 w-full h-full">
                <img src={card.image} alt={card.creator} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40" />
              </div>

              {/* Top Card Badges */}
              <div className="relative z-10 p-2.5 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-[#d00000] text-white text-[9px] font-bold shadow-xs">
                  {card.badge}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-medium flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[11px]">visibility</span>
                  <span>{card.views}</span>
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 p-2.5 space-y-1.5 text-white">
                <div className="flex items-center gap-1.5">
                  <img src={card.avatar} alt={card.creator} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/60" />
                  <div className="truncate">
                    <h4 className="text-[11px] font-bold truncate leading-tight">{card.creator}</h4>
                    <p className="text-[9px] text-gray-300 truncate">{card.location}</p>
                  </div>
                </div>

                {/* Shop Now & Price Pill */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openQuickBuy({ id: card.id, title: card.creator + ' Outfit', price: card.price, image: card.image });
                    }}
                    className="flex-1 py-1 rounded-lg bg-[#d00000] text-white text-[10px] font-bold flex items-center justify-center gap-1 hover:brightness-110 shadow-xs"
                  >
                    <span>Shop Now</span>
                  </button>
                  <span className="px-2 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white font-bold text-[10px]">
                    EGP {card.price}
                  </span>
                </div>

                {/* Hashtags */}
                <div className="flex items-center gap-1 text-[8px] text-gray-300 truncate">
                  {card.tags.map((t, idx) => <span key={idx}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
