import mongoose, { Schema, Model, models } from 'mongoose'

const JourneySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ['custom', 'jyotirlinga', 'char-dham', 'shakti-peeth', 'chota-char-dham', 'panch-kedar', 'divya-desam', 'ashta-vinayak'],
    default: 'custom',
  },
  temples: [{
    templeId: { type: Schema.Types.ObjectId, ref: 'Temple' },
    title: { type: String },
    visited: { type: Boolean, default: false },
    visitedAt: { type: Date },
    notes: { type: String },
    order: { type: Number, default: 0 },
  }],
  isPublic: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Journey = (models.Journey as any) || (mongoose.model as any)('Journey', JourneySchema)
export default Journey as Model<any>
