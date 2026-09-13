const fs = require('fs');
const lines = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export default function DiscoverReels() {')) {
    // We need to ensure the previous component ended correctly.
    // Let's just hardcode the few lines before it.
    lines[i-1] = '};';
    lines[i-2] = '  );';
    lines[i-3] = '    </div>';
    break;
  }
}

fs.writeFileSync('src/pages/DiscoverReels.jsx', lines.join('\n'));
console.log("Fixed lines directly!");
