const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// 1. Add state for the drawer
content = content.replace(
  "const [isCommentsOpen, setIsCommentsOpen] = useState(false);",
  "const [isCommentsOpen, setIsCommentsOpen] = useState(false);\n  const [isShopTheLookOpen, setIsShopTheLookOpen] = useState(false);"
);

// 2. Modify reels list to use `products` array
const defaultReelsBlock = content.match(/const DEFAULT_REELS = \[([\s\S]*?)\];/)[0];
let modifiedReelsBlock = defaultReelsBlock;

// Fashion Blazer - Add Jeans
modifiedReelsBlock = modifiedReelsBlock.replace(
  /product: \{\s*id: 'p-fashion-blazer',[\s\S]*?image: '\/images\/reels\/fashion_citrine_blazer_thumb\.jpg'\s*\}/,
  `products: [
        {
          id: 'p-fashion-blazer',
          sku: 'TLK-BLZ-09',
          title: isAr ? 'بليزر أوفرسايز أصفر ليموني راقي' : 'Citrine Tailored Oversized Blazer',
          price: 2200,
          originalPrice: 2750,
          discount: '20% OFF',
          image: '/images/reels/fashion_citrine_blazer_thumb.jpg'
        },
        {
          id: 'p-fashion-jeans-1',
          sku: 'TLK-JNS-01',
          title: isAr ? 'بنطلون جينز كلاسيك عالي الخصر' : 'Classic High-Waist Denim',
          price: 850,
          originalPrice: 1100,
          discount: '22% OFF',
          image: '/images/products/linen_abaya.jpg' // reusing available image for demo
        }
      ]`
);

// Fashion Shirt - Add Chinos
modifiedReelsBlock = modifiedReelsBlock.replace(
  /product: \{\s*id: 'p-fashion-oversized-shirt',[\s\S]*?image: '\/images\/reels\/fashion_oversized_shirt_thumb\.jpg'\s*\}/,
  `products: [
        {
          id: 'p-fashion-oversized-shirt',
          sku: 'TLK-SHT-05',
          title: isAr ? 'قميص كتان سماوي بقصة أوفرسايز' : 'Oversized Sky Blue Linen Shirt',
          price: 950,
          originalPrice: 1200,
          discount: '21% OFF',
          image: '/images/reels/fashion_oversized_shirt_thumb.jpg'
        },
        {
          id: 'p-fashion-chinos-1',
          sku: 'TLK-CHN-02',
          title: isAr ? 'بنطلون تشينو واسع بيج' : 'Relaxed Beige Wide Chinos',
          price: 720,
          originalPrice: 900,
          discount: '20% OFF',
          image: '/images/products/embroidered_blouse.jpg'
        }
      ]`
);

// Sheglam Mascara - Add Remover
modifiedReelsBlock = modifiedReelsBlock.replace(
  /product: \{\s*id: 'p-sheglam-1',[\s\S]*?image: '\/images\/reels\/sheglam_mascara_thumb\.jpg'\s*\}/,
  `products: [
        {
          id: 'p-sheglam-1',
          sku: 'SHG-MASC-01',
          title: isAr ? 'ماسكارا شيجلام لتكثيف الرموش' : 'SHEGLAM Ultra Lash Lift Mascara',
          price: 350,
          originalPrice: 400,
          discount: '12% OFF',
          image: '/images/reels/sheglam_mascara_thumb.jpg'
        },
        {
          id: 'p-sheglam-1-remover',
          sku: 'SHG-REM-01',
          title: isAr ? 'مزيل مكياج ومسكارا سريع' : 'SHEGLAM Easy Lash Removal',
          price: 150,
          originalPrice: 200,
          discount: '25% OFF',
          image: '/images/reels/sheglam_mascara_thumb.jpg'
        }
      ]`
);

// All other single products need to be converted to arrays to maintain consistency
modifiedReelsBlock = modifiedReelsBlock.replace(/product: \{([\s\S]*?)\}/g, (match, p1) => {
  // If we already manually replaced the above ones, they are now `products: [{...}, {...}]`
  // This regex `product: \{([\s\S]*?)\}` will only match the remaining single products
  return `products: [{${p1}}]`;
});

