// models/Blog.ts
import mongoose, { Schema, Model, Document } from 'mongoose';

interface IBlog extends Document {
  title: string;
  excerpt?: string;
  date?: string;
  image?: string;
  body?: string;
  createdAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  excerpt: { type: String },
  date: { type: String },
  image: { type: String },
  body: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
