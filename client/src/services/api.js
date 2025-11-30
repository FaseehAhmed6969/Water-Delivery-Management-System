import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});


// Add token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

// Auth APIs
export const register = (userData) => API.post('/auth/register', userData);
export const login = (userData) => API.post('/auth/login', userData);
export const getUser = () => API.get('/auth/user');

// Order APIs
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrderById = (id) => API.get(`/orders/${id}`);
export const cancelOrder = (id, reason) => API.put(`/orders/${id}/cancel`, reason);

// User APIs
export const updateProfile = (data) => API.put('/users/profile', data);
export const getLoyaltyPoints = () => API.get('/users/loyalty-points');
export const redeemPoints = (points) => API.post('/users/redeem-points', points);

// Admin APIs
export const getAllOrders = (params) => API.get('/admin/orders', { params });
export const assignOrder = (orderId, workerId) => API.put(`/admin/orders/${orderId}/assign`, { workerId });
export const deleteOrder = (orderId) => API.delete(`/admin/orders/${orderId}`);
export const getDashboard = () => API.get('/admin/dashboard');
export const getAllCustomers = () => API.get('/admin/customers');
export const createPromoCode = (data) => API.post('/admin/promo-codes', data);
export const getAllPromoCodes = () => API.get('/admin/promo-codes');

// Worker APIs
export const getMyAssignedOrders = () => API.get('/workers/my-orders');
export const getTodayOrders = () => API.get('/workers/today-orders');
export const updateOrderStatus = (orderId, status) => API.put(`/workers/orders/${orderId}/status`, { status });
export const getWorkerStats = () => API.get('/workers/stats');

// Rating APIs
export const submitRating = (data) => API.post('/ratings', data);

// Notification APIs
export const getNotifications = () => API.get('/notifications');
export const markAsRead = (id) => API.put(`/notifications/${id}/read`);

export default API;
