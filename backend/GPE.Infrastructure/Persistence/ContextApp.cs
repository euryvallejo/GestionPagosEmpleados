using Microsoft.EntityFrameworkCore;
using GPE.Domain.Entities;
namespace GPE.Infrastructure.Persistence
{
    public class ContextApp : DbContext
    {
        public ContextApp(DbContextOptions<ContextApp> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Empleado> Empleados { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            // Herencia con Discriminator para Generar Tablas por Tipo de Empleado
            modelBuilder.Entity<Empleado>()
                .HasDiscriminator<string>("TipoEmpleado")
                .HasValue<EmpleadoAsalariado>("Asalariado")
                .HasValue<EmpleadoPorHoras>("PorHoras")
                .HasValue<EmpleadoPorComision>("PorComision")
                .HasValue<EmpleadoAsalariadoPorComision>("AsalariadoPorComision");

            base.OnModelCreating(modelBuilder);
        }
    }
}