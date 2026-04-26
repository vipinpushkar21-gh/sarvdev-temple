"use client"

import { useEffect, useState } from 'react'

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PushNotificationBell() {
  const [permission, setPermission] = useState<PermissionState>('default')
  const [loading, setLoading] = useState(false)
  const [tooltip, setTooltip] = useState(false)

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setPermission('unsupported')
      return
    }
    setPermission(Notification.permission as PermissionState)
  }, [])

  async function subscribe() {
    if (loading || permission === 'granted' || permission === 'unsupported') return
    setLoading(true)
    try {
      const perm = await Notification.requestPermission()
      setPermission(perm as PermissionState)
      if (perm !== 'granted') return

      const reg = await navigator.serviceWorker.ready
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) {
        console.warn('NEXT_PUBLIC_VAPID_PUBLIC_KEY not set')
        return
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey).buffer as ArrayBuffer,
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub),
      })
    } catch (err) {
      console.error('Push subscription error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function unsubscribe() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setPermission('default')
    } catch (err) {
      console.error('Unsubscribe error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (permission === 'unsupported') return null

  const isGranted = permission === 'granted'

  return (
    <div className="relative" onMouseEnter={() => setTooltip(true)} onMouseLeave={() => setTooltip(false)}>
      <button
        onClick={isGranted ? unsubscribe : subscribe}
        disabled={loading || permission === 'denied'}
        aria-label={isGranted ? 'Unsubscribe from notifications' : 'Subscribe to festival notifications'}
        className={`p-2 rounded-xl transition-all duration-300 relative ${
          isGranted
            ? 'text-accent hover:bg-accent/10'
            : permission === 'denied'
            ? 'text-white/30 cursor-not-allowed'
            : 'text-orange-100/70 hover:text-white hover:bg-white/[0.10]'
        }`}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isGranted ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        )}
        {!isGranted && permission !== 'denied' && (
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        )}
      </button>

      {tooltip && (
        <div className="absolute right-0 top-full mt-2 w-48 px-3 py-2 rounded-xl bg-secondary-900 text-white text-[11px] text-center shadow-xl z-[70] pointer-events-none whitespace-normal leading-snug">
          {permission === 'denied'
            ? 'Notifications blocked. Browser settings mein enable karein.'
            : isGranted
            ? 'Festival notifications ON hai. Click to disable.'
            : 'Festival & temple notifications ke liye subscribe karein 🔔'}
          <div className="absolute -top-1 right-4 w-2 h-2 rotate-45 bg-secondary-900" />
        </div>
      )}
    </div>
  )
}
