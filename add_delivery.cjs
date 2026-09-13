const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Add import
content = content.replace(
  "import AdminDashboard from './pages/AdminDashboard';",
  "import AdminDashboard from './pages/AdminDashboard';\nimport DeliveryDashboard from './pages/DeliveryDashboard';"
);

// Add to switch
content = content.replace(
  "      case 'settings':",
  "      case 'delivery':\n        return <DeliveryDashboard />;\n      case 'settings':"
);

fs.writeFileSync('src/App.jsx', content);
console.log("Added delivery route to App.jsx");
