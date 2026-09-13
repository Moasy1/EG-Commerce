const fs = require('fs');
let content = fs.readFileSync('src/components/desktop/DesktopSellerDashboard.jsx', 'utf8');

// Add import
content = content.replace(
  "import { useApp } from '../../context/AppContext';",
  "import { useApp } from '../../context/AppContext';\nimport { MerchantService } from '../../services/MerchantService';\nimport { useEffect } from 'react';"
);

// Add stats state
content = content.replace(
  "const [orderFilter, setOrderFilter] = useState('all');",
  "const [orderFilter, setOrderFilter] = useState('all');\n  const [stats, setStats] = useState({ revenue: 0, orders: 0, reach: 0, engagement: 0 });\n\n  useEffect(() => {\n    if (currentMerchant?.id) {\n      MerchantService.getDashboardStats(currentMerchant.id).then(setStats);\n    }\n  }, [currentMerchant?.id]);"
);

// Replace hardcoded stats
content = content.replace("45,600", "{stats.revenue.toLocaleString()}");
content = content.replace("128", "{stats.orders}");
content = content.replace("24,800", "{stats.reach.toLocaleString()}");
content = content.replace("4.8%", "{stats.engagement}%");

fs.writeFileSync('src/components/desktop/DesktopSellerDashboard.jsx', content);
console.log("DesktopSellerDashboard fixed!");
