'use client'

import { useEffect, useState } from 'react'

type LogEntry = {
  _id: string
  action: string
  entity: string
  entityId?: string
  entityTitle?: string
  adminName?: string
  details?: string
  timestamp: string
}

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  approve: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  update: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  reject: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  delete: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}

const ENTITY_ICONS: Record<string, string> = {
  temple: '🛕',
  devotional: '🎵',
  blog: '📝',
  event: '📅',
  user: '👤',
  darshan: '🎥',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [entityFilter, setEntityFilter] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('limit', '100')
    if (entityFilter) params.set('entity', entityFilter)

    fetch(`/api/admin/activity?${params}`)
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setLogs(data) })
      .catch(err => console.error('Activity log error:', err))
      .finally(() => setLoading(false))
  }, [entityFilter])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="admin-page-title">Activity Log</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-page-title">Activity Log</h1>
        <p className="admin-section-subtitle">Track all admin actions across the platform</p>
      </div>

      {/* Filters */}
      <div className="admin-filter-bar">
        <div className="flex flex-wrap gap-2">
          {['', 'temple', 'devotional', 'blog', 'event', 'user', 'darshan'].map(e => (
            <button
              key={e}
              onClick={() => { setLoading(true); setEntityFilter(e) }}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                entityFilter === e
                  ? 'admin-badge-orange'
                  : 'admin-btn admin-btn-ghost'
              }`}
            >
              {e ? `${ENTITY_ICONS[e] || ''} ${e.charAt(0).toUpperCase() + e.slice(1)}` : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Log entries */}
      <div className="admin-card">
        {logs.length > 0 ? (
          <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {logs.map(log => (
              <li key={log._id} className="px-5 py-4 flex items-start gap-4 hover:bg-orange-50/30 transition-colors">
                <div className="text-2xl flex-shrink-0 mt-0.5">
                  {ENTITY_ICONS[log.entity] || '📋'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold uppercase ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-600'}`}>
                      {log.action}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {log.entity}
                    </span>
                    {log.entityTitle && (
                      <span className="text-sm text-gray-500 truncate">
                        — {log.entityTitle}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    {log.adminName && <span>by {log.adminName}</span>}
                    <span>{timeAgo(log.timestamp)}</span>
                    {log.details && <span className="text-gray-500">· {log.details}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-1">No activity logs yet</p>
            <p className="text-sm">Actions like approve, reject, delete will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
