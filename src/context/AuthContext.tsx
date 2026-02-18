import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { User, LoginRequest, LoginIdentificationRequest } from '../types';
import { apiClient } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  loginWithIdentification: (credentials: LoginIdentificationRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un token guardado al iniciar
    const token = localStorage.getItem('auth_token');
    if (token) {
      loadCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      // Solo cerrar sesión si es error 401 (no autorizado)
      // Mantener token en otros errores (red, timeout, etc.)
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem('auth_token');
        setUser(null);
        queryClient.clear();
        navigate('/login', { replace: true });
      } else {
        // Error temporal de red - mantener sesión
        console.warn('Error temporal al cargar usuario, manteniendo sesión:', error);
        // Intentar recuperar usuario del localStorage si existe
        const savedUser = localStorage.getItem('user_data');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem('auth_token');
            setUser(null);
            queryClient.clear();
            navigate('/login', { replace: true });
          }
        } else {
          localStorage.removeItem('auth_token');
          setUser(null);
          queryClient.clear();
          navigate('/login', { replace: true });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await apiClient.login(credentials);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
      // Invalidar cache para refrescar datos del nuevo usuario
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      throw error;
    }
  };

  const loginWithIdentification = async (credentials: LoginIdentificationRequest) => {
    try {
      const response = await apiClient.loginWithIdentification(credentials);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      setUser(response.user);
      // Invalidar cache para refrescar datos del nuevo usuario
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    // Limpiar cache al cerrar sesión
    queryClient.clear();
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithIdentification,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
