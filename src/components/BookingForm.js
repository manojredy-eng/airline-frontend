import React, { useState } from 'react';

const PassengerForm = ({ index, passenger, onChange }) => {
  const field = (name, value) => onChange(index, name, value);

  return (
    <div style={styles.passengerBlock}>
      <div style={styles.passengerHeader}>
        <span style={styles.passengerNum}>Passenger {index + 1}</span>
        <span style={styles.passengerType}>Adult</span>
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>First Name *</label>
          <input
            style={styles.input}
            placeholder="John"
            value={passenger.firstName}
            onChange={e => field('firstName', e.target.value)}
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Last Name *</label>
          <input
            style={styles.input}
            placeholder="Doe"
            value={passenger.lastName}
            onChange={e => field('lastName', e.target.value)}
            required
          />
        </div>
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Passport Number *</label>
          <input
            style={styles.input}
            placeholder="A12345678"
            value={passenger.passportNumber}
            onChange={e => field('passportNumber', e.target.value)}
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Date of Birth</label>
          <input
            type="date"
            style={styles.input}
            value={passenger.dateOfBirth}
            onChange={e => field('dateOfBirth', e.target.value)}
          />
        </div>
      </div>
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Nationality</label>
          <input
            style={styles.input}
            placeholder="e.g. American"
            value={passenger.nationality}
            onChange={e => field('nationality', e.target.value)}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Meal Preference</label>
          <select
            style={styles.input}
            value={passenger.mealPreference}
            onChange={e => field('mealPreference', e.target.value)}
          >
            <option value="STANDARD">Standard</option>
            <option value="VEGETARIAN">Vegetarian</option>
            <option value="VEGAN">Vegan</option>
            <option value="HALAL">Halal</option>
            <option value="KOSHER">Kosher</option>
            <option value="GLUTEN_FREE">Gluten-Free</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const BookingForm = ({ flight, onSubmit, loading }) => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengers, setPassengers] = useState([emptyPassenger()]);

  function emptyPassenger() {
    return { firstName: '', lastName: '', passportNumber: '', dateOfBirth: '', nationality: '', mealPreference: 'STANDARD' };
  }

  const handleCountChange = (count) => {
    const n = parseInt(count);
    setPassengerCount(n);
    setPassengers(prev => {
      const updated = [...prev];
      while (updated.length < n) updated.push(emptyPassenger());
      return updated.slice(0, n);
    });
  };

  const handlePassengerChange = (idx, name, value) => {
    setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, [name]: value } : p));
  };

  const total = flight ? (parseFloat(flight.price) * passengerCount).toFixed(2) : '0.00';

  return (
    <div style={styles.form}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Number of Passengers</h3>
        <div style={styles.countSelector}>
          {[1, 2, 3, 4, 5, 6].map(n => (
            <button
              key={n}
              style={{ ...styles.countBtn, ...(passengerCount === n ? styles.countBtnActive : {}) }}
              onClick={() => handleCountChange(n)}
              type="button"
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Passenger Details</h3>
        {passengers.map((p, i) => (
          <PassengerForm key={i} index={i} passenger={p} onChange={handlePassengerChange} />
        ))}
      </div>

      <div style={styles.summary}>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Price per person</span>
          <span style={styles.summaryValue}>${parseFloat(flight?.price || 0).toFixed(2)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Passengers</span>
          <span style={styles.summaryValue}>{passengerCount}</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryRow}>
          <span style={styles.totalLabel}>Total Amount</span>
          <span style={styles.totalValue}>${total}</span>
        </div>
      </div>

      <button
        style={styles.submitBtn}
        onClick={() => onSubmit(passengers)}
        disabled={loading}
        type="button"
      >
        {loading ? '⏳ Processing...' : `🎫 Confirm Booking — $${total}`}
      </button>
    </div>
  );
};

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '28px' },
  section: {},
  sectionTitle: {
    fontSize: '16px', fontWeight: 700, color: '#fff',
    marginBottom: '16px', paddingBottom: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  countSelector: { display: 'flex', gap: '8px' },
  countBtn: {
    width: '44px', height: '44px', borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.6)',
    cursor: 'pointer', fontSize: '15px', fontWeight: 600,
    transition: 'all 0.2s',
  },
  countBtnActive: {
    background: 'rgba(99,179,237,0.2)',
    border: '1px solid rgba(99,179,237,0.5)',
    color: '#63b3ed',
  },
  passengerBlock: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    display: 'flex', flexDirection: 'column', gap: '16px',
  },
  passengerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  passengerNum: { color: '#63b3ed', fontSize: '14px', fontWeight: 700 },
  passengerType: {
    background: 'rgba(159,122,234,0.15)',
    border: '1px solid rgba(159,122,234,0.3)',
    color: '#b794f4',
    fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' },
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  summary: {
    background: 'rgba(99,179,237,0.06)',
    border: '1px solid rgba(99,179,237,0.2)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '10px',
  },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '14px' },
  summaryValue: { color: '#fff', fontSize: '14px', fontWeight: 600 },
  summaryDivider: { height: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' },
  totalLabel: { color: '#fff', fontSize: '16px', fontWeight: 700 },
  totalValue: { color: '#63b3ed', fontSize: '22px', fontWeight: 800 },
  submitBtn: {
    background: 'linear-gradient(135deg, #3182ce, #63b3ed)',
    border: 'none',
    color: '#fff',
    padding: '16px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 700,
    transition: 'opacity 0.2s',
    width: '100%',
  },
};

export default BookingForm;