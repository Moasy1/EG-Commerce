import React from 'react';

/**
 * Official EG-Commerce Arch Gateway Logo
 * Matches the exact emblem seen on the reference design image.
 */
export default function EgLogo({ className = "w-8 h-8", color = "#d00000" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`shrink-0 ${className}`}
    >
      {/* Outer Red Arch */}
      <path 
        d="M10 44V22C10 14.268 16.268 8 24 8C31.732 8 38 14.268 38 22V44H29V22C29 19.2386 26.7614 17 24 17C21.2386 17 19 19.2386 19 22V44H10Z" 
        fill={color} 
      />
      {/* Central Floating Arch / Pill Accent */}
      <path 
        d="M21.5 44V26C21.5 24.6193 22.6193 23.5 24 23.5C25.3807 23.5 26.5 24.6193 26.5 26V44H21.5Z" 
        fill={color} 
      />
    </svg>
  );
}
