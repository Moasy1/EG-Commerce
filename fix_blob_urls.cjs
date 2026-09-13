const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// The fetchReels function is inside DiscoverReels
content = content.replace(
  'setReelsList(storedReels);',
  `// Convert any File objects to blob URLs
          const processedReels = storedReels.map(r => {
            if (r.videoBg instanceof File || r.videoBg instanceof Blob) {
              return { ...r, videoBg: URL.createObjectURL(r.videoBg) };
            }
            return r;
          });
          setReelsList(processedReels);`
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Fixed blob URL handling on load.");
