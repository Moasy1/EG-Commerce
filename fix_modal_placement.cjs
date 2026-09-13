const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

const modalStart = content.indexOf('{isEditModalOpen && (');
if (modalStart !== -1) {
  const modalEnd = content.indexOf('    </div>\n  );\n};\n\nexport default function DiscoverReels');
  
  if (modalEnd !== -1) {
    const modalStr = content.substring(modalStart, modalEnd);
    
    // Remove it from current place
    content = content.replace(modalStr, '');
    
    // DiscoverReels ends with: 
    //       </div>
    //     </div>
    //   );
    // }
    
    content = content.replace(
      '      </div>\n    </div>\n  );\n}',
      '      </div>\n' + modalStr + '\n    </div>\n  );\n}'
    );
    
    fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
    console.log("Successfully moved modal!");
  } else {
    console.log("Could not find modal end");
  }
}
