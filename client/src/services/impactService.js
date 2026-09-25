import api from './api';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export async function getImpactSummary() {
  if (useMocks) {
    return { rescuedKg: 1240, estimatedMeals: 4960, onTimeRate: 96, completedRescues: 124, backupSaves: 18, successRate: 94, trend: [120, 160, 140, 210, 190, 240, 180] };
  }
  const { data } = await api.get('/impact/dashboard');
  const result = data.data ?? data;
  return {
    rescuedKg: result.totalWeightKg,
    estimatedMeals: result.totalMeals,
    onTimeRate: result.onTimeDeliveryRate,
    completedRescues: result.deliveredCount,
    backupSaves: result.backupSaves,
    successRate: result.onTimeDeliveryRate,
    trend: result.trend || [],
    records: result.records,
  };
}
