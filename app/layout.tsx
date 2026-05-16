import './globals.css'
import { Inter, Noto_Serif_Devanagari, Playfair_Display, Cinzel } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Disclaimer from '../components/Disclaimer'
import GoogleAnalytics from './components/GoogleAnalytics'
import { Analytics } from '@vercel/analytics/next'
import React from 'react'
import { TranslationProvider } from '../lib/translation'
import { FavouritesProvider } from '../lib/favourites'
import { AudioPlayerProvider } from '../lib/audio-player'
import { TempleDataProvider } from '../lib/temple-data'
import VisitorTracker from '../components/VisitorTracker'
import AuthGuard from '../components/AuthGuard'
import { ToastProvider } from '../components/Toast'
import ScrollToTop from '../components/ScrollToTop'
import MobileBottomNav from '../components/MobileBottomNav'
import AudioPlayerBar from '../components/AudioPlayerBar'
import SpiritualChatbot from '../components/SpiritualChatbot'
import { ThemeProvider } from '../lib/theme'
import PWARegister from '../components/PWARegister'
import ScrollRevealInit from '../components/ScrollRevealInit'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const notoSerif = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const viewport = {
  themeColor: '#FF9933',
  width: 'device-width',
  initialScale: 1,
}

const OG_IMAGE = 'https://sarvdev.com/opengraph-image'

export const metadata = {
  title: {
    default: 'Sarvdev — Temple Directory & Devotional Hub',
    template: '%s — Sarvdev',
  },
  description: 'Discover temples across India and the world, explore bhajans, aartis and mantras, and connect with sacred traditions through Sarvdev.',
  metadataBase: new URL('https://sarvdev.com'),
  alternates: {
    canonical: 'https://sarvdev.com',
    languages: {
      'en-IN': 'https://sarvdev.com',
      'hi-IN': 'https://sarvdev.com',
      'x-default': 'https://sarvdev.com',
    },
  },
  keywords: [
    'temple directory', 'Hindu temples India', 'mandir', 'darshan',
    'bhajan', 'aarti', 'panchang', 'festival calendar', 'Char Dham',
    'Jyotirlinga', 'Shakti Peeth', 'devotional music', 'spiritual',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Sarvdev',
    title: 'Sarvdev — Temple Directory & Devotional Hub',
    description: 'Discover temples across India and the world, explore devotional content, and connect with sacred traditions.',
    locale: 'en_IN',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Sarvdev — Temple Directory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarvdev — Temple Directory & Devotional Hub',
    description: 'Discover temples across India and the world, explore devotional content, and connect with sacred traditions.',
    images: [OG_IMAGE],
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sarvdev',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://sarvdev.com/#organization',
      name: 'Sarvdev',
      url: 'https://sarvdev.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sarvdev.com/icon.svg',
        width: 512,
        height: 512,
      },
      description: 'Sarvdev is a temple directory and devotional hub connecting worshippers with sacred temples and spiritual traditions across India and the world.',
      sameAs: [],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://sarvdev.com/#website',
      url: 'https://sarvdev.com',
      name: 'Sarvdev',
      publisher: { '@id': 'https://sarvdev.com/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://sarvdev.com/temples?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerif.variable} ${playfair.variable} ${cinzel.variable}`} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sarvdev-theme');if(t==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}})()`,
          }}
        />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <ThemeProvider>
        <TranslationProvider>
          <TempleDataProvider>
          <FavouritesProvider>
          <AudioPlayerProvider>
          <ToastProvider>
            <AuthGuard />
            <Header />
            <Disclaimer />
            <VisitorTracker />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
            <AudioPlayerBar />
            <MobileBottomNav />
            <ScrollToTop />
            <SpiritualChatbot />
            <ScrollRevealInit />
          </ToastProvider>
          </AudioPlayerProvider>
          </FavouritesProvider>
          </TempleDataProvider>
        </TranslationProvider>
        </ThemeProvider>
        <PWARegister />
        <Analytics />
      </body>
    </html>
  )
}
