'use client'

import { useEffect, useState } from 'react'

type AnalyticsData = {
  dailyVisitors: { _id: string; count: number }[]
  topPages: { _id: string; count: number }[]
  deviceBreakdown: { _id: string; count: number }[]
  totalVisitors: number
  todayVisitors: number
}

const DEVICE_COLORS: Record<string, string> = {
  Desktop: 'bg-blue-500',
  Mobile: 'bg-orange-500',
  Tablet: 'bg-green-500',
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(d => { if (d.dailyVisitors) setData(d) })
      .catch(err => console.error('Analytics error:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="admin-page-title">Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-card p-6 animate-pulse">
              <div className="h-5 bg-gray-100 rounded-lg w-32 mb-4" />
              <div className="h-40 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return <div className="text-center py-12 text-gray-500">Failed to load analytics.</div>

  const { dailyVisitors, topPages, deviceBreakdown, totalVisitors, todayVisitors } = data
  const maxDaily = Math.max(...dailyVisitors.map(d => d.count), 1)
  const totalDevices = deviceBreakdown.reduce((s, d) => s + d.count, 0) || 1

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-page-title">Analytics</h1>
        <p className="admin-section-subtitle">Visitor insights for the last 30 days</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="admin-stat">
          <p className="stat-label">Total Visitors</p>
          <p className="stat-value mt-1">{totalVisitors.toLocaleString()}</p>
        </div>
        <div className="admin-stat">
          <p className="stat-label">Today</p>
          <p className="stat-value mt-1">{todayVisitors.toLocaleString()}</p>
        </div>
        <div className="admin-stat">
          <p className="stat-label">30-Day Total</p>
          <p className="stat-value mt-1">{dailyVisitors.reduce((s, d) => s + d.count, 0).toLocaleString()}</p>
        </div>
        <div className="admin-stat">
          <p className="stat-label">Daily Average</p>
          <p className="stat-value mt-1">
            {dailyVisitors.length > 0 ? Math.round(dailyVisitors.reduce((s, d) => s + d.count, 0) / dailyVisitors.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Daily chart */}
      <div className="admin-card p-6">
        <h2 className="admin-section-title mb-5">Daily Visitors — Last 30 Days</h2>
        {dailyVisitors.length > 0 ? (
          <div className="flex items-end gap-[2px] h-48 overflow-x-auto">
            {dailyVisitors.map((d) => (
              <div key={d._id} className="flex-1 min-w-[12px] flex flex-col items-center gap-0.5 group relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                  {d._id}: {d.count}
                </div>
                <div
                  className="w-full bg-gradient-to-t from-orange-500 to-amber-400 rounded-t-sm transition-all hover:from-orange-600 hover:to-amber-500"
                  style={{ height: `${Math.max((d.count / maxDaily) * 100, 3)}%` }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-400">No visitor data</p>
        )}
        {dailyVisitors.length > 0 && (
          <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
            <span>{dailyVisitors[0]?._id?.slice(5)}</span>
            <span>{dailyVisitors[dailyVisitors.length - 1]?._id?.slice(5)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="admin-card p-6">
          <h2 className="admin-section-title mb-5">Top Pages</h2>
          <div className="space-y-3">
            {topPages.map((p, i) => {
              const pct = Math.round((p.count / (topPages[0]?.count || 1)) * 100)
              return (
                <div key={p._id || i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 truncate max-w-[70%]">{p._id || '/'}</span>
                    <span className="text-gray-400 flex-shrink-0">{p.count.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F3F4F6' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #3B82F6, #60A5FA)' }} />
                  </div>
                </div>
              )
            })}
            {topPages.length === 0 && <p className="text-center py-4 text-gray-400 text-sm">No page data</p>}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="admin-card p-6">
          <h2 className="admin-section-title mb-5">Device Breakdown</h2>
          {deviceBreakdown.length > 0 ? (
            <>
              {/* Simple horizontal bar */}
              <div className="flex h-8 rounded-full overflow-hidden mb-6">
                {deviceBreakdown.map(d => (
                  <div
                    key={d._id}
                    className={`${DEVICE_COLORS[d._id] || 'bg-gray-400'} transition-all`}
                    style={{ width: `${(d.count / totalDevices) * 100}%` }}
                    title={`${d._id}: ${d.count}`}
                  />
                ))}
              </div>
              <div className="space-y-4">
                {deviceBreakdown.map(d => {
                  const pct = Math.round((d.count / totalDevices) * 100)
                  return (
                    <div key={d._id} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${DEVICE_COLORS[d._id] || 'bg-gray-400'}`} />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-900">{d._id}</span>
                          <span className="text-gray-400">{d.count.toLocaleString()} ({pct}%)</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <p className="text-center py-8 text-gray-400 text-sm">No device data</p>
          )}
        </div>
      </div>
    </div>
  )
}
