const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductDetail.jsx', 'utf8');

// 1. Add currentImageIndex state
if (!content.includes('const [currentImageIndex, setCurrentImageIndex] = useState(0);')) {
  content = content.replace(
    'const [isPlayingVideo, setIsPlayingVideo] = useState(false);',
    'const [isPlayingVideo, setIsPlayingVideo] = useState(false);\n  const [currentImageIndex, setCurrentImageIndex] = useState(0);'
  );
}

// 2. Add productImages array derivation right after product definition
if (!content.includes('const productImages = product.images')) {
  content = content.replace(
    /const product = selectedProduct \|\| \{[\s\S]*?\};/,
    `$&
  const productImages = product.images && product.images.length > 0 ? product.images : [
    product.image,
    product.image.replace('.jpg', '_2.jpg').replace('.webp', '_2.webp').replace('.png', '_2.png'),
    product.image.replace('.jpg', '_3.jpg').replace('.webp', '_3.webp').replace('.png', '_3.png'),
    product.image.replace('.jpg', '_4.jpg').replace('.webp', '_4.webp').replace('.png', '_4.png'),
  ];

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.clientWidth;
    const index = Math.round(scrollLeft / width);
    setCurrentImageIndex(index);
  };`
  );
}

// 3. Replace the single img with a slider and map the dots
const oldImageSection = `<img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />`;

const newImageSection = `<div 
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
              onScroll={handleScroll}
            >
              {productImages.map((imgSrc, i) => (
                <img 
                  key={i}
                  src={imgSrc} 
                  alt={\`\${product.title} - Image \${i+1}\`}
                  className="w-full h-full object-cover shrink-0 snap-center"
                  onError={(e) => {
                    // Fallback to main image if the mock numbered images don't exist
                    if (e.target.src !== product.image) {
                      e.target.src = product.image;
                    }
                  }}
                />
              ))}
            </div>`;

content = content.replace(oldImageSection, newImageSection);

const oldDots = `<span className="w-2 h-2 rounded-full bg-[#d00000]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />`;

const newDots = `{productImages.map((_, i) => (
                <span 
                  key={i} 
                  className={\`rounded-full transition-all duration-300 \${
                    i === currentImageIndex ? 'w-2 h-2 bg-[#d00000]' : 'w-1.5 h-1.5 bg-white/70'
                  }\`} 
                />
              ))}`;

content = content.replace(oldDots, newDots);

fs.writeFileSync('src/pages/ProductDetail.jsx', content);
console.log("Updated ProductDetail with image slider");
