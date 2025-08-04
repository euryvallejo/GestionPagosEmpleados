using GPE.Application.DTOs;
using GPE.Application.Interfaces;
using GPE.Domain.Entities;
using GPE.Domain.Interfaces;

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
            var empleados = await _repository.GetAllAsync();
            return empleados.Select(MapToDto);
        }

        public async Task<CreateEmpleadoDto?> GetByIdAsync(int id)
        {
            var empleado = await _repository.GetByIdAsync(id);
            return empleado != null ? MapToDto(empleado) : null;
        }

        public async Task<CreateEmpleadoDto> CreateAsync(CreateEmpleadoDto createDto)
        {
            var empleado = CreateEmpleadoFromDto(createDto);
            var createdEmpleado = await _repository.CreateAsync(empleado);
            return MapToDto(createdEmpleado);
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

        // Métodos de mapeo privados
        private static CreateEmpleadoDto MapToDto(Empleado empleado)
        {
            return new CreateEmpleadoDto
            {
                PrimerNombre = empleado.ApellidoPaterno,
                ApellidoPaterno = empleado.ApellidoPaterno,
                NumeroSeguroSocial = empleado.NumeroSeguroSocial,
                TipoEmpleado = empleado.GetType().Name,
                SalarioBase = empleado.CalcularSalario()
            };
        }

        // Métodos de mapeo privados
        private static UpdateEmpleadoDto MapToDtoUp(Empleado empleado)
        {
            return new UpdateEmpleadoDto
            {
                PrimerNombre = empleado.ApellidoPaterno,
                ApellidoPaterno = empleado.ApellidoPaterno,
                NumeroSeguroSocial = empleado.NumeroSeguroSocial,
                TipoEmpleado = empleado.GetType().Name,
                SalarioBase = empleado.CalcularSalario()
            };
        }

        private static Empleado CreateEmpleadoFromDto(CreateEmpleadoDto dto)
        {
            return dto.TipoEmpleado switch
            {
                "Asalariado" => new EmpleadoAsalariado
                {
                    PrimerNombre = dto.PrimerNombre!,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    SalarioSemanal = dto.SalarioSemanal!.Value
                },
                "PorHoras" => new EmpleadoPorHoras
                {
                    PrimerNombre = dto.PrimerNombre!,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    SueldoPorHora = dto.SueldoPorHora!.Value,
                    HorasTrabajadas = dto.HorasTrabajadas!.Value
                },
                "PorComision" => new EmpleadoPorComision
                {
                    PrimerNombre = dto.PrimerNombre!,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    VentasBrutas = dto.VentasBrutas!.Value,
                    TarifaComision = dto.TarifaComision!.Value
                },
                "AsalariadoPorComision" => new EmpleadoAsalariadoPorComision
                {
                    PrimerNombre = dto.PrimerNombre!,
                    ApellidoPaterno = dto.ApellidoPaterno,
                    NumeroSeguroSocial = dto.NumeroSeguroSocial,
                    VentasBrutas = dto.VentasBrutas!.Value,
                    TarifaComision = dto.TarifaComision!.Value,
                    SalarioBase = dto.SalarioBase!.Value
                },
                _ => throw new ArgumentException("Tipo de empleado no válido")
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