using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GPE.Domain.Entities
{
    public class EmpleadoAsalariado : Empleado
    {
        public string PrimerNombre { get; set; } = "";
        public decimal SalarioSemanal { get; set; }
    }
}