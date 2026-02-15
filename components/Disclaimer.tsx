'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function Disclaimer() {
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const dismissed = localStorage.getItem('disclaimerDismissed')
    if (dismissed === 'true') {
      setIsVisible(false)
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('disclaimerDismissed', 'true')
  }

  const handleShow = () => {
    setIsVisible(true)
    setIsDismissed(false)
    localStorage.removeItem('disclaimerDismissed')
  }

  if (!isMounted) return null

  if (!isVisible && isDismissed) {
    return (
      <button
        onClick={handleShow}
        className="fixed bottom-4 right-4 btn btn-sm bg-secondary text-white hover:bg-secondary-600 shadow-card z-50"
        title="Show Disclaimer"
      >
        Disclaimer
      </button>
    )
  }

  if (!isVisible) return null

  return (
    <div className="bg-primary-50 border-b border-surface-border px-4 py-3 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-ink-muted hover:text-ink transition-colors"
        aria-label="Close disclaimer"
      >
        <X size={18} />
      </button>
      
      <div className="page-container pr-8">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <div className="flex-1">
            <p className="text-body-sm font-medium text-secondary-700 mb-0.5">
              Educational &amp; Practice Purpose Only
            </p>
            <p className="text-caption text-ink-muted leading-relaxed">
              This website is created for educational and practice purposes. All temple information
              and content are sourced from publicly available information. We do not claim ownership
              of any images or content.
              <span className="font-devanagari ml-1">
                यह वेबसाइट केवल शैक्षिक और अभ्यास उद्देश्यों के लिए बनाई गई है।
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
