const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');
content = content.replace(
  'if (currentUser) {\n        setUser(currentUser);\n      }',
  'if (currentUser) {\n        setUser(currentUser);\n        if (currentUser.role) setRole(currentUser.role);\n      }'
);
fs.writeFileSync('src/context/AppContext.jsx', content);
