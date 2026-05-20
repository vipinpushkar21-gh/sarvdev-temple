// models/Temple.ts
import mongoose, { Schema, Model, models } from 'mongoose';

const TempleSchema = new Schema({
  title: { type: String, required: true },
  titleHi: { type: String },
  description: { type: String },
  descriptionHi: { type: String },
  image: { type: String },
  images: { type: [String], default: [] },
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
  deity: { type: String },
  establishedYear: { type: String },
  establishedYearHi: { type: String },
  templeType: { type: String },
  templeTypes: { type: [String], default: [] },
  speciality: { type: String },
  specialityHi: { type: String },
  categories: { type: [String], default: [] },
  sacredCategories: { type: [String], default: [] },
  timings: { type: String },
  timingSlots: { type: [String], default: [] },
  festivals: {
    type: [{
      name: { type: String },
      description: { type: String },
    }],
    default: []
  },
  contact: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  ogImage: { type: String },
  canonicalShaktiPeeth: { type: Boolean, default: false },
  canonicalShaktiPeethKey: { type: String },
  canonicalShaktiPeethName: { type: String },
  shaktiPeethMeta: { type: Schema.Types.Mixed },
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
