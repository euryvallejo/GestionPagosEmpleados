using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GPE.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportesController : ControllerBase
    {
        private readonly IReportesService _reportesService;

        public ReportesController(IReportesService reportesService)
        {
            _reportesService = reportesService;
        }

        [HttpGet("empleados")]
        public async Task<IActionResult> GetReporteEmpleados([FromQuery] string? tipoEmpleado = null)
        {
            var reporte = await _reportesService.GenerarReporteEmpleadosAsync(tipoEmpleado);
            return Ok(reporte);
        }

        [HttpGet("empleados/resumen")]
        public async Task<IActionResult> GetResumenEmpleados()
        {
            var resumen = await _reportesService.GenerarResumenEmpleadosAsync();
            return Ok(resumen);
        }

        [HttpGet("nomina")]
        public async Task<IActionResult> GetReporteNomina([FromQuery] DateTime? fecha = null)
        {
            var fechaReporte = fecha ?? DateTime.Now;
            var reporte = await _reportesService.GenerarReporteNominaAsync(fechaReporte);
            return Ok(reporte);
        }

        [HttpGet("estadisticas")]
        public async Task<IActionResult> GetEstadisticas()
        {
            var estadisticas = await _reportesService.GenerarEstadisticasAsync();
            return Ok(estadisticas);
        }
    }
}