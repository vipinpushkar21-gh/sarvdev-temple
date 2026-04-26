"use client"

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'bot'
  text: string
}

const SUGGESTIONS = [
  'Ram Navami kab hai?',
  'Gayatri Mantra ka arth?',
  'Ganesha puja vidhi',
  'Mahashivratri ka mahatva',
]

export default function SpiritualChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Pranam 🙏 Main Guru hoon — aapka adhyatmik saathi. Kuch poochna hai mantra, puja, temple ya festival ke baare mein?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open, messages])

  async function send(text: string) {
    const msg = text.trim()
    if (!msg || loading) return
    setInput('')
    const history = messages.slice(-10)
    setMessages(m => [...m, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      })
      const data = await res.json()
      setMessages(m => [...m, { role: 'bot', text: data.reply || 'Kripya dobara poochein. 🙏' }])
    } catch {
      setMessages(m => [...m, { role: 'bot', text: 'Network error. Kripya dobara try karein.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(s => !s)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #FF9933, #D4AF37)' }}
        aria-label="Spiritual Chatbot"
        title="Guru — Adhyatmik Saathi"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl leading-none select-none">ॐ</span>
        )}
        {!open && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[min(90vw,380px)] flex flex-col rounded-3xl shadow-2xl overflow-hidden transition-all duration-400 origin-bottom-right ${
          open ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
        style={{ height: '520px', background: 'var(--color-surface-raised, #fff)', border: '1px solid rgba(255,153,51,0.2)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 shrink-0" style={{ background: 'linear-gradient(135deg, #9B1C1C, #7B1515)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0" style={{ background: 'linear-gradient(135deg, #FF9933, #D4AF37)' }}>
            ॐ
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">Guru — Adhyatmik Saathi</p>
            <p className="text-[11px] text-white/60">Powered by AI · Hindi & English</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-white/60">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'bot' && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mr-2 mt-0.5" style={{ background: 'linear-gradient(135deg, #FF9933, #D4AF37)' }}>ॐ</div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'text-gray-800 rounded-bl-sm'
                }`}
                style={
                  msg.role === 'user'
                    ? { background: 'linear-gradient(135deg, #FF9933, #E67E22)' }
                    : { background: '#F9F7F4', border: '1px solid rgba(0,0,0,0.06)' }
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mr-2" style={{ background: 'linear-gradient(135deg, #FF9933, #D4AF37)' }}>ॐ</div>
              <div className="px-4 py-2.5 rounded-2xl rounded-bl-sm" style={{ background: '#F9F7F4', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions (show only on first message) */}
        {messages.length === 1 && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="text-[11px] px-3 py-1.5 rounded-full border transition-colors"
                style={{ borderColor: 'rgba(255,153,51,0.4)', color: '#9B1C1C', background: 'rgba(255,153,51,0.06)' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="shrink-0 px-3 py-3 border-t border-surface-border flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Kuch poochein... (Hindi ya English)"
            className="flex-1 px-4 py-2.5 rounded-2xl border border-surface-border bg-surface text-[13px] text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #FF9933, #D4AF37)' }}
            aria-label="Send"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
