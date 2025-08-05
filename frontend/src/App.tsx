import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';
import { AuthProvider, useAuth } from './authContext';
import RegistroEmpleado from './pages/RegistroEmpleado';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';


// Componente para manejar la redirección inicial
function InitialRedirect() {
  const { isAuthenticated } = useAuth();
  
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InitialRedirect />} />
      
      {/* Rutas de autenticación sin sidebar */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Rutas protegidas con sidebar */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/registro-empleado" element={<RegistroEmpleado />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;