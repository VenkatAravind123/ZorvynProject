// Mock implementation of the backend API for the frontend

import axios from 'axios';

// Initial Mock Data
let transactions = [
  { id: '1', date: '2026-04-01', type: 'income', category: 'Salary', amount: 5000, notes: 'April Salary' },
  { id: '2', date: '2026-04-02', type: 'expense', category: 'Software', amount: 120, notes: 'AWS Bill' },
  { id: '3', date: '2026-04-05', type: 'expense', category: 'Marketing', amount: 450, notes: 'Google Ads' },
  { id: '4', date: '2026-04-10', type: 'income', category: 'Sales', amount: 2300, notes: 'Client Project' },
  { id: '5', date: '2026-04-12', type: 'expense', category: 'Office', amount: 80, notes: 'Coffee supplies' },
  { id: '6', date: '2026-04-14', type: 'expense', category: 'Software', amount: 15, notes: 'Github Copilot' },
  { id: '7', date: '2026-04-16', type: 'income', category: 'Investment', amount: 300, notes: 'Dividend' }
];

let users = [
  { id: 'u1', name: 'Admin User', email: 'admin@gmail.com', role: 'admin', status: 'active', lastLogin: '2026-04-02T10:00:00Z' },
  { id: 'u2', name: 'Alice Analyst', email: 'ram@gmail.com', role: 'analyst', status: 'active', lastLogin: '2026-04-01T15:30:00Z' },
  { id: 'u3', name: 'Bob Viewer', email: 'aravind@gmail.com.com', role: 'viewer', status: 'inactive', lastLogin: '2026-03-25T08:15:00Z' },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getRoleFromLocal = () => {
  const user = JSON.parse(localStorage.getItem('finance_user') || '{}');
  return user.role || 'viewer';
};

export const api = {
  // AUTH API
  login: async (userPayload) => {
    try {
      // Connect directly to your Spring Boot backend on typical development port 8080
      const response = await axios.post('http://localhost:8080/login', userPayload);
      
      // Return the bare token string as your backend formats it
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid credentials or Backend is offline');
    }
  },

  // SUMMARY API
  getDashboardSummary: async () => {
    await delay(600);
    const role = getRoleFromLocal();
    if (!['admin', 'analyst', 'viewer'].includes(role)) throw new Error('Unauthorized');

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    
    // Category totals
    const categoryTotals = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + (t.type === 'expense' ? t.amount : 0);
      return acc;
    }, {});

    // Last 7 days trend mock
    const trends = [
      { name: 'Mon', income: 4000, expense: 2400 },
      { name: 'Tue', income: 3000, expense: 1398 },
      { name: 'Wed', income: 2000, expense: 9800 },
      { name: 'Thu', income: 2780, expense: 3908 },
      { name: 'Fri', income: 1890, expense: 4800 },
      { name: 'Sat', income: 2390, expense: 3800 },
      { name: 'Sun', income: 3490, expense: 4300 },
    ];

    return {
      status: 'success',
      data: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        categoryTotals: Object.entries(categoryTotals).map(([name, value]) => ({ name, value })).filter(c => c.value > 0),
        recentActivity: transactions.slice().reverse().slice(0, 5),
        trends
      }
    };
  },

  // TRANSACTIONS API
  getTransactions: async (filters = {}) => {
    await delay(500);
    const role = getRoleFromLocal();
    if (role === 'viewer') throw new Error('Unauthorized access'); // Viewer shouldn't see full lists, only summaries (per prompt logic)

    let filtered = [...transactions];
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }
    return { status: 'success', data: filtered.reverse() };
  },

  createTransaction: async (data) => {
    await delay(700);
    const role = getRoleFromLocal();
    if (role !== 'admin') throw new Error('Only admins can create records');

    if (!data.amount || !data.type || !data.category) {
      throw new Error('Missing required fields');
    }

    const newTx = {
      ...data,
      id: Math.random().toString(36).substring(7),
      date: data.date || new Date().toISOString().split('T')[0]
    };
    transactions.push(newTx);
    return { status: 'success', data: newTx };
  },

  deleteTransaction: async (id) => {
    await delay(500);
    const role = getRoleFromLocal();
    if (role !== 'admin') throw new Error('Only admins can delete records');

    transactions = transactions.filter(t => t.id !== id);
    return { status: 'success' };
  },

  // USERS API
  getUsers: async () => {
    await delay(600);
    const role = getRoleFromLocal();
    if (role !== 'admin') throw new Error('Only admins can access user management');
    
    return { status: 'success', data: users };
  },

  updateUserStatus: async (id, status) => {
    await delay(400);
    const role = getRoleFromLocal();
    if (role !== 'admin') throw new Error('Unauthorized');
    
    users = users.map(u => u.id === id ? { ...u, status } : u);
    return { status: 'success' };
  }
};
