/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#000000",
        "primary-container": "#1b1b1e",
        "on-primary": "#ffffff",
        "on-primary-container": "#858387",
        "primary-fixed": "#e4e1e6",
        "primary-fixed-dim": "#c8c5ca",
        "on-primary-fixed": "#1b1b1e",
        "on-primary-fixed-variant": "#47464a",
        
        "secondary": "#d00000",
        "secondary-container": "#fd8c6d",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#74240e",
        "secondary-fixed": "#ffdbd1",
        "secondary-fixed-dim": "#ffb4a1",
        "on-secondary-fixed": "#3c0800",
        "on-secondary-fixed-variant": "#7e2b15",
        
        "tertiary": "#000000",
        "tertiary-container": "#2c1600",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#a77b4e",
        "tertiary-fixed": "#ffdcbd",
        "tertiary-fixed-dim": "#f0bd8b",
        "on-tertiary-fixed": "#2c1600",
        "on-tertiary-fixed-variant": "#623f18",
        
        "surface": "#fbf9f6",
        "surface-dim": "#dbdad7",
        "surface-bright": "#fbf9f6",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3f0",
        "surface-container": "#efeeeb",
        "surface-container-high": "#eae8e5",
        "surface-container-highest": "#e4e2df",
        "surface-variant": "#e4e2df",
        "background": "#fbf9f6",
        "on-surface": "#1b1c1a",
        "on-background": "#1b1c1a",
        "on-surface-variant": "#47464b",
        "inverse-surface": "#30312f",
        "inverse-on-surface": "#f2f0ed",
        "inverse-primary": "#c8c5ca",
        
        "outline": "#77767b",
        "outline-variant": "#c8c5cb",
        
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a"
      },
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
        sans: ['IBM Plex Sans Arabic', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
        headline: ['Noto Serif', 'serif'],
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "gutter": "1.5rem",
        "gutter-mobile": "0.75rem",
        "margin-mobile": "1.25rem",
        "margin": "3rem"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      }
    },
  },
  plugins: [],
}
