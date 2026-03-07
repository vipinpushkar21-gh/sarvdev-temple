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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Manager</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage meta titles, descriptions and sitemap for all pages</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateSitemap}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sitemapGenerated
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800'
            }`}
          >
            {sitemapGenerated ? '✓ Sitemap Generated' : 'Generate Sitemap'}
          </button>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            View Sitemap
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            View robots.txt
          </a>
        </div>
      </div>

      {/* SEO Tips */}
      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-2">SEO Best Practices</h3>
        <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-1">
          <li>- Title: 50-60 characters (include main keyword)</li>
          <li>- Description: 150-160 characters (compelling, with CTA)</li>
          <li>- Each page should have a unique title and description</li>
          <li>- Include brand name at the end of titles</li>
        </ul>
      </div>

      {/* Page Meta Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Page Meta Tags</h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {pages.map((pg, i) => (
            <div key={pg.path} className="px-5 py-4">
              {editingIdx === i ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">{pg.path}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Title ({editTitle.length}/60)</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${editTitle.length > 60 ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Description ({editDesc.length}/160)</label>
                    <textarea
                      value={editDesc}
                      onChange={e => setEditDesc(e.target.value)}
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${editDesc.length > 160 ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`}
                    />
                  </div>
                  {/* Google Preview */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-1">Google Preview</p>
                    <p className="text-blue-700 dark:text-blue-400 text-base font-medium truncate">{editTitle || 'Page Title'}</p>
                    <p className="text-green-700 dark:text-green-500 text-xs">sarvdev.com{pg.path}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{editDesc || 'Page description...'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-4 py-1.5 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700">Save</button>
                    <button onClick={() => setEditingIdx(null)} className="px-4 py-1.5 text-sm font-medium rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-500">{pg.path}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${pg.title.length <= 60 ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                        {pg.title.length}/60
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{pg.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{pg.description}</p>
                  </div>
                  <button
                    onClick={() => startEdit(i)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 flex-shrink-0"
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
