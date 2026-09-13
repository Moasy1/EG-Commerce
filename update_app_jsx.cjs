const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Add imports
content = content.replace(
  "import AddProductStudio from './pages/AddProductStudio';",
  "import AddProductStudio from './pages/AddProductStudio';\nimport AdminDashboard from './pages/AdminDashboard';\nimport Settings from './pages/Settings';"
);

// Add to switch
const newCases = `
      case 'admin':
        return <AdminDashboard />;
      case 'settings':
        return <Settings />;`;

content = content.replace(
  "      case 'storefront':",
  `${newCases}\n      case 'storefront':`
);

fs.writeFileSync('src/App.jsx', content);
console.log("Updated App.jsx routing");
