const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Unified site palette
        primary: {
          DEFAULT: '#FF9933',      // Deep Saffron
          400: '#FFB366',          // Slightly lighter for rings/hover
          500: '#FF9933',
          600: '#E67E22',          // Slightly darker
        },
        secondary: {
          DEFAULT: '#5C4033',      // Deep earthy brown
        },
        accent: {
          DEFAULT: '#FFD700',      // Golden
        },
        background: '#FAF9F6',     // Off-white
        text: '#333333',           // Dark Gray
      },
      fontFamily: {
        // Global font family preference
        serif: ["'Noto Serif Devanagari'", "'Noto Serif'", 'serif'],
        // Keep existing keys for compatibility with older components
        playfair: ["'Playfair Display'", 'serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        sansDev: ['TiroDevanagariSanskrit', 'Noto Serif Devanagari', 'serif'],
      },
      transitionProperty: {
        'height': 'height',
      },
    },
  },
  safelist: [
    // Admin/status variants toggled at runtime
    'bg-emerald-100','text-emerald-800','bg-yellow-100','text-yellow-800',
    'bg-rose-100','text-rose-800','bg-blue-100','text-blue-800',
    'bg-orange-100','text-orange-800','ring-2','ring-primary-400',
  ],
  plugins: [],
}
