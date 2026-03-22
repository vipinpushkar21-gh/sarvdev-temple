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
          50:  '#F5F0ED',
          100: '#E8DDD6',
          200: '#D1BBAD',
          300: '#B09480',
          400: '#8A6B55',
          DEFAULT: '#5C4033',  // Warm earth brown — grounding tone
          500: '#5C4033',
          600: '#4A3329',
          700: '#382620',
          800: '#261A16',
          900: '#1A110F',
        },
        accent: {
          50:  '#FFFDF0',
          100: '#FFF9D6',
          200: '#FFF2A8',
          300: '#FFE970',
          DEFAULT: '#FFD700',  // Ritual gold
          400: '#FFD700',
          500: '#E6C200',
          600: '#CCA800',
          700: '#997E00',
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
