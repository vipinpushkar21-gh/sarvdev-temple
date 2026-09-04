// models/Deity.ts
import mongoose, { Schema, models } from 'mongoose';
import { MediaAssetSchema } from './shared/MediaAssetSchema';

const DeitySchema = new Schema({
  name: { type: String, required: true },
  nameHi: { type: String, required: true },
  description: { type: String },
  descriptionHi: { type: String },
  mantra: { type: String },
  attributes: { type: [String], default: [] },
  image: { type: String },
  primaryMedia: { type: MediaAssetSchema },
  cardMedia: { type: MediaAssetSchema },
  heroMedia: { type: MediaAssetSchema },
  ogMedia: { type: MediaAssetSchema },
  galleryMedia: { type: [MediaAssetSchema], default: [] },
  imageCard: { type: String },
  imageHero: { type: String },
  images: { type: [String], default: [] },
  category: { type: String }, // Tridev, Tridevi, etc. (legacy - single category)
  categoryId: { type: String }, // For linking to category (legacy)
  categorySlug: { type: String, index: true },
  categoryName: { type: String },
  categoryNameHi: { type: String },
  categories: { type: [String], default: [] }, // NEW: Multiple categories - array of category IDs
  categoryIds: { type: [String], default: [] }, // NEW: Multiple category IDs
  aliases: { type: [String], default: [] },
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
if (ExistingDeityModel && (!ExistingDeityModel.schema.path('source') || !ExistingDeityModel.schema.path('staticSlug') || !ExistingDeityModel.schema.path('categorySlug'))) {
  delete (mongoose.models as any).Deity;
}

const Deity: any = (mongoose.models as any).Deity || mongoose.model<any>('Deity', DeitySchema as any);

export default Deity;
