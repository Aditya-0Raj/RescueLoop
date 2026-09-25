import Donation from '../models/Donation.js';
import Rescue from '../models/Rescue.js';
import Driver from '../models/Driver.js';
import { ApiError } from '../utils/apiError.js';
import { generateOtp } from '../utils/otp.js';
import { logEvent } from './eventService.js';
import { recordImpact } from './impactService.js';

export async function generatePickupOtp(publicId) {
  const rescue = await Rescue.findOne({ publicId });
  if (!rescue) throw new ApiError(404, 'Rescue not found');
  const donation = await Donation.findById(rescue.donation);
  donation.pickupOtp = generateOtp();
  await donation.save();
  await logEvent({ rescueId: rescue._id, donationId: donation._id, type: 'PICKUP_OTP_CREATED', message: 'Pickup OTP generated for donor handoff' });
  return { otp: donation.pickupOtp };
}

export async function verifyPickupOtp(publicId, otp) {
  const rescue = await Rescue.findOne({ publicId });
  if (!rescue) throw new ApiError(404, 'Rescue not found');
  const donation = await Donation.findById(rescue.donation);
  if (!donation.pickupOtp || donation.pickupOtp !== String(otp)) throw new ApiError(400, 'Pickup OTP is incorrect');
  donation.status = 'Picked Up';
  donation.pickedUpAt = new Date();
  donation.pickupOtp = undefined;
  await donation.save();
  await logEvent({ rescueId: rescue._id, donationId: donation._id, type: 'PICKUP_VERIFIED', message: 'Pickup verified by OTP', actorRole: 'driver' });
  return donation;
}

export async function generateDeliveryOtp(publicId) {
  const rescue = await Rescue.findOne({ publicId });
  if (!rescue) throw new ApiError(404, 'Rescue not found');
  const donation = await Donation.findById(rescue.donation);
  donation.deliveryOtp = generateOtp();
  await donation.save();
  await logEvent({ rescueId: rescue._id, donationId: donation._id, type: 'DELIVERY_OTP_CREATED', message: 'Delivery OTP generated for recipient handoff' });
  return { otp: donation.deliveryOtp };
}

export async function verifyDeliveryOtp(publicId, otp) {
  const rescue = await Rescue.findOne({ publicId });
  if (!rescue) throw new ApiError(404, 'Rescue not found');
  const donation = await Donation.findById(rescue.donation);
  if (donation.status !== 'Picked Up') throw new ApiError(400, 'Pickup must be verified before delivery');
  if (!donation.deliveryOtp || donation.deliveryOtp !== String(otp)) throw new ApiError(400, 'Delivery OTP is incorrect');

  donation.status = 'Delivered';
  donation.deliveredAt = new Date();
  donation.deliveryOtp = undefined;
  await donation.save();
  rescue.status = 'delivered';
  const activeDriverId = rescue.activeAssignment === 'backup' ? rescue.backup?.driver : rescue.primary?.driver;
  if (activeDriverId) await Driver.findByIdAndUpdate(activeDriverId, { activeRescue: null });
  await rescue.save();
  await logEvent({ rescueId: rescue._id, donationId: donation._id, type: 'DELIVERY_VERIFIED', message: 'Delivery verified by OTP', actorRole: 'driver' });
  await recordImpact({ donation, rescue });
  return donation;
}
