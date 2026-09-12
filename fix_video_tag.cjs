const fs = require('fs');
const content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

const regex = /<img\s*src=\{reel\.videoBg\}\s*alt=\{reel\.creatorHandle\}\s*className="w-full h-full object-cover object-center pointer-events-none"\s*loading="eager"\s*\/>/s;

const replacement = `
          {reel.videoBg.includes('.mp4') ? (
            <video 
              src={reel.videoBg}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center pointer-events-none"
            />
          ) : (
            <img 
              src={reel.videoBg} 
              alt={reel.creatorHandle}
              className="w-full h-full object-cover object-center pointer-events-none"
              loading="eager"
            />
          )}
`;

if (regex.test(content)) {
  const newContent = content.replace(regex, replacement.trim());
  fs.writeFileSync('src/pages/DiscoverReels.jsx', newContent);
  console.log("Updated video rendering logic.");
} else {
  console.log("Regex missed!");
}
