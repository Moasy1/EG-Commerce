const fs = require('fs');
const content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

// We'll insert ReelVideoPlayer just before `export default function DiscoverReels() {`
const componentCode = `
const ReelVideoPlayer = ({ reel, isActive, isGlobalMuted, toggleMute }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    
    // Play only if active
    if (isActive) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.log("Autoplay prevented:", err);
          setIsPlaying(false);
        });
      // Optionally reset time to 0: videoRef.current.currentTime = 0;
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  // Sync mute state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isGlobalMuted;
    }
  }, [isGlobalMuted]);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full z-0 cursor-pointer" onClick={togglePlay}>
      {reel.videoBg.includes('.mp4') ? (
        <video 
          ref={videoRef}
          src={reel.videoBg}
          loop
          playsInline
          muted={isGlobalMuted}
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none" />
      
      {/* Play Icon when Paused */}
      {!isPlaying && reel.videoBg.includes('.mp4') && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-16 h-16 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl border border-white/10">
            <span className="material-symbols-outlined text-[36px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </div>
        </div>
      )}

      {/* Floating Mute Toggle button (Desktop & Mobile) */}
      {reel.videoBg.includes('.mp4') && (
        <button 
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="absolute top-16 right-4 md:top-20 md:right-4 z-40 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-md border border-white/10 hover:bg-black/60 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isGlobalMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>
      )}
    </div>
  );
};
`;

let newContent = content.replace('export default function DiscoverReels() {', componentCode + '\nexport default function DiscoverReels() {\n');

// Next, add `const [isGlobalMuted, setIsGlobalMuted] = useState(true);` to DiscoverReels state
newContent = newContent.replace('const [desktopViewMode, setDesktopViewMode] = useState(\'player\'); // \'player\' or \'grid\'', 
  'const [desktopViewMode, setDesktopViewMode] = useState(\'player\'); // \'player\' or \'grid\'\n  const [isGlobalMuted, setIsGlobalMuted] = useState(true);');

// Replace the hardcoded absolute inset-0 wrapper with ReelVideoPlayer
const oldWrapper = `<div className="absolute inset-0 w-full h-full z-0">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/95 pointer-events-none" />
        </div>`;

const newWrapper = `        <ReelVideoPlayer 
          reel={reel} 
          isActive={isActive} 
          isGlobalMuted={isGlobalMuted} 
          toggleMute={() => setIsGlobalMuted(!isGlobalMuted)} 
        />`;

if (newContent.includes(oldWrapper)) {
  newContent = newContent.replace(oldWrapper, newWrapper);
  fs.writeFileSync('src/pages/DiscoverReels.jsx', newContent);
  console.log("Successfully implemented custom video player");
} else {
  console.log("Wrapper not found!");
  // Let's write out the current file context for debugging if needed
}

