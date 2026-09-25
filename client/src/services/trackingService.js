import api from './api';
import { mockRescues } from '../data/mockRescues';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export async function getTracking(id) {
  if (useMocks) return mockRescues.find((r) => r.id === id) ?? mockRescues[0];
  const { data } = await api.get(`/rescues/${id}`);
  return data.data ?? data;
}

export async function generatePickupOtp(id) {
  if (useMocks) return { otp: '2468' };
  const { data } = await api.post(`/rescues/${id}/pickup/otp`);
  return data.data ?? data;
}

export async function verifyPickup(id, otp) {
  if (useMocks) return { id, otp, status: 'Picked Up' };
  const { data } = await api.post(`/rescues/${id}/pickup/verify`, { otp });
  return data.data ?? data;
}

export async function generateDeliveryOtp(id) {
  if (useMocks) return { otp: '1357' };
  const { data } = await api.post(`/rescues/${id}/delivery/otp`);
  return data.data ?? data;
}

export async function verifyDelivery(id, otp) {
  if (useMocks) return { id, otp, status: 'Delivered' };
  const { data } = await api.post(`/rescues/${id}/delivery/verify`, { otp });
  return data.data ?? data;
}
