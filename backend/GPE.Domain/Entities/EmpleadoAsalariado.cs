using System;

namespace GPE.Domain.Entities
{
    public class EmpleadoAsalariado : Empleado
    {
        public string PrimerNombre { get; set; } = "";

        public override decimal CalcularSalario()
        {
            // Implement the salary calculation logic for salaried employees
            // This is a placeholder implementation
            return 0;
        }
    }
}