import Donation from '../models/Donation.js';
import Rescue from '../models/Rescue.js';
import { runSafetyGate } from '../services/safetyService.js';
import { buildRescuePlan } from '../services/rescueEngine.js';
import { normalizeDonationPayload } from '../validators/donationValidator.js';
import { ApiError } from '../utils/apiError.js';
import { logEvent } from '../services/eventService.js';
import EventLog from '../models/EventLog.js';

export async function createDonation(req, res) {
  const payload = normalizeDonationPayload(req.body);
  const safety = runSafetyGate(payload);
  if (safety.status === 'rejected') throw new ApiError(400, 'Donation failed the safety gate', safety.reasons);
  if (!req.user) throw new ApiError(401, 'Donor authentication required');
  if (req.user.role !== 'donor') throw new ApiError(403, 'Only donors can create donations');

  const donation = await Donation.create({
    ...payload,
    donor: req.user._id,
    safety: { status: safety.status, checkedAt: new Date(), reasons: safety.reasons },
    status: 'Posted',
  });

  const rescue = await buildRescuePlan(donation);
  res.status(201).json({ success: true, data: { donation: await Donation.findById(donation._id).populate('donor', 'name email'), rescue } });
}

export async function getMyDonations(req, res) {
  if (!req.user) throw new ApiError(401, 'Authentication required');
  const donations = await Donation.find({ donor: req.user._id }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: donations });
}

export async function getDonationById(req, res) {
  const donation = await Donation.findOne({ publicId: req.params.id }).populate('donor', 'name email');
  if (!donation) throw new ApiError(404, 'Donation not found');
  const rescue = await Rescue.findOne({ donation: donation._id }).populate('primary.recipient').populate('primary.driver').populate('backup.recipient').populate('backup.driver');
  const events = rescue ? await EventLog.find({ rescue: rescue._id }).sort({ createdAt: 1 }).lean() : [];
  res.json({ success: true, data: { donation, rescue, events } });
}
