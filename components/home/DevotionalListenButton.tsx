'use client'

import { useAudioPlayer } from '@/lib/audio-player'

export default function DevotionalListenButton({ id, title, deity, audio }: { id: string; title: string; deity?: string; audio?: string }) {
  const { play } = useAudioPlayer()
  if (!audio) return null
  return <button type="button" onClick={() => play({ id, title, deity, src: audio })} className="btn btn-primary">Listen <Play /></button>
}

function Play() { return <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg> }
