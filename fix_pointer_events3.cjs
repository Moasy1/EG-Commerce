const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

content = content.replace(
  '<div className="w-full pr-[60px] flex flex-col justify-end space-y-3 mt-auto">',
  '<div className="w-full pr-[60px] flex flex-col justify-end space-y-3 mt-auto pointer-events-auto">'
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Fixed pointer events for creator info wrapper");
