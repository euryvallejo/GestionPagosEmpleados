export type TipoEmpleado = 'Asalariado' | 'PorHoras' | 'PorComision' | 'AsalariadoPorComision';

export interface EmpleadoBase {
  primerNombre?: string;
  apellidoPaterno: string;
  numeroSeguroSocial: string;
}

export interface EmpleadoAsalariado extends EmpleadoBase {
  salarioSemanal: number;
}

export interface EmpleadoPorHoras extends EmpleadoBase {
  sueldoPorHora: number;
  horasTrabajadas: number;
}

export interface EmpleadoPorComision extends EmpleadoBase {
  ventasBrutas: number;
  tarifaComision: number;
}

export interface EmpleadoAsalariadoPorComision extends EmpleadoPorComision {
  salarioBase: number;
}
