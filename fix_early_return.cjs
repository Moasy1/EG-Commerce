const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

const mainReturnRegex = /  return \(\n    <div className="w-full h-full flex flex-col items-center justify-center relative bg-black/;

const earlyReturnStr = '  if (isLoading || reelsList.length === 0) return <div className="w-full h-full bg-black flex items-center justify-center text-white"><span className="material-symbols-outlined animate-spin text-4xl">sync</span></div>;\n\n';

content = content.replace(mainReturnRegex, earlyReturnStr + '  return (\n    <div className="w-full h-full flex flex-col items-center justify-center relative bg-black');

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Added early return back!");
