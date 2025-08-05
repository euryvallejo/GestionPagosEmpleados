using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using GPE.Domain.Entities;
using System.Security.Claims;

namespace GPE.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmpleadoController : ControllerBase
    {
        private readonly IEmpleadoService _empleadoService;
        private readonly ILogger<EmpleadoController> _logger;

        public EmpleadoController(IEmpleadoService empleadoService, ILogger<EmpleadoController> logger)
        {
            _empleadoService = empleadoService;
            _logger = logger;
        }

        /// <summary>
        /// Obtiene todos los empleados - Solo usuarios autenticados
        /// </summary>
        [HttpGet]
        [Authorize(Policy = "UserOrAdmin")]
        public async Task<ActionResult<IEnumerable<CreateEmpleadoDto>>> GetAllEmpleados()
        {
            try
            {
                var currentUser = GetCurrentUserInfo();
                _logger.LogInformation($"Usuario {currentUser.Username} ({currentUser.Role}) consultando empleados");

                var empleados = await _empleadoService.GetAllAsync();
                return Ok(empleados);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener empleados");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtiene un empleado por ID - Solo usuarios autenticados
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Policy = "UserOrAdmin")]
        public async Task<ActionResult<CreateEmpleadoDto>> GetEmpleado(int id)
        {
            try
            {
                var currentUser = GetCurrentUserInfo();
                _logger.LogInformation($"Usuario {currentUser.Username} consultando empleado ID: {id}");

                var empleado = await _empleadoService.GetByIdAsync(id);
                if (empleado == null)
                {
                    return NotFound(new { message = $"Empleado con ID {id} no encontrado" });
                }

                return Ok(empleado);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener empleado ID: {id}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Crea un nuevo empleado - Solo administradores
        /// </summary>
        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<CreateEmpleadoDto>> CreateEmpleado([FromBody] CreateEmpleadoDto createEmpleadoDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentUser = GetCurrentUserInfo();
                _logger.LogInformation($"Admin {currentUser.Username} creando empleado: {createEmpleadoDto.PrimerNombre} {createEmpleadoDto.ApellidoPaterno}");

                var empleado = await _empleadoService.CreateAsync(createEmpleadoDto);

                _logger.LogInformation($"Empleado creado exitosamente - ID: {empleado.Id}, Admin: {currentUser.Username}");

                return CreatedAtAction(
                    nameof(GetEmpleado),
                    new { id = empleado.Id },
                    empleado
                );
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Error de validación al crear empleado: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear empleado");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Actualiza un empleado existente - Solo administradores
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult<UpdateEmpleadoDto>> UpdateEmpleado(int id, [FromBody] UpdateEmpleadoDto updateEmpleadoDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var currentUser = GetCurrentUserInfo();
                _logger.LogInformation($"Admin {currentUser.Username} actualizando empleado ID: {id}");

                var empleado = await _empleadoService.UpdateAsync(id, updateEmpleadoDto);
                if (empleado == null)
                {
                    return NotFound(new { message = $"Empleado con ID {id} no encontrado" });
                }

                _logger.LogInformation($"Empleado ID: {id} actualizado exitosamente por Admin: {currentUser.Username}");
                return Ok(empleado);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning($"Error de validación al actualizar empleado ID {id}: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al actualizar empleado ID: {id}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Elimina un empleado - Solo administradores
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<ActionResult> DeleteEmpleado(int id)
        {
            try
            {
                var currentUser = GetCurrentUserInfo();
                _logger.LogWarning($"Admin {currentUser.Username} eliminando empleado ID: {id}");

                var result = await _empleadoService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound(new { message = $"Empleado con ID {id} no encontrado" });
                }

                _logger.LogWarning($"Empleado ID: {id} eliminado por Admin: {currentUser.Username}");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al eliminar empleado ID: {id}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtiene empleados por tipo - Solo usuarios autenticados
        /// </summary>
        [HttpGet("tipo/{tipoEmpleado}")]
        [Authorize(Policy = "UserOrAdmin")]
        public async Task<ActionResult<IEnumerable<CreateEmpleadoDto>>> GetEmpleadosByTipo(string tipoEmpleado)
        {
            try
            {
                var currentUser = GetCurrentUserInfo();
                _logger.LogInformation($"Usuario {currentUser.Username} consultando empleados tipo: {tipoEmpleado}");

                var empleados = await _empleadoService.GetByTipoAsync(tipoEmpleado);
                return Ok(empleados);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al obtener empleados tipo: {tipoEmpleado}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Calcula el salario de un empleado - Solo usuarios autenticados
        /// </summary>
        [HttpGet("{id}/salario")]
        [Authorize(Policy = "UserOrAdmin")]
        public async Task<ActionResult<object>> CalcularSalario(int id)
        {
            try
            {
                var currentUser = GetCurrentUserInfo();
                _logger.LogInformation($"Usuario {currentUser.Username} calculando salario empleado ID: {id}");

                var salario = await _empleadoService.CalcularSalarioAsync(id);
                return Ok(new
                {
                    empleadoId = id,
                    salario = salario,
                    calculadoPor = currentUser.Username,
                    fechaCalculo = DateTime.UtcNow
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al calcular salario empleado ID: {id}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Obtiene estadísticas de empleados - Solo usuarios autenticados
        /// </summary>
        [HttpGet("estadisticas")]
        [Authorize(Policy = "UserOrAdmin")]
        public async Task<ActionResult<object>> GetEstadisticas()
        {
            try
            {
                var currentUser = GetCurrentUserInfo();
                _logger.LogInformation($"Usuario {currentUser.Username} consultando estadísticas de empleados");

                var empleados = await _empleadoService.GetAllAsync();

                var estadisticas = new
                {
                    totalEmpleados = empleados.Count(),
                    empleadosPorTipo = empleados.GroupBy(e => e.TipoEmpleado)
                                               .Select(g => new { tipo = g.Key, cantidad = g.Count() }),
                    consultadoPor = currentUser.Username,
                    fechaConsulta = DateTime.UtcNow
                };

                return Ok(estadisticas);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener estadísticas de empleados");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        /// <summary>
        /// Método auxiliar para obtener información del usuario actual
        /// </summary>
        private UserInfo GetCurrentUserInfo()
        {
            return new UserInfo
            {
                UserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
                Username = User.FindFirst(ClaimTypes.Name)?.Value ?? "Usuario Desconocido",
                Role = User.FindFirst(ClaimTypes.Role)?.Value ?? "Sin Rol"
            };
        }

        private class UserInfo
        {
            public string UserId { get; set; }
            public string Username { get; set; }
            public string Role { get; set; }
        }
    }
}