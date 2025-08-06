import React from 'react';
import type { ReporteEmpleados } from '../../services/reportService';

interface TablaEmpleadosProps {
  reporte: ReporteEmpleados;
}

const TablaEmpleados: React.FC<TablaEmpleadosProps> = ({ reporte }) => {
  const { empleados, totalEmpleados, totalNomina, promedioSalario } = reporte;

  if (!empleados || empleados.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <i className="fas fa-users fa-3x text-muted mb-3"></i>
          <h5>No hay empleados para mostrar</h5>
          <p className="text-muted">No se encontraron empleados con los criterios seleccionados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-primary text-white">
        <div className="row align-items-center">
          <div className="col">
            <h5 className="mb-0">
              <i className="fas fa-table me-2"></i>
              Lista Detallada de Empleados
            </h5>
          </div>
          <div className="col-auto">
            <span className="badge bg-light text-dark">
              {totalEmpleados} empleado{totalEmpleados !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Métricas rápidas */}
      <div className="card-body border-bottom">
        <div className="row text-center">
          <div className="col-md-4">
            <div className="border-end">
              <h6 className="text-muted mb-1">Total Empleados</h6>
              <h4 className="mb-0 text-primary">{totalEmpleados}</h4>
            </div>
          </div>
          <div className="col-md-4">
            <div className="border-end">
              <h6 className="text-muted mb-1">Nómina Total</h6>
              <h4 className="mb-0 text-success">
                DOP$ {totalNomina?.toLocaleString('es-DO', { minimumFractionDigits: 2 }) || '0.00'}
              </h4>
            </div>
          </div>
          <div className="col-md-4">
            <h6 className="text-muted mb-1">Promedio Salarial</h6>
            <h4 className="mb-0 text-info">
              DOP$ {promedioSalario?.toLocaleString('es-DO', { minimumFractionDigits: 2 }) || '0.00'}
            </h4>
          </div>
        </div>
      </div>

      {/* Tabla de empleados */}
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col">
                <i className="fas fa-hashtag me-1"></i>
                ID
              </th>
              <th scope="col">
                <i className="fas fa-user me-1"></i>
                Nombre Completo
              </th>
              <th scope="col">
                <i className="fas fa-id-card me-1"></i>
                Seguro Social
              </th>
              <th scope="col">
                <i className="fas fa-briefcase me-1"></i>
                Tipo Empleado
              </th>
              <th scope="col">
                <i className="fas fa-dollar-sign me-1"></i>
                Pago Semanal
              </th>
              <th scope="col">
                <i className="fas fa-calendar me-1"></i>
                Fecha Ingreso
              </th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado, index) => (
              <tr key={empleado.id} className={index % 2 === 0 ? 'table-light' : ''}>
                <td>
                  <strong className="text-primary">#{empleado.id}</strong>
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                      <i className="fas fa-user text-white fa-sm"></i>
                    </div>
                    <strong>{empleado.nombreCompleto}</strong>
                  </div>
                </td>
                <td>
                  <span className="font-monospace">{empleado.numeroSeguroSocial}</span>
                </td>
                <td>
                  <span className={`badge ${getTipoBadgeClass(empleado.tipoEmpleado)}`}>
                    {formatTipoEmpleado(empleado.tipoEmpleado)}
                  </span>
                </td>
                <td>
                  <strong className="text-success">
                    DOP$ {empleado.pagoSemanal.toLocaleString('es-DO', { minimumFractionDigits: 2 })}
                  </strong>
                </td>
                <td>
                  <small className="text-muted">
                    {new Date(empleado.fechaCreacion).toLocaleDateString('es-DO', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer con información adicional */}
      <div className="card-footer bg-light">
        <div className="row align-items-center">
          <div className="col">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              Mostrando {empleados.length} de {totalEmpleados} empleados
            </small>
          </div>
          <div className="col-auto">
            <small className="text-muted">
              <i className="fas fa-clock me-1"></i>
              Generado: {new Date(reporte.fechaGeneracion).toLocaleString('es-DO')}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

// Función para obtener clase CSS del badge según tipo
const getTipoBadgeClass = (tipo: string): string => {
  switch (tipo) {
    case 'Asalariado': return 'bg-primary';
    case 'PorHoras': return 'bg-info';
    case 'PorComision': return 'bg-warning text-dark';
    case 'AsalariadoPorComision': return 'bg-success';
    default: return 'bg-secondary';
  }
};

// Función para formatear el tipo de empleado
const formatTipoEmpleado = (tipo: string): string => {
  switch (tipo) {
    case 'PorHoras': return 'Por Horas';
    case 'PorComision': return 'Por Comisión';
    case 'AsalariadoPorComision': return 'Asalariado + Comisión';
    default: return tipo;
  }
};

export default TablaEmpleados;