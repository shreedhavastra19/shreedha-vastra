import api from './api';

const orderService = {
  createOrder: (data) => api.post('/orders', data).then((res) => res.data),
  getMyOrders: () => api.get('/orders/my-orders').then((res) => res.data),
  getOrderById: (id) => api.get(`/orders/${id}`).then((res) => res.data),
  payOrder: (id, paymentResult) => api.put(`/orders/${id}/pay`, { paymentResult }).then((res) => res.data),
  // Admin
  getAllOrders: (params) => api.get('/orders', { params }).then((res) => res.data),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data).then((res) => res.data),
};

export default orderService;
