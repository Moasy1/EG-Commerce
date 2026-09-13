const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Header.jsx', 'utf8');

// Add user and auth modal states
content = content.replace(
  "const { activeTab, setActiveTab, totalCartCount, language, setLanguage, unreadNotifications } = useApp();",
  "const { activeTab, setActiveTab, totalCartCount, language, setLanguage, unreadNotifications, user, setUser, setIsAuthModalOpen } = useApp();"
);

// Add AuthService
content = content.replace(
  "import { useApp } from '../../context/AppContext';",
  "import { useApp } from '../../context/AppContext';\nimport { AuthService } from '../../services/AuthService';"
);

// Update profile menu to handle login/logout
const profileMenuMatch = /<div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">[\s\S]*?<\/div>\n                <\/div>/;
content = content.replace(profileMenuMatch, 
  `<div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                  <img src={user?.profile?.avatar_url || "/images/reels/reel_2.jpg"} className="w-10 h-10 rounded-full" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold">{user?.profile?.name || (isAr ? 'ضيف' : 'Guest')}</span>
                    <span className="text-[10px] text-gray-500">{user?.email || ''}</span>
                  </div>
                </div>`
);

// Add sign in / sign out buttons
content = content.replace(
  /<button onClick=\{\(\) => \{ setActiveTab\('showcase'\);[\s\S]*?<\/button>/,
  `$&
                {user ? (
                  <button onClick={async () => { await AuthService.signOut(); setUser(null); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left text-red-600 mt-1 border-t border-gray-50 pt-3">
                    <span className="material-symbols-outlined text-[18px]">logout</span> {isAr ? 'تسجيل الخروج' : 'Sign Out'}
                  </button>
                ) : (
                  <button onClick={() => { setIsAuthModalOpen(true); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left text-[#d00000] mt-1 border-t border-gray-50 pt-3">
                    <span className="material-symbols-outlined text-[18px]">login</span> {isAr ? 'تسجيل الدخول' : 'Sign In'}
                  </button>
                )}`
);

fs.writeFileSync('src/components/layout/Header.jsx', content);
console.log("Header auth fixed!");
