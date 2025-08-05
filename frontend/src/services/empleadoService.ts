import axios from 'axios';
import type { EmpleadoAsalariado, EmpleadoBase, EmpleadoPorHoras, EmpleadoPorComision, EmpleadoAsalariadoPorComision } from '../types/empleado';

const API_URL = 'http://localhost:5290/api';

// Configurar interceptor para incluir token de autorización
axios.interceptors.request.use(
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

// Interface para empleado completo (con ID)
export interface Empleado extends EmpleadoBase, EmpleadoAsalariado, EmpleadoPorHoras, EmpleadoPorComision, EmpleadoAsalariadoPorComision {
  id: number;
}

// Crear empleado
export const createEmpleado = async (data: EmpleadoBase) => {
  console.log('Creating employee:', data);
  try {
    const response = await axios.post(`${API_URL}/Empleado`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw new Error('Error al crear el empleado');
  }
};

// Obtener todos los empleados
export const getEmpleados = async (): Promise<Empleado[]> => {
  try {
    const response = await axios.get(`${API_URL}/Empleado`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw new Error('Error al obtener la lista de empleados');
  }
};

// Obtener empleado por ID
export const getEmpleadoById = async (id: number): Promise<Empleado> => {
  try {
    const response = await axios.get(`${API_URL}/Empleado/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee:', error);
    throw new Error('Error al obtener el empleado');
  }
};

// Actualizar empleado
export const updateEmpleado = async (id: number, data: Partial<EmpleadoBase>): Promise<Empleado> => {
  console.log('Updating employee:', id, data);
  try {
    const response = await axios.put(`${API_URL}/Empleado/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw new Error('Error al actualizar el empleado');
  }
};

// Eliminar empleado
export const deleteEmpleado = async (id: number): Promise<void> => {
  console.log('Deleting employee:', id);
  try {
    await axios.delete(`${API_URL}/Empleado/${id}`);
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw new Error('Error al eliminar el empleado');
  }
};

// Buscar empleados por término
export const searchEmpleados = async (searchTerm: string): Promise<Empleado[]> => {
  try {
    const response = await axios.get(`${API_URL}/Empleado/search`, {
      params: { q: searchTerm }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching employees:', error);
    throw new Error('Error al buscar empleados');
  }
};

// Obtener estadísticas de empleados
export const getEmpleadosStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/Empleado/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    throw new Error('Error al obtener estadísticas');
  }
};