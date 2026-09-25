import api from './api';
import { mockDrivers } from '../data/mockDrivers';
import { mockRescues } from '../data/mockRescues';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

function normalizeJob(rescue = {}) {
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
  };
}

export async function getDriverDashboard() {
  if (useMocks) return { driver: mockDrivers[0], jobs: mockRescues.filter((r) => r.status !== 'Delivered') };
  const [{ data: driverData }, { data: jobsData }] = await Promise.all([
    api.get('/drivers/me'),
    api.get('/drivers/me/jobs'),
  ]);
  const driver = driverData.data ?? driverData;
  return {
    driver: { ...driver, id: driver.publicId || driver.id, name: driver.user?.name || 'Driver', location: driver.currentLocation, vehicle: driver.vehicleType, capacity: driver.vehicleCapacity || 35, reliability: driver.reliability ?? 95 },
    jobs: (jobsData.data ?? jobsData).map(normalizeJob),
  };
}

export async function toggleDuty(_driverId, onDuty) {
  if (useMocks) return { id: _driverId, onDuty };
  const { data } = await api.patch('/drivers/me/duty', { onDuty });
  const driver = data.data ?? data;
  return { ...driver, id: driver.publicId || driver.id, name: driver.user?.name || 'Driver' };
}

export async function getDriverHistory() {
  if (useMocks) return mockRescues.filter((r) => r.status === 'Delivered');
  const { data } = await api.get('/drivers/me/history');
  return (data.data ?? data).map(normalizeJob);
}

export async function acceptJob(rescueId) {
  if (useMocks) return { rescueId, status: 'Secured' };
  const { data } = await api.post(`/drivers/me/jobs/${rescueId}/accept`);
  return data.data ?? data;
}

export async function declineJob(rescueId) {
  if (useMocks) return { rescueId, status: 'Re-routing' };
  const { data } = await api.post(`/drivers/me/jobs/${rescueId}/decline`);
  return data.data ?? data;
}
