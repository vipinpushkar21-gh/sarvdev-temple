// models/Event.ts
import mongoose, { Schema, models } from 'mongoose';

const EVENT_STATUS_VALUES = ['draft', 'published', 'archived', 'pending', 'approved', 'rejected'];

const EventSchema = new Schema({
  title: { type: String, required: true },
  titleHi: { type: String },
  slug: { type: String, index: true },
  description: { type: String },
  descriptionHi: { type: String },
  shortDescription: { type: String },
  shortDescriptionHi: { type: String },
  category: { type: String },
  eventType: { type: String },

  date: { type: String },
  endDate: { type: String },
  startDate: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  timezone: { type: String, default: 'Asia/Kolkata' },
  isAllDay: { type: Boolean, default: true },
  recurrence: { type: String },
  lunarDate: { type: String },
  tithi: { type: String },
  paksha: { type: String },
  hinduMonth: { type: String },
  month: { type: String },
  year: { type: Number },

  location: { type: String },
  locationName: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String, default: 'India' },
  latitude: { type: Number },
  longitude: { type: Number },
  mapsLink: { type: String },
  isOnline: { type: Boolean, default: false },
  liveUrl: { type: String },

  temple: { type: String },
  templeSlug: { type: String },
  templeName: { type: String },
  deitySlug: { type: String },
  deityName: { type: String },
  relatedTempleIds: { type: [String], default: [] },
  relatedDeityIds: { type: [String], default: [] },
  relatedDevotionalSlugs: { type: [String], default: [] },

  image: { type: String },
  imageCard: { type: String },
  imageHero: { type: String },
  galleryImages: { type: [String], default: [] },
  videoUrl: { type: String },

  status: { type: String, enum: EVENT_STATUS_VALUES, default: 'draft' },
  featured: { type: Boolean, default: false },
  priority: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  source: { type: String },

  festivalName: { type: String },
  festivalNameHi: { type: String },
  rituals: { type: [String], default: [] },
  ritualsHi: { type: [String], default: [] },
  significance: { type: String },
  significanceHi: { type: String },
  fastingInfo: { type: String },
  fastingInfoHi: { type: String },
  pujaVidhi: { type: String },
  pujaVidhiHi: { type: String },
  crowdLevel: { type: String },
  bestTimeToVisit: { type: String },
  highlights: { type: [String], default: [] },

  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  ogImage: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const existingEventModel = models.Event as mongoose.Model<any> | undefined
const existingStatusEnum = (existingEventModel as any)?.schema?.path('status')?.options?.enum as string[] | undefined

if (existingEventModel && !existingStatusEnum?.includes('published')) {
  mongoose.deleteModel('Event')
}

const EventModel: mongoose.Model<any> = (models.Event as mongoose.Model<any>) || mongoose.model<any>('Event', EventSchema as any)

export default EventModel
