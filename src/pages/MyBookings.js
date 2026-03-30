import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    bookingAPI.getMyBookings()
      .then(({ data }) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      const { data } = await bookingAPI.cancel(id);
      setBookings(prev => prev.map(b => b.id === id ? data : b));
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    }
  };

  const filtered = filter === 'ALL' ? bookings : bookings.filter(b => b.status === filter);

  const statusColors = {
    CONFIRMED: { bg: 'rgba(72,187,120,0.12)', color: '#68d391', border: 'rgba(72,187,120,0.3)' },
    CANCELLED: { bg: 'rgba(252,129,74,0.12)', color: '#fc8181', border: 'rgba(252,129,74,0.3)' },
    PENDING:   { bg: 'rgba(246,173,85,0.12)',  color: '#f6ad55', border: 'rgba(246,173,85,0.3)' },
    COMPLETED: { bg: 'rgba(159,122,234,0.12)', color: '#b794f4', border: 'rgba(159,122,234,0.3)' },
    CHECKED_IN:{ bg: 'rgba(99,179,237,0.12)',  color: '#63b3ed', border: 'rgba(99,179,237,0.3)' },
  };
  const payColors = { PAID: '#68d391', PENDING: '#f6ad55', REFUNDED: '#b794f4', FAILED: '#fc8181' };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Bookings</h1>
          <p style={styles.subtitle}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>
        </div>
        <button style={styles.searchBtn} onClick={() => navigate('/search')}>+ Book New Flight</button>
      </div>

      {/* Filter */}
      <div style={styles.filters}>
        {['ALL','CONFIRMED','PENDING','CANCELLED','COMPLETED'].map(f => (
          <button key={f} style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={styles.centered}>
          <div style={{ fontSize: '48px' }}>🎫</div>
          <p style={styles.loadText}>Loading your bookings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🛫</div>
          <h3 style={styles.emptyTitle}>No bookings found</h3>
          <p style={styles.emptyText}>
            {filter === 'ALL' ? "You haven't made any bookings yet." : `No ${filter.toLowerCase()} bookings.`}
          </p>
          {filter === 'ALL' && (
            <button style={styles.searchBtn} onClick={() => navigate('/search')}>Search Flights</button>
          )}
        </div>
      ) : (
        <div style={styles.list}>
          {filtered.map(b => {
            const sc = statusColors[b.status] || statusColors.PENDING;
            return (
              <div key={b.id} style={styles.card}>
                {/* Card Header */}
                <div style={styles.cardTop}>
                  <div style={styles.refArea}>
                    <span style={styles.refLabel}>Booking Ref</span>
                    <span style={styles.refCode}>{b.bookingReference}</span>
                  </div>
                  <div style={styles.badges}>
                    <span style={{ ...styles.badge, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {b.status}
                    </span>
                    <span style={{ ...styles.badge, color: payColors[b.paymentStatus], background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {b.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Route */}
                <div style={styles.route}>
                  <div style={styles.endpoint}>
                    <div style={styles.code}>{b.flight?.originCode}</div>
                    <div style={styles.city}>{b.flight?.origin}</div>
                    <div style={styles.time}>
                      {b.flight && new Date(b.flight.departureTime).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div style={styles.flightMid}>
                    <div style={styles.flightLine}>
                      <div style={styles.dot} />
                      <div style={styles.dash} />
                      <span style={{ color: '#63b3ed', fontSize: '14px' }}>✈</span>
                      <div style={styles.dash} />
                      <div style={styles.dot} />
                    </div>
                    <div style={styles.flightNum}>{b.flight?.flightNumber} · {b.flight?.airline}</div>
                  </div>
                  <div style={{ ...styles.endpoint, textAlign: 'right' }}>
                    <div style={styles.code}>{b.flight?.destinationCode}</div>
                    <div style={styles.city}>{b.flight?.destination}</div>
                    <div style={styles.time}>
                      {b.flight && new Date(b.flight.arrivalTime).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div style={styles.cardFooter}>
                  <div style={styles.footerInfo}>
                    <span style={styles.footerItem}>
                      👥 {b.passengers?.length || 0} passenger{(b.passengers?.length || 0) !== 1 ? 's' : ''}
                    </span>
                    <span style={styles.footerItem}>
                      📅 Booked {new Date(b.bookedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={styles.footerRight}>
                    <span style={styles.totalAmount}>${parseFloat(b.totalAmount || 0).toFixed(2)}</span>
                    {b.status === 'CONFIRMED' && (
                      <button style={styles.cancelBtn} onClick={() => handleCancel(b.id)}>Cancel</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#060612', color: '#fff', padding: '32px 24px', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' },
  title: { fontSize: '30px', fontWeight: 900, color: '#fff', margin: '0 0 6px', fontFamily: 'Georgia, serif' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 },
  searchBtn: {
    background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', border: 'none',
    color: '#fff', padding: '12px 22px', borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: 700,
  },
  filters: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  filterBtn: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.5)', padding: '7px 14px', borderRadius: '8px',
    cursor: 'pointer', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px',
  },
  filterActive: {
    background: 'rgba(99,179,237,0.12)', border: '1px solid rgba(99,179,237,0.35)', color: '#63b3ed',
  },
  centered: { textAlign: 'center', padding: '80px 0' },
  loadText: { color: 'rgba(255,255,255,0.4)', marginTop: '16px' },
  empty: { textAlign: 'center', padding: '80px 0' },
  emptyIcon: { fontSize: '56px', marginBottom: '20px' },
  emptyTitle: { color: '#fff', fontSize: '22px', fontWeight: 700, margin: '0 0 8px' },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 24px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: {
    background: 'linear-gradient(135deg, rgba(13,27,62,0.95), rgba(10,10,26,0.95))',
    border: '1px solid rgba(99,179,237,0.15)', borderRadius: '16px', padding: '24px',
    display: 'flex', flexDirection: 'column', gap: '20px',
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  refArea: { display: 'flex', flexDirection: 'column', gap: '4px' },
  refLabel: { color: 'rgba(255,255,255,0.35)', fontSize: '11px', letterSpacing: '1px', fontWeight: 600 },
  refCode: { color: '#63b3ed', fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, letterSpacing: '2px' },
  badges: { display: 'flex', gap: '8px', alignItems: 'center' },
  badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' },
  route: { display: 'flex', alignItems: 'center', gap: '16px' },
  endpoint: { flex: '0 0 auto' },
  code: { fontSize: '26px', fontWeight: 800, color: '#fff' },
  city: { color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '2px' },
  time: { color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '4px' },
  flightMid: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  flightLine: { width: '100%', display: 'flex', alignItems: 'center', gap: '4px' },
  dot: { width: '5px', height: '5px', borderRadius: '50%', background: '#63b3ed', flexShrink: 0 },
  dash: { flex: 1, height: '1px', background: 'rgba(99,179,237,0.3)' },
  flightNum: { color: 'rgba(255,255,255,0.35)', fontSize: '12px' },
  cardFooter: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  footerInfo: { display: 'flex', gap: '20px' },
  footerItem: { color: 'rgba(255,255,255,0.4)', fontSize: '13px' },
  footerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  totalAmount: { fontSize: '22px', fontWeight: 800, color: '#fff' },
  cancelBtn: {
    background: 'rgba(252,129,74,0.1)', border: '1px solid rgba(252,129,74,0.3)',
    color: '#fc8181', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', fontWeight: 600,
  },
};

export default MyBookings;