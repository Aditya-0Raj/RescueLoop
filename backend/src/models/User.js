import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  publicId: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: ['donor', 'recipient', 'driver', 'operations'], required: true, index: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
