using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Threading.Tasks;

namespace GPE.Domain.Entities
{
    public abstract class Empleado
    {
        public int Id { get; set; }
        public string? PrimerNombre { get; set; }
        public string ApellidoPaterno { get; set; } = "";
        public string NumeroSeguroSocial { get; set; } = "";

        public decimal SalarioSemanal { get; set; }
        public string TipoEmpleado { get; set; } = "";

        [Column(TypeName = "datetime2")]
        public DateTime FechaIngreso { get; set; }

        // Método abstracto que debe ser implementado por cada tipo de empleado
        public abstract decimal CalcularSalario();

        // Propiedad calculada para obtener el pago semanal
        public decimal PagoSemanal => CalcularSalario();
    }
}