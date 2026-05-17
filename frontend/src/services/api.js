import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// Interceptor de request — injeta JWT automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sgas_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response — trata 401 globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sgas_token');
      localStorage.removeItem('sgas_usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
