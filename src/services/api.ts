import axios from 'axios';

// Since we have a proxy configured in Vite, we can use /api relative URL
const API = axios.create({
  baseURL: '/api',
});

// Interceptor to attach the token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
