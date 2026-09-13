const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// Replace string includes checks with a better video check
const newCheck = "(reel.videoBg.includes('.mp4') || reel.videoBg.startsWith('blob:'))";

content = content.replace(/reel\.videoBg\.includes\('\.mp4'\)/g, newCheck);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Fixed video format checks.");
