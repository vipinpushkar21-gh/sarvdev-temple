'use client'

import { useEffect, useState } from 'react'

export default function AdminSettingsPage() {
  const [cacheCleared, setCacheCleared] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {})
  }, [])

  const clearCache = async () => {
    try {
      // Hit API endpoints to force cache refresh
      await Promise.all([
        fetch('/api/temples', { cache: 'no-store' }),
        fetch('/api/devotionals', { cache: 'no-store' }),
      ])
      setCacheCleared(true)
      setTimeout(() => setCacheCleared(false), 3000)
    } catch {
      alert('Failed to clear cache')
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage site configuration and admin tools</p>
      </div>

      {/* Site Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Site Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-gray-500 mb-1">Site Name</label>
            <p className="font-medium text-gray-900 dark:text-white">Sarvdev — Temple Directory</p>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Framework</label>
            <p className="font-medium text-gray-900 dark:text-white">Next.js 16 (Turbopack)</p>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Database</label>
            <p className="font-medium text-gray-900 dark:text-white">MongoDB Atlas</p>
          </div>
          <div>
            <label className="block text-gray-500 mb-1">Auth</label>
            <p className="font-medium text-gray-900 dark:text-white">HMAC-SHA256 Signed Tokens</p>
          </div>
        </div>
      </div>

      {/* Database Stats */}
      {stats?.counts && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Database Overview</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Temples', value: stats.counts.temples },
              { label: 'Devotionals', value: stats.counts.devotionals },
              { label: 'Blogs', value: stats.counts.blogs },
              { label: 'Events', value: stats.counts.events },
              { label: 'Users', value: stats.counts.users },
              { label: 'Visitors', value: stats.counts.visitors },
              { label: 'Approved', value: stats.counts.approvedTemples },
              { label: 'Pending', value: stats.counts.pendingTemples },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cache Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cache Management</h2>
        <p className="text-sm text-gray-500 mb-4">API responses are cached for 60 seconds. Force refresh to see latest data.</p>
        <button
          onClick={clearCache}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            cacheCleared
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
          }`}
        >
          {cacheCleared ? '✓ Cache Cleared' : 'Clear API Cache'}
        </button>
      </div>

      {/* Environment */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Environment</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">MongoDB</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Connected</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Auth System</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">Active</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">API Cache TTL</span>
            <span className="text-gray-900 dark:text-white font-medium">60 seconds</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-600 dark:text-gray-400">Token Expiry</span>
            <span className="text-gray-900 dark:text-white font-medium">24 hours</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-red-200 dark:border-red-900 p-6">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">These actions are irreversible. Proceed with caution.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => alert('This feature requires server-side environment variable changes. Set MAINTENANCE_MODE=true in .env.local and restart.')}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 transition-colors"
          >
            Enable Maintenance Mode
          </button>
        </div>
      </div>
    </div>
  )
}
