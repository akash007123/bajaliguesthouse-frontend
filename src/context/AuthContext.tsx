import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'user' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  address?: string;
  profilePicture?: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string, mobile?: string, address?: string, profilePicture?: File, role?: UserRole) => Promise<boolean>;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = API_URL.replace('/api', '');

const adjustProfilePicture = (user: User) => {
  if (user.profilePicture && !user.profilePicture.startsWith('http')) {
    user.profilePicture = `${BASE_URL}/${user.profilePicture}`;
  }
  return user;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(adjustProfilePicture(parsedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        const adjustedUser = adjustProfilePicture(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(adjustedUser));
        setUser(adjustedUser);
        setIsLoading(false);
        return adjustedUser;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    setIsLoading(false);
    return null;
  };

  const signup = async (name: string, email: string, password: string, mobile?: string, address?: string, profilePicture?: File, role: UserRole = 'user'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      if (mobile) formData.append('mobile', mobile);
      if (address) formData.append('address', address);
      if (profilePicture) formData.append('profilePicture', profilePicture);
      formData.append('role', role);

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        const adjustedUser = adjustProfilePicture(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(adjustedUser));
        setUser(adjustedUser);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
    setIsLoading(false);
    return false;
  };

  const updateUser = (updatedUser: User) => {
    const adjustedUser = adjustProfilePicture(updatedUser);
    setUser(adjustedUser);
    localStorage.setItem('user', JSON.stringify(adjustedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      updateUser,
      logout
    }}>
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
