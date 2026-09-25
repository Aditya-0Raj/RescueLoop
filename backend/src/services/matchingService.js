import Recipient from '../models/Recipient.js';
import Driver from '../models/Driver.js';
import { haversineKm, estimateMinutes } from '../utils/geo.js';

function capacityFits(recipient, donation) {
  return recipient.capacity >= donation.quantity && recipient.capacityUnit === donation.unit;
}

function typeFits(recipient, donation) {
  return recipient.acceptedFoodTypes.length === 0 || recipient.acceptedFoodTypes.some((type) => {
    const donorType = String(donation.foodType).toLowerCase();
    return donorType.includes(String(type).toLowerCase()) || String(type).toLowerCase().includes(donorType);
  });
}

function openUntilFits(recipient, etaMinutes, now = new Date()) {
  if (!recipient.openUntil) return true;
  return recipient.openUntil.getTime() > now.getTime() + etaMinutes * 60000;
}

function storageFits(recipient, donation) {
  return recipient.storageAvailable.length === 0 || recipient.storageAvailable.includes(donation.storageState);
}

function driverAvailabilityFits(driver, etaMinutes, now = new Date()) {
  if (!driver.availableUntil) return true;
  return driver.availableUntil.getTime() > now.getTime() + etaMinutes * 60000;
}

function deadlineSlack(donation, etaMinutes) {
  return Math.floor((new Date(donation.safeUntil).getTime() - Date.now() - etaMinutes * 60000) / 60000);
}

function candidateScore({ slack, distanceKm, recipient, donation }) {
  const deadlineScore = Math.max(0, Math.min(50, slack));
  const distanceScore = distanceKm == null ? 10 : Math.max(0, 30 - distanceKm * 2);
  const fitRatio = Math.min(1, donation.quantity / Math.max(1, recipient.capacity));
  const capacityScore = fitRatio * 20;
  return Number((deadlineScore + capacityScore + distanceScore).toFixed(2));
}

export async function findRescueCandidates(donation) {
  const [recipients, drivers] = await Promise.all([
    Recipient.find({ accepting: true }).populate('user', 'name email'),
    Driver.find({ onDuty: true, activeRescue: null }).populate('user', 'name email'),
  ]);

  const candidates = [];

  for (const recipient of recipients) {
    for (const driver of drivers) {
      const distanceKm = haversineKm(donation.coordinates, recipient.coordinates);
      const driveToPickupKm = haversineKm(driver.coordinates, donation.coordinates);
      const pickupToRecipientKm = haversineKm(donation.coordinates, recipient.coordinates);
      const totalKm = driveToPickupKm != null && pickupToRecipientKm != null ? driveToPickupKm + pickupToRecipientKm : distanceKm;
      const etaMinutes = estimateMinutes(totalKm) ?? 20;
      const slack = deadlineSlack(donation, etaMinutes);
      const reasons = [];
      let eligible = true;

      if (!capacityFits(recipient, donation)) {
        eligible = false;
        reasons.push('Insufficient capacity');
      }
      if (!typeFits(recipient, donation)) {
        eligible = false;
        reasons.push('Food type not accepted');
      }
      if (!openUntilFits(recipient, etaMinutes)) {
        eligible = false;
        reasons.push('Recipient closes before feasible arrival');
      }
      if (!storageFits(recipient, donation)) {
        eligible = false;
        reasons.push('Required storage condition is unavailable');
      }
      if (!driverAvailabilityFits(driver, etaMinutes + 15)) {
        eligible = false;
        reasons.push('Driver is not available for the full rescue window');
      }
      if (slack <= 0) {
        eligible = false;
        reasons.push('No viable safety deadline slack');
      }

      const score = eligible ? candidateScore({ slack, distanceKm, recipient, donation }) : 0;
      if (eligible && !reasons.length) reasons.push('Meets capacity, food-type, availability and deadline checks');

      candidates.push({ recipient, driver, eligible, score, distanceKm, deadlineSlackMinutes: slack, reasons, etaMinutes });
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates;
}
