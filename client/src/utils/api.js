import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Har request ke saath token attach karo
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Events
export const getAllEvents = (params) => API.get('/events', { params });
export const getEventById = (id) => API.get(`/events/${id}`);

// Bookings
export const createBooking = (data) => API.post('/bookings', data);
export const getUserBookings = () => API.get('/bookings/my-bookings');
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);

// Profile
export const getUserProfile = () => API.get('/auth/profile');
export const updateUserProfile = (data) => API.put('/auth/profile', data);

export default API;