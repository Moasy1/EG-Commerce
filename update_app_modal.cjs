const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

if (!content.includes('<AuthModal />')) {
  // Add <AuthModal /> before <QuickBuyDrawer />
  content = content.replace('<QuickBuyDrawer />', '<AuthModal />\n      <QuickBuyDrawer />');
  fs.writeFileSync('src/App.jsx', content);
  console.log("Added AuthModal to App.jsx");
} else {
  console.log("AuthModal is already rendered in App.jsx?");
}
