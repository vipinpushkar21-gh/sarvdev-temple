"use client"

import { useScrollRevealAll } from '../hooks/useScrollReveal'

export default function ScrollRevealInit() {
  useScrollRevealAll('.reveal')
  return null
}
