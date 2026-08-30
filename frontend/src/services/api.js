import axios from 'axios';

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle common errors (e.g. 401 session expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      typeof window !== 'undefined'
    ) {
      // If unauthorized and not already on auth pages, clear storage
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service Endpoints
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Complaint Service Endpoints
export const complaintAPI = {
  create: async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },
  getAll: async (params = {}) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },
  updateStatus: async (id, updateData) => {
    const response = await api.put(`/complaints/${id}/status`, updateData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/complaints/stats');
    return response.data;
  },
  getPublicStats: async () => {
    const response = await api.get('/complaints/public-stats');
    return response.data;
  },
};

export default api;
