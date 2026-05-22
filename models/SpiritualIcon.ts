import mongoose, { Schema, models } from 'mongoose'

const SpiritualIconSchema = new Schema({
  name: { type: String, required: true },
  nameHi: { type: String },
  slug: { type: String, required: true, unique: true, index: true },
  category: { type: String },
  categorySlug: { type: String, index: true },
  title: { type: String },
  titleHi: { type: String },
  shortBio: { type: String },
  shortBioHi: { type: String },
  fullBio: { type: String },
  fullBioHi: { type: String },
  image: { type: String },
  imageCard: { type: String },
  imageHero: { type: String },
  galleryImages: [{ type: String }],
  location: { type: String },
  city: { type: String },
  state: { type: String, index: true },
  country: { type: String, default: 'India' },
  languages: [{ type: String }],
  specializations: [{ type: String }],
  sampradaya: { type: String },
  organization: { type: String },
  yearsActive: { type: String },
  notableWorks: [{ type: String }],
  contactPhone: { type: String },
  contactEmail: { type: String },
  website: { type: String },
  youtube: { type: String },
  instagram: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  bookingAvailable: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'draft', index: true },
  priority: { type: Number, default: 999 },
  metaTitle: { type: String },
  metaDescription: { type: String },
  ogImage: { type: String },
  source: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

SpiritualIconSchema.index({
  name: 'text',
  nameHi: 'text',
  title: 'text',
  shortBio: 'text',
  state: 'text',
  city: 'text',
  category: 'text',
})

SpiritualIconSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

export default models.SpiritualIcon || mongoose.model('SpiritualIcon', SpiritualIconSchema)
