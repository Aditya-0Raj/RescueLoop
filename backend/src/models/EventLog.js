import mongoose from 'mongoose';

const eventLogSchema = new mongoose.Schema({
  rescue: { type: mongoose.Schema.Types.ObjectId, ref: 'Rescue', required: true, index: true },
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true, index: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  actorRole: { type: String, enum: ['system', 'donor', 'recipient', 'driver', 'operations'], default: 'system' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.model('EventLog', eventLogSchema);
