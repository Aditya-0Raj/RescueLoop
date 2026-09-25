import mongoose from 'mongoose';
import { createPublicId } from '../utils/id.js';

const rescueSchema = new mongoose.Schema({
  publicId: { type: String, unique: true, index: true, default: () => createPublicId('RES') },
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true, unique: true },
  primary: {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient', default: null },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
    score: Number,
  },
  backup: {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient', default: null },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
    score: Number,
  },
  primaryRecipientCommitted: { type: Boolean, default: false },
  primaryDriverCommitted: { type: Boolean, default: false },
  activeAssignment: { type: String, enum: ['primary', 'backup', 'none'], default: 'primary' },
  status: { type: String, default: 'planned' },
  candidates: [{
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipient' },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    eligible: Boolean,
    score: Number,
    distanceKm: Number,
    deadlineSlackMinutes: Number,
    reasons: [String],
  }],
  failoverCount: { type: Number, default: 0 },
  lastFailoverReason: String,
  estimatedPickupAt: Date,
  estimatedDeliveryAt: Date,
}, { timestamps: true });

export default mongoose.model('Rescue', rescueSchema);
