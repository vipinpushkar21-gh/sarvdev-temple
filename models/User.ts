// models/User.ts
import mongoose, { Schema, models } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true }, // scrypt hash
  role: {
    type: String,
    enum: ['guest', 'user', 'temple', 'pandit', 'admin'],
    default: 'user',
  },
  // For temple/pandit roles: pending = awaiting admin approval
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved', // users auto-approved; temple/pandit set to pending
  },
  phone: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  photo: { type: String },
  bio: { type: String },
  // Temple role extra
  templeId: { type: Schema.Types.ObjectId, ref: 'Temple' }, // claimed temple
  templeName: { type: String },
  designation: { type: String }, // e.g. "Pujari", "Manager", "Trustee"
  // Pandit role extra
  specialization: [{ type: String }], // e.g. ["Griha Pravesh", "Havan", "Vivah"]
  experience: { type: Number }, // years
  languages: [{ type: String }],
  services: [{ type: String }],
  // Admin notes
  adminNote: { type: String },
  approvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Prevent model recompilation in dev (Next.js hot reload)
export default models.User || mongoose.model('User', UserSchema)
