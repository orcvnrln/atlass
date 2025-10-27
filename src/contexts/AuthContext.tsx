import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { name: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // TODO: Validate token with backend
          // For now, mock user data
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await authService.login({ email, password });

      // Mock login - replace with real API
      if (email && password) {
        const mockUser = {
          id: '1',
          email,
          name: email.split('@')[0],
          avatar: null,
          role: 'user'
        };

        const mockToken = 'mock-jwt-token-' + Date.now();

        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));
        setUser(mockUser);

        toast.success('Login successful!');
        navigate('/dashboard');
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await authService.register(userData);

      // Mock registration - replace with real API
      const mockUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        avatar: null,
        role: 'user'
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('userData', JSON.stringify(mockUser));
      setUser(mockUser);

      toast.success('Registration successful!');
      navigate('/dashboard');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      // TODO: Replace with actual API call
      if (!user) throw new Error('No user logged in');
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
