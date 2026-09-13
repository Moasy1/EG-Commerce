const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Header.jsx', 'utf8');

if (!content.includes('isNotifOpen')) {
  content = content.replace(
    "const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);",
    "const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);\n  const [isNotifOpen, setIsNotifOpen] = useState(false);"
  );
}

content = content.replace(
  "onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}",
  "onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}"
);

const profileMenuDiv = '<div className="relative">';
const notifHtml = `          {/* Notifications Center */}
          <div className="relative">
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative"
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileMenuOpen(false); }}
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#d00000] border-2 border-white rounded-full"></span>
            </button>
            
            {isNotifOpen && (
              <div className={\`absolute \${isAr ? 'left-0' : 'right-0'} top-full mt-1 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-slate-900 z-50 flex flex-col animate-fade-in\`}>
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-sm">{isAr ? 'الإشعارات' : 'Notifications'}</h3>
                  <button className="text-[10px] text-[#d00000] font-bold">{isAr ? 'تحديد كـ مقروء' : 'Mark all as read'}</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  <div className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 relative">
                    <div className="w-1.5 h-1.5 bg-[#d00000] rounded-full absolute top-1/2 -translate-y-1/2 left-1.5"></div>
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 ml-2">
                      <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{isAr ? 'تم شحن طلبك!' : 'Order Shipped!'}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{isAr ? 'طلبك #EG-9842 في طريقه إليك' : 'Your order #EG-9842 is on the way.'}</p>
                      <span className="text-[9px] text-gray-400 mt-1 block">2 hours ago</span>
                    </div>
                  </div>
                  <div className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 ml-2">
                      <span className="material-symbols-outlined text-[16px]">campaign</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{isAr ? 'حملة UGC جديدة' : 'New UGC Campaign'}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{isAr ? 'تاليسكا ستوديو تبحث عن صناع محتوى.' : 'Talieska Studio is looking for creators.'}</p>
                      <span className="text-[9px] text-gray-400 mt-1 block">5 hours ago</span>
                    </div>
                  </div>
                </div>
                <button className="p-3 text-center text-xs font-bold text-gray-600 hover:text-slate-900 bg-gray-50 w-full border-t border-gray-100">
                  {isAr ? 'عرض كل الإشعارات' : 'View all notifications'}
                </button>
              </div>
            )}
          </div>
`;

// Find the profile button container
const searchStr = '<div className="relative">\n            <button \n              onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}';

if (content.includes(searchStr)) {
  content = content.replace(searchStr, notifHtml + '\n          ' + searchStr);
} else {
  // Let's just find the profile menu button and insert before it
  const profileSearch = '<button \n              onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}';
  const parentSearch = '<div className="relative">\n            <button \n              onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}';
  
  // Just inject before the profile relative div
  const parts = content.split('<div className="relative">\n            <button \n              onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}');
  if (parts.length === 2) {
    content = parts[0] + notifHtml + '\n          <div className="relative">\n            <button \n              onClick={() => { setIsProfileMenuOpen(!isProfileMenuOpen); setIsNotifOpen(false); }}' + parts[1];
  }
}

// Add Delivery Portal to the Profile Dropdown Menu
content = content.replace(
  `<button onClick={() => { setActiveTab('dashboard'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">storefront</span> {isAr ? 'مركز التجار' : 'Merchant Centre'}
                </button>`,
  `<button onClick={() => { setActiveTab('dashboard'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">storefront</span> {isAr ? 'مركز التجار' : 'Merchant Centre'}
                </button>
                <button onClick={() => { setActiveTab('delivery'); setIsProfileMenuOpen(false); }} className="px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-left">
                  <span className="material-symbols-outlined text-[18px]">two_wheeler</span> {isAr ? 'بوابة المناديب' : 'Rider Portal'}
                </button>`
);

fs.writeFileSync('src/components/layout/Header.jsx', content);
console.log("Patched Header.jsx with Notif and Delivery links");
