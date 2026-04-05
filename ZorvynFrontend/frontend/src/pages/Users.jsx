import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Shield, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2500);
  };

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
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

 const updateUserRole = async (id, newRole) => {
  try {
    const token = localStorage.getItem('finance_token');

    await axios.put(
      `/user/users/${id}/role?role=${newRole}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );

    showToast('success', `Role changed to ${newRole}`);
  } catch (err) {
    console.error(err);
    showToast('error', 'Failed to update role');
  }
};

const updateUserStatus = async (id, newStatus) => {
  try {
    const token = localStorage.getItem('finance_token');

    await axios.put(
      `/user/users/${id}/status?status=${newStatus}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );

    showToast('success', `Status changed to ${newStatus}`);
  } catch (err) {
    console.error(err);
    showToast('error', 'Failed to update status');
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
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            padding: '14px 16px',
            borderRadius: 12,
            border: '1px solid var(--border-color)',
            background: 'rgba(17, 24, 39, 0.9)',
            color: toast.type === 'success' ? 'var(--success)' : 'var(--danger)',
            backdropFilter: 'blur(10px)',
            maxWidth: 360,
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {toast.type === 'success' ? '✓ Updated' : '✗ Error'}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {toast.message}
          </div>
        </div>
      )}

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
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Loading users...</td></tr>
                ) : (!users || users.length === 0) ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No users found in database.</td></tr>
                ) : (
                  users.map((rawU) => {
                   
                    const u = {
                      ...rawU,
                      displayName: rawU.name || (rawU.email ? rawU.email.split('@')[0] : 'User'),
                      displayRole: rawU.role ? String(rawU.role).toLowerCase() : 'viewer',
                      displayStatus: rawU.status ? String(rawU.status).toLowerCase() : 'active'
                    };

                    return (
                      <tr key={u.id} style={{ verticalAlign: 'middle' }}>
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
                          <select
                            value={u.displayRole}
                            onChange={(e) => updateUserRole(u.id, e.target.value)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-secondary)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              minWidth: 100,
                            }}
                            disabled={u.email === user?.email}
                            title={u.email === user?.email ? 'Cannot change your own role' : 'Select a role'}
                          >
                            <option value="viewer">viewer</option>
                            <option value="analyst">analyst</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={u.displayStatus}
                            onChange={(e) => updateUserStatus(u.id, e.target.value)}
                            style={{
                              padding: '6px 8px',
                              borderRadius: '6px',
                              border: '1px solid var(--border-color)',
                              background: 'var(--bg-secondary)',
                              color: 'var(--text-primary)',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              minWidth: 100,
                            }}
                            disabled={u.email === user?.email}
                            title={u.email === user?.email ? 'Cannot change your own status' : 'Select a status'}
                          >
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                          </select>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {u.lastLogin ? (
                            <>{new Date(u.lastLogin).toLocaleDateString()} {new Date(u.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not recorded</span>
                          )}
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