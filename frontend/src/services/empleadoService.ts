import axios from 'axios';
import type { EmpleadoBase } from '../types/empleado';

const API_URL = 'http://localhost:5290/api';

export const createEmpleado = async (data: EmpleadoBase) => {
console.log('Creating employee:', data);
  const response = await axios.post(`${API_URL}/Empleado`, data);
  return response.data;
};