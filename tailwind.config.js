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
        "primary": "#ff4646",
        "primary-container": "#ff5450",
        "primary-fixed": "#ffdad7",
        "primary-fixed-dim": "#ffb3ad",
        "on-primary": "#ffffff",
        "on-primary-container": "#5c0007",
        
        "secondary": "#ffb800",
        "secondary-container": "#feb700",
        "secondary-fixed": "#ffdea8",
        "secondary-fixed-dim": "#ffba20",
        "on-secondary": "#412d00",
        "on-secondary-container": "#6b4b00",
        
        "tertiary": "#10b981",
        "tertiary-container": "#00a572",
        "tertiary-fixed": "#6ffbbe",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary": "#003824",
        "on-tertiary-container": "#00311f",
        
        "surface": "#0c141f",
        "surface-dim": "#0c141f",
        "surface-bright": "#323946",
        "surface-container-lowest": "#070e1a",
        "surface-container-low": "#151c28",
        "surface-container": "#19202c",
        "surface-container-high": "#232a37",
        "surface-container-highest": "#2e3542",
        "surface-variant": "#2e3542",
        "on-surface": "#dce2f3",
        "on-surface-variant": "#94a3b8",
        
        "outline": "#ac8885",
        "outline-variant": "#5c403d",
        
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005"
      },
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'IBM Plex Sans Arabic', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "0.75rem",
        "space-lg": "1.25rem",
        "space-xl": "2rem",
        "gutter": "1rem",
        "gutter-mobile": "0.75rem",
        "gutter-desktop": "2rem",
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "md": "0.75rem",
        "lg": "1rem",
        "xl": "1.5rem",
        "2xl": "2rem",
        "full": "9999px"
      }
    },
  },
  plugins: [],
}
