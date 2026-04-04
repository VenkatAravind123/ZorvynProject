import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Shield, ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/user/viewusers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('finance_token')}`
          }
        });
        console.log('Backend response array:', res.data);
        setUsers(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.updateUserStatus(id, newStatus);
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '60px 40px', textAlign: 'center', marginTop: '40px' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--danger)' }}>
          <ShieldAlert size={40} />
        </div>
        <h2 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>Admin Access Required</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          You do not have permission to access user management. This area is strictly restricted to <strong style={{ color: 'white' }}>Administrators</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage roles, access, and system users</p>
        </div>
      </div>

      {error ? (
        <div className="glass-panel" style={{ padding: '20px', color: 'var(--danger)' }}>{error}</div>
      ) : (
        <div className="glass-panel">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User Info</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Loading users...</td></tr>
                ) : (!users || users.length === 0) ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No users found in database.</td></tr>
                ) : (
                  users.map((rawU) => {
                    // Normalize Java backend structure
                    const u = {
                      ...rawU,
                      displayName: rawU.name || (rawU.email ? rawU.email.split('@')[0] : 'User'),
                      displayRole: rawU.role ? String(rawU.role).toLowerCase() : 'viewer',
                      displayStatus: rawU.status ? String(rawU.status).toLowerCase() : 'active'
                    };
                    
                    return (
                    <tr key={u.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ 
                            width: '36px', height: '36px', borderRadius: '50%', 
                            background: `linear-gradient(135deg, var(--${u.displayRole === 'admin' ? 'primary' : u.displayRole === 'analyst' ? 'warning' : 'text-secondary'}) 0%, #000 200%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 600, fontSize: '0.9rem',
                            textTransform: 'uppercase'
                          }}>
                            {u.displayName.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 500, margin: 0 }}>{u.displayName}</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${u.displayRole}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {u.displayRole === 'admin' && <Shield size={12} />}
                          {u.displayRole}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${u.displayStatus}`}>
                          {u.displayStatus}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {u.lastLogin ? (
                          <>{new Date(u.lastLogin).toLocaleDateString()} {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not recorded</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className={`btn ${u.status === 'active' ? 'btn-danger' : 'btn-primary'}`}
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => toggleStatus(u.id, u.status)}
                          disabled={u.id === 'u1'} // Prevent disabling main admin
                          title={u.id === 'u1' ? "Cannot modify main admin" : `Mark ${u.status === 'active' ? 'Inactive' : 'Active'}`}
                        >
                          {u.status === 'active' ? <><XCircle size={14}/> Disable</> : <><CheckCircle size={14}/> Enable</>}
                        </button>
                      </td>
                    </tr>
                  );
                 })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
