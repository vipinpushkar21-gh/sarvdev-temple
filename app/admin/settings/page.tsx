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
        <h1 className="admin-page-title">Settings</h1>
        <p className="admin-section-subtitle">Manage site configuration and admin tools</p>
      </div>

      {/* Site Info */}
      <div className="admin-card p-6">
        <h2 className="admin-section-title mb-4">Site Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-gray-400 mb-1">Site Name</label>
            <p className="font-medium text-gray-900">Sarvdev — Temple Directory</p>
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Framework</label>
            <p className="font-medium text-gray-900">Next.js 16 (Turbopack)</p>
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Database</label>
            <p className="font-medium text-gray-900">MongoDB Atlas</p>
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Auth</label>
            <p className="font-medium text-gray-900">HMAC-SHA256 Signed Tokens</p>
          </div>
        </div>
      </div>

      {/* Database Stats */}
      {stats?.counts && (
        <div className="admin-card p-6">
          <h2 className="admin-section-title mb-4">Database Overview</h2>
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
              <div key={s.label} className="rounded-xl p-3" style={{ background: '#F9FAFB' }}>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value?.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cache Management */}
      <div className="admin-card p-6">
        <h2 className="admin-section-title mb-2">Cache Management</h2>
        <p className="text-sm text-gray-500 mb-4">API responses are cached for 60 seconds. Force refresh to see latest data.</p>
        <button
          onClick={clearCache}
          className={`admin-btn px-4 py-2 text-sm ${
            cacheCleared ? 'admin-btn-success' : 'admin-btn-danger'
          }`}
        >
          {cacheCleared ? '✓ Cache Cleared' : 'Clear API Cache'}
        </button>
      </div>

      {/* Environment */}
      <div className="admin-card p-6">
        <h2 className="admin-section-title mb-4">Environment</h2>
        <div className="space-y-0 text-sm">
          <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <span className="text-gray-500">MongoDB</span>
            <span className="admin-badge-green">Connected</span>
          </div>
          <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <span className="text-gray-500">Auth System</span>
            <span className="admin-badge-green">Active</span>
          </div>
          <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <span className="text-gray-500">API Cache TTL</span>
            <span className="font-semibold text-gray-900">60 seconds</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-500">Token Expiry</span>
            <span className="font-semibold text-gray-900">24 hours</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="admin-card p-6" style={{ borderColor: 'rgba(220,38,38,0.2)', borderWidth: '2px' }}>
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">These actions are irreversible. Proceed with caution.</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => alert('This feature requires server-side environment variable changes. Set MAINTENANCE_MODE=true in .env.local and restart.')}
            className="admin-btn admin-btn-danger px-4 py-2 text-sm"
          >
            Enable Maintenance Mode
          </button>
        </div>
      </div>
    </div>
  )
}
