// models/Devotional.ts
import mongoose from 'mongoose';
import { MediaAssetSchema } from './shared/MediaAssetSchema';
import { isValidMantraSubcategory } from '../lib/mantra-subcategories';
import { isValidNamavaliSubcategory } from '../lib/namavali-subcategories';

const DevotionalSchema = new mongoose.Schema({
  // Core identity
  title:           { type: String, required: true },
  titleHi:         String,
  slug:            { type: String, index: true },

  // Category (canonical)
  category:        { type: String, default: 'Other' },
  categorySlug:    { type: String, index: true },
  categoryHi:      String,
  subcategory:     {
    type: String,
    validate: {
      validator(this: { category?: string }, value?: string) {
        // Other categories retain their existing independent subcategory systems.
        if (this.category === 'Mantra') return isValidMantraSubcategory(value);
        if (this.category === 'Namavali' || this.category === '108 Namavali' || this.category === 'Sahasranamavali') return isValidNamavaliSubcategory(value);
        return true;
      },
      message: 'Invalid devotional subcategory: "{VALUE}"',
    },
  },

  // Set by the migration when a legacy Mantra cannot be mapped with confidence.
  subcategoryReviewRequired: { type: Boolean, default: false },
  subcategoryReviewReason: String,

  // Deity (canonical)
  deity:           String,
  deityHi:         String,
  deitySlug:       { type: String, index: true },

  // Content
  description:     String,
  descriptionHi:   String,
  content:         String,
  contentHi:       String,
  lyrics:          String,

  // Media
  audioUrl:        String,
  audio:           String,
  duration:        String,
  artist:          String,

  // Images (legacy)
  image:           String,
  primaryMedia:    { type: MediaAssetSchema },
  cardMedia:       { type: MediaAssetSchema },
  heroMedia:       { type: MediaAssetSchema },
  ogMedia:         { type: MediaAssetSchema },
  galleryMedia:    { type: [MediaAssetSchema], default: [] },
  imageCard:       String,
  imageHero:       String,
  ogImage:         String,

  // Classification
  language:        { type: String, default: 'Hindi' },
  tags:            [String],
  featured:        { type: Boolean, default: false },

  // Admin / provenance
  source:          String,
  isCustomized:    Boolean,
  status:          { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  // SEO
  metaTitle:       String,
  metaDescription: String,
  metaKeywords:    String,

  // Timestamps
  createdAt:       { type: Date, default: Date.now },
  updatedAt:       { type: Date, default: Date.now },
});

// Compound indexes for scalable filtered queries
DevotionalSchema.index({ status: 1, categorySlug: 1, createdAt: -1 });
DevotionalSchema.index({ status: 1, deitySlug:    1, createdAt: -1 });
DevotionalSchema.index({ status: 1, featured:     1, createdAt: -1 });

// @ts-ignore
const Devotional: mongoose.Model<any> = mongoose.models.Devotional || mongoose.model('Devotional', DevotionalSchema);
export default Devotional;
