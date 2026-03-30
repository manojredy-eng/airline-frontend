import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.register(form);
      if (data?.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
      }
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg}>
        <div style={styles.bgOrb1} />
        <div style={styles.bgOrb2} />
        <div style={styles.bgGrid} />
      </div>

      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>◈</div>
          <div>
            <div style={styles.logoText}>SKYLINE AIR</div>
            <div style={styles.logoSub}>Begin your next flight booking</div>
          </div>
        </div>

        <h1 style={styles.title}>Create an account</h1>
        <p style={styles.subtitle}>Sign up to track your bookings and flights</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>First Name</label>
            <input
              type="text"
              style={styles.input}
              placeholder="John"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Last Name</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              style={styles.input}
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Phone (optional)</label>
            <input
              type="tel"
              style={styles.input}
              placeholder="+1-555-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
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
    padding: '16px',
  },
  bg: { position: 'absolute', inset: 0, pointerEvents: 'none' },
  bgOrb1: {
    position: 'absolute', top: '-20%', right: '-10%',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(49,130,206,0.12) 0%, transparent 70%)',
  },
  bgOrb2: {
    position: 'absolute', bottom: '-20%', left: '-10%',
    width: '300px', height: '300px', borderRadius: '50%',
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
    borderRadius: '16px',
    padding: '24px',
    width: '100%',
    maxWidth: '380px',
    position: 'relative',
    boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    backdropFilter: 'blur(20px)',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
  logoIcon: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #3182ce22, #3182ce44)',
    border: '1px solid rgba(99,179,237,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', color: '#63b3ed',
  },
  logoText: { fontSize: '14px', fontWeight: 800, color: '#fff', letterSpacing: '2px', fontFamily: 'Georgia, serif' },
  logoSub: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' },
  title: { fontSize: '24px', fontWeight: 800, color: '#fff', margin: '0 0 6px' },
  subtitle: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 20px' },
  error: {
    background: 'rgba(252,129,74,0.12)',
    border: '1px solid rgba(252,129,74,0.3)',
    color: '#fc8181',
    padding: '10px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    marginBottom: '16px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '11px 14px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btn: {
    background: 'linear-gradient(135deg, #2b6cb0, #3182ce)',
    border: 'none',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 700,
    width: '100%',
    marginTop: '6px',
    transition: 'opacity 0.2s',
    boxShadow: '0 4px 20px rgba(49,130,206,0.4)',
  },
  footer: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', textAlign: 'center', marginTop: '20px' },
  link: { color: '#63b3ed', textDecoration: 'none', fontWeight: 600 },
  demo: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '16px',
  },
  demoTitle: { color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' },
  demoRow: { display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '4px' },
  demoLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', width: '40px' },
  demoCode: { background: 'rgba(99,179,237,0.1)', color: '#63b3ed', padding: '2px 6px', borderRadius: '3px', fontSize: '11px' },
};

export default Register;