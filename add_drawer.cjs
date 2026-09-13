const fs = require('fs');

const shopTheLookDrawerHtml = `
      {/* Shop the Look Drawer */}
      <div 
        className={\`absolute bottom-0 left-0 w-full bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 \${isShopTheLookOpen ? 'translate-y-0' : 'translate-y-full'}\`}
        style={{ height: '55%' }}
      >
        <div className="w-full h-full flex flex-col relative text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/50 rounded-full"></div>
          
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <h3 className="font-black text-lg">🛍️ {isAr ? 'تسوق الإطلالة' : 'Shop the Look'}</h3>
              <p className="text-xs text-gray-500 font-medium">{currentReel?.products?.length || 0} {isAr ? 'عناصر في هذا الفيديو' : 'items featured in this reel'}</p>
            </div>
            <button 
              onClick={() => setIsShopTheLookOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {currentReel?.products?.map((prod, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <img src={prod.image} className="w-20 h-24 rounded-xl object-cover" />
                <div className="flex flex-col flex-1 py-1">
                  <span className="text-[10px] font-bold text-gray-400 mb-1">{prod.sku}</span>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight mb-2 line-clamp-2">{prod.title}</h4>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <span className="font-black text-[#d00000] text-sm block">EGP {prod.price}</span>
                      {prod.originalPrice && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-gray-400 line-through">EGP {prod.originalPrice}</span>
                          <span className="text-[9px] font-bold bg-red-50 text-[#d00000] px-1 rounded">{prod.discount}</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setIsShopTheLookOpen(false);
                        const matched = products?.find(p => p.id === prod.id) || prod;
                        openQuickBuy(matched);
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black shadow-md"
                    >
                      {isAr ? 'شراء' : 'Buy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
`;

let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

content = content.replace(
  "      {/* Interactive Comments Drawer */}",
  shopTheLookDrawerHtml + "\n      {/* Interactive Comments Drawer */}"
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Drawer added!");
