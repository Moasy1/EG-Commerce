const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Header.jsx', 'utf8');

const additionalMenuItems = `
                <button onClick={() => { setActiveTab('admin'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span> {isAr ? 'لوحة الإدارة' : 'Admin Dashboard'}
                </button>
                <button onClick={() => { setActiveTab('settings'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">settings</span> {isAr ? 'الإعدادات' : 'Settings'}
                </button>
`;

content = content.replace(
  /<button onClick=\{\(\) => \{ setActiveTab\('dashboard'\); setIsProfileMenuOpen\(false\); \}\} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">\s*<span className="material-symbols-outlined text-\[18px\]">storefront<\/span> \{isAr \? 'مركز التجار' : 'Merchant Centre'\}\s*<\/button>/,
  `$&${additionalMenuItems}`
);

fs.writeFileSync('src/components/layout/Header.jsx', content);
console.log("Updated Header.jsx with Admin and Settings");
