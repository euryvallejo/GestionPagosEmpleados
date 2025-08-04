import React from 'react';
import { useAuth } from '../authContext';

const Dashboard = () => {
  const { role, logout } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Tú Rol: {role}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;
