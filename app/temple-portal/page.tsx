'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type TempleUser = {
  _id: string; name: string; email: string; role: string; status: string
  templeName?: string; templeId?: string; designation?: string
  city?: string; state?: string; phone?: string; createdAt: string
}

type TempleData = { _id: string; title: string; city?: string; state?: string; status?: string; image?: string }

export default function TemplePortalPage() {
  const [user, setUser] = useState<TempleUser | null>(null)
  const [temple, setTemple] = useState<TempleData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          if (data.user.templeId) {
            fetch(`/api/temples/${data.user.templeId}`)
              .then(r => r.ok ? r.json() : null)
              .then(t => t && setTemple(t))
              .catch(() => {})
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
          <p className="text-lg font-semibold text-gray-900 mb-2">Session expired</p>
          <Link href="/login" className="text-orange-600 font-medium">Login again →</Link>
        </div>
      </div>
    )
  }

  const quickLinks = [
    { href: '/list-temple', icon: '➕', label: 'Submit Temple', desc: 'Add new temple listing' },
    { href: '/admin/darshan', icon: '📸', label: 'Upload Darshan', desc: 'Add today\'s darshan photos' },
    { href: '/temples', icon: '🔍', label: 'Browse Temples', desc: 'View all temples' },
    { href: '/contact', icon: '📞', label: 'Contact Admin', desc: 'Get help from admin' },
  ]

  return (
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">🛕 Temple Portal</h1>
            <p className="text-sm text-gray-500 mt-0.5">Namaste, {user.name}!</p>
          </div>
          <Link href="/api/auth/logout" className="text-sm text-gray-500 hover:text-red-500 transition-colors">Logout →</Link>
        </div>

        {/* Status banner */}
        {user.status === 'approved' ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">✓</span>
            <div>
              <p className="font-semibold text-emerald-800 text-sm">Account Approved</p>
              <p className="text-xs text-emerald-600">Your temple manager account is active. You can manage your temple listing.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Account Pending Approval</p>
              <p className="text-xs text-amber-600">Admin will review your account within 24 hours. You will be notified once approved.</p>
            </div>
          </div>
        )}

        {/* Profile card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>👤</span> My Profile</h2>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Name', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Phone', value: user.phone || '—' },
                { label: 'City', value: user.city || '—' },
                { label: 'Designation', value: user.designation || '—' },
                { label: 'Member since', value: new Date(user.createdAt).toLocaleDateString('en-IN') },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Claimed Temple */}
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>🛕</span> My Temple</h2>
            {temple ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {temple.image && <img src={temple.image} alt={temple.title} className="w-14 h-14 rounded-xl object-cover" />}
                  <div>
                    <p className="font-bold text-gray-900">{temple.title}</p>
                    <p className="text-xs text-gray-500">{[temple.city, temple.state].filter(Boolean).join(', ')}</p>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${temple.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {temple.status}
                    </span>
                  </div>
                </div>
                <Link href={`/temples/${temple._id}`} className="text-sm text-orange-600 font-medium hover:text-orange-700">
                  View Temple Page →
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-1">Temple name: <strong>{user.templeName || '—'}</strong></p>
                <p className="text-xs text-gray-400 mb-4">Admin will link your temple after verification, or you can claim it from the temple page.</p>
                <Link href="/temples" className="text-sm text-orange-600 font-medium border border-orange-300 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors">
                  Find & Claim Your Temple →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-center">
                <span className="text-2xl">{link.icon}</span>
                <span className="text-xs font-bold text-gray-800">{link.label}</span>
                <span className="text-[10px] text-gray-400">{link.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="card p-6 bg-blue-50/50 border-blue-100">
          <h3 className="font-bold text-blue-800 text-sm mb-2">ℹ️ What Temple Managers Can Do</h3>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>Submit new temple listings for admin approval</li>
            <li>Upload darshan photos and videos for your temple</li>
            <li>Update timing, contact, and festival information</li>
            <li>View visitor analytics for your temple page</li>
            <li>Post announcements and special events</li>
            <li>Claim ownership of already-listed temples</li>
          </ul>
        </div>

      </div>
    </main>
  )
}
