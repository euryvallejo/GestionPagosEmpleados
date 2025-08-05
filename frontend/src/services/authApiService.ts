import apiClient from './apiClient';
import { AuthService } from './authService';

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: number;
  };
  expiresAt: string;
}

export const authApiService = {
  async login(credentials: LoginDto): Promise<LoginResponse> {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const data = response.data;
      
      // Solo retornar los datos, sin guardar nada
      return data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  async logout(): Promise<void> {
    try {
      // Opcional: llamar endpoint de logout en el backend
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      AuthService.logout();
    }
  },

  async verifyToken(): Promise<boolean> {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.status === 200;
    } catch {
      return false;
    }
  }
};