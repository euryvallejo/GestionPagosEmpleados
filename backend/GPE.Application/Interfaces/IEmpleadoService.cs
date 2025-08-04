using GPE.Application.DTOs;
using GPE.Domain.Entities;

namespace GPE.Application.Interfaces
{
    public interface IEmpleadoService
    {
        Task<IEnumerable<CreateEmpleadoDto>> GetAllAsync();
        Task<CreateEmpleadoDto> GetByIdAsync(int id);
        Task<CreateEmpleadoDto> CreateAsync(CreateEmpleadoDto empleadoDto);
        Task<UpdateEmpleadoDto> UpdateAsync(int id, UpdateEmpleadoDto empleadoDto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<CreateEmpleadoDto>> GetByTipoAsync(string tipo);
        Task<decimal> CalcularSalarioAsync(int id);
    }
}