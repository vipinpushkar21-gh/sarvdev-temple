# Sarvdev Design System

A canonical visual design language for the Sarvdev temple directory — grounded,
respectful, and culturally informed. Every decision prioritises **clarity over
decoration**, **restraint over spectacle**, and **usefulness over impressiveness**.

---

## Guiding Principles

| # | Principle | In Practice |
|---|-----------|-------------|
| 1 | **Grounded warmth** | Earthy browns and saffron reference the materiality of temple architecture — sandstone, turmeric, flame. No neon, no chrome. |
| 2 | **Typographic hierarchy** | The page communicates through scale, weight and spacing — not through gradients, shadows, or emojis. |
| 3 | **Functional restraint** | Every shadow, border, and animation must earn its place. If removing it changes nothing, remove it. |
| 4 | **Cultural specificity** | Design choices reference Hindu temple aesthetics (warm palette, serif Devanagari headings) rather than generic "spiritual" tropes. |
| 5 | **No AI-slop** | Zero decorative emojis as icons. No `drop-shadow-lg`. No `hover:-translate-y-2`. No "✨ Section Title ✨". No placeholder stock phrases. |

---

## Colour Palette

### Brand Colours

| Token | Hex | Role |
|-------|-----|------|
| `primary` | `#FF9933` | Deep saffron — calls-to-action, active states, links |
| `secondary` | `#5C4033` | Warm earth brown — headings, footer, nav background |
| `accent` | `#FFD700` | Ritual gold — highlights, badges, special callouts |

Each brand colour includes a full 50-900 scale (see `tailwind.config.cjs`).

### Surface Colours

| Token | Hex | Role |
|-------|-----|------|
| `surface` | `#FAF9F6` | Page background — warm paper white |
| `surface-raised` | `#FFFFFF` | Cards, modals, elevated panels |
| `surface-sunken` | `#F3F1EC` | Page headers, inset sections, sidebar |
| `surface-border` | `#E5E0D5` | Default border colour |

### Ink (Text) Colours

| Token | Hex | Role |
|-------|-----|------|
| `ink` | `#2C2C2C` | Body text — high contrast |
| `ink-muted` | `#6B6560` | Captions, metadata, secondary text |
| `ink-faint` | `#A09A92` | Placeholders, disabled states |

### Semantic Colours

| Token | Hex | Role |
|-------|-----|------|
| `semantic-success` | `#2E7D32` | Confirmations, approved states |
| `semantic-error` | `#C62828` | Errors, validation failures |
| `semantic-warning` | `#F57F17` | Warnings, pending states |
| `semantic-info` | `#1565C0` | Informational notices |

---

## Typography

### Font Stacks

| Token | Stack | Usage |
|-------|-------|-------|
| `font-serif` | Noto Serif Devanagari → Noto Serif → Georgia → serif | Page headings (h1, h2), display text |
| `font-sans` | Inter → system-ui → sans-serif | Body text, UI labels, buttons |
| `font-devanagari` | Noto Serif Devanagari → serif | Hindi/Sanskrit passages |

### Type Scale

| Class | Size | Weight | Use |
|-------|------|--------|-----|
| `text-display-lg` | 60px | 700 | Landing hero (homepage only) |
| `text-display` | 48px | 700 | Page heroes |
| `text-h1` | 36px | 600 | Page titles |
| `text-h2` | 28px | 600 | Section headings |
| `text-h3` | 22px | 600 | Card titles, sub-sections |
| `text-h4` | 18px | 600 | Detail headings, label groups |
| `text-body` | 16px | 400 | Body copy |
| `text-body-sm` | 14px | 400 | Secondary text, form inputs |
| `text-caption` | 12px | 400 | Metadata, timestamps |
| `text-overline` | 11px | 600 | Overline labels (0.06em tracking) |

### Rules

