import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ArrowUpRight, ArrowDownRight, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.getDashboardSummary();
        setData(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="animate-fade-in">Loading dashboard data...</div></div>;
  if (error) return <div className="glass-panel" style={{ padding: '20px', color: 'var(--danger)' }}>Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Financial Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {user.role === 'admin' ? 'Full Administrator Dashboard' : user.role === 'analyst' ? 'Analyst Insights Dashboard' : 'Viewer Summary Dashboard'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user.role === 'admin' && (
            <span className="badge admin" style={{ padding: '6px 12px' }}>Admin Controls Active</span>
          )}
          <span className="badge" style={{ background: 'rgba(255,255,255,0.1)' }}>Updated Just Now</span>
        </div>
      </div>

      {/* Summary Cards - Visible to everyone */}
      <div className="grid-cols-3 stagger-1" style={{ marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Income</p>
              <h2 style={{ fontSize: '2rem' }}>${data.totalIncome.toLocaleString()}</h2>
            </div>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', color: 'var(--success)' }}>
              <ArrowUpRight size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--success)', fontWeight: 500 }}>+12.5%</span>
            <span style={{ color: 'var(--text-muted)' }}>from last month</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Expenses</p>
              <h2 style={{ fontSize: '2rem' }}>${data.totalExpenses.toLocaleString()}</h2>
            </div>
            <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', color: 'var(--danger)' }}>
              <ArrowDownRight size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--danger)', fontWeight: 500 }}>+5.2%</span>
            <span style={{ color: 'var(--text-muted)' }}>from last month</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <p style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 500 }}>Net Balance</p>
              <h2 style={{ fontSize: '2rem' }}>${data.netBalance.toLocaleString()}</h2>
            </div>
            <div style={{ padding: '10px', background: 'var(--primary)', borderRadius: '10px', color: 'white', boxShadow: '0 4px 12px var(--primary-glow)' }}>
              <DollarSign size={24} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
            <Activity size={16} color="var(--primary)" />
            <span style={{ color: 'var(--text-primary)' }}>Healthy cash flow</span>
          </div>
        </div>
      </div>

      {/* Viewer Restriction Message */}
      {user.role === 'viewer' && (
        <div className="glass-panel stagger-2" style={{ padding: '30px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Detailed Insights Hidden</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You are currently on a <strong>Viewer</strong> role. Detailed charts and recent activity streams are restricted to Analysts and Admins.</p>
        </div>
      )}

      {/* Charts - Visible to Analyst and Admin */}
      {(user.role === 'analyst' || user.role === 'admin') && (
        <div className="grid-cols-2 stagger-2" style={{ marginBottom: '24px' }}>
          {/* Weekly Trend Chart */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Income vs Expenses (Weekly)</h3>
            <div style={{ width: '100%', minWidth: 0 }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.trends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-secondary)" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px', backdropFilter: 'blur(10px)' }}
                  />
                  <Bar dataKey="income" fill="var(--success)" radius={[4, 4, 0, 0]} barSize={12} />
                  <Bar dataKey="expense" fill="var(--danger)" radius={[4, 4, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '24px', fontSize: '1.1rem' }}>Expenses by Category</h3>
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
              {data.categoryTotals.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.categoryTotals}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {data.categoryTotals.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No expenses recorded.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity - Visible to Analyst and Admin */}
      {(user.role === 'analyst' || user.role === 'admin') && (
        <div className="glass-panel stagger-3" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Activity</h3>
            {user.role === 'admin' && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full system logs displayed</span>
            )}
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td style={{ fontWeight: 500 }}>{tx.notes}</td>
                    <td>{tx.category}</td>
                    <td><span className={`badge ${tx.type}`}>{tx.type}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {data.recentActivity.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>No recent activity.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
