'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type UserData = {
  _id: string; name: string; email: string; role: string; status: string
  phone?: string; city?: string; state?: string; createdAt: string
}

export default function UserDashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) setUser(data.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Load bookmarks from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('sarvdev_bookmarks') || '[]')
      if (Array.isArray(saved)) setBookmarks(saved)
    } catch {}
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-lg font-semibold mb-2">Please login first</p>
          <Link href="/login" className="text-orange-600 font-medium">Go to Login →</Link>
        </div>
      </div>
    )
  }

  const quickLinks = [
    { href: '/temples', icon: '🛕', label: 'Browse Temples', desc: 'Find & bookmark temples' },
    { href: '/devotionals', icon: '🎵', label: 'Devotionals', desc: 'Bhajans & Aarti' },
    { href: '/panchang', icon: '📅', label: 'Panchang', desc: 'Tithi & Muhurat' },
    { href: '/events', icon: '🎊', label: 'Festivals', desc: 'Upcoming festivals' },
    { href: '/spiritual-icons', icon: '🕉️', label: 'Deities', desc: 'Learn about deities' },
    { href: '/blog', icon: '📝', label: 'Blog', desc: 'Spiritual articles' },
    { href: '/bookmarks', icon: '🔖', label: 'My Bookmarks', desc: `${bookmarks.length} saved` },
    { href: '/daily-darshan', icon: '🌅', label: 'Daily Darshan', desc: 'Today\'s darshan' },
  ]

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">🙏 My Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, {user.name}!</p>
          </div>
          <Link href="/api/auth/logout" className="text-sm text-gray-500 hover:text-red-500 transition-colors">
            Logout →
          </Link>
        </div>

        {/* Profile card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 md:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3"
                style={{ background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)' }}>
                👤
              </div>
              <h2 className="font-bold text-gray-900 text-lg">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              {user.city && <p className="text-xs text-gray-400 mt-1">📍 {user.city}{user.state && `, ${user.state}`}</p>}
              <span className="inline-block mt-2 text-[11px] font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                श्रद्धालु / Devotee
              </span>
            </div>
            <div className="mt-5 space-y-2 text-sm">
              {[
                { label: 'Member since', value: new Date(user.createdAt).toLocaleDateString('en-IN') },
                { label: 'Phone', value: user.phone || 'Not set' },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            {[
              { icon: '🔖', label: 'Bookmarked Temples', value: bookmarks.length, href: '/bookmarks', color: '#FFF7ED', text: '#C2410C' },
              { icon: '🛕', label: 'Browse All Temples', value: 'Explore', href: '/temples', color: '#EFF6FF', text: '#1D4ED8' },
              { icon: '🎵', label: 'Devotionals', value: 'Listen', href: '/devotionals', color: '#F5F3FF', text: '#6D28D9' },
              { icon: '📅', label: 'Today\'s Panchang', value: 'View', href: '/panchang', color: '#F0FDF4', text: '#15803D' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="card p-5 flex flex-col items-start gap-2 hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: item.color }}>
                  {item.icon}
                </div>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-bold text-gray-900"
                  style={{ color: typeof item.value === 'number' && item.value > 0 ? item.text : undefined }}>
                  {item.value}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Bookmarks preview */}
        {bookmarks.length > 0 && (
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><span>🔖</span> Saved Temples</h2>
              <Link href="/bookmarks" className="text-xs text-orange-600 font-medium hover:text-orange-700">
                View all →
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              {bookmarks.slice(0, 8).map(id => (
                <Link key={id} href={`/temples/${id}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors font-medium">
                  🛕 Temple #{id.slice(-6)}
                </Link>
              ))}
              {bookmarks.length > 8 && (
                <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-500">
                  +{bookmarks.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Explore Sarvdev</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 transition-all text-center">
                <span className="text-2xl">{link.icon}</span>
                <span className="text-xs font-bold text-gray-800">{link.label}</span>
                <span className="text-[10px] text-gray-400">{link.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Are you a temple/pandit? */}
        <div className="card p-5 border border-amber-200 bg-amber-50/40">
          <h3 className="font-bold text-amber-900 text-sm mb-1">🛕 Are you a Temple Manager or Pandit?</h3>
          <p className="text-xs text-amber-700 mb-3">Register a separate account to get access to the Temple Portal or Pandit Portal with dedicated management tools.</p>
          <Link href="/login"
            className="text-xs font-semibold px-4 py-2 rounded-lg text-white inline-block"
            style={{ background: 'linear-gradient(135deg, #FF9933, #D4AF37)' }}>
            Register as Temple / Pandit →
          </Link>
        </div>

      </div>
    </main>
  )
}
