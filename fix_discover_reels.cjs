const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// 1. Add isMobile state
const isMobileHook = `
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
`;

// Find a good place to insert it
content = content.replace(
  'const [isEditModalOpen, setIsEditModalOpen] = useState(false);',
  'const [isEditModalOpen, setIsEditModalOpen] = useState(false);' + isMobileHook
);

// 2. Wrap the desktop and mobile views in condition
content = content.replace(
  '{/* 1. DESKTOP GRID VIEW (when toggled to Grid) */}',
  '{!isMobile && (\n        <>\n        {/* 1. DESKTOP GRID VIEW (when toggled to Grid) */}'
);

content = content.replace(
  /      \{\/\* 3\. MOBILE FULL-SCREEN VIEW \(Native Vertical Swipe Experience\) \*\/\}/,
  `        </>\n      )}\n      {/* 3. MOBILE FULL-SCREEN VIEW (Native Vertical Swipe Experience) */}\n      {isMobile && (`
);

content = content.replace(
  /        \{\/\* Edit Reel Modal \*\/\}/,
  `      )}\n        {/* Edit Reel Modal */}`
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("DiscoverReels fixed!");
