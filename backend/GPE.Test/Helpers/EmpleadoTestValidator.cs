using GPE.Domain.Entities;
using GPE.Application.DTOs;

namespace GPE.Test.Helpers
{
    public static class EmpleadoTestValidator
    {
        public static bool ValidarCreateEmpleadoDto(CreateEmpleadoDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.ApellidoPaterno))
                return false;

            if (string.IsNullOrWhiteSpace(dto.NumeroSeguroSocial) ||
                dto.NumeroSeguroSocial.Length < 7 ||
                dto.NumeroSeguroSocial.Length > 11)
                return false;

            return dto.TipoEmpleado switch
            {
                "Asalariado" => dto.SalarioSemanal > 0,
                "PorHoras" => dto.SueldoPorHora > 0 && dto.HorasTrabajadas >= 0,
                "PorComision" => dto.VentasBrutas >= 0 && dto.TarifaComision > 0,
                "AsalariadoPorComision" => dto.SalarioBase > 0 && dto.VentasBrutas >= 0 && dto.TarifaComision > 0,
                _ => false
            };
        }

        public static decimal CalcularSalarioEsperado(Empleado empleado)
        {
            return empleado switch
            {
                EmpleadoAsalariado asalariado => asalariado.SalarioSemanal,
                EmpleadoPorHoras porHoras => CalcularSalarioPorHoras(porHoras),
                EmpleadoPorComision porComision => porComision.VentasBrutas * (porComision.TarifaComision / 100),
                EmpleadoAsalariadoPorComision asalariadoComision =>
                    asalariadoComision.SalarioBase + (asalariadoComision.VentasBrutas * (asalariadoComision.TarifaComision / 100)),
                _ => 0
            };
        }

        private static decimal CalcularSalarioPorHoras(EmpleadoPorHoras empleado)
        {
            if (empleado.HorasTrabajadas <= 40)
            {
                return empleado.SueldoPorHora * empleado.HorasTrabajadas;
            }
            else
            {
                var horasNormales = 40;
                var horasExtra = empleado.HorasTrabajadas - 40;
                return (empleado.SueldoPorHora * horasNormales) +
                       (empleado.SueldoPorHora * 1.5m * horasExtra);
            }
        }
    }
}