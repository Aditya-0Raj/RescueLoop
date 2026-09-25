import api from './api';

const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

export async function demoLogin(payload) {
  if (useMocks) {
    const user = {
      id: `DEMO-${payload.role.toUpperCase()}`,
      publicId: `USR-DEMO-${payload.role}`,
      name: payload.name || `Demo ${payload.role}`,
      email: payload.email || `${payload.role}@rescueloop.local`,
      role: payload.role,
    };
    return { token: `mock-${payload.role}`, user };
  }

  const { data } = await api.post('/auth/demo-login', payload);
  return data.data ?? data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data.data ?? data;
}
