const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Header.jsx', 'utf8');

content = content.replace(
  "    setLanguage\n    user,",
  "    setLanguage,\n    user,"
);

fs.writeFileSync('src/components/layout/Header.jsx', content);
console.log("Fixed Header comma");
