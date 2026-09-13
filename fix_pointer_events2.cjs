const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// The main overlay wrapper
content = content.replace(
  '<div className="relative z-30 w-full p-4 flex flex-col justify-end pb-4 h-full">',
  '<div className="relative z-30 w-full p-4 flex flex-col justify-end pb-4 h-full pointer-events-none">'
);

// Sidebar
content = content.replace(
  '<div className="absolute right-2 bottom-[90px] z-30 flex flex-col items-center gap-5 text-white drop-shadow-md">',
  '<div className="absolute right-2 bottom-[90px] z-30 flex flex-col items-center gap-5 text-white drop-shadow-md pointer-events-auto">'
);

// Left Side Info
content = content.replace(
  '<div className="w-[85%] mb-4 space-y-2">',
  '<div className="w-[85%] mb-4 space-y-2 pointer-events-auto">'
);

// Product Mini Card
content = content.replace(
  '<div className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors">',
  '<div className="w-full bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors pointer-events-auto">'
);

// Also the Top Header Overlay
content = content.replace(
  '<div className="hidden md:flex relative z-30 w-full px-4 pt-3 pb-2 items-center justify-between">',
  '<div className="hidden md:flex relative z-30 w-full px-4 pt-3 pb-2 items-center justify-between pointer-events-auto">'
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Fixed pointer events to allow clicking the video player");
