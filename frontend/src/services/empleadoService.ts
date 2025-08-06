import apiClient from './apiClient';

export interface Empleado {
  id: number;
  primerNombre?: string;
  apellidoPaterno: string;
  numeroSeguroSocial: string;
  tipoEmpleado: string;
  // Campos específicos por tipo de empleado
  salarioSemanal?: number;
  sueldoPorHora?: number;
  horasTrabajadas?: number;
  ventasBrutas?: number;
  tarifaComision?: number;
  salarioBase?: number;
  fechaIngreso?: string;
  // Campo calculado
  salarioCalculado?: number;
}

export interface CreateEmpleadoDto {
  primerNombre?: string;
  apellidoPaterno: string;
  numeroSeguroSocial: string;
  tipoEmpleado: string;
  // Campos específicos por tipo de empleado
  salarioSemanal?: number;
  sueldoPorHora?: number;
  horasTrabajadas?: number;
  ventasBrutas?: number;
  tarifaComision?: number;
  salarioBase?: number;
}

export interface UpdateEmpleadoDto {
  primerNombre?: string;
  apellidoPaterno?: string;
  numeroSeguroSocial?: string;
  tipoEmpleado?: string;
  // Campos específicos por tipo de empleado
  salarioSemanal?: number;
  sueldoPorHora?: number;
  horasTrabajadas?: number;
  ventasBrutas?: number;
  tarifaComision?: number;
  salarioBase?: number;
}

export const empleadoService = {
  async getAll(): Promise<Empleado[]> {
    try {
      const response = await apiClient.get('/empleado');
      return response.data;
    } catch (error) {
      console.error('Error fetching empleados:', error);
      throw error;
    }
  },

  async getById(id: number): Promise<Empleado> {
    try {
      const response = await apiClient.get(`/empleado/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching empleado ${id}:`, error);
      throw error;
    }
  },

  async create(empleado: CreateEmpleadoDto): Promise<Empleado> {
    try {
      console.log('Creating empleado with data:', empleado);
      const response = await apiClient.post('/empleado', empleado);
      console.log('Empleado created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating empleado:', error);
      throw error;
    }
  },

  async update(id: number, empleado: UpdateEmpleadoDto): Promise<Empleado> {
    try {
      console.log('Updating empleado with ID:', id, 'Data:', empleado);
      const response = await apiClient.put(`/empleado/${id}`, empleado);
      console.log('Empleado updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating empleado ${id}:`, error);
      throw error;
    }
  },

  async delete(id: number): Promise<void> {
    try {
      console.log('Deleting empleado with ID:', id);
      await apiClient.delete(`/empleado/${id}`);
      console.log('Empleado deleted successfully');
    } catch (error) {
      console.error(`Error deleting empleado ${id}:`, error);
      throw error;
    }
  },

  async getByTipo(tipo: string): Promise<Empleado[]> {
    try {
      const response = await apiClient.get(`/empleado/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching empleados by tipo ${tipo}:`, error);
      throw error;
    }
  },

  async calcularSalario(id: number): Promise<any> {
    try {
      const response = await apiClient.get(`/empleado/${id}/salario`);
      return response.data;
    } catch (error) {
      console.error(`Error calculating salary for empleado ${id}:`, error);
      throw error;
    }
  },

  async getEstadisticas(): Promise<any> {
    try {
      const response = await apiClient.get('/empleado/estadisticas');
      return response.data;
    } catch (error) {
      console.error('Error fetching estadisticas:', error);
      throw error;
    }
  }
};