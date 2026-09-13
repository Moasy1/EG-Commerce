const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// We have an early return at line 288:
// if (isLoading || reelsList.length === 0) return <div...
// And a useEffect at line 385:
// useEffect(() => { ... handleKeyDown ...

// We must move the early return BELOW all hooks, or move the hooks ABOVE the early return.
// The easiest is to move the early return just before the render functions / return statement.
// The main return statement starts at:
//   return (
//     <div className="w-full h-full bg-black text-white relative flex flex-col md:flex-row overflow-hidden font-sans">

const earlyReturnStr = '  if (isLoading || reelsList.length === 0) return <div className="w-full h-full bg-black flex items-center justify-center text-white"><span className="material-symbols-outlined animate-spin text-4xl">sync</span></div>;';

content = content.replace(earlyReturnStr, '');

const mainReturnRegex = /  return \(\n    <div className="w-full h-full bg-black text-white relative flex flex-col md:flex-row overflow-hidden font-sans">/;

content = content.replace(mainReturnRegex, earlyReturnStr + '\n\n  return (\n    <div className="w-full h-full bg-black text-white relative flex flex-col md:flex-row overflow-hidden font-sans">');

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Moved early return below hooks!");
