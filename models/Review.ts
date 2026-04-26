import mongoose, { Schema, models } from 'mongoose'

const ReviewSchema = new Schema({
  templeSlug: { type: String, required: true, index: true },
  name:       { type: String, required: true, maxlength: 80 },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  comment:    { type: String, required: true, maxlength: 1000 },
  createdAt:  { type: Date, default: Date.now },
})

export default models.Review || mongoose.model('Review', ReviewSchema)
