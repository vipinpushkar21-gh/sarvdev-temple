import Hero from '../../components/Hero'
export const metadata = { title: 'Booking' }

type Slot = {
  id: string
  title: string
  description: string
  time: string
  price?: string
}

const sampleSlots: Slot[] = [
  { id: 's1', title: 'Morning Aarti Slot', description: 'Morning aarti and blessing (30 mins)', time: '06:00 AM - 06:30 AM', price: 'Free' },
  { id: 's2', title: 'Special Pooja', description: 'Conduct a special pooja with priest (45 mins)', time: '10:00 AM - 10:45 AM', price: '$15' },
  { id: 's3', title: 'Evening Aarti', description: 'Evening aarti with lamps and bhajans (30 mins)', time: '07:00 PM - 07:30 PM', price: 'Free' },
  { id: 's4', title: 'Archana', description: 'One-on-one archana and prasadam (20 mins)', time: '05:00 PM - 05:20 PM', price: '$8' },
]

export default function BookingPage() {
  return (
    <>
      <Hero title="Online Booking" subtitle="Reserve pooja and darshan slots at your favourite temples." />
      <main className="page-container section-sm">

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleSlots.map((slot) => (
            <article key={slot.id} className="group card-interactive flex flex-col justify-between overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-h4 font-serif text-secondary-700 group-hover:text-primary-600 transition-colors">{slot.title}</h3>
                  {slot.price && (
                    <span className={`flex-shrink-0 text-body-sm font-bold px-2.5 py-1 rounded-full ${slot.price === 'Free' ? 'bg-green-50 text-semantic-success' : 'bg-primary-50 text-primary-700'}`}>
                      {slot.price}
                    </span>
                  )}
                </div>
                <p className="text-body-sm text-ink-muted">{slot.description}</p>

                <div className="mt-3 inline-flex items-center gap-1.5 text-caption text-ink-muted bg-surface-sunken px-2.5 py-1 rounded-full">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {slot.time}
                </div>
              </div>

              <div className="px-5 pb-5">
                <button
                  className="btn btn-primary w-full group/btn"
                  aria-label={`Book ${slot.title}`}
                >
                  Book Now
                  <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      </main>
    </>
  )
}

