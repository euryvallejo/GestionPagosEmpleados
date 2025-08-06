import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LoginData {
  username: string;
  password: string;
}

const Login = () => {
  const [form, setForm] = useState<LoginData>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Solo redirigir cuando termine de cargar
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      console.log('User already authenticated, redirecting...');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await login(form);
      console.log('Login successful, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error);
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5" style={{ backgroundColor: 'rgba(13, 48, 72, .9)', color: 'white' }}>
              <div className="text-center mb-4">
                <img 
                  src="./src/assets/logo-superintendencia-de-bancos.svg" 
                  alt="Logo SB" 
                  className="img-fluid mb-3"
                  style={{ maxHeight: '80px' }}
                />
                <h3 className="card-title mb-1" style={{ color: 'white' }}>Iniciar Sesión</h3>
                <p>Ingresa tus credenciales para continuar</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

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
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-4">
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
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;