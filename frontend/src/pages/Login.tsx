import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../authContext';
import type { LoginData } from '../types/auth';

const Login = () => {
  const [form, setForm] = useState<LoginData>({ username: '', password: '' });
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login(form);
      loginContext(result.token, result.role);
      navigate('/dashboard');
    } catch {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <button type="submit">Login</button>

      <p>¿No tienes una cuenta? <a href="/register">Regístrate</a></p>
    </form>
  );
};

export default Login;
