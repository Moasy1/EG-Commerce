const fs = require('fs');
let content = fs.readFileSync('src/pages/RewardsHub.jsx', 'utf8');

// Add import
content = content.replace(
  "import { useApp } from '../context/AppContext';",
  "import { useApp } from '../context/AppContext';\nimport { RewardService } from '../services/RewardService';\nimport { useEffect } from 'react';"
);

// Add state for history and user
content = content.replace(
  "const { rewardPoints, setRewardPoints } = useApp();\n  const [redeemSuccess, setRedeemSuccess] = useState('');",
  "const { rewardPoints, setRewardPoints, user } = useApp();\n  const [redeemSuccess, setRedeemSuccess] = useState('');\n  const [history, setHistory] = useState([]);\n\n  useEffect(() => {\n    const loadHistory = async () => {\n      const hist = await RewardService.getHistory(user?.id);\n      setHistory(hist);\n    };\n    loadHistory();\n  }, [user]);"
);

// Update handleRedeemVoucher to use RewardService
content = content.replace(
  `const handleRedeemVoucher = (voucher) => {
    if (rewardPoints >= voucher.points) {
      setRewardPoints(prev => prev - voucher.points);
      setRedeemSuccess(\`تم استبدال فوتشر "\${voucher.title}" بنجاح! تم حفظ الكود في محفظتك.\`);
      setTimeout(() => setRedeemSuccess(''), 4000);
    } else {
      alert('عفواً، رصيد الـ Points غير كافٍ لهذا الفوتشر.');
    }
  };`,
  `const handleRedeemVoucher = async (voucher) => {
    const result = await RewardService.redeemPoints(user?.id, voucher.points, \`Redeemed: \${voucher.title}\`);
    if (result.success) {
      setRewardPoints(result.newBalance);
      setRedeemSuccess(\`تم استبدال فوتشر "\${voucher.title}" بنجاح! تم حفظ الكود في محفظتك.\`);
      setTimeout(() => setRedeemSuccess(''), 4000);
      
      // refresh history
      const hist = await RewardService.getHistory(user?.id);
      setHistory(hist);
    } else {
      alert(result.message || 'عفواً، رصيد الـ Points غير كافٍ لهذا الفوتشر.');
    }
  };`
);

// Remove hardcoded history array
content = content.replace(
  /const history = \[\s*\{ title: 'Order Purchase[\s\S]*?\];/,
  ""
);

// Fix mapped history render to use h.id instead of index if needed (optional)
fs.writeFileSync('src/pages/RewardsHub.jsx', content);
console.log("RewardsHub fixed!");
