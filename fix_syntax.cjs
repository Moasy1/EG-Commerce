const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

content = content.replace(
  '      )}        );};',
  '      )}    </div>  );};'
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Fixed syntax!");
