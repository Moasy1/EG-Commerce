const fs = require('fs');
const content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// Fix Main Content Area
let newContent = content.replace(
  '<div className="relative z-30 w-full p-4 flex flex-col justify-end pb-4 h-full">',
  '<div className="relative z-30 w-full p-4 flex flex-col justify-end pb-4 h-full pointer-events-none">'
);

// Fix children to have pointer-events-auto
newContent = newContent.replace(
  '<div className="absolute right-2 bottom-[90px] z-30 flex flex-col items-center gap-5 text-white drop-shadow-md">',
  '<div className="absolute right-2 bottom-[90px] z-30 flex flex-col items-center gap-5 text-white drop-shadow-md pointer-events-auto">'
);

newContent = newContent.replace(
  '{/* Left Side: Creator Info & Caption */}',
  '{/* Left Side: Creator Info & Caption */}\n          <div className="w-[85%] mb-4 space-y-2 pointer-events-auto">'
);

// I need to be careful with the Left Side div replacement because it might not be exact.
