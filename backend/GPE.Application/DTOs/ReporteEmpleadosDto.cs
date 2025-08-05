namespace GPE.Application.DTOs
{
    public class ReporteEmpleadosDto
    {
        public List<EmpleadoReporteDto> Empleados { get; set; } = new();
        public int TotalEmpleados { get; set; }
        public decimal TotalNomina { get; set; }
        public decimal PromedioSalario { get; set; }
        public DateTime FechaGeneracion { get; set; }
    }

    public class EmpleadoReporteDto
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; } = "";
        public string NumeroSeguroSocial { get; set; } = "";
        public string TipoEmpleado { get; set; } = "";
        public decimal PagoSemanal { get; set; }
        public DateTime FechaCreacion { get; set; }
    }

    public class ResumenEmpleadosDto
    {
        public int TotalEmpleados { get; set; }
        public List<TipoEmpleadoResumenDto> PorTipo { get; set; } = new();
        public decimal TotalNomina { get; set; }
        public decimal SalarioMasAlto { get; set; }
        public decimal SalarioMasBajo { get; set; }
        public decimal PromedioSalario { get; set; }
    }

    public class TipoEmpleadoResumenDto
    {
        public string TipoEmpleado { get; set; } = "";
        public int Cantidad { get; set; }
        public decimal TotalPagos { get; set; }
        public decimal PromedioPago { get; set; }
        public double Porcentaje { get; set; }
    }

    public class ReporteNominaDto
    {
        public DateTime Fecha { get; set; }
        public List<NominaEmpleadoDto> Empleados { get; set; } = new();
        public decimal TotalNomina { get; set; }
        public int TotalEmpleados { get; set; }
    }

    public class NominaEmpleadoDto
    {
        public int Id { get; set; }
        public string NombreCompleto { get; set; } = "";
        public string NumeroSeguroSocial { get; set; } = "";
        public string TipoEmpleado { get; set; } = "";
        public decimal PagoSemanal { get; set; }
        public decimal Deducciones { get; set; }
        public decimal PagoNeto { get; set; }
    }

    public class EstadisticasDto
    {
        public int TotalEmpleados { get; set; }
        public decimal TotalNomina { get; set; }
        public decimal PromedioSalario { get; set; }
        public List<TipoEmpleadoEstadisticaDto> EstadisticasPorTipo { get; set; } = new();
        public List<TendenciaSalarialDto> TendenciaSalarial { get; set; } = new();
    }

    public class TipoEmpleadoEstadisticaDto
    {
        public string TipoEmpleado { get; set; } = "";
        public int Cantidad { get; set; }
        public double Porcentaje { get; set; }
        public decimal TotalPagos { get; set; }
        public decimal PromedioPago { get; set; }
    }

    public class TendenciaSalarialDto
    {
        public string Mes { get; set; } = "";
        public decimal TotalPagos { get; set; }
        public int CantidadEmpleados { get; set; }
    }
}