import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Ej: https://api.misistema.com/api
});

// Añadir token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptar errores 401 (token expirado o inválido)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const token = localStorage.getItem('token');

    // Solo redirigir si hay token y el error NO viene del endpoint de login
    const isLoginRequest = originalRequest?.url?.includes('/auth/login');

    if (status === 401 && token && !isLoginRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);