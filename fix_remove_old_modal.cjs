const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

const oldModalStart = content.indexOf('{isEditModalOpen && (');
if (oldModalStart !== -1) {
  // It's the first occurrence. The second one is at the bottom.
  // Wait, I can just use a regex to remove the first occurrence.
  const regex = /\{isEditModalOpen && \([\s\S]*?\}\)\}/;
  content = content.replace(regex, '');
  fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
  console.log("Removed old modal!");
}
