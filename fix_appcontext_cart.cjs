const fs = require('fs');
let content = fs.readFileSync('src/context/AppContext.jsx', 'utf8');

// Replace the hardcoded initial cart
const initialCartRegex = /const \[cartItems, setCartItems\] = useState\(\[[\s\S]*?\]\);/;
content = content.replace(initialCartRegex, "const [cartItems, setCartItems] = useState([]);");

// Update loadData in useEffect to also load Cart
content = content.replace(
  "setMerchants(fetchedMerchants);",
  `setMerchants(fetchedMerchants);\n\n      const fetchedCart = await CartService.getCartItems();\n      setCartItems(fetchedCart);`
);

// Add import
content = content.replace(
  "import { ProductService } from '../services/ProductService';",
  "import { ProductService } from '../services/ProductService';\nimport { CartService } from '../services/CartService';"
);

// Update addToCart
content = content.replace(
  `const addToCart = (product, selectedVariant = {}) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id && item.size === (selectedVariant.size || 'M'));
      if (existing) {
        return prev.map(item =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: \`c-\${Date.now()}\`,
          productId: product.id,
          title: product.title,
          merchant: product.merchant,
          price: product.price,
          quantity: 1,
          size: selectedVariant.size || 'M',
          color: selectedVariant.color || 'Default',
          image: product.image
        }
      ];
    });
  };`,
  `const addToCart = async (product, selectedVariant = {}) => {
    const size = selectedVariant.size || 'M';
    const color = selectedVariant.color || 'Default';
    
    // Optimistic UI update could go here, but we will wait for service
    const updatedCart = await CartService.addToCart(product.id, product.merchantId, product.price, 1, size, color);
    
    // In our fallback we get an array back, in real DB we get item. 
    // Just refetch cart for simplicity for this prototype transition
    const fetchedCart = await CartService.getCartItems();
    setCartItems(fetchedCart);
  };`
);

fs.writeFileSync('src/context/AppContext.jsx', content);
console.log("AppContext Cart fixed!");
