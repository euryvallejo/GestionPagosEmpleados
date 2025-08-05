using System;

namespace GPE.Domain.Entities
{
    public class EmpleadoPorHoras : Empleado
    {
        public decimal SueldoPorHora { get; set; }
        public decimal HorasTrabajadas { get; set; }

        public override decimal CalcularSalario()
        {
            // Para empleado por horas:
            // - Trabaja 40 horas o menos: pago = horas * sueldo por hora
            // - Trabaja más de 40 horas: 40 * sueldo + (horas extras * sueldo * 1.5) asumo que esto es horas extras
            if (HorasTrabajadas <= 40)
            {
                return HorasTrabajadas * SueldoPorHora;
            }
            else
            {
                var horasRegulares = 40;
                var horasExtras = HorasTrabajadas - 40;
                return (horasRegulares * SueldoPorHora) + (horasExtras * SueldoPorHora * 1.5m);
            }

        }
    }
}