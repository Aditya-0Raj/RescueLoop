import Rescue from '../models/Rescue.js';
import EventLog from '../models/EventLog.js';
import { activateFailover } from '../services/failoverService.js';
import { getRescueById } from '../services/rescueEngine.js';
import { ApiError } from '../utils/apiError.js';


export async function listRescues(req, res) {
  const status = req.query.status;
  const query = {};
  if (status === 'active') query.status = { $nin: ['delivered', 'failed', 'needs_manual_attention'] };
  const rescues = await Rescue.find(query).sort({ updatedAt: -1 }).limit(50);
  res.json({ success: true, data: await Promise.all(rescues.map((item) => getRescueById(item.publicId))) });
}

export async function getRescue(req, res) {
  const rescue = await getRescueById(req.params.id);
  if (!rescue) throw new ApiError(404, 'Rescue not found');
  res.json({ success: true, data: rescue });
}

export async function failover(req, res) {
  const rescue = await activateFailover(req.params.id, req.body.reason || 'Manual demo failover');
  res.json({ success: true, data: rescue });
}

export async function timeline(req, res) {
  const rescue = await Rescue.findOne({ publicId: req.params.id });
  if (!rescue) throw new ApiError(404, 'Rescue not found');
  const events = await EventLog.find({ rescue: rescue._id }).sort({ createdAt: 1 });
  res.json({ success: true, data: events });
}
