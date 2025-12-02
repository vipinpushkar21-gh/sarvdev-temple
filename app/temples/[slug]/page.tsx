import Image from 'next/image'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function getTemple(slug: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/temples`, { cache: 'no-store' })
    if (!res.ok) return null
    const temples = await res.json()
    return temples.find((t: any) => slugify(t.title) === slug)
  } catch (error) {
    console.error('Error fetching temple:', error)
    return null
  }
}

export default async function TemplePage({ params }: Props) {
  const { slug } = await params
  const temple = await getTemple(slug)

  if (!temple) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Temple not found</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">We couldn't find this temple.</p>
        <Link href="/temples" className="inline-block mt-6 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">Back to temples</Link>
      </main>
    )
  }

  // Extract Google Maps link from location field if present
  const mapsLinkMatch = temple.location?.match(/(https?:\/\/maps\.app\.goo\.gl\/[^\s,]+)/)
  const mapsLink = mapsLinkMatch ? mapsLinkMatch[1] : null
  const displayLocation = temple.location?.replace(/(https?:\/\/maps\.app\.goo\.gl\/[^\s,]+)/g, '').trim()

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/temples" className="text-sm text-orange-600 hover:underline mb-4 inline-block">← Back to temples</Link>

      <header className="mt-4">
        <h1 className="text-3xl font-bold text-orange-800">{temple.title}</h1>
        {displayLocation && <p className="mt-2 text-slate-600">📍 {displayLocation}</p>}
      </header>

      {temple.image && (
        <div className="mt-6 w-full rounded-lg overflow-hidden shadow-lg">
          <div className="relative h-64 sm:h-96 w-full">
            <Image src={temple.image} alt={temple.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <section className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-orange-700 mb-3">About</h2>
          <p className="text-slate-700 leading-relaxed">{temple.description || 'No description available.'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {temple.deity && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">🕉️ Deity</h3>
              <p className="mt-1 text-slate-700">{temple.deity}</p>
            </div>
          )}

          {temple.city && temple.state && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">📍 Location</h3>
              <p className="mt-1 text-slate-700">{temple.city}, {temple.state}</p>
              {temple.pincode && <p className="text-sm text-slate-600">{temple.pincode}</p>}
              {mapsLink && (
                <a 
                  href={mapsLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm text-orange-600 hover:text-orange-700 hover:underline"
                >
                  🗺️ View on Google Maps
                </a>
              )}
            </div>
          )}

          {temple.templeType && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">🏛️ Temple Type</h3>
              <p className="mt-1 text-slate-700">{temple.templeType}</p>
            </div>
          )}

          {temple.establishedYear && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">📅 Established</h3>
              <p className="mt-1 text-slate-700">{temple.establishedYear}</p>
            </div>
          )}

          {temple.timings && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              <h3 className="font-medium text-slate-800">⏰ Timings</h3>
              <p className="mt-1 text-slate-700">{temple.timings}</p>
            </div>
          )}

          {temple.speciality && (
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100 md:col-span-2">
              <h3 className="font-medium text-slate-800">🌟 Speciality</h3>
              <p className="mt-1 text-slate-700">{temple.speciality}</p>
            </div>
          )}
        </div>

        {mapsLink && (
          <div>
            <h2 className="text-xl font-semibold text-orange-700 mb-3">📍 Location Map</h2>
            <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
              {displayLocation && <p className="text-sm text-slate-600 mb-3">{displayLocation}</p>}
              <a 
                href={mapsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-md"
              >
                🗺️ Open in Google Maps
              </a>
            </div>
          </div>
        )}

        {(temple.phone || temple.email || temple.website) && (
          <div>
            <h2 className="text-xl font-semibold text-orange-700 mb-3">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {temple.phone && (
                <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-slate-800">📞 Phone</h3>
                  <a href={`tel:${temple.phone}`} className="mt-1 text-orange-600 hover:underline">{temple.phone}</a>
                </div>
              )}

              {temple.email && (
                <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-slate-800">📧 Email</h3>
                  <a href={`mailto:${temple.email}`} className="mt-1 text-orange-600 hover:underline">{temple.email}</a>
                </div>
              )}

              {temple.website && (
                <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-slate-800">🌐 Website</h3>
                  <a href={temple.website} target="_blank" rel="noopener noreferrer" className="mt-1 text-orange-600 hover:underline">Visit Website</a>
                </div>
              )}

              {temple.contact && (
                <div className="bg-gradient-to-br from-white to-orange-50/30 p-4 rounded-lg border border-orange-100">
                  <h3 className="font-medium text-slate-800">👤 Contact Person</h3>
                  <p className="mt-1 text-slate-700">{temple.contact}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {(temple.facebook || temple.instagram) && (
          <div>
            <h2 className="text-xl font-semibold text-orange-700 mb-3">Social Media</h2>
            <div className="flex gap-4">
              {temple.facebook && (
                <a href={temple.facebook} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Facebook
                </a>
              )}
              {temple.instagram && (
                <a href={temple.instagram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
