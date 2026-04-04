import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Filter, Trash2, ShieldAlert,SquarePen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [showupdateForm,setShowUpdateForm] = useState(false)
  const [filters, setFilters] = useState({ type: 'all', category: '', startDate: '', endDate: '' })
  const [formData, setFormData] = useState({title:'', amount: '', type: 'expense', category: '', description: '' ,recordDate:''});
  const [updateData,setUpdateData] = useState({title:'', amount: '', type: 'expense', category: '', description: '' ,recordDate:''});

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      const queryParams = {};
      if (filters.category) queryParams.category = filters.category;
      if (filters.type !== 'all') queryParams.recordType = filters.type.toUpperCase();
      if (filters.startDate) queryParams.startDate = filters.startDate + 'T00:00:00';
      if (filters.endDate) queryParams.endDate = filters.endDate + 'T23:59:59';

      const res = await axios.get('/user/viewrecords',{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('finance_token')}`
        },
        params: queryParams
      });
      setTransactions(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters.type]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/user/deleterecord?id=${id}`,{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('finance_token')}`
        }
      });
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditClick = (rawTx) => {
    setUpdateData({
      id: rawTx.id,
      title: rawTx.title || '',
      amount: rawTx.amount || '',
      type: rawTx.recordType ? rawTx.recordType.toLowerCase() : 'expense',
      category: rawTx.category || '',
      description: rawTx.description || '',
      recordDate: rawTx.recordDate ? rawTx.recordDate.split('T')[0] : ''
    });
    setShowUpdateForm(true);
    setShowForm(false);
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: updateData.id,
        title: updateData.title,
        amount: parseFloat(updateData.amount),
        recordType: updateData.type.toUpperCase(),
        category: updateData.category,
        description: updateData.description,
        recordDate: updateData.recordDate ? updateData.recordDate + 'T00:00:00' : null
      };

      await axios.put('/user/updaterecord', payload, {
        headers:{
          Authorization: `Bearer ${localStorage.getItem('finance_token')}`
        }
      });
      await fetchTransactions();
      setShowUpdateForm(false);
      setUpdateData({id: '', title:'', amount: '', type: 'expense', category: '', description: '' ,recordDate:''});
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        recordType: formData.type.toUpperCase(),
        category: formData.category,
        description: formData.description,
        recordDate: formData.recordDate ? formData.recordDate + 'T00:00:00' : null
      };

      const res = await axios.post('/user/createrecord', payload, {
        headers:{
          Authorization: `Bearer ${localStorage.getItem('finance_token')}`
        }
      });
      setTransactions([res.data, ...transactions]);
      setShowForm(false);
      setFormData({title:'', amount: '', type: 'expense', category: '', description: '' ,recordDate:''});
    } catch (err) {
      alert(err.message);
    }
  };

  if (user?.role === 'viewer') {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '60px 40px', textAlign: 'center', marginTop: '40px' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--danger)' }}>
          <ShieldAlert size={40} />
        </div>
        <h2 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>Access Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
          Your current role (<strong style={{ color: 'white' }}>{user.role}</strong>) does not have permission to view detailed transaction logs. Please contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Financial Records</h1>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px' }}>
            <button 
              style={{ padding: '6px 12px', borderRadius: '6px', background: filters.type === 'all' ? 'var(--primary)' : 'transparent', color: filters.type === 'all' ? 'white' : 'var(--text-secondary)' }}
              onClick={() => setFilters({...filters, type: 'all'})}
            >All</button>
            <button 
              style={{ padding: '6px 12px', borderRadius: '6px', background: filters.type === 'income' ? 'var(--primary)' : 'transparent', color: filters.type === 'income' ? 'white' : 'var(--text-secondary)' }}
              onClick={() => setFilters({...filters, type: 'income'})}
            >Income</button>
            <button 
              style={{ padding: '6px 12px', borderRadius: '6px', background: filters.type === 'expense' ? 'var(--primary)' : 'transparent', color: filters.type === 'expense' ? 'white' : 'var(--text-secondary)' }}
              onClick={() => setFilters({...filters, type: 'expense'})}
            >Expense</button>
          </div>

          {user?.role === 'admin' && (
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <Plus size={18} /> Add Record
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</label>
          <input type="text" className="w-full" placeholder="Software, Salary..." value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>From Date</label>
          <input type="date" className="w-full" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>To Date</label>
          <input type="date" className="w-full" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
           <button className="btn btn-secondary" onClick={fetchTransactions}><Filter size={16} /> Apply Filters</button>
        </div>
      </div>

      {showForm && (
        <form className="glass-panel animate-fade-in" onSubmit={handleAddSubmit} style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--primary-glow)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>New Record</h3>
          <div className="grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Type</label>
              <select className="w-full" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title</label>
              <input required type="text" className="w-full" placeholder="Record Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Amount (₹)</label>
              <input required type="number" step="0.01" className="w-full" placeholder="e.g. 50.00" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</label>
              <input required type="text" className="w-full" placeholder="e.g. Software, Salary" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
              <input required type="text" className="w-full" placeholder="Brief notes..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date of Record</label>
              <input required type="date" className="w-full" placeholder="Record Title" value={formData.recordDate} onChange={(e) => setFormData({...formData, recordDate: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Record</button>
          </div>
        </form>
      )}

      {showupdateForm && (
        <form className="glass-panel animate-fade-in" onSubmit={handleUpdateSubmit} style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--primary-glow)' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Update Record</h3>
          <div className="grid-cols-2" style={{ gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Type</label>
              <select className="w-full" value={updateData.type} onChange={(e) => setUpdateData({...updateData, type: e.target.value})}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Title</label>
              <input required type="text" className="w-full" placeholder="Record Title" value={updateData.title} onChange={(e) => setUpdateData({...updateData, title: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Amount (₹)</label>
              <input required type="number" step="0.01" className="w-full" placeholder="e.g. 50.00" value={updateData.amount} onChange={(e) => setUpdateData({...updateData, amount: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Category</label>
              <input required type="text" className="w-full" placeholder="e.g. Software, Salary" value={updateData.category} onChange={(e) => setUpdateData({...updateData, category: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Description</label>
              <input required type="text" className="w-full" placeholder="Brief notes..." value={updateData.description} onChange={(e) => setUpdateData({...updateData, description: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Date of Record</label>
              <input required type="date" className="w-full" placeholder="Date" value={updateData.recordDate} onChange={(e) => setUpdateData({...updateData, recordDate: e.target.value})} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Record</button>
          </div>
        </form>
      )}

      {error ? (
        <div className="glass-panel" style={{ padding: '20px', color: 'var(--danger)' }}>{error}</div>
      ) : (
        <div className="glass-panel">
          <div className="table-container">
            <table style={{ minWidth: '800px' }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  {user?.role === 'admin' && <th style={{ textAlign: 'right', width: '80px' }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading records...</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No records found.</td></tr>
                ) : (
                  transactions
                  .map((rawTx) => {
                    const tx = {
                      ...rawTx,
                      date: rawTx.recordDate ? new Date(rawTx.recordDate).toLocaleDateString() : 'N/A',
                      type: rawTx.recordType ? rawTx.recordType.toLowerCase() : 'expense',
                      amount: Number(rawTx.amount || 0).toFixed(2)
                    };
                    return (
                    <tr key={tx.id}>
                      <td>{tx.date}</td>
                      <td style={{ fontWeight: 500 }}>{tx.description}</td>
                      <td>{tx.category}</td>
                      <td><span className={`badge 
                        {tx.type}`}>{tx.type}</span></td>
                      <td style={{ textAlign: 'right', fontWeight: 600, color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                        {tx.type === 'income' ? '+' : '-'}₹{tx.amount}
                      </td>
                      {user?.role === 'admin' && (
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => handleEditClick(rawTx)} title="Edit Record"><SquarePen color='var(--text-muted)' size={16} /></button>
                          <button 
                            style={{ padding: '6px', color: 'var(--text-muted)' }} 
                            onClick={() => handleDelete(tx.id)}
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
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

export default Transactions;
