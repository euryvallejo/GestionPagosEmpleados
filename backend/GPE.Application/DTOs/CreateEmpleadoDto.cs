using System;
using System.ComponentModel.DataAnnotations;

namespace GPE.Application.DTOs
{
    public class CreateEmpleadoDto
    {
        public int Id { get; set; }

        public string? PrimerNombre { get; set; }

        [Required]
        public string ApellidoPaterno { get; set; }

        [Required]
        public string NumeroSeguroSocial { get; set; }

        [Required]
        public string TipoEmpleado { get; set; }

        // Propiedades específicas según el tipo de empleado
        public decimal? SalarioSemanal { get; set; } = 0;
        public decimal? SueldoPorHora { get; set; } = 0;
        public double? HorasTrabajadas { get; set; } = 0;
        public decimal? VentasBrutas { get; set; } = 0;
        public decimal? TarifaComision { get; set; } = 0;
        public decimal? SalarioBase { get; set; } = 0;
    }
}