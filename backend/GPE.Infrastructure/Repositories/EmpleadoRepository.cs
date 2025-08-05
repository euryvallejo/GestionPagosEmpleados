using GPE.Application.Interfaces;
using GPE.Domain.Entities;
using GPE.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using GPE.Domain.Interfaces;

namespace GPE.Infrastructure.Repositories
{
    public class EmpleadoRepository : IEmpleadoRepository
    {
        private readonly ContextApp _context;

        public EmpleadoRepository(ContextApp context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Empleado>> GetAllAsync()
        {
            try
            {
                var empleados = await _context.Empleados.ToListAsync();

                Console.WriteLine($"Repository: {empleados.Count} empleados encontrados");

                if (empleados.Any())
                {
                    var first = empleados.First();
                    Console.WriteLine($"Repository - Primera fecha: {first.FechaIngreso:yyyy-MM-dd HH:mm:ss}");
                    Console.WriteLine($"Repository - Fecha raw: {first.FechaIngreso}");
                }

                return empleados;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en Repository.GetAllAsync: {ex.Message}");
                throw;
            }
        }

        public async Task<Empleado?> GetByIdAsync(int id)
        {
            return await _context.Empleados.FindAsync(id);
        }

        public async Task<Empleado> CreateAsync(Empleado empleado)
        {
            _context.Empleados.Add(empleado);
            await _context.SaveChangesAsync();
            return empleado;
        }

        public async Task<Empleado?> UpdateAsync(Empleado empleado)
        {
            _context.Empleados.Update(empleado);
            await _context.SaveChangesAsync();
            return empleado;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var empleado = await GetByIdAsync(id);
            if (empleado == null) return false;

            _context.Empleados.Remove(empleado);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Empleado>> GetByTipoAsync(string tipo)
        {
            return await _context.Empleados
                .Where(e => EF.Property<string>(e, "TipoEmpleado") == tipo)
                .ToListAsync();
        }
    }
}