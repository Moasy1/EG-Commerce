const fs = require('fs');
const content = fs.readFileSync('src/pages/MerchantDashboard.jsx', 'utf8');
const lines = content.split('\n');

// Find the line with `          <DesktopSellerDashboard />`
// then find the line with `        )}`
// then find the line with `      </main>`
const mainEndIdx = lines.findIndex(l => l.includes('</main>'));

// Find the first modal `      {/* MODAL 1: PRODUCT FORM`
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
