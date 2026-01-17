"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type TextToSpeechProps = {
  text: string;
  lang?: string; // e.g., 'hi-IN', 'en-IN'
  autoPlay?: boolean;
};

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, lang, autoPlay }) => {
  const [supported, setSupported] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useState<number>(0);
  const [rate, setRate] = useState<number>(1);
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);
  const queueIndexRef = useRef<number>(0);

  useEffect(() => {
    const hasAPI = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(hasAPI);
    if (!hasAPI) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      // Try to preselect a voice matching the language
      if (lang && v.length > 0) {
        const idx = v.findIndex((voice) => voice.lang?.toLowerCase().startsWith(lang.toLowerCase().split("-")[0]));
        if (idx >= 0) setVoiceIndex(idx);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [lang]);

  const selectedVoice = useMemo(() => voices[voiceIndex], [voices, voiceIndex]);

  const stopSpeaking = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    utteranceRef.current = null;
    queueRef.current = [];
    queueIndexRef.current = 0;
  };

  const nextChunk = () => {
    if (!supported) return;
    const chunks = queueRef.current;
    const idx = queueIndexRef.current;
    if (!chunks.length || idx >= chunks.length) {
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunks[idx]);
    utterance.rate = rate;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onend = () => {
      queueIndexRef.current += 1;
      if (queueIndexRef.current < chunks.length) {
        nextChunk();
      } else {
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
      }
    };
    utterance.onerror = () => {
      // Skip this chunk on error and continue
      queueIndexRef.current += 1;
      if (queueIndexRef.current < chunks.length) {
        nextChunk();
      } else {
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
      }
    };
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const chunkText = (t: string) => {
    const s = t.trim();
    if (!s) return [];
    // Prefer splitting on double newlines (paragraphs), then on sentence boundaries.
    const paragraphs = s.split(/\n{2,}/).filter(Boolean);
    const chunks: string[] = [];
    paragraphs.forEach((p) => {
      const sentences = p.split(/(?<=[.!?])\s+/);
      let buffer = '';
      sentences.forEach((sent) => {
        if ((buffer + ' ' + sent).length <= 500) {
          buffer = buffer ? buffer + ' ' + sent : sent;
        } else {
          if (buffer) chunks.push(buffer);
          buffer = sent;
        }
      });
      if (buffer) chunks.push(buffer);
    });
    return chunks;
  };

  const startSpeaking = () => {
    if (!supported || !text.trim()) return;
    stopSpeaking();
    queueRef.current = chunkText(text);
    queueIndexRef.current = 0;
    if (queueRef.current.length === 0) return;
    setSpeaking(true);
    setPaused(false);
    nextChunk();
  };

  const pauseSpeaking = () => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setPaused(true);
  };

  const resumeSpeaking = () => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setPaused(false);
  };

  // Auto-play when mounted or when text changes, if enabled
  useEffect(() => {
    if (autoPlay && supported && text.trim()) {
      startSpeaking();
    } else {
      // Stop any previous utterances when text changes and autoplay is not desired
      stopSpeaking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!supported) {
    return (
      <div className="text-sm text-neutral-600 dark:text-neutral-300">
        Text-to-speech is not supported in this browser.
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {!speaking ? (
          <button
            type="button"
            onClick={startSpeaking}
            className="px-3 py-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label="Play text to speech"
          >
            ▶ Play via TTS
          </button>
        ) : paused ? (
          <button
            type="button"
            onClick={resumeSpeaking}
            className="px-3 py-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label="Resume text to speech"
          >
            ▶ Resume
          </button>
        ) : (
          <button
            type="button"
            onClick={pauseSpeaking}
            className="px-3 py-1.5 rounded-full bg-primary-500 text-white hover:bg-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label="Pause text to speech"
          >
            ❚❚ Pause
          </button>
        )}
        {speaking && (
          <button
            type="button"
            onClick={stopSpeaking}
            className="px-3 py-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label="Stop text to speech"
          >
            ■ Stop
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-neutral-700 dark:text-neutral-200">Voice</label>
        <select
          className="px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          value={voiceIndex}
          onChange={(e) => setVoiceIndex(Number(e.target.value))}
          aria-label="Select voice"
        >
          {voices.map((v, i) => (
            <option key={`${v.name}-${i}`} value={i}>
              {v.name} ({v.lang})
            </option>
          ))}
        </select>
        <label className="text-sm text-neutral-700 dark:text-neutral-200">Speed</label>
        <input
          type="range"
          min={0.8}
          max={1.4}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          aria-label="Speech rate"
        />
      </div>
    </div>
  );
};
