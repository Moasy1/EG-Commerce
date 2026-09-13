const fs = require('fs');
const content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

let newContent = content.replace(
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
  'https://media.w3.org/2010/05/sintel/trailer.mp4'
);

newContent = newContent.replace(
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
  'https://media.w3.org/2010/05/video/movie_300.mp4'
);

fs.writeFileSync('src/pages/DiscoverReels.jsx', newContent);
console.log("Fixed video URLs to working media.w3.org ones.");
