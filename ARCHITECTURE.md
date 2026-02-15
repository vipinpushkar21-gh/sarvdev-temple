# SarvDev Temple — Complete Architecture & Codebase Guide

> **A Hindu temple directory, devotional content platform, and admin CMS built with
> Next.js 16, React 19, MongoDB (Mongoose), and Tailwind CSS.**

---

## Table of Contents

1. [High-Level Overview](#1-high-level-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Directory Map](#3-project-directory-map)
4. [System Architecture Diagram](#4-system-architecture-diagram)
5. [Request Lifecycle](#5-request-lifecycle)
6. [Data Models (MongoDB)](#6-data-models-mongodb)
7. [Entity-Relationship Diagram](#7-entity-relationship-diagram)
8. [Frontend Architecture](#8-frontend-architecture)
9. [Page-by-Page Breakdown](#9-page-by-page-breakdown)
10. [API Routes Reference](#10-api-routes-reference)
11. [Component Tree](#11-component-tree)
12. [Authentication & Middleware Flow](#12-authentication--middleware-flow)
13. [Devotional Content Pipeline](#13-devotional-content-pipeline)
14. [Internationalization (i18n)](#14-internationalization-i18n)
15. [Styling & Design System](#15-styling--design-system)
16. [External Integrations](#16-external-integrations)
17. [Data Flow Diagrams](#17-data-flow-diagrams)
18. [Admin Back-Office](#18-admin-back-office)
19. [Deployment & Environment](#19-deployment--environment)
20. [Scripts & Data Seeding](#20-scripts--data-seeding)

---

## 1. High-Level Overview

SarvDev Temple is a **full-stack spiritual platform** that serves three audiences:

```
  ┌─────────────────────────────────────────────────────────────┐
  │                    SARVDEV TEMPLE                           │
  │                                                             │
  │   ┌──────────┐   ┌──────────────┐   ┌──────────────────┐   │
  │   │ SEEKERS  │   │ TEMPLE       │   │ ADMIN            │   │
  │   │ (Public) │   │ OWNERS       │   │ (Back Office)    │   │
  │   └────┬─────┘   └──────┬───────┘   └────────┬─────────┘   │
  │        │                │                     │             │
  │        ▼                ▼                     ▼             │
  │  Browse temples    List their          Approve/reject      │
  │  Read devotionals  temple via form     Manage all content  │
  │  View darshan                          View analytics      │
  │  Check panchang                        CRUD operations     │
  │  Read blogs                                                │
  │  View events                                               │
  └─────────────────────────────────────────────────────────────┘
```

**Core Features:**
- **Temple Directory** — Searchable catalog of Hindu temples across India
- **Devotional Library** — 16+ categories of spiritual texts (aarti, chalisa, mantra, stotra, shloka, etc.)
- **Daily Darshan** — Photo/video feeds of daily temple rituals
- **Panchang** — Daily Hindu calendar with tithi, nakshatra, yoga, sunrise/sunset
- **Events** — Upcoming festivals and temple events
- **Blog** — Spiritual articles and temple stories
- **Sacred Categories** — Curated temple groupings (Jyotirlinga, Shakti Peeth, Char Dham, etc.)
- **Admin CMS** — Full content management for all entity types
- **Bilingual Support** — English + Hindi (Devanagari) UI

---

## 2. Technology Stack

```
  ┌──────────────────────────────────────────────────────────┐
  │                    TECHNOLOGY MAP                        │
  │                                                          │
  │  FRONTEND              BACKEND              DATABASE     │
  │  ─────────             ──────────            ──────────  │
  │  Next.js 16            Next.js API Routes    MongoDB     │
  │  React 19              Mongoose 8            (Atlas)     │
  │  TypeScript 5.3        Node.js                           │
  │  Tailwind CSS 3.4                                        │
  │  Framer Motion 12      SERVICES                          │
  │  Fuse.js               ──────────                        │
  │  Lucide React          Azure TTS                         │
  │  Sanscript             Google Analytics                  │
  │                        Vercel Analytics                  │
  │  INFRA                 External Panchang API             │
  │  ─────────                                               │
  │  Vercel (hosting)                                        │
  │  Edge Middleware                                         │
  └──────────────────────────────────────────────────────────┘
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | SSR, SSG, API routes, middleware |
| UI Library | React 19 | Component rendering |
| Language | TypeScript 5.3 | Type safety |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| Animation | Framer Motion 12 | Page transitions, card animations |
| Search | Fuse.js | Client-side fuzzy search |
| Icons | Lucide React | SVG icon set |
| Database | MongoDB + Mongoose 8 | Document storage & ODM |
| Transliteration | Sanscript | Sanskrit/Hindi script conversion |
| TTS | Azure Cognitive Services | Server-side text-to-speech |
| Analytics | Google Analytics + Vercel Analytics | Traffic tracking |
| Spreadsheets | xlsx | Data import/export |

---

## 3. Project Directory Map

```
sarvdev-temple/
│
├── app/                          # Next.js App Router (all pages + API)
│   ├── layout.tsx                # Root layout (wraps everything)
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles + CSS variables
│   │
│   ├── admin/                    # Admin back-office
│   │   ├── page.tsx              #   Admin landing + quick-add forms
│   │   ├── dashboard/page.tsx    #   Stats dashboard
│   │   ├── temples/              #   Temple management
│   │   │   ├── page.tsx          #     Temple list + filters
│   │   │   └── edit/[id]/page.tsx#     Edit a specific temple
│   │   ├── blogs/page.tsx        #   Blog management
│   │   ├── darshan/page.tsx      #   Darshan management
│   │   ├── events/page.tsx       #   Events management
│   │   └── devotionals/          #   Devotional management
│   │       ├── page.tsx          #     List + approve/reject
│   │       └── new/page.tsx      #     Create new devotional
│   │
│   ├── api/                      # REST API endpoints
│   │   ├── auth/verify-password/ #   Login authentication
│   │   ├── blogs/                #   Blog CRUD
│   │   ├── darshan/              #   Darshan CRUD
│   │   ├── devotionals/          #   Devotional CRUD + [id]
│   │   ├── events/               #   Event CRUD
│   │   ├── panchang/             #   Panchang proxy
│   │   ├── temples/              #   Temple CRUD
│   │   ├── tts/                  #   Text-to-speech
│   │   └── visitors/             #   Visitor tracking
│   │
│   ├── blog/                     # Blog listing + [slug] detail
│   ├── booking/                  # Online booking (placeholder)
│   ├── contact/                  # Contact page
│   ├── daily-darshan/            # Daily darshan gallery
│   ├── devotionals/              # Devotional library
│   │   ├── page.tsx + ClientPage #   Main listing with filters
│   │   ├── [id]/page.tsx         #   Devotional detail + TTS
│   │   ├── category/[slug]/      #   Category-filtered view
│   │   ├── sahasranama/          #   Redirect to ganesha
│   │   ├── ganesha/sahasranama/  #   1008 names of Ganesha
│   │   └── components/           #   CategoryTabs, DevotionalCard, etc.
│   ├── events/                   # Events listing
│   ├── help/                     # FAQ page
│   ├── list-temple/              # Submit a temple form
│   ├── login/                    # Login page
│   ├── maintenance/              # Maintenance mode page
│   ├── panchang/                 # Daily panchang viewer
│   ├── privacy/                  # Privacy policy
│   ├── sacred-categories/        # Sacred temple groupings
│   ├── temples/                  # Temple directory
│   │   ├── page.tsx              #   Temple listing + filters
│   │   └── [slug]/page.tsx       #   Temple detail page
│   └── terms/                    # Terms of service
│
├── components/                   # Shared UI components
│   ├── Header.tsx                # Navigation bar
│   ├── Hero.tsx                  # Reusable hero banner
│   ├── SmartSearch.tsx           # Global fuzzy search
│   ├── TempleCard.tsx            # Temple card component
│   ├── TempleSlider.tsx          # Featured temple carousel
│   ├── AuthGuard.tsx             # Client-side auth check
│   ├── Disclaimer.tsx            # Educational disclaimer banner
│   ├── LanguageSwitcher.tsx      # EN/HI toggle
│   ├── PanchangCard.tsx          # Panchang data display
│   └── VisitorTracker.tsx        # Page visit tracker
│
├── data/
│   ├── sarvdev.ts                # Static seed/fallback data
│   └── devotionals/              # Static JSON data files
│
├── lib/
│   ├── db.ts                     # MongoDB connection (cached)
│   └── translation.tsx           # i18n context provider
│
├── models/                       # Mongoose schemas
│   ├── Temple.ts
│   ├── Blog.ts
│   ├── Darshan.ts
│   ├── Devotional.ts
│   ├── Event.ts
│   └── Visitor.ts
│
├── scripts/                      # Data seeding scripts (70+ files)
│   ├── add-jyotirlingas.js
│   ├── add-ganesh-aarti.js
│   ├── add-divya-desam-part1.js
│   └── ... (temple & devotional seed scripts)
│
├── types/
│   └── cdn.d.ts                  # Fuse.js CDN type declaration
│
├── middleware.ts                  # Edge middleware (auth + maintenance)
├── next.config.js                # Next.js configuration
├── tailwind.config.cjs           # Tailwind theme
├── postcss.config.cjs            # PostCSS config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies & scripts
```

---

## 4. System Architecture Diagram

```
                          ┌──────────────────────────┐
                          │      BROWSER / CLIENT     │
                          │                            │
                          │  React 19 + Tailwind CSS   │
                          │  Framer Motion animations  │
                          │  Fuse.js client search     │
                          │  SpeechSynthesis (TTS)     │
                          └────────────┬───────────────┘
                                       │
                          HTTP/HTTPS Requests
                                       │
                                       ▼
                    ┌──────────────────────────────────┐
                    │        VERCEL EDGE NETWORK        │
                    │                                    │
                    │   ┌────────────────────────────┐   │
                    │   │  middleware.ts (Edge)       │   │
                    │   │  • Maintenance mode check   │   │
                    │   │  • Auth cookie validation   │   │
                    │   │  • Localhost bypass          │   │
                    │   └──────────┬─────────────────┘   │
                    │              │                      │
                    │              ▼                      │
                    │   ┌─────────────────────────────┐   │
                    │   │    NEXT.JS APP ROUTER        │   │
                    │   │                               │   │
                    │   │  ┌──────────┐ ┌───────────┐   │   │
                    │   │  │  Pages   │ │ API Routes│   │   │
                    │   │  │  (SSR/   │ │ (REST)    │   │   │
                    │   │  │  Client) │ │           │   │   │
                    │   │  └────┬─────┘ └─────┬─────┘   │   │
                    │   │       │              │         │   │
                    │   └───────┼──────────────┼─────────┘   │
                    │           │              │              │
                    └───────────┼──────────────┼──────────────┘
                                │              │
                     ┌──────────┘              └──────────┐
                     │                                     │
                     ▼                                     ▼
          ┌──────────────────┐                  ┌──────────────────┐
          │  STATIC DATA     │                  │   MONGODB ATLAS  │
          │                  │                  │                  │
          │  data/sarvdev.ts │                  │  Collections:    │
          │  (fallback)      │                  │  • temples       │
          │                  │                  │  • blogs         │
          │  data/devotionals│                  │  • darshans      │
          │  /*.json         │                  │  • devotionals   │
          └──────────────────┘                  │  • events        │
                                                │  • visitors      │
                                                └──────────────────┘
                                                         │
                           ┌─────────────────────────────┘
                           │
                           ▼
              ┌───────────────────────┐
              │   EXTERNAL SERVICES   │
              │                       │
              │  • Azure TTS          │
              │  • Panchang API       │
              │  • Google Analytics   │
              │  • Vercel Analytics   │
              └───────────────────────┘
```

---

## 5. Request Lifecycle

This shows what happens when a user visits any page on the site:

```
  USER TYPES URL
       │
       ▼
  ┌────────────────────────────────────────────────────────────────┐
  │ 1. EDGE MIDDLEWARE  (middleware.ts)                            │
  │                                                                │
  │    Is MAINTENANCE_MODE=true?                                   │
  │    ├── YES ──► Redirect to /maintenance                        │
  │    └── NO                                                      │
  │                                                                │
  │    Is request from localhost?                                   │
  │    ├── YES ──► PASS THROUGH (no auth needed)                   │
  │    └── NO                                                      │
  │                                                                │
  │    Is it a static file / API route?                            │
  │    ├── YES ──► PASS THROUGH                                    │
  │    └── NO                                                      │
  │                                                                │
  │    Has valid auth_token cookie?                                │
  │    ├── YES ──► PASS THROUGH                                    │
  │    └── NO  ──► Redirect to /login                              │
  └──────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────────────┐
  │ 2. NEXT.JS ROUTING                                            │
  │                                                                │
  │    URL rewrites applied (next.config.js):                      │
  │    /devotionals/aarti  ──►  /devotionals/category/aarti        │
  │    /devotionals/chalisa ──► /devotionals/category/chalisa      │
  │    ... (16 category slugs)                                     │
  │                                                                │
  │    Route matched to:                                           │
  │    ├── app/page.tsx            (Homepage)                      │
  │    ├── app/temples/page.tsx    (Temple listing)                │
  │    ├── app/temples/[slug]/     (Temple detail)                 │
  │    ├── app/api/temples/route   (API endpoint)                  │
  │    └── ... etc                                                 │
  └──────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────────────┐
  │ 3. ROOT LAYOUT  (app/layout.tsx)                              │
  │                                                                │
  │    Wraps ALL pages in these providers/components:              │
  │                                                                │
  │    <html>                                                      │
  │      <body>                                                    │
  │        <GoogleAnalytics />      ← Tracking script              │
  │        <TranslationProvider>    ← i18n context                 │
  │          <AuthGuard />          ← Client-side maintenance      │
  │          <Header />             ← Sticky navigation            │
  │          <Disclaimer />         ← Dismissable banner           │
  │          <VisitorTracker />     ← POST to /api/visitors        │
  │          {children}             ← PAGE CONTENT                 │
  │        </TranslationProvider>                                  │
  │        <Analytics />            ← Vercel Analytics             │
  │      </body>                                                    │
  │    </html>                                                      │
  └────────────────────────────────────────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────────────┐
  │ 4. PAGE RENDER                                                │
  │                                                                │
  │    Server Component?                                           │
  │    ├── YES ──► Renders on server, streams HTML to client       │
  │    └── NO  ──► "use client" ──► Hydrates in browser            │
  │                                                                │
  │    Fetches data?                                               │
  │    ├── Server: Direct DB access or fetch()                     │
  │    └── Client: fetch('/api/...') ──► API Route ──► MongoDB     │
  └────────────────────────────────────────────────────────────────┘
```

---

## 6. Data Models (MongoDB)

### Temple
```
┌──────────────────────────────────────────────────────────────────┐
│ TEMPLE COLLECTION                                                │
├──────────────────────────────────────────────────────────────────┤
│ title          : String (required)    "Kashi Vishwanath Temple"  │
│ description    : String               English description        │
│ descriptionHi  : String               Hindi description          │
│ image          : String               URL to temple photo        │
│ ─── Location ────────────────────────────────────────────────── │
│ location       : String               "Varanasi, UP"             │
│ city           : String               "Varanasi"                 │
│ state          : String               "Uttar Pradesh"            │
│ country        : String (def: India)                             │
│ pincode        : String               "221001"                   │
│ ─── Details ─────────────────────────────────────────────────── │
│ deity          : String               "Shiva"                    │
│ establishedYear: String               "Ancient"                  │
│ templeType     : String               "Shiva Temple"             │
│ speciality     : String               "Jyotirlinga"              │
│ categories     : [String]             ["Jyotirlinga","Char Dham"] │
│ timings        : String               "4:00 AM - 11:00 PM"      │
│ ─── Contact ─────────────────────────────────────────────────── │
│ contact        : String               General contact info       │
│ phone          : String                                          │
│ email          : String                                          │
│ website        : String                                          │
│ facebook       : String                                          │
│ instagram      : String                                          │
│ ─── Status ──────────────────────────────────────────────────── │
│ status         : enum [pending|approved|rejected]                │
│ verified       : enum [verified|not-verified]                    │
│ createdAt      : Date                                            │
└──────────────────────────────────────────────────────────────────┘
```

### Blog
```
┌──────────────────────────────────────────────┐
│ BLOG COLLECTION                              │
├──────────────────────────────────────────────┤
│ title     : String (required)                │
│ excerpt   : String          Short summary    │
│ date      : String          Display date     │
│ image     : String          Cover image URL  │
│ body      : String          Full HTML/text   │
│ createdAt : Date                             │
└──────────────────────────────────────────────┘
```

### Darshan (Daily Darshan)
```
┌──────────────────────────────────────────────┐
│ DARSHAN COLLECTION                           │
├──────────────────────────────────────────────┤
│ title       : String (required)              │
│ description : String                         │
│ temple      : String      Temple name ref    │
│ media       : String      Image URL          │
│ time        : String      Time of darshan    │
│ date        : String      Date string        │
│ video       : String      YouTube/video URL  │
│ status      : enum [pending|approved|rejected│]
│ createdAt   : Date                           │
└──────────────────────────────────────────────┘
```

### Devotional
```
┌──────────────────────────────────────────────────────────────┐
│ DEVOTIONAL COLLECTION                                        │
├──────────────────────────────────────────────────────────────┤
│ title       : String (required)  "गणेश आरती / Ganesh Aarti" │
│ description : String             Brief context               │
│ category    : enum [Bhajan|Stotra|Aarti|Mantra|Chalisa|      │
│               Stuti|Shloka|Ek Shloki|Ashtaka|Sahasranama|   │
│               Path|Rashi|Vastu|Durga|Kuber|Other]            │
│ language    : String (def: Hindi)  "Hindi", "Sanskrit"       │
│ deity       : String             "Ganesh", "Shiva", etc.     │
│ audio       : String             Audio file URL              │
│ lyrics      : String             Full text (may be bilingual)│
│ duration    : String             "5:30"                      │
│ artist      : String             Performer name              │
│ status      : enum [pending|approved|rejected]               │
│ createdAt   : Date                                           │
└──────────────────────────────────────────────────────────────┘
```

### Event
```
┌──────────────────────────────────────────────┐
│ EVENT COLLECTION                             │
├──────────────────────────────────────────────┤
│ title       : String (required)              │
│ description : String                         │
│ temple      : String       Temple name       │
│ date        : String       Event date        │
│ location    : String       Venue             │
│ image       : String       Event image URL   │
│ status      : enum [pending|approved|rejected│]
│ createdAt   : Date                           │
└──────────────────────────────────────────────┘
```

### Visitor
```
┌──────────────────────────────────────────────┐
│ VISITOR COLLECTION                           │
├──────────────────────────────────────────────┤
│ ip          : String       Client IP         │
│ userAgent   : String       Browser info      │
│ timestamp   : Date (now)   Visit time        │
│ page        : String (/)   Page visited      │
└──────────────────────────────────────────────┘
```

---

## 7. Entity-Relationship Diagram

```
  ┌────────────┐       ┌────────────┐       ┌────────────┐
  │   TEMPLE   │       │   EVENT    │       │   DARSHAN  │
  │            │       │            │       │            │
  │ title      │◄──────│ temple     │       │ temple     │──────►│
  │ deity      │ name  │ date       │       │ media      │ name  │
  │ location   │ ref   │ location   │       │ video      │ ref   │
  │ categories │       │ status     │       │ status     │       │
  │ status     │       └────────────┘       └────────────┘
  │ verified   │
  └────────────┘
        │
        │ deity
        │ (informal link)
        ▼
  ┌────────────┐       ┌────────────┐       ┌────────────┐
  │ DEVOTIONAL │       │    BLOG    │       │  VISITOR   │
  │            │       │            │       │            │
  │ title      │       │ title      │       │ ip         │
  │ category   │       │ body       │       │ userAgent  │
  │ deity      │       │ excerpt    │       │ page       │
  │ lyrics     │       │ image      │       │ timestamp  │
  │ language   │       │ createdAt  │       │            │
  │ status     │       └────────────┘       └────────────┘
  └────────────┘

  NOTE: Relationships are informal (String-based references,
  not MongoDB ObjectId refs). Temple, Event, and Darshan share
  temple names as plain strings.
```

---

## 8. Frontend Architecture

### Rendering Strategy

```
  ┌──────────────────────────────────────────────────────────────┐
  │              RENDERING STRATEGY PER PAGE                     │
  ├──────────────────────────────────────────────────────────────┤
  │                                                              │
  │  SERVER COMPONENTS (SSR)          CLIENT COMPONENTS          │
  │  ─────────────────────            ──────────────────         │
  │  • booking/page.tsx               • page.tsx (Home)          │
  │  • privacy/page.tsx               • temples/page.tsx         │
  │  • terms/page.tsx                 • temples/[slug]/page.tsx  │
  │  • help/page.tsx                  • blog/page.tsx            │
  │  • ganesha/sahasranama/           • devotionals/** (all)     │
  │    page.tsx                       • daily-darshan/page.tsx   │
  │                                   • events/page.tsx          │
  │                                   • panchang/page.tsx        │
  │                                   • admin/** (all)           │
  │                                   • list-temple/page.tsx     │
  │                                   • login/page.tsx           │
  │                                   • sacred-categories/       │
  │                                   • contact/page.tsx         │
  │                                                              │
  │  Static pages that need no        Dynamic pages that fetch   │
  │  browser APIs or state            data, use state, or need   │
  │                                   browser APIs               │
  └──────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
  <RootLayout>    (app/layout.tsx - Server Component)
    │
    ├── <GoogleAnalytics />         Tracking scripts (conditional)
    │
    └── <TranslationProvider>       i18n context (Client)
          │
          ├── <AuthGuard />         Maintenance redirect (Client)
          │
          ├── <Header />            Navigation bar (Client)
          │     └── <LanguageSwitcher />   EN/HI toggle
          │
          ├── <Disclaimer />        Dismissable banner (Client)
          │
          ├── <VisitorTracker />    POST visit on mount (Client)
          │
          └── {page content}        Varies by route
                │
                ├── Homepage
                │     ├── <SmartSearch />
                │     ├── <TempleSlider />
                │     └── Feature Cards
                │
                ├── Temple Pages
                │     └── <TempleCard /> (repeated)
                │
                ├── Devotional Pages
                │     ├── <CategoryTabs />
                │     ├── <SearchBar />
                │     ├── <DevotionalCard /> (repeated)
                │     └── <TextToSpeech />
                │
                └── Panchang Page
                      └── <PanchangCard />
```

---

## 9. Page-by-Page Breakdown

### Public Pages

```
┌────────────────┬──────────┬──────────────────────────────────────────────┐
│ Route          │ Type     │ Description                                  │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /              │ Client   │ Homepage: hero slideshow (8 temple images,   │
│                │          │ 5s rotation), SmartSearch overlay,            │
│                │          │ TempleSlider carousel, 3 feature cards        │
│                │          │ (Darshan, Events, Devotionals), full footer   │
│                │          │ with Sanskrit shloka                          │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /temples       │ Client   │ Temple directory: fetches all approved        │
│                │          │ temples, sacred category filter dropdown,     │
│                │          │ TempleCard grid                               │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /temples/[slug]│ Client   │ Temple detail: verification badge, bilingual  │
│                │          │ description, location/deity/timings info,     │
│                │          │ Google Maps link, contact & social media      │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /devotionals   │ Client   │ Devotional library: category tabs with        │
│                │          │ counts, search bar, language/deity/sort        │
│                │          │ filters, featured grid, paginated cards        │
│                │          │ (12/page), framer-motion animations            │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /devotionals/  │ Rewrite  │ Category-filtered view: slug mapped to        │
│ {category}     │          │ category, deity sub-filter, Rashi sub-filter  │
│                │          │ for astrology content                         │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /devotionals/  │ Client   │ Detail page: bilingual title, TextToSpeech    │
│ [id]           │          │ (browser + Azure), lyrics with alternating    │
│                │          │ Hindi/English lines, 108-names rendering      │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /daily-darshan │ Client   │ Daily darshan gallery: approved photo/video   │
│                │          │ cards, YouTube iframe embeds                  │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /events        │ Client   │ Upcoming events: approved events with         │
│                │          │ image/date/location/temple                    │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /blog          │ Client   │ Blog listing: approved posts with excerpts    │
│ /blog/[slug]   │ Client   │ Blog detail: full body, date, image          │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /panchang      │ Client   │ Daily panchang: city selector (10 cities),    │
│                │          │ date picker, sunrise/sunset/tithi/nakshatra   │
│                │          │ details via PanchangCard                      │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /sacred-       │ Client   │ 13 sacred temple groupings (Jyotirlinga,     │
│ categories     │          │ Shakti Peeth, Char Dham, etc.) with counts    │
│                │          │ and expandable temple lists                   │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /list-temple   │ Client   │ Temple submission form: 20+ fields with       │
│                │          │ validation, Indian state dropdown, 13 sacred  │
│                │          │ category checkboxes                           │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /booking       │ Server   │ Online booking placeholder: 4 sample slots    │
│                │          │ (Morning Aarti, Special Pooja, etc.)          │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /contact       │ Client   │ Contact form + info (phone/email)            │
├────────────────┼──────────┼──────────────────────────────────────────────┤
│ /help          │ Server   │ Static FAQ page                              │
│ /privacy       │ Server   │ Privacy policy                               │
│ /terms         │ Server   │ Terms of service                             │
│ /login         │ Client   │ Password-based login page                    │
│ /maintenance   │ Server   │ Maintenance mode banner                      │
└────────────────┴──────────┴──────────────────────────────────────────────┘
```

### URL Rewrite Rules

The following vanity URLs are silently rewritten by `next.config.js`:

```
  /devotionals/aarti          ──►  /devotionals/category/aarti
  /devotionals/bhajan         ──►  /devotionals/category/bhajan
  /devotionals/chalisa        ──►  /devotionals/category/chalisa
  /devotionals/mantra         ──►  /devotionals/category/mantra
  /devotionals/stotra         ──►  /devotionals/category/stotra
  /devotionals/stuti          ──►  /devotionals/category/stuti
  /devotionals/shloka         ──►  /devotionals/category/shloka
  /devotionals/ek-shloki      ──►  /devotionals/category/ek-shloki
  /devotionals/ashtaka        ──►  /devotionals/category/ashtaka
  /devotionals/sahasranama    ──►  /devotionals/category/sahasranama
  /devotionals/path           ──►  /devotionals/category/path
  /devotionals/namavali       ──►  /devotionals/category/namavali
  /devotionals/108-namavali   ──►  /devotionals/category/108-namavali
  /devotionals/kavacham       ──►  /devotionals/category/kavacham
  /devotionals/prarthana      ──►  /devotionals/category/prarthana
  /devotionals/vrat-katha     ──►  /devotionals/category/vrat-katha
  /devotionals/rashi          ──►  /devotionals/category/rashi
  /devotionals/vastu          ──►  /devotionals/category/vastu
  /devotionals/durga          ──►  /devotionals/category/durga
  /devotionals/kuber          ──►  /devotionals/category/kuber
  /devotionals/other          ──►  /devotionals/category/other
```

---

## 10. API Routes Reference

```
┌─────────────────────────────────┬─────────┬───────────────────────────────┐
│ Endpoint                        │ Methods │ Purpose                       │
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/auth/verify-password       │ POST    │ Validate site password,       │
│                                 │         │ return auth token              │
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/temples                    │ GET     │ List all temples              │
│                                 │ POST    │ Create new temple             │
│                                 │ PUT     │ Update temple by ID           │
│                                 │ DELETE  │ Delete temple by ID           │
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/blogs                      │ GET     │ List all blogs                │
│                                 │ POST    │ Create new blog               │
│                                 │ PUT     │ Update blog by ID             │
│                                 │ DELETE  │ Delete blog by ID             │
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/darshan                    │ GET     │ List all darshan entries      │
│                                 │ POST    │ Create new darshan            │
│                                 │ PUT     │ Update darshan by ID          │
│                                 │ DELETE  │ Delete darshan by ID          │
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/devotionals                │ GET     │ List all (DB + static merge)  │
│                                 │ POST    │ Create new devotional         │
│                                 │ PUT     │ Update devotional by ID       │
│                                 │ DELETE  │ Delete devotional by ID       │
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/devotionals/[id]           │ GET     │ Fetch single devotional by ID │
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/events                     │ GET     │ List all events               │
│                                 │ POST    │ Create new event              │
│                                 │ PUT     │ Update event by ID            │
│                                 │ DELETE  │ Delete event by ID            │
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/panchang                   │ GET     │ Fetch panchang data for       │
│                                 │         │ lat/lon/date (proxy + fallback│)
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/tts                        │ POST    │ Azure TTS: text → speech audio│
│                                 │         │ with SHA1 caching             │
├─────────────────────────────────┼─────────┼───────────────────────────────┤
│ /api/visitors                   │ POST    │ Record page visit             │
│                                 │ GET     │ Get total + today visit count │
└─────────────────────────────────┴─────────┴───────────────────────────────┘
```

### API Data Flow

```
  CLIENT                      API ROUTE                    DATABASE
  ──────                      ──────────                   ─────────

  fetch('/api/temples')  ──►  GET handler     ──►  connectDB()
                              │                    │
                              │                    ▼
                              │               mongoose.connect()
                              │                    │
                              │                    ▼
                              │               Temple.find()
                              │                    │
                              ◄────────────────────┘
                              │
                              ▼
                         NextResponse.json(temples)

  For devotionals GET, extra step:
  ──────────────────────────────────
  DB results + data/sarvdev.ts static data are MERGED
  to provide a comprehensive list even if DB is sparse.
```

---

## 11. Component Tree

### Complete Component Inventory

```
  SHARED COMPONENTS (components/)
  ═════════════════════════════════

  ┌─────────────────────┐
  │ Header              │  Sticky nav bar with responsive hamburger menu
  │ • Nav items:        │  Home, Temples, Daily Darshan, Events,
  │   7 main links      │  Devotionals, Blog, Panchang + more
  │ • <LanguageSwitcher>│  EN/HI toggle button
  │ • Mobile menu       │  Hamburger icon → slide-in overlay
  └─────────────────────┘

  ┌─────────────────────┐
  │ Hero                │  Reusable page banner with title + subtitle
  │ • title: string     │  Used on multiple listing pages
  │ • subtitle: string  │
  └─────────────────────┘

  ┌─────────────────────┐
  │ SmartSearch          │  Global fuzzy search using Fuse.js
  │ • Searches across:  │  Temples, Darshan, Events, Blogs
  │ • Debounced input   │  Real-time filtering with result links
  │ • Grouped results   │  Categorized by content type
  └─────────────────────┘

  ┌─────────────────────┐
  │ TempleCard           │  Card with image, title, description
  │ • Links to detail   │  /temples/{slug}
  │ • Image fallback    │  Handles missing images gracefully
  └─────────────────────┘

  ┌─────────────────────┐
  │ TempleSlider         │  Full-width temple carousel
  │ • Auto-play (8s)    │  Featured/approved temples
  │ • Nav arrows        │  Left/right navigation
  │ • Progress dots     │  Visual position indicators
  │ • ~220 lines        │  Most complex shared component
  └─────────────────────┘

  ┌─────────────────────┐
  │ PanchangCard         │  Panchang data display
  │ • Bilingual labels  │  Hindi + English
  │ • Sunrise/Sunset    │
  │ • Tithi/Nakshatra   │  Hindu calendar details
  │ • Yoga/Karana       │
  │ • Rahu Kaal         │
  └─────────────────────┘

  ┌─────────────────────┐
  │ AuthGuard            │  Client-side maintenance redirect
  │ • Checks env var    │  NEXT_PUBLIC_MAINTENANCE
  │ • Skips localhost   │  Dev-friendly
  └─────────────────────┘

  ┌─────────────────────┐
  │ Disclaimer           │  Dismissable educational banner
  │ • localStorage      │  Remembers dismissal
  │ • One-time per user │
  └─────────────────────┘

  ┌─────────────────────┐
  │ VisitorTracker       │  Silent page visit tracker
  │ • POST on mount     │  /api/visitors
  │ • Gets IP + UA      │
  └─────────────────────┘


  DEVOTIONAL COMPONENTS (app/devotionals/components/)
  ═══════════════════════════════════════════════════

  ┌─────────────────────┐
  │ CategoryTabs         │  Horizontal scrollable tab bar
  │ • 16 categories     │  Each with emoji + count
  │ • Animated active   │  Framer-motion underline
  └─────────────────────┘

  ┌─────────────────────┐
  │ DevotionalCard       │  Animated content card
  │ • Framer-motion     │  Scale + fade entrance
  │ • Badges:           │  Category, Language, Deity
  │ • Links to [id]     │  Detail page
  └─────────────────────┘

  ┌─────────────────────┐
  │ SearchBar            │  Accessible search input
  │ • Placeholder text  │
  │ • onChange callback  │
  └─────────────────────┘

  ┌─────────────────────┐
  │ TextToSpeech         │  Browser-based TTS
  │ • SpeechSynthesis   │  Web Speech API
  │ • Hindi voice       │  Auto-selects Hindi
  │ • Speed control     │  0.5x to 2x
  │ • Text chunking     │  Handles long texts
  └─────────────────────┘
```

---

## 12. Authentication & Middleware Flow

```
  ┌─────────────────────────────────────────────────────┐
  │            AUTHENTICATION ARCHITECTURE              │
  │                                                     │
  │  Environment Variables Required:                    │
  │  ─────────────────────────────                      │
  │  • SITE_PASSWORD    - The password users enter      │
  │  • AUTH_TOKEN       - Token stored in cookie        │
  │  • MAINTENANCE_MODE - "true" to enable              │
  └─────────────────────────────────────────────────────┘

  LOGIN FLOW
  ═══════════

  User visits /login
       │
       ▼
  ┌──────────────┐      POST              ┌─────────────────────────┐
  │  Login Form  │ ──────────────────────► │ /api/auth/verify-password│
  │  (password)  │                         │                         │
  └──────────────┘                         │ password === env.       │
                                           │ SITE_PASSWORD ?         │
                                           │                         │
                                           │ YES → { token: env.    │
                                           │         AUTH_TOKEN }    │
                                           │                         │
                                           │ NO  → 401 Unauthorized │
                                           └────────┬────────────────┘
                                                    │
                                                    ▼ (on success)
                                           ┌──────────────────────┐
                                           │ Client stores token: │
                                           │ • localStorage       │
                                           │ • document.cookie    │
                                           │   (auth_token=xxx)   │
                                           └──────────┬───────────┘
                                                      │
                                                      ▼
                                              Redirect to /admin


  MIDDLEWARE GUARD (Every Request)
  ═══════════════════════════════

  ┌───────────────┐
  │ Incoming      │
  │ Request       │
  └──────┬────────┘
         │
         ▼
  ┌──────────────────┐    YES    ┌─────────────────────┐
  │ MAINTENANCE_MODE ├──────────►│ Redirect /maintenance│
  │ === "true" ?     │           └─────────────────────┘
  └──────┬───────────┘
         │ NO
         ▼
  ┌──────────────────┐    YES    ┌──────────────────┐
  │  Is localhost?   ├──────────►│ ALLOW (no auth)  │
  └──────┬───────────┘           └──────────────────┘
         │ NO
         ▼
  ┌──────────────────┐    YES    ┌──────────────────┐
  │  Static / API?   ├──────────►│ ALLOW            │
  └──────┬───────────┘           └──────────────────┘
         │ NO
         ▼
  ┌──────────────────┐    YES    ┌──────────────────┐
  │  Has valid       ├──────────►│ ALLOW            │
  │  auth_token?     │           └──────────────────┘
  └──────┬───────────┘
         │ NO
         ▼
  ┌──────────────────┐
  │ Redirect /login  │
  └──────────────────┘

  NOTE: The auth gate means the ENTIRE site is password-protected
  in production. Only localhost bypasses this. This is likely a
  pre-launch/beta protection mechanism.
```

---

## 13. Devotional Content Pipeline

The devotionals section is the most complex feature. Here's how content flows:

```
  DATA SOURCES
  ════════════

  ┌─────────────────────┐   ┌──────────────────────┐   ┌──────────────┐
  │ MongoDB              │   │ data/sarvdev.ts       │   │ JSON files   │
  │ (Devotional model)   │   │ (Static fallback)     │   │ (data/       │
  │                      │   │                       │   │ devotionals/)│
  │ Created via:         │   │ Hardcoded arrays:     │   │              │
  │ • Admin CMS          │   │ • temples[]           │   │ Loaded at    │
  │ • Seed scripts       │   │ • devotionals[]       │   │ build time   │
  │ • API POST           │   │ • events[]            │   │ by server    │
  └──────────┬───────────┘   │ • dailyDarshan[]      │   │ components   │
             │               │ • blogPosts[]         │   │              │
             │               └──────────┬────────────┘   └──────┬───────┘
             │                          │                        │
             ▼                          ▼                        │
     ┌───────────────────────────────────────┐                   │
     │ /api/devotionals GET handler          │                   │
     │                                       │                   │
     │ 1. Fetch from MongoDB                 │                   │
     │ 2. Import from sarvdev.ts             │                   │
     │ 3. MERGE & DEDUPLICATE               │                   │
     │ 4. Return combined list              │                   │
     └───────────────────┬───────────────────┘                   │
                         │                                       │
                         ▼                                       │
           ┌─────────────────────────────┐                       │
           │ Client Pages               │                       │
           │                             │                       │
           │ /devotionals                │◄──────────────────────┘
           │ /devotionals/category/[slug]│    (ganesha_sahasranama.json
           │ /devotionals/[id]           │     loaded server-side)
           └─────────────────────────────┘


  CONTENT CATEGORIES (16)
  ════════════════════════

  ┌──────────────┬──────────────┬──────────────┬──────────────┐
  │ 🙏 Aarti     │ 🎵 Bhajan    │ 📿 Chalisa   │ 🕉️ Mantra    │
  │ 📜 Stotra    │ 🎶 Stuti     │ 📖 Shloka    │ 📄 Ek Shloki │
  │ 🪷 Ashtaka   │ 💫 Sahasranama│ 📕 Path     │ 🔢 Namavali  │
  │ 🛡️ Kavacham  │ 🙏 Prarthana │ 📅 Vrat Katha│ ⭐ Rashi     │
  └──────────────┴──────────────┴──────────────┴──────────────┘


  DEVOTIONAL DETAIL FEATURES
  ═══════════════════════════

  ┌───────────────────────────────────────────────────────────┐
  │ /devotionals/[id]                                         │
  │                                                           │
  │  ┌─────────────────────────────────────────────────────┐  │
  │  │ BILINGUAL TITLE                                     │  │
  │  │ "गणेश आरती / Ganesh Aarti"                          │  │
  │  │ Detected via Devanagari regex, split on " / "       │  │
  │  └─────────────────────────────────────────────────────┘  │
  │                                                           │
  │  ┌─────────────────────────────────────────────────────┐  │
  │  │ TEXT-TO-SPEECH CONTROLS                             │  │
  │  │                                                     │  │
  │  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │  │
  │  │  │ ▶ Browser  │  │ ▶ Azure   │  │ Speed: 1.0x │  │  │
  │  │  │   TTS      │  │   TTS     │  │ [0.5] [2.0] │  │  │
  │  │  └────────────┘  └────────────┘  └──────────────┘  │  │
  │  │                                                     │  │
  │  │  Browser: Web Speech API (SpeechSynthesis)          │  │
  │  │  Azure:  POST /api/tts → Azure Cognitive Services   │  │
  │  │         → SHA1-cached audio files                   │  │
  │  └─────────────────────────────────────────────────────┘  │
  │                                                           │
  │  ┌─────────────────────────────────────────────────────┐  │
  │  │ LYRICS DISPLAY                                      │  │
  │  │                                                     │  │
  │  │  Hindi line (Devanagari)     ← detected by regex    │  │
  │  │  English line                ← alternating          │  │
  │  │  Hindi line (Devanagari)                            │  │
  │  │  English line                                       │  │
  │  │  ...                                                │  │
  │  │                                                     │  │
  │  │  OR for 108-Namavali:                               │  │
  │  │  1. ॐ गणपतये नमः                                   │  │
  │  │  2. ॐ सिद्धिविनायकाय नमः                           │  │
  │  │  ...108 items as numbered list                      │  │
  │  └─────────────────────────────────────────────────────┘  │
  └───────────────────────────────────────────────────────────┘
```

---

## 14. Internationalization (i18n)

```
  ┌───────────────────────────────────────────────────────────────┐
  │                  TRANSLATION SYSTEM                           │
  │                                                               │
  │  Architecture: React Context + localStorage                   │
  │  File: lib/translation.tsx                                    │
  │  Languages: English (en) | Hindi (hi)                         │
  │                                                               │
  │  ┌─────────────────────────────────────────────────────────┐  │
  │  │ TranslationProvider                                     │  │
  │  │                                                         │  │
  │  │  const [language, setLanguage] = useState('en')         │  │
  │  │                                                         │  │
  │  │  Provides:                                              │  │
  │  │  • language   - Current locale ('en' | 'hi')            │  │
  │  │  • setLanguage - Toggle function                        │  │
  │  │  • t(key)     - Lookup in translations map              │  │
  │  │                                                         │  │
  │  │  Persistence: localStorage('sarvdev-language')          │  │
  │  └─────────────────────────────────────────────────────────┘  │
  │                                                               │
  │  Translation Keys Cover:                                      │
  │  ─────────────────────                                        │
  │  • Navigation labels (nav.home, nav.temples, etc.)            │
  │  • Homepage text (home.title, home.subtitle)                  │
  │  • Feature descriptions                                       │
  │  • Footer text                                                │
  │  • Temple page labels (temple.deity, temple.location)         │
  │  • Form labels (form.templeName, form.submit)                 │
  │  • Contact page                                               │
  │  • Category names                                             │
  │                                                               │
  │  Usage in Components:                                         │
  │  ────────────────────                                         │
  │  const { t, language } = useTranslation()                     │
  │  <h1>{t('home.title')}</h1>                                   │
  │  // en: "Discover temples. Deepen devotion."                  │
  │  // hi: "मंदिरों की खोज करें। भक्ति को गहरा करें।"            │
  └───────────────────────────────────────────────────────────────┘

  UI TOGGLE
  ═════════

  ┌──────────────────────────────────┐
  │ Header                           │
  │  ...nav links...  [EN | हि]     │  ← LanguageSwitcher
  │                    ▲              │
  │                    │              │
  │              Click toggles       │
  │              between en/hi       │
  │              Saved to            │
  │              localStorage        │
  └──────────────────────────────────┘
```

---

## 15. Styling & Design System

```
  ┌───────────────────────────────────────────────────────────────┐
  │                    DESIGN SYSTEM                              │
  │                                                               │
  │  COLOR PALETTE                                                │
  │  ═════════════                                                │
  │                                                               │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
  │  │ PRIMARY  │  │SECONDARY │  │  ACCENT  │                    │
  │  │ #FF9933  │  │ #5C4033  │  │ #FFD700  │                    │
  │  │ Deep     │  │ Earthy   │  │ Golden   │                    │
  │  │ Saffron  │  │ Brown    │  │          │                    │
  │  │ ████████ │  │ ████████ │  │ ████████ │                    │
  │  └──────────┘  └──────────┘  └──────────┘                    │
  │                                                               │
  │  ┌──────────┐  ┌──────────┐                                   │
  │  │BACKGROUND│  │   TEXT   │                                   │
  │  │ #FAF9F6  │  │ #333333 │                                   │
  │  │ Off-     │  │ Dark    │                                   │
  │  │ white    │  │ Gray    │                                   │
  │  │ ░░░░░░░░ │  │ ████████ │                                   │
  │  └──────────┘  └──────────┘                                   │
  │                                                               │
  │  The palette reflects Hindu temple aesthetics:                │
  │  saffron (devotion), gold (divinity), earth (tradition)       │
  │                                                               │
  │  TYPOGRAPHY                                                   │
  │  ══════════                                                   │
  │                                                               │
  │  Primary Font:  'Noto Serif Devanagari'                       │
  │  Fallback:      'Noto Serif', serif                           │
  │  Sans-serif:    'Inter', system-ui                            │
  │                                                               │
  │  Noto Serif Devanagari is used globally because it            │
  │  renders BOTH Latin and Devanagari scripts beautifully.       │
  │                                                               │
  │  ANIMATIONS                                                   │
  │  ══════════                                                   │
  │                                                               │
  │  CSS Keyframes:                                               │
  │  • floatUp    - Gentle vertical bounce (6s loop)              │
  │  • fadeIn     - Opacity + translateY entrance (1.2s)          │
  │  • slideIn    - Opacity + translateX entrance (1s)            │
  │  • zoomIn     - Scale entrance effect                         │
  │  • slideShow  - Background position cycling (120s)            │
  │                                                               │
  │  Framer Motion:                                               │
  │  • DevotionalCard - scale(0.95) → scale(1) on enter           │
  │  • CategoryTabs   - underline slide animation                 │
  │  • Page transitions on devotional routes                      │
  │                                                               │
  │  RESPONSIVE DESIGN                                            │
  │  ═════════════════                                            │
  │                                                               │
  │  ┌────────┐  ┌──────────┐  ┌───────────────┐                 │
  │  │ Mobile │  │ Tablet   │  │ Desktop       │                 │
  │  │ < 768  │  │ 768-1024 │  │ > 1024        │                 │
  │  │        │  │          │  │               │                 │
  │  │ 1 col  │  │ 2 col    │  │ 3-4 col       │                 │
  │  │ grid   │  │ grid     │  │ grid          │                 │
  │  │        │  │          │  │               │                 │
  │  │ Burger │  │ Full nav │  │ Full nav      │                 │
  │  │ menu   │  │          │  │               │                 │
  │  └────────┘  └──────────┘  └───────────────┘                 │
  └───────────────────────────────────────────────────────────────┘
```

---

## 16. External Integrations

```
  ┌─────────────────────────────────────────────────────────────────┐
  │                  EXTERNAL INTEGRATIONS                          │
  │                                                                 │
  │  ┌────────────────────────────────────────────────────────────┐ │
  │  │ 1. AZURE COGNITIVE SERVICES (Text-to-Speech)              │ │
  │  │                                                            │ │
  │  │    Endpoint: /api/tts                                      │ │
  │  │    Flow:                                                   │ │
  │  │    Client sends text ──► API generates SSML               │ │
  │  │                         ──► Azure TTS API call            │ │
  │  │                         ──► SHA1 hash-based file cache    │ │
  │  │                         ──► Return audio stream           │ │
  │  │    Voice: Hindi (hi-IN)                                    │ │
  │  │    Env: AZURE_TTS_KEY, AZURE_TTS_REGION                   │ │
  │  └────────────────────────────────────────────────────────────┘ │
  │                                                                 │
  │  ┌────────────────────────────────────────────────────────────┐ │
  │  │ 2. PANCHANG API                                           │ │
  │  │                                                            │ │
  │  │    Endpoint: /api/panchang                                 │ │
  │  │    Proxies to external Hindu calendar service              │ │
  │  │    Parameters: lat, lon, date                              │ │
  │  │    Returns: sunrise, sunset, moonrise, tithi,              │ │
  │  │             nakshatra, yoga, karana, rahu kaal             │ │
  │  │    Fallback: Demo/cached data if API unavailable           │ │
  │  └────────────────────────────────────────────────────────────┘ │
  │                                                                 │
  │  ┌────────────────────────────────────────────────────────────┐ │
  │  │ 3. GOOGLE ANALYTICS                                       │ │
  │  │                                                            │ │
  │  │    Loaded via app/components/GoogleAnalytics.tsx           │ │
  │  │    Env: NEXT_PUBLIC_GA_ID                                  │ │
  │  │    Injects gtag.js scripts via <Script> component          │ │
  │  └────────────────────────────────────────────────────────────┘ │
  │                                                                 │
  │  ┌────────────────────────────────────────────────────────────┐ │
  │  │ 4. VERCEL ANALYTICS                                       │ │
  │  │                                                            │ │
  │  │    @vercel/analytics/next → <Analytics /> in layout        │ │
  │  │    Automatic page view + web vital tracking                │ │
  │  └────────────────────────────────────────────────────────────┘ │
  │                                                                 │
  │  ┌────────────────────────────────────────────────────────────┐ │
  │  │ 5. MONGODB ATLAS                                          │ │
  │  │                                                            │ │
  │  │    Connection: lib/db.ts with global cache                 │ │
  │  │    Env: MONGODB_URI                                        │ │
  │  │    Cached connection prevents hot-reload reconnects        │ │
  │  │    6 collections: temples, blogs, darshans,                │ │
  │  │                    devotionals, events, visitors           │ │
  │  └────────────────────────────────────────────────────────────┘ │
  └─────────────────────────────────────────────────────────────────┘
```

---

## 17. Data Flow Diagrams

### Temple Submission Flow

```
  TEMPLE OWNER                                              ADMIN
  ════════════                                              ═════

  Visits /list-temple
       │
       ▼
  ┌────────────────────┐
  │ Fill 20+ field form│
  │ • Name, deity      │
  │ • Location, state  │
  │ • Timings          │
  │ • Contact info     │
  │ • Sacred categories│
  └────────┬───────────┘
           │ POST
           ▼
  ┌────────────────────┐
  │ /api/temples       │
  │ Status: "pending"  │──────► MongoDB
  └────────────────────┘        (temples collection)
                                       │
                                       │ Visible in
                                       ▼
                                ┌────────────────────┐
                                │ /admin/dashboard    │
                                │ Pending submissions │
                                │                    │
                                │ [Approve] [Reject] │
                                └────────┬───────────┘
                                         │ PUT
                                         ▼
                                ┌────────────────────┐
                                │ /api/temples       │
                                │ Status: "approved" │──► Now visible on
                                │ Verified: toggle   │    /temples page
                                └────────────────────┘
```

### SmartSearch Flow

```
  ┌──────────────────────────────────────────────────────────────┐
  │ SmartSearch Component                                        │
  │                                                              │
  │  User types "Varanasi"                                       │
  │       │                                                      │
  │       ▼                                                      │
  │  Debounce (300ms)                                            │
  │       │                                                      │
  │       ▼                                                      │
  │  Parallel fetches:                                           │
  │  ┌──────────────────┐  ┌──────────────────┐                  │
  │  │ /api/temples     │  │ /api/darshan     │                  │
  │  └────────┬─────────┘  └────────┬─────────┘                  │
  │  ┌────────┴─────────┐  ┌────────┴─────────┐                  │
  │  │ /api/events      │  │ /api/blogs       │                  │
  │  └────────┬─────────┘  └────────┬─────────┘                  │
  │           │                     │                            │
  │           ▼                     ▼                            │
  │  ┌─────────────────────────────────────┐                     │
  │  │ Fuse.js fuzzy search across all     │                     │
  │  │ results (keys: title, description,  │                     │
  │  │ location, temple, deity)            │                     │
  │  └────────────────┬────────────────────┘                     │
  │                   │                                          │
  │                   ▼                                          │
  │  ┌─────────────────────────────────────┐                     │
  │  │ Grouped Results Dropdown            │                     │
  │  │                                     │                     │
  │  │ TEMPLES                             │                     │
  │  │   • Kashi Vishwanath Temple  →      │                     │
  │  │                                     │                     │
  │  │ EVENTS                              │                     │
  │  │   • Dev Deepawali, Varanasi →       │                     │
  │  │                                     │                     │
  │  │ BLOGS                               │                     │
  │  │   • (none matching)                 │                     │
  │  └─────────────────────────────────────┘                     │
  └──────────────────────────────────────────────────────────────┘
```

---

## 18. Admin Back-Office

```
  ┌───────────────────────────────────────────────────────────────┐
  │                    ADMIN PANEL STRUCTURE                       │
  │                                                               │
  │  ┌─────────────────────────────────────────────────────────┐  │
  │  │ /admin                                                  │  │
  │  │                                                         │  │
  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐                │  │
  │  │  │ Quick   │  │ Quick   │  │ Quick   │                │  │
  │  │  │ Add     │  │ Add     │  │ Add     │                │  │
  │  │  │ Temple  │  │ Darshan │  │ Event   │                │  │
  │  │  └─────────┘  └─────────┘  └─────────┘                │  │
  │  │                                                         │  │
  │  │  Navigation:                                            │  │
  │  │  [Dashboard] [Temples] [Darshan] [Events]               │  │
  │  │  [Blogs] [Devotionals]                                  │  │
  │  └─────────────────────────────────────────────────────────┘  │
  │                                                               │
  │  ┌─────────────────────────────────────────────────────────┐  │
  │  │ /admin/dashboard                                        │  │
  │  │                                                         │  │
  │  │  ┌───────────┐  ┌──────────────┐  ┌──────────────┐     │  │
  │  │  │ Total     │  │ Pending      │  │ Total        │     │  │
  │  │  │ Temples   │  │ Temples      │  │ Visitors     │     │  │
  │  │  │   247     │  │    12        │  │   5,430      │     │  │
  │  │  └───────────┘  └──────────────┘  └──────────────┘     │  │
  │  │                                                         │  │
  │  │  Pending Submissions:                                   │  │
  │  │  • Temples awaiting approval                            │  │
  │  │  • Blogs awaiting approval                              │  │
  │  │  • Events awaiting approval                             │  │
  │  └─────────────────────────────────────────────────────────┘  │
  │                                                               │
  │  ┌─────────────────────────────────────────────────────────┐  │
  │  │ /admin/temples                                          │  │
  │  │                                                         │  │
  │  │  Filters: [Deity ▼] [State ▼] [Type ▼]                │  │
  │  │                                                         │  │
  │  │  ┌────────────────┬──────┬────────┬────────┬──────┐    │  │
  │  │  │ Temple Name    │Deity │ State  │ Status │ Actn │    │  │
  │  │  ├────────────────┼──────┼────────┼────────┼──────┤    │  │
  │  │  │ Kashi Vishwa.. │Shiva │ UP     │approved│ Edit │    │  │
  │  │  │ Meenakshi..    │Parvat│ TN     │pending │[✓][✗]│    │  │
  │  │  └────────────────┴──────┴────────┴────────┴──────┘    │  │
  │  │                                                         │  │
  │  │  Status Toggle: pending → approved → rejected           │  │
  │  │  Verified Toggle: not-verified ↔ verified               │  │
  │  └─────────────────────────────────────────────────────────┘  │
  │                                                               │
  │  ┌─────────────────────────────────────────────────────────┐  │
  │  │ /admin/devotionals                                      │  │
  │  │                                                         │  │
  │  │  Filter: [Category ▼]                                   │  │
  │  │                                                         │  │
  │  │  ┌────────────────┬──────────┬────────┬──────────┐     │  │
  │  │  │ Title          │ Category │ Status │ Actions  │     │  │
  │  │  ├────────────────┼──────────┼────────┼──────────┤     │  │
  │  │  │ Ganesh Aarti   │ Aarti    │approved│ Edit Del │     │  │
  │  │  │ Shiv Chalisa   │ Chalisa  │pending │ [✓][✗]   │     │  │
  │  │  └────────────────┴──────────┴────────┴──────────┘     │  │
  │  │                                                         │  │
  │  │  + [Add New Devotional] → /admin/devotionals/new        │  │
  │  └─────────────────────────────────────────────────────────┘  │
  │                                                               │
  │  Similar patterns for:                                        │
  │  • /admin/blogs     — Approve/reject/delete blog posts        │
  │  • /admin/darshan   — Manage daily darshan with temple filter  │
  │  • /admin/events    — Manage events with date filter           │
  └───────────────────────────────────────────────────────────────┘
```

---

## 19. Deployment & Environment

### Environment Variables

```
  ┌───────────────────────────────────────────────────────────────┐
  │               REQUIRED ENVIRONMENT VARIABLES                  │
  ├───────────────────────────┬───────────────────────────────────┤
  │ Variable                  │ Purpose                           │
  ├───────────────────────────┼───────────────────────────────────┤
  │ MONGODB_URI               │ MongoDB connection string         │
  │ SITE_PASSWORD             │ Login password for site access    │
  │ AUTH_TOKEN                │ Token stored in auth cookie       │
  │ MAINTENANCE_MODE          │ "true" to enable maintenance      │
  │ NEXT_PUBLIC_MAINTENANCE   │ Client-side maintenance flag      │
  │ NEXT_PUBLIC_GA_ID         │ Google Analytics measurement ID   │
  │ AZURE_TTS_KEY             │ Azure TTS subscription key        │
  │ AZURE_TTS_REGION          │ Azure TTS region (e.g. eastus)    │
  └───────────────────────────┴───────────────────────────────────┘
```

### Deployment Architecture

```
  ┌────────────────────────────────────────────────────────┐
  │                    VERCEL                               │
  │                                                        │
  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
  │  │ Edge Network │  │ Serverless   │  │ Static      │  │
  │  │              │  │ Functions    │  │ Assets      │  │
  │  │ middleware.ts│  │              │  │             │  │
  │  │ (runs first)│  │ /api/*       │  │ /_next/     │  │
  │  │              │  │ routes.ts    │  │ static/     │  │
  │  │              │  │              │  │             │  │
  │  └──────┬───────┘  └──────┬───────┘  └─────────────┘  │
  │         │                 │                            │
  │         │                 ▼                            │
  │         │          MongoDB Atlas                       │
  │         │          (cloud database)                    │
  │         │                                              │
  │         ▼                                              │
  │    CDN-cached pages                                    │
  │    (ISR / Static)                                      │
  └────────────────────────────────────────────────────────┘

  Build Command:  next build
  Dev Command:    next dev
  Start Command:  next start
```

---

## 20. Scripts & Data Seeding

The `scripts/` directory contains **70+ Node.js scripts** for bulk-loading data into MongoDB:

```
  ┌───────────────────────────────────────────────────────────────┐
  │                   SEED SCRIPTS (scripts/)                     │
  │                                                               │
  │  TEMPLE SEEDS                    DEVOTIONAL SEEDS             │
  │  ═════════════                   ═════════════════             │
  │  add-jyotirlingas.js            add-ganesh-aarti.js           │
  │  add-jyotirlingas-direct.js     add-hanuman-aarti.js          │
  │  add-ashta-vinayak.js           add-lakshmi-aarti.js          │
  │  add-chota-char-dham.js         add-durga-chalisa.js          │
  │  add-main-char-dham.js          add-krishna-chalisa.js        │
  │  add-arupadai-veedu.js          add-hanuman-mantras.js        │
  │  add-divya-desam-part1..6.js    add-ganesh-mantras.js         │
  │  add-mehandipur-balaji.js       add-durga-mantras.js          │
  │                                 add-bhagavad-gita-aarti.js    │
  │                                 add-narasimha-kavacham.js     │
  │                                 add-chalisas.js               │
  │                                 ... (50+ more)                │
  │                                                               │
  │  Each script:                                                 │
  │  1. Connects to MongoDB (MONGODB_URI)                         │
  │  2. Defines temple/devotional data objects                    │
  │  3. Inserts into appropriate collection                       │
  │  4. Sets status: 'approved' (pre-approved content)            │
  │                                                               │
  │  Usage: node scripts/add-jyotirlingas.js                      │
  └───────────────────────────────────────────────────────────────┘
```

---

## Summary: How It All Connects

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │                        THE BIG PICTURE                              │
  │                                                                     │
  │   ┌────────┐    ┌──────────────┐    ┌──────────┐    ┌───────────┐  │
  │   │ USER   │───▶│ VERCEL EDGE  │───▶│ NEXT.JS  │───▶│ MONGODB   │  │
  │   │        │    │ middleware.ts │    │ App      │    │ ATLAS     │  │
  │   │        │    │              │    │ Router   │    │           │  │
  │   │ Browser│◀───│ Auth check   │◀───│ Pages +  │◀───│ 6 colls  │  │
  │   │        │    │ Maintenance  │    │ API      │    │           │  │
  │   └────────┘    └──────────────┘    └──────────┘    └───────────┘  │
  │                                          │                         │
  │                                          │ Also uses               │
  │                                          ▼                         │
  │                              ┌────────────────────┐                │
  │                              │ EXTERNAL SERVICES  │                │
  │                              │ • Azure TTS        │                │
  │                              │ • Panchang API     │                │
  │                              │ • Google Analytics  │                │
  │                              └────────────────────┘                │
  │                                                                     │
  │   Content flows: Seed Scripts ──▶ MongoDB ──▶ API ──▶ Pages        │
  │                  Temple Owner ──▶ Form ──▶ API ──▶ Admin ──▶ Live  │
  │                  Admin ──▶ CMS ──▶ API ──▶ MongoDB ──▶ Public      │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
```

---

*Generated for the SarvDev Temple codebase — a comprehensive Hindu temple directory and spiritual content platform.*
