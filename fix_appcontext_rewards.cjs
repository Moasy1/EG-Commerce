const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// Add import for RewardService
content = content.replace(
  "import { AuthService } from '../services/AuthService';",
  "import { AuthService } from '../services/AuthService';\nimport { RewardService } from '../services/RewardService';"
);

// Load rewards when user changes
content = content.replace(
  "const currentUser = await AuthService.getCurrentUser();",
  `const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        const balance = await RewardService.getBalance(currentUser.id);
        setRewardPoints(balance);
      }`
);

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log("AppContext Rewards fixed!");
