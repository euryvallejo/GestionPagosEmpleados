using System;

namespace GPE.Domain.Entities
{
    public class EmpleadoAsalariadoPorComision : Empleado
    {
        public decimal SalarioBase { get; set; }
        public decimal VentasBrutas { get; set; }
        public decimal TarifaComision { get; set; }

        public override decimal CalcularSalario()
        {
            return SalarioBase + (VentasBrutas * TarifaComision);
        }

    }
}