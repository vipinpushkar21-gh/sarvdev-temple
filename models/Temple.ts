// models/Temple.ts
import mongoose, { Schema, Model, models } from 'mongoose';

const TempleSchema = new Schema({
  // ── Core ──
  title: { type: String, required: true },
  titleHi: { type: String },
  subtitle: { type: String },
  subtitleHi: { type: String },
  alternateNames: { type: [String], default: [] },
  templeTagline: { type: String },
  templeTaglineHi: { type: String },
  shortDescription: { type: String },
  shortDescriptionHi: { type: String },
  description: { type: String },
  descriptionHi: { type: String },

  // ── Media ──
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
  location: { type: String },
  locationHi: { type: String },
  mapsLink: { type: String },
  googleMapsUrl: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  city: { type: String },
  cityHi: { type: String },
  state: { type: String },
  stateHi: { type: String },
  country: { type: String, default: 'India' },
  pincode: { type: String },
  pincodeHi: { type: String },

  // ── Deity & Spiritual ──
  deity: { type: String },
  mainDeity: { type: String },
  secondaryDeities: { type: [String], default: [] },
  deityForms: { type: [String], default: [] },
  sampradaya: { type: String },
  sect: { type: String },
  spiritualTradition: { type: String },
  sacredImportance: { type: String },
  sacredImportanceHi: { type: String },
  mythology: { type: String },
  mythologyHi: { type: String },
  templeLegend: { type: String },
  templeLegendHi: { type: String },
  sacredMystery: { type: String },
  sacredMysteryHi: { type: String },

  // ── History & Architecture ──
  history: { type: String },
  historyHi: { type: String },
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

  // ── Pilgrimage Info ──
  pilgrimageType: { type: String },
  pilgrimageCircuit: { type: String },
  nearbySacredPlaces: { type: [String], default: [] },
  bestSeason: { type: String },
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

  // ── Contact & Social ──
  contact: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  facebook: { type: String },
  instagram: { type: String },

  // ── SEO ──
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
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
  createdAt: { type: Date, default: Date.now }
});

// Mongoose 8 + strict TS: model() infers a union too complex for this schema size.
// Cast to any at the call site, then re-type the export.
const Temple = (models.Temple as any) || (mongoose.model as any)('Temple', TempleSchema);
export default Temple as Model<any>;
