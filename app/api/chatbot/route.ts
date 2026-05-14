import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

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

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        reply:
          'Pranam 🙏 Abhi AI Guru configure nahi hua hai. Kripya admin se OPENAI_API_KEY set karwayein .env.local mein.',
      })
    }

    const openai = new OpenAI({ apiKey })

    // Convert history to OpenAI format (drop initial bot greeting)
    const validHistory = (history as HistoryItem[]).filter(
      (h, i, arr) => !(h.role === 'bot' && arr.slice(0, i).every(x => x.role === 'bot'))
    )
    const trimmedHistory = validHistory[0]?.role === 'bot' ? validHistory.slice(1) : validHistory

    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...trimmedHistory.map((h) => ({
        role: h.role === 'user' ? 'user' : 'assistant',
        content: h.text,
      })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 600,
      temperature: 0.7,
      top_p: 0.9,
    })

    const reply = completion.choices[0]?.message?.content

    if (!reply) {
      console.error('OpenAI empty response:', JSON.stringify(completion))
      return NextResponse.json({ reply: 'Kripya dobara poochein. 🙏' })
    }

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Chatbot error:', error)
    
    if (error?.status === 401) {
      return NextResponse.json({ reply: 'API key valid nahi hai. Kripya OPENAI_API_KEY check karein. 🙏' })
    }
    if (error?.status === 429) {
      return NextResponse.json({ reply: 'API quota limit cross ho gaya hai. Thodi der baad try karein. 🙏' })
    }
    if (error?.status === 500) {
      return NextResponse.json({ reply: 'OpenAI server issue hai. Kripya dobara try karein. 🙏' })
    }
    
    return NextResponse.json({ reply: 'Kuch error aaya. Kripya dobara try karein. 🙏' })
  }
}
