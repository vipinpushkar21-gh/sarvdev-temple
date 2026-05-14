// models/Deity.ts
import mongoose, { Schema, models } from 'mongoose';

const DeitySchema = new Schema({
  name: { type: String, required: true },
  nameHi: { type: String, required: true },
  description: { type: String },
  descriptionHi: { type: String },
  mantra: { type: String },
  attributes: { type: [String], default: [] },
  image: { type: String },
  images: { type: [String], default: [] },
  category: { type: String }, // Tridev, Tridevi, etc.
  categoryId: { type: String }, // For linking to category
  slug: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 }, // To maintain sequence
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  ogImage: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default models.Deity || mongoose.model('Deity', DeitySchema);
