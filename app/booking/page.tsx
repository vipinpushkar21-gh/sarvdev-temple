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
    <main className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-playfair text-orange-600 font-bold">Online Booking</h1>
        <p className="mt-2 text-slate-700 dark:text-slate-200 text-base">Reserve pooja and darshan slots. This is a static demo layout ready for booking integration.</p>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleSlots.map((slot) => (
            <article key={slot.id} className="flex flex-col justify-between bg-white/60 dark:bg-slate-900/60 backdrop-blur rounded-xl p-4 shadow-sm">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{slot.title}</h3>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{slot.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{slot.time}</div>
                  {slot.price && <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{slot.price}</div>}
                </div>

                <button
                  className="ml-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  aria-label={`Book ${slot.title}`}
                >
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

