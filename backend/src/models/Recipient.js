import mongoose from 'mongoose';
import { createPublicId } from '../utils/id.js';

const recipientSchema = new mongoose.Schema({
  publicId: { type: String, unique: true, index: true, default: () => createPublicId('NGO') },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  organizationName: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: { lat: Number, lng: Number },
  accepting: { type: Boolean, default: false, index: true },
  capacity: { type: Number, default: 0, min: 0 },
  capacityUnit: { type: String, enum: ['kg', 'portions', 'boxes', 'pieces'], default: 'kg' },
  acceptedFoodTypes: { type: [String], default: [] },
  storageAvailable: { type: [String], default: [] },
  openUntil: Date,
  partnerKey: String,
  lastCapacityUpdatedAt: Date,
}, { timestamps: true });

export default mongoose.model('Recipient', recipientSchema);
