const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// Add AuthService import
content = content.replace(
  "import { CartService } from '../services/CartService';",
  "import { CartService } from '../services/CartService';\nimport { AuthService } from '../services/AuthService';"
);

// Add user state
content = content.replace(
  "const [language, setLanguage] = useState('ar'); // 'ar' | 'en'",
  "const [language, setLanguage] = useState('ar'); // 'ar' | 'en'\n  const [user, setUser] = useState(null);\n  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);"
);

// Add auth loading in loadData
content = content.replace(
  "const fetchedProducts = await ProductService.getProducts();",
  `const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      
      const fetchedProducts = await ProductService.getProducts();`
);

// Expose user and auth modal functions
content = content.replace(
  "language,\n      setLanguage,",
  "language,\n      setLanguage,\n      user,\n      setUser,\n      isAuthModalOpen,\n      setIsAuthModalOpen,"
);

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log("AppContext Auth state added!");
