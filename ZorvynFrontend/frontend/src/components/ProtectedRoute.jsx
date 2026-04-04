import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have the required role, redirect them or show an unauthorized message
  if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-primary)' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '16px' }}>Access Denied</h2>
        <p>Your role (<strong>{user.role}</strong>) does not have permission to view this page.</p>
        <button 
          className="btn btn-secondary" 
          style={{ marginTop: '20px' }}
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
        >
          Return to Login
        </button>
      </div>
    );
  }

  return <Outlet />;
};
