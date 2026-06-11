"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CalendarDays,
  Landmark,
  MapPinned,
  Music2,
  Radio,
  Search,
  Sparkles,
  Sun,
  UsersRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import SmartSearch from './SmartSearch'

type HeroStats = {
  temples: number
  devotionals: number
  categories: number
}

type EcosystemNode = {
  label: string
  hint: string
  href: string
  icon: LucideIcon
  position: { x: number; y: number }
  tone: string
}

type SacredEcosystemHeroProps = {
  stats?: HeroStats
}

const ecosystemNodes: EcosystemNode[] = [
  {
    label: 'Temples',
    hint: 'Sacred places',
    href: '/temples',
    icon: Landmark,
    position: { x: 50, y: 14 },
    tone: 'from-primary-300 to-temple-gold-light',
  },
  {
    label: 'Deities',
    hint: 'Divine forms',
    href: '/deities',
    icon: Sparkles,
    position: { x: 80, y: 28 },
    tone: 'from-accent-300 to-primary-300',
  },
  {
    label: 'Devotionals',
    hint: 'Mantra, aarti, bhajan',
    href: '/devotionals',
    icon: Music2,
    position: { x: 90, y: 54 },
    tone: 'from-temple-gold-light to-accent-300',
  },
  {
    label: 'Panchang',
    hint: 'Daily guidance',
    href: '/panchang',
    icon: Sun,
    position: { x: 80, y: 78 },
    tone: 'from-primary-200 to-accent-300',
  },
  {
    label: 'Festivals',
    hint: 'Sacred calendar',
    href: '/events',
    icon: CalendarDays,
    position: { x: 50, y: 86 },
    tone: 'from-maroon-300 to-primary-300',
  },
  {
    label: 'Daily Darshan',
    hint: 'Live temple moments',
    href: '/daily-darshan',
    icon: Radio,
    position: { x: 20, y: 78 },
    tone: 'from-primary-300 to-accent-300',
  },
  {
    label: 'Spiritual Icons',
    hint: 'Saints, gurus, artists',
    href: '/spiritual-icons',
    icon: UsersRound,
    position: { x: 10, y: 54 },
    tone: 'from-sandstone-300 to-temple-gold-light',
  },
  {
    label: 'Pilgrimages',
    hint: 'Yatra circuits',
    href: '/sacred-categories',
    icon: MapPinned,
    position: { x: 20, y: 28 },
    tone: 'from-accent-300 to-primary-400',
  },
]

const auraParticles = [
  { left: '11%', top: '18%', delay: 0.1 },
  { left: '18%', top: '72%', delay: 0.9 },
  { left: '27%', top: '10%', delay: 1.5 },
  { left: '36%', top: '86%', delay: 0.4 },
  { left: '48%', top: '7%', delay: 1.1 },
  { left: '58%', top: '90%', delay: 0.7 },
  { left: '69%', top: '15%', delay: 1.8 },
  { left: '78%', top: '78%', delay: 0.2 },
  { left: '88%', top: '35%', delay: 1.3 },
  { left: '8%', top: '48%', delay: 1.9 },
  { left: '92%', top: '58%', delay: 0.6 },
  { left: '43%', top: '50%', delay: 1.6 },
]

function formatStat(value?: number) {
  if (!value) return 'Growing'
  if (value >= 1000) return `${Math.round(value / 100) / 10}k+`
  return `${value.toLocaleString()}+`
}

