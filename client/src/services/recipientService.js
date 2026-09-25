import api from './api';
import { mockRecipients } from '../data/mockRecipients';
import { mockDonations } from '../data/mockDonations';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

function normalizeRecipient(item = {}) {
  const userName = typeof item.user === 'object' ? item.user?.name : '';
  return {
    ...item,
    id: item.publicId || item.id,
    name: item.organizationName || userName || 'Recipient organization',
    capacityNow: item.capacity ?? item.capacityNow ?? 0,
    capacityUnit: item.capacityUnit || 'kg',
    openUntil: item.openUntil ? new Date(item.openUntil).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '—',
    acceptedFoodTypes: item.acceptedFoodTypes || [],
    storage: Array.isArray(item.storageAvailable) ? item.storageAvailable.join(' + ') : (item.storage || '—'),
  };
}

function normalizeDonation(item = {}) {
  return { ...item, id: item.publicId || item.id };
}

export async function getRecipientDashboard() {
  if (useMocks) return { profile: mockRecipients[0], incoming: mockDonations.filter((d) => d.status !== 'Delivered') };
  const [{ data: profileData }, { data: incomingData }] = await Promise.all([
    api.get('/recipients/me'),
    api.get('/recipients/me/incoming'),
  ]);
  return {
    profile: normalizeRecipient(profileData.data ?? profileData),
    incoming: (incomingData.data ?? incomingData).map(normalizeDonation),
  };
}

export async function updateCapacity(payload) {
  if (useMocks) return { ...mockRecipients[0], ...payload };
  const { data } = await api.patch('/recipients/me/capacity', {
    accepting: payload.accepting,
    capacity: payload.capacity ?? payload.capacityNow,
    capacityUnit: payload.capacityUnit || 'kg',
    acceptedFoodTypes: payload.acceptedFoodTypes,
    storageAvailable: payload.storageAvailable,
    openUntil: payload.openUntil,
  });
  return normalizeRecipient(data.data ?? data);
}

export async function getAcceptedDonations() {
  if (useMocks) return mockDonations.slice(0, 2);
  const { data } = await api.get('/recipients/me/accepted');
  return (data.data ?? data).map(normalizeDonation);
}

export async function acceptDonation(donationId) {
  if (useMocks) return { donationId, status: 'Recipient Confirmed' };
  const { data } = await api.post(`/recipients/me/donations/${donationId}/accept`);
  return data.data ?? data;
}

export async function declineDonation(donationId) {
  if (useMocks) return { donationId, declined: true };
  const { data } = await api.post(`/recipients/me/donations/${donationId}/decline`);
  return data.data ?? data;
}
