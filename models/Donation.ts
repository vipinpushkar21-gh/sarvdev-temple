// models/Donation.ts
import mongoose, { Schema, models } from 'mongoose';

const DonationSchema = new Schema({
  name: { type: String },
  email: { type: String },
  amount: { type: Number, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default models.Donation || mongoose.model('Donation', DonationSchema);
