const fs = require('fs');
let content = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

// Add user
content = content.replace(
  "const { cartItems, grandTotal, discountFromPoints, shippingTotal, subtotal, setActiveTab, setOrders } = useApp();",
  "const { cartItems, grandTotal, discountFromPoints, shippingTotal, subtotal, setActiveTab, setOrders, user } = useApp();"
);

// Replace null with user.id
content = content.replace(
  "null // We'd pass current user ID here when auth is integrated",
  "user?.id || null"
);

fs.writeFileSync('src/pages/Checkout.jsx', content);
console.log("Checkout fixed!");
