using Microsoft.AspNetCore.Mvc;
using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using GPE.Domain.Entities;

namespace GPE.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpleadoController : ControllerBase
    {
        private readonly IEmpleadoService _empleadoService;

        public EmpleadoController(IEmpleadoService empleadoService)
        {
            _empleadoService = empleadoService;
        }

        /// <summary>
        /// Obtiene todos los empleados
        /// </summary>
        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<EmpleadoDto>>> GetAllEmpleados()
        // {
        //     try
        //     {
        //         var empleados = await _empleadoService.GetAllAsync();
        //         return Ok(empleados);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        //     }
        // }

        /// <summary>
        /// Obtiene un empleado por ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<CreateEmpleadoDto>> GetEmpleado(int id)
        {
            try
            {
                var empleado = await _empleadoService.GetByIdAsync(id);
                if (empleado == null)
                {
                    return NotFound($"Empleado con ID {id} no encontrado");
                }
                return Ok(empleado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        /// <summary>
        /// Crea un nuevo empleado según su tipo
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CreateEmpleadoDto>> CreateEmpleado([FromBody] CreateEmpleadoDto createEmpleadoDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var empleado = await _empleadoService.CreateAsync(createEmpleadoDto);
                return CreatedAtAction(
                    nameof(GetEmpleado),
                    new { id = empleado.Id },
                    empleado
                );
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        /// <summary>
        /// Actualiza un empleado existente
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<UpdateEmpleadoDto>> UpdateEmpleado(int id, [FromBody] UpdateEmpleadoDto updateEmpleadoDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var empleado = await _empleadoService.UpdateAsync(id, updateEmpleadoDto);
                if (empleado == null)
                {
                    return NotFound($"Empleado con ID {id} no encontrado");
                }

                return Ok(empleado);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        /// <summary>
        /// Elimina un empleado
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEmpleado(int id)
        {
            try
            {
                var result = await _empleadoService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound($"Empleado con ID {id} no encontrado");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtiene empleados por tipo
        /// </summary>
        [HttpGet("tipo/{tipoEmpleado}")]
        public async Task<ActionResult<IEnumerable<CreateEmpleadoDto>>> GetEmpleadosByTipo(string tipoEmpleado)
        {
            try
            {
                var empleados = await _empleadoService.GetByTipoAsync(tipoEmpleado);
                return Ok(empleados);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        /// <summary>
        /// Calcula el salario de un empleado
        /// </summary>
        [HttpGet("{id}/salario")]
        public async Task<ActionResult<decimal>> CalcularSalario(int id)
        {
            try
            {
                var salario = await _empleadoService.CalcularSalarioAsync(id);
                return Ok(new { EmpleadoId = id, Salario = salario });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}