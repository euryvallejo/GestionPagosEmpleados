import { Outlet } from 'react-router-dom';
import { useAuth } from '../authContext';

const Layout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo-container">
          <img 
            src="./src/assets/logo-superintendencia-de-bancos.svg" 
            alt="Logo SB" 
            className="logo-image" 
          />
        </div>
        <br />
        <nav className="menu">
          <a href="/dashboard" className="menu-item active">
            <i className="fas fa-dashboard icon"></i> Dashboard
          </a>
          <a href="/reports" className="menu-item">
            <i className="fas fa-search icon"></i> Reportes
          </a>
          {/* <a href="/registro-empleado" className="menu-item">
            <i className="fas fa-plus-circle icon"></i> Registro Empleado
          </a> */}
          <a href="#" className="menu-item" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt icon"></i> Cerrar Sesión
          </a>
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