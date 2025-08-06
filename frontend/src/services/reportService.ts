import apiClient from './apiClient';

export interface TipoEmpleadoResumen {
  tipoEmpleado: string;
  cantidad: number;
  totalPagos: number;
  promedioPago: number;
  porcentaje: number;
}

export interface ResumenBackend {
  totalEmpleados: number;
  porTipo: TipoEmpleadoResumen[];
  totalNomina: number;
  salarioMasAlto: number;
  salarioMasBajo: number;
  promedioSalario: number;
}

export interface ResumenResponse {
  reporte: ResumenBackend;
  generadoPor: string;
  fechaGeneracion: string;
  tipoReporte: string;
}

export interface ResumenEmpleados {
  totalEmpleados: number;
  empleadosAsalariados: number;
  empleadosPorHoras: number;
  empleadosPorComision: number;
  empleadosAsalariadoPorComision: number;
  promedioSalarios: number;
  totalNomina: number;
}

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

export interface Estadisticas {
  salarioPromedioPorTipo: {
    [key: string]: number;
  };
  distribucionTipoEmpleado: {
    tipo: string;
    cantidad: number;
    porcentaje: number;
  }[];
  totalNominaActual: number;
  estadisticasPorTipo: Array<{
    tipoEmpleado: string;
    cantidad: number;
    porcentaje: number;
    totalPagos: number;
    promedioPago: number;
  }>;
}

