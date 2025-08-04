import React, { useState } from 'react';
import { register } from '../services/authService';
import type { RegisterData } from '../types/auth';

const Register = () => {
  const [form, setForm] = useState<RegisterData>({ username: '', password: '', role: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      alert('User registered successfully');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <select onChange={e => setForm({ ...form, role: parseInt(e.target.value) as 0 | 1 })}>
        <option value="0">User</option>
        <option value="1">Admin</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
