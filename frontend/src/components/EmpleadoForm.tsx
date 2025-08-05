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

interface EmpleadoFormProps {
  onSuccess?: () => void; // Callback cuando se guarda exitosamente
  onCancel?: () => void;  // Callback para cancelar
  isModal?: boolean;      // Indica si está en un modal
}

export default function EmpleadoForm({ onSuccess, onCancel, isModal = false }: EmpleadoFormProps) {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<EmpleadoFormData>();
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
        
        // Si está en modal y hay callback de éxito, lo ejecuta
        if (isModal && onSuccess) {
          onSuccess();
        }
      } else {
        alert('Error al crear el empleado');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Error al crear el empleado');
    }
  };

  // Función para manejar cancelación
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Función para obtener la descripción del tipo de empleado
  const getTipoDescription = () => {
    switch (tipo) {
      case "Asalariado":
        return "Empleado con salario fijo semanal";
      case "PorHoras":
        return "Empleado que cobra por horas trabajadas";
      case "PorComision":
        return "Empleado que cobra únicamente por comisiones de ventas";
      case "AsalariadoPorComision":
        return "Empleado con salario base más comisiones por ventas";
      default:
        return "";
    }
  };

  return (
    <div className={`${isModal ? 'p-4' : 'container mt-4'}`}>
      {!isModal && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex align-items-center mb-3">
              <div className="me-3">
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                  <i className="fas fa-user-plus text-white fa-lg"></i>
                </div>
              </div>
              <div>
                <h2 className="mb-1">Registrar Nuevo Empleado</h2>
                <p className="text-muted mb-0">Complete la información del empleado según su tipo</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* Información Básica */}
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0">
                  <i className="fas fa-user me-2"></i>
                  Información Básica
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Tipo de Empleado *</label>
                    <select 
                      {...register("tipoEmpleado", { required: "El tipo de empleado es requerido" })} 
                      onChange={(e) => setTipo(e.target.value as TipoEmpleado)}
                      className={`form-select ${errors.tipoEmpleado ? 'is-invalid' : ''}`}
                    >
                      <option value="Asalariado">Asalariado</option>
                      <option value="PorHoras">Por Horas</option>
                      <option value="PorComision">Por Comisión</option>
                      <option value="AsalariadoPorComision">Asalariado por Comisión</option>
                    </select>
                    {errors.tipoEmpleado && (
                      <div className="invalid-feedback">{errors.tipoEmpleado.message}</div>
                    )}
                    <div className="form-text">
                      <i className="fas fa-info-circle me-1"></i>
                      {getTipoDescription()}
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Apellido Paterno *</label>
                    <input 
                      {...register("apellidoPaterno", { 
                        required: "El apellido paterno es requerido",
                        minLength: { value: 2, message: "Debe tener al menos 2 caracteres" }
                      })} 
                      className={`form-control ${errors.apellidoPaterno ? 'is-invalid' : ''}`}
                      type="text"
                      placeholder="Ingrese el apellido paterno"
                    />
                    {errors.apellidoPaterno && (
                      <div className="invalid-feedback">{errors.apellidoPaterno.message}</div>
                    )}
                  </div>

                  {/* Primer Nombre - NO mostrar para empleados por horas */}
                  {tipo !== "PorHoras" && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Primer Nombre</label>
                      <input 
                        {...register("primerNombre", {
                          minLength: { value: 2, message: "Debe tener al menos 2 caracteres" }
                        })} 
                        className={`form-control ${errors.primerNombre ? 'is-invalid' : ''}`}
                        type="text"
                        placeholder="Ingrese el primer nombre"
                      />
                      {errors.primerNombre && (
                        <div className="invalid-feedback">{errors.primerNombre.message}</div>
                      )}
                    </div>
                  )}

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Número Seguro Social *</label>
                    <input 
                      {...register("numeroSeguroSocial", { 
                        required: "El número de seguro social es requerido",
                        minLength: { 
                          value: 7, 
                          message: "Debe tener al menos 7 dígitos" 
                        },
                        pattern: {
                          value: /^\d+$/,
                          message: "Solo se permiten números"
                        }
                      })} 
                      className={`form-control ${errors.numeroSeguroSocial ? 'is-invalid' : ''}`}
                      type="text"
                      placeholder="1234567"
                    />
                    {errors.numeroSeguroSocial && (
                      <div className="invalid-feedback">{errors.numeroSeguroSocial.message}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Información Salarial */}
          <div className="col-12 mb-4">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0">
                  <i className="fas fa-dollar-sign me-2"></i>
                  Información Salarial - {tipo}
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  {tipo === "Asalariado" && (
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Salario Semanal *</label>
                      <div className="input-group">
                        <span className="input-group-text">DOP$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          {...register("salarioSemanal", { 
                            required: "El salario semanal es requerido", 
                            min: { value: 0.01, message: "Debe ser mayor a 0" }
                          })} 
                          className={`form-control ${errors.salarioSemanal ? 'is-invalid' : ''}`}
                          placeholder="0.00"
                        />
                        {errors.salarioSemanal && (
                          <div className="invalid-feedback">{errors.salarioSemanal.message}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {tipo === "PorHoras" && (
                    <>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Sueldo por Hora *</label>
                        <div className="input-group">
                          <span className="input-group-text">DOP$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            {...register("sueldoPorHora", { 
                              required: "El sueldo por hora es requerido", 
                              min: { value: 0.01, message: "Debe ser mayor a 0" }
                            })} 
                            className={`form-control ${errors.sueldoPorHora ? 'is-invalid' : ''}`}
                            placeholder="0.00"
                          />
                          {errors.sueldoPorHora && (
                            <div className="invalid-feedback">{errors.sueldoPorHora.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Horas Trabajadas *</label>
                        <input 
                          type="number" 
                          step="0.5"
                          {...register("horasTrabajadas", { 
                            required: "Las horas trabajadas son requeridas", 
                            min: { value: 0.5, message: "Mínimo 0.5 horas" },
                            max: { value: 168, message: "Máximo 168 horas por semana" }
                          })} 
                          className={`form-control ${errors.horasTrabajadas ? 'is-invalid' : ''}`}
                          placeholder="40"
                        />
                        {errors.horasTrabajadas && (
                          <div className="invalid-feedback">{errors.horasTrabajadas.message}</div>
                        )}
                      </div>
                    </>
                  )}

                  {tipo === "PorComision" && (
                    <>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Ventas Brutas *</label>
                        <div className="input-group">
                          <span className="input-group-text">DOP$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            {...register("ventasBrutas", { 
                              required: "Las ventas brutas son requeridas", 
                              min: { value: 0, message: "No puede ser negativo" }
                            })} 
                            className={`form-control ${errors.ventasBrutas ? 'is-invalid' : ''}`}
                            placeholder="0.00"
                          />
                          {errors.ventasBrutas && (
                            <div className="invalid-feedback">{errors.ventasBrutas.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Tarifa Comisión *</label>
                        <div className="input-group">
                          <input 
                            type="number" 
                            step="0.01"
                            {...register("tarifaComision", { 
                              required: "La tarifa de comisión es requerida", 
                              min: { value: 0.01, message: "Debe ser mayor a 0" },
                              max: { value: 100, message: "No puede ser mayor a 100%" }
                            })} 
                            className={`form-control ${errors.tarifaComision ? 'is-invalid' : ''}`}
                            placeholder="5.00"
                          />
                          <span className="input-group-text">%</span>
                          {errors.tarifaComision && (
                            <div className="invalid-feedback">{errors.tarifaComision.message}</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {tipo === "AsalariadoPorComision" && (
                    <>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Salario Base *</label>
                        <div className="input-group">
                          <span className="input-group-text">DOP$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            {...register("salarioBase", { 
                              required: "El salario base es requerido", 
                              min: { value: 0.01, message: "Debe ser mayor a 0" }
                            })} 
                            className={`form-control ${errors.salarioBase ? 'is-invalid' : ''}`}
                            placeholder="0.00"
                          />
                          {errors.salarioBase && (
                            <div className="invalid-feedback">{errors.salarioBase.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Ventas Brutas *</label>
                        <div className="input-group">
                          <span className="input-group-text">DOP$</span>
                          <input 
                            type="number" 
                            step="0.01"
                            {...register("ventasBrutas", { 
                              required: "Las ventas brutas son requeridas", 
                              min: { value: 0, message: "No puede ser negativo" }
                            })} 
                            className={`form-control ${errors.ventasBrutas ? 'is-invalid' : ''}`}
                            placeholder="0.00"
                          />
                          {errors.ventasBrutas && (
                            <div className="invalid-feedback">{errors.ventasBrutas.message}</div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">Tarifa Comisión *</label>
                        <div className="input-group">
                          <input 
                            type="number" 
                            step="0.01"
                            {...register("tarifaComision", { 
                              required: "La tarifa de comisión es requerida", 
                              min: { value: 0.01, message: "Debe ser mayor a 0" },
                              max: { value: 100, message: "No puede ser mayor a 100%" }
                            })} 
                            className={`form-control ${errors.tarifaComision ? 'is-invalid' : ''}`}
                            placeholder="5.00"
                          />
                          <span className="input-group-text">%</span>
                          {errors.tarifaComision && (
                            <div className="invalid-feedback">{errors.tarifaComision.message}</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="col-12">
            <div className={`${isModal ? 'border-top pt-3' : 'card'}`}>
              {!isModal && (
                <div className="card-body">
                  <div className="d-flex justify-content-end gap-2">
                    {(isModal || onCancel) && (
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                      >
                        <i className="fas fa-times me-1"></i>
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-1"></i>
                          Guardar Empleado
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              {isModal && (
                <div className="d-flex justify-content-end gap-2">
                  {(isModal || onCancel) && (
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      <i className="fas fa-times me-1"></i>
                      Cancelar
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-1"></i>
                        Guardar Empleado
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}