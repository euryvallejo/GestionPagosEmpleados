import apiClient from './apiClient';

export interface Empleado {
  id: number;
  primerNombre: string;
  apellidoPaterno: string;
  salarioBase: number;
  tipoEmpleado: string;
  fechaIngreso: string;
}

export interface CreateEmpleadoDto {
  primerNombre: string;
  apellidoPaterno: string;
  salarioBase: number;
  tipoEmpleado: string;
  fechaIngreso: string;
}

export const empleadoService = {
  async getAll(): Promise<Empleado[]> {
    const response = await apiClient.get('/empleado');
    return response.data;
  },

  async getById(id: number): Promise<Empleado> {
    const response = await apiClient.get(`/empleado/${id}`);
    return response.data;
  },

  async create(empleado: CreateEmpleadoDto): Promise<Empleado> {
    console.log('Creating empleado with data:', empleado);
    const response = await apiClient.post('/empleado', empleado);
    return response.data;
  },

  async update(id: number, empleado: Partial<CreateEmpleadoDto>): Promise<Empleado> {
    const response = await apiClient.put(`/empleado/${id}`, empleado);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/empleado/${id}`);
  },

  async getByTipo(tipo: string): Promise<Empleado[]> {
    const response = await apiClient.get(`/empleado/tipo/${tipo}`);
    return response.data;
  },

  async calcularSalario(id: number): Promise<any> {
    const response = await apiClient.get(`/empleado/${id}/salario`);
    return response.data;
  },

  async getEstadisticas(): Promise<any> {
    const response = await apiClient.get('/empleado/estadisticas');
    return response.data;
  }
};