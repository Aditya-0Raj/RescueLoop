import { generatePickupOtp, verifyPickupOtp, generateDeliveryOtp, verifyDeliveryOtp } from '../services/trackingService.js';

export async function pickupOtp(req, res) {
  const data = await generatePickupOtp(req.params.id);
  res.json({ success: true, data });
}

export async function verifyPickup(req, res) {
  const donation = await verifyPickupOtp(req.params.id, req.body.otp);
  res.json({ success: true, data: donation });
}

export async function deliveryOtp(req, res) {
  const data = await generateDeliveryOtp(req.params.id);
  res.json({ success: true, data });
}

export async function verifyDelivery(req, res) {
  const donation = await verifyDeliveryOtp(req.params.id, req.body.otp);
  res.json({ success: true, data: donation });
}
