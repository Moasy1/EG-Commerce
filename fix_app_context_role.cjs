const fs = require('fs');
let content = fs.readFileSync('src/components/AuthModal.jsx', 'utf8');
content = content.replace(
  'const currentUser = await AuthService.getCurrentUser();\n      setUser(currentUser);',
  'const currentUser = await AuthService.getCurrentUser();\n      setUser(currentUser);\n      if (currentUser?.role) setRole(currentUser.role);'
);
content = content.replace(
  'const { isAuthModalOpen, setIsAuthModalOpen, setUser, isAr } = useApp();',
  'const { isAuthModalOpen, setIsAuthModalOpen, setUser, setRole, isAr } = useApp();'
);
fs.writeFileSync('src/components/AuthModal.jsx', content);
