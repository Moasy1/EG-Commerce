const fs = require('fs');
const content = fs.readFileSync('src/components/desktop/DesktopSellerDashboard.jsx', 'utf8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('          })()}'));

if (startIdx !== -1) {
  lines.splice(startIdx + 1, 7); // remove 7 lines starting from the one after `})()}`
  fs.writeFileSync('src/components/desktop/DesktopSellerDashboard.jsx', lines.join('\n'));
  console.log('Fixed extraneous tags.');
} else {
  console.log('Could not find start index');
}
