/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ─── PREMIUM SACRED COLOR PALETTE (Redesign Era) ─── */
      colors: {
        /* New Primary: Sacred Saffron (warm, not neon orange) */
        primary: {
          50:  '#F9EDE3',
          100: '#F0D4BE',
          200: '#E6B89C',
          300: '#D89B78',
          400: '#CF8452',
          DEFAULT: '#C86A1A',  // Sacred saffron — warm, earthy, not bright
          500: '#C86A1A',
          600: '#B05D15',
          700: '#985010',
          800: '#7A3F0B',
          900: '#5D3008',
        },
        /* Secondary: Warm Earth Charcoal (refined brown-black) */
        secondary: {
          50:  '#F8F5F2',
          100: '#E8E1D8',
          200: '#D4C4B2',
          300: '#B5A08C',
          400: '#8F7B6D',
          DEFAULT: '#6F6258',  // Antique earth brown
          500: '#6F6258',
          600: '#5E5247',
          700: '#4D4439',
          800: '#3C332D',
          900: '#2B2520',
        },
        /* Accent: Antique Gold (muted, sophisticated) */
        accent: {
          50:  '#FEF9F0',
          100: '#FBF0D4',
          200: '#F7E6A8',
          300: '#F2D780',
          400: '#E8C860',
          DEFAULT: '#B58A3A',  // Antique gold — warm, not bright
          500: '#B58A3A',
          600: '#A07630',
          700: '#8B6228',
          800: '#72501F',
          900: '#5A3F18',
        },
        /* Deep Maroon: Sacred & Royal */
        maroon: {
          50:  '#F8ECEF',
          100: '#E8CDD8',
          200: '#D4ACB9',
          300: '#C18B9A',
          400: '#A76A7B',
          DEFAULT: '#6E2430',  // Deep sacred maroon
          500: '#6E2430',
          600: '#5E1D28',
          700: '#4E1620',
          800: '#3E0F18',
          900: '#2E0810',
        },
        /* Premium Background Palette */
        surface: {
          DEFAULT: '#F6F1E7',  // Warm cream background
          raised:  '#FFFDF8',  // Card/elevated surface (warm white)
          sunken:  '#EDE5D7',  // Inset panels, sidebar bg
          border:  '#DED3C5',  // Soft warm border
        },
        ink: {
          DEFAULT: '#241C17',  // Premium dark text (warm black)
          muted:   '#6F6258',  // Secondary/caption text
          faint:   '#A39A8F',  // Placeholder, disabled text
        },
        /* Dark Sacred Surface (for themed sections) */
        'dark-sacred': {
          DEFAULT: '#171411',  // Deep charcoal for dark backgrounds
          elevated: '#2B2520',  // Slightly lighter for cards on dark
          border: '#3C332D',   // Border on dark surfaces
        },
        /* Premium Semantic Colors */
        semantic: {
          success: '#2E7D32',
          error:   '#C62828',
          warning: '#F57F17',
          info:    '#1565C0',
        },
        /* Legacy colors (kept for compatibility during transition) */
        'legacy-primary': '#FF9933',
        'legacy-secondary': '#5C4033',
      },

      /* ─── TYPOGRAPHY SCALE (8px-based, premium serif + modern sans) ─── */
      /* Font stacks resolve via CSS vars set in globals.css, backed by next/font (see app/fonts.ts) */
      fontFamily: {
        /* Display: Cormorant Garamond for English headings (elegant, luxe serif) */
        'display': [
          'var(--font-display)',
          'Georgia',
          '"Times New Roman"',
          'serif'
        ],
        /* Noto Serif Devanagari for Hindi headings (traditional, readable) */
        'devanagari-display': [
          'var(--font-display-hi)',
          '"Nirmala UI"',
          '"Mangal"',
          'Georgia',
          'serif'
        ],
        /* Body: Inter (modern, clean, world-class) */
        'sans': [
          'var(--font-body)',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif'
        ],
        /* Hindi body: Noto Sans Devanagari (modern, accessible) */
        'devanagari': [
          'var(--font-body-hi)',
          '"Nirmala UI"',
          '"Mangal"',
          'Arial',
          'sans-serif'
        ],
        /* Fallback serif (legacy) */
        'serif': [
          'Georgia',
          '"Times New Roman"',
          '"Nirmala UI"',
          '"Mangal"',
          'serif'
        ],
      },
      fontSize: {
        /* Display — Hero/landing headlines (4:3 ratio, 48-64px range) */
        'display':   ['3rem',    { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],   // 48px
        'display-lg':['3.75rem', { lineHeight: '1.1',  letterSpacing: '-0.025em', fontWeight: '700' }],  // 60px
        'display-xl':['4.5rem',  { lineHeight: '1.05', letterSpacing: '-0.03em',  fontWeight: '700' }],  // 72px
        /* Heading — Page & section titles (28-36px range) */
        'h1':        ['2.25rem', { lineHeight: '1.2',  letterSpacing: '-0.015em', fontWeight: '600' }],  // 36px
        'h2':        ['1.75rem', { lineHeight: '1.25', letterSpacing: '-0.01em',  fontWeight: '600' }],  // 28px
        'h3':        ['1.375rem',{ lineHeight: '1.3',  fontWeight: '600' }],                             // 22px
        'h4':        ['1.125rem',{ lineHeight: '1.35', fontWeight: '600' }],                             // 18px
        'h5':        ['1rem',    { lineHeight: '1.4',  fontWeight: '600' }],                             // 16px
        /* Body & UI */
        'body':      ['1rem',    { lineHeight: '1.65', letterSpacing: '0.002em' }],                     // 16px, readable
        'body-sm':   ['0.875rem',{ lineHeight: '1.6',  letterSpacing: '0.001em' }],                     // 14px
        'body-xs':   ['0.8125rem',{ lineHeight: '1.5' }],                                               // 13px
        /* Caption / labels (11-12px range) */
        'caption':   ['0.75rem', { lineHeight: '1.5',  letterSpacing: '0.01em' }],                      // 12px
        'overline':  ['0.6875rem',{ lineHeight: '1.4', letterSpacing: '0.06em', fontWeight: '600' }],   // 11px
      },

      /* ─── SPACING & LAYOUT (8px-based rhythm) ─── */
      spacing: {
        'section': '5rem',       // 80px — vertical rhythm between major sections
        'section-sm': '3rem',    // 48px — compact section gap
        'section-xs': '2rem',    // 32px — minimal section spacing
        'content': '4.5rem',     // 72px — max-w container padding
      },
      maxWidth: {
        'page':    '72rem',      // 1152px — main content ceiling
        'content': '48rem',      // 768px  — prose / narrow content
        'narrow':  '36rem',      // 576px  — forms, login, modals
        'hero':    '90rem',      // 1440px — hero sections
      },
      borderRadius: {
        'card': '0.75rem',       // 12px  — cards, panels (refined, not excessive)
        'pill': '9999px',        // full  — tags, badges
        'btn':  '0.5rem',        // 8px   — buttons, inputs (crisp)
        'sm':   '0.375rem',      // 6px   — small elements
      },
      /* ─── SHADOWS (restrained, premium) ─── */
      boxShadow: {
        'none':      'none',
        'card':      '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'elevated':  '0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)',
        'dropdown':  '0 4px 16px rgba(0,0,0,0.12)',
        /* Sacred glow (muted, not garish) */
        'sacred':    '0 4px 16px rgba(200, 106, 26, 0.08), 0 2px 8px rgba(181, 138, 58, 0.06)',
        'sacred-lg': '0 8px 32px rgba(200, 106, 26, 0.12), 0 4px 16px rgba(181, 138, 58, 0.08)',
        'inner-glow':'inset 0 1px 4px rgba(200, 106, 26, 0.06)',
      },
      /* ─── TRANSITIONS ─── */
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
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
