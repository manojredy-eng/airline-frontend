import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flightAPI, bookingAPI } from '../services/api';

const BookTicket = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'MALE' }]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    flightAPI.getById(flightId)
      .then(({ data }) => setFlight(data))
      .finally(() => setLoading(false));
  }, [flightId]);

  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: '', gender: 'MALE' }]);
  };

  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const bookingData = {
        flightId: parseInt(flightId),
        passengers: passengers.map(p => ({ ...p, age: parseInt(p.age) })),
      };
      await bookingAPI.create(bookingData);
      navigate('/my-bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading flight details...</div>;

  if (!flight) return <div style={styles.error}>Flight not found</div>;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Book Your Flight</h1>
        <p style={styles.subtitle}>Complete your booking details</p>
      </div>

      <div style={styles.flightCard}>
        <div style={styles.flightInfo}>
          <div style={styles.route}>{flight.origin} → {flight.destination}</div>
          <div style={styles.details}>{flight.flightNumber} • {flight.airline}</div>
          <div style={styles.time}>{flight.departureTime} - {flight.arrivalTime}</div>
        </div>
        <div style={styles.price}>${flight.price}</div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.sectionTitle}>Passenger Details</h3>

        {passengers.map((passenger, index) => (
          <div key={index} style={styles.passenger}>
            <h4 style={styles.passengerTitle}>Passenger {index + 1}</h4>
            <div style={styles.row}>
              <input
                style={styles.input}
                placeholder="Full Name"
                value={passenger.name}
                onChange={(e) => updatePassenger(index, 'name', e.target.value)}
                required
              />
              <input
                type="number"
                style={styles.input}
                placeholder="Age"
                value={passenger.age}
                onChange={(e) => updatePassenger(index, 'age', e.target.value)}
                required
              />
              <select
                style={styles.input}
                value={passenger.gender}
                onChange={(e) => updatePassenger(index, 'gender', e.target.value)}
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        ))}

        <button type="button" style={styles.addBtn} onClick={addPassenger}>
          + Add Passenger
        </button>

        <button type="submit" style={styles.btn} disabled={bookingLoading}>
          {bookingLoading ? 'Booking...' : `Book for $${flight.price * passengers.length}`}
        </button>
      </form>
    </div>
  );
};

const styles = {
  page: { padding: '24px', maxWidth: '800px', margin: '0 auto' },
  header: { marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: 800, color: '#fff', margin: '0 0 8px' },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: 0 },
  loading: { color: '#fff', textAlign: 'center', padding: '50px' },
  error: { color: '#fc8181', textAlign: 'center', padding: '50px' },
  flightCard: { background: 'rgba(13,27,62,0.9)', border: '1px solid rgba(99,179,237,0.2)', borderRadius: '12px', padding: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  flightInfo: {},
  route: { fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' },
  details: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' },
  time: { color: 'rgba(255,255,255,0.5)', fontSize: '13px' },
  price: { fontSize: '24px', fontWeight: 800, color: '#63b3ed' },
  form: { background: 'rgba(13,27,62,0.9)', border: '1px solid rgba(99,179,237,0.2)', borderRadius: '16px', padding: '24px' },
  sectionTitle: { color: '#fff', fontSize: '20px', marginBottom: '20px' },
  passenger: { marginBottom: '24px' },
  passengerTitle: { color: '#fff', fontSize: '16px', marginBottom: '12px' },
  row: { display: 'flex', gap: '12px', marginBottom: '12px' },
  input: { flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px 16px', color: '#fff', outline: 'none' },
  addBtn: { background: 'rgba(99,179,237,0.2)', border: '1px solid rgba(99,179,237,0.4)', color: '#63b3ed', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' },
  btn: { background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', border: 'none', color: '#fff', padding: '15px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600, width: '100%' },
};

export default BookTicket;
