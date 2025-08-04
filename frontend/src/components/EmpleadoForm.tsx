import { useForm } from "react-hook-form";
import { useState } from "react";
import type { TipoEmpleado } from "../types/Empleado";

export default function EmpleadoForm() {
  const { register, handleSubmit, reset } = useForm();
  const [tipo, setTipo] = useState<TipoEmpleado>("Asalariado");

  const onSubmit = (data: any) => {
    console.log(data); // Aquí llamarías al API
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Tipo de Empleado:</label>
      <select {...register("tipo")} onChange={(e) => setTipo(e.target.value as TipoEmpleado)}>
        <option value="Asalariado">Asalariado</option>
        <option value="PorHoras">Por Horas</option>
        <option value="PorComision">Por Comisión</option>
        <option value="AsalariadoPorComision">Asalariado por Comisión</option>
      </select>

      {(tipo !== "PorHoras") && (
        <div>
          <label>Primer Nombre:</label>
          <input {...register("primerNombre")} />
        </div>
      )}

      <div>
        <label>Apellido Paterno:</label>
        <input {...register("apellidoPaterno")} />
      </div>

      <div>
        <label>Número Seguro Social:</label>
        <input {...register("numeroSeguroSocial")} />
      </div>

      {tipo === "Asalariado" && (
        <div>
          <label>Salario Semanal:</label>
          <input type="number" {...register("salarioSemanal")} />
        </div>
      )}

      {tipo === "PorHoras" && (
        <>
          <label>Sueldo por Hora:</label>
          <input type="number" {...register("sueldoPorHora")} />
          <label>Horas Trabajadas:</label>
          <input type="number" {...register("horasTrabajadas")} />
        </>
      )}

      {tipo === "PorComision" && (
        <>
          <label>Ventas Brutas:</label>
          <input type="number" {...register("ventasBrutas")} />
          <label>Tarifa Comisión:</label>
          <input type="number" {...register("tarifaComision")} />
        </>
      )}

      {tipo === "AsalariadoPorComision" && (
        <>
          <label>Ventas Brutas:</label>
          <input type="number" {...register("ventasBrutas")} />
          <label>Tarifa Comisión:</label>
          <input type="number" {...register("tarifaComision")} />
          <label>Salario Base:</label>
          <input type="number" {...register("salarioBase")} />
        </>
      )}

      <button type="submit">Guardar</button>
    </form>
  );
}
