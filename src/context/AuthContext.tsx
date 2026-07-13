import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  registerUser: (name: string, email: string, password: string, role: 'patient' | 'doctor' | 'admin') => Promise<any>;
  logout: () => void;
  updateUser: (userData: User) => void;
  googleLogin: (credential: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await API.get('/auth/me');
        // response.data will return { _id, name, email, role }
        setUser({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role
        });
      } catch (error) {
        console.error('Session validation failed:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Login failed. Please try again.';
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (name: string, email: string, password: string, role: 'patient' | 'doctor' | 'admin') => {
    setIsLoading(true);
    try {
      const response = await API.post('/auth/register', { name, email, password, role });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Registration failed. Please try again.';
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const googleLogin = async (credential: string) => {
    setIsLoading(true);
    try {
      const response = await API.post('/auth/google', { credential });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || 'Google Sign-In failed. Please try again.';
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, registerUser, logout, updateUser, googleLogin }}>
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
