import './globals.css'
import Header from '../components/Header'
import Disclaimer from '../components/Disclaimer'
import GoogleAnalytics from './components/GoogleAnalytics'
import { Analytics } from '@vercel/analytics/next'
import React from 'react'
import { TranslationProvider } from '../lib/translation'
import VisitorTracker from '../components/VisitorTracker'
import AuthGuard from '../components/AuthGuard'

export const metadata = {
  title: 'Sarvdev Temple',
  description: 'Next.js 15 + TypeScript + Tailwind CSS scaffold'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white" suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <TranslationProvider>
          <AuthGuard />
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
