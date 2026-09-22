import React from 'react';

/**
 * Official EG-Commerce Logo
 * Renders the new official brand logo: /logo_eg_commerce.svg
 */
export default function EgLogo({ className = "w-8 h-8", color, alt = "EG-Commerce Logo", ...props }) {
  return (
    <img 
      src="/logo_eg_commerce.svg" 
      alt={alt}
      className={`shrink-0 object-contain inline-block select-none ${className}`}
      loading="eager"
      {...props}
    />
  );
}
