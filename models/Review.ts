import mongoose, { Schema, models } from 'mongoose'

const ReviewSchema = new Schema({
  templeSlug: { type: String, required: true, index: true },
  name:       { type: String, required: true, maxlength: 80 },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  comment:    { type: String, required: true, maxlength: 1000 },
  userId:     { type: Schema.Types.ObjectId, ref: 'User' },
  verified:   { type: Boolean, default: false },
  status:     { type: String, enum: ['published', 'pending', 'rejected'], default: 'published' },
  photos:     [{ type: String }],
  helpful:    { type: Number, default: 0 },
  createdAt:  { type: Date, default: Date.now },
})

export default models.Review || mongoose.model('Review', ReviewSchema)
