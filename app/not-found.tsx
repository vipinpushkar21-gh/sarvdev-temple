import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page-container py-20 md:py-32 text-center">
      <div className="max-w-lg mx-auto">
        <div className="text-8xl font-serif font-bold text-gradient mb-4">404</div>
        <h1 className="text-h1 font-serif text-secondary-800 mb-4">Page Not Found</h1>
        <p className="text-body text-ink-muted mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link href="/temples" className="btn btn-outline">
            Browse Temples
          </Link>
          <Link href="/devotionals" className="btn btn-outline">
            Devotionals
          </Link>
        </div>
      </div>
    </div>
  )
}
