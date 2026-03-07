import './globals.css'
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
import AudioPlayerBar from '../components/AudioPlayerBar'

export const metadata = {
  title: 'Sarvdev — Temple Directory & Devotional Hub',
  description: 'Discover temples across the world, explore devotional content, and connect with sacred traditions through Sarvdev.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
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
            <ScrollToTop />
          </ToastProvider>
          </AudioPlayerProvider>
          </FavouritesProvider>
          </TempleDataProvider>
        </TranslationProvider>
        <Analytics />
      </body>
    </html>
  )
}
