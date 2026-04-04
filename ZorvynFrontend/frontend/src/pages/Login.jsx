import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { useState } from 'react';

const Login = () => {
 const { login } = useAuth();
 const navigate = useNavigate();

 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const parseJwt = (token) => {
 try {
 const base64Url = token.split('.')[1];
 if (!base64Url) return null;
 const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
 const jsonPayload = decodeURIComponent(
 atob(base64)
 .split('')
 .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
 .join('')
 );
 return JSON.parse(jsonPayload);
 } catch {
 return null;
 }
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError(null);
 setLoading(true);

 try {
 const response = await fetch('/user/login', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ email: email.trim(), password })
 });

 if (!response.ok) {
 setError('Invalid email or password. Please try again.');
 return;
 }

 const token = (await response.text()).trim();
 if (!token) {
 setError('Login failed. Empty token received.');
 return;
 }

 const claims = parseJwt(token);
  let parsedRole =
    claims?.role ||
    claims?.roles?.[0] ||
    claims?.authorities?.[0]?.authority ||
    claims?.authorities?.[0] ||
    'viewer';
    
  let role = typeof parsedRole === 'string' 
    ? parsedRole.replace(/^ROLE_/i, '').toLowerCase() 
    : 'viewer';

 const user = { email: email.trim(), role };

 localStorage.setItem('finance_token', token);
 localStorage.setItem('finance_user', JSON.stringify(user));

 if (typeof login === 'function') {
 login(user, token);
 }

 navigate('/', { replace: true });
 } catch (err) {
 console.error('Login error:', err);
 setError('Network error. Please check your connection and try again.');
 } finally {
 setLoading(false);
 }
 };

 const autofill = (testEmail) => {
 setEmail(testEmail);
 setPassword('password123');
 };

 return (
 <div style={{
 display: 'flex',
 height: '100vh',
 alignItems: 'center',
 justifyContent: 'center',
 padding: '20px',
 position: 'relative',
 overflow: 'hidden'
 }}
 >
 <div style={{
 position: 'absolute',
 top: '-10%',
 left: '-10%',
 width: '40%',
 height: '40%',
 background: 'var(--primary)',
 filter: 'blur(150px)',
 opacity:0.15,
 borderRadius: '50%'
 }}
 />
 <div style={{
 position: 'absolute',
 bottom: '-10%',
 right: '-10%',
 width: '30%',
 height: '30%',
 background: 'var(--success)',
 filter: 'blur(120px)',
 opacity:0.15,
 borderRadius: '50%'
 }}
 />

 <div className="glass-panel animate-fade-in"
 style={{ padding: '40px', width: '100%', maxWidth: '440px', zIndex:10 }}
 >
 <div style={{ marginBottom: '30px', textAlign: 'center' }}>
 <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
 FinDash<span style={{ color: 'var(--primary)' }}>\.</span>
 </h1>
 <p style={{ color: 'var(--text-secondary)' }}>
 Welcome back\! Please enter your details.
 </p>
 </div>

 {error && (
 <div style={{
 background: 'rgba(239,68,68,0.1)',
 color: 'var(--danger)',
 padding: '12px',
 borderRadius: '10px',
 marginBottom: '20px',
 border: '1px solid rgba(239,68,68,0.2)',
 fontSize: '0.9rem',
 textAlign: 'center'
 }}
 >
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
 <div>
 <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
 Email </label>
 <input required type="email"
 className="w-full"
 placeholder="Enter your email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 />
 </div>

 <div>
 <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
 Password </label>
 <input required type="password"
 className="w-full"
 placeholder="••••••••"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 />
 </div>

 <button type="submit"
 className="btn btn-primary"
 style={{ width: '100%', marginTop: '10px', justifyContent: 'center' }}
 disabled={loading}
 >
 {loading ? 'Verifying...' : <><LogIn size={18} /> Sign In</>}
 </button>
 </form>

 <div style={{
 marginTop: '30px',
 paddingTop: '20px',
 borderTop: '1px solid var(--border-color)',
 fontSize: '0.85rem',
 color: 'var(--text-muted)'
 }}
 >
 <p style={{ marginBottom: '12px', textAlign: 'center' }}>Available Test Accounts</p>
 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
 <button type="button" className="badge admin" style={{ cursor: 'pointer' }} onClick={() => autofill('admin@findash.com')}>
 Admin </button>
 <button type="button" className="badge analyst" style={{ cursor: 'pointer' }} onClick={() => autofill('alice@findash.com')}>
 Analyst </button>
 <button type="button" className="badge viewer" style={{ cursor: 'pointer' }} onClick={() => autofill('bob@findash.com')}>
 Viewer </button>
 </div>
 </div>
 </div>
 </div>
 );
}

export default Login;