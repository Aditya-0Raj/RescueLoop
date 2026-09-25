import Donation from '../models/Donation.js';
import Rescue from '../models/Rescue.js';
import Driver from '../models/Driver.js';
import EventLog from '../models/EventLog.js';
import { ApiError } from '../utils/apiError.js';
import { findRescueCandidates } from './matchingService.js';
import { logEvent } from './eventService.js';

export async function buildRescuePlan(donation) {
  donation.status = 'Matching';
  await donation.save();

  const candidates = await findRescueCandidates(donation);
  const feasible = candidates.filter((candidate) => candidate.eligible);
  const primary = feasible[0] || null;
  const backup = feasible[1] || null;

  const rescue = await Rescue.create({
    donation: donation._id,
    primary: primary ? { recipient: primary.recipient._id, driver: primary.driver._id, score: primary.score } : undefined,
    backup: backup ? { recipient: backup.recipient._id, driver: backup.driver._id, score: backup.score } : undefined,
    activeAssignment: primary ? 'primary' : 'none',
    status: primary ? 'awaiting_commitments' : 'needs_manual_attention',
    estimatedPickupAt: primary ? new Date(Date.now() + primary.etaMinutes * 60000) : null,
    estimatedDeliveryAt: primary ? new Date(Date.now() + (primary.etaMinutes + 10) * 60000) : null,
    candidates: candidates.slice(0, 10).map((item) => ({
      recipient: item.recipient._id,
      driver: item.driver._id,
      eligible: item.eligible,
      score: item.score,
      distanceKm: item.distanceKm,
      deadlineSlackMinutes: item.deadlineSlackMinutes,
      reasons: item.reasons,
    })),
  });

  if (primary) {
    donation.status = 'Posted';
    await donation.save();
    await logEvent({
      rescueId: rescue._id,
      donationId: donation._id,
      type: 'MATCH_CREATED',
      message: 'Donation posted and passed the deterministic safety gate; primary and backup rescue candidates prepared',
      actorRole: 'donor',
    });
  } else {
    donation.status = 'Needs Manual Attention';
    await donation.save();
    await logEvent({
      rescueId: rescue._id,
      donationId: donation._id,
      type: 'NO_FEASIBLE_PLAN',
      message: 'No feasible recipient + driver combination passed the hard constraints',
    });
  }

  return getRescueById(rescue.publicId);
}

export async function getRescueById(publicId) {
  const rescue = await Rescue.findOne({ publicId })
    .populate({ path: 'donation', populate: { path: 'donor', select: 'name email' } })
    .populate({ path: 'primary.recipient', populate: { path: 'user', select: 'name email' } })
    .populate({ path: 'primary.driver', populate: { path: 'user', select: 'name email' } })
    .populate({ path: 'backup.recipient', populate: { path: 'user', select: 'name email' } })
    .populate({ path: 'backup.driver', populate: { path: 'user', select: 'name email' } })
    .populate('candidates.recipient', 'publicId organizationName location capacity acceptedFoodTypes')
    .populate('candidates.driver', 'publicId currentLocation onDuty');

  if (!rescue) return null;
  const events = await EventLog.find({ rescue: rescue._id }).sort({ createdAt: 1 }).lean();
  return { ...rescue.toObject(), events: events.map((event) => ({
    id: event._id,
    time: event.createdAt,
    text: event.message,
    type: event.type,
    actorRole: event.actorRole,
  })) };
}

export async function markRecipientCommit(rescue, recipientId) {
  if (rescue.primary.recipient?.toString() !== recipientId.toString()) {
    throw new ApiError(400, 'This recipient is not the active primary assignment');
  }

  rescue.primaryRecipientCommitted = true;
  rescue.status = rescue.primaryDriverCommitted ? 'secured' : 'awaiting_driver';
  await rescue.save();

  const donation = await Donation.findById(rescue.donation);
  if (rescue.primaryDriverCommitted) {
    donation.status = 'Secured';
    await donation.save();
  } else {
    donation.status = 'Recipient Confirmed';
    await donation.save();
  }

  await logEvent({
    rescueId: rescue._id,
    donationId: donation._id,
    type: 'RECIPIENT_COMMITTED',
    message: 'Primary recipient confirmed acceptance',
    actorRole: 'recipient',
  });

  return getRescueById(rescue.publicId);
}

export async function markDriverCommit(rescue, driverId) {
  if (rescue.primary.driver?.toString() !== driverId.toString()) {
    throw new ApiError(400, 'This driver is not the active primary assignment');
  }

  rescue.primaryDriverCommitted = true;
  rescue.status = rescue.primaryRecipientCommitted ? 'secured' : 'awaiting_recipient';
  await rescue.save();

  await Driver.findByIdAndUpdate(driverId, { activeRescue: rescue._id });
  const donation = await Donation.findById(rescue.donation);

  if (rescue.primaryRecipientCommitted) {
    donation.status = 'Secured';
    await donation.save();
  }

  await logEvent({
    rescueId: rescue._id,
    donationId: donation._id,
    type: 'DRIVER_COMMITTED',
    message: 'Primary driver accepted the rescue job',
    actorRole: 'driver',
  });

  return getRescueById(rescue.publicId);
}
