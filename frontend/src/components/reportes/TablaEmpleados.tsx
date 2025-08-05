import React, { useState } from 'react';
import type { ReporteEmpleados } from '../../services/reportService';

interface TablaEmpleadosProps {
  reporte: ReporteEmpleados;
}

const TablaEmpleados: React.FC<TablaEmpleadosProps> = ({ reporte }) => {
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<'nombre' | 'tipo' | 'salario'>('nombre');
  const [direccion, setDireccion] = useState<'asc' | 'desc'>('asc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const empleadosFiltrados = reporte.empleados
    .filter(empleado => 
      empleado.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      empleado.numeroSeguroSocial.includes(busqueda) ||
      empleado.tipoEmpleado.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      let resultado = 0;
      switch (orden) {
        case 'nombre':
          resultado = a.nombreCompleto.localeCompare(b.nombreCompleto);
          break;
        case 'tipo':
          resultado = a.tipoEmpleado.localeCompare(b.tipoEmpleado);
          break;
        case 'salario':
          resultado = a.pagoSemanal - b.pagoSemanal;
          break;
      }
      return direccion === 'asc' ? resultado : -resultado;
    });

  const handleOrden = (campo: 'nombre' | 'tipo' | 'salario') => {
    if (orden === campo) {
      setDireccion(direccion === 'asc' ? 'desc' : 'asc');
    } else {
      setOrden(campo);
      setDireccion('asc');
    }
  };

  const getIconoOrden = (campo: 'nombre' | 'tipo' | 'salario') => {
    if (orden !== campo) return 'fas fa-sort';
    return direccion === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  };

  return (
    <div className="tabla-empleados">
      <div className="tabla-header">
        <div className="busqueda">
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="form-control"
          />
          <i className="fas fa-search"></i>
        </div>
        <div className="tabla-stats">
          <span>Mostrando {empleadosFiltrados.length} de {reporte.totalEmpleados} empleados</span>
          <span>Total: {formatCurrency(reporte.totalNomina)}</span>
        </div>
      </div>

      <div className="tabla-container">
        <table className="empleados-table">
          <thead>
            <tr>
              <th onClick={() => handleOrden('nombre')}>
                Nombre Completo
                <i className={getIconoOrden('nombre')}></i>
              </th>
              <th>No. Seguro Social</th>
              <th onClick={() => handleOrden('tipo')}>
                Tipo de Empleado
                <i className={getIconoOrden('tipo')}></i>
              </th>
              <th onClick={() => handleOrden('salario')}>
                Pago Semanal
                <i className={getIconoOrden('salario')}></i>
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.map((empleado) => (
              <tr key={empleado.id}>
                <td>
                  <div className="empleado-info">
                    <strong>{empleado.nombreCompleto}</strong>
                  </div>
                </td>
                <td>{empleado.numeroSeguroSocial}</td>
                <td>
                  <span className={`badge tipo-${empleado.tipoEmpleado.toLowerCase()}`}>
                    {empleado.tipoEmpleado}
                  </span>
                </td>
                <td className="monto">
                  {formatCurrency(empleado.pagoSemanal)}
                </td>
                <td>
                  <div className="acciones">
                    <button className="btn-icon" title="Ver detalles">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="btn-icon" title="Editar">
                      <i className="fas fa-edit"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {empleadosFiltrados.length === 0 && (
        <div className="no-data">
          <i className="fas fa-search"></i>
          <p>No se encontraron empleados que coincidan con la búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default TablaEmpleados;