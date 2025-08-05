using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GPE.Application.DTOs
{
    public class UpdateEmpleadoDto
    {
        public int Id { get; set; }
        public string PrimerNombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string TipoEmpleado { get; set; } // Ejemplo: "Empleado", "Contratista", etc.
        public string NumeroSeguroSocial { get; set; }

        // Propiedades específicas según el tipo de empleado
        public decimal? SalarioSemanal { get; set; }
        public decimal? SueldoPorHora { get; set; }
        public decimal? HorasTrabajadas { get; set; }
        public decimal? VentasBrutas { get; set; }
        public decimal? TarifaComision { get; set; }
        public decimal? SalarioBase { get; set; }

    }
}