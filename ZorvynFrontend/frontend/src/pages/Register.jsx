import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const canSubmit = useMemo(() => {
        const hasFields =
            email.trim().length > 0 && password.length > 0 && confirmPassword.length > 0;
        return hasFields && password === confirmPassword;
    }, [email, password, confirmPassword]);

    const getErrorMessage = async (res) => {
        try {
            const raw = (await res.text()).toString().trim();
            if (!raw) return 'Registration failed. Please try again.';
            if (raw.length <= 180) return raw;
            return 'Registration failed. Please try again.';
        } catch {
            return 'Registration failed. Please try again.';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Only send fields required for registration.
                body: JSON.stringify({ email: email.trim(), password }),
            });

            if (!res.ok) {
                setError(await getErrorMessage(res));
                return;
            }

            // Backend returns user JSON; redirect to login.
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Register error:', err);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

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

            <div
                className="glass-panel animate-fade-in"
                style={{ padding: '40px', width: '100%', maxWidth: '440px', zIndex: 10 }}
            >
                <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                        FinDash<span style={{ color: 'var(--primary)' }}>\.</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Create your account to get started.
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            background: 'rgba(239,68,68,0.1)',
                            color: 'var(--danger)',
                            padding: '12px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            border: '1px solid rgba(239,68,68,0.2)',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                        }}
                    >
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                    <div>
                        <label
                            htmlFor="register-email"
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            Email
                        </label>
                        <input
                            id="register-email"
                            required
                            type="email"
                            className="w-full"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="register-password"
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            Password
                        </label>
                        <input
                            id="register-password"
                            required
                            type="password"
                            className="w-full"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="register-confirm-password"
                            style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            Confirm Password
                        </label>
                        <input
                            id="register-confirm-password"
                            required
                            type="password"
                            className="w-full"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '10px', justifyContent: 'center' }}
                        disabled={loading || !canSubmit}
                    >
                        {loading ? (
                            'Creating...'
                        ) : (
                            <>
                                <UserPlus size={18} /> Register
                            </>
                        )}
                    </button>
                </form>

                <div
                    style={{
                        marginTop: '18px',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        color: 'var(--text-muted)',
                    }}
                >
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
