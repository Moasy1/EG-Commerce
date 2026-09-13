const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

const oldHeaderRegex = /\{\/\* Custom Mobile Header \(Solid White with Tabs\) \*\/\}.*?<\/div>\s*<\/div>/s;

const newHeader = `{/* Custom Mobile Header (Transparent Overlay) */}
        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent text-white pt-safe z-40 pointer-events-auto">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[26px] drop-shadow-md">search</span>
              </button>
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors text-white flex items-center justify-center" onClick={(e) => { e.stopPropagation(); /* Edit action */ }}>
                <span className="material-symbols-outlined text-[26px] drop-shadow-md">more_vert</span>
              </button>
            </div>
            <div className="flex items-center">
              <EgLogo className="w-8 h-8 drop-shadow-md" color="#d00000" />
            </div>
          </div>
          
          <div className="flex items-center gap-6 px-4 pb-0 overflow-x-auto no-scrollbar w-full" style={{ direction: isAr ? 'rtl' : 'ltr' }}>
            <button className="pb-2 text-[15px] font-bold text-white border-b-[3px] border-white whitespace-nowrap drop-shadow-md">
              {isAr ? 'لك' : 'For You'}
            </button>
            <button className="pb-2 text-[15px] font-medium text-white/80 whitespace-nowrap drop-shadow-md">
              {isAr ? 'متابعة' : 'Following'}
            </button>
            <button className="pb-2 text-[15px] font-medium text-white/80 whitespace-nowrap drop-shadow-md">
              {isAr ? 'الموضة' : 'Fashion'}
            </button>
            <button className="pb-2 text-[15px] font-medium text-white/80 whitespace-nowrap drop-shadow-md">
              {isAr ? 'مصر' : 'Egypt'}
            </button>
          </div>
        </div>`;

if (oldHeaderRegex.test(content)) {
  content = content.replace(oldHeaderRegex, newHeader);
  fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
  console.log("Replaced mobile header successfully!");
} else {
  console.log("Could not find the mobile header regex!");
}

