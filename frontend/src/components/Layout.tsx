import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirige al login después del logout
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo-container">
          <img 
            src="/src/assets/logo-superintendencia-de-bancos.svg" 
            alt="Logo SB" 
            className="logo-image" 
          />
        </div>
        <br />
        <nav className="menu">
          <Link to="/dashboard" className="menu-item">
            <i className="fas fa-dashboard icon"></i> Dashboard
          </Link>
          <Link to="/reports" className="menu-item">
            <i className="fas fa-search icon"></i> Reportes
          </Link>

          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt icon"></i> Cerrar Sesión
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <br />
        </header>
        <section className="content-box">
          <div style={{ padding: '20px' }}>
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;