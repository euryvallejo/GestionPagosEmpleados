using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using GPE.Application.Interfaces;
using GPE.Application.DTOs;
using System.Security.Claims;

namespace GPE.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportesController : ControllerBase
    {
        private readonly IReportesService _reportesService;
        private readonly IEmpleadoService _empleadoService;
        private readonly ILogger<ReportesController> _logger;

        public ReportesController(
            IReportesService reportesService,
            IEmpleadoService empleadoService,
            ILogger<ReportesController> logger)
        {
            _reportesService = reportesService;
            _empleadoService = empleadoService;
            _logger = logger;
        }

        [HttpGet("empleados")]
        [Authorize(Policy = "UserOrAdmin")]
        public async Task<IActionResult> GetReporteEmpleados([FromQuery] string? tipoEmpleado = null)
        {
            var reporte = await _reportesService.GenerarReporteEmpleadosAsync(tipoEmpleado);
            return Ok(reporte);
        }

        [HttpGet("empleados/resumen")]
        [Authorize(Policy = "UserOrAdmin")]
        public async Task<ActionResult<object>> GetReporteGeneral()
        {
            try
            {
                var currentUser = GetCurrentUserInfo();
                _logger.LogInformation($"Usuario {currentUser.Username} generando reporte general");

                var reporte = await _reportesService.GenerarResumenEmpleadosAsync();

                _logger.LogInformation($"Reporte general generado para usuario: {currentUser.Username}");

                return Ok(new
                {
                    reporte,
                    generadoPor = currentUser.Username,
                    fechaGeneracion = DateTime.UtcNow,
                    tipoReporte = "General"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al generar reporte general");
                return StatusCode(500, new { message = "Error al generar reporte general" });
            }
        }

        [HttpGet("nomina")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetReporteNomina([FromQuery] DateTime? fecha = null)
        {
            var fechaReporte = fecha ?? DateTime.Now;
            var reporte = await _reportesService.GenerarReporteNominaAsync(fechaReporte);
            return Ok(reporte);
        }

        private (string UserId, string Username, string Role) GetCurrentUserInfo()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            var userId = identity?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "unknown";
            var username = identity?.FindFirst(ClaimTypes.Name)?.Value ?? "unknown";
            var role = identity?.FindFirst(ClaimTypes.Role)?.Value ?? "unknown";

            return (userId, username, role);
        }

        [HttpGet("estadisticas")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetEstadisticas()
        {
            var estadisticas = await _reportesService.GenerarEstadisticasAsync();
            return Ok(estadisticas);
        }
    }
}