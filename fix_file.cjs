const fs = require('fs');

const missingTop = `import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import EgLogo from '../components/common/EgLogo';
import { ReelsService } from '../services/ReelsService';
import DesktopFeed from '../components/desktop/DesktopFeed';

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
    <div className="absolute inset-0 bg-black" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={reel.videoBg}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted={isGlobalMuted}
      />
      {/* Mute Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"
      >
        <span className="material-symbols-outlined">{isGlobalMuted ? 'volume_off' : 'volume_up'}</span>
      </button>
    </div>
  );
};

`;

let content = fs.readFileSync('src/pages/DiscoverReels.jsx', 'utf8');

const brokenPart = content.split('export default function DiscoverReels() {')[0];

content = content.replace(brokenPart, missingTop);

fs.writeFileSync('src/pages/DiscoverReels.jsx', content);
console.log("Fixed missing top part!");
