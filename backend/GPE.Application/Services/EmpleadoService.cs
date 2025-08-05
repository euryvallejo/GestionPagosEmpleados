using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using GPE.Domain.Entities;
using GPE.Domain.Interfaces;
using GPE.Domain.Enums;

namespace GPE.Application.Services
{
    public class EmpleadoService : IEmpleadoService
    {
        private readonly IEmpleadoRepository _repository;

        public EmpleadoService(IEmpleadoRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CreateEmpleadoDto>> GetAllAsync()
        {
            try
            {
                var empleados = await _repository.GetAllAsync();

                // Logging en el servicio
                Console.WriteLine($"Empleados desde repository: {empleados?.Count() ?? 0}");

                if (empleados != null && empleados.Any())
                {
                    var firstEmpleado = empleados.First();
                    Console.WriteLine($"Primer empleado - Fecha desde DB: {firstEmpleado.FechaIngreso:yyyy-MM-dd HH:mm:ss}");
                }

                var dtos = empleados.Select(emp => new CreateEmpleadoDto
                {
                    Id = emp.Id,
                    PrimerNombre = emp.PrimerNombre,
                    ApellidoPaterno = emp.ApellidoPaterno,
                    FechaIngreso = emp.FechaIngreso,
                    TipoEmpleado = emp.TipoEmpleado,
                    SalarioSemanal = emp.SalarioSemanal

                }).ToList();

                // Verificar después del mapeo
                if (dtos.Any())
                {
                    var firstDto = dtos.First();
                    Console.WriteLine($"Primer DTO - Fecha después del mapeo: {firstDto.FechaIngreso:yyyy-MM-dd HH:mm:ss}");
                }

                return dtos;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en EmpleadoService.GetAllAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<CreateEmpleadoDto?> GetByIdAsync(int id)
        {
            var empleado = await _repository.GetByIdAsync(id);
            return empleado != null ? MapToDto(empleado) : null;
        }

        public async Task<CreateEmpleadoDto> CreateAsync(CreateEmpleadoDto dto)
        {
            // Convertir string a enum si es necesario
            if (!Enum.TryParse<TipoEmpleado>(dto.TipoEmpleado, out var tipoEnum))
            {
                throw new ArgumentException($"Tipo de empleado no válido: {dto.TipoEmpleado}");
            }

            // Crear la instancia específica del empleado usando el string
            Empleado empleado = dto.TipoEmpleado switch
            {
                "Asalariado" => new EmpleadoAsalariado
                {
                    PrimerNombre = dto.PrimerNombre,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    SalarioSemanal = dto.SalarioSemanal ?? 0
                },
                "PorHoras" => new EmpleadoPorHoras
                {
                    PrimerNombre = dto.PrimerNombre, // Puede ser null para empleados por horas
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    SueldoPorHora = dto.SueldoPorHora ?? 0,
                    HorasTrabajadas = dto.HorasTrabajadas ?? 0
                },
                "PorComision" => new EmpleadoPorComision
                {
                    PrimerNombre = dto.PrimerNombre,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    VentasBrutas = dto.VentasBrutas ?? 0,
                    TarifaComision = dto.TarifaComision ?? 0
                },
                "AsalariadoPorComision" => new EmpleadoAsalariadoPorComision
                {
                    PrimerNombre = dto.PrimerNombre,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    SalarioBase = dto.SalarioBase ?? 0,
                    VentasBrutas = dto.VentasBrutas ?? 0,
                    TarifaComision = dto.TarifaComision ?? 0
                },
                _ => throw new ArgumentException($"Tipo de empleado no válido: {dto.TipoEmpleado}")
            };

            // Calcular el pago automáticamente
            var pagoCalculado = empleado.CalcularSalario();

            empleado.FechaIngreso = DateTime.UtcNow;
            empleado.TipoEmpleado = dto.TipoEmpleado;
            empleado.SalarioSemanal = pagoCalculado; // Asignar el pago calculado

            // Guardar en la base de datos
            await _repository.CreateAsync(empleado);



            // Retornar DTO con el pago calculado
            return new CreateEmpleadoDto
            {
                Id = empleado.Id,
                PrimerNombre = empleado.PrimerNombre,
                ApellidoPaterno = empleado.ApellidoPaterno,
                NumeroSeguroSocial = empleado.NumeroSeguroSocial,
                TipoEmpleado = dto.TipoEmpleado,
                SalarioSemanal = dto.SalarioSemanal,
                SueldoPorHora = dto.SueldoPorHora,
                HorasTrabajadas = dto.HorasTrabajadas,
                VentasBrutas = dto.VentasBrutas,
                TarifaComision = dto.TarifaComision,
                SalarioBase = dto.SalarioBase,
                PagoSemanal = pagoCalculado // Pago calculado automáticamente
            };
        }

        public async Task<UpdateEmpleadoDto?> UpdateAsync(int id, UpdateEmpleadoDto updateDto)
        {
            var existingEmpleado = await _repository.GetByIdAsync(id);
            if (existingEmpleado == null) return null;

            UpdateEmpleadoFromDto(existingEmpleado, updateDto);
            var updatedEmpleado = await _repository.UpdateAsync(existingEmpleado);
            return updatedEmpleado != null ? MapToDtoUp(updatedEmpleado) : null;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task<IEnumerable<CreateEmpleadoDto>> GetByTipoAsync(string tipo)
        {
            var empleados = await _repository.GetByTipoAsync(tipo);
            return empleados.Select(MapToDto);
        }

        public async Task<decimal> CalcularSalarioAsync(int id)
        {
            var empleado = await _repository.GetByIdAsync(id);
            if (empleado == null) throw new ArgumentException("Empleado no encontrado");

            return empleado.CalcularSalario();
        }

        // Métodos de mapeo privados actualizados
        private static CreateEmpleadoDto MapToDto(Empleado empleado)
        {
            var dto = new CreateEmpleadoDto
            {
                Id = empleado.Id,
                PrimerNombre = empleado.PrimerNombre,
                ApellidoPaterno = empleado.ApellidoPaterno,
                NumeroSeguroSocial = empleado.NumeroSeguroSocial,
                TipoEmpleado = GetTipoEmpleadoString(empleado),
                PagoSemanal = empleado.CalcularSalario()
            };

            // Mapear campos específicos según el tipo
            switch (empleado)
            {
                case EmpleadoAsalariado asalariado:
                    dto.SalarioSemanal = asalariado.SalarioSemanal;
                    break;
                case EmpleadoPorHoras porHoras:
                    dto.SueldoPorHora = porHoras.SueldoPorHora;
                    dto.HorasTrabajadas = porHoras.HorasTrabajadas;
                    break;
                case EmpleadoPorComision porComision:
                    dto.VentasBrutas = porComision.VentasBrutas;
                    dto.TarifaComision = porComision.TarifaComision;
                    break;
                case EmpleadoAsalariadoPorComision asalariadoComision:
                    dto.SalarioBase = asalariadoComision.SalarioBase;
                    dto.VentasBrutas = asalariadoComision.VentasBrutas;
                    dto.TarifaComision = asalariadoComision.TarifaComision;
                    break;
            }

            return dto;
        }

        private static UpdateEmpleadoDto MapToDtoUp(Empleado empleado)
        {
            return new UpdateEmpleadoDto
            {
                PrimerNombre = empleado.PrimerNombre,
                ApellidoPaterno = empleado.ApellidoPaterno,
                NumeroSeguroSocial = empleado.NumeroSeguroSocial,
                TipoEmpleado = GetTipoEmpleadoString(empleado),
                SalarioBase = empleado.CalcularSalario()
            };
        }

        // Método auxiliar para obtener el string del tipo de empleado
        private static string GetTipoEmpleadoString(Empleado empleado)
        {
            return empleado.GetType().Name switch
            {
                nameof(EmpleadoAsalariado) => "Asalariado",
                nameof(EmpleadoPorHoras) => "PorHoras",
                nameof(EmpleadoPorComision) => "PorComision",
                nameof(EmpleadoAsalariadoPorComision) => "AsalariadoPorComision",
                _ => "Desconocido"
            };
        }

        private static void UpdateEmpleadoFromDto(Empleado empleado, UpdateEmpleadoDto dto)
        {
            // Actualizar propiedades comunes
            if (!string.IsNullOrEmpty(dto.PrimerNombre)) empleado.PrimerNombre = dto.PrimerNombre;
            if (!string.IsNullOrEmpty(dto.ApellidoPaterno)) empleado.ApellidoPaterno = dto.ApellidoPaterno;
            if (!string.IsNullOrEmpty(dto.NumeroSeguroSocial)) empleado.NumeroSeguroSocial = dto.NumeroSeguroSocial;

            // Actualizar propiedades específicas según el tipo
            switch (empleado)
            {
                case EmpleadoAsalariado asalariado when dto.SalarioSemanal.HasValue:
                    asalariado.SalarioSemanal = dto.SalarioSemanal.Value;
                    break;
                case EmpleadoPorHoras porHoras:
                    if (dto.SueldoPorHora.HasValue) porHoras.SueldoPorHora = dto.SueldoPorHora.Value;
                    if (dto.HorasTrabajadas.HasValue) porHoras.HorasTrabajadas = dto.HorasTrabajadas.Value;
                    break;
                case EmpleadoPorComision porComision:
                    if (dto.VentasBrutas.HasValue) porComision.VentasBrutas = dto.VentasBrutas.Value;
                    if (dto.TarifaComision.HasValue) porComision.TarifaComision = dto.TarifaComision.Value;
                    break;
                case EmpleadoAsalariadoPorComision asalariadoComision:
                    if (dto.VentasBrutas.HasValue) asalariadoComision.VentasBrutas = dto.VentasBrutas.Value;
                    if (dto.TarifaComision.HasValue) asalariadoComision.TarifaComision = dto.TarifaComision.Value;
                    if (dto.SalarioBase.HasValue) asalariadoComision.SalarioBase = dto.SalarioBase.Value;
                    break;
            }
        }
    }
}