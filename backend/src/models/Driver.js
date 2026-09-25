import mongoose from 'mongoose';
import { createPublicId } from '../utils/id.js';

const driverSchema = new mongoose.Schema({
  publicId: { type: String, unique: true, index: true, default: () => createPublicId('DRV') },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  vehicleType: { type: String, default: 'Two-wheeler' },
  vehicleCapacity: { type: Number, default: 35, min: 0 },
  onDuty: { type: Boolean, default: false, index: true },
  availableUntil: Date,
  currentLocation: { type: String, required: true },
  coordinates: { lat: Number, lng: Number },
  activeRescue: { type: mongoose.Schema.Types.ObjectId, ref: 'Rescue', default: null },
  lastDutyUpdatedAt: Date,
}, { timestamps: true });

export default mongoose.model('Driver', driverSchema);
