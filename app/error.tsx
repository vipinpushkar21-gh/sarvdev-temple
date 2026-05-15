"use client"

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="page-container py-20 md:py-32 text-center">
      <div className="max-w-lg mx-auto">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-h1 font-serif text-secondary-800 mb-4">Something went wrong</h1>
        <p className="text-body text-ink-muted mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <button onClick={reset} className="btn btn-primary">
          Try Again
        </button>
      </div>
    </div>
  )
}
