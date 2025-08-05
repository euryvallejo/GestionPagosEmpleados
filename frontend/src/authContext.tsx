import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  role: number | null; // Cambiar de string a number
  isAuthenticated: boolean;
  login: (token: string, role: number) => void; // Cambiar de string a number
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<number | null>(() => {
    const savedRole = localStorage.getItem('role');
    return savedRole ? parseInt(savedRole) : null;
  });

  const login = (newToken: string, newRole: number) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole.toString());
    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  // Calcular si está autenticado basado en la existencia del token
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};