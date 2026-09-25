import Donation from '../models/Donation.js';
import Driver from '../models/Driver.js';
import Rescue from '../models/Rescue.js';
import { ApiError } from '../utils/apiError.js';
import { logEvent } from './eventService.js';
import { getRescueById } from './rescueEngine.js';

export async function activateFailover(publicId, reason = 'Primary driver unavailable') {
  const rescue = await Rescue.findOne({ publicId });
  if (!rescue) throw new ApiError(404, 'Rescue not found');

  if (!rescue.backup?.recipient || !rescue.backup?.driver) {
    const donation = await Donation.findById(rescue.donation);
    donation.status = 'Needs Manual Attention';
    await donation.save();
    rescue.status = 'needs_manual_attention';
    await rescue.save();
    await logEvent({ rescueId: rescue._id, donationId: donation._id, type: 'FAILOVER_UNAVAILABLE', message: 'Primary failed and no backup assignment is available' });
    return getRescueById(publicId);
  }

  const oldDriverId = rescue.primary?.driver;
  if (oldDriverId) await Driver.findByIdAndUpdate(oldDriverId, { activeRescue: null });

  rescue.activeAssignment = 'backup';
  rescue.failoverCount += 1;
  rescue.lastFailoverReason = reason;
  rescue.status = 'backup_activated';
  rescue.estimatedPickupAt = new Date(Date.now() + 24 * 60000);
  rescue.estimatedDeliveryAt = new Date(Date.now() + 34 * 60000);
  rescue.primaryRecipientCommitted = false;
  rescue.primaryDriverCommitted = false;
  await rescue.save();

  const backupDriver = await Driver.findById(rescue.backup.driver);
  if (backupDriver) {
    backupDriver.activeRescue = rescue._id;
    await backupDriver.save();
  }

  const donation = await Donation.findById(rescue.donation);
  donation.status = 'Secured';
  await donation.save();

  await logEvent({
    rescueId: rescue._id,
    donationId: donation._id,
    type: 'FAILOVER_ACTIVATED',
    message: `Automatically activated backup assignment. Reason: ${reason}`,
    metadata: { backupDriver: rescue.backup.driver, backupRecipient: rescue.backup.recipient },
  });

  return getRescueById(publicId);
}
