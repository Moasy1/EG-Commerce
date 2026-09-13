const fs = require('fs');
let content = fs.readFileSync('src/pages/Checkout.jsx', 'utf8');

content = content.replace(
  `const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const order = await OrderService.createOrder(
        cartItems,
        subtotal,
        discountFromPoints,
        shippingTotal,
        grandTotal,
        user?.id || null
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
  };`,
  `const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate Paymob / Stripe Gateway redirection & processing delay
    if (paymentMethod === 'card') {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating 3D secure
    } else if (paymentMethod === 'instapay') {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulating Instapay deep link verification
    }
    
    try {
      const order = await OrderService.createOrder(
        cartItems,
        subtotal,
        discountFromPoints,
        shippingTotal,
        grandTotal,
        user?.id || null
      );
      
      // Update local orders list conceptually
      setOrders(prev => [order, ...prev]);
      
      setIsProcessing(false);
      setActiveTab('tracking');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert('Failed to place order. Payment gateway declined.');
    }
  };`
);

fs.writeFileSync('src/pages/Checkout.jsx', content);
console.log("Checkout Paymob simulation added!");
