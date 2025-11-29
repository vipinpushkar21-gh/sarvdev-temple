// models/Event.ts
import mongoose, { Schema, models } from 'mongoose';

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  temple: { type: String },
  date: { type: String },
  location: { type: String },
  image: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default models.Event || mongoose.model('Event', EventSchema);
