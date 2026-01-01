import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isDev = Boolean(import.meta.env?.DEV);
const hasWindow = typeof window !== 'undefined';

api.interceptors.request.use(
  (config) => {
    if (isDev) {
      console.debug('[API] Request', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL ?? ''}${config.url ?? ''}`,
        data: config.data,
      });
    }

    if (hasWindow) {
      const token = window.localStorage.getItem('token');
      if (token) {
        if (!config.headers) {
          config.headers = {};
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    if (isDev) {
      console.error('[API] Request Error', error);
    }
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.debug('[API] Response', {
        status: response.status,
        statusText: response.statusText,
        url: response.config?.url,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (isDev) {
      console.error('[API] Response Error', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
      });
    }

    if (error.response?.status === 401 && hasWindow) {
      // Show session expired message
      const sessionExpiredMessage = 'Your session has expired. Please log in again.';
      
      // Try to show a toast if available, otherwise use alert
      if (window.showToast) {
        window.showToast(sessionExpiredMessage, 'error');
      } else {
        // Store message to show after redirect
        window.localStorage.setItem('authMessage', sessionExpiredMessage);
      }
      
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      window.localStorage.removeItem('tokenExpiration');
      window.localStorage.removeItem('rememberMe');
      
      // Small delay to ensure message is shown before redirect
      setTimeout(() => {
        window.location.replace('/');
      }, 100);
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      if (isDev) {
        console.error('[API] Registration Error', {
          url: '/auth/signup',
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      }
      throw error;
    }
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

export default api;
