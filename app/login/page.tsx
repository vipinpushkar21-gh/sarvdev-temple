'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'login' | 'register'
type Role = 'user' | 'temple' | 'pandit'

const roles: { key: Role; label: string; description: string }[] = [
  { key: 'user', label: 'Devotee', description: 'A simple Sarvdev account' },
  { key: 'temple', label: 'Temple manager', description: 'Request access to the temple portal' },
  { key: 'pandit', label: 'Pandit / Pujari', description: 'Request access to the pandit portal' },
]

const fieldClass = 'mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3.5 py-3 text-sm text-stone-900 outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-100'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')
  const [checkingSession, setCheckingSession] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [role, setRole] = useState<Role>('user')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [register, setRegister] = useState({ name: '', email: '', password: '', confirm: '', phone: '', city: '', state: '', templeName: '', designation: '', experience: '', bio: '' })

  useEffect(() => {
    fetch('/api/auth/me')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data?.user) return
        const destination = data.user.role === 'admin' ? '/admin/dashboard' : data.user.role === 'temple' ? '/temple-portal' : data.user.role === 'pandit' ? '/pandit-portal' : '/user/dashboard'
        router.replace(destination)
      })
      .finally(() => setCheckingSession(false))
  }, [router])

  function changeTab(next: Tab) {
    setTab(next)
    setError('')
    setNotice('')
  }

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: loginEmail, password: loginPassword }) })
      const data = await response.json()
      if (!response.ok) return setError(data.error || 'Unable to sign in.')
      const destination = data.user?.role === 'admin' ? '/admin/dashboard' : data.user?.role === 'temple' ? '/temple-portal' : data.user?.role === 'pandit' ? '/pandit-portal' : '/user/dashboard'
      router.replace(destination)
      router.refresh()
    } catch { setError('A network error occurred. Please try again.') } finally { setLoading(false) }
  }

  async function submitRegister(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setNotice('')
    if (register.password !== register.confirm) return setError('Passwords do not match.')
    if (register.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: register.name, email: register.email, password: register.password, role, phone: register.phone, city: register.city, state: register.state, templeName: register.templeName, designation: register.designation, experience: register.experience, bio: register.bio }),
      })
      const data = await response.json()
      if (!response.ok) return setError(data.error || 'Unable to create the account.')
      if (data.pending) {
        setNotice(data.message || 'Your request has been submitted for review.')
        return
      }
      router.replace('/user/dashboard')
      router.refresh()
    } catch { setError('A network error occurred. Please try again.') } finally { setLoading(false) }
  }

  if (checkingSession) return <main className="min-h-screen bg-surface flex items-center justify-center"><span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-700 border-t-transparent" aria-label="Checking your session" /></main>

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-10 border-l-2 border-primary-600 pl-4">
          <p className="font-serif text-xl font-semibold text-ink">Sarvdev</p>
          <p className="mt-1 text-sm text-ink-muted">Your place in Sarvdev</p>
        </div>
        <section className="border border-surface-border bg-white p-5 shadow-sm sm:p-8">
          <div className="border-b border-surface-border pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">Account</p>
            <h1 className="mt-2 font-serif text-3xl text-ink">{tab === 'login' ? 'Welcome back' : 'Create your account'}</h1>
            <p className="mt-2 text-sm leading-6 text-ink-muted">{tab === 'login' ? 'Sign in with your Sarvdev email and password.' : 'Choose the account type that reflects how you use Sarvdev.'}</p>
          </div>
          <div className="mt-5 flex border-b border-surface-border" role="tablist">
            {(['login', 'register'] as Tab[]).map((item) => <button key={item} type="button" onClick={() => changeTab(item)} className={`-mb-px px-1 pb-3 mr-6 text-sm font-medium ${tab === item ? 'border-b-2 border-primary-700 text-ink' : 'text-ink-muted'}`}>{item === 'login' ? 'Sign in' : 'Create account'}</button>)}
          </div>
          {error && <p role="alert" className="mt-5 border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
          {notice && <div className="mt-5 border-l-2 border-primary-700 bg-primary-50 px-3 py-3 text-sm leading-6 text-ink"><p>{notice}</p><button className="mt-2 font-medium text-primary-800 underline" type="button" onClick={() => changeTab('login')}>Return to sign in</button></div>}
          {tab === 'login' ? <form className="mt-6 space-y-5" onSubmit={submitLogin}>
            <label className="block text-sm font-medium text-ink">Email<input className={fieldClass} type="email" autoComplete="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required /></label>
            <label className="block text-sm font-medium text-ink">Password<input className={fieldClass} type="password" autoComplete="current-password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required /></label>
            <button disabled={loading} className="w-full rounded-lg bg-primary-800 py-3 text-sm font-semibold text-white transition hover:bg-primary-900 disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
          </form> : !notice && <form className="mt-6 space-y-5" onSubmit={submitRegister}>
            <fieldset><legend className="text-sm font-medium text-ink">I am joining as</legend><div className="mt-2 space-y-2">{roles.map((item) => <label key={item.key} className={`block cursor-pointer border p-3 transition ${role === item.key ? 'border-primary-700 bg-primary-50' : 'border-surface-border'}`}><input className="sr-only" type="radio" checked={role === item.key} onChange={() => setRole(item.key)} /><span className="block text-sm font-medium text-ink">{item.label}</span><span className="mt-0.5 block text-xs text-ink-muted">{item.description}</span></label>)}</div></fieldset>
            {role !== 'user' && <p className="border-l-2 border-primary-700 bg-surface-sunken px-3 py-2 text-xs leading-5 text-ink-muted">{role === 'temple' ? 'Temple manager' : 'Pandit / Pujari'} access is reviewed before you can sign in. Submission does not guarantee approval.</p>}
            <label className="block text-sm font-medium text-ink">Full name<input className={fieldClass} value={register.name} onChange={(event) => setRegister({ ...register, name: event.target.value })} required /></label>
            <label className="block text-sm font-medium text-ink">Email<input className={fieldClass} type="email" autoComplete="email" value={register.email} onChange={(event) => setRegister({ ...register, email: event.target.value })} required /></label>
            <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium text-ink">Password<input className={fieldClass} type="password" minLength={6} autoComplete="new-password" value={register.password} onChange={(event) => setRegister({ ...register, password: event.target.value })} required /></label><label className="block text-sm font-medium text-ink">Confirm password<input className={fieldClass} type="password" minLength={6} autoComplete="new-password" value={register.confirm} onChange={(event) => setRegister({ ...register, confirm: event.target.value })} required /></label></div>
            <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-medium text-ink">Phone <span className="text-ink-muted">(optional)</span><input className={fieldClass} type="tel" value={register.phone} onChange={(event) => setRegister({ ...register, phone: event.target.value })} /></label><label className="block text-sm font-medium text-ink">City <span className="text-ink-muted">(optional)</span><input className={fieldClass} value={register.city} onChange={(event) => setRegister({ ...register, city: event.target.value })} /></label></div>
            {role === 'temple' && <><label className="block text-sm font-medium text-ink">Temple name<input className={fieldClass} value={register.templeName} onChange={(event) => setRegister({ ...register, templeName: event.target.value })} required /></label><label className="block text-sm font-medium text-ink">Designation <span className="text-ink-muted">(optional)</span><input className={fieldClass} value={register.designation} onChange={(event) => setRegister({ ...register, designation: event.target.value })} /></label></>}
            {role === 'pandit' && <><label className="block text-sm font-medium text-ink">State <span className="text-ink-muted">(optional)</span><input className={fieldClass} value={register.state} onChange={(event) => setRegister({ ...register, state: event.target.value })} /></label><label className="block text-sm font-medium text-ink">Experience <span className="text-ink-muted">(optional)</span><input className={fieldClass} type="number" min="0" max="60" value={register.experience} onChange={(event) => setRegister({ ...register, experience: event.target.value })} /></label></>}
            <button disabled={loading} className="w-full rounded-lg bg-primary-800 py-3 text-sm font-semibold text-white transition hover:bg-primary-900 disabled:opacity-60">{loading ? (role === 'user' ? 'Creating account…' : 'Submitting…') : role === 'user' ? 'Create account' : 'Submit for review'}</button>
          </form>}
        </section>
        <p className="mt-6 text-center text-xs leading-5 text-ink-muted">Sarvdev accounts use email and password. Saved content remains on this browser and device.</p>
      </div>
    </main>
  )
}
