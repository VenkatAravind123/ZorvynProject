import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';

  return (
    <header className="glass-panel" style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '16px 24px', borderRadius: 0, borderTop: 'none', borderRight: 'none', borderLeft: 'none', zIndex: 5
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 500, margin: 0 }}>Welcome back, {displayName.split(' ')[0]}</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search anything..." style={{ paddingLeft: '38px', width: '250px', background: 'rgba(255,255,255,0.03)' }} />
        </div>
        
        <button className="btn-secondary" style={{ padding: '10px', borderRadius: '50%' }}>
          <Bell size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid var(--border-color)', paddingLeft: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>{displayName}</p>
            <span className={`badge ${user?.role}`} style={{ marginTop: '4px', display: 'inline-block', fontSize: '0.65rem' }}>{user?.role}</span>
          </div>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 600, fontSize: '1.1rem',
            textTransform: 'uppercase'
          }}>
            {displayName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
