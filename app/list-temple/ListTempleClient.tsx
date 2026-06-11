"use client"

import { useMemo, useRef, useState } from "react"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Camera,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Gift,
  HeartHandshake,
  Image as ImageIcon,
  Landmark,
  Languages,
  ListChecks,
  Loader2,
  MapPin,
  Megaphone,
  Phone,
  Plus,
  RefreshCcw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react"
import SarvdevImage from "../../components/SarvdevImage"
import { isAllowedImageHost } from "../../lib/imageGuard"
import { getTempleCardImage, getTempleHeroImage } from "../../lib/temple-image"
import { useTranslation } from "../../lib/translation"
import { getGroupedCategories } from "../../lib/sacred-categories"

type FormState = {
  name: string
  location: string
  mapsLink: string
  city: string
  state: string
  country: string
  pincode: string
  description: string
  descriptionHi: string
  deity: string
  establishedYear: string
  templeType: string
  speciality: string
  categories: string[]
  imageUrl: string
  contact: string
  phone: string
  email: string
  website: string
  facebook: string
  instagram: string
  submitterName: string
  submitterEmail: string
}

type Festival = { name: string; description: string }
type ErrorKey = keyof FormState | "timings"
type FaqItem = { question: string; answer: string }

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh",
]

const countries = [
  "India", "Nepal", "Sri Lanka", "Bangladesh", "Bhutan", "Myanmar", "Thailand",
  "Indonesia", "Malaysia", "Singapore", "Cambodia", "Vietnam", "USA", "UK",
  "Canada", "Australia", "New Zealand", "South Africa", "UAE", "Other",
]

const deities = [
  "Shiva", "Vishnu", "Durga", "Ganesha", "Hanuman", "Krishna", "Rama",
  "Lakshmi", "Saraswati", "Kali", "Murugan", "Brahma", "Other",
]

const templeTypes = ["North Indian", "South Indian", "Modern", "Ancient", "Cave Temple", "Hill Temple"]
const sacredCategoryGroups = getGroupedCategories()

const emptyForm = (): FormState => ({
  name: "",
  location: "",
  mapsLink: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  description: "",
  descriptionHi: "",
  deity: "",
  establishedYear: "",
  templeType: "",
  speciality: "",
  categories: [],
  imageUrl: "",
  contact: "",
  phone: "",
  email: "",
  website: "",
  facebook: "",
  instagram: "",
  submitterName: "",
  submitterEmail: "",
})

const trustBadges: Array<{ title: string; text: string; icon: LucideIcon; tone: string }> = [
  { title: "Community Verified", text: "Reviewed by Sarvdev before publication", icon: ShieldCheck, tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  { title: "Free Listing", text: "No fee for public temple submissions", icon: Gift, tone: "bg-amber-50 text-amber-900 border-amber-200" },
  { title: "Review Before Publish", text: "Pending status protects listing quality", icon: SearchCheck, tone: "bg-sky-50 text-sky-900 border-sky-200" },
  { title: "Helps Devotees", text: "Make darshan details easier to find", icon: HeartHandshake, tone: "bg-rose-50 text-rose-900 border-rose-200" },
]

const journey = [
  { title: "Add temple details", hi: "मंदिर की मूल जानकारी जोड़ें", icon: Landmark },
  { title: "Add location and timings", hi: "स्थान और दर्शन समय लिखें", icon: MapPin },
  { title: "Upload temple image", hi: "मंदिर की साफ तस्वीर जोड़ें", icon: Camera },
  { title: "Submit for review", hi: "समीक्षा के लिए भेजें", icon: ClipboardCheck },
  { title: "Admin verifies and publishes", hi: "एडमिन सत्यापित करके प्रकाशित करता है", icon: BadgeCheck },
]

const benefits = [
  { title: "Reach devotees", text: "Help local and visiting devotees discover the temple.", icon: HeartHandshake, tone: "bg-rose-50 text-rose-800" },
  { title: "Preserve temple history", text: "Record local stories, origin, speciality, and sacred context.", icon: BookOpenCheck, tone: "bg-stone-100 text-stone-800" },
  { title: "Promote festivals", text: "Add key celebrations so pilgrims can plan important visits.", icon: Megaphone, tone: "bg-amber-50 text-amber-900" },
  { title: "Add darshan and timings", text: "Share morning, evening, and special darshan windows clearly.", icon: Clock3, tone: "bg-emerald-50 text-emerald-800" },
  { title: "Help pilgrims find it", text: "City, state, pincode, and Maps links make the visit easier.", icon: MapPin, tone: "bg-sky-50 text-sky-900" },
]

const guidelines = [
  "Submit public, accurate temple information only.",
  "Use a clear temple image owned by you or available for public use.",
  "Avoid promotional claims that cannot be verified.",
  "Mention special darshan rules, closures, or festival crowd guidance when known.",
  "Sarvdev may edit formatting or contact the submitter during review.",
]

const checklist = [
  "Temple name, main deity, and short description",
  "City, state, country, and a Google Maps link if available",
  "Darshan timings or opening hours",
  "Temple image or permission to add one later",
  "Festival names and contact details if publicly shareable",
]

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function isValidMapsUrl(value: string) {
  if (!value.trim()) return true
  if (!isValidHttpUrl(value)) return false
  const host = new URL(value.trim()).hostname.toLowerCase()
  return host === "maps.app.goo.gl" || host.endsWith(".google.com") || host.includes("google.") || host.endsWith("goo.gl")
}

function isValidImageUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return true
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) return false
  return isAllowedImageHost(trimmed)
}

