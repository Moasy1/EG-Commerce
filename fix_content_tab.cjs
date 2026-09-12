const fs = require('fs');
const content = fs.readFileSync('src/components/desktop/DesktopSellerDashboard.jsx', 'utf8');

const sheglamContent = `
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80', views: '45.2K', sales: '312 طلب', status: 'نشط (تريند)' },
                  { img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80', views: '89.1K', sales: '840 طلب', status: 'نشط (تريند)' },
                  { img: '/images/reels/reel_1.jpg', views: '124K', sales: '84 طلب', status: 'نشط (الرئيسية)' },
                  { img: '/images/products/linen_abaya.jpg', views: '12K', sales: '8 طلبات', status: 'قيد المراجعة' },
                ].map((reel, i) => (
`;

// Find the content grid
const regex = /<div className="grid grid-cols-2 md:grid-cols-4 gap-4">\s*\{\[\s*\{ img: '\/images\/reels\/reel_1\.jpg'[^\]]*\]\.map\(\(reel, i\) => \(/s;

if (regex.test(content)) {
  const newContent = content.replace(regex, sheglamContent);
  fs.writeFileSync('src/components/desktop/DesktopSellerDashboard.jsx', newContent);
  console.log("Updated content tab in DesktopSellerDashboard.jsx");
} else {
  console.log("Regex not found in DesktopSellerDashboard.jsx");
}
