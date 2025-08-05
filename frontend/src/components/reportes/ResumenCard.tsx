import React from 'react';
import type { ResumenEmpleados } from '../../services/reportService';

interface ResumenCardProps {
  resumen: ResumenEmpleados;
}

const ResumenCard: React.FC<ResumenCardProps> = ({ resumen }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  return (
    <div className="resumen-cards">
      <div className="row">
        <div className="col-lg-8 col-md-12 mb-4">
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <h3>{resumen.totalEmpleados}</h3>
                <p>Total Empleados</p>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <div className="stat-content">
                <h3>{formatCurrency(resumen.totalNomina)}</h3>
                <p>Total Nómina</p>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-content">
                <h3>{formatCurrency(resumen.promedioSalario)}</h3>
                <p>Promedio Salarial</p>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-icon">
                <i className="fas fa-arrow-up"></i>
              </div>
              <div className="stat-content">
                <h3>{formatCurrency(resumen.salarioMasAlto)}</h3>
                <p>Salario Más Alto</p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Distribución por tipo */}
        <div className="col-lg-4 col-md-12">
          <div className="tipos-empleados">
            <h4>Distribución por Tipo de Empleado</h4>
            <div className="tipos-grid">
              {resumen.porTipo.map((tipo, index) => (
                <div key={index} className="tipo-card">
                  <div className="tipo-header">
                    <h5>{tipo.tipoEmpleado}</h5>
                    <span className="badge">{tipo.cantidad}</span>
                  </div>
                  <div className="tipo-stats">
                    <div className="stat">
                      <span className="label">Porcentaje:</span>
                      <span className="value">{tipo.porcentaje.toFixed(1)}%</span>
                    </div>
                    <div className="stat">
                      <span className="label">Total Pagos:</span>
                      <span className="value">{formatCurrency(tipo.totalPagos)}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Promedio:</span>
                      <span className="value">{formatCurrency(tipo.promedioPago)}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${tipo.porcentaje}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenCard;