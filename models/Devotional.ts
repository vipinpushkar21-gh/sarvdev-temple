// models/Devotional.ts
import mongoose from 'mongoose';

const DevotionalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, default: 'Other' },
  language: { type: String, default: 'Hindi' },
  deity: String,
  audio: String,
  lyrics: String,
  duration: String,
  artist: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

// @ts-ignore — Mongoose union-type complexity workaround
const Devotional: mongoose.Model<any> = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);
export default Devotional;
