using System;
using System.ComponentModel.DataAnnotations;

namespace GPE.Application.DTOs
{
    public class CreateEmpleadoDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string? PrimerNombre { get; set; }

        [Required]
        public string ApellidoPaterno { get; set; }

        [Required]
        public string NumeroSeguroSocial { get; set; }

        [Required]
        public string TipoEmpleado { get; set; }

        // Propiedades específicas según el tipo de empleado
        public decimal? SalarioSemanal { get; set; }
        public decimal? SueldoPorHora { get; set; }
        public double? HorasTrabajadas { get; set; }
        public decimal? VentasBrutas { get; set; }
        public decimal? TarifaComision { get; set; }
        public decimal? SalarioBase { get; set; }
    }
}