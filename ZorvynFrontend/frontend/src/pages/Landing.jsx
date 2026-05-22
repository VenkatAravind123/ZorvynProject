import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-10%',
          width: '40%',
          height: '40%',
          background: 'var(--primary)',
          filter: 'blur(150px)',
          opacity: 0.15,
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '30%',
          height: '30%',
          background: 'var(--success)',
          filter: 'blur(120px)',
          opacity: 0.15,
          borderRadius: '50%',
        }}
      />

      <div className="glass-panel animate-fade-in" style={{ padding: 40, width: '100%', maxWidth: 560, zIndex: 10 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 8, textAlign: 'center' }}>
          FinDash<span style={{ color: 'var(--primary)' }}>.</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 24 }}>
          Track income, expenses, and records with role-based access.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn btn-primary" to="/login" style={{ justifyContent: 'center' }}>
            Log In
          </Link>
          <Link className="btn btn-secondary" to="/register" style={{ justifyContent: 'center' }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}