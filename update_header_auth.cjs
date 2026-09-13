const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Header.jsx', 'utf8');

const oldProfileBlock = `{/* Profile Menu Dropdown */}
          <div className="relative" onMouseLeave={() => setIsProfileMenuOpen(false)}>
            <div 
              onMouseEnter={() => setIsProfileMenuOpen(true)}
              onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}
              className="cursor-pointer flex items-center gap-2 pl-1 ml-1"
            >
              <img 
                src="/images/reels/reel_2.jpg" 
                alt="Profile" 
                className={\`w-8 h-8 rounded-full object-cover ring-2 transition-all \${isProfileMenuOpen ? 'ring-[#d00000]' : 'ring-transparent'}\`}
              />
            </div>
            
            {isProfileMenuOpen && (
              <div className={\`absolute \${isAr ? 'left-0' : 'right-0'} top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-slate-900 z-50 flex flex-col py-1 animate-fade-in\`}>
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <img src={user?.profile?.avatar_url || "/images/reels/reel_2.jpg"} className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold">{user?.profile?.name || (isAr ? 'ضيف' : 'Guest')}</span>
                    <span className="text-[10px] text-gray-500">{user?.email || ''}</span>
                  </div>
                </div>
                <button onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left mt-1">
                  <span className="material-symbols-outlined text-[18px]">person</span> {isAr ? 'الملف الشخصي' : 'My Profile'}
                </button>
                <button onClick={() => { setLanguage(l => l === 'ar' ? 'en' : 'ar'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex sm:hidden items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">language</span> {isAr ? 'Switch to English' : 'التبديل للعربية'}
                </button>
                <button onClick={() => { setActiveTab('tracking'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span> {isAr ? 'الطلبات' : 'Orders'}
                </button>
                <button onClick={() => { setActiveTab('rewards'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">workspace_premium</span> {isAr ? 'المكافآت' : 'Rewards Hub'}
                </button>
                <button onClick={() => { setActiveTab('dashboard'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">storefront</span> {isAr ? 'مركز التجار' : 'Merchant Centre'}
                </button>
                <button onClick={() => { setActiveTab('delivery'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">two_wheeler</span> {isAr ? 'بوابة المناديب' : 'Rider Portal'}
                </button>
                <button onClick={() => { setActiveTab('admin'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> {isAr ? 'لوحة الإدارة' : 'Admin Dashboard'}
                </button>
                <button onClick={() => { setActiveTab('settings'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">settings</span> {isAr ? 'الإعدادات' : 'Settings'}
                </button>
                <button onClick={() => { setActiveTab('showcase'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left text-blue-600 mt-1 border-t border-gray-50 pt-3">
                  <span className="material-symbols-outlined text-[18px]">visibility</span> {isAr ? 'عرض الشاشات (Dev)' : 'Screen Index (Dev)'}
                </button>
                {user ? (
                  <button onClick={async () => { await AuthService.signOut(); setUser(null); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left text-red-600 mt-1 border-t border-gray-50 pt-3">
                    <span className="material-symbols-outlined text-[18px]">logout</span> {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                  </button>
                ) : (
                  <button onClick={() => { setIsAuthModalOpen(true); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left text-[#d00000] mt-1 border-t border-gray-50 pt-3">
                    <span className="material-symbols-outlined text-[18px]">login</span> {isAr ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                )}
              </div>
            )}
          </div>`;

const newProfileBlock = `{/* Auth Navigation */}
          {user ? (
            <div className="relative" onMouseLeave={() => setIsProfileMenuOpen(false)}>
              <div 
                onMouseEnter={() => setIsProfileMenuOpen(true)}
                onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}
                className="cursor-pointer flex items-center gap-2 pl-1 ml-1"
              >
                <div className={\`w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 overflow-hidden ring-2 transition-all \${isProfileMenuOpen ? 'ring-[#d00000]' : 'ring-transparent'}\`}>
                  {user?.profile?.avatar_url ? (
                    <img src={user.profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-[20px]">person</span>
                  )}
                </div>
              </div>
              
              {isProfileMenuOpen && (
                <div className={\`absolute \${isAr ? 'left-0' : 'right-0'} top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-slate-900 z-50 flex flex-col py-1 animate-fade-in\`}>
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 overflow-hidden">
                      {user?.profile?.avatar_url ? (
                        <img src={user.profile.avatar_url} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-[24px]">person</span>
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold truncate max-w-[120px]">{user?.name || user?.email?.split('@')[0]}</span>
                      <span className="text-[10px] text-[#d00000] font-bold uppercase">{user?.role}</span>
                    </div>
                  </div>
                  <button onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left mt-1">
                    <span className="material-symbols-outlined text-[18px]">person</span> {isAr ? 'الملف الشخصي' : 'My Profile'}
                  </button>
                  <button onClick={() => { setLanguage(l => l === 'ar' ? 'en' : 'ar'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex sm:hidden items-center gap-2 text-left">
                    <span className="material-symbols-outlined text-[18px]">language</span> {isAr ? 'Switch to English' : 'التبديل للعربية'}
                  </button>
                  <button onClick={() => { setActiveTab('tracking'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span> {isAr ? 'الطلبات' : 'Orders'}
                  </button>
                  <button onClick={() => { setActiveTab('rewards'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                    <span className="material-symbols-outlined text-[18px]">workspace_premium</span> {isAr ? 'المكافآت' : 'Rewards Hub'}
                  </button>
                  <button onClick={() => { setActiveTab('dashboard'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                    <span className="material-symbols-outlined text-[18px]">storefront</span> {isAr ? 'مركز التجار' : 'Merchant Centre'}
                  </button>
                  <button onClick={() => { setActiveTab('delivery'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                    <span className="material-symbols-outlined text-[18px]">two_wheeler</span> {isAr ? 'بوابة المناديب' : 'Rider Portal'}
                  </button>
                  <button onClick={() => { setActiveTab('admin'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> {isAr ? 'لوحة الإدارة' : 'Admin Dashboard'}
                  </button>
                  <button onClick={() => { setActiveTab('settings'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                    <span className="material-symbols-outlined text-[18px]">settings</span> {isAr ? 'الإعدادات' : 'Settings'}
                  </button>
                  <button onClick={() => { setActiveTab('showcase'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left text-blue-600 mt-1 border-t border-gray-50 pt-3">
                    <span className="material-symbols-outlined text-[18px]">visibility</span> {isAr ? 'عرض الشاشات (Dev)' : 'Screen Index (Dev)'}
                  </button>
                  <button onClick={async () => { await AuthService.signOut(); setUser(null); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left text-red-600 mt-1 border-t border-gray-50 pt-3">
                    <span className="material-symbols-outlined text-[18px]">logout</span> {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className={\`ml-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 \${
                isReels 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-[#d00000] text-white hover:bg-red-700'
              }\`}
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              {isAr ? 'دخول / تسجيل' : 'Login / Sign Up'}
            </button>
          )}`;

content = content.replace(oldProfileBlock, newProfileBlock);
fs.writeFileSync('src/components/layout/Header.jsx', content);
console.log("Updated header auth navigation");