export default function SacredEcosystemHero({ stats }: SacredEcosystemHeroProps) {
  const statCards = [
    { value: formatStat(stats?.temples), label: 'Temple guide' },
    { value: '8', label: 'Sacred hubs' },
    { value: formatStat(stats?.devotionals), label: 'Devotional library' },
  ]

  return (
    <section className="relative isolate bg-[#140b07] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(255,153,51,0.22),transparent_34%),radial-gradient(circle_at_80%_28%,rgba(255,215,0,0.14),transparent_30%),linear-gradient(135deg,#160b07_0%,#32160d_45%,#130806_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-temple-gold-light/70 to-transparent" />

      <div className="page-container relative grid min-h-[calc(100vh-5rem)] items-start gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,1.08fr)] lg:gap-8 lg:py-16 xl:py-18">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="inline-flex items-center gap-2 rounded-full border border-temple-gold-light/25 bg-white/[0.07] px-4 py-2 text-caption font-semibold text-temple-gold-light shadow-[0_0_40px_rgba(255,153,51,0.10)] backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Sarvdev Sacred Ecosystem
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mt-7 font-display text-[2.7rem] leading-[1.08] text-white sm:text-[3.45rem] lg:text-[3.9rem]"
          >
            One sacred home for every devotional journey.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mt-5 space-y-3"
          >
            <p className="font-devanagari text-[1.28rem] leading-8 text-accent-100 sm:text-[1.55rem]">
              मंदिर, देवता, दर्शन और भक्ति का एक दिव्य डिजिटल संसार
            </p>
            <p className="max-w-2xl text-body text-sandstone-200">
              Explore temples, deities, daily darshan, panchang, festivals, devotionals, spiritual icons and pilgrimages through one living sacred network.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.24 }}
            className="relative z-[60] mt-8 rounded-card border border-white/10 bg-white/[0.08] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:p-4"
          >
            <div className="mb-3 flex items-center gap-2 px-1 text-caption font-semibold uppercase text-temple-gold-light">
              <Search className="h-4 w-4" aria-hidden="true" />
              Search the sacred network
            </div>
            <SmartSearch />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.32 }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <Link
              href="/temples"
              className="btn btn-lg rounded-btn bg-gradient-to-r from-primary-400 to-accent-300 text-secondary-900 shadow-divine hover:brightness-110"
            >
              Explore Temples
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/daily-darshan"
              className="btn btn-lg rounded-btn border border-white/20 bg-white/[0.08] text-white backdrop-blur-md hover:border-temple-gold-light/50 hover:bg-white/[0.13]"
            >
              <Radio className="h-4 w-4" aria-hidden="true" />
              Watch Daily Darshan
            </Link>
            <Link
              href="/panchang"
              className="btn btn-lg rounded-btn border border-white/20 bg-transparent text-sandstone-100 hover:border-primary-300/50 hover:bg-primary-300/10"
            >
              <Sun className="h-4 w-4" aria-hidden="true" />
              Panchang Today
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            className="mt-9 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="rounded-card border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur-md"
              >
                <div className="font-display text-h3 text-accent-200">{stat.value}</div>
                <div className="mt-1 text-caption font-semibold uppercase text-sandstone-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18 }}
          className="relative mx-auto w-full max-w-[560px] self-start lg:mt-6 lg:max-w-[600px] lg:justify-self-end xl:max-w-[620px]"
          aria-label="Interactive Sarvdev sacred ecosystem navigation"
        >
          <div className="relative aspect-square w-full overflow-visible rounded-[2rem] border border-white/10 bg-white/[0.05] p-[7%] shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.16),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))]" />

            {auraParticles.map((particle, index) => (
              <motion.span
                key={`${particle.left}-${particle.top}`}
                className="absolute h-1.5 w-1.5 rounded-full bg-accent-200/75 shadow-[0_0_14px_rgba(255,215,0,0.75)]"
                style={{ left: particle.left, top: particle.top }}
                animate={{ opacity: [0.2, 0.85, 0.2], scale: [0.7, 1.15, 0.7] }}
                transition={{ duration: 3.8, repeat: Infinity, delay: particle.delay + index * 0.03 }}
              />
            ))}

            <motion.div
              className="absolute inset-[13%] rounded-full border border-temple-gold-light/18"
              animate={{ scale: [1, 1.025, 1], opacity: [0.52, 0.82, 0.52] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute inset-[22%] rounded-full border border-primary-300/18"
              animate={{ scale: [1.02, 0.99, 1.02], opacity: [0.38, 0.68, 0.38] }}
              transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-[31%] rounded-full border border-white/10 bg-white/[0.03]" />

            <svg className="absolute inset-[7%] h-[86%] w-[86%]" viewBox="0 0 100 100" aria-hidden="true">
              <defs>
                <radialGradient id="sacredLineGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity="0.58" />
                  <stop offset="100%" stopColor="#FF9933" stopOpacity="0.08" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,215,0,0.14)" strokeWidth="0.45" strokeDasharray="1.4 2.8" />
              {ecosystemNodes.map((node, index) => {
                return (
                  <motion.line
                    key={node.label}
                    x1="50"
                    y1="50"
                    x2={node.position.x}
                    y2={node.position.y}
                    stroke="url(#sacredLineGlow)"
                    strokeWidth="0.62"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0.24, 0.55, 0.24] }}
                    transition={{ duration: 3.6, repeat: Infinity, delay: index * 0.12 }}
                  />
                )
              })}
            </svg>

            <motion.div
              className="absolute left-1/2 top-1/2 z-20 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-accent-200/35 bg-[#1b0d08]/80 text-center shadow-[0_0_60px_rgba(255,153,51,0.22),inset_0_0_36px_rgba(255,215,0,0.10)] backdrop-blur-md"
              animate={{ boxShadow: ['0 0 42px rgba(255,153,51,0.18)', '0 0 72px rgba(255,215,0,0.28)', '0 0 42px rgba(255,153,51,0.18)'] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="font-devanagari text-[2rem] leading-none text-accent-100 sm:text-[2.45rem]">ॐ</div>
              <div className="mt-2 text-[10px] font-semibold uppercase text-temple-gold-light sm:text-caption">
                Sarvdev Core
              </div>
            </motion.div>

            <div className="absolute inset-[7%]">
              {ecosystemNodes.map((node, index) => {
                const Icon = node.icon

                return (
                  <div
                    key={node.label}
                    className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${node.position.x}%`,
                      top: `${node.position.y}%`,
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, index % 2 === 0 ? -4 : 4, 0] }}
                      transition={{ duration: 4.4 + index * 0.12, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Link
                        href={node.href}
                        aria-label={`Open ${node.label}`}
                        className="group flex w-[5rem] flex-col items-center gap-1 rounded-card border border-white/10 bg-[#211008]/80 p-2 text-center text-white shadow-[0_12px_34px_rgba(0,0,0,0.30)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent-200/60 hover:bg-[#30160c]/90 hover:text-white sm:w-[6.9rem] sm:p-3"
                      >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${node.tone} text-secondary-900 shadow-[0_0_24px_rgba(255,215,0,0.22)] transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11`}>
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                        </span>
                        <span className="text-[10px] font-semibold leading-tight text-accent-50 sm:text-caption">
                          {node.label}
                        </span>
                        <span className="hidden text-[10px] leading-tight text-sandstone-300 sm:block">
                          {node.hint}
                        </span>
                      </Link>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-surface to-transparent" />
    </section>
  )
}
