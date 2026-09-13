const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// Replace desktop tabs
const desktopTabsRegex = /          \{\/\* Feed Tabs \*\/\}\n          <div className="flex items-center gap-3 text-xs font-semibold">[\s\S]*?          <\/div>/;
content = content.replace(desktopTabsRegex, '');

// Replace mobile tabs
const mobileTabsRegex = /          <div className="flex items-center gap-6 px-4 pb-0 overflow-x-auto no-scrollbar w-full" style=\{\{ direction: isAr \? 'rtl' : 'ltr' \}\}\>\n            <button className="pb-2 text-\[15px\] font-bold text-white border-b-\[3px\] border-white whitespace-nowrap drop-shadow-md">\n              \{isAr \? 'لك' : 'For You'\}\n            <\/button>\n            <button className="pb-2 text-\[15px\] font-medium text-white\/80 whitespace-nowrap drop-shadow-md">\n              \{isAr \? 'متابعة' : 'Following'\}\n            <\/button>\n            <button className="pb-2 text-\[15px\] font-medium text-white\/80 whitespace-nowrap drop-shadow-md">\n              \{isAr \? 'الموضة' : 'Fashion'\}\n            <\/button>\n            <button className="pb-2 text-\[15px\] font-medium text-white\/80 whitespace-nowrap drop-shadow-md">\n              \{isAr \? 'مصر' : 'Egypt'\}\n            <\/button>\n          <\/div>/;

content = content.replace(mobileTabsRegex, '');

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Removed tabs!");
