// models/Temple.ts
import mongoose, { Schema, models } from 'mongoose';

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
  timingSlots: { type: [String], default: [] },
  festivals: { type: [{ name: { type: String }, description: { type: String } }], default: [] },
  contact: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verified: { type: String, enum: ['verified', 'not-verified'], default: 'not-verified' },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  ogImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default models.Temple || mongoose.model('Temple', TempleSchema);
