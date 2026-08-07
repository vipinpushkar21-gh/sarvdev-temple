"use client"

import { useEffect, useMemo, useState } from 'react'
import ImageUpload from '../ImageUpload'
import { useTranslation } from '../../lib/translation'
import { getGroupedCategories } from '../../lib/sacred-categories'
import {
  emptyTempleMasterValues,
  templeMasterPayload,
  type TempleFormMode,
  type TempleMasterValues,
  validateTempleMasterValues,
} from '../../lib/temple-master'

type Props = {
  mode: TempleFormMode
  templeId?: string
  initialValues?: TempleMasterValues
  onSaved?: (temple: any) => void
}

const states = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']
const deities = ['Shiva', 'Vishnu', 'Durga', 'Ganesha', 'Hanuman', 'Krishna', 'Rama', 'Lakshmi', 'Saraswati', 'Kali', 'Murugan', 'Brahma', 'Other']
const templeTypes = ['Ancient Temple', 'North Indian', 'South Indian', 'Cave Temple', 'Hill Temple', 'Modern Temple', 'Other']

function copy(hi: boolean) {
  return hi ? {
    basic: 'मूल जानकारी', location: 'स्थान', visit: 'दर्शन जानकारी', contactSection: 'संपर्क जानकारी', images: 'चित्र', travel: 'यात्रा मार्गदर्शिका', festivals: 'मंदिर उत्सव', seo: 'एसईओ और प्रशासन',
    title: 'मंदिर का नाम (अंग्रेज़ी)', titleHi: 'मंदिर का नाम (हिंदी)', slug: 'स्लग', uniqueKey: 'यूनिक कुंजी', deity: 'देवता / भगवान (अंग्रेज़ी)', deityHi: 'देवता / भगवान (हिंदी)', templeType: 'मंदिर का प्रकार', description: 'विवरण (अंग्रेज़ी)', descriptionHi: 'विवरण (हिंदी)', establishedYear: 'स्थापना वर्ष / काल', speciality: 'विशेषता', categories: 'पवित्र श्रेणियाँ',
    streetAddress: 'सड़क का पता (अंग्रेज़ी)', streetAddressHi: 'सड़क का पता (हिंदी)', city: 'शहर (अंग्रेज़ी)', cityHi: 'शहर (हिंदी)', district: 'जिला (अंग्रेज़ी)', districtHi: 'जिला (हिंदी)', state: 'राज्य (अंग्रेज़ी)', stateHi: 'राज्य (हिंदी)', pincode: 'पिनकोड', country: 'देश', mapsLink: 'गूगल मैप्स यूआरएल',
    timings: 'समय', phone: 'फोन', website: 'वेबसाइट', primaryImage: 'मुख्य चित्र', cardImage: 'कार्ड चित्र', heroImage: 'हीरो चित्र', airport: 'निकटतम हवाई अड्डा', railway: 'निकटतम रेलवे स्टेशन', bus: 'निकटतम बस अड्डा', parking: 'पार्किंग', transport: 'स्थानीय परिवहन', festivalEn: 'मंदिर उत्सव (अंग्रेज़ी)', festivalHi: 'मंदिर उत्सव (हिंदी)', tags: 'टैग', quality: 'डेटा गुणवत्ता', metaTitle: 'मेटा शीर्षक', metaDescription: 'मेटा विवरण', keywords: 'कीवर्ड', ogImage: 'ओजी चित्र यूआरएल', status: 'स्थिति',
    select: 'चुनें', save: 'मंदिर सहेजें', update: 'मंदिर अपडेट करें', submit: 'समीक्षा के लिए भेजें', saving: 'सहेजा जा रहा है...', saved: 'मंदिर सफलतापूर्वक सहेजा गया।', submitted: 'मंदिर समीक्षा के लिए भेज दिया गया है।', required: 'आवश्यक', optional: 'वैकल्पिक', chooseCategories: 'एक या अधिक श्रेणियाँ चुनें', imagesHelp: 'सभी चित्र Cloudinary या स्थानीय Sarvdev URL से जोड़ें।', error: 'कृपया आवश्यक जानकारी भरें।',
  } : {
    basic: 'Basic Information', location: 'Location', visit: 'Visit Information', contactSection: 'Contact Information', images: 'Images', travel: 'Travel Guide', festivals: 'Temple Festivals', seo: 'SEO & Admin',
    title: 'Temple Name (English)', titleHi: 'Temple Name (Hindi)', slug: 'Slug', uniqueKey: 'Unique Key', deity: 'Deity / God (English)', deityHi: 'Deity / God (Hindi)', templeType: 'Temple Type', description: 'Description (English)', descriptionHi: 'Description (Hindi)', establishedYear: 'Established Year / Era', speciality: 'Speciality', categories: 'Sacred Categories',
    streetAddress: 'Street Address (English)', streetAddressHi: 'Street Address (Hindi)', city: 'City (English)', cityHi: 'City (Hindi)', district: 'District (English)', districtHi: 'District (Hindi)', state: 'State (English)', stateHi: 'State (Hindi)', pincode: 'Pincode', country: 'Country', mapsLink: 'Google Maps Embed URL',
    timings: 'Timings', phone: 'Phone', website: 'Website', primaryImage: 'Primary Image', cardImage: 'Card Image', heroImage: 'Hero Image', airport: 'Nearest Airport', railway: 'Nearest Railway Station', bus: 'Nearest Bus Stand', parking: 'Parking', transport: 'Local Transport', festivalEn: 'Temple Festivals (English)', festivalHi: 'Temple Festivals (Hindi)', tags: 'Tags', quality: 'Data Quality', metaTitle: 'Meta Title', metaDescription: 'Meta Description', keywords: 'Keywords', ogImage: 'OG Image URL', status: 'Status',
    select: 'Select', save: 'Save Temple', update: 'Update Temple', submit: 'Submit for Review', saving: 'Saving...', saved: 'Temple saved successfully.', submitted: 'Temple submitted for review.', required: 'Required', optional: 'Optional', chooseCategories: 'Choose one or more categories', imagesHelp: 'Use Cloudinary or local Sarvdev image URLs for all images.', error: 'Please complete the required information.',
  }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="admin-card p-5 md:p-6"><h2 className="admin-section-title mb-5">{title}</h2>{children}</section>
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700">{label}{required && <span className="ml-1 text-red-600">*</span>}{children}{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>
}