- Headings use `font-serif`. Body and UI use `font-sans`.
- Never apply `drop-shadow` to text.
- Never use `font-extrabold` on headings — `font-semibold` (600) or `font-bold` (700) maximum.
- Use the `devanagari` class for Hindi passages — it ensures proper glyph rendering.

---

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `py-section` | 80px | Vertical gap between major page sections |
| `py-section-sm` | 48px | Compact section gap (e.g., within hero+content) |
| Standard Tailwind | 4, 6, 8, 12, 16 | Component-level spacing |

### Layout Widths

| Token | Value | Usage |
|-------|-------|-------|
| `max-w-page` | 1152px | Primary content wrapper |
| `max-w-content` | 768px | Prose, article text, narrow layouts |
| `max-w-narrow` | 576px | Forms, login card, modals |

Container classes: `.page-container`, `.content-container`, `.narrow-container`.

---

## Components

### Buttons

```
.btn             — Base (flex, padding, radius, focus ring)
.btn-primary     — Saffron bg, white text
.btn-secondary   — Brown bg, white text
.btn-outline     — Transparent bg, border, ink text
.btn-ghost       — No border, muted text, sunken hover
.btn-sm / .btn-lg — Size modifiers
```

Rules:
- Never use emojis inside buttons (use SVG icons or text only).
- Buttons do not have `shadow-lg` or `hover:scale`.
- Use `btn-primary` for one primary action per section.

### Cards

```
.card             — Raised surface, border, subtle shadow
.card-interactive — Adds hover shadow lift
```

Rules:
- Cards do not `hover:-translate-y` or `hover:scale`.
- Card body padding: `p-5` (desktop), `p-4` (mobile).
- Card image aspect: constrained via `h-48` or `aspect-video`.

### Form Inputs

```
.input        — Full-width, border, ring on focus
.input-error  — Red border variant
.label        — Block label with bottom margin
.field-error  — Error message below input
```

### Page Header

```html
<div class="page-header">
  <div class="page-header-inner">
    <h1>Page Title</h1>
    <p>Optional subtitle</p>
  </div>
</div>
```

Replaces the old gradient-heavy `<Hero>` component with a clean, typographic
header using `surface-sunken` background and a bottom border.

### Badges

```
.badge          — Neutral (sunken bg, muted text)
.badge-primary  — Saffron-tinted
```

---

## Iconography

- **No emojis as icons.** Use SVG or text.
- If an icon is needed, use a minimal inline SVG (`w-5 h-5`, `currentColor`).
- Decorative emojis flanking headings (`✨ Title ✨`) are banned.

---

## Animation & Motion

- **One animation per page load**: `fade-up` (600ms, 8px translateY).
- Stagger sparingly with `.delay-1` through `.delay-4` (80ms increments).
- Hover transitions: `transition-shadow duration-200` for cards. That's it.
- No `floatUp`, `slide-in`, `zoom-in`, `hover:scale-105`, `hover:-translate-y-2`.
- Slideshow/carousel transitions: crossfade opacity only, 800ms.

---

## Page Layout Pattern

```
<Header />
<Disclaimer />
<PageHeader title="" subtitle="" />   ← clean typographic hero
<main class="page-container section-sm">
  ...content...
</main>
<Footer />                            ← shared footer on every page
```

---

## Anti-Patterns (What We Don't Do)

| Anti-Pattern | Why |
|---|---|
| `drop-shadow-lg` on headings | Fake depth; reduces readability |
| `hover:-translate-y-2` on cards | Distracting; implies drag interaction |
| Emoji icons (📧 📞 🏛️) | Unprofessional; inconsistent across platforms |
| `bg-gradient-to-r from-orange-50 to-yellow-50` layered overlays | Visual noise with no information value |
| `backdrop-filter: blur()` on static elements | Performance cost for no benefit |
| `✨ Section Title ✨` | The textbook definition of AI slop |
| Different color systems (orange-600 vs primary) | Breaks token consistency |
| Dark mode classes without a toggle | Dead code; confusing maintenance |
| Font references without import (Playfair Display) | Invisible text on some systems |
