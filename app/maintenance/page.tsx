export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-surface-sunken via-surface to-primary-50/15 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[15%] w-64 h-64 bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] left-[10%] w-48 h-48 bg-accent/[0.04] rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-dots opacity-[0.02]" />
      </div>
      <div className="max-w-md w-full text-center relative z-10">
        <div className="relative card overflow-hidden shadow-xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="p-8 md:p-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.19A1.5 1.5 0 015.25 10.7V6.3a1.5 1.5 0 01.786-1.28l5.384-3.19a1.5 1.5 0 011.16 0l5.384 3.19A1.5 1.5 0 0118.75 6.3v4.4a1.5 1.5 0 01-.786 1.28l-5.384 3.19a1.5 1.5 0 01-1.16 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75v3.75" /></svg>
            </div>
            <h1 className="text-display-lg font-serif text-secondary-800 mb-3">Under Maintenance</h1>
            <p className="text-body text-ink-muted mb-6">
              The website is currently undergoing maintenance. Please check back later.
            </p>
            <div className="w-12 h-1 rounded-full bg-gradient-to-r from-primary to-accent mx-auto mb-6" />
            <p className="text-caption text-ink-faint">
              Contact administrator for access.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}