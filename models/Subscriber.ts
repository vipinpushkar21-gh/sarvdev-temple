// models/Subscriber.ts
import mongoose from 'mongoose'

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: String,
  source: { type: String, default: 'footer' },
  preferences: {
    temples: { type: Boolean, default: true },
    devotionals: { type: Boolean, default: true },
    events: { type: Boolean, default: true },
    blog: { type: Boolean, default: true },
    panchang: { type: Boolean, default: false },
  },
  status: { type: String, enum: ['active', 'unsubscribed', 'bounced'], default: 'active' },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date,
})

SubscriberSchema.index({ email: 1 })
SubscriberSchema.index({ status: 1 })

// @ts-ignore
const Subscriber: mongoose.Model<any> = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema)
export default Subscriber