content = content.replace(defaultReelsBlock, modifiedReelsBlock);

// 3. Update UI parsing.
// The renderReelItem expects `reel.product`. We need to handle `reel.products`.
const renderReelItemBlockOld = content.match(/<div[\s\S]*?Floating Product Pill[\s\S]*?{reel\.caption}/)[0];

const newFloatingPill = `
            {/* Floating Product Pill(s) */}
            {(reel.products && reel.products.length > 1) ? (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShopTheLookOpen(true);
                }}
                className="inline-flex w-fit items-center gap-2 bg-white/95 backdrop-blur-md rounded-xl py-2 px-3 shadow-lg cursor-pointer hover:bg-white active:scale-95 transition-transform animate-fade-in"
              >
                <div className="flex -space-x-2">
                  {reel.products.slice(0,3).map((p, i) => (
                    <img key={i} src={p.image} className="w-7 h-7 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-900 leading-tight">🛍️ {isAr ? 'تسوق الإطلالة' : 'Shop the Look'}</span>
                  <span className="text-[10px] font-bold text-gray-500 leading-tight">({reel.products.length} {isAr ? 'عناصر' : 'items'})</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-slate-900 ml-1">open_in_new</span>
              </div>
            ) : (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  const singleProd = reel.products ? reel.products[0] : reel.product;
                  const matched = products?.find(p => p.id === singleProd?.id) || singleProd;
                  if (matched) openProductDetail(matched);
                }}
                className="inline-flex w-fit items-center gap-2 bg-white rounded-xl py-1.5 px-1.5 pr-4 shadow-lg cursor-pointer hover:bg-gray-50 active:scale-95 transition-transform"
              >
                <img src={reel.products ? reel.products[0].image : reel.product?.image} className="w-8 h-8 rounded-lg object-cover" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-900 leading-tight">{reel.products ? reel.products[0].title : reel.product?.title}</span>
                  <span className="text-[10px] font-bold text-[#d00000] leading-tight">EGP {reel.products ? reel.products[0].price : reel.product?.price}</span>
                </div>
                <span className="material-symbols-outlined text-[14px] text-gray-400 ml-1">chevron_right</span>
              </div>
            )}

            {/* Creator Info */}
            <div className={\`space-y-1 \${isAr ? 'text-right' : 'text-left'}\`}>
              <div 
                className="flex items-center gap-1.5 cursor-pointer w-fit"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('profile');
                }}
              >
                <span className="font-bold text-[15px] text-white drop-shadow-md hover:underline">@{reel.creatorHandle}</span>
                <span className="material-symbols-outlined text-[16px] text-blue-500 bg-white rounded-full">check_circle</span>
              </div>
              <p className="text-[13px] text-white drop-shadow-md leading-snug">
                {reel.caption}`;

content = content.replace(
  /<div[\s\S]*?Floating Product Pill[\s\S]*?{reel\.caption}/,
  newFloatingPill
);


// 4. Update the Shop Now button
const shopNowOld = `            {/* Shop Now Full Width Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openQuickBuy(reel.product);
              }}
              className="w-full py-3 mt-1 rounded-xl bg-[#cc0000] text-white text-[15px] font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>{isAr ? 'تسوق الآن' : 'Shop Now'}</span>
            </button>`;

const shopNowNew = `            {/* Shop Now Full Width Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (reel.products && reel.products.length > 1) {
                  setIsShopTheLookOpen(true);
                } else {
                  const singleProd = reel.products ? reel.products[0] : reel.product;
                  if (singleProd) openQuickBuy(singleProd);
                }
              }}
              className="w-full py-3 mt-1 rounded-xl bg-[#cc0000] text-white text-[15px] font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              <span>{isAr ? 'تسوق الآن' : 'Shop Now'}</span>
            </button>`;

content = content.replace(shopNowOld, shopNowNew);


// 5. Add the Drawer UI at the bottom of the component
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

content = content.replace(
  "        {/* Comments Drawer */}",
  shopTheLookDrawerHtml + "\n        {/* Comments Drawer */}"
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("DiscoverReels updated to support multiple products in Shop the Look drawer!");
