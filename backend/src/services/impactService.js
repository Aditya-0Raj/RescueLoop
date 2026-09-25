import Donation from '../models/Donation.js';
import ImpactRecord from '../models/ImpactRecord.js';

function estimateMeals(quantity, unit) {
  if (unit === 'portions') return Math.round(quantity);
  if (unit === 'kg') return Math.max(1, Math.round(quantity * 4));
  if (unit === 'boxes') return Math.round(quantity * 2);
  return Math.round(quantity);
}

function estimateCo2e(quantity, unit) {
  const kg = unit === 'kg' ? quantity : quantity * 0.25;
  return Number((kg * 2.5).toFixed(2));
}

export async function recordImpact({ donation, rescue }) {
  const onTime = donation.deliveredAt && new Date(donation.deliveredAt) <= new Date(donation.safeUntil);
  const record = await ImpactRecord.findOneAndUpdate(
    { donation: donation._id },
    {
      rescue: rescue._id,
      quantity: donation.quantity,
      unit: donation.unit,
      estimatedMeals: estimateMeals(donation.quantity, donation.unit),
      estimatedCo2eKg: estimateCo2e(donation.quantity, donation.unit),
      backupSave: rescue.failoverCount > 0,
      onTime: Boolean(onTime),
      deliveredAt: donation.deliveredAt,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return record;
}

export async function getImpactDashboard() {
  const [records, delivered] = await Promise.all([
    ImpactRecord.find().populate({ path: 'donation', populate: { path: 'donor', select: 'name' } }).populate('rescue').sort({ deliveredAt: -1 }),
    Donation.countDocuments({ status: 'Delivered' }),
  ]);

  const totalMeals = records.reduce((sum, item) => sum + (item.estimatedMeals || 0), 0);
  const totalWeightKg = records.reduce((sum, item) => sum + (item.unit === 'kg' ? item.quantity : 0), 0);
  const backupSaves = records.filter((item) => item.backupSave).length;
  const onTime = records.length ? Math.round((records.filter((item) => item.onTime).length / records.length) * 100) : 0;
  const trend = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return records.reduce((sum, item) => {
      const deliveredAt = item.deliveredAt ? new Date(item.deliveredAt) : null;
      return deliveredAt && deliveredAt >= date && deliveredAt < next ? sum + (item.quantity || 0) : sum;
    }, 0);
  });

  return { totalMeals, totalWeightKg, backupSaves, onTimeDeliveryRate: onTime, deliveredCount: delivered, trend, records };
}
