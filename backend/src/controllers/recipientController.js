import Recipient from '../models/Recipient.js';
import Donation from '../models/Donation.js';
import Rescue from '../models/Rescue.js';
import { markRecipientCommit } from '../services/rescueEngine.js';
import { ApiError } from '../utils/apiError.js';
import { logEvent } from '../services/eventService.js';

export async function getRecipients(_req, res) {
  const recipients = await Recipient.find().populate('user', 'name email').sort({ accepting: -1, updatedAt: -1 });
  res.json({ success: true, data: recipients });
}

export async function getMyRecipient(req, res) {
  const recipient = await Recipient.findOne({ user: req.user._id }).populate('user', 'name email');
  if (!recipient) throw new ApiError(404, 'Recipient profile not found');
  res.json({ success: true, data: recipient });
}

export async function updateCapacity(req, res) {
  const recipient = await Recipient.findOne({ user: req.user._id });
  if (!recipient) throw new ApiError(404, 'Recipient profile not found');
  Object.assign(recipient, {
    accepting: req.body.accepting ?? recipient.accepting,
    capacity: req.body.capacity ?? recipient.capacity,
    capacityUnit: req.body.capacityUnit ?? recipient.capacityUnit,
    acceptedFoodTypes: req.body.acceptedFoodTypes ?? recipient.acceptedFoodTypes,
    storageAvailable: req.body.storageAvailable ?? recipient.storageAvailable,
    openUntil: req.body.openUntil ? new Date(req.body.openUntil) : recipient.openUntil,
    lastCapacityUpdatedAt: new Date(),
  });
  await recipient.save();
  res.json({ success: true, data: recipient });
}

export async function incomingDonations(req, res) {
  const recipient = await Recipient.findOne({ user: req.user._id });
  if (!recipient) throw new ApiError(404, 'Recipient profile not found');

  const rescues = await Rescue.find({
    'primary.recipient': recipient._id,
    status: { $in: ['awaiting_commitments', 'awaiting_driver', 'secured'] },
  }).select('donation').lean();

  const donationIds = rescues.map((item) => item.donation);
  const donations = await Donation.find({
    _id: { $in: donationIds },
    status: { $in: ['Posted', 'Matching', 'Recipient Confirmed'] },
    safeUntil: { $gt: new Date() },
  }).sort({ safeUntil: 1 });

  const filtered = donations.filter((donation) => (
    recipient.accepting
    && recipient.capacity >= donation.quantity
    && (recipient.acceptedFoodTypes.length === 0 || recipient.acceptedFoodTypes.some((type) => String(donation.foodType).toLowerCase().includes(String(type).toLowerCase())))
  ));

  res.json({ success: true, data: filtered });
}


export async function acceptedDonations(req, res) {
  const recipient = await Recipient.findOne({ user: req.user._id });
  if (!recipient) throw new ApiError(404, 'Recipient profile not found');
  const rescues = await Rescue.find({
    $and: [
      { $or: [{ 'primary.recipient': recipient._id }, { 'backup.recipient': recipient._id }] },
      { $or: [{ primaryRecipientCommitted: true }, { activeAssignment: 'backup' }] },
    ],
  }).populate({ path: 'donation', populate: { path: 'donor', select: 'name email' } }).sort({ updatedAt: -1 });
  res.json({ success: true, data: rescues.map((rescue) => rescue.donation) });
}

export async function acceptDonation(req, res) {
  const recipient = await Recipient.findOne({ user: req.user._id });
  if (!recipient) throw new ApiError(404, 'Recipient profile not found');
  const donation = await Donation.findOne({ publicId: req.params.donationId });
  if (!donation) throw new ApiError(404, 'Donation not found');
  const rescue = await Rescue.findOne({ donation: donation._id });
  if (!rescue) throw new ApiError(404, 'Rescue plan not found');
  const updated = await markRecipientCommit(rescue, recipient._id);
  res.json({ success: true, data: updated });
}

export async function declineDonation(req, res) {
  const recipient = await Recipient.findOne({ user: req.user._id });
  const donation = await Donation.findOne({ publicId: req.params.donationId });
  const rescue = donation ? await Rescue.findOne({ donation: donation._id }) : null;
  if (!recipient || !donation || !rescue) throw new ApiError(404, 'Donation/rescue not found');
  await logEvent({ rescueId: rescue._id, donationId: donation._id, type: 'RECIPIENT_DECLINED', message: 'Primary recipient declined the donation', actorRole: 'recipient' });
  res.json({ success: true, data: { declined: true } });
}
