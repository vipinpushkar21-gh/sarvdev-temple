module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
  plugins: [],
}
