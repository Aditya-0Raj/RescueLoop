import api from './api';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export async function parseDonationMessage(message) {
  if (useMocks) {
    const match = String(message).match(/(\d+(?:\.\d+)?)\s*(kg|kgs|portion|portions)/i);
    return {
      source: 'mock',
      fields: {
        foodName: String(message).replace(match?.[0] || '', '').replace(/\b(?:safe|until|till).*/i, '').trim() || 'Surplus food',
        foodType: /non[- ]?veg|chicken|mutton|fish|egg/i.test(message) ? 'Non-vegetarian meals' : 'Veg meals',
        quantity: match ? Number(match[1]) : null,
        unit: match?.[2]?.toLowerCase().startsWith('portion') ? 'portions' : 'kg',
      },
    };
  }
  const { data } = await api.post('/intake/parse', { message });
  return data.data ?? data;
}
