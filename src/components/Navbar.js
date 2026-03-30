import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navLinks = [
    { path: '/search', label: 'Search Flights', icon: '✈️' },
    { path: '/my-bookings', label: 'My Bookings', icon: '🎫' },
    ...(isAdmin ? [{ path: '/admin', label: 'Admin', icon: '⚙️' }] : []),
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/search" style={styles.logo}>
          <span style={styles.logoIcon}>◈</span>
          <span style={styles.logoText}>SKYLINE</span>
          <span style={styles.logoDot}>AIR</span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.links}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.link,
                ...(location.pathname === link.path ? styles.linkActive : {}),
              }}
            >
              <span style={styles.linkIcon}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>

        {/* User */}
        <div style={styles.userArea}>
          {user ? (
            <>
              <div style={styles.userBadge}>
                <span style={styles.userAvatar}>{user.fullName?.[0] || 'U'}</span>
                <span style={styles.userName}>{user.fullName}</span>
                {isAdmin && <span style={styles.adminBadge}>ADMIN</span>}
              </div>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.loginBtn}>Sign In</Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </Link>
          ))}
          {user ? (
            <button onClick={handleLogout} style={styles.mobileLinkBtn}>
              🚪 Sign Out
            </button>
          ) : (
            <Link to="/login" style={styles.mobileLink}>🔑 Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 100%)',
    borderBottom: '1px solid rgba(99, 179, 237, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
  },
  inner: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon: { fontSize: '20px', color: '#63b3ed' },
  logoText: { fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '3px', fontFamily: 'Georgia, serif' },
  logoDot: { fontSize: '11px', color: '#63b3ed', letterSpacing: '2px', fontWeight: 600, marginTop: '2px' },
  links: { display: 'flex', gap: '4px', flex: 1 },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  linkActive: {
    background: 'rgba(99, 179, 237, 0.15)',
    color: '#63b3ed',
    border: '1px solid rgba(99, 179, 237, 0.3)',
  },
  linkIcon: { fontSize: '16px' },
  userArea: { display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' },
  userBadge: { display: 'flex', alignItems: 'center', gap: '8px' },
  userAvatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #63b3ed, #3182ce)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 700, color: '#fff',
  },
  userName: { color: '#fff', fontSize: '14px', fontWeight: 500 },
  adminBadge: {
    background: 'rgba(246, 173, 85, 0.2)',
    border: '1px solid rgba(246, 173, 85, 0.5)',
    color: '#f6ad55',
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 6px',
    borderRadius: '4px',
    letterSpacing: '1px',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.7)',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  loginBtn: {
    background: 'linear-gradient(135deg, #3182ce, #63b3ed)',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    marginLeft: 'auto',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 16px 16px',
    gap: '4px',
    background: '#0d1b3e',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  mobileLink: {
    padding: '10px 12px',
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    borderRadius: '6px',
    fontSize: '14px',
  },
  mobileLinkBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 12px',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '6px',
    width: '100%',
  },
};

export default Navbar;