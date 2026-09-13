const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Header.jsx', 'utf8');

// Replace right-0 with dynamic alignment
content = content.replace(
  'className="absolute right-0 top-full mt-1 w-56 bg-white rounded-2xl',
  'className={`absolute ${isAr ? \'left-0\' : \'right-0\'} top-full mt-1 w-56 bg-white rounded-2xl'
);

// We need to add back the closing backtick and brace for the className string interpolation.
// Let's replace the whole string instead.

content = content.replace(
  '<div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-slate-900 z-50 flex flex-col py-1 animate-fade-in">',
  '<div className={`absolute ${isAr ? \\\'left-0\\\' : \\\'right-0\\\'} top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-slate-900 z-50 flex flex-col py-1 animate-fade-in`}>'
);

fs.writeFileSync('src/components/layout/Header.jsx', content);
console.log("Dropdown fixed!");
