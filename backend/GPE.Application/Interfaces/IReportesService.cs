using GPE.Application.DTOs;

namespace GPE.Application.Interfaces
{
    public interface IReportesService
    {
        Task<ReporteEmpleadosDto> GenerarReporteEmpleadosAsync(string? tipoEmpleado = null);
        Task<ResumenEmpleadosDto> GenerarResumenEmpleadosAsync();
        Task<ReporteNominaDto> GenerarReporteNominaAsync(DateTime fecha);
        Task<EstadisticasDto> GenerarEstadisticasAsync();
    }
}