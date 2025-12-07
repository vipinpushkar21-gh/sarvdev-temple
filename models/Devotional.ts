// models/Devotional.ts
import mongoose, { Schema, models } from 'mongoose';

const DevotionalSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Bhajan', 'Stotra', 'Aarti', 'Mantra', 'Chalisa', 'Stuti', 'Shloka', 'Ek Shloki', 'Ashtaka', 'Sahasranama', 'Path', 'Rashi', 'Vastu', 'Other'], default: 'Other' },
  language: { type: String, default: 'Hindi' },
  deity: { type: String },
  audio: { type: String },
  lyrics: { type: String },
  duration: { type: String },
  artist: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default models.Devotional || mongoose.model('Devotional', DevotionalSchema);
