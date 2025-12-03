'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function Disclaimer() {
  const [isVisible, setIsVisible] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if user has dismissed the disclaimer
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

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null
  }

  if (!isVisible && isDismissed) {
    // Show small button to bring back disclaimer
    return (
      <button
        onClick={handleShow}
        className="fixed bottom-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-orange-700 transition-all z-50 text-sm"
        title="Show Disclaimer"
      >
        ℹ️ Disclaimer
      </button>
    )
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 p-4 shadow-md relative">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Close disclaimer"
      >
        <X size={20} />
      </button>
      
      <div className="max-w-7xl mx-auto pr-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-orange-800 mb-1">
              Educational & Practice Purpose Only | शैक्षिक और अभ्यास उद्देश्य के लिए
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong className="text-orange-700">Disclaimer:</strong> This website is created solely for{' '}
              <span className="font-semibold">educational and practice purposes</span>. All temple information, 
              images, and content are used for learning web development and are sourced from publicly available 
              information. We do not claim ownership of any images or content. If you are the copyright holder 
              and wish to have any content removed, please contact us.
              {' '}<span className="text-orange-600">•</span>{' '}
              <span className="font-hindi text-gray-800">
                यह वेबसाइट केवल शैक्षिक और अभ्यास उद्देश्यों के लिए बनाई गई है। सभी मंदिर जानकारी, 
                चित्र और सामग्री वेब विकास सीखने के लिए उपयोग की गई है।
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
