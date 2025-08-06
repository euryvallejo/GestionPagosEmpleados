import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { authApiService } from '../services/authApiService';
import type { LoginDto } from '../services/authApiService';

interface User {
  id: number;
  username: string;
  role: number;
}

interface AuthContextType {
  user: User | null;
  role: number | null;
  isAdmin: () => boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        if (AuthService.isAuthenticated()) {
          const userData = AuthService.getUser();
          setUser(userData);
        } else {
          AuthService.logout(); // Limpiar datos inválidos
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        AuthService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginDto) => {
    try {
      setIsLoading(true);
      console.log('🔍 Starting login...');
      const response = await authApiService.login(credentials);
      console.log('🔍 Login response:', response);

      // Guardar token
      if (response.token) {
        AuthService.setToken(response.token);
        
        // Extraer información del usuario del token JWT
        try {
          const payload = JSON.parse(atob(response.token.split('.')[1]));
          const user = {
            id: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
            username: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
            role: response.role
          };
          
          AuthService.setUser(user);
          setUser(user);
          console.log('🔍 User extracted from token:', user);
        } catch (tokenError) {
          console.error('Error parsing token:', tokenError);
          throw new Error('Invalid token received');
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApiService.logout();
    setUser(null);
  };

  const isAdmin = () => {
    if (user?.role === 1) {
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || null,
      isAdmin,
      login,
      logout,
      isLoading,
      isAuthenticated: !!user && AuthService.isAuthenticated()
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };