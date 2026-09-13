const fs = require('fs');
let content = fs.readFileSync('src/pages/OrderTracking.jsx', 'utf8');

// Add imports
content = content.replace(
  "import { useApp } from '../context/AppContext';",
  "import { useApp } from '../context/AppContext';\nimport { useEffect, useState } from 'react';\nimport { OrderService } from '../services/OrderService';"
);

// Add state
content = content.replace(
  "const { setActiveTab } = useApp();",
  "const { setActiveTab, user } = useApp();\n  const [orders, setOrders] = useState([]);\n\n  useEffect(() => {\n    const loadOrders = async () => {\n      if (user) {\n        const data = await OrderService.getOrders(user.id);\n        setOrders(data);\n      }\n    };\n    loadOrders();\n  }, [user]);\n\n  const latestOrder = orders.length > 0 ? orders[0] : null;"
);

// Replace hardcoded tracking ID
content = content.replace(
  "Tracking #EG-984201",
  "Tracking #{latestOrder ? latestOrder.id.substring(0,8).toUpperCase() : 'EG-984201'}"
);

// Update status text dynamically
content = content.replace(
  "Order Confirmed • تم تأكيد الأوردر بنجاح! 🎉",
  "{latestOrder?.status === 'pending' ? 'Order Pending • جاري تأكيد الطلب ⏳' : 'Order Confirmed • تم تأكيد الأوردر بنجاح! 🎉'}"
);

fs.writeFileSync('src/pages/OrderTracking.jsx', content);
console.log("OrderTracking fixed!");
