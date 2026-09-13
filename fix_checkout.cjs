const fs = require('fs');
let content = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Add import for OrderService
content = content.replace(
  "import { useApp } from '../context/AppContext';",
  "import { useApp } from '../context/AppContext';\nimport { OrderService } from '../services/OrderService';"
);

// Update handlePlaceOrder
content = content.replace(
  "const { grandTotal, discountFromPoints, shippingTotal, subtotal, setActiveTab } = useApp();",
  "const { cartItems, grandTotal, discountFromPoints, shippingTotal, subtotal, setActiveTab, setOrders } = useApp();"
);

content = content.replace(
  "const handlePlaceOrder = () => {\n    setIsProcessing(true);\n    setTimeout(() => {\n      setIsProcessing(false);\n      setActiveTab('tracking');\n    }, 1000);\n  };",
  `const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const order = await OrderService.createOrder(
        cartItems,
        subtotal,
        discountFromPoints,
        shippingTotal,
        grandTotal,
        null // We'd pass current user ID here when auth is integrated
      );
      
      // Update local orders list conceptually
      setOrders(prev => [order, ...prev]);
      
      setIsProcessing(false);
      setActiveTab('tracking');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert('Failed to place order.');
    }
  };`
);

fs.writeFileSync('src/pages/Checkout.jsx', content);
console.log("Checkout fixed!");
