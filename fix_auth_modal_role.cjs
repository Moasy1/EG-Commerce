const fs = require('fs');
let content = fs.readFileSync('src/components/AuthModal.jsx', 'utf8');

content = content.replace(
  "const [role, setRole] = useState('user');",
  "const [selectedRole, setSelectedRole] = useState('user');"
);

content = content.replace(
  "await AuthService.signUpWithEmail(email, password, role, name);",
  "await AuthService.signUpWithEmail(email, password, selectedRole, name);"
);

content = content.replace(
  /value=\{role\}/g,
  "value={selectedRole}"
);

content = content.replace(
  /onChange=\{\(e\) => setRole\(e.target.value\)\}/g,
  "onChange={(e) => setSelectedRole(e.target.value)}"
);

fs.writeFileSync('src/components/AuthModal.jsx', content);
