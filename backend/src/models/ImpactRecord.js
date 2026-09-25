import mongoose from 'mongoose';

const impactRecordSchema = new mongoose.Schema({
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true, unique: true },
  rescue: { type: mongoose.Schema.Types.ObjectId, ref: 'Rescue', required: true },
  quantity: Number,
  unit: String,
  estimatedMeals: Number,
  estimatedCo2eKg: Number,
  backupSave: { type: Boolean, default: false },
  onTime: { type: Boolean, default: false },
  deliveredAt: Date,
}, { timestamps: true });

export default mongoose.model('ImpactRecord', impactRecordSchema);
