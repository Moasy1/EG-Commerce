const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Header.jsx', 'utf8');

// Fix superadmin seeing all menus
code = code.replace(
  /{user\?\.role === 'user' && \(/g, 
  "{(user?.role === 'user' || user?.role === 'superadmin') && ("
);
code = code.replace(
  /{user\?\.role === 'merchant' && \(/g, 
  "{(user?.role === 'merchant' || user?.role === 'superadmin') && ("
);
code = code.replace(
  /{user\?\.role === 'driver' && \(/g, 
  "{(user?.role === 'driver' || user?.role === 'superadmin') && ("
);

// Fix button overflow for Login/Sign Up
// Replacing: className={`ml-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
code = code.replace(
  /className=\{`ml-2 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 \$\{/g,
  "className={`ms-1 sm:ms-2 px-2.5 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-all shadow-sm flex items-center gap-1 whitespace-nowrap ${"
);

// We should also replace the literal text for shorter version on mobile if needed, but text size and whitespace-nowrap will help.
code = code.replace(
  /{isAr \? 'دخول \/ تسجيل' : 'Login \/ Sign Up'}/g,
  "{isAr ? 'دخول' : 'Login'}"
);

fs.writeFileSync('src/components/layout/Header.jsx', code);
console.log("Superadmin menus and button fixed!");
