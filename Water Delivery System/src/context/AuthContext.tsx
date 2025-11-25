import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthUser, UserRole } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for testing
const mockUsers: AuthUser[] = [
  { id: 'c1', name: 'John Doe', email: 'customer@test.com', role: 'customer' },
  { id: 'a1', name: 'Admin User', email: 'admin@test.com', role: 'admin' },
  { id: 'r1', name: 'Rider One', email: 'rider@test.com', role: 'rider' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Simple mock authentication
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};