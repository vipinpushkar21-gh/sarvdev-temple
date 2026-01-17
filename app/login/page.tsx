"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1]

    if (authToken) {
      router.push('/')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (res.ok) {
        const data = await res.json()
        // Set auth cookie
        document.cookie = `auth_token=${data.authToken}; path=/; max-age=86400` // 24 hours
        router.push('/')
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid password')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full">
        <div className="bg-background rounded-2xl shadow-xl p-8 border border-accent">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-primary">Sarvdev Temple</h1>
          <p className="mt-2 text-text">Enter password to access the website</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="border border-secondary text-secondary bg-accent/10 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
              Access Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-accent rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-background text-text"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary"
          >
            {loading ? 'Checking...' : 'Access Website'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text">
          This website is currently private. Contact administrator for access.
        </div>
      </div>
    </main>
  )
    </main>
  )
}
