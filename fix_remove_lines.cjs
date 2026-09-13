const fs = require('fs');
const content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');
const lines = content.split('\n');

// Find the line index of `{isEditModalOpen && (` before `export default function DiscoverReels`
let startIdx = -1;
let endIdx = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export default function DiscoverReels() {')) break;
  if (lines[i].includes('{isEditModalOpen && (')) {
    startIdx = i;
  }
}

if (startIdx !== -1) {
  for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].includes('export default function DiscoverReels() {')) {
      // Go back to find the closing tag
      endIdx = i - 4; 
      break;
    }
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  lines.splice(startIdx, endIdx - startIdx + 1);
  fs.writeFileSync('src/pages/DiscoverReels.jsx', lines.join('\n'));
  console.log("Removed modal block successfully.");
} else {
  console.log("Could not find bounds", startIdx, endIdx);
}
