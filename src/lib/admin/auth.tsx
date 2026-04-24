'use client';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { type User, Rol } from './types';
import * as api from './api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('qr_token');
    if (token) {
      api
        .getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('qr_token');
          localStorage.removeItem('qr_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedUser, token } = await api.login(email, password);
    localStorage.setItem('qr_token', token);
    localStorage.setItem('qr_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    localStorage.removeItem('qr_token');
    localStorage.removeItem('qr_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.rol === Rol.ADMIN,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AdminAuthProvider');
  return context;
}
