const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Header.jsx', 'utf8');

// 1. Shrink main container padding and gaps on mobile
content = content.replace(
  'px-4 md:px-8 py-3 flex items-center justify-between gap-4',
  'px-2 sm:px-4 md:px-8 py-2 sm:py-3 flex items-center justify-between gap-1 sm:gap-4'
);

// 2. Shrink logo and gaps on mobile
content = content.replace(
  'gap-3.5 cursor-pointer shrink-0 group',
  'gap-1.5 sm:gap-3.5 cursor-pointer shrink-0 group'
);
content = content.replace(
  'w-9 h-9 group-hover:scale-105',
  'w-7 h-7 sm:w-9 sm:h-9 group-hover:scale-105'
);

// 3. Shrink text "EG-Commerce"
content = content.replace(
  'text-xl font-black tracking-tight leading-none',
  'text-base sm:text-xl font-black tracking-tight leading-none'
);

// 4. Action Icons: Shrink gap and hide language button on mobile
content = content.replace(
  'flex items-center gap-2 shrink-0',
  'flex items-center gap-1 sm:gap-2 shrink-0'
);

// Find the language button and add `hidden sm:flex`
content = content.replace(
  'className={`px-2.5 py-1 rounded-full border text-[11px] font-bold transition-colors flex items-center gap-1 shadow-xs ${',
  'className={`hidden sm:flex px-2.5 py-1 rounded-full border text-[11px] font-bold transition-colors items-center gap-1 shadow-xs ${'
);

// 5. Add language toggle inside the profile menu dropdown
const profileMenuInsertion = `
                <button onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left mt-1">
                  <span className="material-symbols-outlined text-[18px]">person</span> {isAr ? 'الملف الشخصي' : 'My Profile'}
                </button>
                <button onClick={() => { setLanguage(l => l === 'ar' ? 'en' : 'ar'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex sm:hidden items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">language</span> {isAr ? 'Switch to English' : 'التبديل للعربية'}
                </button>`;

content = content.replace(
  `                <button onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left mt-1">\n                  <span className="material-symbols-outlined text-[18px]">person</span> {isAr ? 'الملف الشخصي' : 'My Profile'}\n                </button>`,
  profileMenuInsertion
);

fs.writeFileSync('src/components/layout/Header.jsx', content);
console.log("Header fixed!");
