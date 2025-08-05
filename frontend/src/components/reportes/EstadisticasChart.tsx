import React from 'react';
import type { Estadisticas } from '../../services/reportService';

interface EstadisticasChartProps {
  estadisticas: Estadisticas;
}

const EstadisticasChart: React.FC<EstadisticasChartProps> = ({ estadisticas }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const colores = ['#3498db', '#e74c3c', '#f39c12', '#27ae60', '#9b59b6'];

  return (
    <div className="estadisticas-charts">
      <div className="charts-grid">
        {/* Gráfico de pastel simple con CSS */}
        <div className="chart-container">
          <h4>Distribución de Empleados por Tipo</h4>
          <div className="pie-chart">
            {estadisticas.estadisticasPorTipo.map((tipo, index) => {
              const color = colores[index % colores.length];
              return (
                <div key={tipo.tipoEmpleado} className="pie-segment" style={{
                  '--porcentaje': tipo.porcentaje,
                  '--color': color
                } as any}>
                  <div className="pie-label">
                    <span className="tipo">{tipo.tipoEmpleado}</span>
                    <span className="porcentaje">{tipo.porcentaje.toFixed(1)}%</span>
                    <span className="cantidad">({tipo.cantidad})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico de barras simple con CSS */}
        <div className="chart-container">
          <h4>Promedio de Pagos por Tipo</h4>
          <div className="bar-chart">
            {estadisticas.estadisticasPorTipo.map((tipo, index) => {
              const maxPago = Math.max(...estadisticas.estadisticasPorTipo.map(t => t.promedioPago));
              const altura = (tipo.promedioPago / maxPago) * 100;
              const color = colores[index % colores.length];
              
              return (
                <div key={tipo.tipoEmpleado} className="bar-item">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${altura}%`, 
                      backgroundColor: color 
                    }}
                  >
                    <div className="bar-value">
                      {formatCurrency(tipo.promedioPago)}
                    </div>
                  </div>
                  <div className="bar-label">{tipo.tipoEmpleado}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabla de detalles */}
      <div className="estadisticas-tabla">
        <h4>Detalles por Tipo de Empleado</h4>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Tipo de Empleado</th>
              <th>Cantidad</th>
              <th>Porcentaje</th>
              <th>Total Pagos</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {estadisticas.estadisticasPorTipo.map((tipo, index) => (
              <tr key={tipo.tipoEmpleado}>
                <td>
                  <div className="tipo-indicator">
                    <span 
                      className="color-dot" 
                      style={{ backgroundColor: colores[index % colores.length] }}
                    ></span>
                    {tipo.tipoEmpleado}
                  </div>
                </td>
                <td>{tipo.cantidad}</td>
                <td>{tipo.porcentaje.toFixed(1)}%</td>
                <td>{formatCurrency(tipo.totalPagos)}</td>
                <td>{formatCurrency(tipo.promedioPago)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstadisticasChart;