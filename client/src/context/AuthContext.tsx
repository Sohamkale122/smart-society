import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  demoAccounts: any[];
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole, email?: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('smart_society_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoAccounts, setDemoAccounts] = useState<any[]>([]);

  // Load demo accounts on start
  useEffect(() => {
    api.getDemoAccounts()
      .then(res => {
        if (res.accounts) setDemoAccounts(res.accounts);
      })
      .catch(err => console.warn('Could not load demo accounts:', err));
  }, []);

  // Initialize user session
  const initUser = async () => {
    setIsLoading(true);
    const savedToken = localStorage.getItem('smart_society_token');
    if (savedToken) {
      try {
        const res = await api.getMe();
        if (res.user) {
          setUser(res.user);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err);
        localStorage.removeItem('smart_society_token');
      }
    }

    // Default to admin demo account so user lands immediately in a rich experience
    try {
      const loginRes = await api.login('admin@smartsociety.com', 'admin123password');
      setUser(loginRes.user);
      setToken(loginRes.token);
    } catch (e) {
      console.error('Failed default login:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initUser();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, password);
      setUser(res.user);
      setToken(res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('smart_society_token');
    setUser(null);
    setToken(null);
  };

  const switchRole = async (targetRole: UserRole, targetEmail?: string) => {
    setIsLoading(true);
    let emailToUse = targetEmail;
    if (!emailToUse) {
      if (targetRole === 'admin') emailToUse = 'admin@smartsociety.com';
      else if (targetRole === 'security') emailToUse = 'guard@smartsociety.com';
      else emailToUse = 'resident@smartsociety.com';
    }

    try {
      const res = await api.login(emailToUse);
      setUser(res.user);
      setToken(res.token);
    } catch (e) {
      console.error('Failed to switch role:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      if (res.user) setUser(res.user);
    } catch (e) {
      console.warn('Refresh user error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'resident',
        token,
        isLoading,
        demoAccounts,
        login,
        logout,
        switchRole,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
