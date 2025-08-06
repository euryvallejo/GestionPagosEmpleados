import apiClient from './apiClient';

export interface User {
  id: number;
  username: string;
  role: number;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface CreateUserDto {
  username: string;
  password: string;
  role: number;
}

export interface UpdateUserDto {
  username?: string;
  passwordHash?: string;
  role?: number;
  isActive?: boolean;
}

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get('/User');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Crear nuevo usuario
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  try {
    console.log('Creating user with data:', userData);
    const response = await apiClient.post('/Auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Actualizar usuario
export const updateUser = async (userId: number, userData: UpdateUserDto): Promise<User> => {
  try {
    console.log('Updating user with ID:', userId, 'Data:', userData);
    const response = await apiClient.put(`/User/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Activar/Desactivar usuario
export const toggleUserStatus = async (userId: number, isActive: boolean): Promise<User> => {
  try {
    const response = await apiClient.patch(`/User/${userId}/status`, { isActive });
    return response.data;
  } catch (error) {
    console.error('Error toggling user status:', error);
    throw error;
  }
};

// Eliminar usuario (soft delete)
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await apiClient.delete(`/User/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};