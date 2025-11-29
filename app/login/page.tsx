"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple demo authentication (replace with NextAuth in production)
    if (email.trim() === 'admin@sarvdev.com' && password.trim() === 'admin123') {
      // Store simple auth token in localStorage
      localStorage.setItem('isAdmin', 'true')
      router.push('/admin')
    } else {
      setError('Invalid email or password')
    }
    
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-sky-50 to-emerald-50">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-700">Sarvdev Admin</h1>
            <p className="mt-2 text-slate-600">Sign in to manage your temple directory</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="admin@sarvdev.com"
                suppressHydrationWarning
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your password"
                suppressHydrationWarning
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              suppressHydrationWarning
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Demo Credentials: <br />
              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">admin@sarvdev.com / admin123</span>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-emerald-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
