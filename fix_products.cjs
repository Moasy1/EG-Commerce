const fs = require('fs');
const content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

const sheglamProducts = `
  {
    id: 'p-sheglam-1',
    sku: 'SHG-MASC-01',
    title: 'شيجلام ماسكارا لرفع الرموش مع مزيل • SHEGLAM Ultra Lash Lift Mascara',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 450,
    originalPrice: 550,
    rating: 4.9,
    reviewsCount: 1420,
    stock: 85,
    isSyndicated: true,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    pointsEarned: 45,
    category: 'Makeup مكياج',
    description: 'ماسكارا شيجلام الثورية لرفع وتطويل الرموش بشكل ملحوظ، تأتي مع مزيل مكياج عيون لطيف مخصص لإزالتها بسهولة وفي ثوانٍ معدودة دون تساقط الرموش.',
    sizes: ['Standard'],
    colors: ['Black أسود']
  },
  {
    id: 'p-sheglam-2',
    sku: 'SHG-LIP-02',
    title: 'شيجلام ملمع ومورد شفاه جيلي • SHEGLAM Jelly Lip Tint',
    merchant: 'Talieska Studio • تاليسكا',
    merchantId: 'm-01',
    merchantVerified: true,
    price: 280,
    originalPrice: 350,
    rating: 4.8,
    reviewsCount: 3200,
    stock: 120,
    isSyndicated: true,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
    pointsEarned: 28,
    category: 'Makeup مكياج',
    description: 'مورد شفاه بتركيبة الجيلي المرطبة، يمنحك لوناً غنياً وثباتاً يدوم طويلاً مع ترطيب عميق بفضل الزيوت الطبيعية.',
    sizes: ['Standard'],
    colors: ['Cherry Bark', 'Plum Sauce', 'Bare Blush', 'Chocoholic', 'Mauvelous', 'Pinky Promise']
  },
`;

const regex = /const INITIAL_PRODUCTS = \[\s*/;
if (regex.test(content)) {
  const newContent = content.replace(regex, "const INITIAL_PRODUCTS = [\n" + sheglamProducts);
  fs.writeFileSync('src/context/AppContext.jsx', newContent);
  console.log("Added Sheglam products to AppContext.jsx");
} else {
  console.log("Regex not found in AppContext.jsx");
}

