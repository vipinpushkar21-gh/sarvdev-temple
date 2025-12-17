export default function MaintenancePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 backdrop-blur rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">🔧</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Under Maintenance</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The website is currently undergoing maintenance. Please check back later.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Contact administrator for access.
          </p>
        </div>
      </div>
    </main>
  )
}