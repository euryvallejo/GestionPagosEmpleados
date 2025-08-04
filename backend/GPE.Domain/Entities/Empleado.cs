using System;
using System.Collections.Generic;
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
        public virtual decimal CalcularSalario()
        {
            return 0;
        }
    }
}