import React from 'react';
import { useNavigate } from 'react-router-dom';

const FlightCard = ({ flight }) => {
  const navigate = useNavigate();

  const formatTime = (dt) => {
    const d = new Date(dt);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (dt) => {
    return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDuration = (dep, arr) => {
    const diff = new Date(arr) - new Date(dep);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  };

  const statusColors = {
    SCHEDULED: { bg: 'rgba(72,187,120,0.15)', color: '#68d391', border: 'rgba(72,187,120,0.3)' },
    DELAYED:   { bg: 'rgba(246,173,85,0.15)',  color: '#f6ad55', border: 'rgba(246,173,85,0.3)' },
    CANCELLED: { bg: 'rgba(252,129,74,0.15)',  color: '#fc8181', border: 'rgba(252,129,74,0.3)' },
    BOARDING:  { bg: 'rgba(99,179,237,0.15)',  color: '#63b3ed', border: 'rgba(99,179,237,0.3)' },
    COMPLETED: { bg: 'rgba(159,122,234,0.15)', color: '#b794f4', border: 'rgba(159,122,234,0.3)' },
  };

  const sc = statusColors[flight.status] || statusColors.SCHEDULED;

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.airline}>
          <div style={styles.airlineIcon}>✈</div>
          <div>
            <div style={styles.airlineName}>{flight.airline}</div>
            <div style={styles.flightNum}>{flight.flightNumber}</div>
          </div>
        </div>
        <div style={styles.badges}>
          <span style={{ ...styles.badge, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
            {flight.status}
          </span>
          <span style={styles.classBadge}>{flight.flightClass}</span>
        </div>
      </div>

      {/* Route */}
      <div style={styles.route}>
        <div style={styles.endpoint}>
          <div style={styles.time}>{formatTime(flight.departureTime)}</div>
          <div style={styles.code}>{flight.originCode}</div>
          <div style={styles.city}>{flight.origin}</div>
          <div style={styles.date}>{formatDate(flight.departureTime)}</div>
        </div>

        <div style={styles.flightPath}>
          <div style={styles.duration}>{getDuration(flight.departureTime, flight.arrivalTime)}</div>
          <div style={styles.line}>
            <div style={styles.dot} />
            <div style={styles.dashes} />
            <div style={styles.planeIcon}>✈</div>
            <div style={styles.dashes} />
            <div style={styles.dot} />
          </div>
          <div style={styles.direct}>Non-stop</div>
        </div>

        <div style={{ ...styles.endpoint, textAlign: 'right' }}>
          <div style={styles.time}>{formatTime(flight.arrivalTime)}</div>
          <div style={styles.code}>{flight.destinationCode}</div>
          <div style={styles.city}>{flight.destination}</div>
          <div style={styles.date}>{formatDate(flight.arrivalTime)}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.seatsInfo}>
          <span style={styles.seatsIcon}>💺</span>
          <span style={styles.seatsText}>{flight.availableSeats} seats left</span>
          {flight.availableSeats < 10 && (
            <span style={styles.urgency}>Almost full!</span>
          )}
        </div>
        <div style={styles.priceArea}>
          <div style={styles.priceLabel}>from</div>
          <div style={styles.price}>${parseFloat(flight.price).toFixed(2)}</div>
          <button
            style={styles.bookBtn}
            onClick={() => navigate(`/book/${flight.id}`)}
            disabled={flight.status === 'CANCELLED' || flight.availableSeats === 0}
          >
            Select →
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: 'linear-gradient(135deg, rgba(13,27,62,0.95) 0%, rgba(10,10,26,0.95) 100%)',
    border: '1px solid rgba(99,179,237,0.2)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'default',
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  airline: { display: 'flex', alignItems: 'center', gap: '12px' },
  airlineIcon: {
    width: '40px', height: '40px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #3182ce22, #3182ce44)',
    border: '1px solid rgba(99,179,237,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', color: '#63b3ed',
  },
  airlineName: { color: '#fff', fontSize: '15px', fontWeight: 700 },
  flightNum: { color: '#63b3ed', fontSize: '12px', marginTop: '2px', letterSpacing: '1px' },
  badges: { display: 'flex', gap: '8px', alignItems: 'center' },
  badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' },
  classBadge: {
    background: 'rgba(159,122,234,0.15)',
    border: '1px solid rgba(159,122,234,0.3)',
    color: '#b794f4',
    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
  },
  route: { display: 'flex', alignItems: 'center', gap: '16px' },
  endpoint: { flex: '0 0 auto', minWidth: '90px' },
  time: { fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' },
  code: { fontSize: '13px', fontWeight: 700, color: '#63b3ed', letterSpacing: '2px', marginTop: '2px' },
  city: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' },
  date: { fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' },
  flightPath: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' },
  duration: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 500 },
  line: { width: '100%', display: 'flex', alignItems: 'center', gap: '4px' },
  dot: { width: '6px', height: '6px', borderRadius: '50%', background: '#63b3ed', flexShrink: 0 },
  dashes: { flex: 1, height: '1px', background: 'linear-gradient(90deg, #63b3ed33, #63b3ed66, #63b3ed33)' },
  planeIcon: { fontSize: '14px', color: '#63b3ed', transform: 'rotate(90deg)' },
  direct: { fontSize: '11px', color: 'rgba(255,255,255,0.4)' },
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.07)',
  },
  seatsInfo: { display: 'flex', alignItems: 'center', gap: '6px' },
  seatsIcon: { fontSize: '14px' },
  seatsText: { color: 'rgba(255,255,255,0.5)', fontSize: '13px' },
  urgency: {
    background: 'rgba(252,129,74,0.2)', border: '1px solid rgba(252,129,74,0.4)',
    color: '#fc8181', fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
  },
  priceArea: { display: 'flex', alignItems: 'center', gap: '12px' },
  priceLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '12px' },
  price: { fontSize: '26px', fontWeight: 800, color: '#fff' },
  bookBtn: {
    background: 'linear-gradient(135deg, #3182ce, #63b3ed)',
    border: 'none',
    color: '#fff',
    padding: '10px 22px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 700,
    transition: 'opacity 0.2s',
  },
};

export default FlightCard;