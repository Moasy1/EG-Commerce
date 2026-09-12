const fs = require('fs');
const content = fs.readFileSync('src/pages/MerchantDashboard.jsx', 'utf8');
const lines = content.split('\n');

const mainEndIdx = lines.findIndex(l => l.includes('</main>'));
const modal1Idx = lines.findIndex(l => l.includes('MODAL 1: PRODUCT FORM'));

if (mainEndIdx !== -1 && modal1Idx !== -1) {
  const newLines = [
    ...lines.slice(0, mainEndIdx + 1),
    ...lines.slice(modal1Idx - 3)
  ];
  fs.writeFileSync('src/pages/MerchantDashboard.jsx', newLines.join('\n'));
  console.log('Fixed MerchantDashboard.jsx successfully.');
} else {
  console.log('Could not find indices', mainEndIdx, modal1Idx);
}
