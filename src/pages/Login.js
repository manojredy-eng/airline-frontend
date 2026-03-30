import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.login(form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate(data.role === 'ADMIN' ? '/admin' : '/search');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Background */}
      <div style={styles.bg}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.bgGrid} />
      </div>

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>◈</div>
          <div>
            <div style={styles.logoText}>SKYLINE AIR</div>
            <div style={styles.logoSub}>Your journey begins here</div>
          </div>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to manage your flights and bookings</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              style={styles.input}
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Create one</Link>
        </div>

        {/* Demo Credentials */}
        <div style={styles.demo}>
          <div style={styles.demoTitle}>Demo Credentials</div>
          <div style={styles.demoRow}>
            <span style={styles.demoLabel}>User:</span>
            <code style={styles.demoCode}>user@airline.com / password</code>
          </div>
          <div style={styles.demoRow}>
            <span style={styles.demoLabel}>Admin:</span>
            <code style={styles.demoCode}>admin@airline.com / password</code>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#060612',
    position: 'relative',
    overflow: 'hidden',
    padding: '24px',
  },
  bg: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  bgOrb1: {
    position: 'absolute', top: '-20%', right: '-10%',
    width: '600px', height: '600px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(49,130,206,0.12) 0%, transparent 70%)',
  },
  bgOrb2: {
    position: 'absolute', bottom: '-20%', left: '-10%',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,179,237,0.08) 0%, transparent 70%)',
  },
  bgGrid: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
  },
  card: {
    background: 'linear-gradient(135deg, rgba(13,27,62,0.9), rgba(10,10,26,0.95))',
    border: '1px solid rgba(99,179,237,0.2)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(20px)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' },
  logoIcon: {
    width: '48px', height: '48px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #3182ce22, #3182ce44)',
    border: '1px solid rgba(99,179,237,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', color: '#63b3ed',
  },
  logoText: { fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '3px', fontFamily: 'Georgia, serif' },
  logoSub: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' },
  title: { fontSize: '28px', fontWeight: 800, color: '#fff', margin: '0 0 8px' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '0 0 28px' },
  error: {
    background: 'rgba(252,129,74,0.12)',
    border: '1px solid rgba(252,129,74,0.3)',
    color: '#fc8181',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '13px 16px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btn: {
    background: 'linear-gradient(135deg, #2b6cb0, #3182ce)',
    border: 'none',
    color: '#fff',
    padding: '15px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 700,
    width: '100%',
    marginTop: '8px',
    transition: 'opacity 0.2s',
    boxShadow: '0 4px 20px rgba(49,130,206,0.4)',
  },
  footer: { color: 'rgba(255,255,255,0.5)', fontSize: '14px', textAlign: 'center', marginTop: '24px' },
  link: { color: '#63b3ed', textDecoration: 'none', fontWeight: 600 },
  demo: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px',
    padding: '16px',
    marginTop: '20px',
  },
  demoTitle: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '10px' },
  demoRow: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' },
  demoLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', width: '44px' },
  demoCode: { background: 'rgba(99,179,237,0.1)', color: '#63b3ed', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' },
};

export default Login;