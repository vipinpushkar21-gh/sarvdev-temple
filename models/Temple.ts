// models/Temple.ts
import mongoose, { Schema, Model, models } from 'mongoose';
import {
  TEMPLE_DATA_QUALITY_VALUES,
  buildTempleUniqueKey,
  getSacredCategorySlugs,
  normalizeTempleDataQuality,
  normalizeTempleText,
  normalizeTempleUniqueKey,
  normalizeTempleUniqueKeyForCompare,
  slugifyTemple,
  uniqueStrings,
} from '../lib/temple-normalization';

const TempleSchema = new Schema({
  // ── Core ──
  title: { type: String, required: true },
  slug: { type: String, index: true },
  uniqueKey: { type: String },
  uniqueKeyNormalized: { type: String, index: true },
  dataQuality: { type: String, enum: TEMPLE_DATA_QUALITY_VALUES, default: 'B' },
  titleNormalized: { type: String, index: true },
  titleHi: { type: String },
  subtitle: { type: String },
  subtitleHi: { type: String },
  alternateNames: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  templeTagline: { type: String },
  templeTaglineHi: { type: String },
  shortDescription: { type: String },
  shortDescriptionHi: { type: String },
  description: { type: String },
  descriptionHi: { type: String },

  // ── Media ──
  primaryImage: { type: String },
  image: { type: String },
  imageCard: { type: String },
  imageHero: { type: String },
  imageGallery: { type: [String], default: [] },
  heroImage: { type: String },
  images: { type: [String], default: [] },
  galleryImages: { type: [String], default: [] },
  festivalGallery: { type: [String], default: [] },
  architectureGallery: { type: [String], default: [] },
  deityGallery: { type: [String], default: [] },
  videos: { type: [String], default: [] },
  droneShots: { type: [String], default: [] },
  ambienceAudio: { type: String },

  // ── Location ──
  streetAddress: { type: String },
  streetAddressHi: { type: String },
  location: { type: String },
  locationHi: { type: String },
  mapsLink: { type: String },
  googleMapUrl: { type: String },
  googleMapsUrl: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  city: { type: String },
  cityNormalized: { type: String, index: true },
  cityHi: { type: String },
  district: { type: String },
  districtHi: { type: String },
  state: { type: String },
  stateNormalized: { type: String, index: true },
  stateHi: { type: String },
  country: { type: String, default: 'India' },
  pincode: { type: String },
  pincodeHi: { type: String },

  // ── Deity & Spiritual ──
  deity: { type: String },
  deityHi: { type: String },
  deitySlug: { type: String, index: true },
  mainDeity: { type: String },
  secondaryDeities: { type: [String], default: [] },
  deityForms: { type: [String], default: [] },
  sampradaya: { type: String },
  sect: { type: String },
  spiritualTradition: { type: String },
  sacredImportance: { type: String },
  sacredImportanceHi: { type: String },
  religiousImportance: { type: String },
  religiousImportanceHi: { type: String },
  mythology: { type: String },
  mythologyHi: { type: String },
  templeLegend: { type: String },
  templeLegendHi: { type: String },
  sacredMystery: { type: String },
  sacredMysteryHi: { type: String },

  // ── History & Architecture ──
  history: { type: String },
  historyHi: { type: String },
  architecture: { type: String },
  architectureHi: { type: String },
  architectureStyle: { type: String },
  architectureHighlights: { type: String },
  templeArea: { type: String },
  gopuramCount: { type: String },
  mandapamDetails: { type: String },
  builtBy: { type: String },
  dynasty: { type: String },
  renovations: { type: String },

  // ── Temple Classification ──
  establishedYear: { type: String },
  establishedYearHi: { type: String },
  templeType: { type: String },
  templeTypes: { type: [String], default: [] },
  speciality: { type: String },
  specialityHi: { type: String },
  categories: { type: [String], default: [] },
  sacredCategories: { type: [String], default: [] },
  sacredCategorySlugs: { type: [String], default: [], index: true },

  // ── Pilgrimage Info ──
  pilgrimageType: { type: String },
  pilgrimageCircuit: { type: String },
  nearbySacredPlaces: { type: [String], default: [] },
  nearbyTemples: { type: [String], default: [] },
  bestSeason: { type: String },
  bestTimeToVisit: { type: String },
  bestTimeToVisitHi: { type: String },
  crowdLevel: { type: String, enum: ['low', 'moderate', 'high', 'very-high', ''] },
  averageVisitDuration: { type: String },
  dressCode: { type: String },
  photographyAllowed: { type: String, enum: ['yes', 'no', 'restricted', ''] },
  prasadamInfo: { type: String },
  specialRituals: { type: String },
  templeRules: { type: String },

  // ── Timings ──
  timings: { type: String },
  timingSlots: { type: [String], default: [] },

  // ── Travel Guide ──
  nearestAirport: { type: String },
  nearestRailwayStation: { type: String },
  nearestBusStand: { type: String },
  parkingAvailable: { type: String },
  wheelchairAccess: { type: String },
  accommodationInfo: { type: String },
  localTransport: { type: String },

  // ── Enhanced Festivals ──
  festivals: {
    type: [{
      name: { type: String },
      nameHi: { type: String },
      description: { type: String },
      descriptionHi: { type: String },
      month: { type: String },
      crowdScale: { type: String },
      images: { type: [String], default: [] },
    }],
    default: []
  },
  festivalsHi: { type: String },
  templeFestivals: { type: String },
  templeFestivalsHi: { type: String },

  // ── Contact & Social ──
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  facebook: { type: String },
  instagram: { type: String },

  // ── SEO ──
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  keywords: { type: [String], default: [] },
  faqs: {
    type: [{
      question: { type: String },
      answer: { type: String },
    }],
    default: []
  },
  sourceUrls: { type: [String], default: [] },
  ogImage: { type: String },
  canonicalUrl: { type: String },

  // ── Legacy Shakti Peeth ──
  canonicalShaktiPeeth: { type: Boolean, default: false },
  canonicalShaktiPeethKey: { type: String },
  canonicalShaktiPeethName: { type: String },
  shaktiPeethMeta: { type: Schema.Types.Mixed },

  // ── Admin / Moderation ──
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verified: { type: String, enum: ['verified', 'not-verified'], default: 'not-verified' },
  submittedBy: { type: String },
  submitterEmail: { type: String },
  moderationNotes: { type: String },
  reviewedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

TempleSchema.index({ status: 1, createdAt: -1 });
TempleSchema.index({ status: 1, stateNormalized: 1, cityNormalized: 1 });
TempleSchema.index({ status: 1, deitySlug: 1 });
TempleSchema.index({ status: 1, sacredCategorySlugs: 1 });
TempleSchema.index({ titleNormalized: 1, cityNormalized: 1, stateNormalized: 1 });
TempleSchema.index({ status: 1, sacredCategorySlugs: 1, createdAt: -1 }); // paginated category browse
TempleSchema.index({ sacredCategorySlugs: 1, status: 1, stateNormalized: 1 }); // geo+category filter
TempleSchema.index({ uniqueKeyNormalized: 1 }, { name: 'temple_unique_key_lookup', sparse: true });
TempleSchema.index({ status: 1, dataQuality: 1, createdAt: -1 }, { name: 'status_data_quality_created' });
TempleSchema.pre('validate', function (next) {
  const doc = this as any;
  if (!doc.slug && doc.title) doc.slug = slugifyTemple(doc.title);
  if (doc.slug) doc.slug = slugifyTemple(doc.slug);
  doc.dataQuality = normalizeTempleDataQuality(doc.dataQuality, 'B');
  const uniqueKey = normalizeTempleUniqueKey(doc.uniqueKey || buildTempleUniqueKey(doc.title, doc.district, doc.state));
  if (uniqueKey) {
    doc.uniqueKey = uniqueKey;
    doc.uniqueKeyNormalized = normalizeTempleUniqueKeyForCompare(uniqueKey);
  }
  if (doc.title) doc.titleNormalized = normalizeTempleText(doc.title);
  if (doc.city) doc.cityNormalized = normalizeTempleText(doc.city);
  if (doc.state) doc.stateNormalized = normalizeTempleText(doc.state);
  if (doc.deity) doc.deitySlug = slugifyTemple(doc.deity);
  const categoryValues = uniqueStrings([
    ...(Array.isArray(doc.sacredCategories) ? doc.sacredCategories : []),
    ...(Array.isArray(doc.categories) ? doc.categories : []),
  ]);
  if (categoryValues.length > 0) doc.sacredCategorySlugs = getSacredCategorySlugs(categoryValues);
  next();
});

// Mongoose 8 + strict TS: model() infers a union too complex for this schema size.
// Cast to any at the call site, then re-type the export.
const Temple = (models.Temple as any) || (mongoose.model as any)('Temple', TempleSchema);
export default Temple as Model<any>;
