import re

path = r'c:\Users\hmanm\Downloads\EG-Commerce\src\components\desktop\DesktopSellerDashboard.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add import
if 'StorefrontThemeCustomizer' not in content:
    content = content.replace("import EgLogo from '../common/EgLogo';",
                              "import EgLogo from '../common/EgLogo';\nimport StorefrontThemeCustomizer from '../merchant/StorefrontThemeCustomizer';")
    print("Added StorefrontThemeCustomizer import")

# 2. Replace topVideos mockups
old_videos = """  const topVideos = [
    {
      id: 'v-1',
      title: 'إطلالة الجلابية الجديدة',
      views: '32.4K',
      orders: '428',
      growth: '42%',
      duration: '0:24',
      img: '/images/products/linen_abaya.jpg'
    },
    {
      id: 'v-2',
      title: 'تفاصيل التطريز اليدوي',
      views: '21.7K',
      orders: '312',
      growth: '36%',
      duration: '0:18',
      img: '/images/products/silk_dress.jpg'
    },
    {
      id: 'v-3',
      title: 'ستايل رجالي للصيف',
      views: '18.9K',
      orders: '241',
      growth: '28%',
      duration: '0:27',
      img: '/images/products/linen_shirt.jpg'
    },
    {
      id: 'v-4',
      title: 'عبايات كلاسيك',
      views: '15.6K',
      orders: '198',
      growth: '24%',
      duration: '0:21',
      img: '/images/products/wool_blazer.jpg'
    }
  ];"""

new_videos = """  const topVideos = [
    {
      id: 'v-1',
      title: 'The Sharp V Yellow Drop Reel 🔥',
      views: '14.8K',
      orders: '42',
      growth: '54%',
      duration: '0:15',
      img: '/images/products/the_sharp_v_yellow_1.webp'
    }
  ];"""

if old_videos in content:
    content = content.replace(old_videos, new_videos)
    print("Replaced topVideos")

# 3. Add Storefront Customizer Nav Item to Desktop and Mobile Sidebars
old_nav = """              { id: 'content', label: 'المحتوى', icon: 'smart_display' },
              { id: 'analytics', label: 'التحليلات', icon: 'trending_up' },
              { id: 'marketing', label: 'التسويق', icon: 'campaign' },"""

new_nav = """              { id: 'content', label: 'المحتوى', icon: 'smart_display' },
              { id: 'analytics', label: 'التحليلات', icon: 'trending_up' },
              { id: 'storefront_design', label: 'تخصيص المتجر', icon: 'palette' },
              { id: 'marketing', label: 'التسويق', icon: 'campaign' },"""

content = content.replace(old_nav, new_nav)
print("Added storefront_design to nav")

# 4. Render StorefrontThemeCustomizer when activeNav === 'storefront_design'
old_render_pos = "{activeNav === 'settings' && ("
new_render_pos = """{activeNav === 'storefront_design' && (
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
              <StorefrontThemeCustomizer />
            </div>
          )}

          {activeNav === 'settings' && ("""

if old_render_pos in content:
    content = content.replace(old_render_pos, new_render_pos)
    print("Added StorefrontThemeCustomizer view rendering")

# 5. Replace any remaining linen abaya in DesktopSellerDashboard.jsx
content = content.replace("'/images/products/linen_abaya.jpg'", "'/images/products/the_sharp_v_yellow_1.webp'")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("DesktopSellerDashboard.jsx patched successfully")
