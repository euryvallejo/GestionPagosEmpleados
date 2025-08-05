using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using GPE.Domain.Interfaces;

namespace GPE.Application.Services
{
    public class ReportesService : IReportesService
    {
        private readonly IEmpleadoRepository _empleadoRepository;

        public ReportesService(IEmpleadoRepository empleadoRepository)
        {
            _empleadoRepository = empleadoRepository;
        }

        public async Task<ReporteEmpleadosDto> GenerarReporteEmpleadosAsync(string? tipoEmpleado = null)
        {
            var empleados = string.IsNullOrEmpty(tipoEmpleado)
                ? await _empleadoRepository.GetAllAsync()
                : await _empleadoRepository.GetByTipoAsync(tipoEmpleado);

            var empleadosReporte = empleados.Select(e => new EmpleadoReporteDto
            {
                Id = e.Id,
                NombreCompleto = $"{e.PrimerNombre} {e.ApellidoPaterno}".Trim(),
                NumeroSeguroSocial = e.NumeroSeguroSocial,
                TipoEmpleado = GetTipoEmpleadoString(e),
                PagoSemanal = e.CalcularSalario(),
                FechaCreacion = DateTime.Now // Asumiendo que no tienes este campo, puedes agregarlo
            }).ToList();

            return new ReporteEmpleadosDto
            {
                Empleados = empleadosReporte,
                TotalEmpleados = empleadosReporte.Count,
                TotalNomina = empleadosReporte.Sum(e => e.PagoSemanal),
                PromedioSalario = empleadosReporte.Any() ? empleadosReporte.Average(e => e.PagoSemanal) : 0,
                FechaGeneracion = DateTime.Now
            };
        }

        public async Task<ResumenEmpleadosDto> GenerarResumenEmpleadosAsync()
        {
            var empleados = await _empleadoRepository.GetAllAsync();
            var totalEmpleados = empleados.Count();

            if (totalEmpleados == 0)
            {
                return new ResumenEmpleadosDto();
            }

            var pagos = empleados.Select(e => e.CalcularSalario()).ToList();
            var totalNomina = pagos.Sum();

            var porTipo = empleados.GroupBy(e => GetTipoEmpleadoString(e))
                .Select(g =>
                {
                    var pagosPorTipo = g.Select(e => e.CalcularSalario()).ToList();
                    return new TipoEmpleadoResumenDto
                    {
                        TipoEmpleado = g.Key,
                        Cantidad = g.Count(),
                        TotalPagos = pagosPorTipo.Sum(),
                        PromedioPago = pagosPorTipo.Average(),
                        Porcentaje = (double)g.Count() / totalEmpleados * 100
                    };
                }).ToList();

            return new ResumenEmpleadosDto
            {
                TotalEmpleados = totalEmpleados,
                PorTipo = porTipo,
                TotalNomina = totalNomina,
                SalarioMasAlto = pagos.Max(),
                SalarioMasBajo = pagos.Min(),
                PromedioSalario = pagos.Average()
            };
        }

        public async Task<ReporteNominaDto> GenerarReporteNominaAsync(DateTime fecha)
        {
            var empleados = await _empleadoRepository.GetAllAsync();

            var nominaEmpleados = empleados.Select(e =>
            {
                var pagoSemanal = e.CalcularSalario();
                var deducciones = CalcularDeducciones(pagoSemanal); // Implementar lógica de deducciones

                return new NominaEmpleadoDto
                {
                    Id = e.Id,
                    NombreCompleto = $"{e.PrimerNombre} {e.ApellidoPaterno}".Trim(),
                    NumeroSeguroSocial = e.NumeroSeguroSocial,
                    TipoEmpleado = GetTipoEmpleadoString(e),
                    PagoSemanal = pagoSemanal,
                    Deducciones = deducciones,
                    PagoNeto = pagoSemanal - deducciones
                };
            }).ToList();

            return new ReporteNominaDto
            {
                Fecha = fecha,
                Empleados = nominaEmpleados,
                TotalNomina = nominaEmpleados.Sum(e => e.PagoNeto),
                TotalEmpleados = nominaEmpleados.Count
            };
        }

        public async Task<EstadisticasDto> GenerarEstadisticasAsync()
        {
            var empleados = await _empleadoRepository.GetAllAsync();
            var totalEmpleados = empleados.Count();

            if (totalEmpleados == 0)
            {
                return new EstadisticasDto();
            }

            var pagos = empleados.Select(e => e.CalcularSalario()).ToList();
            var totalNomina = pagos.Sum();

            var estadisticasPorTipo = empleados.GroupBy(e => GetTipoEmpleadoString(e))
                .Select(g =>
                {
                    var pagosPorTipo = g.Select(e => e.CalcularSalario()).ToList();
                    return new TipoEmpleadoEstadisticaDto
                    {
                        TipoEmpleado = g.Key,
                        Cantidad = g.Count(),
                        Porcentaje = (double)g.Count() / totalEmpleados * 100,
                        TotalPagos = pagosPorTipo.Sum(),
                        PromedioPago = pagosPorTipo.Average()
                    };
                }).ToList();

            return new EstadisticasDto
            {
                TotalEmpleados = totalEmpleados,
                TotalNomina = totalNomina,
                PromedioSalario = pagos.Average(),
                EstadisticasPorTipo = estadisticasPorTipo,
                TendenciaSalarial = new List<TendenciaSalarialDto>() // Implementar si tienes datos históricos
            };
        }

        private decimal CalcularDeducciones(decimal pagoSemanal)
        {
            // Implementar lógica de deducciones (ejemplo: 15% de impuestos)
            return pagoSemanal * 0.15m;
        }

        private string GetTipoEmpleadoString(Domain.Entities.Empleado empleado)
        {
            return empleado.GetType().Name switch
            {
                "EmpleadoAsalariado" => "Asalariado",
                "EmpleadoPorHoras" => "PorHoras",
                "EmpleadoPorComision" => "PorComision",
                "EmpleadoAsalariadoPorComision" => "AsalariadoPorComision",
                _ => "Desconocido"
            };
        }
    }
}