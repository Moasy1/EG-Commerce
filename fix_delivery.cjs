const fs = require('fs');
let content = fs.readFileSync('src/pages/DeliveryDashboard.jsx', 'utf8');

// The file currently has literal backslashes like {\`flex-1
// Let's strip those specific backslashes.
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync('src/pages/DeliveryDashboard.jsx', content);
console.log("Fixed DeliveryDashboard again!");
