import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rescueloop_token');
  const role = localStorage.getItem('rescueloop_role');
  const email = localStorage.getItem('rescueloop_email');

  if (token && !String(token).startsWith('mock-')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (role) config.headers['X-Demo-Role'] = role;
  if (email) config.headers['X-Demo-Email'] = email;

  return config;
});

export default api;
