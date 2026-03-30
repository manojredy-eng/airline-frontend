import React, { useState, useEffect } from 'react';
import { flightAPI, bookingAPI } from '../services/api';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div style={{ ...cardStyles.stat, borderColor: color + '33' }}>
    <div style={{ ...cardStyles.statIcon, background: color + '18', color }}>{icon}</div>
    <div>
      <div style={cardStyles.statValue}>{value}</div>
      <div style={cardStyles.statLabel}>{label}</div>
      {sub && <div style={cardStyles.statSub}>{sub}</div>}
    </div>
  </div>
);

const cardStyles = {
  stat: {
    background: 'linear-gradient(135deg, rgba(13,27,62,0.9), rgba(10,10,26,0.9))',
    border: '1px solid',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    
  },
  statIcon: {
    width: '50px', height: '50px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0,
  },
  statValue: { fontSize: '26px', fontWeight: 800, color: '#fff', lineHeight: 1 },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' },
  statSub: { color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '2px' },
};

const AdminDashboard = () => {
  const [tab, setTab] = useState('overview');
  const [flights, setFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flightModal, setFlightModal] = useState(false);
  const [newFlight, setNewFlight] = useState({
    flightNumber: '', airline: '', origin: '', originCode: '',
    destination: '', destinationCode: '', departureTime: '', arrivalTime: '',
    price: '', totalSeats: '', flightClass: 'ECONOMY', aircraftType: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [flRes, bkRes] = await Promise.all([flightAPI.getAll(), bookingAPI.getAll()]);
        setFlights(flRes.data);
        setBookings(bkRes.data);
      } catch { setError('Failed to load data.'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'PAID')
    .reduce((s, b) => s + parseFloat(b.totalAmount || 0), 0);

  const handleAddFlight = async () => {
    try {
      const { data } = await flightAPI.create(newFlight);
      setFlights(prev => [data, ...prev]);
      setFlightModal(false);
      setSuccess('Flight added successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add flight.');
    }
  };

  const handleDeleteFlight = async (id) => {
    if (!window.confirm('Delete this flight?')) return;
    try {
      await flightAPI.delete(id);
      setFlights(prev => prev.filter(f => f.id !== id));
      setSuccess('Flight deleted.');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Failed to delete.'); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await flightAPI.updateStatus(id, status);
      setFlights(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    } catch { setError('Status update failed.'); }
  };

  const handlePaymentUpdate = async (id, status) => {
    try {
      const { data } = await bookingAPI.updatePayment(id, status);
      setBookings(prev => prev.map(b => b.id === id ? data : b));
    } catch { setError('Payment update failed.'); }
  };

  const TABS = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'flights', label: '✈️ Flights' },
    { id: 'bookings', label: '🎫 Bookings' },
  ];

  const statusColors = {
    SCHEDULED: '#63b3ed', DELAYED: '#f6ad55', CANCELLED: '#fc8181', BOARDING: '#68d391', COMPLETED: '#b794f4',
  };
  const payColors = { PAID: '#68d391', PENDING: '#f6ad55', REFUNDED: '#b794f4', FAILED: '#fc8181' };

  if (loading) return (
    <div style={styles.centered}>
      <div style={{ fontSize: '48px' }}>⚙️</div>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '16px' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage flights, bookings, and system analytics</p>
        </div>
        <button style={styles.addBtn} onClick={() => setFlightModal(true)}>+ Add Flight</button>
      </div>

      {(error || success) && (
        <div style={error ? styles.error : styles.successBanner}>
          {error || success}
          <button style={styles.closeX} onClick={() => { setError(''); setSuccess(''); }}>×</button>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map(t => (
          <button key={t.id} style={{ ...styles.tab, ...(tab === t.id ? styles.tabActive : {}) }}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div>
          <div style={styles.statsGrid}>
            <StatCard icon="✈️" label="Total Flights" value={flights.length} color="#63b3ed"
              sub={`${flights.filter(f => f.status === 'SCHEDULED').length} scheduled`} />
            <StatCard icon="🎫" label="Total Bookings" value={bookings.length} color="#b794f4"
              sub={`${bookings.filter(b => b.status === 'CONFIRMED').length} active`} />
            <StatCard icon="💰" label="Total Revenue" value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              color="#68d391" sub="Paid bookings only" />
            <StatCard icon="❌" label="Cancellations" value={bookings.filter(b => b.status === 'CANCELLED').length}
              color="#fc8181" sub="All time" />
          </div>

          {/* Recent Bookings */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Recent Bookings</h2>
            <div style={styles.table}>
              <div style={styles.tableHeader}>
                <span>Reference</span><span>Passenger</span><span>Flight</span><span>Amount</span><span>Status</span>
              </div>
              {bookings.slice(0, 8).map(b => (
                <div key={b.id} style={styles.tableRow}>
                  <span style={styles.refCode}>{b.bookingReference}</span>
                  <span>{b.user?.firstName} {b.user?.lastName}</span>
                  <span style={{ color: '#63b3ed' }}>{b.flight?.flightNumber}</span>
                  <span style={{ fontWeight: 600 }}>${parseFloat(b.totalAmount || 0).toFixed(2)}</span>
                  <span style={{ color: payColors[b.paymentStatus] || '#fff', fontSize: '12px', fontWeight: 700 }}>
                    {b.paymentStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Flights Tab */}
      {tab === 'flights' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>All Flights ({flights.length})</h2>
          <div style={styles.table}>
            <div style={{ ...styles.tableHeader, gridTemplateColumns: '1fr 1fr 1fr 1fr 80px 110px 110px' }}>
              <span>Flight</span><span>Route</span><span>Departure</span><span>Price</span>
              <span>Seats</span><span>Status</span><span>Actions</span>
            </div>
            {flights.map(f => (
              <div key={f.id} style={{ ...styles.tableRow, gridTemplateColumns: '1fr 1fr 1fr 1fr 80px 110px 110px' }}>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700 }}>{f.flightNumber}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{f.airline}</div>
                </div>
                <span style={{ color: '#63b3ed' }}>{f.originCode} → {f.destinationCode}</span>
                <span style={{ fontSize: '13px' }}>
                  {new Date(f.departureTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span style={{ fontWeight: 700 }}>${parseFloat(f.price).toFixed(2)}</span>
                <span>{f.availableSeats}/{f.totalSeats}</span>
                <select
                  style={{ ...styles.statusSelect, color: statusColors[f.status] || '#fff' }}
                  value={f.status}
                  onChange={e => handleUpdateStatus(f.id, e.target.value)}
                >
                  {['SCHEDULED','DELAYED','CANCELLED','BOARDING','COMPLETED'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button style={styles.deleteBtn} onClick={() => handleDeleteFlight(f.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === 'bookings' && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>All Bookings ({bookings.length})</h2>
          <div style={styles.table}>
            <div style={{ ...styles.tableHeader, gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 0.8fr 120px' }}>
              <span>Reference</span><span>Customer</span><span>Flight</span>
              <span>Amount</span><span>Booking</span><span>Payment</span>
            </div>
            {bookings.map(b => (
              <div key={b.id} style={{ ...styles.tableRow, gridTemplateColumns: '1.2fr 1fr 0.8fr 0.8fr 0.8fr 120px' }}>
                <span style={styles.refCode}>{b.bookingReference}</span>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px' }}>{b.user?.firstName} {b.user?.lastName}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>{b.user?.email}</div>
                </div>
                <span style={{ color: '#63b3ed', fontWeight: 600 }}>{b.flight?.flightNumber}</span>
                <span style={{ fontWeight: 700 }}>${parseFloat(b.totalAmount || 0).toFixed(2)}</span>
                <span style={{ color: b.status === 'CANCELLED' ? '#fc8181' : '#68d391', fontSize: '12px', fontWeight: 600 }}>
                  {b.status}
                </span>
                <select
                  style={{ ...styles.statusSelect, color: payColors[b.paymentStatus] || '#fff' }}
                  value={b.paymentStatus}
                  onChange={e => handlePaymentUpdate(b.id, e.target.value)}
                >
                  {['PENDING','PAID','REFUNDED','FAILED'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Flight Modal */}
      {flightModal && (
        <div style={styles.overlay} onClick={() => setFlightModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add New Flight</h3>
              <button style={styles.closeBtn} onClick={() => setFlightModal(false)}>×</button>
            </div>
            <div style={styles.modalForm}>
              {[
                ['flightNumber', 'Flight Number', 'e.g. AA101'],
                ['airline', 'Airline', 'e.g. American Airlines'],
                ['origin', 'Origin City', 'e.g. New York'],
                ['originCode', 'Origin Code', 'e.g. JFK'],
                ['destination', 'Destination City', 'e.g. Los Angeles'],
                ['destinationCode', 'Destination Code', 'e.g. LAX'],
                ['aircraftType', 'Aircraft Type', 'e.g. Boeing 737'],
              ].map(([key, label, placeholder]) => (
                <div key={key} style={styles.mField}>
                  <label style={styles.mLabel}>{label}</label>
                  <input style={styles.mInput} placeholder={placeholder}
                    value={newFlight[key]}
                    onChange={e => setNewFlight({ ...newFlight, [key]: e.target.value })} />
                </div>
              ))}
              <div style={styles.mRow}>
                <div style={styles.mField}>
                  <label style={styles.mLabel}>Departure Time</label>
                  <input type="datetime-local" style={styles.mInput}
                    value={newFlight.departureTime}
                    onChange={e => setNewFlight({ ...newFlight, departureTime: e.target.value })} />
                </div>
                <div style={styles.mField}>
                  <label style={styles.mLabel}>Arrival Time</label>
                  <input type="datetime-local" style={styles.mInput}
                    value={newFlight.arrivalTime}
                    onChange={e => setNewFlight({ ...newFlight, arrivalTime: e.target.value })} />
                </div>
              </div>
              <div style={styles.mRow}>
                <div style={styles.mField}>
                  <label style={styles.mLabel}>Price ($)</label>
                  <input type="number" style={styles.mInput} placeholder="299.99"
                    value={newFlight.price}
                    onChange={e => setNewFlight({ ...newFlight, price: e.target.value })} />
                </div>
                <div style={styles.mField}>
                  <label style={styles.mLabel}>Total Seats</label>
                  <input type="number" style={styles.mInput} placeholder="180"
                    value={newFlight.totalSeats}
                    onChange={e => setNewFlight({ ...newFlight, totalSeats: e.target.value })} />
                </div>
                <div style={styles.mField}>
                  <label style={styles.mLabel}>Class</label>
                  <select style={styles.mInput} value={newFlight.flightClass}
                    onChange={e => setNewFlight({ ...newFlight, flightClass: e.target.value })}>
                    <option value="ECONOMY">Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setFlightModal(false)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleAddFlight}>Add Flight</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', background: '#060612', color: '#fff', padding: '32px 24px', maxWidth: '1280px', margin: '0 auto' },
  centered: { minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: 900, color: '#fff', margin: '0 0 8px', fontFamily: 'Georgia, serif' },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 },
  addBtn: {
    background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', border: 'none',
    color: '#fff', padding: '12px 22px', borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: 700, boxShadow: '0 4px 16px rgba(49,130,206,0.4)',
  },
  error: {
    background: 'rgba(252,129,74,0.12)', border: '1px solid rgba(252,129,74,0.3)',
    color: '#fc8181', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
    display: 'flex', justifyContent: 'space-between',
  },
  successBanner: {
    background: 'rgba(72,187,120,0.12)', border: '1px solid rgba(72,187,120,0.3)',
    color: '#68d391', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
    display: 'flex', justifyContent: 'space-between',
  },
  closeX: { background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '18px' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '28px' },
  tab: {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.55)', padding: '10px 20px', borderRadius: '10px',
    cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s',
  },
  tabActive: {
    background: 'rgba(99,179,237,0.15)', border: '1px solid rgba(99,179,237,0.4)',
    color: '#63b3ed',
  },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' },
  section: {},
  sectionTitle: { fontSize: '18px', fontWeight: 700, color: '#fff', margin: '0 0 16px' },
  table: {
    background: 'linear-gradient(135deg, rgba(13,27,62,0.9), rgba(10,10,26,0.9))',
    border: '1px solid rgba(99,179,237,0.15)', borderRadius: '14px', overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 0.8fr',
    padding: '14px 20px', background: 'rgba(99,179,237,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.5px',
  },
  tableRow: {
    display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr 0.8fr',
    padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
    color: 'rgba(255,255,255,0.7)', fontSize: '13px', alignItems: 'center',
    transition: 'background 0.15s',
  },
  refCode: { color: '#63b3ed', fontFamily: 'monospace', fontWeight: 700, fontSize: '12px' },
  statusSelect: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px', padding: '4px 8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', outline: 'none',
  },
  deleteBtn: {
    background: 'rgba(252,129,74,0.1)', border: '1px solid rgba(252,129,74,0.25)',
    color: '#fc8181', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px',
  },
  modal: {
    background: 'linear-gradient(135deg, #0d1b3e, #0a0a1a)',
    border: '1px solid rgba(99,179,237,0.25)', borderRadius: '18px',
    width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'auto',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  modalTitle: { color: '#fff', fontSize: '18px', fontWeight: 700, margin: 0 },
  closeBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '22px', cursor: 'pointer' },
  modalForm: { padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' },
  mRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' },
  mField: { display: 'flex', flexDirection: 'column', gap: '6px' },
  mLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' },
  mInput: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', padding: '10px 12px', color: '#fff', fontSize: '14px', outline: 'none',
    width: '100%', boxSizing: 'border-box',
  },
  modalFooter: {
    padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', gap: '12px', justifyContent: 'flex-end',
  },
  cancelBtn: {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.7)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px',
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', border: 'none',
    color: '#fff', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 700,
  },
};

export default AdminDashboard;