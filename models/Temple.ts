// models/Temple.ts
import mongoose, { Schema, Model, models } from 'mongoose';

const TempleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  descriptionHi: { type: String },
  image: { type: String },
  images: { type: [String], default: [] },
  location: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: 'India' },
  pincode: { type: String },
  deity: { type: String },
  establishedYear: { type: String },
  templeType: { type: String },
  speciality: { type: String },
  categories: { type: [String], default: [] },
  timings: { type: String },
  contact: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  facebook: { type: String },
  instagram: { type: String },
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
