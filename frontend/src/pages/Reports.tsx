import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportesService } from '../services/reportService';
import type { ReporteEmpleados, ResumenEmpleados, Estadisticas } from '../services/reportService';
import TablaEmpleados from '../components/reportes/TablaEmpleados';
import ResumenCard from '../components/reportes/ResumenCard';
import EstadisticasChart from '../components/reportes/EstadisticasChart';
import FiltrosReporte from '../components/reportes/FiltrosReporte';
import { useAuth } from '../hooks/useAuth';

type VistaReporte = 'resumen' | 'tabla' | 'estadisticas';

const Reports: React.FC = () => {
  // Estados principales
  const [reporteEmpleados, setReporteEmpleados] = useState<ReporteEmpleados | null>(null);
  const [resumenEmpleados, setResumenEmpleados] = useState<ResumenEmpleados | null>(null);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [vistaActiva, setVistaActiva] = useState<VistaReporte>('resumen');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Hooks de navegación y autenticación
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Cargar datos desde la API
  const cargarDatos = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const [reporte, resumen, stats] = await Promise.all([
        reportesService.getReporteEmpleados(filtroTipo || undefined),
        reportesService.getResumenEmpleados(),
        reportesService.getEstadisticas()
      ]);
      
      setReporteEmpleados(reporte);
      setResumenEmpleados(resumen);
      setEstadisticas(stats);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error al cargar reportes:', error);
      setError('Error al cargar los reportes. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de filtros
  const handleFiltroChange = (tipo: string) => {
    setFiltroTipo(tipo);
  };

  // Exportar reportes (placeholder para funcionalidad futura)
  const exportarReporte = () => {
    // TODO: Implementar exportación a Excel/PDF
    alert('Funcionalidad de exportación en desarrollo');
  };

  // Actualizar datos manualmente
  const handleActualizar = () => {
    cargarDatos(false); // Sin loading completo para mejor UX
  };

  // Cargar datos al montar el componente o cambiar filtros
  useEffect(() => {
    cargarDatos();
  }, [filtroTipo]);

  // Vista de loading mejorada
  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 text-center">
            <div className="card">
              <div className="card-body py-5">
                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h5 className="card-title">Cargando Reportes</h5>
                <p className="card-text text-muted">Obteniendo datos de empleados...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header con navegación */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">
                <i className="fas fa-chart-bar me-2 text-primary"></i>
                Reportes de Empleados
              </h1>
              <p className="text-muted mb-0">
                Análisis y estadísticas del personal
                <small className="ms-2">
                  <i className="fas fa-clock me-1"></i>
                  Actualizado: {lastUpdate.toLocaleTimeString('es-ES')}
                </small>
              </p>
            </div>
            <div className="d-flex gap-2">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline-secondary btn-sm"
              >
                <i className="fas fa-arrow-left me-1"></i>
                Dashboard
              </button>
              <button 
                onClick={exportarReporte} 
                className="btn btn-outline-success btn-sm"
                title="Exportar reportes"
              >
                <i className="fas fa-download me-1"></i>
                Exportar
              </button>
              <button 
                onClick={handleActualizar} 
                className="btn btn-outline-primary btn-sm"
                title="Actualizar datos"
              >
                <i className="fas fa-sync-alt me-1"></i>
                Actualizar
              </button>
              <button 
                onClick={logout}
                className="btn btn-outline-danger btn-sm"
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert de error */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
              <button 
                type="button" 
                className="btn btn-sm btn-outline-danger ms-auto"
                onClick={() => cargarDatos()}
              >
                <i className="fas fa-redo me-1"></i>
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <FiltrosReporte 
                filtroTipo={filtroTipo} 
                onFiltroChange={handleFiltroChange} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs nav-fill" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${vistaActiva === 'resumen' ? 'active' : ''}`}
                onClick={() => setVistaActiva('resumen')}
                type="button"
                role="tab"
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                Resumen Ejecutivo
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${vistaActiva === 'tabla' ? 'active' : ''}`}
                onClick={() => setVistaActiva('tabla')}
                type="button"
                role="tab"
              >
                <i className="fas fa-table me-2"></i>
                Lista Detallada
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${vistaActiva === 'estadisticas' ? 'active' : ''}`}
                onClick={() => setVistaActiva('estadisticas')}
                type="button"
                role="tab"
              >
                <i className="fas fa-chart-pie me-2"></i>
                Gráficos y Estadísticas
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Contenido de las tabs */}
      <div className="row">
        <div className="col-12">
          <div className="tab-content">
            {/* Tab Resumen */}
            <div className={`tab-pane fade ${vistaActiva === 'resumen' ? 'show active' : ''}`}>
              {resumenEmpleados ? (
                <ResumenCard resumen={resumenEmpleados} />
              ) : (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-exclamation-circle fa-3x text-warning mb-3"></i>
                    <h5>No hay datos de resumen disponibles</h5>
                    <p className="text-muted">Intente actualizar los datos o verifique los filtros aplicados.</p>
                    <button onClick={() => cargarDatos()} className="btn btn-primary">
                      <i className="fas fa-redo me-1"></i>
                      Recargar Datos
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tab Tabla */}
            <div className={`tab-pane fade ${vistaActiva === 'tabla' ? 'show active' : ''}`}>
              {reporteEmpleados ? (
                <TablaEmpleados reporte={reporteEmpleados} />
              ) : (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-table fa-3x text-info mb-3"></i>
                    <h5>No hay empleados para mostrar</h5>
                    <p className="text-muted">No se encontraron empleados con los filtros actuales.</p>
                    <button onClick={() => setFiltroTipo('')} className="btn btn-outline-primary">
                      <i className="fas fa-filter me-1"></i>
                      Limpiar Filtros
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tab Estadísticas */}
            <div className={`tab-pane fade ${vistaActiva === 'estadisticas' ? 'show active' : ''}`}>
              {estadisticas ? (
                <EstadisticasChart estadisticas={estadisticas} />
              ) : (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-chart-line fa-3x text-success mb-3"></i>
                    <h5>No hay estadísticas disponibles</h5>
                    <p className="text-muted">Las estadísticas se generarán cuando haya datos suficientes.</p>
                    <button onClick={() => cargarDatos()} className="btn btn-success">
                      <i className="fas fa-chart-bar me-1"></i>
                      Generar Estadísticas
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer informativo */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4">
                  <i className="fas fa-info-circle text-primary me-2"></i>
                  <strong>Resumen:</strong> Vista general de métricas clave
                </div>
                <div className="col-md-4">
                  <i className="fas fa-table text-info me-2"></i>
                  <strong>Lista:</strong> Detalles completos de empleados
                </div>
                <div className="col-md-4">
                  <i className="fas fa-chart-pie text-success me-2"></i>
                  <strong>Gráficos:</strong> Visualización de tendencias
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;