import React, { useState } from 'react';
import { flightAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SearchFlights = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ origin: '', destination: '', date: '' });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await flightAPI.search(search);
      setFlights(data);
    } catch (err) {
      alert('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Search Flights</h1>
        <p style={styles.subtitle}>Find your perfect flight</p>
      </div>

      <form onSubmit={handleSearch} style={styles.form}>
        <div style={styles.row}>
          <input
            style={styles.input}
            placeholder="Origin"
            value={search.origin}
            onChange={(e) => setSearch({ ...search, origin: e.target.value })}
            required
          />
          <input
            style={styles.input}
            placeholder="Destination"
            value={search.destination}
            onChange={(e) => setSearch({ ...search, destination: e.target.value })}
            required
          />
          <input
            type="date"
            style={styles.input}
            value={search.date}
            onChange={(e) => setSearch({ ...search, date: e.target.value })}
            required
          />
        </div>
        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      <div style={styles.results}>
        {flights.map(flight => (
          <div key={flight.id} style={styles.flight}>
            <div style={styles.flightInfo}>
              <div style={styles.route}>{flight.origin} → {flight.destination}</div>
              <div style={styles.details}>{flight.flightNumber} • {flight.airline}</div>
              <div style={styles.time}>{flight.departureTime} - {flight.arrivalTime}</div>
            </div>
            <div style={styles.price}>${flight.price}</div>
            <button style={styles.bookBtn} onClick={() => navigate(`/book/${flight.id}`)}>
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: 800, color: '#fff', margin: '0 0 8px' },
  subtitle: { color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: 0 },
  form: { background: 'rgba(13,27,62,0.9)', border: '1px solid rgba(99,179,237,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '32px' },
  row: { display: 'flex', gap: '16px', marginBottom: '20px' },
  input: { flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '12px 16px', color: '#fff', outline: 'none' },
  btn: { background: 'linear-gradient(135deg, #2b6cb0, #3182ce)', border: 'none', color: '#fff', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 600 },
  results: { display: 'grid', gap: '16px' },
  flight: { background: 'rgba(13,27,62,0.9)', border: '1px solid rgba(99,179,237,0.2)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  flightInfo: { flex: 1 },
  route: { fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' },
  details: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '4px' },
  time: { color: 'rgba(255,255,255,0.5)', fontSize: '13px' },
  price: { fontSize: '20px', fontWeight: 800, color: '#63b3ed' },
  bookBtn: { background: '#68d391', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 },
};

export default SearchFlights;
