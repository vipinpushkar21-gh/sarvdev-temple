// models/Blog.ts
import mongoose, { Schema, Model, Document } from 'mongoose';

interface IBlog extends Document {
  title: string;
  titleHi?: string;
  slug?: string;
  excerpt?: string;
  excerptHi?: string;
  content?: string;
  contentHi?: string;
  body?: string;
  category?: string;
  tags?: string[] | string;
  date?: string;
  publishedAt?: Date;
  image?: string;
  imageCard?: string;
  imageHero?: string;
  ogImage?: string;
  author?: string;
  authorRole?: string;
  featured?: boolean;
  status?: string;
  readingTime?: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[] | string;
  canonicalUrl?: string;
  relatedTempleSlugs?: string[];
  relatedDeitySlugs?: string[];
  relatedDevotionalSlugs?: string[];
  imagePrompt?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  titleHi: { type: String },
  slug: { type: String, index: true },
  excerpt: { type: String },
  excerptHi: { type: String },
  content: { type: String },
  contentHi: { type: String },
  body: { type: String },
  category: { type: String, index: true },
  tags: { type: Schema.Types.Mixed, default: [] },
  date: { type: String },
  publishedAt: { type: Date },
  image: { type: String },
  imageCard: { type: String },
  imageHero: { type: String },
  author: { type: String },
  authorRole: { type: String },
  featured: { type: Boolean, default: false, index: true },
  status: { type: String, enum: ['draft', 'published', 'archived', 'approved', 'pending', 'rejected'], default: 'draft', index: true },
  readingTime: { type: Number },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: Schema.Types.Mixed, default: [] },
  ogImage: { type: String },
  canonicalUrl: { type: String },
  relatedTempleSlugs: [{ type: String }],
  relatedDeitySlugs: [{ type: String }],
  relatedDevotionalSlugs: [{ type: String }],
  imagePrompt: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
