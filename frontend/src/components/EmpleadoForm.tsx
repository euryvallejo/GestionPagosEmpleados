import { useForm } from "react-hook-form";
import { useState } from "react";
import type { TipoEmpleado } from "../types/empleado";
import { createEmpleado } from '../services/empleadoService';

interface EmpleadoFormData {
  tipoEmpleado: TipoEmpleado;
  primerNombre?: string;
  apellidoPaterno: string;
  numeroSeguroSocial: string;
  salarioSemanal?: number;
  sueldoPorHora?: number;
  horasTrabajadas?: number;
  ventasBrutas?: number;
  tarifaComision?: number;
  salarioBase?: number;
}

export default function EmpleadoForm() {
  const { register, handleSubmit, reset, watch } = useForm<EmpleadoFormData>();
  const [tipo, setTipo] = useState<TipoEmpleado>("Asalariado");

  const onSubmit = async (data: EmpleadoFormData) => {
    console.log('Form data before processing:', data);
    
    // Crear objeto base con campos obligatorios
    const empleadoData: any = {
      id: 0,
      apellidoPaterno: data.apellidoPaterno,
      numeroSeguroSocial: data.numeroSeguroSocial,
      tipoEmpleado: data.tipoEmpleado,
      // Inicializar todos los campos numéricos en 0
      salarioSemanal: 0,
      sueldoPorHora: 0,
      horasTrabajadas: 0,
      ventasBrutas: 0,
      tarifaComision: 0,
      salarioBase: 0
    };

    // Agregar campos específicos según el tipo de empleado
    switch (data.tipoEmpleado) {
      case "Asalariado":
        empleadoData.primerNombre = data.primerNombre || "";
        empleadoData.salarioSemanal = parseFloat(data.salarioSemanal?.toString() || "0");
        break;
        
      case "PorHoras":
        // Para empleados por horas, no incluir primerNombre
        empleadoData.primerNombre = "";
        empleadoData.sueldoPorHora = parseFloat(data.sueldoPorHora?.toString() || "0");
        empleadoData.horasTrabajadas = parseFloat(data.horasTrabajadas?.toString() || "0");
        break;
        
      case "PorComision":
        empleadoData.primerNombre = data.primerNombre || "";
        empleadoData.ventasBrutas = parseFloat(data.ventasBrutas?.toString() || "0");
        empleadoData.tarifaComision = parseFloat(data.tarifaComision?.toString() || "0");
        break;
        
      case "AsalariadoPorComision":
        empleadoData.primerNombre = data.primerNombre || "";
        empleadoData.ventasBrutas = parseFloat(data.ventasBrutas?.toString() || "0");
        empleadoData.tarifaComision = parseFloat(data.tarifaComision?.toString() || "0");
        empleadoData.salarioBase = parseFloat(data.salarioBase?.toString() || "0");
        break;
    }

    console.log('Processed employee data:', empleadoData);
    
    try {
      const result = await createEmpleado(empleadoData);
      if (result) {
        alert('Empleado creado exitosamente');
        reset();
      } else {
        alert('Error al crear el empleado');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Error al crear el empleado');
    }
  };

  return (
    <div className="empleado-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Tipo de Empleado:</label>
          <select 
            {...register("tipoEmpleado", { required: true })} 
            onChange={(e) => setTipo(e.target.value as TipoEmpleado)}
            className="form-control"
          >
            <option value="Asalariado">Asalariado</option>
            <option value="PorHoras">Por Horas</option>
            <option value="PorComision">Por Comisión</option>
            <option value="AsalariadoPorComision">Asalariado por Comisión</option>
          </select>
        </div>

        {/* Primer Nombre - NO mostrar para empleados por horas */}
        {tipo !== "PorHoras" && (
          <div className="form-group">
            <label>Primer Nombre:</label>
            <input 
              {...register("primerNombre")} 
              className="form-control"
              type="text"
            />
          </div>
        )}

        <div className="form-group">
          <label>Apellido Paterno:</label>
          <input 
            {...register("apellidoPaterno", { required: true })} 
            className="form-control"
            type="text"
          />
        </div>

        <div className="form-group">
          <label>Número Seguro Social:</label>
          <input 
            {...register("numeroSeguroSocial", { required: true })} 
            className="form-control"
            type="text"
          />
        </div>

        {tipo === "Asalariado" && (
          <div className="form-group">
            <label>Salario Semanal:</label>
            <input 
              type="number" 
              step="0.01"
              {...register("salarioSemanal", { required: true, min: 0 })} 
              className="form-control"
            />
          </div>
        )}

        {tipo === "PorHoras" && (
          <>
            <div className="form-group">
              <label>Sueldo por Hora:</label>
              <input 
                type="number" 
                step="0.01"
                {...register("sueldoPorHora", { required: true, min: 0 })} 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Horas Trabajadas:</label>
              <input 
                type="number" 
                step="0.01"
                {...register("horasTrabajadas", { required: true, min: 0 })} 
                className="form-control"
              />
            </div>
          </>
        )}

        {tipo === "PorComision" && (
          <>
            <div className="form-group">
              <label>Ventas Brutas:</label>
              <input 
                type="number" 
                step="0.01"
                {...register("ventasBrutas", { required: true, min: 0 })} 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Tarifa Comisión:</label>
              <input 
                type="number" 
                step="0.01"
                {...register("tarifaComision", { required: true, min: 0 })} 
                className="form-control"
              />
            </div>
          </>
        )}

        {tipo === "AsalariadoPorComision" && (
          <>
            <div className="form-group">
              <label>Ventas Brutas:</label>
              <input 
                type="number" 
                step="0.01"
                {...register("ventasBrutas", { required: true, min: 0 })} 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Tarifa Comisión:</label>
              <input 
                type="number" 
                step="0.01"
                {...register("tarifaComision", { required: true, min: 0 })} 
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Salario Base:</label>
              <input 
                type="number" 
                step="0.01"
                {...register("salarioBase", { required: true, min: 0 })} 
                className="form-control"
              />
            </div>
          </>
        )}

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Guardar Empleado
          </button>
        </div>
      </form>
    </div>
  );
}