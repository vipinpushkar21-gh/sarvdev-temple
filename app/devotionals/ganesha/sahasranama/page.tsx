import React, { Suspense } from 'react'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'

type NameEntry = {
  id: number
  titleHi: string
  mantraSa: string
  mantraEn: string
  meaningHi?: string
}

const sampleEntries: NameEntry[] = [
  { id: 1, titleHi: 'गणेश्वर', mantraSa: 'ॐ गणेश्वराय नमः।', mantraEn: 'Om Ganeshvaraya Namah.', meaningHi: 'जो सृष्टि के स्वामी हैं' },
  { id: 2, titleHi: 'गणक्रीड', mantraSa: 'ॐ गणक्रीडाय नमः।', mantraEn: 'Om Ganakridaya Namah.', meaningHi: 'जो गणों के साथ क्रीडा करने वाले हैं' },
  { id: 3, titleHi: 'गणनाथ', mantraSa: 'ॐ गणनाथाय नमः।', mantraEn: 'Om Gananathaya Namah.', meaningHi: 'जो गणों के नाथ अथवा स्वामी हैं' },
  { id: 4, titleHi: 'गणाधिप', mantraSa: 'ॐ गणाधिपाय नमः।', mantraEn: 'Om Ganadhipaya Namah.', meaningHi: 'जो आदित्य आदि गणदेवताओं के अधिपति हैं' },
  { id: 5, titleHi: 'एकदंष्ट्र', mantraSa: 'ॐ एकदंष्ट्राय नमः।', mantraEn: 'Om Ekadamshtraya Namah.', meaningHi: 'जो एक दाँत वाले हैं' },
  { id: 6, titleHi: 'वक्रतुण्ड', mantraSa: 'ॐ वक्रतुण्डाय नमः।', mantraEn: 'Om Vakratundaya Namah.', meaningHi: 'जो मुड़ी हुयी सूँड वाले हैं' },
  { id: 7, titleHi: 'गजवक्त्र', mantraSa: 'ॐ गजवक्त्राय नमः।', mantraEn: 'Om Gajavaktraya Namah.', meaningHi: 'जो हाथी के समान मुख वाले हैं' },
  { id: 8, titleHi: 'महोदर', mantraSa: 'ॐ महोदराय नमः।', mantraEn: 'Om Mahodaraya Namah.', meaningHi: 'जो विशाल उदर वाले हैं' },
  { id: 9, titleHi: 'लम्बोदर', mantraSa: 'ॐ लम्बोदराय नमः।', mantraEn: 'Om Lambodaraya Namah.', meaningHi: 'जो लम्बे उदर वाले हैं' },
  { id: 10, titleHi: 'धूम्रवर्ण', mantraSa: 'ॐ धूम्रवर्णाय नमः।', mantraEn: 'Om Dhumravarnaya Namah.', meaningHi: 'जिनकी देह धुएँ के रंग की है' },
  { id: 11, titleHi: 'विकट', mantraSa: 'ॐ विकटाय नमः।', mantraEn: 'Om Vikataya Namah.', meaningHi: 'जो विशाल देह वाले हैं' },
  { id: 12, titleHi: 'विघ्ननाशक', mantraSa: 'ॐ विघ्ननाशकाय नमः।', mantraEn: 'Om Vighnanashakaya Namah.', meaningHi: 'जो विघ्नों का नाश करने वाले हैं' },
  { id: 13, titleHi: 'सुमुख', mantraSa: 'ॐ सुमुखाय नमः।', mantraEn: 'Om Sumukhaya Namah.', meaningHi: 'जो सदैव प्रसन्नचित्त रहने वाले हैं' },
  { id: 14, titleHi: 'दुर्मुख', mantraSa: 'ॐ दुर्मुखाय नमः।', mantraEn: 'Om Durmukhaya Namah.', meaningHi: 'जो चञ्चल मुख वाले हैं' },
  { id: 15, titleHi: 'बुद्ध', mantraSa: 'ॐ बुद्धाय नमः।', mantraEn: 'Om Buddhaya Namah.', meaningHi: 'जो ज्ञानवान एवं चतुर हैं' },
  { id: 16, titleHi: 'विघ्नराज', mantraSa: 'ॐ विघ्नराजाय नमः।', mantraEn: 'Om Vighnarajaya Namah.', meaningHi: 'जो समस्त विघ्नों के स्वामी हैं' },
  { id: 17, titleHi: 'गजानन', mantraSa: 'ॐ गजाननाय नमः।', mantraEn: 'Om Gajananaya Namah.', meaningHi: 'जिनका शीश हाथी का है' },
  { id: 18, titleHi: 'भीम', mantraSa: 'ॐ भीमाय नमः।', mantraEn: 'Om Bhimaya Namah.', meaningHi: 'जो विशाल एवं कठोर हैं' },
  { id: 19, titleHi: 'प्रमोद', mantraSa: 'ॐ प्रमोदाय नमः।', mantraEn: 'Om Pramodaya Namah.', meaningHi: 'जो आनन्ददायक साधन प्रदान करने वाले हैं' },
  { id: 20, titleHi: 'आमोद', mantraSa: 'ॐ आमोदाय नमः।', mantraEn: 'Om Amodaya Namah.', meaningHi: 'जो सदैव उत्साहित रहने वाले हैं' },
]

type SahasranamaFile = {
  title?: string
  count?: number
  names: string[]
}

function loadSahasranama(): SahasranamaFile | null {
  try {
    const p = path.join(process.cwd(), 'data', 'devotionals', 'ganesha_sahasranama.json')
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed.names)) {
        return {
          title: parsed.title,
          count: parsed.count,
          names: parsed.names,
        }
      }
    }
  } catch {
    // ignore parse/read errors and fall back
  }
  return null
}

export default function Page() {
  const fileData = loadSahasranama()
  const totalTarget = fileData?.count ?? 1008
  const currentCount = fileData?.names?.length ?? sampleEntries.length

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/devotionals" className="inline-flex items-center gap-2 font-medium">
          <span>←</span> Back to Devotionals
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold mb-2">{fileData?.title || 'श्री गणेश सहस्रनाम (Ganesh Sahasranama)'}</h1>
      <p className="text-sm text-muted-foreground mb-6">Target: {totalTarget} names • Currently showing: {currentCount} (more to be added)</p>

      <Suspense>
        <section className="bg-background border border-accent rounded-2xl shadow p-6">
          {fileData?.names ? (
            <ol className="list-decimal list-inside space-y-3">
              {fileData.names.map((name, idx) => (
                <li key={idx}>
                  <div className="text-xl">{name}</div>
                </li>
              ))}
            </ol>
          ) : (
            <ol className="list-decimal list-inside space-y-3">
              {sampleEntries.map((n) => (
                <li key={n.id}>
                  <div className="font-semibold text-primary text-lg">{n.titleHi}</div>
                  <div className="text-xl">{n.mantraSa}</div>
                  <div className="text-base text-text">{n.mantraEn}</div>
                  {n.meaningHi && (
                    <div className="text-sm text-muted-foreground">{n.meaningHi}</div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </Suspense>

      <div className="mt-6 text-sm text-muted-foreground">
        पूर्ण 1008 नाम दिखाने के लिए कृपया JSON फ़ाइल साझा करें। मैंने फ़ाइल पथ data/devotionals/ganesha_sahasranama.json सेट किया है — इसमें names की सूची डालते ही यह पेज स्वतः प्रदर्शित करेगा।
      </div>
    </main>
  )
}
