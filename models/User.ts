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
    enum: ['guest', 'admin'],
    default: 'guest',
  },
  createdAt: { type: Date, default: Date.now },
})

// Prevent model recompilation in dev (Next.js hot reload)
export default models.User || mongoose.model('User', UserSchema)
