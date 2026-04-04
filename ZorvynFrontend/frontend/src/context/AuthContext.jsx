import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

// Mock initial state, you could check localStorage here
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check locally saved user and token for auth persistence
    const savedUser = localStorage.getItem('finance_user');
    const savedToken = localStorage.getItem('finance_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
     // console.log(savedUser);
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, receivedToken) => {
    setUser(userData);
    setToken(receivedToken);
    localStorage.setItem('finance_user', JSON.stringify(userData));
    localStorage.setItem('finance_token', receivedToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('finance_user');
    localStorage.removeItem('finance_token');
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
