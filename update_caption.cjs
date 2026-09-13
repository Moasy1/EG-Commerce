const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

const oldCaption = `
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

const newCaption = `
              <div 
                className="cursor-pointer space-y-1"
                onClick={(e) => { e.stopPropagation(); setIsCaptionExpanded(!isCaptionExpanded); }}
              >
                <div className={\`text-[13px] text-white drop-shadow-md leading-snug transition-all \${isCaptionExpanded ? '' : 'line-clamp-1'}\`}>
                  {reel.caption}
                </div>
                {!isCaptionExpanded && (
                  <div className="font-bold text-white/90 text-[12px] drop-shadow-md hover:underline">{isAr ? 'عرض المزيد' : 'more'}</div>
                )}
                {isCaptionExpanded && (
                  <p className="text-[13px] font-bold text-white drop-shadow-md animate-fade-in">
                    #EgyptianFashion #OOTD #Style
                  </p>
                )}
              </div>
`;

content = content.replace(oldCaption, newCaption);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Updated caption formatting");
