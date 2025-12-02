// models/Temple.ts
import mongoose, { Schema, models } from 'mongoose';

const TempleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  location: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  deity: { type: String },
  establishedYear: { type: String },
  templeType: { type: String },
  speciality: { type: String },
  timings: { type: String },
  contact: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  facebook: { type: String },
  instagram: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default models.Temple || mongoose.model('Temple', TempleSchema);
