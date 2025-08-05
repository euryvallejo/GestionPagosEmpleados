using System;
using System.ComponentModel.DataAnnotations;

namespace GPE.Application.DTOs
{
    public class CreateEmpleadoDto
    {
        public int Id { get; set; }
        public string? PrimerNombre { get; set; }
        public string ApellidoPaterno { get; set; } = "";
        public string NumeroSeguroSocial { get; set; } = "";
        public string TipoEmpleado { get; set; } = ""; // Mantener como string
        public DateTime FechaIngreso { get; set; }

        // Campos específicos para cada tipo (opcionales)
        public decimal? SalarioSemanal { get; set; }
        public decimal? SueldoPorHora { get; set; }
        public decimal? HorasTrabajadas { get; set; }
        public decimal? VentasBrutas { get; set; }
        public decimal? TarifaComision { get; set; }
        public decimal? SalarioBase { get; set; }

        // Campo calculado automáticamente
        public decimal PagoSemanal { get; set; }
    }
}