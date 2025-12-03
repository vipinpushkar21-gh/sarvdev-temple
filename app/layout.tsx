import './globals.css'
import Header from '../components/Header'
import Disclaimer from '../components/Disclaimer'
import React from 'react'
import { TranslationProvider } from '../lib/translation'

export const metadata = {
  title: 'Sarvdev Temple',
  description: 'Next.js 15 + TypeScript + Tailwind CSS scaffold'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <TranslationProvider>
          <Header />
          <Disclaimer />
          {children}
        </TranslationProvider>
      </body>
    </html>
  )
}
