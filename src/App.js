import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchFlights from './pages/SearchFlights';
import BookTicket from './pages/BookTicket';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route wrapper
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) return <Navigate to="/login" replace />;
  if (requireAdmin && user.role !== 'ADMIN') return <Navigate to="/search" replace />;
  return children;
};

// Layout with Navbar
const WithNav = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: '100vh', background: '#060612' }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected user routes */}
          <Route path="/search" element={
            <ProtectedRoute>
              <WithNav><SearchFlights /></WithNav>
            </ProtectedRoute>
          } />
          <Route path="/book/:flightId" element={
            <ProtectedRoute>
              <WithNav><BookTicket /></WithNav>
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <WithNav><MyBookings /></WithNav>
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin>
              <WithNav><AdminDashboard /></WithNav>
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/search" replace />} />
          <Route path="*" element={<Navigate to="/search" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;