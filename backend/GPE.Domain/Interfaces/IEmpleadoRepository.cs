using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GPE.Domain.Entities;

namespace GPE.Domain.Interfaces
{
    public interface IEmpleadoRepository
    {
        Task<IEnumerable<Empleado>> GetAllAsync();
        Task<Empleado?> GetByIdAsync(int id);
        Task<Empleado> CreateAsync(Empleado empleado);
        Task<Empleado?> UpdateAsync(Empleado empleado);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Empleado>> GetByTipoAsync(string tipo);
    }
}