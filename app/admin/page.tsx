"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  useEffect(() => {
    // Check if user is authenticated
    const isAdmin = localStorage.getItem('isAdmin')
    if (isAdmin === 'true') {
      setIsAuthenticated(true)
    } else {
      router.push('/login')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    router.push('/login')
  }
  
  // form state for Temples
  const [tTitle, setTTitle] = useState("")
  const [tDesc, setTDesc] = useState("")
  const [tImage, setTImage] = useState("")
  const [tLocation, setTLocation] = useState("")
  const [tTimings, setTTimings] = useState("")
  const [tContact, setTContact] = useState("")

  // form state for Darshan
  const [dTitle, setDTitle] = useState("")
  const [dDesc, setDDesc] = useState("")
  const [dTime, setDTime] = useState("")
  const [dVideo, setDVideo] = useState("")
  const [dTemple, setDTemple] = useState("")

  // form state for Events
  const [eTitle, setETitle] = useState("")
  const [eDesc, setEDesc] = useState("")
  const [eDate, setEDate] = useState("")
  const [eImage, setEImage] = useState("")

  const addTemple = async () => {
    if (!tTitle.trim() || !tDesc.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: tTitle.trim(),
          description: tDesc.trim(),
          image: tImage.trim() || undefined,
          location: tLocation.trim() || undefined,
          timings: tTimings.trim() || undefined,
          contact: tContact.trim() || undefined,
          status: 'pending'
        })
      })
      if (res.ok) {
        alert('Temple submitted successfully!')
        setTTitle(""); setTDesc(""); setTImage(""); setTLocation(""); setTTimings(""); setTContact("")
      } else {
        alert('Failed to submit temple')
      }
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const addDarshan = async () => {
    if (!dTitle.trim() || !dDesc.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/darshan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: dTitle.trim(),
          description: dDesc.trim(),
          time: dTime.trim() || undefined,
          video: dVideo.trim() || undefined,
          temple: dTemple.trim() || undefined,
          status: 'pending'
        })
      })
      if (res.ok) {
        alert('Darshan submitted successfully!')
        setDTitle(""); setDDesc(""); setDTime(""); setDVideo(""); setDTemple("")
      } else {
        alert('Failed to submit darshan')
      }
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const addEvent = async () => {
    if (!eTitle.trim() || !eDesc.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: eTitle.trim(),
          description: eDesc.trim(),
          date: eDate.trim() || undefined,
          image: eImage.trim() || undefined,
          status: 'pending'
        })
      })
      if (res.ok) {
        alert('Event submitted successfully!')
        setETitle(""); setEDesc(""); setEDate(""); setEImage("")
      } else {
        alert('Failed to submit event')
      }
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">Submit new temples, darshan schedules, and events</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/temples" className="px-3 py-2 bg-slate-200 rounded-md text-sm">View Temples</Link>
          <Link href="/admin/darshan" className="px-3 py-2 bg-slate-200 rounded-md text-sm">View Darshan</Link>
          <Link href="/admin/events" className="px-3 py-2 bg-slate-200 rounded-md text-sm">View Events</Link>
          <Link href="/admin/blogs" className="px-3 py-2 bg-slate-200 rounded-md text-sm">View Blogs</Link>
          <button onClick={handleLogout} className="px-3 py-2 bg-rose-600 text-white rounded-md text-sm">Logout</button>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Temples panel */}
        <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-3">Add Temple</h2>
          <form onSubmit={(e) => { e.preventDefault(); addTemple() }} className="space-y-2 mb-4">
            <input value={tTitle} onChange={(e) => setTTitle(e.target.value)} placeholder="Title*" className="w-full rounded-md border px-3 py-2" required />
            <input value={tLocation} onChange={(e) => setTLocation(e.target.value)} placeholder="Location (city, address)" className="w-full rounded-md border px-3 py-2" />
            <input value={tImage} onChange={(e) => setTImage(e.target.value)} placeholder="Image URL (optional)" className="w-full rounded-md border px-3 py-2" />
            <input value={tTimings} onChange={(e) => setTTimings(e.target.value)} placeholder="Timings (e.g., 06:00-09:00, 17:00-19:00)" className="w-full rounded-md border px-3 py-2" />
            <input value={tContact} onChange={(e) => setTContact(e.target.value)} placeholder="Contact info (phone/email)" className="w-full rounded-md border px-3 py-2" />
            <textarea value={tDesc} onChange={(e) => setTDesc(e.target.value)} placeholder="Description*" rows={3} className="w-full rounded-md border px-3 py-2" required />
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="px-3 py-2 bg-emerald-600 text-white rounded-md disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Temple'}
              </button>
            </div>
          </form>
          <p className="text-xs text-slate-500 mt-2">Submissions will be pending approval</p>
        </div>

        {/* Daily Darshan panel */}
        <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-3">Add Daily Darshan</h2>
          <form onSubmit={(e) => { e.preventDefault(); addDarshan() }} className="space-y-2 mb-4">
            <input value={dTitle} onChange={(e) => setDTitle(e.target.value)} placeholder="Title*" className="w-full rounded-md border px-3 py-2" required />
            <input value={dTemple} onChange={(e) => setDTemple(e.target.value)} placeholder="Temple name" className="w-full rounded-md border px-3 py-2" />
            <input value={dTime} onChange={(e) => setDTime(e.target.value)} placeholder="Time (e.g., 06:00 AM)" className="w-full rounded-md border px-3 py-2" />
            <input value={dVideo} onChange={(e) => setDVideo(e.target.value)} placeholder="Video URL (optional)" className="w-full rounded-md border px-3 py-2" />
            <textarea value={dDesc} onChange={(e) => setDDesc(e.target.value)} placeholder="Description*" rows={3} className="w-full rounded-md border px-3 py-2" required />
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="px-3 py-2 bg-emerald-600 text-white rounded-md disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Darshan'}
              </button>
            </div>
          </form>
          <p className="text-xs text-slate-500 mt-2">Submissions will be pending approval</p>
        </div>

        {/* Events panel */}
        <div className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-3">Add Event</h2>
          <form onSubmit={(e) => { e.preventDefault(); addEvent() }} className="space-y-2 mb-4">
            <input value={eTitle} onChange={(e) => setETitle(e.target.value)} placeholder="Title*" className="w-full rounded-md border px-3 py-2" required />
            <input value={eDate} onChange={(e) => setEDate(e.target.value)} type="date" placeholder="Date" className="w-full rounded-md border px-3 py-2" />
            <input value={eImage} onChange={(e) => setEImage(e.target.value)} placeholder="Image URL (optional)" className="w-full rounded-md border px-3 py-2" />
            <textarea value={eDesc} onChange={(e) => setEDesc(e.target.value)} placeholder="Description*" rows={3} className="w-full rounded-md border px-3 py-2" required />
            <div className="flex justify-end">
              <button type="submit" disabled={loading} className="px-3 py-2 bg-emerald-600 text-white rounded-md disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Event'}
              </button>
            </div>
          </form>
          <p className="text-xs text-slate-500 mt-2">Submissions will be pending approval</p>
        </div>
      </section>
    </main>
  )
}
