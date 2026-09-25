import User from '../models/User.js';
import { ApiError } from '../utils/apiError.js';
import { createPublicId } from '../utils/id.js';
import { signUser } from '../middleware/auth.js';

export async function demoLogin(req, res) {
  const role = req.body.role;
  if (!['donor', 'recipient', 'driver', 'operations'].includes(role)) throw new ApiError(400, 'Invalid role');

  const email = (req.body.email || `${role}@rescueloop.local`).toLowerCase();
  const user = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { publicId: createPublicId('USR'), name: req.body.name || `Demo ${role}`, email, role } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const token = signUser(user);
  res.json({ success: true, data: { token, user } });
}

export async function me(req, res) {
  if (!req.user) throw new ApiError(401, 'Authentication required');
  res.json({ success: true, data: req.user });
}
