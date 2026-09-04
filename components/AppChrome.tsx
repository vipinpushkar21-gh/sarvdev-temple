"use client"

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import Disclaimer from './Disclaimer'
import MobileBottomNav from './MobileBottomNav'
import AudioPlayerBar from './AudioPlayerBar'
import ScrollToTop from './ScrollToTop'
import SpiritualChatbot from './SpiritualChatbot'
import ScrollRevealInit from './ScrollRevealInit'

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) {
    return <div className="flex-1">{children}</div>
  }

  return (
    <>
      <Header />
      <Disclaimer />
      <div className="flex-1">{children}</div>
      <Footer />
      <AudioPlayerBar />
      <MobileBottomNav />
      <ScrollToTop />
      <SpiritualChatbot />
      <ScrollRevealInit />
    </>
  )
}
