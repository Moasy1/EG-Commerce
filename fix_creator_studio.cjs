const fs = require('fs');
let content = fs.readFileSync('src/pages/CreatorStudio.jsx', 'utf8');

// Add imports
content = content.replace(
  "import { useApp } from '../context/AppContext';",
  "import { useApp } from '../context/AppContext';\nimport { UgcService } from '../services/UgcService';\nimport { useEffect } from 'react';"
);

// Add user and load state
content = content.replace(
  "const { setActiveTab } = useApp();",
  "const { setActiveTab, user } = useApp();\n  const [campaignsList, setCampaignsList] = useState([]);\n  const [loading, setLoading] = useState(true);"
);

// Add useEffect
content = content.replace(
  "const [appliedIds, setAppliedIds] = useState(['camp-1']);",
  `const [appliedIds, setAppliedIds] = useState([]);
  
  useEffect(() => {
    const loadCampaigns = async () => {
      setLoading(true);
      const data = await UgcService.getCampaigns();
      setCampaignsList(data);
      // In a real app we would also fetch user applications to populate appliedIds
      setAppliedIds(data.filter(c => c.status === 'applied').map(c => c.id));
      setLoading(false);
    };
    loadCampaigns();
  }, []);`
);

// Remove hardcoded campaigns
content = content.replace(
  /const campaigns = \[\s*\{\s*id: 'camp-1',[\s\S]*?\];/g,
  ""
);

// Update handleApply
content = content.replace(
  `const handleApply = (id) => {
    if (!appliedIds.includes(id)) {
      setAppliedIds(prev => [...prev, id]);
    }
  };`,
  `const handleApply = async (id) => {
    if (!user) {
      alert("Please sign in to apply");
      return;
    }
    if (!appliedIds.includes(id)) {
      await UgcService.applyForCampaign(id, user.id);
      setAppliedIds(prev => [...prev, id]);
    }
  };`
);

// Use campaignsList instead of campaigns in the render
content = content.replace(
  "campaigns.map",
  "campaignsList.map"
);

// Fix mapping inside render
content = content.replace(
  /{camp\.brand}/g,
  "{camp.merchants?.name || camp.merchant_name || 'Brand'}"
);
content = content.replace(
  /{camp\.product}/g,
  "{camp.products?.title || 'Product Name'}"
);
content = content.replace(
  /{camp\.rewardType}/g,
  "{camp.reward_type === 'free_product' ? 'Free Product' : (camp.reward_type || 'Reward')}"
);
content = content.replace(
  /{camp\.slots}/g,
  "{(camp.slots_available || 0) + ' Slots left'}"
);

fs.writeFileSync('src/pages/CreatorStudio.jsx', content);
console.log("CreatorStudio fixed!");
