// models/Darshan.ts
import mongoose, { Schema, models } from 'mongoose';
import { MediaAssetSchema } from './shared/MediaAssetSchema';

const DarshanSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  titleHi: { type: String },
  description: { type: String },
  descriptionHi: { type: String },
  temple: { type: String },
  templeName: { type: String },
  templeNameHi: { type: String },
  deity: { type: String },
  deityHi: { type: String },
  location: { type: String },
  city: { type: String },
  state: { type: String },
  media: { type: String },
  thumbnail: { type: String },
  image: { type: String },
  primaryMedia: { type: MediaAssetSchema },
  cardMedia: { type: MediaAssetSchema },
  heroMedia: { type: MediaAssetSchema },
  ogMedia: { type: MediaAssetSchema },
  galleryMedia: { type: [MediaAssetSchema], default: [] },
  imageCard: { type: String },
  imageHero: { type: String },
  time: { type: String },
  date: { type: String },
  schedule: { type: String },
  darshanDate: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  repeatDays: [{ type: String }],
  scheduleRule: { type: String, enum: ['one-time', 'recurring'], default: 'one-time' },
  timezone: { type: String, default: 'Asia/Kolkata' },
  festivalTag: { type: String },
  video: { type: String },
  videoUrl: { type: String },
  youtubeUrl: { type: String },
  youtubeId: { type: String },
  provider: { type: String, enum: ['youtube', 'direct', 'other'], default: 'other' },
  contentType: { type: String, enum: ['photo', 'video', 'live'], default: 'photo' },
  isLive: { type: Boolean, default: false },
  darshanType: { type: String, enum: ['live', 'recorded', 'upcoming'], default: 'recorded' },
  streamStatus: { type: String, enum: ['unknown', 'online', 'offline', 'ended'], default: 'unknown' },
  lastStreamCheckAt: { type: Date },
  type: { type: String, enum: ['live', 'recorded', 'upcoming'], default: 'recorded' },
  priority: { type: Number, default: 999 },
  featured: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  templeSlug: { type: String },
  deitySlug: { type: String },
  relatedDevotionalSlug: { type: String },
  externalUrl: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  ogImage: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'draft', 'approved', 'pending', 'rejected'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

DarshanSchema.index({ status: 1, createdAt: -1 });
DarshanSchema.index({ status: 1, darshanType: 1, createdAt: -1 });
DarshanSchema.index({ status: 1, contentType: 1, createdAt: -1 });
DarshanSchema.index({ status: 1, templeSlug: 1, createdAt: -1 });
DarshanSchema.index({ status: 1, deitySlug: 1, createdAt: -1 });
DarshanSchema.index({ status: 1, state: 1, createdAt: -1 });
DarshanSchema.index({ status: 1, isFeatured: -1, priority: 1, createdAt: -1 });

const DarshanModel: any = models.Darshan || mongoose.model('Darshan', DarshanSchema as any);
export default DarshanModel;
