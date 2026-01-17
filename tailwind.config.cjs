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
        primary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
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
