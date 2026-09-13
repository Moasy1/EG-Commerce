const fs = require('fs');
let content = fs.readFileSync('src/components/desktop/DesktopSellerDashboard.jsx', 'utf8');

// Move currentMerchant definition above useEffect
content = content.replace(
  `  const [stats, setStats] = useState({ revenue: 0, orders: 0, reach: 0, engagement: 0 });

  useEffect(() => {
    if (currentMerchant?.id) {
      MerchantService.getDashboardStats(currentMerchant.id).then(setStats);
    }
  }, [currentMerchant?.id]);

  const currentMerchant = merchants?.find(m => m.id === selectedMerchantId) || merchants?.[0];
  const merchantOrders = orders?.filter(o => o.merchantId === currentMerchant?.id) || [];`,
  `  const [stats, setStats] = useState({ revenue: 0, orders: 0, reach: 0, engagement: 0 });

  const currentMerchant = merchants?.find(m => m.id === selectedMerchantId) || merchants?.[0];
  const merchantOrders = orders?.filter(o => o.merchantId === currentMerchant?.id) || [];

  useEffect(() => {
    if (currentMerchant?.id) {
      MerchantService.getDashboardStats(currentMerchant.id).then(setStats);
    }
  }, [currentMerchant?.id]);`
);

fs.writeFileSync('src/components/desktop/DesktopSellerDashboard.jsx', content);
console.log("Fixed declaration order in DesktopSellerDashboard");
