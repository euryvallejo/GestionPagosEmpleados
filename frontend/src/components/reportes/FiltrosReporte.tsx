import React from 'react';

interface FiltrosReporteProps {
  filtroTipo: string;
  onFiltroChange: (tipo: string) => void;
}

const FiltrosReporte: React.FC<FiltrosReporteProps> = ({ filtroTipo, onFiltroChange }) => {
  return (
    <div className="filtros-reporte">
      <div className="filtro-grupo">
        <label htmlFor="tipoEmpleado">Tipo de Empleado:</label>
        <select 
          id="tipoEmpleado"
          value={filtroTipo} 
          onChange={(e) => onFiltroChange(e.target.value)}
          className="form-control"
        >
          <option value="">Todos los tipos</option>
          <option value="Asalariado">Asalariado</option>
          <option value="PorHoras">Por Horas</option>
          <option value="PorComision">Por Comisión</option>
          <option value="AsalariadoPorComision">Asalariado por Comisión</option>
        </select>
      </div>
    </div>
  );
};

export default FiltrosReporte;