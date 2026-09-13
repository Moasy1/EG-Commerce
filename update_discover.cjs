const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// 1. Add isCaptionExpanded state
content = content.replace(
  "const [dragOffset, setDragOffset] = useState(0);",
  "const [dragOffset, setDragOffset] = useState(0);\n  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);"
);

// 2. Reset on handleNextReel
content = content.replace(
  "setIsSaved(false);\n    setTimeout(() => setIsTransitioning(false), 300);\n  };",
  "setIsSaved(false);\n    setIsCaptionExpanded(false);\n    setTimeout(() => setIsTransitioning(false), 300);\n  };"
);

// We need to do it globally since handleNextReel and handlePrevReel have similar ends.
content = content.replace(
  /setIsSaved\(false\);\n    setTimeout\(\(\) => setIsTransitioning\(false\), 300\);\n  };/g,
  "setIsSaved(false);\n    setIsCaptionExpanded(false);\n    setTimeout(() => setIsTransitioning(false), 300);\n  };"
);


// 3. Update the layout: Right Sidebar from bottom-28 to bottom-6
content = content.replace(
  '<div className="absolute right-4 bottom-28 flex flex-col gap-6 z-20 pointer-events-none items-center">',
  '<div className="absolute right-4 bottom-6 flex flex-col gap-6 z-20 pointer-events-none items-center">'
);

// 4. Update the layout: Main Overlay from bottom-24 to bottom-6
content = content.replace(
  '<div className="absolute bottom-24 left-4 right-[60px] flex flex-col justify-end space-y-3 z-20 pointer-events-auto">',
  '<div className="absolute bottom-6 left-4 right-[60px] flex flex-col justify-end space-y-3 z-20 pointer-events-auto">'
);

// 5. Update the caption to be expandable
const oldCaption = `<p className="text-[13px] text-white drop-shadow-md leading-snug">
                {reel.caption}
              </p>
              <p className="text-[13px] font-bold text-white drop-shadow-md">
                #EgyptianFashion #OOTD #Style
              </p>`;

const newCaption = `
              <div 
                className={\`text-[13px] text-white drop-shadow-md leading-snug cursor-pointer transition-all \${isCaptionExpanded ? '' : 'line-clamp-2'}\`}
                onClick={(e) => { e.stopPropagation(); setIsCaptionExpanded(!isCaptionExpanded); }}
              >
                {reel.caption}
                {!isCaptionExpanded && (
                  <span className="font-bold opacity-90 ml-1 hover:underline">{isAr ? 'عرض المزيد' : 'more'}</span>
                )}
              </div>
              {isCaptionExpanded && (
                <p className="text-[13px] font-bold text-white drop-shadow-md animate-fade-in mt-1">
                  #EgyptianFashion #OOTD #Style
                </p>
              )}
`;

content = content.replace(oldCaption, newCaption);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Updated DiscoverReels");
