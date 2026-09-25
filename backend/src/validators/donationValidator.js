import { ApiError } from '../utils/apiError.js';

export function normalizeDonationPayload(body) {
  const quantity = Number(body.quantity);
  if (!Number.isFinite(quantity)) throw new ApiError(400, 'quantity must be a number');

  return {
    foodName: String(body.foodName || '').trim(),
    foodType: String(body.foodType || '').trim(),
    quantity,
    unit: body.unit || 'kg',
    dietaryType: body.dietaryType || 'Vegetarian',
    readyAt: body.readyAt ? new Date(body.readyAt) : new Date(),
    safeUntil: body.safeUntil ? new Date(body.safeUntil) : null,
    storageState: body.storageState || '',
    location: String(body.location || '').trim(),
    coordinates: body.coordinates?.lat != null && body.coordinates?.lng != null
      ? { lat: Number(body.coordinates.lat), lng: Number(body.coordinates.lng) }
      : undefined,
    notes: body.notes ? String(body.notes).trim() : '',
  };
}
