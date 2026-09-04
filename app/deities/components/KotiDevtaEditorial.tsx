const VASU = [
  { hi: 'धरा', en: 'Dhara — Earth' },
  { hi: 'अनल', en: 'Anala — Fire' },
  { hi: 'अप', en: 'Apa — Water' },
  { hi: 'अनिल', en: 'Anila — Wind' },
  { hi: 'ध्रुव', en: 'Dhruva — Pole Star' },
  { hi: 'सोम', en: 'Soma — Moon' },
  { hi: 'प्रत्यूष', en: 'Pratyusha — Dawn' },
  { hi: 'प्रभास', en: 'Prabhasa — Sky' },
]

const RUDRA = [
  { hi: 'कपाली', en: 'Kapali' },
  { hi: 'पिंगल', en: 'Pingala' },
  { hi: 'भीम', en: 'Bheema' },
  { hi: 'विरूपाक्ष', en: 'Virupaksha' },
  { hi: 'विलोहित', en: 'Vilohita' },
  { hi: 'अजपाद', en: 'Ajapaada' },
  { hi: 'अहिर्बुध्न्य', en: 'Ahirbudhnya' },
  { hi: 'शम्भु', en: 'Shambhu' },
  { hi: 'चण्ड', en: 'Chanda' },
  { hi: 'भव', en: 'Bhava' },
  { hi: 'महादेव', en: 'Mahadeva' },
]

const ADITYA = [
  { hi: 'विवस्वान', en: 'Vivasvan' },
  { hi: 'अर्यमा', en: 'Aryama' },
  { hi: 'पूषा', en: 'Pusha' },
  { hi: 'त्वष्टा', en: 'Tvashta' },
  { hi: 'सविता', en: 'Savita' },
  { hi: 'भग', en: 'Bhaga' },
  { hi: 'धाता', en: 'Dhata' },
  { hi: 'विधाता', en: 'Vidhata' },
  { hi: 'वरुण', en: 'Varuna' },
  { hi: 'मित्र', en: 'Mitra' },
  { hi: 'इन्द्र', en: 'Indra' },
  { hi: 'विष्णु', en: 'Vishnu (Trivikrama)' },
]

const GROUPS = [
  { count: '08', hi: 'अष्ट वसु', en: 'Ashta Vasu', note: 'Elements of nature that sustain life', items: VASU },
  { count: '11', hi: 'एकादश रुद्र', en: 'Ekadash Rudra', note: 'The eleven forms of Rudra', items: RUDRA },
  { count: '12', hi: 'द्वादश आदित्य', en: 'Dwadash Aditya', note: 'Solar deities, the sons of Aditi', items: ADITYA },
  { count: '01', hi: 'इन्द्र', en: 'Indra', note: 'King of the devas, wielder of the Vajra', items: [] },
  { count: '01', hi: 'प्रजापति', en: 'Prajapati', note: 'Lord of all creatures, the progenitor', items: [] },
]

/** Editorial explainer. Not database content — this is reference scripture material. */
export default function KotiDevtaEditorial() {
  return (
    <section className="border-t border-surface-border bg-surface-raised py-section-sm">
      <div className="page-container">
        <div className="max-w-3xl">
          <p className="text-overline font-semibold uppercase tracking-[0.14em] text-primary">From the scriptures</p>
          <h2 className="mt-2 font-display text-h1 text-secondary-800">
            ३३ कोटि देवता <span className="text-ink-muted">— the thirty-three types</span>
          </h2>
          <p className="mt-4 text-body text-ink-muted">
            <span className="font-devanagari">कोटि</span> means <em>type</em>, not <em>crore</em>. In the Brihadaranyaka
            Upanishad (3.9.1–9), Rishi Yajnavalkya counts thirty-three devas, grouped as below — and it is these
            thirty-three who manifest in the countless forms worshipped today.
          </p>
        </div>

        <dl className="mt-9 divide-y divide-surface-border border-y border-surface-border">
          {GROUPS.map((group) => (
            <div key={group.en} className="grid gap-2 py-5 sm:grid-cols-[6rem_14rem_minmax(0,1fr)] sm:gap-6">
              <dt className="font-display text-h3 leading-none text-primary">{group.count}</dt>
              <div>
                <p className="font-devanagari text-body font-semibold text-secondary-800">{group.hi}</p>
                <p className="text-caption uppercase tracking-[0.12em] text-ink-muted">{group.en}</p>
              </div>
              <dd className="text-body-sm text-ink-muted">
                <p>{group.note}</p>
                {group.items.length > 0 && (
                  <p className="mt-1.5 font-devanagari text-ink">
                    {group.items.map((item) => item.hi).join(' · ')}
                  </p>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 text-body-sm text-ink-muted">
          8 Vasu + 11 Rudra + 12 Aditya + 1 Indra + 1 Prajapati = 33
        </p>
      </div>
    </section>
  )
}
