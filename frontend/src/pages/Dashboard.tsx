import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authContext';
import { getEmpleados, deleteEmpleado, type Empleado } from '../services/empleadoService';
import EmpleadoForm from '../components/EmpleadoForm';

const Dashboard = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleadoId, setEditingEmpleadoId] = useState<number | undefined>();

  // Función para verificar si es administrador
  const isAdmin = () => {
    const roleNumber = typeof role === 'string' ? parseInt(role) : role;
    return roleNumber === 1;
  };

  // Función para obtener el texto del rol
  const getRoleText = () => {
    return isAdmin() ? 'Administrador' : 'Usuario';
  };

  // Función para obtener empleados del servicio
  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmpleados();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al cargar empleados:', error);
      setError('Error al cargar la lista de empleados');
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
        await deleteEmpleado(id);
        await fetchEmpleados();
        alert('Empleado eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        alert('Error al eliminar el empleado');
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
    console.log('Editando empleado con ID:', id); // Debug
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

  // Función para ver detalles del empleado (esta sí navega a otra página)
  const handleVerDetalles = (id: number) => {
    navigate(`/empleado/${id}`);
  };

  useEffect(() => {
    fetchEmpleados();
  }, []);

  // Filtrar empleados según el término de búsqueda
  const empleadosFiltrados = empleados.filter(empleado =>
    empleado.primerNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empleado.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">Dashboard</h1>
              <p className="text-muted mb-0">Gestión de Empleados</p>
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
                  <i className="fas fa-user-clock fa-2x"></i>
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
                  <p className="mb-0">Asalariado Comisión</p>
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
                  <h4 className="mb-0">
                    {formatCurrency(empleados.reduce((sum, emp) => sum + emp.salarioSemanal, 0) / empleados.length || 0)}
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
                <h5 className="mb-0">Lista de Empleados</h5>
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
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Salario</th>
                        <th>Fecha Ingreso</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {empleadosFiltrados.length > 0 ? (
                        empleadosFiltrados.map(empleado => (
                          <tr key={empleado.id}>
                            <td>{empleado.id}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                  <span className="text-white fw-bold">
                                    {empleado.primerNombre?.charAt(0)}{empleado.apellidoPaterno.charAt(0)}
                                  </span>
                                </div>
                                {empleado.primerNombre} {empleado.apellidoPaterno}
                              </div>
                            </td>
                            <td>{formatCurrency(empleado.salarioSemanal)}</td>
                            <td>{formatDate(empleado.fechaIngreso)}</td>
                            <td>
                              <span className={`badge ${
                                empleado.tipoEmpleado === 'Asalariado' ? 'bg-success' : 
                                empleado.tipoEmpleado === 'PorHoras' ? 'bg-warning' :
                                empleado.tipoEmpleado === 'PorComision' ? 'bg-info' :
                                empleado.tipoEmpleado === 'AsalariadoPorComision' ? 'bg-secondary' : 'bg-light'
                              }`}>
                                {empleado.tipoEmpleado}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group" role="group">
                                {/* <button 
                                  className="btn btn-sm btn-outline-primary"
                                  title="Ver detalles"
                                  onClick={() => handleVerDetalles(empleado.id)}
                                >
                                  <i className="fas fa-eye"></i>
                                </button> */}
                                {isAdmin() && (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-outline-secondary"
                                      title="Editar"
                                      onClick={() => handleEditarEmpleado(empleado.id)}
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-danger"
                                      title="Eliminar"
                                      onClick={() => handleDeleteEmpleado(empleado.id)}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <div className="text-muted">
                              <i className="fas fa-users fa-3x mb-3"></i>
                              <p>No se encontraron empleados</p>
                              {isAdmin() && (
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