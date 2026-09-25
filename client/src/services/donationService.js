import api from './api';
import { mockDonations } from '../data/mockDonations';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

function normalizeDonation(item = {}) {
  const donorName = typeof item.donor === 'object' ? item.donor?.name : item.donor;
  return {
    ...item,
    id: item.publicId || item.id,
    donor: donorName || item.donorName || 'Donor',
    postedAt: item.createdAt || item.postedAt,
    safeUntil: item.safeUntil,
  };
}

export async function getMyDonations() {
  if (useMocks) return mockDonations;
  const { data } = await api.get('/donations/my');
  return (data.data ?? data).map(normalizeDonation);
}

export async function getDonationById(id) {
  if (useMocks) return mockDonations.find((item) => item.id === id) ?? mockDonations[0];
  const { data } = await api.get(`/donations/${id}`);
  const result = data.data ?? data;
  return { ...normalizeDonation(result.donation), rescue: result.rescue, events: result.events || [] };
}

export async function createDonation(payload) {
  if (useMocks) {
    return { id: `D-${Date.now()}`, ...payload, status: 'Posted', createdAt: new Date().toISOString() };
  }
  const { data } = await api.post('/donations', payload);
  const result = data.data ?? data;
  return { ...normalizeDonation(result.donation), rescue: result.rescue };
}
