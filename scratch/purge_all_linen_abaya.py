import os, glob

files_to_clean = [
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\UgcService.js',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\social\reelService.js',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\ProductService.js',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\CartService.js',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\services\AdminService.js',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\components\desktop\DesktopCreatorAnalytics.jsx',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\components\desktop\DesktopProductDetail.jsx',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\pages\MerchantCampaign.jsx',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\pages\DiscoverReels.jsx',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\pages\MerchantStorefront.jsx',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\pages\AddProductStudio.jsx',
    r'c:\Users\hmanm\Downloads\EG-Commerce\src\pages\UnifiedCart.jsx'
]

for file_path in files_to_clean:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False
    if '/images/products/linen_abaya.jpg' in content:
        content = content.replace('/images/products/linen_abaya.jpg', '/images/products/the_sharp_v_yellow_1.webp')
        changed = True
    if '/images/reels/linen_abaya.mp4' in content:
        content = content.replace('/images/reels/linen_abaya.mp4', '/images/reels/the_sharp_v_yellow_reel.mp4')
        changed = True
    if 'linen_abaya.mp4' in content:
        content = content.replace('linen_abaya.mp4', 'the_sharp_v_yellow_reel.mp4')
        changed = True

    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Purged mockups from {os.path.basename(file_path)}")

print("Mockup purge complete!")
