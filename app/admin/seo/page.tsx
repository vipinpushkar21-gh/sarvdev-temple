'use client'

import { useState } from 'react'

const DEFAULT_PAGES = [
  { path: '/', title: 'Sarvdev — Temple Directory & Devotional Hub', description: 'Explore temples worldwide, devotionals, daily darshan, panchang and spiritual content.' },
  { path: '/temples', title: 'Temple Directory — Sarvdev', description: 'Browse and discover temples across the world with details, timings, and directions.' },
  { path: '/devotionals', title: 'Devotionals — Sarvdev', description: 'Listen to bhajans, aartis, chalisas, stotras and more devotional content.' },
  { path: '/blog', title: 'Spiritual Blog — Sarvdev', description: 'Read articles about Hindu spirituality, temple history, festivals and more.' },
  { path: '/events', title: 'Temple Events — Sarvdev', description: 'Stay updated with upcoming temple events, festivals and celebrations.' },
  { path: '/panchang', title: 'Hindu Panchang — Sarvdev', description: 'Daily panchang with tithi, nakshatra, yoga and other Hindu calendar details.' },
  { path: '/darshan', title: 'Daily Darshan — Sarvdev', description: 'View live and recorded darshan from temples across the world.' },
]

export default function AdminSeoPage() {
  const [pages, setPages] = useState(DEFAULT_PAGES)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [sitemapGenerated, setSitemapGenerated] = useState(false)

  const startEdit = (i: number) => {
    setEditingIdx(i)
    setEditTitle(pages[i].title)
    setEditDesc(pages[i].description)
  }

  const saveEdit = () => {
    if (editingIdx === null) return
    setPages(p => p.map((pg, i) => i === editingIdx ? { ...pg, title: editTitle, description: editDesc } : pg))
    setEditingIdx(null)
  }

  const generateSitemap = () => {
    setSitemapGenerated(true)
    setTimeout(() => setSitemapGenerated(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="admin-page-title">SEO Manager</h1>
        <p className="admin-section-subtitle">Manage meta titles, descriptions and sitemap for all pages</p>
      </div>

      {/* Quick Actions */}
      <div className="admin-card p-6">
        <h2 className="admin-section-title mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateSitemap}
            className={`admin-btn px-4 py-2 text-sm ${sitemapGenerated ? 'admin-btn-success' : 'admin-btn-primary'}`}
          >
            {sitemapGenerated ? '✓ Sitemap Generated' : 'Generate Sitemap'}
          </button>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">View Sitemap</a>
          <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost px-4 py-2 text-sm">View robots.txt</a>
        </div>
      </div>

      {/* SEO Tips */}
      <div className="admin-card p-5" style={{ background: '#FFFBEB', borderColor: 'rgba(217,119,6,0.15)' }}>
        <h3 className="font-semibold text-amber-800 mb-2">SEO Best Practices</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>- Title: 50-60 characters (include main keyword)</li>
          <li>- Description: 150-160 characters (compelling, with CTA)</li>
          <li>- Each page should have a unique title and description</li>
          <li>- Include brand name at the end of titles</li>
        </ul>
      </div>

      {/* Page Meta Editor */}
      <div className="admin-card">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <h2 className="admin-section-title">Page Meta Tags</h2>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
          {pages.map((pg, i) => (
            <div key={pg.path} className="px-5 py-4">
              {editingIdx === i ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="admin-badge-purple text-xs font-mono">{pg.path}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Title ({editTitle.length}/60)</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className={`admin-input w-full ${editTitle.length > 60 ? '!border-red-300' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Description ({editDesc.length}/160)</label>
                    <textarea
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      rows={2}
                      className={`admin-input w-full ${editDesc.length > 160 ? '!border-red-300' : ''}`}
                    />
                  </div>
                  {/* Google Preview */}
                  <div className="rounded-xl p-3" style={{ background: '#F9FAFB' }}>
                    <p className="text-xs text-gray-400 mb-1">Google Preview</p>
                    <p className="text-blue-600 text-base font-medium truncate">{editTitle || 'Page Title'}</p>
                    <p className="text-green-600 text-xs">sarvdev.com{pg.path}</p>
                    <p className="text-gray-500 text-sm line-clamp-2">{editDesc || 'Page description...'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="admin-btn admin-btn-success px-4 py-1.5 text-sm">Save</button>
                    <button onClick={() => setEditingIdx(null)} className="admin-btn admin-btn-ghost px-4 py-1.5 text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="admin-badge-purple text-xs font-mono">{pg.path}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-lg ${pg.title.length <= 60 ? 'admin-badge-green' : 'admin-badge-red'}`}>
                        {pg.title.length}/60
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{pg.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{pg.description}</p>
                  </div>
                  <button
                    onClick={() => startEdit(i)}
                    className="admin-btn admin-btn-ghost flex-shrink-0"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
