import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Club API
export const clubAPI = {
  getAll: (params) => api.get('/clubs', { params }),
  getFeatured: () => api.get('/clubs/featured'),
  getById: (id) => api.get(`/clubs/${id}`),
  create: (data) => api.post('/clubs', data),
  update: (id, data) => api.put(`/clubs/${id}`, data),
  getMyClubs: () => api.get('/clubs/manager/my-clubs'),
  getAllForAdmin: (params) => api.get('/clubs/admin/all', { params }),
  updateStatus: (id, status) => api.patch(`/clubs/${id}/status`, { status }),
};

// Event API
export const eventAPI = {
  getAll: (params) => api.get('/events', { params }),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get('/events/manager/my-events'),
};

// Membership API
export const membershipAPI = {
  join: (clubId, data) => api.post(`/memberships/join/${clubId}`, data),
  getMyMemberships: () => api.get('/memberships/my-memberships'),
  getClubMembers: (clubId) => api.get(`/memberships/club/${clubId}`),
};

// Payment API
export const paymentAPI = {
  createMembershipPayment: (data) => api.post('/payments/create-membership-payment', data),
  createEventPayment: (data) => api.post('/payments/create-event-payment', data),
  confirmPayment: (data) => api.post('/payments/confirm-payment', data),
  getMyPayments: () => api.get('/payments/my-payments'),
  getAllPayments: () => api.get('/payments/admin/all'),
};

// User API
export const userAPI = {
  getAll: () => api.get('/users'),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export default api;