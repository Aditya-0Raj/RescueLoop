import mongoose from 'mongoose';
import { createPublicId } from '../utils/id.js';

const donationSchema = new mongoose.Schema({
  publicId: { type: String, unique: true, index: true, default: () => createPublicId('DON') },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  foodName: { type: String, required: true, trim: true },
  foodType: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, enum: ['kg', 'portions', 'boxes', 'pieces'], default: 'kg' },
  dietaryType: { type: String, enum: ['Vegetarian', 'Non-vegetarian', 'Mixed', 'Packaged'], default: 'Vegetarian' },
  readyAt: { type: Date, required: true },
  safeUntil: { type: Date, required: true, index: true },
  storageState: { type: String, enum: ['Hot-held', 'Refrigerated', 'Ambient', 'Frozen'], required: true },
  location: { type: String, required: true, trim: true },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  notes: { type: String, trim: true },
  safety: {
    status: { type: String, enum: ['passed', 'urgent', 'rejected'], default: 'passed' },
    checkedAt: Date,
    reasons: [String],
  },
  status: {
    type: String,
    enum: ['Posted', 'Matching', 'Recipient Confirmed', 'Secured', 'Re-routing', 'Picked Up', 'Delivered', 'Needs Manual Attention', 'Failed', 'Expired'],
    default: 'Posted',
    index: true,
  },
  pickupOtp: String,
  deliveryOtp: String,
  pickedUpAt: Date,
  deliveredAt: Date,
}, { timestamps: true });

export default mongoose.model('Donation', donationSchema);
