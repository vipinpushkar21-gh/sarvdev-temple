// models/Visitor.ts
import mongoose, { Schema, models } from 'mongoose';

const VisitorSchema = new Schema({
  ip: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
  page: { type: String, default: '/' }
});

export default models.Visitor || mongoose.model('Visitor', VisitorSchema);