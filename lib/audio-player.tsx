"use client"

import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

export type AudioTrack = {
  id: string
  title: string
  src: string          // URL to audio file or blob URL
  deity?: string
}

type AudioPlayerContextType = {
  track: AudioTrack | null
  playing: boolean
  currentTime: number
  duration: number
  play: (track: AudioTrack) => void
  pause: () => void
  resume: () => void
  stop: () => void
  seek: (time: number) => void
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [track, setTrack] = useState<AudioTrack | null>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    const onTime = () => setCurrentTime(el.currentTime)
    const onMeta = () => setDuration(el.duration || 0)
    const onEnd = () => { setPlaying(false); setCurrentTime(0) }
    el.addEventListener('timeupdate', onTime)
    el.addEventListener('loadedmetadata', onMeta)
    el.addEventListener('ended', onEnd)
    return () => {
      el.removeEventListener('timeupdate', onTime)
      el.removeEventListener('loadedmetadata', onMeta)
      el.removeEventListener('ended', onEnd)
    }
  }, [track])

  const play = useCallback((t: AudioTrack) => {
    setTrack(t)
    setPlaying(true)
    setCurrentTime(0)
    // Wait a tick for React to render audio with new src
    setTimeout(() => {
      audioRef.current?.load()
      audioRef.current?.play().catch(() => {})
    }, 0)
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setPlaying(false)
  }, [])

  const resume = useCallback(() => {
    audioRef.current?.play().catch(() => {})
    setPlaying(true)
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
    setTrack(null)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  return (
    <AudioPlayerContext.Provider value={{ track, playing, currentTime, duration, play, pause, resume, stop, seek, audioRef }}>
      {children}
      {/* Hidden audio element */}
      <audio ref={audioRef} src={track?.src} preload="metadata" />
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext)
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider')
  return ctx
}
