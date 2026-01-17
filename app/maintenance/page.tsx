export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center">
        <div className="bg-background rounded-2xl shadow-xl p-8 border border-accent">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-3xl font-bold text-primary mb-4">Under Maintenance</h1>
          <p className="text-text mb-6">
            The website is currently undergoing maintenance. Please check back later.
          </p>
          <p className="text-sm text-text">
            Contact administrator for access.
          </p>
        </div>
      </div>
    </main>
  )
}