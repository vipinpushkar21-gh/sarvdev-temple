// models/Blog.ts
import mongoose, { Schema, Model, Document } from 'mongoose';

interface IBlog extends Document {
  title: string;
  excerpt?: string;
  date?: string;
  image?: string;
  body?: string;
  slug?: string;
  author?: string;
  tags?: string;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  createdAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  excerpt: { type: String },
  date: { type: String },
  image: { type: String },
  body: { type: String },
  slug: { type: String },
  author: { type: String },
  tags: { type: String },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  ogImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