export default function TempleForm({ mode, templeId, initialValues, onSaved }: Props) {
  const { language } = useTranslation()
  const hi = language === 'hi'
  const t = copy(hi)
  const admin = mode !== 'public'
  const [values, setValues] = useState<TempleMasterValues>(initialValues || emptyTempleMasterValues())
  const [errors, setErrors] = useState<Partial<Record<keyof TempleMasterValues, string>>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [requestError, setRequestError] = useState('')
  const categoryGroups = useMemo(() => getGroupedCategories(), [])

  useEffect(() => { if (initialValues) setValues(initialValues) }, [initialValues])

  function setField<K extends keyof TempleMasterValues>(key: K, value: TempleMasterValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setRequestError('')
  }

  function toggleCategory(category: string) {
    setField('sacredCategories', values.sacredCategories.includes(category)
      ? values.sacredCategories.filter((value) => value !== category)
      : [...values.sacredCategories, category])
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setMessage('')
    const nextErrors = validateTempleMasterValues(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) { setRequestError(t.error); return }
    setSaving(true)
    try {
      const response = await fetch('/api/temples', {
        method: mode === 'admin-edit' ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'admin-edit' ? { id: templeId, ...templeMasterPayload(values, mode) } : templeMasterPayload(values, mode)),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'Unable to save temple')
      setMessage(mode === 'public' ? t.submitted : t.saved)
      onSaved?.(data)
      if (mode === 'public') setValues(emptyTempleMasterValues())
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : 'Unable to save temple')
    } finally { setSaving(false) }
  }

  const input = 'admin-input mt-1 w-full'
  const textarea = `${input} min-h-28 resize-y`
  const adminOnly = admin ? '' : 'hidden'

  return <form onSubmit={submit} className="space-y-6">
    {requestError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{requestError}</div>}
    {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</div>}

    <Section title={t.basic}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t.title} required error={errors.title}><input value={values.title} onChange={(e) => setField('title', e.target.value)} className={input} /></Field>
        <Field label={t.titleHi}><input value={values.titleHi} onChange={(e) => setField('titleHi', e.target.value)} className={input} /></Field>
        {admin && <><Field label={t.slug}><input value={values.slug} onChange={(e) => setField('slug', e.target.value)} placeholder="auto-generated-from-name" className={input} /></Field>
        <Field label={t.uniqueKey}><input value={values.uniqueKey} onChange={(e) => setField('uniqueKey', e.target.value)} placeholder="auto-generated-from-name-district-state" className={input} /></Field></>}
        <Field label={t.deity}><select value={values.deity} onChange={(e) => setField('deity', e.target.value)} className={input}><option value="">{t.select}</option>{deities.map((deity) => <option key={deity}>{deity}</option>)}</select></Field>
        <Field label={t.deityHi}><input value={values.deityHi} onChange={(e) => setField('deityHi', e.target.value)} className={input} /></Field>
        <Field label={t.templeType}><select value={values.templeType} onChange={(e) => setField('templeType', e.target.value)} className={input}><option value="">{t.select}</option>{templeTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
        <Field label={t.establishedYear}><input value={values.establishedYear} onChange={(e) => setField('establishedYear', e.target.value)} className={input} /></Field>
        <Field label={t.description} required error={errors.description}><textarea value={values.description} onChange={(e) => setField('description', e.target.value)} className={`${textarea} md:col-span-2`} /></Field>
        <Field label={t.descriptionHi}><textarea value={values.descriptionHi} onChange={(e) => setField('descriptionHi', e.target.value)} className={`${textarea} md:col-span-2`} /></Field>
        <Field label={t.speciality}><input value={values.speciality} onChange={(e) => setField('speciality', e.target.value)} className={`${input} md:col-span-2`} /></Field>
      </div>
      <div className="mt-5"><p className="text-sm font-medium text-gray-700">{t.categories}</p><p className="mt-1 text-xs text-gray-500">{t.chooseCategories}</p><div className="mt-3 space-y-3">{categoryGroups.map(({ group, categories }) => <div key={group.key}><p className="text-xs font-semibold text-gray-500">{hi ? group.labelHi : group.label}</p><div className="mt-2 flex flex-wrap gap-2">{categories.map((category) => <label key={category.slug} className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700"><input type="checkbox" checked={values.sacredCategories.includes(category.name)} onChange={() => toggleCategory(category.name)} />{hi ? category.nameHi : category.name}</label>)}</div></div>)}</div></div>
    </Section>

    <Section title={t.location}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t.streetAddress}><input value={values.streetAddress} onChange={(e) => setField('streetAddress', e.target.value)} className={input} /></Field><Field label={t.streetAddressHi}><input value={values.streetAddressHi} onChange={(e) => setField('streetAddressHi', e.target.value)} className={input} /></Field>
        <Field label={t.city} required error={errors.city}><input value={values.city} onChange={(e) => setField('city', e.target.value)} className={input} /></Field><Field label={t.cityHi}><input value={values.cityHi} onChange={(e) => setField('cityHi', e.target.value)} className={input} /></Field>
        <Field label={t.district}><input value={values.district} onChange={(e) => setField('district', e.target.value)} className={input} /></Field><Field label={t.districtHi}><input value={values.districtHi} onChange={(e) => setField('districtHi', e.target.value)} className={input} /></Field>
        <Field label={t.state} required error={errors.state}><select value={values.state} onChange={(e) => setField('state', e.target.value)} className={input}><option value="">{t.select}</option>{states.map((state) => <option key={state}>{state}</option>)}</select></Field><Field label={t.stateHi}><input value={values.stateHi} onChange={(e) => setField('stateHi', e.target.value)} className={input} /></Field>
        <Field label={t.pincode}><input value={values.pincode} onChange={(e) => setField('pincode', e.target.value)} className={input} /></Field><Field label={t.country}><input value={values.country} onChange={(e) => setField('country', e.target.value)} className={input} /></Field>
        <Field label={t.mapsLink} error={errors.mapsLink}>
          <input
            value={values.mapsLink}
            onChange={(e) => setField('mapsLink', e.target.value)}
            placeholder="Paste Google Maps embed iframe src URL"
            className={`${input} md:col-span-2`}
          />
          <span className="mt-1 block text-xs text-gray-500">
            Google Maps → Share → Embed a map → paste iframe src URL or full iframe code.
          </span>
        </Field>
      </div>
    </Section>

    <Section title={t.visit}><Field label={t.timings} required error={errors.timings}><textarea value={values.timings} onChange={(e) => setField('timings', e.target.value)} placeholder={hi ? 'उदाहरण: सुबह 6:00 - दोपहर 12:00, शाम 4:00 - रात 9:00' : 'Example: 6:00 AM - 12:00 PM, 4:00 PM - 9:00 PM'} className={textarea} /></Field></Section>

    <Section title={t.contactSection}><div className="grid gap-4 md:grid-cols-2"><Field label={t.phone} error={errors.phone}><input value={values.phone} onChange={(e) => setField('phone', e.target.value)} className={input} /></Field><Field label={t.website} error={errors.website}><input value={values.website} onChange={(e) => setField('website', e.target.value)} className={input} /></Field></div></Section>

    <Section title={t.images}><p className="mb-4 text-xs text-gray-500">{t.imagesHelp}</p><div className="grid gap-6 xl:grid-cols-3"><ImageUpload value={values.primaryImage} onChange={(value) => setField('primaryImage', value)} folder="sarvdev/temples" label={t.primaryImage} guidance="general" language={hi ? 'hi' : 'en'} /><ImageUpload value={values.imageCard} onChange={(value) => setField('imageCard', value)} folder="sarvdev/temples" label={t.cardImage} guidance="card" language={hi ? 'hi' : 'en'} /><ImageUpload value={values.imageHero} onChange={(value) => setField('imageHero', value)} folder="sarvdev/temples" label={t.heroImage} guidance="hero" language={hi ? 'hi' : 'en'} /></div></Section>

    <Section title={t.travel}><div className="grid gap-4 md:grid-cols-2"><Field label={t.airport}><input value={values.nearestAirport} onChange={(e) => setField('nearestAirport', e.target.value)} className={input} /></Field><Field label={t.railway}><input value={values.nearestRailwayStation} onChange={(e) => setField('nearestRailwayStation', e.target.value)} className={input} /></Field><Field label={t.bus}><input value={values.nearestBusStand} onChange={(e) => setField('nearestBusStand', e.target.value)} className={input} /></Field><Field label={t.parking}><input value={values.parkingAvailable} onChange={(e) => setField('parkingAvailable', e.target.value)} className={input} /></Field><Field label={t.transport}><input value={values.localTransport} onChange={(e) => setField('localTransport', e.target.value)} className={`${input} md:col-span-2`} /></Field></div></Section>

    <Section title={t.festivals}><div className="grid gap-4 md:grid-cols-2"><Field label={t.festivalEn}><textarea value={values.templeFestivals} onChange={(e) => setField('templeFestivals', e.target.value)} placeholder={hi ? 'सेमीकोलन या नई पंक्ति से अलग करें' : 'Separate with semicolons or new lines'} className={textarea} /></Field><Field label={t.festivalHi}><textarea value={values.templeFestivalsHi} onChange={(e) => setField('templeFestivalsHi', e.target.value)} placeholder={hi ? 'सेमीकोलन या नई पंक्ति से अलग करें' : 'Separate with semicolons or new lines'} className={textarea} /></Field></div></Section>

    <section className={adminOnly}><Section title={t.seo}><div className="grid gap-4 md:grid-cols-2"><Field label={t.tags}><input value={values.tags} onChange={(e) => setField('tags', e.target.value)} className={input} /></Field><Field label={t.quality}><select value={values.dataQuality} onChange={(e) => setField('dataQuality', e.target.value as TempleMasterValues['dataQuality'])} className={input}><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></Field><Field label={t.metaTitle}><input value={values.metaTitle} onChange={(e) => setField('metaTitle', e.target.value)} className={input} /></Field><Field label={t.keywords}><input value={values.metaKeywords} onChange={(e) => setField('metaKeywords', e.target.value)} className={input} /></Field><Field label={t.metaDescription}><textarea value={values.metaDescription} onChange={(e) => setField('metaDescription', e.target.value)} className={`${textarea} md:col-span-2`} /></Field><Field label={t.ogImage} error={errors.ogImage}><input value={values.ogImage} onChange={(e) => setField('ogImage', e.target.value)} className={`${input} md:col-span-2`} /></Field><Field label={t.status}><select value={values.status} onChange={(e) => setField('status', e.target.value as TempleMasterValues['status'])} className={input}><option value="pending">{hi ? 'लंबित' : 'Pending'}</option><option value="approved">{hi ? 'स्वीकृत' : 'Approved'}</option><option value="rejected">{hi ? 'अस्वीकृत' : 'Rejected'}</option></select></Field></div></Section></section>

    <div className="flex justify-end"><button disabled={saving} className="admin-btn admin-btn-primary px-6 py-3 disabled:opacity-60">{saving ? t.saving : mode === 'public' ? t.submit : mode === 'admin-edit' ? t.update : t.save}</button></div>
  </form>
}
