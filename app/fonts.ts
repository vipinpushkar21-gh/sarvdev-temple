import { Inter, Cormorant_Garamond, Noto_Serif_Devanagari, Noto_Sans_Devanagari } from 'next/font/google'

// next/font self-hosts these at build time — no runtime request to fonts.googleapis.com.
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--next-font-inter',
  display: 'swap',
})

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--next-font-cormorant',
  display: 'swap',
})

export const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['600', '700'],
  variable: '--next-font-noto-serif-devanagari',
  display: 'swap',
})

export const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600'],
  variable: '--next-font-noto-sans-devanagari',
  display: 'swap',
})

export const fontVariables = [
  inter.variable,
  cormorantGaramond.variable,
  notoSerifDevanagari.variable,
  notoSansDevanagari.variable,
].join(' ')
