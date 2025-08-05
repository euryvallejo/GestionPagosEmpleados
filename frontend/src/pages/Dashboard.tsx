import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { empleadoService } from '../services/empleadoService';
import { useAuth } from '../hooks/useAuth';
import EmpleadoForm from '../components/EmpleadoForm';
import type { Empleado } from '../services/empleadoService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth(); // 0btener datos del contexto de auth
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleadoId, setEditingEmpleadoId] = useState<number | undefined>();

  // Función para obtener el texto del rol
  const getRoleText = () => {
    console.log(`datos del rol: ${isAdmin()}`);
    return isAdmin() ? 'Administrador' : 'Usuario';
  };

  // Función para manejar logout
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  // Función para obtener empleados del servicio
  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await empleadoService.getAll();
      setEmpleados(data);
    } catch (error: any) {
      console.error('Error al cargar empleados:', error);
      setError(error.message || 'Error al cargar la lista de empleados');
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar empleado
  const handleDeleteEmpleado = async (id: number) => {
    if (!isAdmin()) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        await empleadoService.delete(id);
        await fetchEmpleados();
        alert('Empleado eliminado exitosamente');
      } catch (error: any) {
        console.error('Error al eliminar empleado:', error);
        alert(error.message || 'Error al eliminar el empleado');
      }
    }
  };

  // Función para abrir modal de agregar empleado
  const handleAgregarEmpleado = () => {
    if (!isAdmin()) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }
    setEditingEmpleadoId(undefined); // Limpiar ID para modo creación
    setShowModal(true);
  };

  // Función para abrir modal de editar empleado
  const handleEditarEmpleado = (id: number) => {
    if (!isAdmin()) {
      alert('No tienes permisos para realizar esta acción');
      return;
    }
    console.log('Editando empleado con ID:', id);
    setEditingEmpleadoId(id); // Establecer ID para modo edición
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmpleadoId(undefined); // Limpiar ID al cerrar
  };

  // Función que se ejecuta cuando se guarda exitosamente un empleado
  const handleEmpleadoGuardado = () => {
    fetchEmpleados(); // Recargar la lista
    handleCloseModal(); // Cerrar el modal
  };

  // Función para ver detalles del empleado
  const handleVerDetalles = (id: number) => {
    navigate(`/empleado/${id}`);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Filtrar empleados según el término de búsqueda
  const empleadosFiltrados = empleados.filter(empleado =>
    empleado.primerNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.apellidoPaterno?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount || 0);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  // Calcular promedio de salario de manera segura
  const calcularPromedioSalario = () => {
    if (empleados.length === 0) return 0;
    const total = empleados.reduce((sum, emp) => sum + (emp.salarioSemanal || 0), 0);
    return total / empleados.length;
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">Dashboard</h1>
              <p className="text-muted mb-0">
                Gestión de Empleados - Bienvenido {user?.username || 'Usuario'}
              </p>
            </div>
            <div className="d-flex gap-2">
              <span className={`badge ${isAdmin() ? 'bg-danger' : 'bg-primary'} fs-6`}>
                Rol: {getRoleText()}
              </span>
              {isAdmin() && (
                <button 
                  onClick={() => navigate('/user-management')}
                  className="btn btn-outline-info btn-sm"
                >
                  <i className="fas fa-users-cog me-1"></i>
                  Gestión de Usuarios
                </button>
              )}
              {/* <button 
                onClick={handleLogout} // ✅ Usar la función handleLogout
                className="btn btn-outline-danger btn-sm"
              >
                <i className="fas fa-sign-out-alt me-1"></i>
                Cerrar Sesión
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
              <button 
                type="button" 
                className="btn btn-sm btn-outline-danger ms-auto"
                onClick={fetchEmpleados}
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-2 col-md-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{empleados.length}</h4>
                  <p className="mb-0">Total Empleados</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-2 col-md-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{empleados.filter(e => e.tipoEmpleado === 'Asalariado').length}</h4>
                  <p className="mb-0">Asalariado</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-user-check fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-6 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{empleados.filter(e => e.tipoEmpleado === 'PorHoras').length}</h4>
                  <p className="mb-0">Por Horas</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-user-clock fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-6 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{empleados.filter(e => e.tipoEmpleado === 'PorComision').length}</h4>
                  <p className="mb-0">Por Comisión</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-percentage fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-6 mb-3">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{empleados.filter(e => e.tipoEmpleado === 'AsalariadoPorComision').length}</h4>
                  <p className="mb-0">Asalariado + Comisión</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-user-plus fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-2 col-md-6 mb-3">
          <div className="card bg-dark text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">
                    {formatCurrency(calcularPromedioSalario())}
                  </h4>
                  <p className="mb-0">Salario Promedio</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-dollar-sign fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empleados Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="fas fa-users me-2"></i>
                  Lista de Empleados
                </h5>
                <div className="d-flex gap-2">
                  <div className="input-group" style={{ width: '300px' }}>
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar empleados..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {isAdmin() && (
                    <button 
                      className="btn btn-primary"
                      onClick={handleAgregarEmpleado}
                    >
                      <i className="fas fa-plus me-1"></i>
                      Agregar Empleado
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando empleados...</span>
                  </div>
                  <p className="mt-2 text-muted">Cargando lista de empleados...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Salario Semanal</th>
                        <th>Fecha Ingreso</th>
                        <th>Tipo Empleado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleadosFiltrados.length > 0 ? (
                        empleadosFiltrados.map(empleado => (
                          <tr key={empleado.id}>
                            <td>
                              <span className="badge bg-light text-dark">#{empleado.id}</span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                  <span className="text-white fw-bold">
                                    {empleado.primerNombre?.charAt(0) || 'U'}
                                    {empleado.apellidoPaterno?.charAt(0) || 'N'}
                                  </span>
                                </div>
                                <div>
                                  <div className="fw-semibold">
                                    {empleado.primerNombre || 'Sin nombre'} {empleado.apellidoPaterno || 'Sin apellido'}
                                  </div>
                                  {empleado.segundoNombre && (
                                    <small className="text-muted">{empleado.segundoNombre}</small>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="fw-bold text-success">
                                {formatCurrency(empleado.salarioSemanal || 0)}
                              </span>
                            </td>
                            <td>{formatDate(empleado.fechaIngreso)}</td>
                            <td>
                              <span className={`badge ${
                                empleado.tipoEmpleado === 'Asalariado' ? 'bg-success' : 
                                empleado.tipoEmpleado === 'PorHoras' ? 'bg-warning text-dark' :
                                empleado.tipoEmpleado === 'PorComision' ? 'bg-info' :
                                empleado.tipoEmpleado === 'AsalariadoPorComision' ? 'bg-secondary' : 'bg-light text-dark'
                              }`}>
                                {empleado.tipoEmpleado || 'Sin definir'}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                {isAdmin() && (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-outline-secondary"
                                      title="Editar empleado"
                                      onClick={() => handleEditarEmpleado(empleado.id)}
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-danger"
                                      title="Eliminar empleado"
                                      onClick={() => handleDeleteEmpleado(empleado.id)}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </>
                                )}
                                {!isAdmin() && (
                                  <span className="text-muted small">
                                    <i className="fas fa-eye-slash me-1"></i>
                                    Solo lectura
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <div className="text-muted">
                              <i className="fas fa-users fa-3x mb-3 text-muted"></i>
                              <h5>No se encontraron empleados</h5>
                              <p>
                                {searchTerm 
                                  ? `No hay empleados que coincidan con "${searchTerm}"`
                                  : 'No hay empleados registrados en el sistema'
                                }
                              </p>
                              {isAdmin() && !searchTerm && (
                                <button 
                                  className="btn btn-primary"
                                  onClick={handleAgregarEmpleado}
                                >
                                  <i className="fas fa-plus me-1"></i>
                                  Agregar Primer Empleado
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Footer con información adicional */}
            {empleados.length > 0 && (
              <div className="card-footer">
                <div className="row text-center">
                  <div className="col-md-3">
                    <small className="text-muted">
                      <strong>Total:</strong> {empleados.length} empleados
                    </small>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted">
                      <strong>Filtrados:</strong> {empleadosFiltrados.length} empleados
                    </small>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted">
                      <strong>Costo Total:</strong> {formatCurrency(empleados.reduce((sum, emp) => sum + (emp.salarioSemanal || 0), 0))}
                    </small>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted">
                      <strong>Última actualización:</strong> {new Date().toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para Agregar/Editar Empleado */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`fas ${editingEmpleadoId ? 'fa-user-edit' : 'fa-user-plus'} me-2`}></i>
                  {editingEmpleadoId ? `Editar Empleado (ID: ${editingEmpleadoId})` : 'Agregar Nuevo Empleado'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                  aria-label="Cerrar modal"
                ></button>
              </div>
              
              <div className="modal-body p-0">
                <EmpleadoForm 
                  empleadoId={editingEmpleadoId}
                  onSuccess={handleEmpleadoGuardado}
                  onCancel={handleCloseModal}
                  isModal={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;