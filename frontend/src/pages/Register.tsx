import React, { useState } from 'react';
import { useNavigate, type NavigateFunction } from 'react-router-dom';
import { AuthService } from '../services/authService'; 
import type { RegisterData } from '../types/auth';

const Register = () => {
  const [form, setForm] = useState<RegisterData>({ username: '', password: '', role: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

    // Verificar si ya está autenticado
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AuthService.register({username: form.username, password: form.password, role: form.role});
      alert('Usuario registrado exitosamente');
      navigate('/login');
    } catch (error: any) {
      console.error('Error en el registro:', error);
      setError(error.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5" style={{ backgroundColor: '#8bb2d5', color: 'white' }}>
              {/* Logo Section */}
              <div className="text-center mb-4">
                <img 
                  src="/src/assets/logo-superintendencia-de-bancos.svg" 
                  alt="Logo SB" 
                  className="img-fluid mb-3"
                  style={{ 
                    maxHeight: '80px', 
                    maxWidth: '100%', 
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h3 className="card-title text-dark mb-1">Crear Cuenta</h3>
                <p className="text-muted">Completa los datos para registrarte</p>
              </div>

              {/* Mostrar errores si existen */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Register Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuario</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input 
                      type="text"
                      id="username"
                      className="form-control"
                      placeholder="Ingresa tu usuario"
                      value={form.username}
                      onChange={e => setForm({ ...form, username: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input 
                      type="password"
                      id="password"
                      className="form-control"
                      placeholder="Ingresa tu contraseña"
                      value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label">Tipo de Usuario</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user-tag"></i>
                    </span>
                    <select 
                      id="role"
                      className="form-select"
                      value={form.role}
                      onChange={e => setForm({ ...form, role: parseInt(e.target.value) as 0 | 1 })}
                      required
                    >
                      <option value="0">Usuario</option>
                      <option value="1">Administrador</option>
                    </select>
                  </div>
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : (
                      'Crear Cuenta'
                    )}
                  </button>
                </div>
              </form>

              {/* Login Link */}
              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  ¿Ya tienes una cuenta? 
                  <a href="/login" className="text-decoration-none ms-1 fw-bold text-success">
                    Inicia sesión aquí
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

function useEffect(arg0: () => void, arg1: NavigateFunction[]) {
  throw new Error('Function not implemented.');
}
