import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Receipt, Users, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    color: isActive ? 'white' : 'var(--text-secondary)',
    background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0.05) 100%)' : 'transparent',
    borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
    transition: 'all 0.2s',
    fontWeight: isActive ? 500 : 400
  });

  return (
    <div className="glass-panel" style={{ 
      width: '260px', 
      borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRadius: 0,
      display: 'flex', flexDirection: 'column',
      padding: '24px 16px', zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', padding: '0 8px' }}>
        <div style={{ 
          width: '40px', height: '40px', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', 
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }}>
          <Wallet size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem' }}>FinDash<span style={{ color: 'var(--primary)' }}>.</span></h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <NavLink to="/" style={({ isActive }) => navItemStyle(isActive)}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        
        <NavLink to="/records" style={({ isActive }) => navItemStyle(isActive)}>
          <Receipt size={20} /> Financial Records
        </NavLink>

        {hasRole(['admin']) && (
          <NavLink to="/users" style={({ isActive }) => navItemStyle(isActive)}>
            <Users size={20} /> User Management
          </NavLink>
        )}
      </nav>

      <div style={{ padding: '16px 0 0 0', borderTop: '1px solid var(--border-color)' }}>
        <button onClick={handleLogout} style={{ 
          width: '100%', display: 'flex', alignItems: 'center', gap: '12px', 
          padding: '12px 16px', color: 'var(--text-secondary)', borderRadius: '10px' 
        }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
