// models/Darshan.ts
import mongoose, { Schema, models } from 'mongoose';

const DarshanSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  temple: { type: String },
  media: { type: String },
  time: { type: String },
  date: { type: String },
  video: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default models.Darshan || mongoose.model('Darshan', DarshanSchema);
