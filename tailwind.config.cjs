/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ─── Canonical Color Palette ─── */
      colors: {
        primary: {
          50:  '#FFF5EB',
          100: '#FFE8CC',
          200: '#FFD199',
          300: '#FFB366',
          400: '#FFA24D',
          DEFAULT: '#FF9933',  // Deep Saffron — brand anchor
          500: '#FF9933',
          600: '#E67E22',
          700: '#CC6A1A',
          800: '#A35215',
          900: '#7A3D10',
        },
        secondary: {
          50:  '#FDF3F3',
          100: '#FAE2E2',
          200: '#F4BBBB',
          300: '#E88080',
          400: '#CC3A3A',
          DEFAULT: '#9B1C1C',  // Sacred Maroon — kumkum/sindoor (dharmik)
          500: '#9B1C1C',
          600: '#7D1616',
          700: '#601111',
          800: '#420C0C',
          900: '#2C0707',  // Deep sacred maroon — navbar bg
        },
        accent: {
          50:  '#FFFDF0',
          100: '#FFF8D6',
          200: '#FFEDA8',
          300: '#F5D060',
          DEFAULT: '#D4AF37',  // Temple Gold — traditional, divine
          400: '#D4AF37',
          500: '#BF9B2F',
          600: '#A38522',
          700: '#8A7018',
        },
        surface: {
          DEFAULT: '#FAF9F6',  // Warm paper white — page bg
          raised:  '#FFFFFF',  // Cards / elevated surfaces
          sunken:  '#F3F1EC',  // Inset panels, sidebar bg
          border:  '#E5E0D5',  // Default border
        },
        ink: {
          DEFAULT: '#2C2C2C',  // Body text
          muted:   '#6B6560',  // Secondary / caption text
          faint:   '#A09A92',  // Placeholder, disabled
        },
        semantic: {
          success: '#2E7D32',
          error:   '#C62828',
          warning: '#F57F17',
          info:    '#1565C0',
        },
      },

      /* ─── Typography Scale ─── */
      fontFamily: {
        serif: ["'Noto Serif Devanagari'", "'Noto Serif'", 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        devanagari: ["'Noto Serif Devanagari'", 'serif'],
      },
      fontSize: {
        /* Display — Hero / landing headlines */
        'display':   ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],   // 48px
        'display-lg':['3.75rem', { lineHeight: '1.1',  letterSpacing: '-0.025em', fontWeight: '700' }],  // 60px
        /* Heading — Page & section titles */
        'h1':        ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.015em', fontWeight: '600' }],  // 36px
        'h2':        ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.01em',  fontWeight: '600' }],  // 28px
        'h3':        ['1.375rem',{ lineHeight: '1.3',  fontWeight: '600' }],                             // 22px
        'h4':        ['1.125rem',{ lineHeight: '1.35', fontWeight: '600' }],                             // 18px
        /* Body */
        'body':      ['1rem',    { lineHeight: '1.65' }],                                               // 16px
        'body-sm':   ['0.875rem',{ lineHeight: '1.6' }],                                                // 14px
        /* Caption / labels */
        'caption':   ['0.75rem', { lineHeight: '1.5',  letterSpacing: '0.01em' }],                      // 12px
        'overline':  ['0.6875rem',{ lineHeight: '1.4', letterSpacing: '0.06em', fontWeight: '600' }],   // 11px
      },

      /* ─── Spacing & Layout ─── */
      spacing: {
        'section': '5rem',       // 80px — vertical rhythm between sections
        'section-sm': '3rem',    // 48px — compact section gap
        'content': '4.5rem',     // 72px — max-w container padding
      },
      maxWidth: {
        'page':    '72rem',      // 1152px — main content ceiling
        'content': '48rem',      // 768px  — prose / narrow content
        'narrow':  '36rem',      // 576px  — forms, login, modals
      },
      borderRadius: {
        'card': '0.75rem',       // 12px  — cards, panels
        'pill': '9999px',        // full  — tags, badges
        'btn':  '0.5rem',        // 8px   — buttons, inputs
      },
      boxShadow: {
        'card':     '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'elevated': '0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)',
        'dropdown': '0 4px 16px rgba(0,0,0,0.12)',
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
    'bg-primary-100','text-primary-800','ring-2','ring-primary-300',
  ],
  plugins: [],
}
