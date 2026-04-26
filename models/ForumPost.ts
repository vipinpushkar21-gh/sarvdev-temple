// models/ForumPost.ts
import mongoose, { Schema, models } from 'mongoose'

const ReplySchema = new Schema({
  content: { type: String, required: true },
  authorName: { type: String, default: 'Anonymous' },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

const ForumPostSchema = new Schema({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['general', 'temples', 'festivals', 'devotionals', 'rituals', 'questions'],
    default: 'general',
  },
  authorName: { type: String, default: 'Anonymous' },
  authorEmail: { type: String },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
  tags: { type: [String], default: [] },
  replies: { type: [ReplySchema], default: [] },
  createdAt: { type: Date, default: Date.now },
})

export default models.ForumPost || mongoose.model('ForumPost', ForumPostSchema)
