import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Token management
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');
export const isAuthenticated = () => !!getToken();

// Axios instance with authentication
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Session API calls
export const sessionAPI = {
  getMySessions: async () => {
    const response = await api.get('/my-sessions');
    return response.data;
  },
  
  getMySession: async (id) => {
    const response = await api.get(`/my-sessions/${id}`);
    return response.data;
  },
  
  saveDraft: async (sessionData) => {
    const response = await api.post('/my-sessions/save-draft', sessionData);
    return response.data;
  },
  
  publishSession: async (sessionData) => {
    const response = await api.post('/my-sessions/publish', sessionData);
    return response.data;
  },
  
  getPublicSessions: async () => {
    const response = await api.get('/sessions');
    return response.data;
  }
};

export default api;