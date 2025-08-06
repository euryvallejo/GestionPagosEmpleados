using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xunit;
using Moq;
using GPE.Infrastructure.Persistence;
using GPE.Infrastructure.Repositories;
using GPE.Application.Services;
using GPE.Application.DTOs;
using GPE.Domain.Interfaces;

namespace GPE.Test.Integration
{
    public class EmpleadoServiceIntegrationTests : IDisposable
    {
        private readonly ContextApp _context;
        private readonly EmpleadoService _empleadoService;
        private readonly IServiceProvider _serviceProvider;

        public EmpleadoServiceIntegrationTests()
        {
            // Configurar DbContext en memoria
            var options = new DbContextOptionsBuilder<ContextApp>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ContextApp(options);

            // Configurar ServiceProvider con todas las dependencias
            var services = new ServiceCollection();

            // Registrar DbContext
            services.AddSingleton(_context);

            // Registrar repositorios
            services.AddScoped<IEmpleadoRepository, EmpleadoRepository>();

            // Registrar logger mock
            var mockLogger = new Mock<ILogger<EmpleadoService>>();
            services.AddSingleton(mockLogger.Object);

            // Registrar el servicio
            services.AddScoped<EmpleadoService>();

            _serviceProvider = services.BuildServiceProvider();

            // Obtener el servicio del contenedor
            _empleadoService = _serviceProvider.GetRequiredService<EmpleadoService>();
        }

        [Fact]
        public async Task FullWorkflow_DeberiaFuncionar_CrearActualizarEliminar()
        {
            // Arrange - Crear
            var createDto = new CreateEmpleadoDto
            {
                TipoEmpleado = "Asalariado",
                PrimerNombre = "Fernando",
                ApellidoPaterno = "Vallejo",
                NumeroSeguroSocial = "1111111",
                SalarioSemanal = 1500
            };

            // Act - Crear
            var empleadoCreado = await _empleadoService.CreateAsync(createDto);

            // Assert - Crear
            Assert.NotNull(empleadoCreado);
            Assert.Equal("Fernando", empleadoCreado.PrimerNombre);
            Assert.Equal("Vallejo", empleadoCreado.ApellidoPaterno);
            Assert.Equal(1500, empleadoCreado.SalarioSemanal);

            // Act - Obtener
            var empleadoObtenido = await _empleadoService.GetByIdAsync(empleadoCreado.Id);

            // Assert - Obtener
            Assert.NotNull(empleadoObtenido);
            Assert.Equal(empleadoCreado.Id, empleadoObtenido.Id);
            Assert.Equal("Fernando", empleadoObtenido.PrimerNombre);

            // Act - Actualizar
            var updateDto = new UpdateEmpleadoDto
            {
                PrimerNombre = "Fernando Updated",
                SalarioSemanal = 2000
            };
            var empleadoActualizado = await _empleadoService.UpdateAsync(empleadoCreado.Id, updateDto);

            // Assert - Actualizar
            Assert.NotNull(empleadoActualizado);
            Assert.Equal("Fernando Updated", empleadoActualizado.PrimerNombre);
            Assert.Equal(2000, empleadoActualizado.SalarioSemanal);

            // Act - Eliminar
            var eliminado = await _empleadoService.DeleteAsync(empleadoCreado.Id);

            // Assert - Eliminar
            Assert.True(eliminado);

            // Verificar que ya no existe
            var empleadoEliminado = await _empleadoService.GetByIdAsync(empleadoCreado.Id);
            Assert.Null(empleadoEliminado);
        }

        [Fact]
        public async Task CreateAsync_DeberiaCrearEmpleadoPorHoras_CuandoDatosValidos()
        {
            // Arrange
            var createDto = new CreateEmpleadoDto
            {
                TipoEmpleado = "PorHoras",
                PrimerNombre = "Juan",
                ApellidoPaterno = "Pérez",
                NumeroSeguroSocial = "2222222",
                SueldoPorHora = 25,
                HorasTrabajadas = 40
            };

            // Act
            var empleadoCreado = await _empleadoService.CreateAsync(createDto);

            // Assert
            Assert.NotNull(empleadoCreado);
            Assert.Equal("Juan", empleadoCreado.PrimerNombre);
            Assert.Equal("Pérez", empleadoCreado.ApellidoPaterno);
            Assert.Equal(25, empleadoCreado.SueldoPorHora);
            Assert.Equal(40, empleadoCreado.HorasTrabajadas);
        }

        public void Dispose()
        {
            _serviceProvider?.GetService<ContextApp>()?.Dispose();
            _context?.Dispose();
            if (_serviceProvider is IDisposable disposableProvider)
            {
                disposableProvider.Dispose();
            }
        }
    }
}