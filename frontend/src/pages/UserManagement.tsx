import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getUsers, toggleUserStatus, deleteUser, createUser, updateUser, type User, type CreateUserDto, type UpdateUserDto } from '../services/userService';

const UserManagement = () => {
  const { isAdmin, logout, user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 2, // Usuario por defecto
    isActive: true,
  });

  // Verificar si es administrador
  // const isAdmin = () => {
  //   const roleNumber = role;
  //   return roleNumber === 1;
  // };

  // Redirect si no es admin
  useEffect(() => {
    if (!isAdmin()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  // Obtener usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar la lista de usuarios');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado del usuario
  const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
    if (userId === user?.id) {
      setError('No puedes cambiar el estado de tu propio usuario');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await toggleUserStatus(userId, !currentStatus);
      await fetchUsers();
    } catch (error: any) {
      console.error('Error al cambiar estado del usuario:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al cambiar el estado del usuario';
      setError(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
};

  // Eliminar usuario
  const handleDeleteUser = async (userId: number, username: string) => {
    console.log('Eliminando usuario:', userId, username);
    // Validaciones adicionales
    if (userId === user?.id) {
      setError('No puedes eliminar tu propio usuario');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${username}"?\n\nEsta acción no se puede deshacer.`)) {
      try {
        setLoading(true);
        setError(null);
        await deleteUser(userId);
        await fetchUsers();
        // Mostrar mensaje de éxito (puedes usar un toast en lugar de alert)
        setError(null);
      } catch (error: any) {
        console.error('Error al eliminar usuario:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar el usuario';
        setError(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
};

  // Abrir modal para crear usuario
  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      role: 2,
      isActive: true,
    });
    setShowModal(true);
  };

  // Abrir modal para editar usuario
  const handleEditUser = (user: User) => {

    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      isActive: user.isActive,
    });
    setShowModal(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      role: 2,
      isActive: true,
    });
  };

  // Guardar usuario (crear o editar)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Editar usuario existente
        const updateData: UpdateUserDto = {
          username: formData.username,
          role: formData.role,
          passwordHash: formData.password,
          isActive: formData.isActive,
        };
        await updateUser(editingUser.id, updateData);
        alert('Usuario actualizado exitosamente');
      } else {
        // Crear nuevo usuario
        const createData: CreateUserDto = {
          username: formData.username,
          passwordHash: formData.password,
          role: formData.role,
        };
        await createUser(createData);
        alert('Usuario creado exitosamente');
      }
      
      await fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(`Error al ${editingUser ? 'actualizar' : 'crear'} el usuario`);
    }
  };

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, []);

  // Filtrar usuarios
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()))

  const getRoleText = (roleNumber: number) => {
    return roleNumber === 1 ? 'Administrador' : 'Usuario';
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAdmin()) {
    return null; // Component will redirect
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-1">Gestión de Usuarios</h1>
              <p className="text-muted mb-0">Administrar usuarios del sistema</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline-secondary btn-sm"
              >
                <i className="fas fa-arrow-left me-1"></i>
                Volver al Dashboard
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
                onClick={fetchUsers}
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{users.length}</h4>
                  <p className="mb-0">Total Usuarios</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{users.filter(u => u.isActive).length}</h4>
                  <p className="mb-0">Usuarios Activos</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-user-check fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{users.filter(u => !u.isActive).length}</h4>
                  <p className="mb-0">Usuarios Inactivos</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-user-times fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4 className="mb-0">{users.filter(u => u.role === 1).length}</h4>
                  <p className="mb-0">Administradores</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-user-shield fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Lista de Usuarios</h5>
                <div className="d-flex gap-2">
                  <div className="input-group" style={{ width: '300px' }}>
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={handleCreateUser}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Nuevo Usuario
                  </button>
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
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Creado</th>
                        <th>Último Acceso</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <tr key={user.id} className={!user.isActive ? 'table-secondary' : ''}>
                            <td>{user.id}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className={`avatar-sm ${user.isActive ? 'bg-primary' : 'bg-secondary'} rounded-circle d-flex align-items-center justify-content-center me-2`}>
                                  <span className="text-white fw-bold">
                                    {user.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                {user.username}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${user.role === 1 ? 'bg-danger' : 'bg-primary'}`}>
                                {getRoleText(user.role)}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                {user.isActive ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td>{formatDate(user.createdAt)}</td>
                            <td>{user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}</td>
                            <td>
                              <div className="btn-group" role="group">
                                <button 
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Editar"
                                  onClick={() => handleEditUser(user)}
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button 
                                  className={`btn btn-sm ${user.isActive ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                  title={user.isActive ? 'Desactivar' : 'Activar'}
                                  onClick={() => handleToggleStatus(user.id, user.isActive)}
                                >
                                  <i className={`fas ${user.isActive ? 'fa-ban' : 'fa-check'}`}></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  title="Eliminar"
                                  onClick={() => handleDeleteUser(user.id, user.username)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-4">
                            <div className="text-muted">
                              <i className="fas fa-users fa-3x mb-3"></i>
                              <p>No se encontraron usuarios</p>
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

      {/* Modal para Crear/Editar Usuario */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`fas ${editingUser ? 'fa-user-edit' : 'fa-user-plus'} me-2`}></i>
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              
              <form onSubmit={handleSaveUser}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre de Usuario *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                    />
                  </div>
                  
                  {/* {!editingUser && ( */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Contraseña *</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                    </div>
                  {/* )} */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Estatus</label>
                    <select
                      className="form-select"
                      value={formData.isActive ? 0 : 1}
                      onChange={(e) => setFormData({...formData, isActive: e.target.value === '0'})}
                      required
                    >
                      <option value={0}>Activo</option>
                      <option value={1}>Inactivo</option>
                    </select>
                    </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Rol *</label>
                    <select
                      className="form-select"
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: parseInt(e.target.value)})}
                      required
                    >
                      <option value={2}>Usuario</option>
                      <option value={1}>Administrador</option>
                    </select>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    <i className="fas fa-save me-1"></i>
                    {editingUser ? 'Actualizar' : 'Crear'} Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;