export const reportesService = {
  async getReporteEmpleados(tipoEmpleado?: string): Promise<ReporteEmpleados> {
    try {
      const url = tipoEmpleado 
        ? `/Reportes/empleados?tipoEmpleado=${tipoEmpleado}` 
        : '/Reportes/empleados';
      
      console.log('Cargando reporte desde:', url);
      const response = await apiClient.get(url);
      console.log('Reporte recibido:', response.data);
      
      if (!response.data || !Array.isArray(response.data.empleados)) {
        throw new Error('Formato de datos incorrecto en reporte de empleados');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error cargando reporte de empleados:', error);
      throw error;
    }
  },

  async getResumenEmpleados(): Promise<ResumenEmpleados> {
    try {
      console.log('Cargando resumen desde endpoint...');
      const response = await apiClient.get('/empleado/resumen');
      console.log('Resumen recibido desde API:', response.data);
      
      // ← CONVERTIR: Transformar el formato del backend al que espera el frontend
      const resumenResponse = response.data as ResumenResponse;
      const backendResumen = resumenResponse.reporte;
      
      // Mapear los datos del backend al formato que espera el frontend
      const resumenFrontend: ResumenEmpleados = {
        totalEmpleados: backendResumen.totalEmpleados,
        empleadosAsalariados: this.obtenerCantidadPorTipo(backendResumen.porTipo, 'Asalariado'),
        empleadosPorHoras: this.obtenerCantidadPorTipo(backendResumen.porTipo, 'PorHoras'),
        empleadosPorComision: this.obtenerCantidadPorTipo(backendResumen.porTipo, 'PorComision'),
        empleadosAsalariadoPorComision: this.obtenerCantidadPorTipo(backendResumen.porTipo, 'AsalariadoPorComision'),
        promedioSalarios: backendResumen.promedioSalario,
        totalNomina: backendResumen.totalNomina
      };
      
      console.log('✅ Resumen transformado para frontend:', resumenFrontend);
      return resumenFrontend;
      
    } catch (error: any) {
      console.warn('⚠Error en endpoint de resumen:', error.response?.status, error.response?.statusText);
      
      // Si hay error, intentar generar desde reporte
      if (error.response?.status === 400 || error.response?.status === 404) {
        console.log('Generando resumen desde datos de reporte...');
        try {
          const reporte = await this.getReporteEmpleados();
          return this.generarResumenDesdeReporte(reporte);
        } catch (fallbackError) {
          console.error('Error en fallback de resumen:', fallbackError);
          throw new Error('No se pudo cargar el resumen de empleados');
        }
      }
      
      throw error;
    }
  },

  async getEstadisticas(): Promise<Estadisticas> {
    try {
      console.log('Intentando cargar estadísticas desde endpoint...');
      const response = await apiClient.get('/Reportes/estadisticas');
      console.log('Estadísticas obtenidas del endpoint:', response.data);
      return response.data;
    } catch (error: any) {
      console.warn('Error en endpoint de estadísticas, generando desde resumen:', error.response?.status);
      
      try {
        // Generar estadísticas desde el resumen que ahora funciona
        const resumenResponse = await apiClient.get('/empleado/resumen');
        const backendResumen = resumenResponse.data.reporte as ResumenBackend;
        return this.generarEstadisticasDesdeResumen(backendResumen);
      } catch (fallbackError) {
        console.error('Error en fallback de estadísticas:', fallbackError);
        throw new Error('No se pudieron cargar las estadísticas');
      }
    }
  },

  // ← NUEVO: Método para obtener cantidad por tipo
  obtenerCantidadPorTipo(porTipo: TipoEmpleadoResumen[], tipo: string): number {
    const tipoData = porTipo.find(t => t.tipoEmpleado === tipo);
    return tipoData ? tipoData.cantidad : 0;
  },

  // ← ACTUALIZAR: Método para generar resumen desde reporte
  generarResumenDesdeReporte(reporte: ReporteEmpleados): ResumenEmpleados {
    const empleados = reporte.empleados;
    
    if (!empleados || empleados.length === 0) {
      return {
        totalEmpleados: 0,
        empleadosAsalariados: 0,
        empleadosPorHoras: 0,
        empleadosPorComision: 0,
        empleadosAsalariadoPorComision: 0,
        promedioSalarios: 0,
        totalNomina: 0
      };
    }

    const resumen: ResumenEmpleados = {
      totalEmpleados: empleados.length,
      empleadosAsalariados: empleados.filter(emp => emp.tipoEmpleado === 'Asalariado').length,
      empleadosPorHoras: empleados.filter(emp => emp.tipoEmpleado === 'PorHoras').length,
      empleadosPorComision: empleados.filter(emp => emp.tipoEmpleado === 'PorComision').length,
      empleadosAsalariadoPorComision: empleados.filter(emp => emp.tipoEmpleado === 'AsalariadoPorComision').length,
      promedioSalarios: reporte.promedioSalario || 0,
      totalNomina: reporte.totalNomina || 0
    };

    console.log('📊 Resumen generado desde reporte:', resumen);
    return resumen;
  },

  // ← NUEVO: Método para generar estadísticas desde el resumen del backend
  generarEstadisticasDesdeResumen(resumen: ResumenBackend): Estadisticas {
    // Calcular salario promedio por tipo desde porTipo
    const salarioPromedioPorTipo: { [key: string]: number } = {};
    resumen.porTipo.forEach(tipo => {
      salarioPromedioPorTipo[tipo.tipoEmpleado] = tipo.promedioPago;
    });

    // Usar la distribución que ya viene calculada
    const distribucionTipoEmpleado = resumen.porTipo.map(tipo => ({
      tipo: tipo.tipoEmpleado,
      cantidad: tipo.cantidad,
      porcentaje: tipo.porcentaje
    }));

    const estadisticas: Estadisticas = {
      salarioPromedioPorTipo,
      distribucionTipoEmpleado,
      totalNominaActual: resumen.totalNomina
    };

    console.log('Estadísticas generadas desde resumen del backend:', estadisticas);
    return estadisticas;
  },

  // ← MANTENER: Método para generar estadísticas desde reporte (fallback del fallback)
  generarEstadisticasDesdeReporte(reporte: ReporteEmpleados): Estadisticas {
    const empleados = reporte.empleados;
    
    if (!empleados || empleados.length === 0) {
      return {
        salarioPromedioPorTipo: {},
        distribucionTipoEmpleado: [],
        totalNominaActual: 0
      };
    }

    const salarioPromedioPorTipo: { [key: string]: number } = {};
    const tiposUnicos = [...new Set(empleados.map(emp => emp.tipoEmpleado))];
    
    tiposUnicos.forEach(tipo => {
      const empleadosTipo = empleados.filter(emp => emp.tipoEmpleado === tipo);
      const promedio = empleadosTipo.reduce((sum, emp) => sum + (emp.pagoSemanal || 0), 0) / empleadosTipo.length;
      salarioPromedioPorTipo[tipo] = promedio || 0;
    });

    const distribucionTipoEmpleado = tiposUnicos.map(tipo => {
      const cantidad = empleados.filter(emp => emp.tipoEmpleado === tipo).length;
      const porcentaje = (cantidad / empleados.length) * 100;
      return { tipo, cantidad, porcentaje };
    });

    const estadisticas: Estadisticas = {
      salarioPromedioPorTipo,
      distribucionTipoEmpleado,
      totalNominaActual: reporte.totalNomina || 0
    };

    console.log('📈 Estadísticas generadas desde reporte (fallback):', estadisticas);
    return estadisticas;
  }
};