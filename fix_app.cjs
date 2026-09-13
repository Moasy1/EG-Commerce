const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

content = content.replace(
  "import AddProductStudio from './pages/AddProductStudio';",
  "import AddProductStudio from './pages/AddProductStudio';\nimport AuthModal from './components/AuthModal';"
);

content = content.replace(
  "        <BottomNav />\n        <QuickBuyDrawer />\n      </div>",
  "        <BottomNav />\n        <QuickBuyDrawer />\n        <AuthModal />\n      </div>"
);

fs.writeFileSync('src/App.jsx', content);
console.log("App.jsx fixed!");
