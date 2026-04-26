import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Guru, a wise and compassionate spiritual guide on Sarvdev — a Hindu temple directory and devotional hub.

You help devotees with questions about:
- Hindu deities: Shiva, Vishnu, Brahma, Devi (Durga, Lakshmi, Saraswati), Ganesha, Hanuman, Rama, Krishna, Surya, etc.
- Sacred scriptures: Vedas, Upanishads, Bhagavad Gita, Puranas, Ramayana, Mahabharata
- Temple traditions, puja vidhi, rituals, aarti, prasad
- Festivals: Diwali, Navratri, Holi, Janmashtami, Mahashivratri, Ram Navami, Ganesh Chaturthi, etc.
- Mantras, shlokas, stotras — their meaning and significance
- Spiritual practices, yoga, dhyan (meditation), pranayama
- Panchang, tithi, muhurat, nakshatra
- Sacred places: pilgrimage sites (Char Dham, Jyotirlingas, Shakti Peethas)
- Ayurveda basics, sattvic lifestyle

Guidelines:
- Respond in the same language the user writes in (Hindi/Hinglish or English)
- Be warm, respectful, and knowledgeable — like a gentle pandit or spiritual guide
- Keep answers clear and concise (2-4 paragraphs max)
- For temple queries, suggest they explore the Sarvdev temple directory
- Politely decline non-spiritual topics by redirecting to spiritual matters
- Use Sanskrit terms naturally with brief explanations
- Never be dismissive of any Hindu tradition or sampradaya`

interface HistoryItem {
  role: 'user' | 'bot'
  text: string
}

export async function POST(req: NextRequest) {
  try {
    const { message, history = [] } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        reply:
          'Pranam 🙏 Abhi AI Guru configure nahi hua hai. Kripya admin se GEMINI_API_KEY set karwayein .env.local mein aistudio.google.com se (free hai).',
      })
    }

    // Gemini requires conversation to start with 'user' role — drop leading bot messages
    const validHistory = (history as HistoryItem[]).filter(
      (h, i, arr) => !(h.role === 'bot' && arr.slice(0, i).every(x => x.role === 'bot'))
    )
    // Drop first item if it's still a bot message (initial greeting)
    const trimmedHistory = validHistory[0]?.role === 'bot' ? validHistory.slice(1) : validHistory

    const contents = [
      ...trimmedHistory.map((h) => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ]

    const apiKey = process.env.GEMINI_API_KEY
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: 600,
          temperature: 0.7,
          topP: 0.9,
        },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error(`Gemini API error [${res.status}]:`, JSON.stringify(data))
      if (res.status === 429) {
        return NextResponse.json({ reply: 'Bahut zyada requests aayi hain. 1-2 minute baad dobara try karein. 🙏' })
      }
      if (res.status === 400) {
        return NextResponse.json({ reply: 'Request mein koi samasya hai. Naya sawaal poochein. 🙏' })
      }
      return NextResponse.json({ reply: `Gemini error ${res.status}. Thodi der baad try karein. 🙏` })
    }

    const candidate = data.candidates?.[0]
    const reply = candidate?.content?.parts?.[0]?.text

    if (!reply) {
      console.error('Gemini empty response:', JSON.stringify(data))
      return NextResponse.json({ reply: 'Kripya dobara poochein. 🙏' })
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chatbot error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
