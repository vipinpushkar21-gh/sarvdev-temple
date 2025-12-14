import './globals.css'
import Header from '../components/Header'
import Disclaimer from '../components/Disclaimer'
import GoogleAnalytics from './components/GoogleAnalytics'
import { Analytics } from '@vercel/analytics/next'
import React from 'react'
import { TranslationProvider } from '../lib/translation'
import VisitorTracker from '../components/VisitorTracker'

export const metadata = {
  title: 'Sarvdev Temple',
  description: 'Next.js 15 + TypeScript + Tailwind CSS scaffold'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <TranslationProvider>
          <Header />
          <Disclaimer />
          <VisitorTracker />
          {children}
        </TranslationProvider>
        <Analytics />
      </body>
    </html>
  )
}
