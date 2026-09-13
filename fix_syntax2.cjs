const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

const regex = /      \)\}        \);\};\nexport default function DiscoverReels\(\) \{/;
if (regex.test(content)) {
  content = content.replace(regex, '      )}\n    </div>\n  );\n};\n\nexport default function DiscoverReels() {');
  fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
  console.log("Fixed syntax 2!");
} else {
  // Let's just do a manual string replace if regex fails
  const strToFind = '      )}        );};\nexport default function DiscoverReels() {';
  if (content.includes(strToFind)) {
    content = content.replace(strToFind, '      )}\n    </div>\n  );\n};\n\nexport default function DiscoverReels() {');
    fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
    console.log("Fixed syntax 3!");
  } else {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('      )}        );};')) {
        lines[i] = '      )}\n    </div>\n  );\n};';
      }
    }
    fs.writeFileSync('src/pages/DiscoverReels.jsx', lines.join('\n'));
    console.log("Fixed syntax 4!");
  }
}
