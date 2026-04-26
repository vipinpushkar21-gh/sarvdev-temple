const CACHE = 'sarvdev-v1'
const STATIC = [
  '/',
  '/temples',
  '/devotionals',
  '/events',
  '/manifest.json',
  '/images/sacred-pattern.svg',
  '/icon.svg',
]

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(STATIC)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('push', (e) => {
  const data = e.data?.json() || {}
  const title = data.title || 'Sarvdev'
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon.svg',
    badge: '/icon.svg',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
  }
  e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const url = e.notification.data?.url || '/'
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url === url && 'focus' in client) return client.focus()
      }
      if (clients.openWindow) return clients.openWindow(url)
    })
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)
  if (url.pathname.startsWith('/api/')) return

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone()
        caches.open(CACHE).then((c) => c.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request).then((r) => r || new Response('Offline', { status: 503 })))
  )
})
