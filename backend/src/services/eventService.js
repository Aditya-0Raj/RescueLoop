import EventLog from '../models/EventLog.js';

export async function logEvent({ rescueId, donationId, type, message, actorRole = 'system', metadata = {} }) {
  return EventLog.create({
    rescue: rescueId,
    donation: donationId,
    type,
    message,
    actorRole,
    metadata,
  });
}
