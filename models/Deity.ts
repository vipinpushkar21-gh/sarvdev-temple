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
  imageCard: { type: String },
  imageHero: { type: String },
  images: { type: [String], default: [] },
  category: { type: String }, // Tridev, Tridevi, etc. (legacy - single category)
  categoryId: { type: String }, // For linking to category (legacy)
  categories: { type: [String], default: [] }, // NEW: Multiple categories - array of category IDs
  categoryIds: { type: [String], default: [] }, // NEW: Multiple category IDs
  slug: { type: String, required: true, unique: true },
  staticSlug: { type: String, index: true },
  slugAliases: { type: [String], default: [] },
  order: { type: Number, default: 0 }, // To maintain sequence
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  ogImage: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  source: { type: String, enum: ['seeded', 'manual', 'imported', 'public-submission', 'legacy'], default: 'manual' },
  isCustomized: { type: Boolean, default: false },
  customizedAt: { type: Date },
  updatedBy: { type: String },
  lastSeededAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
} as any);

const ExistingDeityModel: any = (mongoose.models as any).Deity || (models.Deity as any);
if (ExistingDeityModel && (!ExistingDeityModel.schema.path('source') || !ExistingDeityModel.schema.path('staticSlug'))) {
  delete (mongoose.models as any).Deity;
}

const Deity: any = (mongoose.models as any).Deity || mongoose.model<any>('Deity', DeitySchema as any);

export default Deity;
