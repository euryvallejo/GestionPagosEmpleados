import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../authContext';
import type { LoginData } from '../types/auth';

const Login = () => {
  const [form, setForm] = useState<LoginData>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form);
      console.log('Login successful:', result);
      loginContext(result.token, result.role);
      navigate('/dashboard');
    } catch {
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5" style={{ backgroundColor: 'rgba(13, 48, 72, .9)', color: 'white' }}>
              {/* Logo Section */}
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

              {/* Login Form */}
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
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </button>
                </div>
              </form>

              {/* Register Link */}
              <div className="text-center mt-4">
                <p className="mb-0">
                  ¿No tienes una cuenta? 
                  <a href="/register" className="text-decoration-none ms-1 fw-bold">
                    Regístrate aquí
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

export default Login;