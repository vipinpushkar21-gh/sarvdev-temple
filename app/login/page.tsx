"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Tab = 'login' | 'register'
type RegRole = 'user' | 'temple' | 'pandit'

const ROLE_CONFIG = [
  {
    key: 'user' as RegRole,
    icon: '👤',
    label: 'Devotee / User',
    labelHi: 'श्रद्धालु',
    desc: 'Bookmark temples, reviews, personal profile',
  },
  {
    key: 'temple' as RegRole,
    icon: '🛕',
    label: 'Temple Manager',
    labelHi: 'मंदिर प्रबंधक',
    desc: 'Manage your temple listing, upload darshan photos',
  },
  {
    key: 'pandit' as RegRole,
    icon: '🕉️',
    label: 'Pandit / Pujari',
    labelHi: 'पंडित / पुजारी',
    desc: 'Create pandit profile, list puja services',
  },
]

const PANDIT_SERVICES = ['Griha Pravesh', 'Satyanarayan Katha', 'Havan', 'Vivah Sanskar', 'Mundan', 'Namkaran', 'Annaprashan', 'Shradh / Pind Daan', 'Rudrabhishek', 'Sunderkand Path']
const PANDIT_LANGS = ['Hindi', 'Sanskrit', 'English', 'Gujarati', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Punjabi']

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingSuccess, setPendingSuccess] = useState('')

  // login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // register — common
  const [regRole, setRegRole] = useState<RegRole>('user')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regCity, setRegCity] = useState('')
  const [regState, setRegState] = useState('')
  // temple extra
  const [templeName, setTempleName] = useState('')
  const [designation, setDesignation] = useState('')
  // pandit extra
  const [experience, setExperience] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedLangs, setSelectedLangs] = useState<string[]>([])
  const [panditBio, setPanditBio] = useState('')

  function switchTab(t: Tab) { setTab(t); setError(''); setPendingSuccess('') }

  function toggleService(s: string) {
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }
  function toggleLang(l: string) {
    setSelectedLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])
  }

  // ─── Login ──────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        const role = data.user?.role
        if (role === 'admin') router.push('/admin/dashboard')
        else if (role === 'temple') router.push('/temple-portal')
        else if (role === 'pandit') router.push('/pandit-portal')
        else router.push('/')
        router.refresh()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Register ───────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (regPassword !== regConfirm) { setError('Passwords do not match'); return }
    if (regPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const body: Record<string, any> = {
        name: regName, email: regEmail, password: regPassword,
        role: regRole, phone: regPhone, city: regCity, state: regState,
      }
      if (regRole === 'temple') {
        body.templeName = templeName
        body.designation = designation
      }
      if (regRole === 'pandit') {
        body.services = selectedServices
        body.languages = selectedLangs
        body.experience = experience
        body.bio = panditBio
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) {
        if (data.pending) {
          setPendingSuccess(data.message)
        } else {
          const role = data.user?.role
          if (role === 'admin') router.push('/admin/dashboard')
          else router.push('/')
          router.refresh()
        }
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ─── Styles ─────────────────────────────────────────
  const IC = "w-full pl-10 pr-4 py-3 rounded-xl text-sm text-gray-900 border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all placeholder:text-gray-400"
  const Spin = () => <svg className="w-4 h-4 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
  const BtnPrimary = "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60"

  // ─── Icon helpers ────────────────────────────────────
  const IconEmail = () => <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
  const IconLock = () => <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
  const IconUser = () => <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
  const IconPhone = () => <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
  const IconPin = () => <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>
  const IconCheck = () => <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>

  return (
    <div className="min-h-screen flex">

      {/* ══════════════════════════════════
          LEFT — Temple Hero Panel (lg+)
      ══════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-1/2 flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg,#1A0800 0%,#2C0A00 40%,#3D1200 70%,#1A0800 100%)' }}>
        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 15% 10%,rgba(255,153,51,0.22) 0%,transparent 70%)' }}/>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 85% 90%,rgba(212,175,55,0.18) 0%,transparent 70%)' }}/>
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,153,51,1) 0,rgba(255,153,51,1) 1px,transparent 1px,transparent 14px)' }}/>
        </div>
        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#FF9933,#E67E22)' }}>
              <span className="text-white font-bold font-serif text-lg">S</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg tracking-tight leading-none">Sarvdev</p>
              <p className="text-[10px] uppercase tracking-widest" style={{ color:'rgba(255,153,51,0.55)' }}>Sacred Digital Space</p>
            </div>
          </div>
          {/* OM + tagline */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <div className="text-8xl xl:text-[108px] mb-5 select-none leading-none" style={{
              background:'linear-gradient(135deg,#FF9933 0%,#D4AF37 50%,#FF9933 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              filter:'drop-shadow(0 0 48px rgba(255,153,51,0.45))',
            }}>ॐ</div>
            <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-snug mb-3">
              Your Gateway to<br/>Sacred India
            </h2>
            <p className="text-sm xl:text-base leading-relaxed max-w-[280px]" style={{ color:'rgba(255,255,255,0.45)' }}>
              Discover temples, devotional content, pandits &amp; celebrate the divine.
            </p>
            <div className="mt-8 px-6 py-4 rounded-2xl" style={{ background:'rgba(255,153,51,0.07)', border:'1px solid rgba(255,153,51,0.14)' }}>
              <p className="text-sm font-serif" style={{ color:'rgba(212,175,55,0.9)' }}>"सर्वे भवन्तु सुखिनः"</p>
              <p className="text-[11px] mt-1" style={{ color:'rgba(255,255,255,0.3)' }}>May all be happy &amp; free from illness</p>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-8" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
            {[['500+','Temples'],['1200+','Devotionals'],['50+','Cities']].map(([n,l]) => (
              <div key={l} className="text-center">
                <p className="text-xl font-extrabold" style={{ color:'#FF9933' }}>{n}</p>
                <p className="text-[11px] mt-0.5" style={{ color:'rgba(255,255,255,0.35)' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          RIGHT — Form Panel
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white">
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 xl:px-14 py-10 max-w-lg mx-auto w-full">

          {/* Mobile brand */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:'linear-gradient(135deg,#FF9933,#E67E22)' }}>
              <span className="text-white font-bold font-serif">S</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Sarvdev</span>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">
              {tab === 'login' ? 'Welcome back 🙏' : 'Create account 🕉️'}
            </h1>
            <p className="text-gray-500 text-sm mt-1.5">
              {tab === 'login' ? 'Sign in to continue your spiritual journey' : 'Join thousands of devotees on Sarvdev'}
            </p>
          </div>

          {/* Google button */}
          <button type="button"
            onClick={() => setError('Google Sign-in coming soon — use email & password for now')}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all mb-5"
            style={{ border:'1.5px solid #E5E7EB', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' }}>
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200"/>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">or with email</span>
            <div className="flex-1 h-px bg-gray-200"/>
          </div>

          {/* Tab switcher */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background:'#F3F4F6' }}>
            {(['login','register'] as const).map(t => (
              <button key={t} type="button" onClick={() => switchTab(t)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${t === tab ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-700'}`}>
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
              {error}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <div className="relative"><IconEmail/>
                  <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={IC} placeholder="you@example.com" required autoComplete="email" suppressHydrationWarning/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative"><IconLock/>
                  <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={IC} placeholder="Enter your password" required autoComplete="current-password" suppressHydrationWarning/>
                </div>
              </div>
              <button type="submit" disabled={loading} className={BtnPrimary}
                style={{ background:'linear-gradient(135deg,#FF9933,#E67E22)', boxShadow:'0 4px 14px rgba(255,153,51,0.35)' }}>
                {loading ? <><Spin/>Signing in...</> : 'Sign In →'}
              </button>
              <p className="text-center text-sm text-gray-500 pt-1">
                New to Sarvdev?{' '}
                <button type="button" onClick={() => switchTab('register')} className="font-bold text-orange-500 hover:text-orange-600 transition-colors">Create account</button>
              </p>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <>
              {pendingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background:'linear-gradient(135deg,#FEF3C7,#FDE68A)' }}>
                    <span className="text-4xl">⏳</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">{pendingSuccess}</p>
                  <button onClick={() => switchTab('login')} className="px-8 py-3 rounded-xl text-sm font-bold text-white"
                    style={{ background:'linear-gradient(135deg,#FF9933,#E67E22)' }}>
                    Go to Sign In →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">

                  {/* Role cards */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Register as</p>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLE_CONFIG.map(r => (
                        <button key={r.key} type="button" onClick={() => setRegRole(r.key)}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center"
                          style={{ borderColor: regRole===r.key ? '#FF9933':'#E5E7EB', background: regRole===r.key ? '#FFF7ED':'#fff' }}>
                          <span className="text-2xl">{r.icon}</span>
                          <span className="text-[11px] font-bold leading-tight" style={{ color: regRole===r.key ? '#C2410C':'#4B5563' }}>{r.labelHi}</span>
                          <span className="text-[9px] text-gray-400 hidden sm:block">{r.label}</span>
                        </button>
                      ))}
                    </div>
                    {regRole !== 'user' && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2 flex items-start gap-1.5">
                        <span className="flex-shrink-0">⚠️</span>
                        <span>{regRole==='temple' ? 'Temple Manager' : 'Pandit'} accounts need admin approval before login.</span>
                      </p>
                    )}
                  </div>

                  {/* Common fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                      <div className="relative"><IconUser/>
                        <input type="text" value={regName} onChange={e => setRegName(e.target.value)} className={IC} placeholder="Your full name" required suppressHydrationWarning/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                      <div className="relative"><IconEmail/>
                        <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} className={IC} placeholder="you@example.com" required suppressHydrationWarning/>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                        <div className="relative"><IconLock/>
                          <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} className={IC} placeholder="Min 6 chars" required minLength={6} suppressHydrationWarning/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm *</label>
                        <div className="relative"><IconCheck/>
                          <input type="password" value={regConfirm} onChange={e => setRegConfirm(e.target.value)} className={IC} placeholder="Re-enter" required minLength={6} suppressHydrationWarning/>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                        <div className="relative"><IconPhone/>
                          <input type="tel" value={regPhone} onChange={e => setRegPhone(e.target.value)} className={IC} placeholder="+91 XXXXX" suppressHydrationWarning/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                        <div className="relative"><IconPin/>
                          <input type="text" value={regCity} onChange={e => setRegCity(e.target.value)} className={IC} placeholder="City" suppressHydrationWarning/>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Temple fields */}
                  {regRole === 'temple' && (
                    <div className="space-y-3 p-4 rounded-2xl" style={{ background:'#FFF7ED', border:'1.5px solid #FED7AA' }}>
                      <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">🛕 Temple Details</p>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Temple Name *</label>
                        <input type="text" value={templeName} onChange={e => setTempleName(e.target.value)} className={IC.replace('pl-10','pl-4')} placeholder="e.g. Shri Ram Mandir, Ayodhya" required suppressHydrationWarning/>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Designation</label>
                        <select value={designation} onChange={e => setDesignation(e.target.value)} className={IC.replace('pl-10','pl-4')} suppressHydrationWarning>
                          <option value="">Select your role</option>
                          {['Pujari / Head Priest','Temple Manager','Trustee','Secretary','Committee Member','Owner'].map(o => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <p className="text-[11px] text-gray-500">Admin links your account after verification. You can also claim from the temple page post-approval.</p>
                    </div>
                  )}

                  {/* Pandit fields */}
                  {regRole === 'pandit' && (
                    <div className="space-y-3 p-4 rounded-2xl" style={{ background:'#FAF5FF', border:'1.5px solid #E9D5FF' }}>
                      <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">🕉️ Pandit Details</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (yrs)</label>
                          <input type="number" value={experience} onChange={e => setExperience(e.target.value)} className={IC.replace('pl-10','pl-4')} placeholder="e.g. 10" min={0} max={60} suppressHydrationWarning/>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
                          <input type="text" value={regState} onChange={e => setRegState(e.target.value)} className={IC.replace('pl-10','pl-4')} placeholder="State" suppressHydrationWarning/>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1.5">Languages</p>
                        <div className="flex flex-wrap gap-1.5">
                          {PANDIT_LANGS.map(l => (
                            <button key={l} type="button" onClick={() => toggleLang(l)}
                              className="text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all"
                              style={{ background:selectedLangs.includes(l)?'#7C3AED':'#fff', color:selectedLangs.includes(l)?'#fff':'#6B7280', borderColor:selectedLangs.includes(l)?'#7C3AED':'#D1D5DB' }}>
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1.5">Services Offered</p>
                        <div className="flex flex-wrap gap-1.5">
                          {PANDIT_SERVICES.map(s => (
                            <button key={s} type="button" onClick={() => toggleService(s)}
                              className="text-[11px] px-2.5 py-1 rounded-full border font-medium transition-all"
                              style={{ background:selectedServices.includes(s)?'#EA580C':'#fff', color:selectedServices.includes(s)?'#fff':'#6B7280', borderColor:selectedServices.includes(s)?'#EA580C':'#D1D5DB' }}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Bio</label>
                        <textarea value={panditBio} onChange={e => setPanditBio(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
                          rows={2} placeholder="Brief about yourself..." suppressHydrationWarning/>
                      </div>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className={BtnPrimary}
                    style={{ background:'linear-gradient(135deg,#FF9933,#E67E22)', boxShadow:'0 4px 14px rgba(255,153,51,0.35)' }}>
                    {loading ? <><Spin/>{regRole==='user'?'Creating account...':'Submitting...'}</> : regRole==='user'?'Create Account →':'Submit for Approval →'}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchTab('login')} className="font-bold text-orange-500 hover:text-orange-600 transition-colors">Sign In</button>
                  </p>
                </form>
              )}
            </>
          )}

          <p className="text-center text-xs text-gray-400 mt-8 pb-2">Sarvdev · Temple Directory &amp; Devotional Hub</p>
        </div>
      </div>
    </div>
  )
}
