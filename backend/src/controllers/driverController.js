import Driver from '../models/Driver.js';
import Rescue from '../models/Rescue.js';
import { markDriverCommit } from '../services/rescueEngine.js';
import { activateFailover } from '../services/failoverService.js';
import { ApiError } from '../utils/apiError.js';

export async function getMyDriver(req, res) {
  const driver = await Driver.findOne({ user: req.user._id }).populate('user', 'name email');
  if (!driver) throw new ApiError(404, 'Driver profile not found');
  res.json({ success: true, data: driver });
}

export async function updateDuty(req, res) {
  const driver = await Driver.findOne({ user: req.user._id });
  if (!driver) throw new ApiError(404, 'Driver profile not found');
  driver.onDuty = Boolean(req.body.onDuty);
  driver.availableUntil = req.body.availableUntil ? new Date(req.body.availableUntil) : null;
  driver.currentLocation = req.body.currentLocation || driver.currentLocation;
  driver.lastDutyUpdatedAt = new Date();
  await driver.save();
  res.json({ success: true, data: driver });
}

export async function getJobs(req, res) {
  const driver = await Driver.findOne({ user: req.user._id });
  if (!driver) throw new ApiError(404, 'Driver profile not found');
  const jobs = await Rescue.find({
    $or: [
      { 'primary.driver': driver._id, status: { $in: ['awaiting_commitments', 'awaiting_recipient', 'awaiting_driver', 'secured'] } },
      { 'backup.driver': driver._id, activeAssignment: 'backup' },
    ],
  }).populate('donation').populate('primary.recipient').populate('backup.recipient').sort({ createdAt: -1 });
  res.json({ success: true, data: jobs });
}


export async function getHistory(req, res) {
  const driver = await Driver.findOne({ user: req.user._id });
  if (!driver) throw new ApiError(404, 'Driver profile not found');
  const jobs = await Rescue.find({
    $or: [
      { 'primary.driver': driver._id },
      { 'backup.driver': driver._id },
    ],
    status: 'delivered',
  }).populate('donation').populate('primary.recipient').populate('backup.recipient').sort({ updatedAt: -1 });
  res.json({ success: true, data: jobs });
}

export async function acceptJob(req, res) {
  const driver = await Driver.findOne({ user: req.user._id });
  const rescue = await Rescue.findOne({ publicId: req.params.rescueId });
  if (!driver || !rescue) throw new ApiError(404, 'Driver or rescue not found');
  const updated = await markDriverCommit(rescue, driver._id);
  res.json({ success: true, data: updated });
}

export async function declineJob(req, res) {
  const driver = await Driver.findOne({ user: req.user._id });
  const rescue = await Rescue.findOne({ publicId: req.params.rescueId });
  if (!driver || !rescue) throw new ApiError(404, 'Driver or rescue not found');
  const updated = await activateFailover(rescue.publicId, 'Primary driver declined the job');
  res.json({ success: true, data: updated });
}
