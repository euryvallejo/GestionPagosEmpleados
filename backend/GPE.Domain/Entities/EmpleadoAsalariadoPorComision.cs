using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GPE.Domain.Entities
{
    public class EmpleadoAsalariadoPorComision : Empleado
    {
        public string PrimerNombre { get; set; } = string.Empty;
        public decimal VentasBrutas { get; set; }
        public decimal TarifaComision { get; set; }
        public decimal SalarioBase { get; set; }
    }
}