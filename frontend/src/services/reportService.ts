import apiClient from './apiClient';

export interface EmpleadoReporte {
  id: number;
  nombreCompleto: string;
  numeroSeguroSocial: string;
  tipoEmpleado: string;
  pagoSemanal: number;
  fechaCreacion: string;
}

export interface ReporteEmpleados {
  empleados: EmpleadoReporte[];
  totalEmpleados: number;
  totalNomina: number;
  promedioSalario: number;
  fechaGeneracion: string;
}

export interface TipoEmpleadoResumen {
  tipoEmpleado: string;
  cantidad: number;
  totalPagos: number;
  promedioPago: number;
  porcentaje: number;
}

export interface ResumenEmpleados {
  totalEmpleados: number;
  porTipo: TipoEmpleadoResumen[];
  totalNomina: number;
  salarioMasAlto: number;
  salarioMasBajo: number;
  promedioSalario: number;
}

export interface NominaEmpleado {
  id: number;
  nombreCompleto: string;
  numeroSeguroSocial: string;
  tipoEmpleado: string;
  pagoSemanal: number;
  deducciones: number;
  pagoNeto: number;
}

export interface ReporteNomina {
  fecha: string;
  empleados: NominaEmpleado[];
  totalNomina: number;
  totalEmpleados: number;
}

export interface TipoEmpleadoEstadistica {
  tipoEmpleado: string;
  cantidad: number;
  porcentaje: number;
  totalPagos: number;
  promedioPago: number;
}

export interface Estadisticas {
  totalEmpleados: number;
  totalNomina: number;
  promedioSalario: number;
  estadisticasPorTipo: TipoEmpleadoEstadistica[];
}

export const reportesService = {
  async getReporteEmpleados(tipoEmpleado?: string): Promise<ReporteEmpleados> {
    const params = tipoEmpleado ? { tipoEmpleado } : {};
    const response = await apiClient.get('/Reportes/empleados', { params });
    return response.data;
  },

  async getResumenEmpleados(): Promise<ResumenEmpleados> {
    const response = await apiClient.get('/Reportes/empleados/resumen');
    return response.data;
  },

  async getReporteNomina(fecha?: Date): Promise<ReporteNomina> {
    const params = fecha ? { fecha: fecha.toISOString() } : {};
    const response = await apiClient.get('/Reportes/nomina', { params });
    return response.data;
  },

  async getEstadisticas(): Promise<Estadisticas> {
    const response = await apiClient.get('/Reportes/estadisticas');
    return response.data;
  }
};