import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authApi = {
  login: (username, password) => 
    api.post('/auth/login/', { username, password }),
  
  logout: () => 
    api.post('/auth/logout/'),
  
  me: () => 
    api.get('/auth/me/'),
  
  updateMe: (data) => 
    api.put('/auth/me/update/', data),
};

// Generic CRUD service factory with better error handling
const createApiService = (endpoint) => ({
  list: async (params = {}) => {
    try {
      const response = await api.get(`/${endpoint}/`, { params });
      // Handle different response formats
      if (Array.isArray(response)) {
        return response;
      } else if (response && response.results) {
        return response.results;
      } else if (response && typeof response === 'object') {
        // If it's a single object, check if it has a results property
        return [];
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  },
  
  get: async (id) => {
    try {
      return await api.get(`/${endpoint}/${id}/`);
    } catch (error) {
      console.error(`Error fetching ${endpoint} ${id}:`, error);
      throw error;
    }
  },
  
  create: async (data) => {
    try {
      return await api.post(`/${endpoint}/`, data);
    } catch (error) {
      console.error(`Error creating ${endpoint}:`, error);
      throw error;
    }
  },
  
  update: async (id, data) => {
    try {
      return await api.put(`/${endpoint}/${id}/`, data);
    } catch (error) {
      console.error(`Error updating ${endpoint} ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id) => {
    try {
      return await api.delete(`/${endpoint}/${id}/`);
    } catch (error) {
      console.error(`Error deleting ${endpoint} ${id}:`, error);
      throw error;
    }
  },
  
  bulkCreate: async (items) => {
    try {
      return await api.post(`/${endpoint}/bulk_create/`, { items });
    } catch (error) {
      console.error(`Error bulk creating ${endpoint}:`, error);
      throw error;
    }
  },
});

// Entity-specific APIs
export const productsApi = createApiService('products');
export const categoriesApi = createApiService('categories');
export const suppliersApi = createApiService('suppliers');
export const salesApi = createApiService('sales');
export const stockMovementsApi = createApiService('stock-movements');

// File upload
export const uploadApi = {
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
};

export default api;