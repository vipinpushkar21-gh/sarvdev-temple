// models/Temple.ts
import mongoose, { Schema, models } from 'mongoose';

const TempleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  location: { type: String },
  timings: { type: String },
  contact: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default models.Temple || mongoose.model('Temple', TempleSchema);
