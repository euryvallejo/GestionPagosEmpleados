export type TipoEmpleado = 'Asalariado' | 'PorHoras' | 'PorComision' | 'AsalariadoPorComision';

export interface EmpleadoBase {
  primerNombre?: string;
  apellidoPaterno: string;
  numeroSeguroSocial: string;
}

export interface EmpleadoAsalariado extends EmpleadoBase {
  salarioSemanal: number | 0;
}

export interface EmpleadoPorHoras extends EmpleadoBase {
  sueldoPorHora: number | 0;
  horasTrabajadas: number | 0;
}

export interface EmpleadoPorComision extends EmpleadoBase {
  ventasBrutas: number | 0;
  tarifaComision: number | 0;
}

export interface EmpleadoAsalariadoPorComision extends EmpleadoPorComision {
  salarioBase: number | 0;
}
