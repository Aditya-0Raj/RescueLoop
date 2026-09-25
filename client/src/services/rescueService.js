import api from './api';
import { mockRescues } from '../data/mockRescues';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

function mapRescueStatus(status) {
  const mapping = {
    awaiting_commitments: 'Posted',
    awaiting_recipient: 'Recipient Confirmed',
    awaiting_driver: 'Recipient Confirmed',
    secured: 'Secured',
    backup_activated: 'Secured',
    delivered: 'Delivered',
    needs_manual_attention: 'Needs Manual Attention',
  };
  return mapping[status] || status || 'Posted';
}

function normalizeRescue(rescue = {}) {
  const donation = rescue.donation || {};
  const primaryDriver = rescue.primary?.driver || {};
  const primaryRecipient = rescue.primary?.recipient || {};
  const backupDriver = rescue.backup?.driver || {};
  const backupRecipient = rescue.backup?.recipient || {};
  return {
    ...rescue,
    id: rescue.publicId || rescue.id,
    foodName: donation.foodName || rescue.foodName,
    quantity: donation.quantity || rescue.quantity,
    unit: donation.unit || rescue.unit,
    donor: donation.donor?.name || rescue.donor || 'Donor',
    recipient: primaryRecipient.organizationName || rescue.recipient || 'Recipient',
    driver: primaryDriver.user?.name || rescue.driver || 'Driver',
    backupRecipient: backupRecipient.organizationName || rescue.backupRecipient || 'Backup recipient',
    backupDriver: backupDriver.user?.name || rescue.backupDriver || 'Backup driver',
    safeUntil: donation.safeUntil || rescue.safeUntil,
    status: mapRescueStatus(rescue.status || donation.status),
    eta: rescue.estimatedPickupAt ? Math.max(1, Math.ceil((new Date(rescue.estimatedPickupAt) - Date.now()) / 60000)) : rescue.eta,
    safetyBuffer: donation.safeUntil && rescue.estimatedDeliveryAt ? Math.max(0, Math.floor((new Date(donation.safeUntil) - new Date(rescue.estimatedDeliveryAt)) / 60000)) : rescue.safetyBuffer,
    backupEta: rescue.activeAssignment === 'backup' && rescue.estimatedPickupAt ? Math.max(1, Math.ceil((new Date(rescue.estimatedPickupAt) - Date.now()) / 60000)) : null,
    backupBuffer: donation.safeUntil && rescue.activeAssignment === 'backup' && rescue.estimatedDeliveryAt ? Math.max(0, Math.floor((new Date(donation.safeUntil) - new Date(rescue.estimatedDeliveryAt)) / 60000)) : null,
  };
}

export async function getRescue(id) {
  if (useMocks) return mockRescues.find((r) => r.id === id) ?? mockRescues[0];
  const { data } = await api.get(`/rescues/${id}`);
  return normalizeRescue(data.data ?? data);
}

export async function getActiveRescues() {
  if (useMocks) return mockRescues;
  const { data } = await api.get('/rescues?status=active');
  return (data.data ?? data).map(normalizeRescue);
}

export async function simulateDriverFailure(id) {
  if (useMocks) return { rescueId: id, status: 'Re-routing', message: 'Backup plan activated' };
  const { data } = await api.post(`/rescues/${id}/failover`, { reason: 'Operations demo: primary driver failed' });
  return normalizeRescue(data.data ?? data);
}
