import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ─── Flights ─────────────────────────────────────────────────────────────────
export const flightAPI = {
  search: (params) => api.get('/flights/search', { params }),
  getById: (id)   => api.get(`/flights/${id}`),
  getAll:  ()     => api.get('/flights'),
  create:  (data) => api.post('/flights', data),
  update:  (id, data) => api.put(`/flights/${id}`, data),
  updateStatus: (id, status) => api.patch(`/flights/${id}/status`, null, { params: { status } }),
  delete:  (id)   => api.delete(`/flights/${id}`),
};

// ─── Bookings ─────────────────────────────────────────────────────────────────
export const bookingAPI = {
  create:        (data)   => api.post('/bookings', data),
  getById:       (id)     => api.get(`/bookings/${id}`),
  getByRef:      (ref)    => api.get(`/bookings/reference/${ref}`),
  getMyBookings: ()       => api.get('/bookings/my-bookings'),
  getAll:        ()       => api.get('/bookings'),
  cancel:        (id)     => api.post(`/bookings/${id}/cancel`),
  updatePayment: (id, status) => api.patch(`/bookings/${id}/payment`, null, { params: { status } }),
};

export default api;