export default function ListTempleClient({ faqs }: { faqs: FaqItem[] }) {
  const { language } = useTranslation()
  const hi = language === "hi"
  const [form, setForm] = useState<FormState>(emptyForm())
  const [timingSlots, setTimingSlots] = useState<string[]>([""])
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState("")
  const [formError, setFormError] = useState("")
  const imageInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  const filledSlots = useMemo(() => timingSlots.map((slot) => slot.trim()).filter(Boolean), [timingSlots])
  const requiredDone = [
    Boolean(form.name.trim()),
    Boolean(form.city.trim() && form.state.trim()),
    Boolean(filledSlots.length),
    Boolean(form.description.trim()),
  ].filter(Boolean).length
  const progress = Math.round((requiredDone / 4) * 100)
  const readyToSubmit = requiredDone === 4
  const previewImage = getTempleCardImage({ imageCard: form.imageUrl, image: form.imageUrl })

  const labels = {
    required: hi ? "आवश्यक" : "Required",
    optional: hi ? "वैकल्पिक" : "Optional",
    startForm: hi ? "फॉर्म शुरू करें" : "Start Submission Form",
    submitBtn: hi ? "मंदिर समीक्षा के लिए भेजें" : "Submit for Review",
    submitting: hi ? "जमा हो रहा है..." : "Submitting...",
  }

  function validate(): boolean {
    const e: Partial<Record<ErrorKey, string>> = {}
    if (!form.name.trim()) e.name = "Temple name is required"
    if (!form.city.trim()) e.city = "City is required"
    if (!form.state.trim()) e.state = "State is required"
    if (!form.description.trim() || form.description.trim().length < 20) e.description = "Description is required (minimum 20 characters)"
    if (!filledSlots.length) e.timings = "At least one timing slot is required"
    if (form.email.trim() && !isValidEmail(form.email)) e.email = "Enter a valid temple email"
    if (form.submitterEmail.trim() && !isValidEmail(form.submitterEmail)) e.submitterEmail = "Enter a valid submitter email"
    if (form.mapsLink.trim() && !isValidMapsUrl(form.mapsLink)) e.mapsLink = "Enter a valid Google Maps URL"
    if (form.phone.trim() && !/^\+?[0-9\-()\s]{6,}$/.test(form.phone)) e.phone = "Enter a valid phone number"
    if (form.imageUrl.trim() && !isValidImageUrl(form.imageUrl)) e.imageUrl = "Use a Cloudinary or local Sarvdev image URL, or upload an image"
    setErrors(e)

    if (Object.keys(e).length > 0) {
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }

    return Object.keys(e).length === 0
  }

  function onChange<K extends keyof FormState>(key: K, value: string) {
    setForm((state) => ({ ...state, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setFormError("")
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are allowed")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError("Image must be under 10MB")
      return
    }

    setImageError("")
    setUploadingImage(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "sarvdev/temples")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (res.ok && isValidImageUrl(data.url || "")) {
        setForm((state) => ({ ...state, imageUrl: data.url }))
        setErrors((prev) => ({ ...prev, imageUrl: undefined }))
      } else {
        setImageError(data.error || "Upload failed. You can submit without an image and Sarvdev can add one later.")
      }
    } catch {
      setImageError("Network error. You can paste a Cloudinary image URL or submit without an image.")
    } finally {
      setUploadingImage(false)
      if (imageInputRef.current) imageInputRef.current.value = ""
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(false)
    setFormError("")
    if (!validate()) return

    setLoading(true)
    try {
      const image = form.imageUrl.trim()
      const res = await fetch("/api/temples", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.name.trim(),
          location: [form.location, form.city, form.state, form.country, form.pincode ? `- ${form.pincode}` : ""].filter(Boolean).join(", "),
          mapsLink: form.mapsLink.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country,
          pincode: form.pincode.trim(),
          description: form.description.trim(),
          descriptionHi: form.descriptionHi.trim(),
          deity: form.deity,
          establishedYear: form.establishedYear.trim(),
          templeType: form.templeType,
          speciality: form.speciality.trim(),
          categories: form.categories,
          image,
          imageCard: image,
          imageHero: image,
          timings: filledSlots.join(", "),
          timingSlots: filledSlots,
          festivals: festivals.filter((festival) => festival.name.trim()),
          contact: form.contact.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          website: form.website.trim(),
          facebook: form.facebook.trim(),
          instagram: form.instagram.trim(),
          submittedBy: form.submitterName.trim(),
          submitterEmail: form.submitterEmail.trim(),
          dataQuality: "C",
          status: "pending",
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setForm(emptyForm())
        setTimingSlots([""])
        setFestivals([])
        requestAnimationFrame(() => successRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
      } else {
        const data = await res.json().catch(() => null)
        setFormError(data?.error || "Failed to submit temple. Please try again.")
      }
    } catch {
      setFormError("Network error. Please check your connection and try again.")
    } finally {
      setLoading(false)
    }
  }

  function submitAnother() {
    setSubmitted(false)
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }

  return (
    <main className="bg-surface">
      <section className="relative min-h-[680px] overflow-hidden bg-stone-950 text-white">
        <SarvdevImage
          image={getTempleHeroImage({})}
          alt="Temple courtyard at golden hour"
          className="absolute inset-0 opacity-60"
          imgClassName="object-cover"
          loading="eager"
          renderMode="cinematic-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-stone-950/35" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-surface to-transparent" />

        <div className="page-container relative z-10 flex min-h-[680px] flex-col justify-end pb-16 pt-24">
          <div className="max-w-5xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-amber-200/25 bg-amber-300/15 px-3 py-2 text-sm font-bold text-amber-100 backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Submit Temple
            </div>
            <p className="devanagari text-xl font-semibold text-amber-100">अपना मंदिर Sarvdev पर जोड़ें</p>
            <h1 className="mt-3 max-w-4xl text-[clamp(2.75rem,7vw,6.5rem)] font-black leading-none text-white">
              Submit Your Temple to Sarvdev
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100">
              Share verified temple details, darshan timings, festivals, images, and contact information so devotees can discover and visit with confidence.
            </p>
            <p className="devanagari mt-2 max-w-2xl text-base leading-7 text-amber-100/90">
              सही जानकारी भक्तों को मंदिर तक पहुंचने, दर्शन समय जानने और उत्सवों की योजना बनाने में मदद करती है।
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#submission-form" className="btn btn-primary rounded-lg px-5 py-3 text-sm no-underline hover:no-underline">
                <ClipboardCheck className="h-4 w-4" />
                {labels.startForm}
              </a>
              <a href="#submission-journey" className="btn rounded-lg border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
                <ListChecks className="h-4 w-4" />
                Review Steps
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {trustBadges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div key={badge.title} className={`rounded-lg border px-4 py-3 backdrop-blur ${badge.tone}`}>
                    <Icon className="h-5 w-5" />
                    <p className="mt-2 text-sm font-black leading-tight">{badge.title}</p>
                    <p className="mt-1 text-xs leading-5 opacity-80">{badge.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="submission-journey" className="page-container -mt-10 relative z-20">
        <div className="grid gap-3 rounded-lg border border-amber-200 bg-white p-4 shadow-xl md:grid-cols-5">
          {journey.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="rounded-lg bg-gradient-to-br from-orange-50 to-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-orange-700 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-black text-orange-700">0{index + 1}</span>
                </div>
                <p className="mt-4 text-sm font-black text-stone-950">{step.title}</p>
                <p className="devanagari mt-1 text-xs leading-5 text-stone-600">{step.hi}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="page-container py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-10">
            <SectionHeader
              eyebrow="Why Submit"
              title="A living directory for devotees and temple communities"
              description="Every complete submission improves discovery, visit planning, and preservation of sacred local knowledge."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon
                return (
                  <div key={benefit.title} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${benefit.tone}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-xl font-black text-stone-950">{benefit.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{benefit.text}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <InfoPanel icon={ShieldCheck} title="Submission Guidelines" items={guidelines} />
              <InfoPanel icon={FileCheck2} title="Required Info Checklist" items={checklist} />
            </div>
          </div>

          <aside className="self-start rounded-lg border border-orange-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm font-black text-orange-700">Before you begin</p>
            <h2 className="mt-2 text-2xl font-black text-stone-950">Keep these details ready</h2>
            <div className="mt-4 space-y-3">
              {["Temple name", "City and state", "Darshan timings", "Short history", "Image or image permission"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                  <span className="text-sm font-semibold text-stone-700">{item}</span>
                </div>
              ))}
            </div>
            <a href="#submission-form" className="btn btn-primary mt-5 w-full rounded-lg text-sm no-underline hover:no-underline">
              Start Form
              <ArrowRight className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </section>

      {submitted && (
        <section ref={successRef} id="submission-success" className="page-container pb-10">
          <div className="overflow-hidden rounded-lg border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-3xl font-black text-stone-950">Temple submitted for review</h2>
                <p className="devanagari mt-2 text-base font-semibold text-emerald-900">धन्यवाद। आपका मंदिर Sarvdev समीक्षा कतार में जोड़ दिया गया है।</p>
                <p className="mt-3 text-base leading-7 text-stone-700">
                  Our admin team will verify the details, check image safety, and publish the temple only after review. Expected review time is usually 2 to 3 business days.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 md:min-w-[360px] md:grid-cols-1">
                <Link href="/temples" className="btn btn-primary rounded-lg text-sm no-underline hover:no-underline">
                  Browse Temples
                </Link>
                <button type="button" onClick={submitAnother} className="btn btn-outline rounded-lg text-sm">
                  <RefreshCcw className="h-4 w-4" />
                  Submit Another
                </button>
                <Link href="/contact" className="btn btn-outline rounded-lg text-sm no-underline hover:no-underline">
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="submission-form" className="page-container pb-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-orange-700">Temple Submission Form</p>
                  <h2 className="mt-1 text-3xl font-black text-stone-950">Share the temple for review</h2>
                  <p className="devanagari mt-2 text-sm leading-6 text-stone-600">सभी आवश्यक जानकारी भरें। वैकल्पिक जानकारी समीक्षा को तेज कर सकती है।</p>
                </div>
                <div className="min-w-[150px] rounded-lg bg-stone-50 p-3">
                  <div className="flex items-center justify-between text-sm font-black text-stone-900">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-stone-200">
                    <div className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-emerald-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {formError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
                <CircleAlert className="h-5 w-5 shrink-0" />
                {formError}
              </div>
            )}

            <FormSection icon={Landmark} title={hi ? "मूल जानकारी" : "Basic Information"} complete={Boolean(form.name && form.description)}>
              <div>
                <FieldLabel required label={hi ? "मंदिर का नाम" : "Temple Name"} />
                <input value={form.name} onChange={(e) => onChange("name", e.target.value)} placeholder={hi ? "जैसे श्री राम मंदिर" : "e.g. Shri Ram Mandir"} className={`input ${errors.name ? "border-semantic-error" : ""}`} />
                <FieldHint error={errors.name} text="Hindi helper: मंदिर का लोकप्रिय या आधिकारिक नाम लिखें।" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel optional label={hi ? "देवता/भगवान" : "Deity/God"} />
                  <select value={form.deity} onChange={(e) => onChange("deity", e.target.value)} className="input">
                    <option value="">{hi ? "देवता चुनें" : "Select deity"}</option>
                    {deities.map((deity) => <option key={deity} value={deity}>{deity}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel optional label={hi ? "मंदिर प्रकार" : "Temple Type"} />
                  <select value={form.templeType} onChange={(e) => onChange("templeType", e.target.value)} className="input">
                    <option value="">{hi ? "प्रकार चुनें" : "Select type"}</option>
                    {templeTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <FieldLabel required label={hi ? "विवरण (अंग्रेजी)" : "Description (English)"} />
                <textarea value={form.description} onChange={(e) => onChange("description", e.target.value)} rows={5} placeholder={hi ? "मंदिर के इतिहास, महत्व और विशेषताओं का वर्णन करें..." : "Describe the temple history, significance, darshan experience, and important details."} className={`input ${errors.description ? "border-semantic-error" : ""}`} />
                <FieldHint error={errors.description} text="Hindi helper: इतिहास, मुख्य देवता, विशेषता और भक्तों के लिए उपयोगी जानकारी लिखें।" />
              </div>

              <div>
                <FieldLabel optional label={hi ? "विवरण (हिंदी)" : "Description (Hindi)"} />
                <textarea value={form.descriptionHi} onChange={(e) => onChange("descriptionHi", e.target.value)} rows={4} placeholder="मंदिर के इतिहास, महत्व और विशेषताओं का वर्णन करें..." className="input" />
                <FieldHint text="Optional Hindi text helps devotees read the listing in their preferred language." />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel optional label={hi ? "स्थापना वर्ष" : "Established Year"} />
                  <input type="number" value={form.establishedYear} onChange={(e) => onChange("establishedYear", e.target.value)} placeholder="e.g. 1500" className="input" />
                </div>
                <div>
                  <FieldLabel optional label={hi ? "विशेषता" : "Speciality"} />
                  <input value={form.speciality} onChange={(e) => onChange("speciality", e.target.value)} placeholder={hi ? "जैसे शिवरात्रि उत्सव के लिए प्रसिद्ध" : "e.g. Famous for Shivratri celebration"} className="input" />
                </div>
              </div>

              <div>
                <FieldLabel optional label={hi ? "पवित्र श्रेणियाँ" : "Sacred Categories"} />
                <FieldHint text="Choose any established pilgrimage grouping or sacred circuit this temple belongs to." />
                <div className="mt-3 max-h-[360px] space-y-4 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-4">
                  {sacredCategoryGroups.map(({ group, categories }) => (
                    <div key={group.key}>
                      <p className="mb-2 text-sm font-black text-stone-700">{group.label}</p>
                      <div className="grid gap-2 md:grid-cols-2">
                        {categories.map((cat) => (
                          <label key={cat.slug} className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-3 text-sm font-semibold text-stone-700 transition hover:bg-orange-50">
                            <input
                              type="checkbox"
                              checked={form.categories.includes(cat.name)}
                              onChange={(e) => {
                                if (e.target.checked) setForm((state) => ({ ...state, categories: [...state.categories, cat.name] }))
                                else setForm((state) => ({ ...state, categories: state.categories.filter((value) => value !== cat.name) }))
                              }}
                              className="h-4 w-4 shrink-0 accent-primary-500"
                            />
                            <span>{cat.icon} {cat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FormSection>

            <FormSection icon={MapPin} title={hi ? "स्थान और मैप" : "Location and Maps"} complete={Boolean(form.city && form.state)}>
              <div>
                <FieldLabel optional label={hi ? "गली का पता" : "Street Address"} />
                <input value={form.location} onChange={(e) => onChange("location", e.target.value)} placeholder={hi ? "मंदिर मार्ग, रेलवे स्टेशन के पास" : "Temple Road, Near Railway Station"} className="input" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <FieldLabel required label={hi ? "शहर" : "City"} />
                  <input value={form.city} onChange={(e) => onChange("city", e.target.value)} placeholder={hi ? "जैसे वाराणसी" : "e.g. Varanasi"} className={`input ${errors.city ? "border-semantic-error" : ""}`} />
                  <FieldHint error={errors.city} text="Hindi helper: भक्तों के लिए निकटतम शहर लिखें।" />
                </div>
                <div>
                  <FieldLabel required label={hi ? "राज्य" : "State"} />
                  <select value={form.state} onChange={(e) => onChange("state", e.target.value)} className={`input ${errors.state ? "border-semantic-error" : ""}`}>
                    <option value="">{hi ? "राज्य चुनें" : "Select state"}</option>
                    {indianStates.map((state) => <option key={state} value={state}>{state}</option>)}
                  </select>
                  <FieldHint error={errors.state} text="" />
                </div>
                <div>
                  <FieldLabel optional label={hi ? "पिनकोड" : "Pincode"} />
                  <input type="number" value={form.pincode} onChange={(e) => onChange("pincode", e.target.value)} placeholder="221001" className="input" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel optional label={hi ? "देश" : "Country"} />
                  <select value={form.country} onChange={(e) => onChange("country", e.target.value)} className="input">
                    {countries.map((country) => <option key={country} value={country}>{country}</option>)}
                  </select>
                </div>
                <div>
                  <FieldLabel optional label={hi ? "गूगल मैप्स लिंक" : "Google Maps Link"} />
                  <input value={form.mapsLink} onChange={(e) => onChange("mapsLink", e.target.value)} placeholder="https://maps.app.goo.gl/..." className={`input ${errors.mapsLink ? "border-semantic-error" : ""}`} />
                  <FieldHint error={errors.mapsLink} text="Open the temple in Google Maps, tap Share, then paste the copied link here. हिंदी: Maps से Share link कॉपी करें।" />
                </div>
              </div>
            </FormSection>

            <FormSection icon={Clock3} title={hi ? "दर्शन जानकारी" : "Darshan and Timings"} complete={filledSlots.length > 0}>
              <div>
                <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <FieldLabel required label={hi ? "दर्शन समय" : "Timings"} />
                  <button type="button" onClick={() => setTimingSlots((slots) => [...slots, ""])} className="btn btn-outline btn-sm rounded-lg text-xs">
                    <Plus className="h-3.5 w-3.5" />
                    {hi ? "समय जोड़ें" : "Add Slot"}
                  </button>
                </div>
                <div className="space-y-2">
                  {timingSlots.map((slot, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={slot}
                        onChange={(e) => {
                          setTimingSlots((slots) => slots.map((value, slotIndex) => slotIndex === index ? e.target.value : value))
                          setErrors((prev) => ({ ...prev, timings: undefined }))
                        }}
                        placeholder={index === 0 ? "5:00 AM - 12:00 PM" : "4:00 PM - 9:00 PM"}
                        className={`input ${errors.timings && index === 0 ? "border-semantic-error" : ""}`}
                      />
                      {timingSlots.length > 1 && (
                        <button type="button" onClick={() => setTimingSlots((slots) => slots.filter((_, slotIndex) => slotIndex !== index))} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <FieldHint error={errors.timings} text="Hindi helper: सुबह, दोपहर और शाम के अलग-अलग स्लॉट जोड़ सकते हैं।" />
              </div>

              <div>
                <FieldLabel optional label={hi ? "मंदिर की छवि" : "Temple Image"} />
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_7rem]">
                  <div className="space-y-3">
                    <input value={form.imageUrl} onChange={(e) => onChange("imageUrl", e.target.value)} placeholder="Paste Cloudinary/local image URL or upload below" className={`input ${errors.imageUrl ? "border-semantic-error" : ""}`} />
                    <div className="flex flex-wrap items-center gap-3">
                      <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage} className="btn btn-outline btn-sm rounded-lg text-xs disabled:opacity-60">
                        {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploadingImage ? (hi ? "अपलोड हो रहा है..." : "Uploading...") : (hi ? "छवि अपलोड करें" : "Upload Image")}
                      </button>
                      {form.imageUrl && (
                        <button type="button" onClick={() => onChange("imageUrl", "")} className="btn btn-ghost btn-sm rounded-lg text-xs text-red-700">
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      )}
                    </div>
                    <FieldHint error={errors.imageUrl || imageError} text="Upload is preferred. Direct URLs must be Cloudinary or local Sarvdev paths. हिंदी: साफ, सामने से ली गई मंदिर तस्वीर जोड़ें।" />
                  </div>
                  <div className="relative h-28 overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                    <SarvdevImage image={previewImage} alt="Temple image preview" className="absolute inset-0" imgClassName="object-cover" />
                  </div>
                </div>
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </FormSection>

            <FormSection icon={Megaphone} title={hi ? "मंदिर के त्यौहार" : "Temple Festivals"} complete={festivals.some((festival) => festival.name.trim())} optional>
              <div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-amber-950">Festival details become pending events too</p>
                  <p className="devanagari mt-1 text-xs leading-5 text-amber-900">प्रमुख उत्सव जोड़ें ताकि भक्त यात्रा की योजना बना सकें।</p>
                </div>
                <button type="button" onClick={() => setFestivals((items) => [...items, { name: "", description: "" }])} className="btn btn-primary btn-sm rounded-lg text-xs">
                  <Plus className="h-4 w-4" />
                  {hi ? "त्यौहार जोड़ें" : "Add Festival"}
                </button>
              </div>

              {festivals.length === 0 ? (
                <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center">
                  <Gift className="mx-auto h-8 w-8 text-stone-400" />
                  <p className="mt-3 text-sm font-semibold text-stone-600">No festivals added yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {festivals.map((festival, index) => (
                    <div key={index} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-black text-stone-800">Festival {index + 1}</p>
                        <button type="button" onClick={() => setFestivals((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-bold text-red-700">Remove</button>
                      </div>
                      <div className="grid gap-3">
                        <input value={festival.name} onChange={(e) => setFestivals((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, name: e.target.value } : item))} placeholder="Festival name, e.g. Mahashivratri" className="input" />
                        <textarea value={festival.description} onChange={(e) => setFestivals((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, description: e.target.value } : item))} rows={2} placeholder="Short description of the celebration" className="input" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </FormSection>

            <FormSection icon={Phone} title={hi ? "संपर्क जानकारी" : "Contact Information"} complete={Boolean(form.phone || form.email || form.contact)} optional>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel optional label={hi ? "फ़ोन" : "Phone"} />
                  <input type="tel" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} placeholder="+91 98765 43210" className={`input ${errors.phone ? "border-semantic-error" : ""}`} />
                  <FieldHint error={errors.phone} text="" />
                </div>
                <div>
                  <FieldLabel optional label={hi ? "ईमेल" : "Email"} />
                  <input type="email" value={form.email} onChange={(e) => onChange("email", e.target.value)} placeholder="temple@example.com" className={`input ${errors.email ? "border-semantic-error" : ""}`} />
                  <FieldHint error={errors.email} text="" />
                </div>
                <div>
                  <FieldLabel optional label={hi ? "सामान्य संपर्क" : "General Contact"} />
                  <input value={form.contact} onChange={(e) => onChange("contact", e.target.value)} placeholder={hi ? "पुजारी या प्रशासक का नाम" : "Priest name or admin contact"} className="input" />
                </div>
                <div>
                  <FieldLabel optional label={hi ? "वेबसाइट" : "Website"} />
                  <input type="url" value={form.website} onChange={(e) => onChange("website", e.target.value)} placeholder="https://templewebsite.com" className="input" />
                </div>
                <div>
                  <FieldLabel optional label={hi ? "फेसबुक" : "Facebook"} />
                  <input type="url" value={form.facebook} onChange={(e) => onChange("facebook", e.target.value)} placeholder="https://facebook.com/templepage" className="input" />
                </div>
                <div>
                  <FieldLabel optional label={hi ? "इंस्टाग्राम" : "Instagram"} />
                  <input type="url" value={form.instagram} onChange={(e) => onChange("instagram", e.target.value)} placeholder="https://instagram.com/templepage" className="input" />
                </div>
              </div>
            </FormSection>

            <FormSection icon={UserRound} title={hi ? "आपकी जानकारी" : "Submitter Information"} complete={Boolean(form.submitterName || form.submitterEmail)} optional>
              <p className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-900">
                This stays with Sarvdev review notes and helps us contact you for clarification. It is not shown publicly unless already part of temple contact details.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <FieldLabel optional label={hi ? "आपका नाम" : "Your Name"} />
                  <input type="text" value={form.submitterName} onChange={(e) => onChange("submitterName", e.target.value)} placeholder={hi ? "नाम दर्ज करें" : "Enter your name"} className="input" />
                </div>
                <div>
                  <FieldLabel optional label={hi ? "आपका ईमेल" : "Your Email"} />
                  <input type="email" value={form.submitterEmail} onChange={(e) => onChange("submitterEmail", e.target.value)} placeholder={hi ? "ईमेल दर्ज करें" : "Enter your email"} className={`input ${errors.submitterEmail ? "border-semantic-error" : ""}`} />
                  <FieldHint error={errors.submitterEmail} text="" />
                </div>
              </div>
            </FormSection>

            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-stone-950">Ready for admin review</p>
                  <p className="devanagari mt-1 text-sm text-stone-600">सबमिट करने के बाद मंदिर pending status में रहेगा।</p>
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary btn-lg rounded-lg disabled:opacity-60">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ClipboardCheck className="h-5 w-5" />}
                  {loading ? labels.submitting : labels.submitBtn}
                </button>
              </div>
            </div>
          </form>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-orange-700">Preview</p>
                  <h2 className="mt-1 text-2xl font-black text-stone-950">Before submit</h2>
                </div>
                <span className={`rounded-lg px-3 py-1 text-xs font-black ${readyToSubmit ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"}`}>
                  {readyToSubmit ? "Ready" : "Needs info"}
                </span>
              </div>
              <div className="relative mt-4 h-40 overflow-hidden rounded-lg bg-stone-100">
                <SarvdevImage image={previewImage} alt={form.name || "Temple preview"} className="absolute inset-0" imgClassName="object-cover" />
              </div>
              <h3 className="mt-4 text-xl font-black text-stone-950">{form.name || "Temple name"}</h3>
              <p className="mt-1 text-sm font-semibold text-stone-600">
                {[form.city, form.state, form.country].filter(Boolean).join(", ") || "City, State"}
              </p>
              <div className="mt-4 space-y-2 text-sm text-stone-700">
                <PreviewLine icon={Clock3} label="Timings" value={filledSlots.join(" | ") || "Add darshan timings"} />
                <PreviewLine icon={Languages} label="Hindi text" value={form.descriptionHi ? "Added" : "Optional"} />
                <PreviewLine icon={Gift} label="Festivals" value={`${festivals.filter((festival) => festival.name.trim()).length} added`} />
                <PreviewLine icon={ImageIcon} label="Image" value={form.imageUrl ? "Added" : "Fallback ready"} />
              </div>
            </div>

            <div className="rounded-lg border border-orange-200 bg-orange-50 p-5">
              <div className="flex items-start gap-3">
                <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-orange-800" />
                <div>
                  <p className="text-sm font-black text-orange-950">Review protection</p>
                  <p className="mt-1 text-sm leading-6 text-orange-900">
                    Public submissions are saved as pending and appear for admin verification before publication.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="page-container pb-24">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions before you submit"
          description="A quick reference for the most common temple listing questions."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-black text-stone-950 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-stone-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-[4.75rem] z-40 px-3 pb-2 lg:hidden">
        <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between gap-3 rounded-lg border border-orange-200 bg-white/95 p-3 shadow-xl backdrop-blur">
          <div className="min-w-0">
            <p className="truncate text-sm font-black text-stone-950">Submit temple</p>
            <p className="text-xs text-stone-600">{progress}% complete</p>
          </div>
          <a href="#submission-form" className="btn btn-primary rounded-lg px-4 py-2 text-xs no-underline hover:no-underline">
            Start
          </a>
        </div>
      </div>
    </main>
  )
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black text-orange-700">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-black text-stone-950 md:text-4xl">{title}</h2>
      <p className="mt-3 text-base leading-7 text-stone-600">{description}</p>
    </div>
  )
}

function InfoPanel({ icon: Icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-xl font-black text-stone-950">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <p className="text-sm leading-6 text-stone-700">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FormSection({
  icon: Icon,
  title,
  complete,
  optional,
  children,
}: {
  icon: LucideIcon
  title: string
  complete: boolean
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <details open className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-700">
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-black text-stone-950">{title}</span>
            <span className="mt-1 block text-xs font-semibold text-stone-500">{optional ? "Optional section" : "Required section"}</span>
          </span>
        </span>
        <span className="flex items-center gap-2">
          <span className={`hidden rounded-lg px-2.5 py-1 text-xs font-black sm:inline-flex ${complete ? "bg-emerald-100 text-emerald-800" : optional ? "bg-stone-100 text-stone-600" : "bg-amber-100 text-amber-900"}`}>
            {complete ? "Complete" : optional ? "Optional" : "Needed"}
          </span>
          <ChevronDown className="h-5 w-5 shrink-0 text-stone-500 transition group-open:rotate-180" />
        </span>
      </summary>
      <div className="space-y-5 border-t border-stone-200 p-5">{children}</div>
    </details>
  )
}

function FieldLabel({ label, required, optional }: { label: string; required?: boolean; optional?: boolean }) {
  return (
    <label className="label flex items-center gap-2">
      <span>{label}</span>
      {required && <span className="rounded bg-red-50 px-2 py-0.5 text-[11px] font-black text-red-700">Required</span>}
      {optional && <span className="rounded bg-stone-100 px-2 py-0.5 text-[11px] font-black text-stone-500">Optional</span>}
    </label>
  )
}

function FieldHint({ text, error }: { text: string; error?: string }) {
  if (error) return <p className="mt-1 text-sm font-semibold text-semantic-error">{error}</p>
  if (!text) return null
  return <p className="mt-1 text-xs leading-5 text-stone-500">{text}</p>
}

function PreviewLine({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-stone-50 p-3">
      <Icon className="h-4 w-4 shrink-0 text-orange-700" />
      <div className="min-w-0">
        <p className="text-xs font-black text-stone-500">{label}</p>
        <p className="truncate text-sm font-semibold text-stone-900">{value}</p>
      </div>
    </div>
  )
}
