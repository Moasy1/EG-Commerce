const fs = require('fs');
let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

content = content.replace(
  'ref={videoRef}\n          src={reel.videoBg}\n          loop\n          playsInline',
  'ref={videoRef}\n          src={reel.videoBg}\n          loop\n          playsInline\n          autoPlay={isActive}'
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Added autoPlay attr");
