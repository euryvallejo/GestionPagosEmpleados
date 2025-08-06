import axios from 'axios';
import { AuthService } from './authService';

const API_BASE_URL = 'http://localhost:5290/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRedirecting = false;

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token && AuthService.isAuthenticated()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response?.status === 401 && !isRedirecting) {
      console.log('Unauthorized - logging out');
      isRedirecting = true;
      
      AuthService.logout();
      
      setTimeout(() => {
        window.location.href = '/login';
        isRedirecting = false;
      }, 100);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;