using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GPE.Domain.Entities
{
    public class EmpleadoPorComision : Empleado
    {
        public string PrimerNombre { get; set; } = string.Empty;
        public decimal VentasBrutas { get; set; }
        public decimal TarifaComision { get; set; }
    }
}