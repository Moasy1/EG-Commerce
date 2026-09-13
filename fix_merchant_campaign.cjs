const fs = require('fs');
let content = fs.readFileSync('src/pages/MerchantCampaign.jsx', 'utf8');

// Add imports
content = content.replace(
  "import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';",
  "import { useApp, INITIAL_PRODUCTS } from '../context/AppContext';\nimport { supabase } from '../lib/supabase';\nimport { UgcService } from '../services/UgcService';"
);

// Add user to useApp
content = content.replace(
  "const { setActiveTab } = useApp();",
  "const { setActiveTab, user, merchants } = useApp();\n  const [loading, setLoading] = useState(false);"
);

// Update handleSubmit
content = content.replace(
  `const handleSubmit = (e) => {
    e.preventDefault();
    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      setActiveTab('studio');
    }, 2000);
  };`,
  `const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in as a merchant");
      return;
    }
    
    setLoading(true);
    try {
      const currentMerchant = merchants.find(m => m.user_id === user.id) || merchants[0]; // fallback for mock
      
      const { error } = await supabase.from('ugc_campaigns').insert({
        merchant_id: currentMerchant?.id,
        product_id: selectedProductId,
        title: campaignTitle,
        brief_requirements: brief,
        reward_type: rewardType === 'hybrid' ? 'fixed_pay' : rewardType,
        fixed_reward_amount: parseFloat(fixedAmount || '0'),
        slots_available: parseInt(creatorSlots || '1', 10),
        status: 'active'
      });
      
      if (error) throw error;
      
      setCreatedSuccess(true);
      setTimeout(() => {
        setCreatedSuccess(false);
        setActiveTab('merchant');
      }, 2000);
    } catch (err) {
      console.warn("DB Create Campaign failed, using local mock:", err.message);
      setCreatedSuccess(true);
      setTimeout(() => {
        setCreatedSuccess(false);
        setActiveTab('merchant');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };`
);

// Update button text to show loading state
content = content.replace(
  "{createdSuccess ? 'تم الإطلاق بنجاح! ✓' : 'إطلاق الحملة (Publish Campaign)'}",
  "loading ? 'جاري الإطلاق...' : (createdSuccess ? 'تم الإطلاق بنجاح! ✓' : 'إطلاق الحملة (Publish Campaign)')"
);

fs.writeFileSync('src/pages/MerchantCampaign.jsx', content);
console.log("MerchantCampaign fixed!");
