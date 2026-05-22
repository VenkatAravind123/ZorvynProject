/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { clearAuthToken, getAuthToken, setAuthToken } from '../services/authToken';

const AuthContext = createContext();

// Mock initial state, you could check localStorage here
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('finance_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => getAuthToken());
  const [loading] = useState(false);

  const login = (userData, receivedToken) => {
    setUser(userData);
    setToken(receivedToken);
    localStorage.setItem('finance_user', JSON.stringify(userData));
    // Token is stored in a cookie now (not localStorage)
    setAuthToken(receivedToken);
    // Clean up any legacy token from older builds
    localStorage.removeItem('finance_token');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('finance_user');
    localStorage.removeItem('finance_token');
    clearAuthToken();
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
