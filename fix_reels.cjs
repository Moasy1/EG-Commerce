const fs = require('fs');
const content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

const sheglamReels = `
    {
      id: 'reel-sheglam-1',
      creatorHandle: '@beauty.by.nada',
      creatorName: 'ندى بيوتي • Nada Beauty',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
      videoBg: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      caption: isAr 
        ? 'ريفيو جديد لماسكارا شيجلام! رهيبة بتطول وتكثف الرموش، ومعاها مزيل خاص بيها بيشيلها في ثواني! ✨👀 #Sheglam #ماسكارا #تجميل' 
        : 'Testing the new SHEGLAM Ultra Lash Lift Mascara & Easy Lash Removal! Amazing results! ✨👀 #Sheglam #Makeup',
      music: isAr ? 'تريند بيوتي • تيك توك' : 'Trending Beauty Sound',
      likes: 45200,
      comments: 1240,
      saves: 8900,
      product: {
        id: 'p-sheglam-mascara',
        title: isAr ? 'مجموعة شيجلام ماسكارا ومزيل' : 'SHEGLAM Lash Lift & Remover',
        price: 450,
        originalPrice: 550,
        discount: '18% OFF',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80'
      }
    },
    {
      id: 'reel-sheglam-2',
      creatorHandle: '@makeup.with.sara',
      creatorName: 'سارة ميكأب • Sara Makeup',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      videoBg: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      caption: isAr 
        ? 'سواتش لدرجات مرطب الشفاه من شيجلام 🍒 درجات تجنن (Cherry Bark, Plum Sauce, Bare Blush) ثبات وترطيب خيالي! 💋 #مكياج #شيجلام' 
        : 'SHEGLAM Jelly Lip Tint swatches 🍒 Gorgeous shades (Cherry Bark, Plum Sauce) and amazing hydration! 💋 #LipTint #Sheglam',
      music: isAr ? 'موسيقى ريلز هادية' : 'Chill Aesthetic Vibes',
      likes: 89100,
      comments: 3420,
      saves: 15400,
      product: {
        id: 'p-sheglam-liptint',
        title: isAr ? 'ملمع ومورد شفاه شيجلام' : 'SHEGLAM Jelly Lip Tint',
        price: 280,
        originalPrice: 350,
        discount: '20% OFF',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80'
      }
    },
`;

const regex = /const reelsList = \[\s*/;
if (regex.test(content)) {
  const newContent = content.replace(regex, "const reelsList = [\n" + sheglamReels);
  fs.writeFileSync('src/pages/DiscoverReels.jsx', newContent);
  console.log("Added Sheglam reels to DiscoverReels.jsx");
} else {
  console.log("Regex not found in DiscoverReels.jsx");
}

